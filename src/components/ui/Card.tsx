import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface CardProps {
  hoverable?: boolean;
  className?: string;
}

export const Card = styled.div<CardProps>`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  transition: all ${theme.transitions.normal};

  ${({ hoverable }) => hoverable && css`
    &:hover {
      box-shadow: ${theme.shadows.md};
      transform: translateY(-2px);
    }
  `}
`;

export const CardHeader = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
`;

export const CardBody = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
`;

export const CardFooter = styled.div`
  padding: ${theme.spacing[3]} ${theme.spacing[5]};
  background-color: ${theme.colors.neutral[50]};
`;