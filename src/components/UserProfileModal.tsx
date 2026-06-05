import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Award, User } from 'lucide-react';
import { theme } from '../styles/theme';
import { Card } from './ui/Card';
import { Tag } from './ui/Tag';
import { emotionLabels } from '../data/mockData';
import { API_URL } from '../config/api';

interface PrivacySettings {
  showEnergy: boolean;
  showEmotionStatus: boolean;
  showEmotionContent: boolean;
  displayBadges: string[];
}

interface Badge {
  _id: string;
  name: string;
  icon: string;
  description?: string;
  earned: boolean;
}

interface RecentEmotion {
  emotion: string;
  intensity: number;
  createdAt: string;
  note?: string;
}

interface UserStats {
  likes: number;
  posts: number;
  followers: number;
  following: number;
}

interface UserProfile {
  _id: string;
  username: string;
  email?: string;
  energyLevel?: number;
  privacy: PrivacySettings;
  badges?: Badge[];
  displayBadges?: Badge[];
  earnedBadgeCount?: number;
  role?: string;
  createdAt?: string;
  bio?: string;
  tags?: string[];
  stats?: UserStats;
  recentEmotion?: RecentEmotion | null;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
}

const roleLabels: Record<string, string> = {
  student: '\u5b66\u751f',
  parent: '\u5bb6\u957f',
  professional: '\u4e13\u4e1a\u4eba\u58eb',
};

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: ${theme.borderRadius.xl};
  background: white;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.2);
  overscroll-behavior: contain;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.fonts.sizes.xl};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.neutral[100]};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ProfileContainer = styled.div`
  padding: ${theme.spacing[6]};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
`;

const Avatar = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${theme.fonts.sizes['2xl']};
  font-weight: ${theme.fonts.weights.bold};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  min-width: 0;
`;

const Username = styled.h1`
  font-size: ${theme.fonts.sizes.xl};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[2]};
`;

const UserRole = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[2]};
`;

const RoleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.primary[500]};
  color: white;
  font-size: ${theme.fonts.sizes.sm};
  font-weight: ${theme.fonts.weights.medium};
`;

const JoinedDate = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const Bio = styled.p`
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.fonts.sizes.sm};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[2]};
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[6]};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[3]};
`;

const StatValue = styled.div`
  font-size: ${theme.fonts.sizes.xl};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.primary[600]};
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[500]};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing[5]};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[3]};
`;

const EnergyDisplay = styled(Card)`
  padding: ${theme.spacing[4]};
`;

const EnergyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
`;

const EnergyLabel = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const EnergyValue = styled.span`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.primary[600]};
`;

const EnergyBar = styled.div`
  height: 12px;
  background: ${theme.colors.neutral[100]};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`;

const EnergyFill = styled.div<{ level: number }>`
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(90deg, ${theme.colors.primary[400]} 0%, ${theme.colors.primary[600]} 100%);
  width: ${({ level }) => level}%;
  transition: width ${theme.transitions.normal};
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[3]};
`;

const BadgeItem = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing[3]} ${theme.spacing[2]};
`;

const BadgeIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${theme.spacing[1]};
`;

const BadgeName = styled.div`
  font-size: ${theme.fonts.sizes.xs};
  text-align: center;
  color: ${theme.colors.neutral[700]};
  font-weight: ${theme.fonts.weights.medium};
`;

const EmotionDisplay = styled(Card)`
  padding: ${theme.spacing[4]};
`;

const EmotionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[2]};
`;

const EmotionEmoji = styled.span`
  font-size: 2rem;
`;

const EmotionMeta = styled.div`
  flex: 1;
`;

const EmotionTitle = styled.div`
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
`;

const EmotionDate = styled.div`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const EmotionNote = styled.p`
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.fonts.sizes.sm};
  line-height: 1.6;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${theme.colors.neutral[400]};
  padding: ${theme.spacing[4]};
  font-size: ${theme.fonts.sizes.sm};
`;

const CenteredState = styled.div`
  padding: 60px;
  text-align: center;
`;

const CenteredEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid ${theme.colors.neutral[100]};
  border-radius: 50%;
  border-top-color: ${theme.colors.primary[500]};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  margin-top: 16px;
  color: ${theme.colors.neutral[500]};
`;

const ErrorText = styled.div`
  color: ${theme.colors.neutral[500]};
