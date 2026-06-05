import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Settings, Edit2, Heart, Activity, Calendar, Bell, Shield, ChevronRight, Camera, Award, MapPin, Mail, Phone, Star, X, Save, Plus, Trash2, Bookmark, ChevronLeft } from 'lucide-react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { Badge } from '../components/ui/Badge';
import { mockEmotionRecords, emotionLabels } from '../data/mockData';
import { API_URL } from '../config/api';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

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
  viewingUserId?: string | null;
  viewingUsername?: string | null;
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

const EmotionCalendar = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[1]};
`;

const CalendarSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const DetailSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[2]};
`;

const CalendarNav = styled.button`
  width: 22px;
  height: 22px;
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.neutral[100]};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${theme.colors.neutral[600]};
  
  &:hover {
    background: ${theme.colors.neutral[200]};
  }
`;

const CalendarTitle = styled.h3`
  font-size: ${theme.fonts.sizes.sm};
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[700]};
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 3px;
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: 9px;
  color: ${theme.colors.neutral[400]};
  padding: 2px 0;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const CalendarDay = styled.button<{ hasEmotion: boolean; emotionColor?: string; isToday?: boolean; isEmpty?: boolean; isSelected?: boolean }>`
  aspect-ratio: 1;
  border-radius: 3px;
  border: 1px solid transparent;
  background: ${({ isEmpty, hasEmotion, emotionColor, isSelected }) => {
    if (isEmpty) return 'transparent';
    if (isSelected) return emotionColor ? `${emotionColor}30` : theme.colors.primary[100];
    if (hasEmotion && emotionColor) return `${emotionColor}20`;
    return theme.colors.neutral[50];
  }};
  cursor: ${({ isEmpty }) => isEmpty ? 'default' : 'pointer'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  transition: all ${theme.transitions.fast};
  padding: 1px;
  
  ${({ isSelected }) => isSelected && `
    border-color: ${theme.colors.primary[500]};
  `}
  
  &:hover:not(:disabled) {
    background: ${theme.colors.neutral[100]};
  }
`;

const DayNumber = styled.span`
  font-size: 10px;
  color: ${theme.colors.neutral[700]};
`;

const DayEmotion = styled.span`
  font-size: 9px;
`;

const EmotionLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[1]};
  margin-top: ${theme.spacing[1]};
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const LegendLabel = styled.span`
  font-size: 9px;
  color: ${theme.colors.neutral[500]};
`;

const EmotionStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const EmotionStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EmotionStatColor = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const EmotionStatCount = styled.span`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[600]};
`;

const EmotionDetail = styled.div`
  padding: ${theme.spacing[2]};
  background: ${theme.colors.neutral[50]};
  border-radius: ${theme.borderRadius.sm};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[2]};
`;

const DetailEmoji = styled.span`
  font-size: 32px;
`;

const DetailInfo = styled.div``;

const DetailDate = styled.span`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[500]};
`;

const DetailEmotion = styled.h4`
  font-size: ${theme.fonts.sizes.sm};
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
`;

const DetailNote = styled.p`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[600]};
  line-height: 1.4;
  flex: 1;
`;

const AddEmotionBtn = styled.button`
  width: 100%;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  border: 1px dashed ${theme.colors.neutral[300]};
  background: transparent;
  color: ${theme.colors.neutral[500]};
  font-size: ${theme.fonts.sizes.xs};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    border-color: ${theme.colors.primary[400]};
    color: ${theme.colors.primary[600]};
  }
`;

const TaskSection = styled.div`
  margin-bottom: ${theme.spacing[3]};
`;

const TaskCategory = styled.div`
  margin-bottom: ${theme.spacing[2]};
`;

const TaskCategoryTitle = styled.h4`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[500]};
  margin-bottom: ${theme.spacing[1]};
  font-weight: ${theme.fonts.weights.medium};
`;

const TaskList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[2]};
`;

const TaskItem = styled.button<{ completed: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]};
  background: ${({ completed }) => completed ? theme.colors.primary[50] : theme.colors.neutral[50]};
  border: 1px solid ${({ completed }) => completed ? theme.colors.primary[200] : theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.sm};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: ${({ completed, disabled }) => disabled ? undefined : completed ? theme.colors.primary[100] : theme.colors.neutral[100]};
  }
`;

const TaskIcon = styled.span`
  font-size: 20px;
`;

const TaskInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const TaskName = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[800]};
  display: block;
`;

const TaskReward = styled.span`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.primary[600]};
`;

const TaskStatus = styled.div`
  font-size: ${theme.fonts.sizes.lg};
`;

const TaskStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[2]};
  background: ${theme.colors.primary[50]};
  border-radius: ${theme.borderRadius.sm};
  margin-bottom: ${theme.spacing[2]};
`;

const TaskStatItem = styled.div`
  text-align: center;
`;

const TaskStatValue = styled.div`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.primary[600]};
`;

const TaskStatLabel = styled.div`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[500]};
`;

const BadgeSection = styled.div`
  margin-top: ${theme.spacing[2]};
`;

const BadgeCategory = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const BadgeCategoryTitle = styled.h4`
  font-size: ${theme.fonts.sizes.base};
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing[3]};
  font-weight: ${theme.fonts.weights.bold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: ${theme.spacing[3]};
`;

const BadgeItem = styled.div<{ earned: boolean }>`
  text-align: center;
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.lg};
  background: ${({ earned }) => earned 
    ? `linear-gradient(135deg, ${theme.colors.warm[50]}, ${theme.colors.primary[50]})`
    : theme.colors.neutral[50]};
  border: 2px solid ${({ earned }) => earned 
    ? theme.colors.warm[200] 
    : theme.colors.neutral[200]};
  transition: all ${theme.transitions.fast};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ earned }) => earned 
      ? `0 8px 20px ${theme.colors.warm[200]}`
      : theme.shadows.md};
  }
