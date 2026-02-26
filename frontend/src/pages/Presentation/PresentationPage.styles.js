import styled from 'styled-components';

export const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f6f8fd; /* 干净的背景底色 */
  font-family: 'Inter', -apple-system, sans-serif;
  overflow: hidden;
`;

// --- 顶部导航栏 ---
export const TopBar = styled.header`
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e2e6ea;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10;
`;

export const TitleInput = styled.input`
  font-size: 1.2rem;
  font-weight: 600;
  color: #0e1318;
  border: 1px solid transparent;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
  width: 300px;
  transition: all 0.2s;

  &:hover { background: #f1f3f5; }
  &:focus { background: #ffffff; border-color: #d83b01; outline: none; box-shadow: 0 0 0 2px rgba(216, 59, 1, 0.2); }
`;

export const ActionButton = styled.button`
  background: ${props => props.$primary ? '#d83b01' : '#f1f3f5'};
  color: ${props => props.$primary ? '#ffffff' : '#0e1318'};
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.2s;

  &:hover { background: ${props => props.$primary ? '#b83201' : '#e2e6ea'}; }
`;

// --- 核心工作区 (包含侧边栏和画布) ---
export const Workspace = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// --- 左侧工具栏 ---
export const Sidebar = styled.aside`
  width: 80px;
  background: #ffffff;
  border-right: 1px solid #e2e6ea;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  gap: 15px;
  z-index: 10;
`;

export const ToolButton = styled.button`
  width: 56px;
  height: 56px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #5e6d77;
  cursor: pointer;
  transition: all 0.2s;

  span { font-size: 11px; margin-top: 4px; font-weight: 500; }
  
  &:hover {
    background: rgba(216, 59, 1, 0.08);
    color: #d83b01;
  }
`;

// --- 中央画布区域 ---
export const CanvasArea = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow: auto;
`;

export const SlideCanvas = styled.div`
  width: 100%;
  max-width: 960px;
  aspect-ratio: 16 / 9;
  background: ${props => props.$bg || '#ffffff'};
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border: 1px solid #e2e6ea;
  position: relative;
  overflow: hidden; /* 防止元素拖拽出界 */
`;

// --- 底部控制栏 ---
export const BottomNav = styled.footer`
  height: 50px;
  background: #ffffff;
  border-top: 1px solid #e2e6ea;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const NavText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #5e6d77;
  width: 120px;
  text-align: center;
`;

export const ControlIconBtn = styled.button`
  background: transparent;
  border: none;
  color: #5e6d77;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover:not(:disabled) { background: #f1f3f5; color: #0e1318; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;