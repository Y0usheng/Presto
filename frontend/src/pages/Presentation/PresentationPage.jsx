// src/pages/Presentation/PresentationPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePresentation } from '../../hooks/usePresentation';

// 引入样式
import {
  EditorWrapper, TopBar, TitleInput, ActionButton, Workspace,
  Sidebar, ToolButton, CanvasArea, SlideCanvas, BottomNav,
  NavText, ControlIconBtn
} from './PresentationPage.styles';

// 引入之前拆分好的 5 个独立 Modal 组件
import TextModal from './components/TextModal';
import ImageModal from './components/ImageModal';
import VideoModal from './components/VideoModal';
import CodeModal from './components/CodeModal';
import BackgroundModal from './components/BackgroundModal';

function PresentationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. 数据逻辑 Hook（完美接管了所有的 fetch 和 state 更新）
  const {
    slides, setSlides, currentSlideIndex, title, loading,
    updateStoreWithSlides, handleTitleChange, addSlide, deleteSlide, nextSlide, prevSlide
  } = usePresentation(id);

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
        // 编辑模式：覆盖原有元素
        newElements[modalConfig.editIndex] = { ...newElements[modalConfig.editIndex], ...elementData };
      } else {
        // 新增模式：推入新元素并分配层级
        newElements.push({ ...elementData, layer: newElements.length });
      }
      return { ...slide, elements: newElements };
    });

    setSlides(updatedSlides);
    await updateStoreWithSlides(updatedSlides);
  };

  // 专属的背景保存函数
  const handleSaveBackground = async (newBackground) => {
    const updatedSlides = slides.map((slide, index) => {
      if (index !== currentSlideIndex) return slide;
      return { ...slide, background: newBackground };
    });
    setSlides(updatedSlides);
    await updateStoreWithSlides(updatedSlides);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Editor...</div>;

  return (
    <EditorWrapper>
      {/* 顶部导航栏 */}
      <TopBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ActionButton onClick={() => navigate('/dashboard')}>Home</ActionButton>
        </div>

        <TitleInput
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter presentation title"
        />

        <div>
          <ActionButton onClick={() => navigate(`/preview/${id}`)}>Preview ▶</ActionButton>
          {/* 这里触发一下 state 刷新或加个提示即可，因为每次修改已经通过 hook 自动 save 了 */}
          <ActionButton $primary onClick={() => alert('All changes saved!')}>Save</ActionButton>
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
          <SlideCanvas $bg={slides[currentSlideIndex]?.background || '#ffffff'}>

            {/* 动态渲染幻灯片元素 (支持绝对定位和双击编辑) */}
            {slides[currentSlideIndex]?.elements?.map((element, index) => {
              // 抽取公共的定位与层级样式
              const baseStyle = {
                position: 'absolute',
                left: `${element.position?.x || 0}%`,
                top: `${element.position?.y || 0}%`,
                zIndex: element.layer || index,
                cursor: 'pointer',
              };

              // 文本节点
              if (element.type === 'text') {
                return (
                  <div
                    key={index}
                    style={{
                      ...baseStyle,
                      fontSize: `${element.fontSize}em`,
                      color: element.color,
                      fontFamily: element.fontFamily,
                      width: `${element.size}%`,
                    }}
                    onDoubleClick={() => setTextModalConfig({ isOpen: true, initialData: element, editIndex: index })}
                  >
                    {element.text}
                  </div>
                );
              }

              // 图片节点
              if (element.type === 'image') {
                return (
                  <img
                    key={index}
                    src={element.source}
                    alt={element.alt || 'slide-img'}
                    style={{ ...baseStyle, width: `${element.size}%` }}
                    onDoubleClick={() => setImageModalConfig({ isOpen: true, initialData: element, editIndex: index })}
                  />
                );
              }

              // 视频节点
              if (element.type === 'video') {
                return (
                  <div
                    key={index}
                    style={{ ...baseStyle, width: `${element.size}%`, border: '2px dashed transparent' }}
                    onDoubleClick={() => setVideoModalConfig({ isOpen: true, initialData: element, editIndex: index })}
                  >
                    {/* 使用 iframe 嵌入 YouTube 等视频 */}
                    <iframe
                      src={element.source}
                      width="100%"
                      height="100%"
                      style={{ aspectRatio: '16/9', pointerEvents: 'none' }} // pointerEvents none 防止双击被 iframe 拦截
                      title="slide-video"
                      frameBorder="0"
                    />
                  </div>
                );
              }

              // 代码节点
              if (element.type === 'code') {
                return (
                  <div
                    key={index}
                    style={{
                      ...baseStyle,
                      fontSize: `${element.fontSize}em`,
                      backgroundColor: '#282c34', // 程序员经典的暗色代码块背景
                      color: '#abb2bf',
                      padding: '16px',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      width: 'auto',
                      minWidth: '200px'
                    }}
                    onDoubleClick={() => setCodeModalConfig({ isOpen: true, initialData: element, editIndex: index })}
                  >
                    {element.code}
                  </div>
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