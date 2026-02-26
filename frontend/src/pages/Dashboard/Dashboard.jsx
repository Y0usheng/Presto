// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import {
  DashboardWrapper, TopBar, Logo, LogoutButton, MainContent,
  Greeting, GridContainer, Card, CreateCard, CreateIcon, CreateText,
  ThumbnailArea, CardBody, PresentationTitle, SlideCount,
  CardActions, ActionButton, ModalOverlay, ModalContent, ModalInput, ModalButtonGroup
} from './Dashboard.styles';

function Dashboard() {
  const [presentations, setPresentations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const data = await api.getStore();

        // 🚨 核心 Bug 修复区 🚨
        // 如果 data.store 是空对象 {} 或者 null（新用户），强制给一个空数组 []
        const storeData = data.store;
        if (Array.isArray(storeData)) {
          setPresentations(storeData);
        } else if (storeData && Array.isArray(storeData.presentations)) {
          // 有些后端的写法可能会包裹一层
          setPresentations(storeData.presentations);
        } else {
          // 兜底方案：如果是新用户，保证状态是一个空数组
          setPresentations([]);
        }
      } catch (error) {
        console.error('Error fetching presentations:', error);
      }
    };
    fetchPresentations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    // 给新项目生成一个独立 ID (时间戳)
    const newPresentation = {
      id: Date.now(),
      title: newTitle,
      thumbnail: '',
      description: '',
      slides: [{ elements: [] }] // 默认自带第一张幻灯片
    };

    const updatedList = [...presentations, newPresentation];

    try {
      await api.updateStore(updatedList);
      setPresentations(updatedList);
      setIsModalOpen(false);
      setNewTitle(''); // 清空输入框
    } catch (error) {
      console.error('Error creating presentation:', error);
    }
  };

  const handleDelete = async (idToDelete) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this presentation?");
    if (!confirmDelete) return;

    // 过滤掉被删掉的项目
    const updatedList = presentations.filter(p => p.id !== idToDelete);
    try {
      await api.updateStore(updatedList);
      setPresentations(updatedList);
    } catch (error) {
      console.error('Error deleting presentation:', error);
    }
  };

  return (
    <DashboardWrapper>
      {/* 顶部导航栏 */}
      <TopBar>
        <Logo onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M2 12C2 12 5 13 7 15C9 17 10 20 10 20C10 20 11 17 13 15C15 13 18 12 18 12C18 12 15 11 13 9C11 7 10 4 10 4C10 4 10 4 9 7 7 9 5 11 2 12 2 12Z" />
            <path d="M16 4C16 4 17 4.5 18 5.5C19 6.5 19.5 7.5 19.5 7.5C19.5 7.5 20 6.5 21 5.5C22 4.5 23 4 23 4C23 4 22 3.5 21 2.5C20 1.5 19.5 0.5 19.5 0.5C19.5 0.5 19 1.5 18 2.5C17 3.5 16 4 16 4Z" />
          </svg>
          Presto
        </Logo>
        <LogoutButton onClick={handleLogout}>Log out</LogoutButton>
      </TopBar>

      <MainContent>
        {/* 大字号欢迎语 */}
        <Greeting>What will you design today?</Greeting>

        <GridContainer>
          {/* 永远放在第一位的“新建设计”虚线卡片 */}
          <CreateCard onClick={() => setIsModalOpen(true)}>
            <div style={{ textAlign: 'center' }}>
              <CreateIcon>+</CreateIcon>
              <CreateText>Create design</CreateText>
            </div>
          </CreateCard>

          {/* 渲染后端返回的项目列表 */}
          {presentations.map((presentation) => (
            <Card key={presentation.id}>
              {/* 封面图区域，点击也能直接编辑 */}
              <ThumbnailArea
                $bgImage={presentation.thumbnail}
                onClick={() => navigate(`/presentation/${presentation.id}`)}
              >
                {!presentation.thumbnail && 'No Thumbnail'}
              </ThumbnailArea>

              <CardBody>
                <PresentationTitle title={presentation.title}>
                  {presentation.title || 'Untitled Design'}
                </PresentationTitle>
                <SlideCount>
                  {presentation.slides ? presentation.slides.length : 1} slide(s)
                </SlideCount>

                <CardActions>
                  <ActionButton $primary onClick={() => navigate(`/presentation/${presentation.id}`)}>
                    Edit
                  </ActionButton>
                  <ActionButton onClick={() => navigate(`/preview/${presentation.id}`)}>
                    Play
                  </ActionButton>
                  <ActionButton $danger onClick={() => handleDelete(presentation.id)}>
                    Del
                  </ActionButton>
                </CardActions>
              </CardBody>
            </Card>
          ))}
        </GridContainer>
      </MainContent>

      {/* 点击新建弹出的漂亮弹窗 */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          {/* e.stopPropagation 阻止点击弹窗内容时关闭弹窗 */}
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 10px 0', color: '#0e1318' }}>Create a new presentation</h2>
            <p style={{ margin: '0', color: '#5e6d77', fontSize: '14px' }}>Give your awesome design a name to get started.</p>

            <ModalInput
              autoFocus
              type="text"
              placeholder="e.g. Q4 Marketing Plan"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()} /* 回车键快速新建 */
            />

            <ModalButtonGroup>
              <ActionButton onClick={() => setIsModalOpen(false)}>Cancel</ActionButton>
              <ActionButton $primary onClick={handleCreate}>Create</ActionButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

    </DashboardWrapper>
  );
}

export default Dashboard;