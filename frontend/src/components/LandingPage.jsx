import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LandingWrapper = styled.div`
  display: flex;
  height: 100vh;
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
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

const TextBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
  width: 80%;
`;

const Heading = styled.h1`
  font-size: 4rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
`;

const Text = styled.p`
  font-size: 1.4rem;
  color: white;
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