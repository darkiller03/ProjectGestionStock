import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper, styled } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; 
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

const PasswordToggleButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/login/', {
        username: username,
        password: password,
      });
      const token = response.data.token; // Assuming the token is returned in the response
      localStorage.setItem('token', token); // Store token in localStorage
      console.log('Login successful');
      onLogin(true); // Notify parent component of successful login
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
      onLogin(false); // Notify parent component of failed login
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledContainer component="main" maxWidth="xs">
      <StyledPaper>
        <StyledTypography component="h1" variant="h5">
          Sign In
        </StyledTypography>
        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <PasswordToggleButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </PasswordToggleButton>
              ),
            }}
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
          >
            Sign In
          </StyledButton>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default LoginForm;