`;

const BadgeIcon = styled.div<{ earned: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ earned }) => earned 
    ? `linear-gradient(135deg, ${theme.colors.warm[100]}, ${theme.colors.primary[100]})`
    : theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing[2]};
  font-size: 28px;
  box-shadow: ${({ earned }) => earned 
    ? `0 4px 12px ${theme.colors.warm[200]}` 
    : 'none'};
  transition: all ${theme.transitions.fast};
`;

const BadgeName = styled.div`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[800]};
  font-weight: ${theme.fonts.weights.bold};
  margin-bottom: ${theme.spacing[1]};
`;

const BadgeDescription = styled.div`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[500]};
  margin-bottom: ${theme.spacing[2]};
  line-height: 1.4;
`;

const BadgeProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`;

const BadgeProgressFill = styled.div<{ progress: number; earned: boolean }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ earned }) => earned 
    ? `linear-gradient(90deg, ${theme.colors.warm[400]}, ${theme.colors.primary[400]})`
    : theme.colors.primary[300]};
  border-radius: ${theme.borderRadius.full};
  transition: width 0.3s ease;
`;

const BadgeProgressText = styled.div`
  font-size: 10px;
  color: ${theme.colors.neutral[500]};
  margin-top: ${theme.spacing[1]};
`;

const BadgeStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: linear-gradient(135deg, ${theme.colors.warm[50]}, ${theme.colors.primary[50]});
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.warm[100]};
`;

const BadgeCount = styled.div`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.warm[600]};
`;

const BadgeProgress = styled.div`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
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

const PrivacySection = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const PrivacySectionTitle = styled.h3`
  font-size: ${theme.fonts.sizes.base};
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[3]};
`;

const PrivacyItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[3]} 0;
  border-bottom: 1px solid ${theme.colors.neutral[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const PrivacyItemContent = styled.div`
  flex: 1;
`;

const PrivacyItemTitle = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
  display: block;
`;

const PrivacyItemDesc = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
  margin-top: ${theme.spacing[1]};
`;

const PrivacyToggle = styled.input`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  appearance: none;
  background: ${theme.colors.neutral[300]};
  position: relative;
  cursor: pointer;
  transition: background 0.2s;

  &:checked {
    background: ${theme.colors.primary[500]};
  }

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:checked::before {
    transform: translateX(20px);
  }
`;

const PrivacyBadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};
`;

const PrivacyBadgeItem = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  border: 2px solid ${props => props.selected ? theme.colors.primary[500] : theme.colors.neutral[200]};
  background: ${props => props.selected ? theme.colors.primary[50] : theme.colors.neutral[50]};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.colors.primary[400]};
    background: ${theme.colors.primary[50]};
  }
`;

const PrivacyBadgeIcon = styled.span`
  font-size: 28px;
`;

const PrivacyBadgeName = styled.span`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[700]};
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing[8]};
  grid-column: 1 / -1;
`;

const SelectedCount = styled.div`
  text-align: center;
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const SidebarContent = styled.div`
  position: sticky;
  top: ${theme.spacing[6]};
`;

const TodoInputWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const TodoInput = styled.input`
  flex: 1;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.sm};
  transition: all ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const TodoItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.neutral[50]};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.neutral[100]};
  }
`;

const TodoCheckbox = styled.button<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ checked }) => checked ? theme.colors.primary[500] : theme.colors.neutral[300]};
  background: ${({ checked }) => checked ? theme.colors.primary[500] : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary[400]};
  }
`;

const TodoText = styled.span<{ completed: boolean }>`
  flex: 1;
  font-size: ${theme.fonts.sizes.sm};
  color: ${({ completed }) => completed ? theme.colors.neutral[400] : theme.colors.neutral[700]};
  text-decoration: ${({ completed }) => completed ? 'line-through' : 'none'};
`;

const TodoDeleteBtn = styled.button`
  padding: ${theme.spacing[1]};
  border: none;
  background: transparent;
  color: ${theme.colors.neutral[400]};
  cursor: pointer;
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.danger[500]};
    background: ${theme.colors.danger[50]};
  }
`;

const TodoEmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  color: ${theme.colors.neutral[500]};
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

