// src/pages/Login/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import {
  StyleDiv, LeftSection, RightSection, TextBackground, Heading,
  Text, H2, FormContainer, Input, ButtonGroup, Button, ErrorMessage
} from '../AuthShared.styles';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
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
        <H2>Login</H2>

        <FormContainer onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <Button type="submit">Login</Button>
            <Button type="button" $secondary onClick={() => navigate('/')}>Back</Button>
          </ButtonGroup>
        </FormContainer>

        <p style={{ marginTop: '20px', color: '#666' }}>
          Don't have an account? <span onClick={() => navigate('/register')} style={{ color: '#d83b01', cursor: 'pointer', fontWeight: 'bold' }}>Sign up</span>
        </p>

      </RightSection>
    </StyleDiv>
  );
}

export default LoginPage;