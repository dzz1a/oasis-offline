import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const Hero = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.colors.primary[50]},
    ${theme.colors.calm[50]}
  );
  padding: ${theme.spacing[16]} ${theme.spacing[4]};
  text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 36px;
  color: ${theme.colors.neutral[800]};
  font-weight: ${theme.fonts.weights.bold};
  margin-bottom: ${theme.spacing[3]};
`;

const Subtitle = styled.p`
  color: ${theme.colors.primary[600]};
  font-size: ${theme.fonts.sizes.base};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Content = styled.div`
  max-width: 680px; /* 稍微缩窄最大宽度，更符合黄金阅读视线 */
  margin: 0 auto;
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fonts.sizes.xl};
  color: ${theme.colors.neutral[800]};
  position: relative;
  padding-left: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};

  /* 左侧优雅的渐变指示条 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 15%;
    height: 70%;
    width: 4px;
    background: linear-gradient(
      to bottom,
      ${theme.colors.primary[500]},
      ${theme.colors.calm[500]}
    );
    border-radius: ${theme.borderRadius.sm};
  }
`;

const Paragraph = styled.p`
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.fonts.sizes.base};
  line-height: 1.8;
  text-align: justify;
  margin-bottom: ${theme.spacing[4]};
`;

const HighlightCard = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.colors.primary[50]} 0%,
    #ffffff 100%
  );
  border-left: 4px solid ${theme.colors.primary[400]};
  padding: ${theme.spacing[5]};
  border-radius: 0 ${theme.borderRadius.xl} ${theme.borderRadius.xl} 0;
  margin-top: ${theme.spacing[6]};
  box-shadow: ${theme.shadows.sm || '0 2px 8px rgba(0, 0, 0, 0.04)'};
`;

const HighlightText = styled.p`
  color: ${theme.colors.primary[700]};
  font-size: ${theme.fonts.sizes.base};
  font-weight: ${theme.fonts.weights.medium || '500'};
  line-height: 1.6;
`;

export const AboutUs = () => (
  <div>
    <Hero>
      <MainTitle>🌟 关于 离线绿洲</MainTitle>
      <Subtitle>让灵魂在高速旋转的世界里，有一个可以随时刹车的角落。</Subtitle>
    </Hero>

    <Content>
      <SectionTitle>我们的初衷</SectionTitle>
      <Paragraph>
        对于暂时离开学校的学生，你们的压力我们都理解。我们不鼓励盲目内卷，也不贩卖焦虑。我们只想为你提供一个舒适的环境。你随时可以来到这片绿洲里，充满电再重新出发。
      </Paragraph>

      <HighlightCard>
        <HighlightText>
          我们认为，“暂停是为了更好地出发”。请永远相信独一无二的你
        </HighlightText>
      </HighlightCard>
    </Content>
  </div>
);