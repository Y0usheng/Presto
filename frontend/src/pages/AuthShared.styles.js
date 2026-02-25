// src/pages/AuthShared.styles.js
import styled from 'styled-components';

export const StyleDiv = styled.div`
  display: flex;
  height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LeftSection = styled.div`
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

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #ffffff;

  @media (max-width: 768px) {
    height: 50vh;
  }
`;

export const TextBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 8px;
  width: 80%;

  @media (max-width: 400px) {
    width: 90%;
  }
`;

export const Heading = styled.h1`
  font-size: 4rem;
  color: white;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const Text = styled.p`
  font-size: 1.4rem;
  color: white;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const H2 = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
`;

export const FormContainer = styled.form`
  width: 100%;
  max-width: 380px; 
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: #d83b01;
    outline: none;
    box-shadow: 0 0 0 2px rgba(216, 59, 1, 0.2);
  }
`;

export const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 15px; 
  margin-top: 10px;
`;

export const Button = styled.button`
  flex: 1;
  padding: 14px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  background-color: #d83b01; 
  border: 2px solid #d83b01;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #b83201;
    border-color: #b83201;
  }

  ${(props) => props.$secondary && `
    background-color: transparent;
    color: #d83b01;

    &:hover {
      background-color: rgba(216, 59, 1, 0.05);
      border-color: #d83b01;
    }
  `}
`;

export const ErrorMessage = styled.p`
  color: #d32f2f;
  font-weight: 600;
  width: 100%;
  text-align: left;
  margin-top: -10px;
  margin-bottom: 15px;
`;