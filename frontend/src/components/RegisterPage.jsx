import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyleDiv = styled.div`
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

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #ffffff;

  @media (max-width: 768px) {
    height: 50vh;
  }
`;

const H2 = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 85%;
  padding: 12px;
  margin-bottom: 20px;
  margin-left: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    border-color: #4DB6AC; // Focus state color
  }
`;

const Button = styled.button`
  width: 40%;
  padding: 15px;
  margin-top: 10px;
  margin-left: 30px;
  font-size: 18px;
  color: white;
  background-color: #4DB6AC;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #35a79c;
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

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  margin-left:30px;
`;

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        name,
        password
      })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      setError(data.error || 'Registration failed');
    }

  };

  const handleBack = () => {
    navigate('/'); // Adjust as needed based on your routing setup
  };

  return (
    <StyleDiv>
      <LeftSection>
        <TextBackground>
          <Heading>Welcome to Presto!</Heading>
          <Text>Lighter, more enjoyable, more funny for making presentations</Text>
        </TextBackground>
      </LeftSection>
      <RightSection>
        <H2>Register Form</H2>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Register</Button>
          <Button type="button" onClick={handleBack}>Back</Button>
        </form>
      </RightSection>
    </StyleDiv>
  );
}

export default RegisterPage;
