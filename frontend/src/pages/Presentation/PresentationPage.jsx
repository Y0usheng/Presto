// src/pages/Presentation/PresentationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePresentation } from '../../hooks/usePresentation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import html2canvas from 'html2canvas';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  EditorWrapper, TopBar, TitleInput, ActionButton, Workspace,
  Sidebar, ToolButton, CanvasArea, SlideCanvas, BottomNav,
  NavText, ControlIconBtn
} from './PresentationPage.styles';

import TextModal from './components/TextModal';
import ImageModal from './components/ImageModal';
import VideoModal from './components/VideoModal';
import CodeModal from './components/CodeModal';
import BackgroundModal from './components/BackgroundModal';

import DraggableElement from './components/DraggableElement';

function PresentationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. 数据逻辑 Hook（完美接管了所有的 fetch 和 state 更新）
  const {
    slides, currentSlideIndex, title, thumbnail, loading,
    handleTitleChange, addSlide, deleteSlide, nextSlide, prevSlide,
    saveSlides, undo, redo, canUndo, canRedo, updateStoreWithSlides
  } = usePresentation(id);

  const [localTitle, setLocalTitle] = useState('');
  useEffect(() => {
    if (title) setLocalTitle(title);
  }, [title]);

  const [activeElementIndex, setActiveElementIndex] = useState(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isModifier = e.ctrlKey || e.metaKey;

      if (isModifier && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo(); // Ctrl + Shift + Z -> 重做
        } else {
          undo(); // Ctrl + Z -> 撤销
        }
      } else if (isModifier && e.key === 'y') {
        e.preventDefault();
        redo();   // Ctrl + Y -> 重做
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // 2. 五大 Modal 的开关与数据状态管理
  const [textModalConfig, setTextModalConfig] = useState({ isOpen: false, initialData: null, editIndex: null });
  const [imageModalConfig, setImageModalConfig] = useState({ isOpen: false, initialData: null, editIndex: null });
  const [videoModalConfig, setVideoModalConfig] = useState({ isOpen: false, initialData: null, editIndex: null });
  const [codeModalConfig, setCodeModalConfig] = useState({ isOpen: false, initialData: null, editIndex: null });
  const [bgModalOpen, setBgModalOpen] = useState(false);

  // 3. 通用的元素保存处理函数 (完美复用，替代了以前冗长的各类 handleAddXXX)
  const handleSaveElement = async (modalConfig, elementData) => {
    const isEditing = modalConfig.editIndex !== null;
    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;

      const newElements = [...(slide.elements || [])];
      if (isEditing) {
        newElements[modalConfig.editIndex] = { ...newElements[modalConfig.editIndex], ...elementData };
      } else {
        const uniqueId = `el_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        newElements.push({ ...elementData, id: uniqueId, layer: newElements.length });
      }
      return { ...slide, elements: newElements };
    });

    saveSlides(updatedSlides);
  };

  const handleManualSave = async () => {
    const canvasEl = document.getElementById('slide-canvas-container');
    let newThumbnail = thumbnail; // 默认保留原有的封面 (可能是个 url，也可能是空的)

    if (canvasEl) {
      try {
        // 1. 依然在前端截图生成 Base64
        const canvas = await html2canvas(canvasEl, { scale: 0.5, useCORS: true, allowTaint: false });
        const base64 = canvas.toDataURL('image/jpeg', 0.6);

        // 2. 发送给后端的 /upload-thumbnail 接口 (请根据你 utils/api.js 的实际封装调整 fetch 的 URL)
        // 这里假设你的后端跑在和之前一样的 API 地址上
        const response = await fetch('http://localhost:5005/upload-thumbnail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // 如果你的后端需要鉴权
          },
          body: JSON.stringify({ base64Image: base64 })
        });

        if (response.ok) {
          const data = await response.json();
          newThumbnail = data.url; // 拿到了干净、轻量级的 Vercel Blob URL！
        }
      } catch (err) {
        console.error("Failed to capture and upload thumbnail", err);
      }
    }

    // 3. 把这个极短的 URL 连同 PPT 数据一起存入原来的 KV 数据库
    await updateStoreWithSlides(slides, localTitle, newThumbnail);
    alert('All changes & thumbnail saved successfully!');
  };

  // 专属的背景保存函数
  const handleSaveBackground = async (newBackground) => {
    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;
      return { ...slide, background: newBackground };
    });

    saveSlides(updatedSlides);
  };

  // 处理元素拖拽结束后的位置保存
  const handleDragEnd = async (elementIndex, newPosition) => {
    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;

      const newElements = [...(slide.elements || [])];
      // 更新拖拽后的新坐标
      newElements[elementIndex] = { ...newElements[elementIndex], position: newPosition };

      return { ...slide, elements: newElements };
    });

    saveSlides(updatedSlides);
  };

  const handleDeleteElement = async (elementIndex) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this element?");
    if (!confirmDelete) return;

    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;

      // 过滤掉被删掉的那个元素
      const newElements = slide.elements.filter((_, i) => i !== elementIndex);
      return { ...slide, elements: newElements };
    });

    saveSlides(updatedSlides);
  };

  const handleResizeEnd = async (elementIndex, newWidth) => {
    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;

      const newElements = [...(slide.elements || [])];
      newElements[elementIndex] = { ...newElements[elementIndex], size: newWidth };

      return { ...slide, elements: newElements };
    });

    saveSlides(updatedSlides);
  };

  // Element Layer Control (Bring to Front / Send to Back)
  const handleLayerChange = async (elementIndex, action) => {
    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;

      const newElements = [...(slide.elements || [])];
      //
      const allLayers = newElements.map((el, i) => el.layer !== undefined ? el.layer : i);

      if (action === 'front') {
        const maxLayer = Math.max(...allLayers, 0);
        newElements[elementIndex] = { ...newElements[elementIndex], layer: maxLayer + 1 };
      } else if (action === 'back') {
        const minLayer = Math.min(...allLayers, 0);
        newElements[elementIndex] = { ...newElements[elementIndex], layer: minLayer - 1 };
      }

      return { ...slide, elements: newElements };
    });

    saveSlides(updatedSlides);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Editor...</div>;

  return (
    <EditorWrapper>
      {/* 顶部导航栏 */}
      <TopBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ActionButton onClick={() => navigate('/dashboard')}>Home</ActionButton>
          {/* 撤销与重做按钮 */}
          <ActionButton onClick={undo} disabled={!canUndo} style={{ opacity: canUndo ? 1 : 0.5 }}>
            ↩️ Undo
          </ActionButton>
          <ActionButton onClick={redo} disabled={!canRedo} style={{ opacity: canRedo ? 1 : 0.5 }}>
            ↪️ Redo
          </ActionButton>
        </div>

        <TitleInput
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onBlur={() => handleTitleChange(localTitle)}
          placeholder="Enter presentation title"
        />

        <div>
          <ActionButton onClick={() => navigate(`/preview/${id}`)}>Preview ▶</ActionButton>
          {/* 这里触发一下 state 刷新或加个提示即可，因为每次修改已经通过 hook 自动 save 了 */}
          <ActionButton $primary onClick={handleManualSave}>Save</ActionButton>
        </div>
      </TopBar>

      {/* 核心工作区 */}
      <Workspace>

        {/* 左侧 Canva 风格工具栏 */}
        <Sidebar>
          <ToolButton onClick={() => setTextModalConfig({ isOpen: true, initialData: null, editIndex: null })}>
            <strong style={{ fontSize: '20px' }}>T</strong>
            <span>Text</span>
          </ToolButton>
          <ToolButton onClick={() => setImageModalConfig({ isOpen: true, initialData: null, editIndex: null })}>
            <strong style={{ fontSize: '18px' }}>🖼️</strong>
            <span>Image</span>
          </ToolButton>
          <ToolButton onClick={() => setVideoModalConfig({ isOpen: true, initialData: null, editIndex: null })}>
            <strong style={{ fontSize: '18px' }}>▶️</strong>
            <span>Video</span>
          </ToolButton>
          <ToolButton onClick={() => setCodeModalConfig({ isOpen: true, initialData: null, editIndex: null })}>
            <strong style={{ fontSize: '18px' }}>{'</>'}</strong>
            <span>Code</span>
          </ToolButton>
          <ToolButton onClick={() => setBgModalOpen(true)}>
            <strong style={{ fontSize: '18px' }}>🎨</strong>
            <span>Bg</span>
          </ToolButton>
        </Sidebar>

        {/* 中央 16:9 画布区 */}
        <CanvasArea>
          <SlideCanvas
            id="slide-canvas-container"
            $bg={slides[currentSlideIndex]?.background || '#ffffff'}
            onPointerDown={() => setActiveElementIndex(null)}
          >

            {/* 动态渲染幻灯片元素 (支持绝对定位和双击编辑) */}
            {slides[currentSlideIndex]?.elements?.map((element, index) => {

              // 1. 文本节点
              if (element.type === 'text') {
                return (
                  <DraggableElement
                    key={element.id || index}
                    isActive={activeElementIndex === index}
                    onSelect={() => setActiveElementIndex(index)}
                    onBringToFront={() => handleLayerChange(index, 'front')}
                    onSendToBack={() => handleLayerChange(index, 'back')}
                    initialPosition={element.position}
                    initialWidth={element.size}
                    zIndex={element.layer || index}
                    onDragEnd={(newPos) => handleDragEnd(index, newPos)}
                    onResizeEnd={(newWidth) => handleResizeEnd(index, newWidth)}
                    onDelete={() => handleDeleteElement(index)}
                    onDoubleClick={() => setTextModalConfig({ isOpen: true, initialData: element, editIndex: index })}
                  >
                    <div
                      style={{
                        fontSize: `${element.fontSize * 2}cqw`,
                        color: element.color,
                        fontFamily: element.fontFamily,
                        fontWeight: element.isBold ? 'bold' : 'normal',
                        fontStyle: element.isItalic ? 'italic' : 'normal',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.2',
                        pointerEvents: 'none', // 让底层的 DraggableElement 捕获鼠标拖拽事件
                      }}
                    >
                      {element.text}
                    </div>
                  </DraggableElement>
                );
              }

              // 2. 图片节点
              if (element.type === 'image') {
                return (
                  <DraggableElement
                    key={element.id || index}
                    isActive={activeElementIndex === index}
                    onSelect={() => setActiveElementIndex(index)}
                    onBringToFront={() => handleLayerChange(index, 'front')}
                    onSendToBack={() => handleLayerChange(index, 'back')}
                    initialPosition={element.position}
                    initialWidth={element.size}
                    zIndex={element.layer || index}
                    onDragEnd={(newPos) => handleDragEnd(index, newPos)}
                    onResizeEnd={(newWidth) => handleResizeEnd(index, newWidth)}
                    onDelete={() => handleDeleteElement(index)}
                    onDoubleClick={() => setImageModalConfig({ isOpen: true, initialData: element, editIndex: index })}
                  >
                    <img
                      src={element.source}
                      alt={element.alt || 'slide-img'}
                      style={{
                        width: '100%',     // 占满拖拽容器
                        height: 'auto',    // 保持比例
                        display: 'block',
                        pointerEvents: 'none' // 防原生的图片拖拽冲突
                      }}
                    />
                  </DraggableElement>
                );
              }

              // 3. 视频节点
              if (element.type === 'video') {
                return (
                  <DraggableElement
                    key={element.id || index}
                    isActive={activeElementIndex === index}
                    onSelect={() => setActiveElementIndex(index)}
                    onBringToFront={() => handleLayerChange(index, 'front')}
                    onSendToBack={() => handleLayerChange(index, 'back')}
                    initialPosition={element.position}
                    initialWidth={element.size}
                    zIndex={element.layer || index}
                    onDragEnd={(newPos) => handleDragEnd(index, newPos)}
                    onResizeEnd={(newWidth) => handleResizeEnd(index, newWidth)}
                    onDelete={() => handleDeleteElement(index)}
                  >
                    <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '35px',
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                          zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
                          paddingTop: '6px', opacity: 0, transition: 'opacity 0.2s',
                          cursor: 'grab', color: '#fff', fontSize: '12px', fontWeight: 'bold'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        onDoubleClick={() => setVideoModalConfig({ isOpen: true, initialData: element, editIndex: index })}
                        title="Drag me, or Double-click to edit"
                      >
                        <span style={{ background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '12px', pointerEvents: 'none' }}>
                          ✋ Drag / Double-click to Edit
                        </span>
                      </div>

                      {/* 视频本体：恢复 pointerEvents 为 auto，允许用户点击播放！ */}
                      <iframe
                        src={element.source}
                        width="100%"
                        height="100%"
                        style={{ border: 'none', pointerEvents: 'auto', zIndex: 1, position: 'relative' }}
                        title="slide-video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </DraggableElement>
                );
              }

              // 4. 代码节点
              if (element.type === 'code') {
                return (
                  <DraggableElement
                    key={element.id || index}
                    isActive={activeElementIndex === index}
                    onSelect={() => setActiveElementIndex(index)}
                    onBringToFront={() => handleLayerChange(index, 'front')}
                    onSendToBack={() => handleLayerChange(index, 'back')}
                    initialPosition={element.position}
                    initialWidth={element.size}
                    zIndex={element.layer || index}
                    onDragEnd={(newPos) => handleDragEnd(index, newPos)}
                    onResizeEnd={(newWidth) => handleResizeEnd(index, newWidth)}
                    onDelete={() => handleDeleteElement(index)}
                    onDoubleClick={() => setCodeModalConfig({ isOpen: true, initialData: element, editIndex: index })}
                  >
                    {/* 阻断鼠标事件，让 Draggable 接管拖拽，同时渲染超美的代码块 */}
                    <div style={{ pointerEvents: 'none', width: '100%' }}>
                      <SyntaxHighlighter
                        language={element.language || 'javascript'}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1.5cqw',
                          borderRadius: '0.8cqw',
                          fontSize: `${element.fontSize * 1.5}cqw`,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      >
                        {element.code}
                      </SyntaxHighlighter>
                    </div>
                  </DraggableElement>
                );
              }

              return null;
            })}

          </SlideCanvas>
        </CanvasArea>

      </Workspace>

      {/* 底部导航栏 */}
      <BottomNav>
        <ControlIconBtn onClick={addSlide} title="Add New Slide">➕ Add Slide</ControlIconBtn>
        <ControlIconBtn onClick={deleteSlide} title="Delete Slide" style={{ color: '#d32f2f' }}>🗑️ Delete</ControlIconBtn>

        <div style={{ width: '1px', height: '24px', background: '#e2e6ea', margin: '0 15px' }} />

        <ControlIconBtn onClick={prevSlide} disabled={currentSlideIndex === 0}>◀</ControlIconBtn>
        <NavText>Slide {currentSlideIndex + 1} of {slides.length}</NavText>
        <ControlIconBtn onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1}>▶</ControlIconBtn>
      </BottomNav>

      {/* 统一挂载 5 个功能弹窗 */}
      <TextModal
        open={textModalConfig.isOpen}
        onClose={() => setTextModalConfig({ ...textModalConfig, isOpen: false })}
        onSave={(data) => handleSaveElement(textModalConfig, data)}
        initialData={textModalConfig.initialData}
      />
      <ImageModal
        open={imageModalConfig.isOpen}
        onClose={() => setImageModalConfig({ ...imageModalConfig, isOpen: false })}
        onSave={(data) => handleSaveElement(imageModalConfig, data)}
        initialData={imageModalConfig.initialData}
      />
      <VideoModal
        open={videoModalConfig.isOpen}
        onClose={() => setVideoModalConfig({ ...videoModalConfig, isOpen: false })}
        onSave={(data) => handleSaveElement(videoModalConfig, data)}
        initialData={videoModalConfig.initialData}
      />
      <CodeModal
        open={codeModalConfig.isOpen}
        onClose={() => setCodeModalConfig({ ...codeModalConfig, isOpen: false })}
        onSave={(data) => handleSaveElement(codeModalConfig, data)}
        initialData={codeModalConfig.initialData}
      />
      <BackgroundModal
        open={bgModalOpen}
        onClose={() => setBgModalOpen(false)}
        onSave={handleSaveBackground}
        currentBackground={slides[currentSlideIndex]?.background}
      />

    </EditorWrapper>
  );
}

export default PresentationPage;