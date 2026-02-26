// src/pages/Dashboard/Dashboard.styles.js
import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  min-height: 100vh;
  background-color: #f6f8fd; /* 类似 Canva 的极简灰白背景 */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const TopBar = styled.nav`
  background: #ffffff;
  height: 64px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #0e1318;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  svg {
    fill: #d83b01; /* 保持橙红配色 */
  }
`;

export const LogoutButton = styled.button`
  background: transparent;
  color: #5e6d77;
  border: 1px solid #dcdfe4;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f3f5;
    color: #0e1318;
  }
`;

export const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Greeting = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0e1318;
  margin-bottom: 30px;
`;

export const GridContainer = styled.div`
  display: grid;
  /* 响应式网格：无论屏幕多大，卡片都能自动排列 */
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  }
`;

// Canva 标志性的虚线新建按钮卡片
export const CreateCard = styled(Card)`
  background: linear-gradient(135deg, rgba(216, 59, 1, 0.05) 0%, rgba(216, 59, 1, 0.01) 100%);
  border: 2px dashed rgba(216, 59, 1, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 240px;
  box-shadow: none;

  &:hover {
    border-color: #d83b01;
    background: rgba(216, 59, 1, 0.08);
  }
`;

export const CreateIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #d83b01;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 12px auto;
`;

export const CreateText = styled.div`
  font-weight: 600;
  color: #d83b01;
  font-size: 1.1rem;
`;

// 项目预览图区域
export const ThumbnailArea = styled.div`
  height: 140px;
  background: #e8ecef;
  background-image: ${props => props.$bgImage ? `url(${props.$bgImage})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0abb2;
  cursor: pointer;
`;

export const CardBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const PresentationTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0e1318;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 文字过长显示省略号 */
`;

export const SlideCount = styled.p`
  font-size: 0.85rem;
  color: #5e6d77;
  margin: 0 0 16px 0;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 6px 0;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;

  ${props => props.$primary ? `
    background: #d83b01;
    color: white;
    &:hover { background: #b83201; }
  ` : props.$danger ? `
    background: transparent;
    color: #d32f2f;
    border-color: #f8d7da;
    &:hover { background: #ffebee; }
  ` : `
    background: #f1f3f5;
    color: #0e1318;
    &:hover { background: #e2e6ea; }
  `}
`;

// 精美的新建弹窗
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e6ea;
  border-radius: 6px;
  margin: 20px 0;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #d83b01;
    outline: none;
  }
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;