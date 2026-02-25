// src/pages/Register/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import {
  StyleDiv, LeftSection, RightSection, TextBackground, Heading,
  Text, H2, FormContainer, Input, ButtonGroup, Button, ErrorMessage
} from '../AuthShared.styles';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const data = await api.register(email, name, password);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
        <H2>Sign Up</H2>

        <FormContainer onSubmit={handleSubmit}>
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

          <ButtonGroup>
            <Button type="submit">Register</Button>
            <Button type="button" $secondary onClick={() => navigate('/')}>Back</Button>
          </ButtonGroup>
        </FormContainer>

      </RightSection>
    </StyleDiv>
  );
}

export default RegisterPage;