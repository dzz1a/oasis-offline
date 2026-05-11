import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.fonts.weights.medium};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const variants = {
  primary: css`
    background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
    color: white;
    border: none;
    box-shadow: ${theme.shadows.sm};

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%);
      box-shadow: ${theme.shadows.md};
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background: linear-gradient(135deg, ${theme.colors.warm[400]} 0%, ${theme.colors.warm[500]} 100%);
    color: white;
    border: none;
    box-shadow: ${theme.shadows.sm};

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${theme.colors.warm[500]} 0%, ${theme.colors.warm[600]} 100%);
      box-shadow: ${theme.shadows.md};
    }
  `,
  outline: css`
    background: transparent;
    color: ${theme.colors.primary[600]};
    border: 2px solid ${theme.colors.primary[400]};

    &:hover:not(:disabled) {
      background: ${theme.colors.primary[50]};
      border-color: ${theme.colors.primary[500]};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${theme.colors.neutral[600]};
    border: none;

    &:hover:not(:disabled) {
      background: ${theme.colors.neutral[100]};
      color: ${theme.colors.neutral[800]};
    }
  `,
};

const sizes = {
  sm: css`
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    font-size: ${theme.fonts.sizes.sm};
  `,
  md: css`
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    font-size: ${theme.fonts.sizes.base};
  `,
  lg: css`
    padding: ${theme.spacing[4]} ${theme.spacing[8]};
    font-size: ${theme.fonts.sizes.lg};
  `,
};

export const Button = styled.button<ButtonProps>`
  ${baseStyles};
  ${({ variant = 'primary' }) => variants[variant]};
  ${({ size = 'md' }) => sizes[size]};
  ${({ fullWidth }) => fullWidth && 'width: 100%;'};
`;