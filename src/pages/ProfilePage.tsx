import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Settings, Edit2, Heart, Activity, Calendar, Bell, Shield, ChevronRight, Camera, Award, MapPin, Mail, Phone, Star, X, Save, Plus, Trash2, Bookmark } from 'lucide-react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { Badge } from '../components/ui/Badge';
import { mockEmotionRecords, emotionLabels } from '../data/mockData';

interface User {
  username: string;
  email: string;
  id: string;
  _id?: string;
  role?: string;
  bio?: string;
  tags?: string[];
  energyLevel?: number;
  createdAt?: Date;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: all ${theme.transitions.normal};
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const FormLabel = styled.label`
  display: block;
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing[2]};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.base};
  transition: all ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.base};
  min-height: 100px;
  resize: vertical;
  transition: all ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

const TagsInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]};
  border: 1px dashed ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.md};
  min-height: 60px;
`;

const TagInput = styled.input`
  border: none;
  font-size: ${theme.fonts.sizes.base};
  padding: ${theme.spacing[1]};
  flex: 1;
  min-width: 100px;
`;

const EditableTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${theme.colors.primary[100]};
  color: ${theme.colors.primary[700]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fonts.sizes.sm};
`;

const RemoveTagButton = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${theme.colors.primary[200]};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${theme.colors.primary[700]};
`;

const AddTagButton = styled.button`
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.neutral[100]};
  border: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  cursor: pointer;
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.fonts.sizes.sm};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.neutral[100]};
`;

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  currentUser: User;
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

interface FavoritePost {
  _id: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  comments: [];
  createdAt: Date;
}

export const ProfilePage = ({ onNavigate, currentUser }: ProfilePageProps) => {
  const [user, setUser] = useState<User>(currentUser);
  const [emotions] = useState(mockEmotionRecords);
  const [stats, setStats] = useState({ likes: 0, posts: 0, followers: 0, following: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    tags: [] as string[],
    role: 'student'
  });
  const [newTag, setNewTag] = useState('');
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);

  useEffect(() => {
    setUser(currentUser);
    fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
      }
    })
    .catch(err => console.error('获取用户信息失败:', err));

    fetchFavorites();
  }, [currentUser]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      console.error('获取收藏失败:', err);
    }
  };

  const roleLabels: Record<string, string> = {
    student: '学生',
    parent: '家长',
    professional: '专业人士'
  };

  const openEditModal = () => {
    setEditForm({
      username: user.username,
      bio: user.bio || '',
      tags: user.tags || [],
      role: user.role || 'student'
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        closeEditModal();
      }
    } catch (err) {
      console.error('保存失败:', err);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !editForm.tags.includes(newTag.trim())) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

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
                <RoleBadge>{roleLabels[user.role || 'student']}</RoleBadge>
                <RoleLabel>已加入 {new Date().getFullYear()}</RoleLabel>
              </UserRole>
              <Bio>{user.bio || '还没有个人简介，点击编辑资料添加吧！'}</Bio>
            <UserTags>
              {user.tags && user.tags.length > 0 ? (
                user.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))
              ) : (
                <Tag variant="outline">暂无标签</Tag>
              )}
            </UserTags>
          </UserInfo>
        </AvatarSection>
        <ActionButtons>
          <Button variant="outline" onClick={openEditModal}>
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
            <StatValue>{stats.likes}</StatValue>
            <StatLabel>获得点赞</StatLabel>
          </CardBody>
        </StatCard>
        <StatCard>
          <CardBody>
            <StatValue>{stats.posts}</StatValue>
            <StatLabel>发布帖子</StatLabel>
          </CardBody>
        </StatCard>
        <StatCard>
          <CardBody>
            <StatValue>{stats.followers}</StatValue>
            <StatLabel>关注者</StatLabel>
          </CardBody>
        </StatCard>
        <StatCard>
          <CardBody>
            <StatValue>{stats.following}</StatValue>
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
                  <div key={i} style={{ textAlign: 'center', opacity: i <= 2 ? 1 : 0.4 }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: theme.borderRadius.xl, background: i <= 2 ? theme.colors.warm[100] : theme.colors.neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing[2] }}>
                      <Award size={32} color={i <= 2 ? theme.colors.warm[500] : theme.colors.neutral[400]} />
                    </div>
                    <span style={{ fontSize: theme.fonts.sizes.sm, color: theme.colors.neutral[600] }}>{i <= 2 ? `第${i}周打卡` : '未解锁'}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>我的收藏</SectionTitle>
            </SectionHeader>
            <CardBody>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: theme.spacing[8], color: theme.colors.neutral[500] }}>
                  <Bookmark size={48} style={{ marginBottom: theme.spacing[3], opacity: 0.5 }} />
                  <p>还没有收藏任何帖子</p>
                  <p style={{ fontSize: theme.fonts.sizes.sm }}>在绿洲社区中点击收藏按钮即可收藏喜欢的帖子</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
                  {favorites.map((post) => (
                    <div key={post._id} style={{ padding: theme.spacing[4], background: theme.colors.neutral[50], borderRadius: theme.borderRadius.md }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[2] }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: theme.fonts.sizes.sm }}>
                          {post.author.username.slice(0, 1)}
                        </div>
                        <span style={{ fontSize: theme.fonts.sizes.sm, color: theme.colors.neutral[600] }}>{post.author.username}</span>
                        <span style={{ fontSize: theme.fonts.sizes.xs, color: theme.colors.neutral[400] }}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 style={{ fontSize: theme.fonts.sizes.lg, fontWeight: theme.fonts.weights.bold, color: theme.colors.neutral[800], marginBottom: theme.spacing[2] }}>
                        {post.title}
                      </h3>
                      <p style={{ color: theme.colors.neutral[600], marginBottom: theme.spacing[3], display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.content}
                      </p>
                      <div style={{ display: 'flex', gap: theme.spacing[2] }}>
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ padding: `${theme.spacing[1]} ${theme.spacing[2]}`, background: theme.colors.primary[100], color: theme.colors.primary[700], borderRadius: theme.borderRadius.md, fontSize: theme.fonts.sizes.xs }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      <ModalOverlay isOpen={isEditModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>编辑资料</ModalTitle>
            <CloseButton onClick={closeEditModal}>
              <X size={18} />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <FormLabel>用户名</FormLabel>
              <FormInput
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="请输入用户名"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>角色</FormLabel>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '16px'
                }}
              >
                <option value="student">学生</option>
                <option value="parent">家长</option>
                <option value="professional">专业人士</option>
              </select>
            </FormGroup>

            <FormGroup>
              <FormLabel>个人简介</FormLabel>
              <FormTextarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="介绍一下你自己..."
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>标签</FormLabel>
              <TagsInputWrapper>
                {editForm.tags.map(tag => (
                  <EditableTag key={tag}>
                    {tag}
                    <RemoveTagButton onClick={() => removeTag(tag)}>
                      <Trash2 size={12} />
                    </RemoveTagButton>
                  </EditableTag>
                ))}
                <TagInput
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="输入标签后按回车"
                />
                <AddTagButton onClick={addTag}>
                  <Plus size={14} />
                  添加
                </AddTagButton>
              </TagsInputWrapper>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={closeEditModal}>取消</Button>
            <Button onClick={handleSave}>
              <Save size={18} />
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </ProfileContainer>
  );
};