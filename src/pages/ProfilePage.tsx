import { useState } from 'react';
import styled from 'styled-components';
import { Settings, Edit2, Heart, Activity, Calendar, Bell, Shield, ChevronRight, Camera, Award, MapPin, Mail, Phone, Star } from 'lucide-react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { Badge } from '../components/ui/Badge';
import { mockUsers, mockEmotionRecords, emotionLabels } from '../data/mockData';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[4]};
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[8]};
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[6]};
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${theme.fonts.sizes['3xl']};
  font-weight: ${theme.fonts.weights.bold};
`;

const EditAvatarButton = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 2px solid ${theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
    border-color: ${theme.colors.primary[400]};
  }
`;

const UserInfo = styled.div``;

const Username = styled.h1`
  font-size: ${theme.fonts.sizes['2xl']};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[2]};
`;

const UserRole = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const RoleBadge = styled(Badge)`
  background: ${theme.colors.primary[500]};
`;

const RoleLabel = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const Bio = styled.p`
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[4]};
`;

const UserTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[8]};
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.fonts.sizes['2xl']};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.primary[600]};
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${theme.spacing[6]};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const SectionCard = styled(Card)`
  margin-bottom: ${theme.spacing[4]};
`;

const SectionHeader = styled(CardHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
`;

const SectionAction = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  background: transparent;
  border: none;
  color: ${theme.colors.primary[600]};
  font-size: ${theme.fonts.sizes.sm};
  font-weight: ${theme.fonts.weights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.primary[50]};
  }
`;

const EnergyBar = styled.div`
  height: 12px;
  background: ${theme.colors.neutral[100]};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${theme.spacing[2]};
`;

const EnergyFill = styled.div<{ level: number }>`
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(90deg, ${theme.colors.primary[400]} 0%, ${theme.colors.primary[600]} 100%);
  width: ${({ level }) => level}%;
  transition: width ${theme.transitions.normal};
`;

const EnergyLevel = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const EmotionHistory = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
`;

const EmotionItem = styled.div`
  flex: 1;
  text-align: center;
`;

const EmotionCircle = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing[2]};
`;

const EmotionIcon = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const EmotionLabel = styled.span`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[500]};
  display: block;
`;

const EmotionDate = styled.span`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[400]};
`;

const MenuSection = styled.div``;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.neutral[50]};
  }
`;

const MenuIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary[600]};
`;

const MenuText = styled.div`
  flex: 1;
`;

const MenuTitle = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
  display: block;
`;

const MenuDescription = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const ContactCard = styled(Card)`
  background: linear-gradient(135deg, ${theme.colors.danger[50]} 0%, ${theme.colors.warning[50]} 100%);
`;

const ContactHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const ContactIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${theme.colors.danger[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ContactTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[2]} 0;
`;

const ContactLabel = styled.div`
  flex: 1;
`;

const ContactName = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
  display: block;
`;

const ContactRelation = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[600]};
`;

const ContactButton = styled(Button)`
  background: ${theme.colors.danger[500]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};

  &:hover {
    background: ${theme.colors.danger[600]};
  }
`;

