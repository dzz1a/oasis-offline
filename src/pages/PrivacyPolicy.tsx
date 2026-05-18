import React from 'react';
import styled from 'styled-components';
import { Shield } from 'lucide-react';
import { theme } from '../styles/theme';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
`;

export const PrivacyPolicy = () => (
  <Container>
    <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #f0f0f0', paddingBottom: '16px' }}>
      <Shield color={theme.colors.primary[600]} /> 隐私政策
    </h1>
    <div style={{ color: theme.colors.neutral[600], lineHeight: 1.7, marginTop: '24px' }}>
      <p><strong>更新日期：2026年5月</strong></p>
      <p style={{ marginTop: '12px' }}>离线绿洲（以下简称“我们”）高度重视用户（以下简称“您”）的隐私信息。我们承诺遵循以下原则来保护您的隐私：</p>
      <h3 style={{ marginTop: '24px', color: '#333' }}>1. 信息收集</h3>
      <p>我们不强制要求您的真实姓名、身份证号等敏感信息。您在社区内发布的内容可以选择完全匿名。</p>
      <h3 style={{ marginTop: '16px', color: '#333' }}>2. 数据安全</h3>
      <p>所有聊天记录、心情手帐均存储于云端数据库中，任何人均无权查看。</p>
    </div>
  </Container>
);