import React from 'react';
import styled from 'styled-components';
import { Mail, Phone, MapPin } from 'lucide-react';
import { theme } from '../styles/theme';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[8]};
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.primary[50]};
  border-radius: ${theme.borderRadius.md};
`;

export const Contact = () => (
  <Container>
    <InfoSection>
      <h2>📬 和我们说点什么</h2>
      <p style={{ color: theme.colors.neutral[600] }}>无论是商务合作，或者你只是想找人聊聊，都可以通过以下方式找到我们。</p>
      <InfoCard>
        <Mail color={theme.colors.primary[600]} />
        <div>
          <h4>电子邮箱</h4>
          <p style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>tonyy0721@gmail.com</p>
        </div>
      </InfoCard>
      <InfoCard>
        <Phone color={theme.colors.primary[600]} />
        <div>
          <h4>绿洲热线</h4>
          <p style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>400-800-1963 (工作日 9:00-18:00)</p>
        </div>
      </InfoCard>
    </InfoSection>
    
  </Container>
);
