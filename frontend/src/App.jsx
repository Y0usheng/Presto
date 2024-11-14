import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import TokenCheckRouter from './components/CheckToken';
import PresentationPage from './components/PresentationPage';
import PreviewPage from './components/PreviewPage';

const PresentationRedirectToFirstSlide = () => {
  const { id } = useParams();
  return <Navigate to={`/presentation/${id}/slide/1`} />;
};

const PreviewRedirectToFirstSlide = () => {
  const { id } = useParams();
  return <Navigate to={`/preview/${id}/slide/1`} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<TokenCheckRouter><Dashboard /></TokenCheckRouter>} />
        <Route path="/presentation/:id" element={<TokenCheckRouter><PresentationRedirectToFirstSlide /></TokenCheckRouter>} />
        <Route path="/presentation/:id/slide/:slideNumber" element={<TokenCheckRouter><PresentationPage /></TokenCheckRouter>} />
        <Route path="/preview/:id" element={<TokenCheckRouter><PreviewRedirectToFirstSlide /></TokenCheckRouter>} />
        <Route path="/preview/:id/slide/:slideNumber" element={<TokenCheckRouter><PreviewPage /></TokenCheckRouter>} />
      </Routes>
    </Router>
  )
}

export default App