export const ProfilePage = ({ onNavigate }: ProfilePageProps) => {
  const [user] = useState(mockUsers[0]);
  const [emotions] = useState(mockEmotionRecords);

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarSection>
          <AvatarWrapper>
            <Avatar>{user.username.slice(0, 1)}</Avatar>
            <EditAvatarButton>
              <Camera size={16} />
            </EditAvatarButton>
          </AvatarWrapper>
          <UserInfo>
              <Username>{user.username}</Username>
              <UserRole>
                <RoleBadge>{user.role === 'student' ? '学生' : user.role === 'parent' ? '家长' : '专业人士'}</RoleBadge>
                <RoleLabel>已加入 {user.createdAt.getFullYear()}</RoleLabel>
              </UserRole>
              <Bio>{user.bio}</Bio>
            <UserTags>
              {user.tags?.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </UserTags>
          </UserInfo>
        </AvatarSection>
        <ActionButtons>
          <Button variant="outline">
            <Edit2 size={18} />
            编辑资料
          </Button>
          <Button>
            <Settings size={18} />
            设置
          </Button>
        </ActionButtons>
      </ProfileHeader>

      <StatsRow>
        <StatCard>
          <CardBody>
            <StatValue>128</StatValue>
            <StatLabel>获得点赞</StatLabel>
          </CardBody>
        </StatCard>
        <StatCard>
          <CardBody>
            <StatValue>32</StatValue>
            <StatLabel>发布帖子</StatLabel>
          </CardBody>
        </StatCard>
        <StatCard>
          <CardBody>
            <StatValue>156</StatValue>
            <StatLabel>关注者</StatLabel>
          </CardBody>
        </StatCard>
        <StatCard>
          <CardBody>
            <StatValue>89</StatValue>
            <StatLabel>已关注</StatLabel>
          </CardBody>
        </StatCard>
      </StatsRow>

      <ProfileContent>
        <MainContent>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>我的能量状态</SectionTitle>
            </SectionHeader>
            <CardBody>
              <EnergyBar>
                <EnergyFill level={user.energyLevel || 75} />
              </EnergyBar>
              <EnergyLevel>当前能量值: {user.energyLevel || 75}%</EnergyLevel>
            </CardBody>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>情绪记录</SectionTitle>
              <SectionAction>
                查看全部
                <ChevronRight size={16} />
              </SectionAction>
            </SectionHeader>
            <CardBody>
              <EmotionHistory>
                {emotions.slice(0, 7).map((record) => {
                  const emotionInfo = emotionLabels[record.emotion];
                  return (
                    <EmotionItem key={record.id}>
                      <EmotionCircle color={emotionInfo.color}>
                        <EmotionIcon color={emotionInfo.color} />
                      </EmotionCircle>
                      <EmotionLabel>{emotionInfo.label}</EmotionLabel>
                      <EmotionDate>{record.createdAt.getDate()}日</EmotionDate>
                    </EmotionItem>
                  );
                })}
              </EmotionHistory>
            </CardBody>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>成就徽章</SectionTitle>
            </SectionHeader>
            <CardBody>
              <div style={{ display: 'flex', gap: theme.spacing[4] }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: theme.borderRadius.xl, background: theme.colors.warm[100], display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing[2] }}>
                      <Award size={32} color={theme.colors.warm[500]} />
                    </div>
                    <span style={{ fontSize: theme.fonts.sizes.sm, color: theme.colors.neutral[600] }}>第{i}周打卡</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </SectionCard>
        </MainContent>

        <MenuSection>
          <Card>
            <CardBody>
              {[
                { icon: Bell, title: '通知设置', desc: '管理通知偏好' },
                { icon: Shield, title: '隐私设置', desc: '控制数据和隐私' },
                { icon: Activity, title: '数据统计', desc: '查看使用统计' },
                { icon: Calendar, title: '日程管理', desc: '管理你的日程' },
              ].map((item, index) => (
                <MenuItem key={index}>
                  <MenuIcon>
                    <item.icon size={20} />
                  </MenuIcon>
                  <MenuText>
                    <MenuTitle>{item.title}</MenuTitle>
                    <MenuDescription>{item.desc}</MenuDescription>
                  </MenuText>
                  <ChevronRight size={18} color={theme.colors.neutral[400]} />
                </MenuItem>
              ))}
            </CardBody>
          </Card>

          <ContactCard>
            <CardBody>
              <ContactHeader>
                <ContactIcon>
                  <Heart size={20} />
                </ContactIcon>
                <ContactTitle>紧急联系人</ContactTitle>
              </ContactHeader>
              <ContactItem>
                <ContactLabel>
                  <ContactName>张医生</ContactName>
                  <ContactRelation>心理医生</ContactRelation>
                </ContactLabel>
                <ContactButton size="sm">
                  <Phone size={16} />
                  联系
                </ContactButton>
              </ContactItem>
            </CardBody>
          </ContactCard>
        </MenuSection>
      </ProfileContent>
    </ProfileContainer>
  );
};