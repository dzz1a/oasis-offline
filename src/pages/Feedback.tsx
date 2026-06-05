import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  background: white;
  padding: ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: ${theme.spacing[3]};
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.md};
  resize: vertical;
  outline: none;
  &:focus { border-color: ${theme.colors.primary[500]}; }
`;

const SubmitBtn = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.calm[500]});
  color: white;
  border: none;
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;

export const Feedback = () => (
  <Container>
    <h1 style={{ textShadow: 'auto', marginBottom: '16px', textAlign: 'center' }}>✍️ 你的想法？</h1>
    <p style={{ textAlign: 'center', color: theme.colors.neutral[500], marginBottom: '32px' }}>绿洲的发展，离不开每一个人的爱！</p>
    <Form onSubmit={(e) => { e.preventDefault(); alert('绿洲邮局已收到您的信件！📮'); }}>
      <label style={{ fontWeight: 'bold' }}>你想对我们说：</label>
      <TextArea placeholder="把你的想法写在这里吧，我们会认真阅读每一条反馈..." required />
      <label style={{ fontWeight: 'bold' }}>留下联系方式（选填）：</label>
      <input type="text" placeholder="微信/邮箱/QQ" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #eee' }} />
      <SubmitBtn type="submit">漂流瓶出发！</SubmitBtn>
    </Form>
  </Container>
);
