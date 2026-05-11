import styled from 'styled-components';
import { User } from 'lucide-react';
import { theme } from '../../styles/theme';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  name?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const fontSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const AvatarContainer = styled.div<{ size: string; fontSize: string }>`
  ${({ size }) => size};
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.fonts.weights.medium};
  ${({ fontSize }) => fontSize};
  box-shadow: ${theme.shadows.sm};
  transition: transform ${theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
  }
`;

export const Avatar = ({ size = 'md', name, className }: AvatarProps) => {
  const initials = name ? name.slice(0, 1) : '';
  
  return (
    <AvatarContainer size={sizeMap[size]} fontSize={fontSizeMap[size]} className={className}>
      {initials ? initials : <User size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />}
    </AvatarContainer>
  );
};