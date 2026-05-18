import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
`;

export const TermsOfService = () => (
  <Container>
    <h1 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '16px' }}>📜 服务条款</h1>
    <div style={{ color: theme.colors.neutral[600], lineHeight: 1.7, marginTop: '24px' }}>
      <p>欢迎来到离线绿洲。在您开始这场心灵旅程之前，请仔细阅读以下条款哦：</p>
      <h3 style={{ marginTop: '24px', color: '#333' }}>1. 接受条款</h3>
      <p>注册或使用本平台的服务，即代表您同意遵守本条约及绿洲的所有社区规范。</p>
      <h3 style={{ marginTop: '16px', color: '#333' }}>2. 行为准则</h3>
      <p>绿洲是一片净土，我们不欢迎任何带有攻击性、谩骂或政治敏感的内容。违者可能会被管理员永久请离哦。</p>
    </div>
  </Container>
);