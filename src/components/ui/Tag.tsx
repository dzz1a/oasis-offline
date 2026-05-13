import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface TagProps {
  variant?: 'primary' | 'secondary' | 'calm' | 'warm' | 'outline';
  size?: 'sm' | 'md';
}

const variants = {
  primary: {
    bg: theme.colors.primary[100],
    text: theme.colors.primary[700],
    border: theme.colors.primary[200],
  },
  secondary: {
    bg: theme.colors.warm[100],
    text: theme.colors.warm[700],
    border: theme.colors.warm[200],
  },
  calm: {
    bg: theme.colors.calm[100],
    text: theme.colors.calm[700],
    border: theme.colors.calm[200],
  },
  warm: {
    bg: theme.colors.warm[100],
    text: theme.colors.warm[700],
    border: theme.colors.warm[200],
  },
  outline: {
    bg: 'transparent',
    text: theme.colors.neutral[600],
    border: theme.colors.neutral[300],
  },
};

const sizes = {
  sm: {
    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
    fontSize: theme.fonts.sizes.xs,
  },
  md: {
    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
    fontSize: theme.fonts.sizes.sm,
  },
};

export const Tag = styled.span<TagProps>`
  display: inline-flex;
  align-items: center;
  padding: ${({ size = 'sm' }) => sizes[size].padding};
  font-size: ${({ size = 'sm' }) => sizes[size].fontSize};
  font-weight: ${theme.fonts.weights.medium};
  background-color: ${({ variant = 'primary' }) => variants[variant].bg};
  color: ${({ variant = 'primary' }) => variants[variant].text};
  border: 1px solid ${({ variant = 'primary' }) => variants[variant].border};
  border-radius: ${theme.borderRadius.full};
`;