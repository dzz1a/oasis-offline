import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  TreeDeciduous,
  Menu,
  X,
  Bell,
  User,
  Search,
  LogOut,
} from 'lucide-react';

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

  background:
    linear-gradient(
      135deg,
      rgba(76, 150, 140, 0.82),
      rgba(59, 151, 111, 0.78)
    );

  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);

  border-bottom: 1px solid rgba(255,255,255,0.08);

  box-shadow:
    0 10px 40px rgba(0,0,0,0.22);

  transition: all 0.3s ease;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  padding: 0 ${theme.spacing[4]};

  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 72px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;

  border-radius: ${theme.borderRadius.xl};

  background: linear-gradient(
    135deg,
    ${theme.colors.primary[400]} 0%,
    ${theme.colors.calm[400]} 100%
  );

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    0 8px 20px rgba(99, 102, 241, 0.35);
`;

const LogoText = styled.h1`
  font-size: ${theme.fonts.sizes.xl};
  font-weight: ${theme.fonts.weights.bold};

  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #c4b5fd 45%,
    #93c5fd 100%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  letter-spacing: 1px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  padding: ${theme.spacing[1]};

  border-radius: ${theme.borderRadius.full};

  background: rgba(255,255,255,0.06);

  border: 1px solid rgba(255,255,255,0.08);

  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.08);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button<{ active: boolean }>`
  position: relative;

  padding: ${theme.spacing[2]} ${theme.spacing[4]};

  border-radius: ${theme.borderRadius.full};

  border: none;

  cursor: pointer;

  font-weight: ${theme.fonts.weights.medium};
  font-size: ${theme.fonts.sizes.sm};

  transition: all 0.25s ease;

  color: ${({ active }) =>
    active
      ? '#ffffff'
      : 'rgba(255,255,255,0.72)'};

  background: ${({ active }) =>
    active
      ? `linear-gradient(
          135deg,
          rgba(99,102,241,0.35) 0%,
          rgba(96,165,250,0.28) 100%
        )`
      : 'transparent'};

  box-shadow: ${({ active }) =>
    active
      ? `0 4px 16px rgba(99,102,241,0.28)`
      : 'none'};

  &:hover {
    transform: translateY(-1px);

    background: ${({ active }) =>
      active
        ? `linear-gradient(
            135deg,
            rgba(99,102,241,0.35) 0%,
            rgba(96,165,250,0.28) 100%
          )`
        : 'rgba(255,255,255,0.08)'};

    color: white;
  }

  &::after {
    content: '';

    position: absolute;

    left: 20%;
    right: 20%;
    bottom: -6px;

    height: 3px;

    border-radius: 999px;

    background: linear-gradient(
      90deg,
      ${theme.colors.primary[400]},
      ${theme.colors.calm[400]}
    );

    opacity: ${({ active }) => (active ? 1 : 0)};

    transform: scaleX(${({ active }) => (active ? 1 : 0.5)});

    transition: all 0.25s ease;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const SearchWrapper = styled.div`
  position: relative;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchIcon = styled.div`
  position: absolute;

  left: 14px;
  top: 50%;

  transform: translateY(-50%);

  color: rgba(255,255,255,0.55);
`;

const SearchInput = styled.input`
  width: 220px;

  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  padding-left: 42px;

  border-radius: ${theme.borderRadius.full};

  border: 1px solid rgba(255,255,255,0.08);

  background: rgba(255,255,255,0.08);

  color: white;

  font-size: ${theme.fonts.sizes.sm};

  transition: all 0.25s ease;

  box-shadow:
    inset 0 1px 2px rgba(255,255,255,0.08);

  &:focus {
    outline: none;

    border-color: rgba(99,102,241,0.4);

    transform: translateY(-1px);

    box-shadow:
      0 0 0 4px rgba(99,102,241,0.12),
      0 8px 20px rgba(99,102,241,0.18);
  }

  &::placeholder {
    color: rgba(255,255,255,0.45);
  }
`;

const ActionButton = styled.button`
  width: 42px;
  height: 42px;

  border-radius: ${theme.borderRadius.lg};

  background: rgba(255,255,255,0.08);

  border: 1px solid rgba(255,255,255,0.08);

  color: rgba(255,255,255,0.75);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);

    background: rgba(255,255,255,0.16);

    color: white;

    box-shadow:
      0 8px 20px rgba(0,0,0,0.15);
  }
`;

