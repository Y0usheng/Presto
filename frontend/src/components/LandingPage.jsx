import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LandingWrapper = styled.div`
  display: flex;
  height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  text-align: center;
  background-image: url('https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=1200');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (max-width: 768px) {
    flex: 1;
    height: 50vh;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;

  @media (max-width: 768px) {
    height: 50vh;
  }
`;

const TextBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
  width: 80%;

  @media (max-width: 400px) {
    width: 90%;
  }
`;

const Heading = styled.h1`
  font-size: 4rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 400px) {
    font-size: 2rem;
  }
`;

const Text = styled.p`
  font-size: 1.4rem;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 400px) {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  margin-top: 40px;
  padding: 10px 20px;
  font-size: 25px;
  cursor: pointer;
  border: none;
  background-color: #4DB6AC;
  color: white;
  border-radius: 5px;
  width:50%;
  height:10%;
  &:hover {
    background-color: #006666;
  }

  @media (max-width: 768px) {
    width: 70%;
    font-size: 20px;
    padding: 8px 16px;
  }

  @media (max-width: 400px) {
    width: 80%;
    font-size: 18px;
    padding: 6px 12px;
  }
`;

function LandingPage() {
  const navigate = useNavigate();
  return (
    <LandingWrapper>
      <LeftSection>
        <TextBackground>
          <Heading>Welcome to Presto!</Heading>
          <Text>Lighter, more enjoyable, more funny for making presentations</Text>
        </TextBackground>
      </LeftSection>
      <RightSection>
        <Button onClick={() => navigate('/login')}>Login</Button>
        <Button onClick={() => navigate('/register')}>Register</Button>
      </RightSection>
    </LandingWrapper>
  );
}

export default LandingPage;