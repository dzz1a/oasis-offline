import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface AuthPageProps {
  onLogin: (user: { username: string; email: string; id: string; _id: string }) => void;
}

const AuthContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const AuthCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 30px;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 15px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  margin-top: 10px;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  text-align: center;
  margin-top: 10px;
`;

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isLogin 
        ? 'http://localhost:5000/api/auth/login' 
        : 'http://localhost:5000/api/auth/register';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '操作失败');
      }

      localStorage.setItem('token', data.token);
      onLogin({
        username: data.user.username,
        email: data.user.email,
        id: data.user._id,
        _id: data.user._id
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Title>{isLogin ? '欢迎回来' : '创建账号'}</Title>
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              type="text"
              placeholder="用户名"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          )}
          <Input
            type="email"
            placeholder="邮箱"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="密码"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </Button>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {isLogin ? '还没有账号？' : '已有账号？'}
          <ToggleButton onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '立即注册' : '立即登录'}
          </ToggleButton>
        </div>
      </AuthCard>
    </AuthContainer>
  );
};