export const ProfilePage = ({ onNavigate, currentUser, viewingUserId, viewingUsername }: ProfilePageProps) => {
  const [user, setUser] = useState<User>(currentUser);
  const [emotions, setEmotions] = useState<typeof mockEmotionRecords>([]);
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<{ label: string; color: string; emoji: string } | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  const [editingEmotionId, setEditingEmotionId] = useState<string | null>(null);
  const [newEmotion, setNewEmotion] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isEmotionExpanded, setIsEmotionExpanded] = useState(true);
  const [tasks, setTasks] = useState<any>({ physical: [], mental: [], social: [] });
  const [taskStats, setTaskStats] = useState({ completedCount: 0, totalEnergy: 0, maxEnergy: 0, currentEnergy: 0 });
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [badges, setBadges] = useState<any>({ health: [], energy: [], emotion: [], streak: [] });
  const [badgeStats, setBadgeStats] = useState({ earnedCount: 0, totalCount: 0 });
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    showEnergy: true,
    showEmotionStatus: true,
    showEmotionContent: false,
    displayBadges: [] as string[]
  });
  const [availableBadges, setAvailableBadges] = useState<any[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  
  const fetchTodos = async () => {
    console.log('fetchTodos called');
    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('fetchTodos response status:', response.status);
      const data = await response.json();
      console.log('fetchTodos response data:', data);
      if (data.success) {
        setTodos(data.todos);
      }
    } catch (error) {
      console.error('获取待办事项失败:', error);
    }
  };
  
  const handlePasswordChange = async () => {
    setPasswordMessage('');
    
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage('请填写所有字段');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('两次输入的新密码不一致');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('新密码长度不能少于6位');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(passwordForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setPasswordMessage('密码修改成功！');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage(data.message);
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      setPasswordMessage('修改密码失败，请重试');
    }
  };
  
  const addTodo = async () => {
    console.log('addTodo called with:', newTodoText);
    if (!newTodoText.trim()) {
      console.log('Empty todo text, returning');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTodoText.trim() })
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      if (data.success) {
        setTodos(prev => [data.todo, ...prev]);
        setNewTodoText('');
      }
    } catch (error) {
      console.error('添加待办事项失败:', error);
    }
  };
  
  const toggleTodo = async (todoId: string, completed: boolean) => {
    try {
      const response = await fetch(`${API_URL}/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ completed: !completed })
      });
      const data = await response.json();
      if (data.success) {
        setTodos(prev => prev.map(todo => 
          todo._id === todoId ? { ...todo, completed: !completed } : todo
        ));
      }
    } catch (error) {
      console.error('更新待办事项失败:', error);
    }
  };
  
  const deleteTodo = async (todoId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/todos/${todoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setTodos(prev => prev.filter(todo => todo._id !== todoId));
      }
    } catch (error) {
      console.error('删除待办事项失败:', error);
    }
  };
  
  const calendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };
  
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const emotionRecord = emotions.find(
      e => e.createdAt.getDate() === day && 
           e.createdAt.getMonth() === currentMonth.getMonth() &&
           e.createdAt.getFullYear() === currentMonth.getFullYear()
    );
    if (emotionRecord) {
      setSelectedEmotion(emotionLabels[emotionRecord.emotion]);
      setSelectedNote(emotionRecord.note || null);
    } else {
      setSelectedEmotion(null);
      setSelectedNote(null);
    }
  };
  
  const openEmotionModal = () => {
    const emotionRecord = selectedDay ? emotions.find(
      e => e.createdAt.getDate() === selectedDay && 
           e.createdAt.getMonth() === currentMonth.getMonth() &&
           e.createdAt.getFullYear() === currentMonth.getFullYear()
    ) : null;
    
    if (emotionRecord) {
      setEditingEmotionId(emotionRecord.id);
      setNewEmotion(emotionRecord.emotion);
      setNewNote(emotionRecord.note || '');
    } else {
      setEditingEmotionId(null);
      setNewEmotion('');
      setNewNote('');
    }
    setIsEmotionModalOpen(true);
  };
  
  const closeEmotionModal = () => {
    setIsEmotionModalOpen(false);
    setEditingEmotionId(null);
    setNewEmotion('');
    setNewNote('');
  };
  
  const openPrivacyModal = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/privacy`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success && data.user) {
        setPrivacySettings({
          showEnergy: data.user.privacy?.showEnergy ?? true,
          showEmotionStatus: data.user.privacy?.showEmotionStatus ?? true,
          showEmotionContent: data.user.privacy?.showEmotionContent ?? false,
          displayBadges: data.user.privacy?.displayBadges ?? []
        });
        setSelectedBadges(
          (data.user.privacy?.displayBadges ?? []).map((id: string) => String(id))
        );
      }
    } catch (error) {
      console.error('获取隐私设置失败:', error);
    }
    setIsPrivacyModalOpen(true);
  };
  
  const closePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
  };
  
  const handlePrivacyChange = (key: string, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };
  
  const toggleBadgeSelection = (badgeId: string) => {
    setSelectedBadges(prev => {
      if (prev.includes(badgeId)) {
        return prev.filter(id => id !== badgeId);
      } else if (prev.length < 3) {
        return [...prev, badgeId];
      }
      return prev;
    });
  };
  
  const savePrivacySettings = async () => {
    try {
      console.log('开始保存隐私设置...');
      console.log('privacySettings:', privacySettings);
      console.log('selectedBadges:', selectedBadges);
      
      const response = await fetch(`${API_URL}/api/users/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...privacySettings,
          displayBadges: selectedBadges
        })
      });
      
      console.log('响应状态:', response.status);
      const data = await response.json();
      console.log('响应数据:', data);
      
      if (data.success) {
        const savedPrivacy = {
          showEnergy: data.privacy?.showEnergy ?? privacySettings.showEnergy,
          showEmotionStatus: data.privacy?.showEmotionStatus ?? privacySettings.showEmotionStatus,
          showEmotionContent: data.privacy?.showEmotionContent ?? privacySettings.showEmotionContent,
          displayBadges: (data.privacy?.displayBadges ?? selectedBadges).map((id: string) =>
            String(id)
          ),
        };
        setPrivacySettings(savedPrivacy);
        setUser((prev: any) => ({ ...prev, privacy: savedPrivacy }));
        alert('隐私设置保存成功！');
        closePrivacyModal();
      } else {
        alert('保存失败: ' + data.message);
      }
    } catch (error) {
      console.error('保存隐私设置失败:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      alert('保存失败，请重试: ' + errorMessage);
    }
  };
  
  const fetchEmotions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/emotions?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setEmotions(data.data.map((record: any) => ({
          ...record,
          id: record._id,
          createdAt: new Date(record.createdAt)
        })));
      }
    } catch (error) {
      console.error('获取情绪记录失败:', error);
    }
  };

  const handleAddEmotion = async () => {
    if (newEmotion) {
      try {
        if (editingEmotionId) {
          const response = await fetch(`${API_URL}/api/emotions/${editingEmotionId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              emotion: newEmotion,
              intensity: 5,
              note: newNote
            })
          });
          const data = await response.json();
          if (data.success) {
            const updatedRecord = {
              ...data.data,
              id: data.data._id,
              createdAt: new Date(data.data.createdAt)
            };
            setEmotions(prev => prev.map(e => e.id === editingEmotionId ? updatedRecord : e));
            closeEmotionModal();
            if (selectedDay) {
              setSelectedEmotion(emotionLabels[newEmotion as keyof typeof emotionLabels]);
              setSelectedNote(newNote || null);
            }
          }
        } else {
          const targetDate = selectedDay ? 
            new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay) : 
            new Date();
          
          const response = await fetch(`${API_URL}/api/emotions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              emotion: newEmotion,
              intensity: 5,
              note: newNote,
              date: targetDate.toISOString()
            })
          });
          const data = await response.json();
          if (data.success) {
            const newRecord = {
              ...data.data,
              id: data.data._id,
              createdAt: new Date(data.data.createdAt)
            };
            setEmotions(prev => [...prev, newRecord]);
            closeEmotionModal();
            const dayToSelect = selectedDay || today.getDate();
            setSelectedDay(dayToSelect);
            setSelectedEmotion(emotionLabels[newEmotion as keyof typeof emotionLabels]);
            setSelectedNote(newNote || null);
          }
        }
      } catch (error) {
        console.error('处理情绪记录失败:', error);
      }
    }
  };

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await fetch(`${API_URL}/api/tasks/today`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        console.log('任务数据返回:', data.stats);
        setTasks(data.tasks);
        setTaskStats(data.stats);
      }
    } catch (err) {
      console.error('获取任务失败:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ taskId })
      });
      const data = await response.json();
      if (data.success) {
        setUser((prev: any) => ({ ...prev, energyLevel: data.newEnergyLevel }));
        fetchTasks();
        fetchBadges();
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('完成任务失败:', err);
    }
  };

  const fetchBadges = async () => {
    try {
      console.log('开始获取徽章数据...');
      const response = await fetch(`${API_URL}/api/badges/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('徽章API响应状态:', response.status);
      const data = await response.json();
      console.log('徽章API响应数据:', data);
      if (data.success) {
        setBadges(data.badges);
        setBadgeStats({ earnedCount: data.earnedCount, totalCount: data.totalCount });
        
        // 同时计算已获得的徽章
        const earnedBadges: any[] = [];
        (Object.values(data.badges) as any[]).forEach((category: any[]) => {
          category.forEach((badge: any) => {
            if (badge.earned) {
              earnedBadges.push(badge);
            }
          });
        });
        setAvailableBadges(earnedBadges);
        console.log('已获得徽章数量:', earnedBadges.length);
        console.log('已获得徽章列表:', earnedBadges);
      } else {
        console.error('徽章API返回失败:', data.message);
      }
    } catch (err) {
      console.error('获取徽章失败:', err);
    }
  };

  useEffect(() => {
    const isOwn = !viewingUserId || viewingUserId === currentUser.id;
    setIsOwnProfile(isOwn);
    
    const targetUserId = isOwn ? currentUser.id : viewingUserId!;
    
    fetch(`${API_URL}/api/users/${targetUserId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        if (data.user.stats) {
          setStats(data.user.stats);
        }
        if (!isOwn && data.user.followers) {
          setIsFollowing(data.user.followers.some((f: string) => f.toString() === currentUser.id));
        }
      }
    })
    .catch(err => console.error('获取用户信息失败:', err));

    fetchStats(targetUserId);
    
    if (isOwn) {
      fetchFavorites();
      fetchEmotions();
      fetchTasks();
      fetchBadges();
      fetchTodos();
    }
  }, [currentUser, viewingUserId, viewingUsername]);

  useEffect(() => {
    if (isOwnProfile) {
      fetchEmotions();
    }
  }, [currentMonth, isOwnProfile]);

  const fetchStats = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/users/stats/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('获取统计数据失败:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/favorites`, {
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
      const response = await fetch(`${API_URL}/api/users/profile`, {
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

  const handleFollow = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/follow/${user._id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setIsFollowing(data.isFollowing);
        setStats(prev => ({
          ...prev,
          followers: data.followersCount
        }));
      }
    } catch (err) {
      console.error('关注失败:', err);
    }
  };

  const handleBack = () => {
    onNavigate('forum');
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarSection>
          <AvatarWrapper>
            <Avatar>{user.username.slice(0, 1)}</Avatar>
            {isOwnProfile && (
              <EditAvatarButton>
                <Camera size={16} />
              </EditAvatarButton>
            )}
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
          {isOwnProfile ? (
            <>
              <Button variant="outline" onClick={openEditModal}>
                <Edit2 size={18} />
                编辑资料
              </Button>
              <Button onClick={openPrivacyModal}>
                <Settings size={18} />
                设置
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleBack}>
                返回
              </Button>
              <Button 
                onClick={handleFollow}
                style={{ 
                  background: isFollowing ? '#6b7280' : undefined,
                  borderColor: isFollowing ? '#6b7280' : undefined
                }}
              >
                {isFollowing ? '已关注' : '+ 关注'}
              </Button>
            </>
          )}
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
            {!isOwnProfile && (user as any).privacy && (
              <>
                {(user as any).privacy.showEnergy && user.energyLevel !== undefined && (
                  <SectionCard>
                    <SectionHeader>
                      <SectionTitle>⚡ 当前能量</SectionTitle>
                    </SectionHeader>
                    <CardBody>
                      <EnergyBar>
                        <EnergyFill level={Math.min(100, user.energyLevel || 0)} />
                      </EnergyBar>
                      <EnergyLevel>当前能量: {user.energyLevel || 0}</EnergyLevel>
                    </CardBody>
                  </SectionCard>
                )}

                {(user as any).privacy.showEmotionStatus && (
                  <SectionCard>
                    <SectionHeader>
                      <SectionTitle>😊 最近心情</SectionTitle>
                    </SectionHeader>
                    <CardBody>
                      {(user as any).recentEmotion ? (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3], marginBottom: theme.spacing[3] }}>
                            <span style={{ fontSize: '2rem' }}>
                              {emotionLabels[(user as any).recentEmotion.emotion]?.emoji || '📝'}
                            </span>
                            <div>
                              <div style={{ fontWeight: theme.fonts.weights.bold, color: theme.colors.neutral[800] }}>
                                {emotionLabels[(user as any).recentEmotion.emotion]?.label || (user as any).recentEmotion.emotion}
                                {' · '}强度 {(user as any).recentEmotion.intensity}/10
                              </div>
                              <div style={{ fontSize: theme.fonts.sizes.sm, color: theme.colors.neutral[500] }}>
                                {new Date((user as any).recentEmotion.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          {(user as any).recentEmotion.note ? (
                            <p style={{ color: theme.colors.neutral[600], fontSize: theme.fonts.sizes.sm, margin: 0 }}>
                              {(user as any).recentEmotion.note}
                            </p>
                          ) : (user as any).privacy.showEmotionContent ? (
                            <p style={{ color: theme.colors.neutral[400], fontSize: theme.fonts.sizes.sm }}>暂无心情备注</p>
                          ) : (
                            <p style={{ color: theme.colors.neutral[400], fontSize: theme.fonts.sizes.sm }}>对方未公开心情备注</p>
                          )}
                        </div>
                      ) : (
                        <p style={{ color: theme.colors.neutral[400], textAlign: 'center' }}>暂无情绪记录</p>
                      )}
                    </CardBody>
                  </SectionCard>
                )}

                <SectionCard>
                  <SectionHeader>
                    <SectionTitle>🏆 展示徽章</SectionTitle>
                  </SectionHeader>
                  <CardBody>
                    {((user as any).displayBadges || []).length > 0 ? (
                      <BadgeGrid>
                        {((user as any).displayBadges || []).map((badge: any) => (
                          <BadgeItem key={badge._id} earned>
                            <BadgeIcon earned>{badge.icon}</BadgeIcon>
                            <BadgeName>{badge.name}</BadgeName>
                          </BadgeItem>
                        ))}
                      </BadgeGrid>
                    ) : (
                      <p style={{ color: theme.colors.neutral[400], textAlign: 'center' }}>
                        {(user as any).privacy.displayBadges?.length > 0
                          ? '所选展示徽章暂不可用'
                          : '暂未设置展示徽章'}
                      </p>
                    )}
                  </CardBody>
                </SectionCard>
              </>
            )}

            {isOwnProfile && (
            <>
              <SectionCard>
                <SectionHeader>
                  <SectionTitle>⚡ 身心健康任务</SectionTitle>
                </SectionHeader>
                <CardBody>
                  <EnergyBar>
                    <EnergyFill level={Math.min(100, user.energyLevel || 0)} />
                  </EnergyBar>
                  <EnergyLevel>当前能量: {user.energyLevel || 0}</EnergyLevel>
                  
                  <TaskStats>
                    <TaskStatItem>
                      <TaskStatValue>{taskStats.completedCount}</TaskStatValue>
                      <TaskStatLabel>已完成</TaskStatLabel>
                    </TaskStatItem>
                    <TaskStatItem>
                      <TaskStatValue>{taskStats.totalEnergy}</TaskStatValue>
                      <TaskStatLabel>今日获得</TaskStatLabel>
                    </TaskStatItem>
                  </TaskStats>
                  
                  <TaskSection>
                    <TaskCategory>
                      <TaskCategoryTitle>🥗 身体健康</TaskCategoryTitle>
                      <TaskList>
                        {tasks.physical.map((task: any) => (
                          <TaskItem
                            key={task._id}
                            completed={task.isCompleted}
                            disabled={task.isCompleted}
                            onClick={() => !task.isCompleted && handleCompleteTask(task._id)}
                          >
                            <TaskIcon>{task.icon}</TaskIcon>
                            <TaskInfo>
                              <TaskName>{task.name}</TaskName>
                              <TaskReward>+{task.energyReward}能量</TaskReward>
                            </TaskInfo>
                            <TaskStatus>{task.isCompleted ? '✓' : ''}</TaskStatus>
                          </TaskItem>
                        ))}
                      </TaskList>
                    </TaskCategory>
                    
                    <TaskCategory>
                      <TaskCategoryTitle>🧠 心理健康</TaskCategoryTitle>
                      <TaskList>
                        {tasks.mental.map((task: any) => (
                          <TaskItem
                            key={task._id}
                            completed={task.isCompleted}
                            disabled={task.isCompleted}
                            onClick={() => !task.isCompleted && handleCompleteTask(task._id)}
                          >
                            <TaskIcon>{task.icon}</TaskIcon>
                            <TaskInfo>
                              <TaskName>{task.name}</TaskName>
                              <TaskReward>+{task.energyReward}能量</TaskReward>
                            </TaskInfo>
                            <TaskStatus>{task.isCompleted ? '✓' : ''}</TaskStatus>
                          </TaskItem>
                        ))}
                      </TaskList>
                    </TaskCategory>
                    
                    <TaskCategory>
                      <TaskCategoryTitle>💝 社交健康</TaskCategoryTitle>
                      <TaskList>
                        {tasks.social.map((task: any) => (
                          <TaskItem
                            key={task._id}
                            completed={task.isCompleted}
                            disabled={task.isCompleted}
                            onClick={() => !task.isCompleted && handleCompleteTask(task._id)}
                          >
                            <TaskIcon>{task.icon}</TaskIcon>
                            <TaskInfo>
                              <TaskName>{task.name}</TaskName>
                              <TaskReward>+{task.energyReward}能量</TaskReward>
                            </TaskInfo>
                            <TaskStatus>{task.isCompleted ? '✓' : ''}</TaskStatus>
                          </TaskItem>
                        ))}
                      </TaskList>
                    </TaskCategory>
                  </TaskSection>
                </CardBody>
              </SectionCard>

              <SectionCard>
                <SectionHeader onClick={() => setIsEmotionExpanded(!isEmotionExpanded)} style={{ cursor: 'pointer' }}>
                  <SectionTitle>情绪记录</SectionTitle>
                  <SectionAction style={{ display: 'flex', alignItems: 'center', gap: isEmotionExpanded ? theme.spacing[2] : theme.spacing[3] }}>
                    {!isEmotionExpanded && (
                      <EmotionStats>
                        {Object.entries(emotionLabels).map(([key, value]) => {
                          const count = emotions.filter(e => 
                            e.emotion === key && 
                            e.createdAt.getMonth() === currentMonth.getMonth() && 
                            e.createdAt.getFullYear() === currentMonth.getFullYear()
                          ).length;
                          if (count === 0) return null;
                          return (
                            <EmotionStatItem key={key}>
                              <EmotionStatColor color={value.color} />
                              <EmotionStatCount>{count}</EmotionStatCount>
                            </EmotionStatItem>
                          );
                        })}
                      </EmotionStats>
                    )}
                    {isEmotionExpanded ? '收起' : '展开'}
                    <ChevronRight size={16} style={{ transform: isEmotionExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </SectionAction>
                </SectionHeader>
                {isEmotionExpanded && (
                <CardBody>
                  <EmotionCalendar>
                    <CalendarSection>
                      <CalendarHeader>
                        <CalendarNav onClick={(e) => { e.stopPropagation(); setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1)); }}>
                          <ChevronLeft size={18} />
                        </CalendarNav>
                        <CalendarTitle>{currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月</CalendarTitle>
                        <CalendarNav onClick={(e) => { e.stopPropagation(); setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1)); }}>
                          <ChevronRight size={18} />
                        </CalendarNav>
                      </CalendarHeader>
                      
                      <WeekDays>
                        {weekDays.map(day => (
                          <WeekDay key={day}>{day}</WeekDay>
                        ))}
                      </WeekDays>
                      
                      <CalendarGrid>
                        {calendarDays().map((day: number | null, index: number) => {
                          if (!day) {
                            return <div key={index} />;
                          }
                          const emotionRecord = emotions.find(
                            e => e.createdAt.getDate() === day && 
                                 e.createdAt.getMonth() === currentMonth.getMonth() &&
                                 e.createdAt.getFullYear() === currentMonth.getFullYear()
                          );
                          const emotionInfo = emotionRecord ? emotionLabels[emotionRecord.emotion] : null;
                          const isSelected = selectedDay === day;
                          
                          return (
                            <CalendarDay
                              key={day}
                              hasEmotion={!!emotionRecord}
                              emotionColor={emotionInfo?.color}
                              isSelected={isSelected}
                              onClick={(e) => { e.stopPropagation(); handleDayClick(day); }}
                            >
                              <DayNumber>{day}</DayNumber>
                              {emotionInfo && <DayEmotion>{emotionInfo.emoji}</DayEmotion>}
                            </CalendarDay>
                          );
                        })}
                      </CalendarGrid>
                      
                      <EmotionLegend>
                        {Object.entries(emotionLabels).map(([key, value]) => (
                          <LegendItem key={key}>
                            <LegendColor color={value.color} />
                            <LegendLabel>{value.emoji} {value.label}</LegendLabel>
                          </LegendItem>
                        ))}
                      </EmotionLegend>
                    </CalendarSection>
                    
                    <DetailSection>
                      {selectedDay ? (
                        <EmotionDetail>
                          <DetailHeader>
                            <DetailEmoji>{selectedEmotion?.emoji || '📝'}</DetailEmoji>
                            <DetailInfo>
                              <DetailDate>{currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月{selectedDay}日</DetailDate>
                              <DetailEmotion>{selectedEmotion?.label || '暂无记录'}</DetailEmotion>
                            </DetailInfo>
                          </DetailHeader>
                          {selectedNote && <DetailNote>{selectedNote}</DetailNote>}
                          {!selectedEmotion && <DetailNote>点击上方日历选择有记录的日期查看详情，或记录今日情绪</DetailNote>}
                        </EmotionDetail>
                      ) : (
                        <EmotionDetail>
                          <DetailHeader>
                            <DetailEmoji>📅</DetailEmoji>
                            <DetailInfo>
                              <DetailEmotion>选择日期</DetailEmotion>
                            </DetailInfo>
                          </DetailHeader>
                          <DetailNote>点击左侧日历中的日期查看当天情绪记录详情</DetailNote>
                        </EmotionDetail>
                      )}
                      
                      <AddEmotionBtn onClick={(e) => { e.stopPropagation(); openEmotionModal(); }}>
                        <Plus size={18} style={{ marginRight: theme.spacing[2], display: 'inline' }} />
                        {selectedDay ? (selectedEmotion ? '编辑情绪' : '记录情绪') : '记录今日情绪'}
                      </AddEmotionBtn>
                    </DetailSection>
                  </EmotionCalendar>
                </CardBody>
                )}
              </SectionCard>

              <SectionCard>
                <SectionHeader>
                  <SectionTitle>🏆 成就徽章</SectionTitle>
                </SectionHeader>
                <CardBody>
                  <BadgeStats>
                    <BadgeCount>已获得 {badgeStats.earnedCount} / {badgeStats.totalCount}</BadgeCount>
                    <BadgeProgress>继续加油解锁更多徽章！</BadgeProgress>
                  </BadgeStats>
                  
                  <BadgeSection>
                    <BadgeCategory>
                      <BadgeCategoryTitle>🥗 身心健康</BadgeCategoryTitle>
                      <BadgeGrid>
                        {badges.health.map((badge: any) => (
                          <BadgeItem key={badge._id} earned={badge.earned}>
                            <BadgeIcon earned={badge.earned}>{badge.icon}</BadgeIcon>
                            <BadgeName>{badge.name}</BadgeName>
                            <BadgeDescription>{badge.description}</BadgeDescription>
                            <BadgeProgressBar>
                              <BadgeProgressFill progress={badge.progress || 0} earned={badge.earned} />
                            </BadgeProgressBar>
                            <BadgeProgressText>{badge.current || 0} / {badge.target || 0}</BadgeProgressText>
                          </BadgeItem>
                        ))}
                      </BadgeGrid>
                    </BadgeCategory>
                    
                    <BadgeCategory>
                      <BadgeCategoryTitle>⚡ 能量积累</BadgeCategoryTitle>
                      <BadgeGrid>
                        {badges.energy.map((badge: any) => (
                          <BadgeItem key={badge._id} earned={badge.earned}>
                            <BadgeIcon earned={badge.earned}>{badge.icon}</BadgeIcon>
                            <BadgeName>{badge.name}</BadgeName>
                            <BadgeDescription>{badge.description}</BadgeDescription>
                            <BadgeProgressBar>
                              <BadgeProgressFill progress={badge.progress || 0} earned={badge.earned} />
                            </BadgeProgressBar>
                            <BadgeProgressText>{badge.current || 0} / {badge.target || 0}</BadgeProgressText>
                          </BadgeItem>
                        ))}
                      </BadgeGrid>
                    </BadgeCategory>
                    
                    <BadgeCategory>
                      <BadgeCategoryTitle>😊 情绪记录</BadgeCategoryTitle>
                      <BadgeGrid>
                        {badges.emotion.map((badge: any) => (
                          <BadgeItem key={badge._id} earned={badge.earned}>
                            <BadgeIcon earned={badge.earned}>{badge.icon}</BadgeIcon>
                            <BadgeName>{badge.name}</BadgeName>
                            <BadgeDescription>{badge.description}</BadgeDescription>
                            <BadgeProgressBar>
                              <BadgeProgressFill progress={badge.progress || 0} earned={badge.earned} />
                            </BadgeProgressBar>
                            <BadgeProgressText>{badge.current || 0} / {badge.target || 0}</BadgeProgressText>
                          </BadgeItem>
                        ))}
                      </BadgeGrid>
                    </BadgeCategory>
                    
                    <BadgeCategory>
                      <BadgeCategoryTitle>📅 连续打卡</BadgeCategoryTitle>
                      <BadgeGrid>
                        {badges.streak.map((badge: any) => (
                          <BadgeItem key={badge._id} earned={badge.earned}>
                            <BadgeIcon earned={badge.earned}>{badge.icon}</BadgeIcon>
                            <BadgeName>{badge.name}</BadgeName>
                            <BadgeDescription>{badge.description}</BadgeDescription>
                            <BadgeProgressBar>
                              <BadgeProgressFill progress={badge.progress || 0} earned={badge.earned} />
                            </BadgeProgressBar>
                            <BadgeProgressText>{badge.current || 0} / {badge.target || 0}</BadgeProgressText>
                          </BadgeItem>
                        ))}
                      </BadgeGrid>
                    </BadgeCategory>
                  </BadgeSection>
                </CardBody>
              </SectionCard>
            </>
          )}

          <SectionCard>
            <SectionHeader>
              <SectionTitle>{isOwnProfile ? '我的收藏' : `${user.username} 的收藏`}</SectionTitle>
            </SectionHeader>
            <CardBody>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: theme.spacing[8], color: theme.colors.neutral[500] }}>
                  <Bookmark size={48} style={{ marginBottom: theme.spacing[3], opacity: 0.5 }} />
                  <p>{isOwnProfile ? '还没有收藏任何帖子' : `${user.username} 还没有收藏任何帖子`}</p>
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

{isOwnProfile && (
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

            <ChevronRight
              size={18}
              color={theme.colors.neutral[400]}
            />
          </MenuItem>
        ))}
      </CardBody>
    </Card>

    <SidebarContent>
      <SectionCard>
        <SectionHeader>
          <SectionTitle>📝 待办事项</SectionTitle>
        </SectionHeader>

        <CardBody>
          <TodoInputWrapper>
            <TodoInput
              type="text"
              value={newTodoText}
              onChange={(e) =>
                setNewTodoText(e.target.value)
              }
              onKeyPress={(e) =>
                e.key === 'Enter' && addTodo()
              }
              placeholder="添加新的待办事项..."
            />

            <Button onClick={addTodo}>
              <Plus size={18} />
            </Button>
          </TodoInputWrapper>

          <TodoList>
            {todos.length > 0 ? (
              todos.map((todo) => (
                <TodoItem
                  key={todo._id}
                  completed={todo.completed}
                >
                  <TodoCheckbox
                    checked={todo.completed}
                    onClick={() =>
                      toggleTodo(
                        todo._id,
                        todo.completed
                      )
                    }
                  >
                    {todo.completed && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </TodoCheckbox>

                  <TodoText completed={todo.completed}>
                    {todo.title}
                  </TodoText>

                  <TodoDeleteBtn
                    onClick={() => deleteTodo(todo._id)}
                  >
                    <Trash2 size={16} />
                  </TodoDeleteBtn>
                </TodoItem>
              ))
            ) : (
              <TodoEmptyState>
                <Bookmark
                  size={48}
                  style={{
                    marginBottom: theme.spacing[3],
                    opacity: 0.5,
                  }}
                />

                <p>还没有待办事项</p>

                <p
                  style={{
                    fontSize:
                      theme.fonts.sizes.sm,
                  }}
                >
                  添加一个新的任务开始吧！
                </p>
              </TodoEmptyState>
            )}
          </TodoList>
        </CardBody>
      </SectionCard>
    </SidebarContent>
  </MenuSection>
)}

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

      <ModalOverlay isOpen={isEmotionModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingEmotionId ? '编辑情绪记录' : 
               selectedDay ? `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月${selectedDay}日情绪` : '记录今日情绪'}
            </ModalTitle>
            <CloseButton onClick={closeEmotionModal}>
              <X size={18} />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <FormLabel>选择情绪</FormLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[2] }}>
                {Object.entries(emotionLabels).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setNewEmotion(key)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: theme.spacing[1],
                      padding: theme.spacing[3],
                      borderRadius: theme.borderRadius.md,
                      border: newEmotion === key ? `2px solid ${value.color}` : '2px solid transparent',
                      background: newEmotion === key ? `${value.color}10` : theme.colors.neutral[50],
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{value.emoji}</span>
                    <span style={{ fontSize: theme.fonts.sizes.sm, color: theme.colors.neutral[700] }}>{value.label}</span>
                  </button>
                ))}
              </div>
            </FormGroup>

            <FormGroup>
              <FormLabel>心情备注（可选）</FormLabel>
              <FormTextarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="记录一下现在的心情..."
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={closeEmotionModal}>取消</Button>
            <Button onClick={handleAddEmotion} disabled={!newEmotion}>
              <Save size={18} />
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>

      <ModalOverlay isOpen={isPrivacyModalOpen}>
        <ModalContent style={{ maxWidth: '500px' }}>
          <ModalHeader>
            <ModalTitle>隐私设置</ModalTitle>
            <CloseButton onClick={closePrivacyModal}>
              <X size={18} />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <PrivacySection>
              <PrivacySectionTitle>个人主页展示</PrivacySectionTitle>
              
              <PrivacyItem>
                <PrivacyItemContent>
                  <PrivacyItemTitle>展示能量值</PrivacyItemTitle>
                  <PrivacyItemDesc>其他人可以看到你的当前能量值</PrivacyItemDesc>
                </PrivacyItemContent>
                <PrivacyToggle
                  type="checkbox"
                  checked={privacySettings.showEnergy}
                  onChange={(e) => handlePrivacyChange('showEnergy', e.target.checked)}
                />
              </PrivacyItem>

              <PrivacyItem>
                <PrivacyItemContent>
                  <PrivacyItemTitle>展示情绪状态</PrivacyItemTitle>
                  <PrivacyItemDesc>其他人可以看到你最近的情绪图标</PrivacyItemDesc>
                </PrivacyItemContent>
                <PrivacyToggle
                  type="checkbox"
                  checked={privacySettings.showEmotionStatus}
                  onChange={(e) => handlePrivacyChange('showEmotionStatus', e.target.checked)}
                />
              </PrivacyItem>

              <PrivacyItem>
                <PrivacyItemContent>
                  <PrivacyItemTitle>展示情绪内容</PrivacyItemTitle>
                  <PrivacyItemDesc>其他人可以看到你记录的心情备注</PrivacyItemDesc>
                </PrivacyItemContent>
                <PrivacyToggle
                  type="checkbox"
                  checked={privacySettings.showEmotionContent}
                  onChange={(e) => handlePrivacyChange('showEmotionContent', e.target.checked)}
                />
              </PrivacyItem>
            </PrivacySection>

            <PrivacySection>
              <PrivacySectionTitle>徽章展示</PrivacySectionTitle>
              <PrivacyItemDesc style={{ marginBottom: theme.spacing[3] }}>
                选择最多3个徽章展示在个人主页（已获得 {availableBadges.length} 个徽章）
              </PrivacyItemDesc>
              
              <PrivacyBadgeGrid>
                {availableBadges.length > 0 ? (
                  availableBadges.map(badge => (
                    <PrivacyBadgeItem 
                      key={badge._id}
                      selected={selectedBadges.includes(badge._id)}
                      onClick={() => toggleBadgeSelection(badge._id)}
                    >
                      <PrivacyBadgeIcon>{badge.icon}</PrivacyBadgeIcon>
                      <PrivacyBadgeName>{badge.name}</PrivacyBadgeName>
                    </PrivacyBadgeItem>
                  ))
                ) : (
                  <EmptyState>
                    <Award size={48} color={theme.colors.neutral[300]} />
                    <p style={{ marginTop: theme.spacing[2], color: theme.colors.neutral[500] }}>
                      还没有获得任何徽章
                    </p>
                  </EmptyState>
                )}
              </PrivacyBadgeGrid>
              
              <SelectedCount>
                已选择 {selectedBadges.length}/3 个徽章
              </SelectedCount>
            </PrivacySection>

            <PrivacySection>
              <PrivacySectionTitle>修改密码</PrivacySectionTitle>
              
              <FormGroup>
                <FormLabel>原密码</FormLabel>
                <FormInput
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                  placeholder="请输入原密码"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>新密码</FormLabel>
                <FormInput
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="请输入新密码（至少6位）"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>确认新密码</FormLabel>
                <FormInput
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="请再次输入新密码"
                />
              </FormGroup>
              
              {passwordMessage && (
                <div style={{ 
                  padding: theme.spacing[3], 
                  borderRadius: theme.borderRadius.md,
                  background: passwordMessage.includes('成功') ? theme.colors.success[50] : theme.colors.danger[50],
                  color: passwordMessage.includes('成功') ? theme.colors.success[600] : theme.colors.danger[600],
                  marginBottom: theme.spacing[3],
                  textAlign: 'center'
                }}>
                  {passwordMessage}
                </div>
              )}
            </PrivacySection>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={closePrivacyModal}>取消</Button>
            <Button onClick={savePrivacySettings}>
              <Save size={18} />
              保存设置
            </Button>
            <Button variant="secondary" onClick={handlePasswordChange}>
              修改密码
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </ProfileContainer>
  );
};