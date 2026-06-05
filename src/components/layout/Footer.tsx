import styled from 'styled-components';
import { TreeDeciduous, Heart, Shield, HelpCircle } from 'lucide-react';
import { theme } from '../../styles/theme';

interface FooterProps {
  onNavChange: (nav: string) => void;
}

const footerSections = [
  {
    title: '探索',
    links: [
      { label: '首页', nav: 'home' },
      { label: '绿洲社区', nav: 'forum' },
      { label: '资源中心', nav: 'resources' },
      { label: '解压游戏', nav: 'simulation' },
    ],
  },
  {
    title: '支持',
    links: [
      { label: '常见问题', nav: 'faq' },
      { label: '联系我们', nav: 'contact' },
      { label: '意见反馈', nav: 'feedback' },
    ],
  },
  {
    title: '关于',
    links: [
      { label: '关于我们', nav: 'about' },
      { label: '隐私政策', nav: 'privacy' },
      { label: '服务条款', nav: 'terms' },
      { label: '团队介绍', nav: 'team' },
    ],
  },
];

const gradientPrimary = `
linear-gradient(
  135deg,
  ${theme.colors.primary[400]} 0%,
  ${theme.colors.calm[400]} 100%
)
`;

const gradientText = `
linear-gradient(
  135deg,
  ${theme.colors.primary[600]} 0%,
  ${theme.colors.calm[600]} 100%
)
`;

const FooterContainer = styled.footer`
  background: linear-gradient(
    135deg,
    ${theme.colors.primary[50]} 0%,
    ${theme.colors.calm[50]} 100%
  );

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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const FooterLinkButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;

  width: fit-content;

  color: ${theme.colors.neutral[600]};
  font-size: ${theme.fonts.sizes.base};

  cursor: pointer;

  transition: all ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.primary[600]};
    transform: translateX(4px);
  }
`;

const Logo = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  margin-bottom: ${theme.spacing[4]};

  border: none;
  background: transparent;

  cursor: pointer;

  transition: transform ${theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;

  border-radius: ${theme.borderRadius.lg};

  background: ${gradientPrimary};

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: ${theme.shadows.md};

  transition: all ${theme.transitions.fast};

  ${Logo}:hover & {
    transform: rotate(-6deg) scale(1.05);
  }
`;

const LogoText = styled.h2`
  font-size: ${theme.fonts.sizes.xl};
  font-weight: ${theme.fonts.weights.bold};

  background: ${gradientText};

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  color: ${theme.colors.neutral[600]};
  line-height: 1.7;
  margin-bottom: ${theme.spacing[4]};
`;

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[4]};
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  color: ${theme.colors.neutral[600]};

  transition: transform ${theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
  }
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

export const Footer = ({ onNavChange }: FooterProps) => {
  const handleNavigate = (nav: string) => {
    onNavChange(nav);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSections>
          <FooterSection>
            <Logo onClick={() => handleNavigate('home')}>
              <LogoIcon>
                <TreeDeciduous size={20} color="white" />
              </LogoIcon>

              <LogoText>离线绿洲</LogoText>
            </Logo>

            <Description>
              心灵的栖息地，在这里找到属于你的宁静与力量。
              我们陪伴你走过每一段旅程。
            </Description>

            <Features>
              <Feature>
                <Shield
                  size={16}
                  color={theme.colors.primary[600]}
                />
                <span>安全保密</span>
              </Feature>

              <Feature>
                <Heart
                  size={16}
                  color={theme.colors.warm[500]}
                />
                <span>温暖陪伴</span>
              </Feature>

              <Feature>
                <HelpCircle
                  size={16}
                  color={theme.colors.calm[500]}
                />
                <span>专业支持</span>
              </Feature>
            </Features>
          </FooterSection>

          {footerSections.map((section) => (
            <FooterSection key={section.title}>
              <FooterTitle>{section.title}</FooterTitle>

              <FooterLinks>
                {section.links.map((link) => (
                  <FooterLinkButton
                    key={link.label}
                    onClick={() => handleNavigate(link.nav)}
                  >
                    {link.label}
                  </FooterLinkButton>
                ))}
              </FooterLinks>
            </FooterSection>
          ))}
        </FooterSections>

        <FooterBottom>
          <Copyright>
            © {new Date().getFullYear()} 离线绿洲.
            保留所有权利.
          </Copyright>

          <MadeWithLove>
            用
            <Heart
              size={14}
              color={theme.colors.danger[500]}
            />
            制作
          </MadeWithLove>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};
