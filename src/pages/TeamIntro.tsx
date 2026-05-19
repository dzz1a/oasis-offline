import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[8]};
  margin-top: ${theme.spacing[8]};
`;

const MemberCard = styled.div`
  text-align: center;
  background: white;
  padding: ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.neutral[100]};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[300]}, ${theme.colors.calm[300]});
  margin: 0 auto ${theme.spacing[4]} auto;
`;

const members = [
  { name: "丁子昂", role: "项目架构设计+代码实现" },
  { name: "吴珂心", role: "前期方向设计 + 结构规划" },
  { name: "尹璐 ", role: "概念图设计+模块划分"},
  { name: "袁宇曈 ", role: "代码实现+项目审查" },
  { name: "齐子明 ", role: "方向确定+特定功能实现" }
];

export const TeamIntro = () => (
  <Container>
    <div style={{ textAlign: 'center' }}>
      <h1>🧑‍🌾 我们的团队</h1>
      <p style={{ color: theme.colors.neutral[500], marginTop: '8px' }}>很高兴认识你！这就是默默维护着这片绿洲的团队。</p>
    </div>
    <Grid>
      {members.map((m, i) => (
        <MemberCard key={i}>
          <Avatar />
          <h3 style={{ color: theme.colors.neutral[800] }}>{m.name}</h3>
          <p style={{ color: theme.colors.primary[600], fontSize: '14px', fontWeight: 'bold', margin: '4px 0 12px 0' }}>{m.role}</p>
        </MemberCard>
      ))}
    </Grid>
  </Container>
);
