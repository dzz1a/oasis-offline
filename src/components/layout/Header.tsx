import { useState } from 'react';
import styled from 'styled-components';
import { TreeDeciduous, Menu, X, Search, Bell, User, LogOut } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Avatar } from '../ui/Avatar';

interface HeaderProps {
  currentUser?: { username: string };
  onNavChange: (nav: string) => void;
  currentNav: string;
  onLogout?: () => void;
}

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.colors.neutral[100]};
  box-shadow: ${theme.shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  cursor: pointer;
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

const LogoText = styled.h1`
  font-size: ${theme.fonts.sizes.xl};
  font-weight: ${theme.fonts.weights.bold};
  background: linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.calm[600]} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button<{ active: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[600]};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  ${({ active }) => active && `
    background-color: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[700]};
  `}

  &:hover:not(:active) {
    background-color: ${theme.colors.neutral[100]};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const SearchInput = styled.input`
  width: 200px;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  padding-left: 36px;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.sm};
  background: ${theme.colors.neutral[50]} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E") no-repeat left 12px center;

  &:focus {
    border-color: ${theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background: transparent;
  border: none;
  color: ${theme.colors.neutral[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[800]};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background: transparent;
  border: none;
  color: ${theme.colors.neutral[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileNav = styled.div<{ isOpen: boolean }>`
  display: none;
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid ${theme.colors.neutral[100]};
  padding: ${theme.spacing[4]};

  @media (max-width: 768px) {
    display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLink = styled.button<{ active: boolean }>`
  display: block;
  width: 100%;
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[600]};
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all ${theme.transitions.fast};

  ${({ active }) => active && `
    background-color: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[700]};
  `}

  &:hover:not(:active) {
    background-color: ${theme.colors.neutral[100]};
  }
`;

const UserMenu = styled.div`
  position: absolute;
  top: 64px;
  right: 20px;
  background: white;
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  padding: ${theme.spacing[1]};
  min-width: 180px;
`;

const UserMenuItem = styled.button`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border: none;
  background: transparent;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.fonts.sizes.sm};
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.neutral[100]};
  }
`;

export const Header = ({ currentUser, onNavChange, currentNav, onLogout }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'forum', label: '绿洲' },
    { id: 'chat', label: '聊天' },
    { id: 'resources', label: '资源' },
    { id: 'simulation', label: '模拟' },
    { id: 'profile', label: '自己' },
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo onClick={() => onNavChange('home')}>
          <LogoIcon>
            <TreeDeciduous size={20} color="white" />
          </LogoIcon>
          <LogoText>离线绿洲</LogoText>
        </Logo>

        <Nav>
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              active={currentNav === item.id}
              onClick={() => onNavChange(item.id)}
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>

        <Actions>
          <SearchInput placeholder="搜索..." />
          <ActionButton>
            <Bell size={20} />
          </ActionButton>
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <Avatar 
                name={currentUser.username} 
                size="sm" 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              />
              {userMenuOpen && (
                <UserMenu>
                  <UserMenuItem onClick={() => { onNavChange('profile'); setUserMenuOpen(false); }}>
                    <User size={16} />
                    <span>个人中心</span>
                  </UserMenuItem>
                  <UserMenuItem onClick={() => { onLogout?.(); setUserMenuOpen(false); }}>
                    <LogOut size={16} />
                    <span>退出登录</span>
                  </UserMenuItem>
                </UserMenu>
              )}
            </div>
          ) : (
            <ActionButton>
              <User size={20} />
            </ActionButton>
          )}
        </Actions>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </MobileMenuButton>
      </HeaderContent>
      <MobileNav isOpen={mobileMenuOpen}>
        {navItems.map((item) => (
          <MobileNavLink
            key={item.id}
            active={currentNav === item.id}
            onClick={() => { onNavChange(item.id); setMobileMenuOpen(false); }}
          >
            {item.label}
          </MobileNavLink>
        ))}
      </MobileNav>
    </HeaderContainer>
  );
};