`;

const UserProfileModal = ({ isOpen, onClose, userId, username }: UserProfileModalProps) => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !userId) {
      return;
    }

    let cancelled = false;

    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError('');
      setUserData(null);

      try {
        const response = await fetch(
          `${API_URL}/api/users/${String(userId)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await response.json();

        if (cancelled) return;

        if (data.success && data.user) {
          setUserData(data.user);
        } else {
          setError(data.message || '\u65e0\u6cd5\u83b7\u53d6\u7528\u6237\u4fe1\u606f');
        }
      } catch (err) {
        if (!cancelled) {
          console.error('\u83b7\u53d6\u7528\u6237\u8d44\u6599\u5931\u8d25:', err);
          setError('\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      cancelled = true;
    };
  }, [isOpen, userId]);

  const displayName = userData?.username || username;
  const privacy = userData?.privacy;
  const stats = userData?.stats;
  const displayBadges = userData?.displayBadges || [];
  const energyLevel = userData?.energyLevel ?? 0;
  const energyBarLevel = Math.min(100, Math.max(0, energyLevel));

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{'\u7528\u6237\u4e3b\u9875'}</ModalTitle>
          <CloseButton onClick={onClose} type="button" aria-label={'\u5173\u95ed'}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>

        {isLoading && (
          <CenteredState>
            <LoadingSpinner />
            <LoadingText>{'\u52a0\u8f7d\u4e2d...'}</LoadingText>
          </CenteredState>
        )}

        {!isLoading && error && (
          <CenteredState>
            <CenteredEmoji>{'\ud83d\udc64'}</CenteredEmoji>
            <ErrorText>{error}</ErrorText>
          </CenteredState>
        )}

        {!isLoading && userData && privacy && (
          <ProfileContainer>
            <ProfileHeader>
              <Avatar>{displayName.slice(0, 1)}</Avatar>
              <UserInfo>
                <Username>{displayName}</Username>
                <UserRole>
                  <RoleBadge>
                    <User size={12} />
                    {roleLabels[userData.role || 'student'] || '\u7528\u6237'}
                  </RoleBadge>
                  <JoinedDate>
                    {'\u52a0\u5165\u4e8e '}
                    {userData.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString()
                      : '\u672a\u77e5'}
                  </JoinedDate>
                </UserRole>
                <Bio>
                  {userData.bio?.trim()
                    ? userData.bio
                    : '\u8fd9\u4e2a\u4eba\u8fd8\u6ca1\u6709\u586b\u5199\u4e2a\u4eba\u7b80\u4ecb'}
                </Bio>
                {userData.tags && userData.tags.length > 0 && (
                  <TagsRow>
                    {userData.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </TagsRow>
                )}
              </UserInfo>
            </ProfileHeader>

            {stats && (
              <StatsRow>
                <StatCard>
                  <StatValue>{stats.likes}</StatValue>
                  <StatLabel>{'\u83b7\u5f97\u70b9\u8d5e'}</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.posts}</StatValue>
                  <StatLabel>{'\u53d1\u5e03\u5e16\u5b50'}</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.followers}</StatValue>
                  <StatLabel>{'\u5173\u6ce8\u8005'}</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{stats.following}</StatValue>
                  <StatLabel>{'\u5df2\u5173\u6ce8'}</StatLabel>
                </StatCard>
              </StatsRow>
            )}

            {privacy.showEnergy && userData.energyLevel !== undefined && (
              <Section>
                <SectionTitle>{'\u5f53\u524d\u80fd\u91cf'}</SectionTitle>
                <EnergyDisplay>
                  <EnergyHeader>
                    <EnergyLabel>{'\u80fd\u91cf\u503c'}</EnergyLabel>
                    <EnergyValue>{energyLevel}</EnergyValue>
                  </EnergyHeader>
                  <EnergyBar>
                    <EnergyFill level={energyBarLevel} />
                  </EnergyBar>
                </EnergyDisplay>
              </Section>
            )}

            {privacy.showEmotionStatus && (
              <Section>
                <SectionTitle>{'\u6700\u8fd1\u5fc3\u60c5'}</SectionTitle>
                <EmotionDisplay>
                  {userData.recentEmotion ? (
                    <>
                      <EmotionHeader>
                        <EmotionEmoji>
                          {emotionLabels[userData.recentEmotion.emotion]?.emoji || '\ud83d\udcdd'}
                        </EmotionEmoji>
                        <EmotionMeta>
                          <EmotionTitle>
                            {emotionLabels[userData.recentEmotion.emotion]?.label ||
                              userData.recentEmotion.emotion}
                            {' \u00b7 '}
                            {'\u5f3a\u5ea6 '}{userData.recentEmotion.intensity}/10
                          </EmotionTitle>
                          <EmotionDate>
                            {new Date(userData.recentEmotion.createdAt).toLocaleString()}
                          </EmotionDate>
                        </EmotionMeta>
                      </EmotionHeader>
                      {userData.recentEmotion.note ? (
                        <EmotionNote>{userData.recentEmotion.note}</EmotionNote>
                      ) : privacy.showEmotionContent ? (
                        <EmptyState>{'\u6682\u65e0\u5fc3\u60c5\u5907\u6ce8'}</EmptyState>
                      ) : (
                        <EmptyState>{'\u5bf9\u65b9\u672a\u516c\u5f00\u5fc3\u60c5\u5907\u6ce8'}</EmptyState>
                      )}
                    </>
                  ) : (
                    <EmptyState>{'\u6682\u65e0\u60c5\u7eea\u8bb0\u5f55'}</EmptyState>
                  )}
                </EmotionDisplay>
              </Section>
            )}

            <Section>
              <SectionTitle>{'\u5c55\u793a\u5fbd\u7ae0'}</SectionTitle>
              {displayBadges.length > 0 ? (
                <BadgeGrid>
                  {displayBadges.map((badge) => (
                    <BadgeItem key={badge._id}>
                      <BadgeIcon>{badge.icon}</BadgeIcon>
                      <BadgeName>{badge.name}</BadgeName>
                    </BadgeItem>
                  ))}
                </BadgeGrid>
              ) : (
                <EmptyState>
                  {privacy.displayBadges.length > 0
                    ? '\u6240\u9009\u5c55\u793a\u5fbd\u7ae0\u6682\u4e0d\u53ef\u7528'
                    : '\u6682\u672a\u8bbe\u7f6e\u5c55\u793a\u5fbd\u7ae0'}
                </EmptyState>
              )}
            </Section>

            {(userData.earnedBadgeCount ?? 0) > 0 && (
              <Section>
                <SectionTitle>
                  {`\u5df2\u83b7\u5f97 ${userData.earnedBadgeCount} \u679a\u5fbd\u7ae0`}
                </SectionTitle>
                <EmptyState>
                  <Award size={16} style={{ display: 'inline', marginRight: 6 }} />
                  {'\u5b8c\u6574\u5fbd\u7ae0\u5217\u8868\u8bf7\u524d\u5f80\u4e2a\u4eba\u4e2d\u5fc3\u67e5\u770b'}
                </EmptyState>
              </Section>
            )}
          </ProfileContainer>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserProfileModal;