const MobileMenuButton = styled.button`
  display: none;

  width: 42px;
  height: 42px;

  border-radius: ${theme.borderRadius.lg};

  background: rgba(255,255,255,0.08);

  border: 1px solid rgba(255,255,255,0.08);

  color: rgba(255,255,255,0.85);

  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    background: rgba(255,255,255,0.16);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileNav = styled.div<{ isOpen: boolean }>`
  position: absolute;

  top: 72px;
  left: 0;
  right: 0;

  padding: ${theme.spacing[4]};

  background:
    linear-gradient(
      135deg,
      rgba(15,23,42,0.95),
      rgba(30,41,59,0.92)
    );

  backdrop-filter: blur(18px);

  border-bottom: 1px solid rgba(255,255,255,0.08);

  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};

  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};

  transform: ${({ isOpen }) =>
    isOpen
      ? 'translateY(0)'
      : 'translateY(-10px)'};

  pointer-events: ${({ isOpen }) =>
    isOpen ? 'auto' : 'none'};

  transition: all 0.25s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled.button<{ active: boolean }>`
  width: 100%;

  padding: ${theme.spacing[3]} ${theme.spacing[4]};

  border-radius: ${theme.borderRadius.lg};

  border: none;

  text-align: left;

  cursor: pointer;

  font-weight: ${theme.fonts.weights.medium};

  transition: all 0.25s ease;

  color: ${({ active }) =>
    active
      ? '#ffffff'
      : 'rgba(255,255,255,0.75)'};

  background: ${({ active }) =>
    active
      ? `linear-gradient(
          135deg,
          rgba(99,102,241,0.35) 0%,
          rgba(96,165,250,0.28) 100%
        )`
      : 'transparent'};

  &:hover {
    background: rgba(255,255,255,0.08);
  }
`;

const UserWrapper = styled.div`
  position: relative;
`;

const UserMenu = styled.div`
  position: absolute;

  top: 54px;
  right: 0;

  width: 180px;

  padding: ${theme.spacing[2]};

  border-radius: ${theme.borderRadius.xl};

  background:
    linear-gradient(
      135deg,
      rgba(15,23,42,0.96),
      rgba(30,41,59,0.92)
    );

  backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,0.08);

  box-shadow:
    0 12px 30px rgba(0,0,0,0.25);

  z-index: 999;
`;

const UserMenuItem = styled.button`
  width: 100%;

  padding: ${theme.spacing[3]};

  border: none;

  border-radius: ${theme.borderRadius.lg};

  background: transparent;

  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  cursor: pointer;

  transition: all 0.2s ease;

  color: rgba(255,255,255,0.82);

  &:hover {
    background: rgba(255,255,255,0.08);
  }
`;

export const Header = ({
  currentUser,
  onNavChange,
  currentNav,
  onLogout,
}: HeaderProps) => {

  const [mobileOpen, setMobileOpen] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'forum', label: '绿洲' },
    { id: 'chat', label: '聊天' },
    { id: 'resources', label: '资源' },
    { id: 'simulation', label: '解压' },
    { id: 'profile', label: '自己' },
  ];

  const handleNavigation = (nav: string) => {

    onNavChange(nav);

    setMobileOpen(false);

    setUserMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {

    setMobileOpen(false);

  }, [currentNav]);

  useEffect(() => {

    const handleClickOutside = (
      e: MouseEvent
    ) => {

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          e.target as Node
        )
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };

  }, []);

  return (

    <HeaderContainer>

      <HeaderContent>

        <Logo
          onClick={() =>
            handleNavigation('home')
          }
        >
          <LogoIcon>
            <TreeDeciduous
              size={20}
              color="white"
            />
          </LogoIcon>

          <LogoText>
            离线绿洲
          </LogoText>
        </Logo>

        <Nav>

          {navItems.map((item) => (

            <NavLink
              key={item.id}
              active={
                currentNav === item.id
              }
              onClick={() =>
                handleNavigation(item.id)
              }
            >
              {item.label}
            </NavLink>

          ))}

        </Nav>

        <Actions>

          <SearchWrapper>

            <SearchIcon>
              <Search size={16} />
            </SearchIcon>

            <SearchInput
              placeholder="搜索内容..."
            />

          </SearchWrapper>

          <ActionButton>
            <Bell size={18} />
          </ActionButton>

          {currentUser ? (

            <UserWrapper ref={userMenuRef}>

              <div
                onClick={() =>
                  setUserMenuOpen(
                    !userMenuOpen
                  )
                }
                style={{
                  cursor: 'pointer',
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border:
                    '2px solid rgba(255,255,255,0.18)',
                  background:
                    'rgba(255,255,255,0.06)',
                }}
              >
                <Avatar
                  name={
                    currentUser.username
                  }
                  size="sm"
                />
              </div>

              {userMenuOpen && (

                <UserMenu>

                  <UserMenuItem
                    onClick={() =>
                      handleNavigation(
                        'profile'
                      )
                    }
                  >
                    <User size={16} />

                    <span>
                      个人中心
                    </span>

                  </UserMenuItem>

                  <UserMenuItem
                    onClick={() => {

                      onLogout?.();

                      setUserMenuOpen(
                        false
                      );

                    }}
                  >
                    <LogOut size={16} />

                    <span>
                      退出登录
                    </span>

                  </UserMenuItem>

                </UserMenu>

              )}

            </UserWrapper>

          ) : (

            <ActionButton>
              <User size={18} />
            </ActionButton>

          )}

          <MobileMenuButton
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </MobileMenuButton>

        </Actions>

      </HeaderContent>

      <MobileNav isOpen={mobileOpen}>

        {navItems.map((item) => (

          <MobileNavLink
            key={item.id}
            active={
              currentNav === item.id
            }
            onClick={() =>
              handleNavigation(item.id)
            }
          >
            {item.label}
          </MobileNavLink>

        ))}

      </MobileNav>

    </HeaderContainer>
  );
};
