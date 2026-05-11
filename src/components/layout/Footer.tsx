import styled from 'styled-components';
import { TreeDeciduous, Heart, Shield, HelpCircle } from 'lucide-react';
import { theme } from '../../styles/theme';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.calm[50]} 100%);
  padding: ${theme.spacing[8]} 0;
  border-top: 1px solid ${theme.colors.neutral[100]};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[4]};
`;

const FooterSections = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[8]};
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[4]};
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLink = styled.li`
  margin-bottom: ${theme.spacing[2]};

  a {
    color: ${theme.colors.neutral[600]};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary[600]};
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.h2`
  font-size: ${theme.fonts.sizes.xl};
  font-weight: ${theme.fonts.weights.bold};
  background: linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.calm[600]} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  color: ${theme.colors.neutral[600]};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[4]};
`;

const Features = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.neutral[600]};
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.neutral[200]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${theme.spacing[4]};
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${theme.colors.neutral[500]};
  font-size: ${theme.fonts.sizes.sm};
`;

const MadeWithLove = styled.p`
  color: ${theme.colors.neutral[500]};
  font-size: ${theme.fonts.sizes.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSections>
          <FooterSection>
            <Logo>
              <LogoIcon>
                <TreeDeciduous size={20} color="white" />
              </LogoIcon>
              <LogoText>离线绿洲</LogoText>
            </Logo>
            <Description>
              心灵的栖息地，在这里找到属于你的宁静与力量。我们陪伴你走过每一段旅程。
            </Description>
            <Features>
              <Feature>
                <Shield size={16} color={theme.colors.primary[600]} />
                <span>安全保密</span>
              </Feature>
              <Feature>
                <Heart size={16} color={theme.colors.warm[500]} />
                <span>温暖陪伴</span>
              </Feature>
              <Feature>
                <HelpCircle size={16} color={theme.colors.calm[500]} />
                <span>专业支持</span>
              </Feature>
            </Features>
          </FooterSection>

          <FooterSection>
            <FooterTitle>探索</FooterTitle>
            <FooterLinks>
              <FooterLink><a href="#home">首页</a></FooterLink>
              <FooterLink><a href="#forum">绿洲社区</a></FooterLink>
              <FooterLink><a href="#resources">资源中心</a></FooterLink>
              <FooterLink><a href="#simulation">情景模拟</a></FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>支持</FooterTitle>
            <FooterLinks>
              <FooterLink><a href="#help">帮助中心</a></FooterLink>
              <FooterLink><a href="#faq">常见问题</a></FooterLink>
              <FooterLink><a href="#contact">联系我们</a></FooterLink>
              <FooterLink><a href="#feedback">意见反馈</a></FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>关于</FooterTitle>
            <FooterLinks>
              <FooterLink><a href="#about">关于我们</a></FooterLink>
              <FooterLink><a href="#privacy">隐私政策</a></FooterLink>
              <FooterLink><a href="#terms">服务条款</a></FooterLink>
              <FooterLink><a href="#team">团队介绍</a></FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterSections>

        <FooterBottom>
          <Copyright>© 2024 离线绿洲. 保留所有权利.</Copyright>
          <MadeWithLove>
            用 <Heart size={14} color={theme.colors.danger[500]} /> 制作
          </MadeWithLove>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};