import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info';
}

const variants = {
  success: {
    bg: theme.colors.success[500],
    text: 'white',
  },
  warning: {
    bg: theme.colors.warning[500],
    text: 'white',
  },
  danger: {
    bg: theme.colors.danger[500],
    text: 'white',
  },
  info: {
    bg: theme.colors.calm[500],
    text: 'white',
  },
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 ${theme.spacing[2]};
  font-size: ${theme.fonts.sizes.xs};
  font-weight: ${theme.fonts.weights.bold};
  background-color: ${({ variant = 'info' }) => variants[variant].bg};
  color: ${({ variant = 'info' }) => variants[variant].text};
  border-radius: ${theme.borderRadius.full};
`;