import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
`;

const FaqItem = styled.div`
  margin-bottom: ${theme.spacing[6]};
  padding-bottom: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
`;

const Question = styled.h3`
  color: ${theme.colors.primary[700]};
  margin-bottom: ${theme.spacing[2]};
`;

const Answer = styled.p`
  color: ${theme.colors.neutral[600]};
  line-height: 1.6;
`;

const faqs = [
  { q: " “离线绿洲”是完全免费的吗？", a: "是的！我们的基础陪伴功能、解压游戏和社区都是完全免费开放的，旨在为大家提供一块纯净的心灵栖息地。" },
  { q: "我的个人隐私和聊天记录安全吗？", a: "我们采用有效的加密技术，保护您的个人隐私。在这里，您的安全比什么都重要。" },
  { q: " 感到情绪非常低落时，我该怎么做？", a: "您可以前往“资源中心”阅读专业心理资料，或在“解压游戏”中放松自己，让我们给您一个温暖的拥抱。" }
];

export const FAQ = () => (
  <Container>
    <h1 style={{ textAlign: 'center', marginBottom: '40px', color: theme.colors.neutral[800] }}> 常见问题 </h1>
    {faqs.map((faq, i) => (
      <FaqItem key={i}>
        <Question>{faq.q}</Question>
        <Answer>{faq.a}</Answer>
      </FaqItem>
    ))}
  </Container>
);