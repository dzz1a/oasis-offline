import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.fonts.family};
    font-weight: ${theme.fonts.weights.regular};
    font-size: ${theme.fonts.sizes.base};
    line-height: 1.6;
    color: ${theme.colors.neutral[800]};
    background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.calm[50]} 50%, ${theme.colors.warm[50]} 100%);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  a {
    color: ${theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary[700]};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all ${theme.transitions.fast};
  }

  input, textarea {
    font-family: inherit;
    border: 1px solid ${theme.colors.neutral[200]};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    font-size: ${theme.fonts.sizes.base};
    transition: all ${theme.transitions.fast};
    background-color: ${theme.colors.neutral[50]};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary[400]};
      box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
    }

    &::placeholder {
      color: ${theme.colors.neutral[400]};
    }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  select {
    font-family: inherit;
    border: 1px solid ${theme.colors.neutral[200]};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    font-size: ${theme.fonts.sizes.base};
    background-color: ${theme.colors.neutral[50]};
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary[400]};
      box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
    }
  }
`;