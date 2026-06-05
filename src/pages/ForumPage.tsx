import { useEffect, useMemo, useState } from 'react';

import styled, { keyframes } from 'styled-components';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Plus,
  Filter,
  Search,
  X,
  Sparkles,
  TrendingUp,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';

import { theme } from '../styles/theme';
import { API_URL } from '../config/api';

import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import UserProfileModal from '../components/UserProfileModal';

interface PostAuthor {
  _id: string;
  username: string;
  email: string;
}

interface Comment {
  _id: string;
  author: PostAuthor;
  content: string;
  replyTo?: PostAuthor;
  replyToComment?: string;
  createdAt: string;
}

interface Post {
  _id: string;
  author: PostAuthor;
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface Friend {
  _id: string;
  username: string;
  email: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface ForumPageProps {
  onNavigate: (page: string) => void;
  currentUser: User;
}

/* =========================
   Styled Components
========================= */
const noiseMove = keyframes`
  0% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(-1%, 1%);
  }

  50% {
    transform: translate(1%, -1%);
  }

  75% {
    transform: translate(1%, 1%);
  }

  100% {
    transform: translate(0, 0);
  }
`;
const ForumContainer = styled.div`
  position: relative;

  min-height: 100vh;

  overflow: hidden;

  background:
    radial-gradient(
      circle at top left,
      rgba(99, 102, 241, 0.12),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(96, 165, 250, 0.12),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #f8fafc 0%,
      #eef4ff 100%
    );

  padding: 48px 24px;

  /* 白噪声层 */
  &::before {
  
    content: '';

    position: absolute;
    inset: 0;

    pointer-events: none;

    opacity: 0.045;

    z-index: 0;
    animation: ${noiseMove} 0.25s steps(2) infinite;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");

    mix-blend-mode: soft-light;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const ForumContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const ForumHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 48px;

  flex-wrap: wrap;
  gap: 24px;
`;

const HeaderLeft = styled.div``;

const ForumBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 16px;

  border-radius: 999px;

  background: rgba(255,255,255,0.7);

  backdrop-filter: blur(12px);

  color: #6366f1;

  font-size: 14px;
  font-weight: 600;

  margin-bottom: 18px;
`;

const ForumTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);

  font-weight: 800;

  line-height: 1.1;

  letter-spacing: -0.04em;

  color: #111827;

  margin-bottom: 14px;
`;

const ForumSubtitle = styled.p`
  font-size: 1.05rem;

  line-height: 1.8;

  color: #6b7280;

  max-width: 620px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 320px;

  padding: 14px 18px 14px 48px;

  border-radius: 18px;

  border: none;

  background: rgba(255,255,255,0.72);

  backdrop-filter: blur(14px);

  box-shadow:
    inset 0 1px 2px rgba(255,255,255,0.7),
    0 10px 30px rgba(15,23,42,0.06);

  font-size: 15px;

  transition: all 0.3s ease;

  &:focus {
    outline: none;

    box-shadow:
      0 0 0 4px rgba(99,102,241,0.14),
      0 12px 30px rgba(15,23,42,0.08);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;

  color: #9ca3af;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 14px 18px;

  border-radius: 18px;

  border: none;

  background: rgba(255,255,255,0.72);

  backdrop-filter: blur(14px);

  box-shadow:
    0 10px 30px rgba(15,23,42,0.06);

  color: #4b5563;

  cursor: pointer;

  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);

    background: white;
  }
`;

const CreateButton = styled(Button)`
  border-radius: 18px !important;

  padding: 14px 22px !important;

  box-shadow:
    0 14px 40px rgba(99,102,241,0.25);

  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-3px);
  }
`;

const ForumContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;

  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const PostsList = styled.div``;

const PostCard = styled(Card)`
  margin-bottom: 28px;

  border-radius: 28px !important;

  background: rgba(255,255,255,0.72);

  backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,0.85);

  box-shadow:
    0 10px 40px rgba(15,23,42,0.08);

  transition: all 0.3s ease !important;

  overflow: hidden;

  &:hover {
    transform: translateY(-6px);

    box-shadow:
      0 24px 60px rgba(15,23,42,0.12);
  }
`;

const PostHeaderStyled = styled(CardHeader)`
  display: flex;
  align-items: center;
  gap: 16px;

  padding-bottom: 20px;
`;

const PostAvatar = styled.div`
  width: 54px;
  height: 54px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    #6366f1 0%,
    #8b5cf6 100%
  );

  color: white;

  font-weight: 700;
`;

const PostAuthorInfo = styled.div`
  flex: 1;
`;

const PostAuthor = styled.div`
  font-size: 16px;
  font-weight: 700;

  color: #111827;

  margin-bottom: 4px;
`;

const PostMeta = styled.div`
  font-size: 14px;

  color: #9ca3af;
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 40px;

  border-radius: 12px;

  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  background: rgba(239,68,68,0.08);

  color: #ef4444;

  transition: all 0.25s ease;

  &:hover {
    background: rgba(239,68,68,0.16);
  }
`;

const PostTitle = styled.h2`
  font-size: 1.7rem;

  font-weight: 800;

  line-height: 1.4;

  color: #111827;

  margin-bottom: 18px;
`;

const PostContent = styled.p`
  color: #6b7280;

  line-height: 1.9;

  margin-bottom: 28px;

  white-space: pre-wrap;
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  margin-bottom: 28px;
`;

const StyledTag = styled(Tag)`
  background: rgba(99,102,241,0.08) !important;

  color: #6366f1 !important;

  border-radius: 999px !important;

  border: none !important;

  padding: 6px 12px !important;
`;

const Divider = styled.div`
  height: 1px;

  background: rgba(229,231,235,0.7);

  margin-bottom: 18px;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  flex-wrap: wrap;
  gap: 16px;
`;

const PostActions = styled.div`
  display: flex;
  gap: 12px;

  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 16px;

  border-radius: 14px;

  border: none;

  background: transparent;

  color: #6b7280;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    background: rgba(99,102,241,0.08);

    color: #6366f1;
  }

  &.liked {
    color: #ef4444;
  }

  &.favorited {
    color: #6366f1;
  }
`;

const ReadMore = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 600;

  color: #6366f1;
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 24px;
`;

const SidebarCard = styled(Card)`
  margin-bottom: 24px;

  border-radius: 28px !important;

  background: rgba(255,255,255,0.72);

  backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,0.85);

  box-shadow:
    0 10px 40px rgba(15,23,42,0.06);
`;

const SidebarTitle = styled.h3`
  font-size: 1.15rem;

  font-weight: 700;

  color: #111827;
`;

const CommunityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 14px;

  border-radius: 18px;

  transition: all 0.25s ease;

  cursor: pointer;

  &:hover {
    background: rgba(99,102,241,0.06);

    transform: translateX(4px);
  }
`;

const CommunityIcon = styled.div`
  width: 48px;
  height: 48px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    #6366f1 0%,
    #8b5cf6 100%
  );

  color: white;

  font-weight: 700;
`;

const CommunityInfo = styled.div``;

const CommunityName = styled.div`
  font-weight: 700;

  color: #111827;

  margin-bottom: 4px;
`;

const CommunityMembers = styled.div`
  font-size: 14px;

  color: #9ca3af;
`;

const TrendingTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(15,23,42,0.4);

  backdrop-filter: blur(10px);

  z-index: 999;

  opacity: ${({ isOpen }) => isOpen ? 1 : 0};

  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};

  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  width: 90%;
  max-width: 720px;

  border-radius: 32px;

  background: rgba(255,255,255,0.92);

  backdrop-filter: blur(20px);

  box-shadow:
    0 30px 80px rgba(15,23,42,0.18);

  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 28px 32px;

  border-bottom: 1px solid rgba(229,231,235,0.7);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;

  font-weight: 800;

  color: #111827;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;

  border-radius: 12px;

  border: none;

  background: rgba(243,244,246,0.8);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    background: rgba(229,231,235,1);
  }
`;

const ModalBody = styled.div`
  padding: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;

  font-size: 15px;
  font-weight: 700;

  color: #374151;

  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;

  padding: 16px 18px;

  border-radius: 18px;

  border: none;

  background: rgba(243,244,246,0.8);

  font-size: 15px;

  transition: all 0.25s ease;

  &:focus {
    outline: none;

    box-shadow:
      0 0 0 4px rgba(99,102,241,0.12);
  }
`;

const TextArea = styled.textarea`
  width: 100%;

  min-height: 220px;

  padding: 18px;

  border-radius: 20px;

  border: none;

  resize: none;

  background: rgba(243,244,246,0.8);

  font-size: 15px;

  line-height: 1.8;

  transition: all 0.25s ease;

  &:focus {
    outline: none;

    box-shadow:
      0 0 0 4px rgba(99,102,241,0.12);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;

  padding: 24px 32px;

  border-top: 1px solid rgba(229,231,235,0.7);
`;

const CommentsSection = styled.div`
  margin-top: 24px;
`;

const CommentsList = styled.div`
  margin-bottom: 18px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 14px;

  padding: 16px 0;

  border-bottom: 1px solid rgba(229,231,235,0.6);
`;

const CommentAvatar = styled.div`
  width: 42px;
  height: 42px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    #6366f1 0%,
    #8b5cf6 100%
  );

  color: white;

  font-weight: 700;

  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentAuthor = styled.div`
  font-weight: 700;

  color: #111827;

  margin-bottom: 4px;
`;

const CommentTime = styled.div`
  font-size: 13px;

  color: #9ca3af;

  margin-bottom: 8px;
`;

const CommentText = styled.div`
  line-height: 1.8;

  color: #4b5563;

  white-space: pre-wrap;
`;

const ReplyInfo = styled.div`
  margin-bottom: 8px;

  color: #6366f1;

  font-size: 14px;

  font-weight: 600;
`;

const ReplyButton = styled.button`
  margin-top: 10px;

  border: none;

  background: rgba(99,102,241,0.08);

  color: #6366f1;

  padding: 8px 12px;

  border-radius: 12px;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    background: rgba(99,102,241,0.14);
  }
`;

const CommentInputWrapper = styled.div`
  display: flex;
  gap: 12px;

  margin-top: 16px;
`;

const CommentInput = styled.input`
  flex: 1;

  border: none;

  background: rgba(243,244,246,0.8);

  padding: 14px 16px;

  border-radius: 16px;

  font-size: 14px;

  &:focus {
    outline: none;

    box-shadow:
      0 0 0 4px rgba(99,102,241,0.12);
  }
`;

const CommentSubmit = styled.button`
  border: none;

  border-radius: 16px;

  padding: 0 18px;

  background: #6366f1;

  color: white;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    background: #4f46e5;
  }
`;

const ReplyNotice = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 14px;

  padding: 10px 14px;

  border-radius: 14px;

  background: rgba(99,102,241,0.08);

  color: #6366f1;

  font-size: 14px;

  font-weight: 600;
`;

const CancelReplyButton = styled.button`
  border: none;

  background: transparent;

  color: #9ca3af;

  cursor: pointer;
`;

const ShareModalContent = styled.div`
  width: 90%;
  max-width: 500px;

  border-radius: 28px;

  background: rgba(255,255,255,0.94);

  backdrop-filter: blur(20px);

  overflow: hidden;
`;

const ShareOption = styled.button`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  padding: 16px;

  border: none;

  border-radius: 18px;

  background: transparent;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    background: rgba(99,102,241,0.06);
  }
`;

const ShareIcon = styled.div`
  width: 48px;
  height: 48px;

  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(99,102,241,0.08);

  color: #6366f1;
`;

const ShareText = styled.div`
  text-align: left;
`;

const ShareTitle = styled.div`
  font-weight: 700;

  color: #111827;

  margin-bottom: 4px;
`;

const ShareDesc = styled.div`
  font-size: 14px;

  color: #9ca3af;
`;

const CopiedMessage = styled.div`
  margin-top: 14px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  background: rgba(34,197,94,0.1);

  color: #16a34a;

  padding: 10px 14px;

  border-radius: 12px;
`;

const FriendsList = styled.div`
  max-height: 220px;

  overflow-y: auto;

  margin-top: 16px;
`;

const FriendItem = styled.button<{ selected: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 14px;

  padding: 14px;

  border-radius: 18px;

  border: ${({ selected }) =>
    selected
      ? '2px solid #6366f1'
      : '2px solid transparent'};

  background: ${({ selected }) =>
    selected
      ? 'rgba(99,102,241,0.08)'
      : 'transparent'};

  cursor: pointer;

  transition: all 0.25s ease;

  margin-bottom: 10px;

  &:hover {
    background: rgba(99,102,241,0.06);
  }
`;

const FriendAvatar = styled.div`
  width: 42px;
  height: 42px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    #6366f1 0%,
    #8b5cf6 100%
  );

  color: white;

  font-weight: 700;
`;

const FriendName = styled.div`
  flex: 1;

  font-weight: 700;

  text-align: left;
`;

/* =========================
   Component
========================= */

export const ForumPage = ({
  onNavigate,
  currentUser,
}: ForumPageProps) => {

  const [posts, setPosts] = useState<Post[]>([]);

  const [favorites, setFavorites] = useState<string[]>([]);

  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);

  const [commentInputs, setCommentInputs] =
    useState<Record<string, string>>({});

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [title, setTitle] = useState('');

  const [content, setContent] = useState('');

  const [tags, setTags] = useState('');

  const [replyTo, setReplyTo] = useState<{
    postId: string;
    commentId: string;
    authorId: string;
    authorName: string;
  } | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] =
    useState(false);

  const [sharePostId, setSharePostId] =
    useState<string | null>(null);

  const [shareFriends, setShareFriends] =
    useState<Friend[]>([]);

  const [selectedFriend, setSelectedFriend] =
    useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [following, setFollowing] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingUserId, setViewingUserId] = useState('');
  const [viewingUsername, setViewingUsername] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchFavorites();
    fetchFollowing();
    fetchFriends();
  }, []);

  const fetchFollowing = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.user && data.user.following) {
        setFollowing(data.user.following.map((f: string) => f.toString()));
      }
    } catch (err) {
      console.error('获取关注列表失败:', err);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${API_URL}/api/friends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success && data.friends) {
        setFriends(data.friends.map((f: any) => f._id.toString()));
      }
    } catch (err) {
      console.error('获取好友列表失败:', err);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/users/follow/${userId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setFollowing(prev => 
          data.isFollowing 
            ? [...prev, userId]
            : prev.filter(id => id !== userId)
        );
      } else {
        if (data.message === '已经是好友，默认已关注') {
          setFollowing(prev => [...new Set([...prev, userId])]);
        }
      }
    } catch (err) {
      console.error('关注失败:', err);
    }
  };

  const handleViewProfile = (userId: string, username: string) => {
    setViewingUserId(String(userId));
    setViewingUsername(username);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setViewingUserId('');
    setViewingUsername('');
  };

  const totalComments = useMemo(() => {
    return posts.reduce(
      (sum, post) => sum + post.comments.length,
      0
    );
  }, [posts]);

  const totalLikes = useMemo(() => {
    return posts.reduce(
      (sum, post) => sum + post.likes.length,
      0
    );
  }, [posts]);

  const fetchPosts = async () => {
    try {

      const response = await fetch(
        `${API_URL}/api/forum/posts`,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      }

    } catch (err) {
      console.error('获取帖子失败:', err);
    }
  };

  const fetchFavorites = async () => {
    try {

      const response = await fetch(
        `${API_URL}/api/users/favorites`,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setFavorites(
          data.favorites.map((fav: Post) => fav._id)
        );
      }

    } catch (err) {
      console.error('获取收藏失败:', err);
    }
  };

  const handleLike = async (postId: string) => {
    try {

      const response = await fetch(
        `${API_URL}/api/forum/posts/${postId}/like`,
        {
          method: 'PUT',
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? data.post
              : post
          )
        );
      }

    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  const handleFavorite = async (postId: string) => {
    try {

      const response = await fetch(
        `${API_URL}/api/users/favorite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ postId }),
        }
      );

      const data = await response.json();

      if (data.success) {

        setFavorites((prev) =>
          prev.includes(postId)
            ? prev.filter((id) => id !== postId)
            : [...prev, postId]
        );
      }

    } catch (err) {
      console.error('收藏失败:', err);
    }
  };

  const toggleComments = (postId: string) => {

    setExpandedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSubmit = async () => {

    if (!title.trim() || !content.trim()) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/api/forum/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            title,
            content,
            tags: tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {

        setPosts((prev) => [
          data.post,
          ...prev,
        ]);

        setTitle('');
        setContent('');
        setTags('');

        setIsModalOpen(false);
      }

    } catch (err) {
      console.error('发帖失败:', err);
    }
  };

  const handleDeletePost = async (
    postId: string
  ) => {

    const confirmDelete = window.confirm(
      '确定删除这篇帖子吗？'
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/api/forum/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setPosts((prev) =>
          prev.filter(
            (post) => post._id !== postId
          )
        );
      }

    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  const handleReply = (
    postId: string,
    commentId: string,
    authorId: string,
    authorName: string
  ) => {

    setReplyTo({
      postId,
      commentId,
      authorId,
      authorName,
    });
  };

  const handleComment = async (
    postId: string
  ) => {

    const content =
      commentInputs[postId];

    if (!content?.trim()) {
      return;
    }

    try {

      const body: {
        content: string;
        replyTo?: string;
        replyToComment?: string;
      } = {
        content,
      };

      if (
        replyTo &&
        replyTo.postId === postId
      ) {

        body.replyTo =
          replyTo.authorId;

        body.replyToComment =
          replyTo.commentId;
      }

      const response = await fetch(
        `${API_URL}/api/forum/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (data.success) {

        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? data.post
              : post
          )
        );

        setCommentInputs((prev) => ({
          ...prev,
          [postId]: '',
        }));

        setReplyTo(null);
      }

    } catch (err) {
      console.error('评论失败:', err);
    }
  };

  const openShareModal = async (
    postId: string
  ) => {

    setSharePostId(postId);

    try {

      const response = await fetch(
        `${API_URL}/api/friends`,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setShareFriends(data.friends);
      }

    } catch (err) {
      console.error('获取好友失败:', err);
    }

    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {

    setIsShareModalOpen(false);

    setSelectedFriend(null);

    setSharePostId(null);
  };

  const copyLink = async (
    postId: string
  ) => {

    try {

      const url =
        `${window.location.origin}/forum/post/${postId}`;

      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const shareToFriend = async () => {

    if (
      !selectedFriend ||
      !sharePostId
    ) {
      return;
    }

    try {

      const response = await fetch(
        '${API_URL}/api/chat/share',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            friendId: selectedFriend,
            postId: sharePostId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {

        alert('分享成功');

      } else {

        alert(data.message || '分享失败');
      }

    } catch (err) {
      console.error('分享失败:', err);
    }

    closeShareModal();
  };

  return (

    <ForumContainer>

      <ForumContentWrapper>

        <ForumHeader>

          <HeaderLeft>

            <ForumBadge>
              <Sparkles size={16} />
              温柔交流社区
            </ForumBadge>

            <ForumTitle>
              绿洲社区
            </ForumTitle>

            <ForumSubtitle>
              分享你的情绪、生活与故事。
              这里有人认真倾听，也有人和你经历过相同的夜晚。
            </ForumSubtitle>

          </HeaderLeft>

          <Actions>

            <SearchBar>

              <SearchIcon>
                <Search size={18} />
              </SearchIcon>

              <SearchInput
                placeholder="搜索话题..."
              />

            </SearchBar>

            <FilterButton>
              <Filter size={18} />
              筛选
            </FilterButton>

            <CreateButton
              onClick={() =>
                setIsModalOpen(true)
              }
            >
              <Plus size={18} />
              发帖
            </CreateButton>

          </Actions>

        </ForumHeader>

        <ForumContent>

          <PostsList>

            {posts.map((post) => (

              <PostCard key={post._id}>

                <PostHeaderStyled>

                  <PostAvatar 
                    style={{ cursor: 'pointer' }}
                    onClick={() => 
                      handleViewProfile(post.author._id, post.author.username)
                    }
                  >
                    {post.author?.username?.slice(0, 1)}
                  </PostAvatar>

                  <PostAuthorInfo>

                    <PostAuthor 
                      style={{ cursor: 'pointer', color: '#6366f1' }}
                      onClick={() => 
                        handleViewProfile(post.author._id, post.author.username)
                      }
                    >
                      {post.author?.username}
                    </PostAuthor>

                    <PostMeta>
                      {new Date(
                        post.createdAt
                      ).toLocaleDateString()}
                      {' · '}
                      {post.tags?.[0]}
                    </PostMeta>

                  </PostAuthorInfo>

                  {post.author?._id ===
                    currentUser._id ? (
                    <DeleteButton
                      onClick={() =>
                        handleDeletePost(
                          post._id
                        )
                      }
                    >
                      <Trash2 size={18} />
                    </DeleteButton>
                  ) : friends.includes(post.author._id) ? (
                    <button
                      style={{
                        padding: '10px 20px',
                        borderRadius: '14px',
                        border: '2px solid #6366f1',
                        background: '#6366f1',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'default',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      已关注
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(post.author._id)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '14px',
                        border: '2px solid #6366f1',
                        background: following.includes(post.author._id) ? '#6366f1' : 'transparent',
                        color: following.includes(post.author._id) ? 'white' : '#6366f1',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {following.includes(post.author._id) ? '已关注' : '关注'}
                    </button>
                  )}

                </PostHeaderStyled>

                <CardBody>

                  <PostTitle>
                    {post.title}
                  </PostTitle>

                  <PostContent>
                    {post.content}
                  </PostContent>

                  <PostTags>

                    {post.tags.map((tag) => (
                      <StyledTag key={tag}>
                        #{tag}
                      </StyledTag>
                    ))}

                  </PostTags>

                  <Divider />

                  <PostFooter>

                    <PostActions>

                      <ActionButton
                        className={
                          post.likes.includes(
                            currentUser._id
                          )
                            ? 'liked'
                            : ''
                        }
                        onClick={() =>
                          handleLike(post._id)
                        }
                      >
                        <Heart size={18} />
                        {post.likes.length}
                      </ActionButton>

                      <ActionButton
                        onClick={() =>
                          toggleComments(
                            post._id
                          )
                        }
                      >
                        {expandedPosts.includes(
                          post._id
                        ) ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}

                        {post.comments.length}
                      </ActionButton>

                      <ActionButton
                        className={
                          favorites.includes(
                            post._id
                          )
                            ? 'favorited'
                            : ''
                        }
                        onClick={() =>
                          handleFavorite(
                            post._id
                          )
                        }
                      >
                        <Bookmark size={18} />

                        {favorites.includes(
                          post._id
                        )
                          ? '已收藏'
                          : '收藏'}
                      </ActionButton>

                      <ActionButton
                        onClick={() =>
                          openShareModal(
                            post._id
                          )
                        }
                      >
                        <Share2 size={18} />
                        分享
                      </ActionButton>

                    </PostActions>

                    <ReadMore>
                      查看讨论
                      <ArrowRight size={16} />
                    </ReadMore>

                  </PostFooter>

                  {expandedPosts.includes(
                    post._id
                  ) && (

                    <CommentsSection>

                      <CommentsList>

                        {post.comments.map(
                          (comment) => (

                            <CommentItem
                              key={comment._id}
                            >

                              <CommentAvatar>
                                {comment.author?.username?.slice(
                                  0,
                                  1
                                )}
                              </CommentAvatar>

                              <CommentContent>

                                <CommentAuthor>
                                  {
                                    comment.author
                                      ?.username
                                  }
                                </CommentAuthor>

                                <CommentTime>
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleString()}
                                </CommentTime>

                                {comment.replyTo && (
                                  <ReplyInfo>
                                    回复 @
                                    {
                                      comment.replyTo
                                        .username
                                    }
                                  </ReplyInfo>
                                )}

                                <CommentText>
                                  {
                                    comment.content
                                  }
                                </CommentText>

                                <ReplyButton
                                  onClick={() =>
                                    handleReply(
                                      post._id,
                                      comment._id,
                                      comment.author
                                        ._id,
                                      comment.author
                                        .username
                                    )
                                  }
                                >
                                  回复
                                </ReplyButton>

                              </CommentContent>

                            </CommentItem>
                          )
                        )}

                      </CommentsList>

                      {replyTo &&
                        replyTo.postId ===
                          post._id && (

                        <ReplyNotice>

                          回复 @
                          {
                            replyTo.authorName
                          }

                          <CancelReplyButton
                            onClick={() =>
                              setReplyTo(
                                null
                              )
                            }
                          >
                            取消
                          </CancelReplyButton>

                        </ReplyNotice>
                      )}

                      <CommentInputWrapper>

                        <CommentInput
                          placeholder={
                            replyTo &&
                            replyTo.postId ===
                              post._id
                              ? `回复 @${replyTo.authorName}...`
                              : '写下你的评论...'
                          }
                          value={
                            commentInputs[
                              post._id
                            ] || ''
                          }
                          onChange={(e) =>
                            setCommentInputs(
                              (prev) => ({
                                ...prev,
                                [post._id]:
                                  e.target
                                    .value,
                              })
                            )
                          }
                          onKeyDown={(e) => {

                            if (
                              e.key ===
                              'Enter'
                            ) {

                              e.preventDefault();

                              handleComment(
                                post._id
                              );
                            }
                          }}
                        />

                        <CommentSubmit
                          onClick={() =>
                            handleComment(
                              post._id
                            )
                          }
                        >
                          <Send size={18} />
                        </CommentSubmit>

                      </CommentInputWrapper>

                    </CommentsSection>
                  )}

                </CardBody>

              </PostCard>
            ))}

          </PostsList>

          <Sidebar>

            <SidebarCard>

              <CardHeader>

                <SidebarTitle>

                  <TrendingUp
                    size={18}
                    style={{
                      marginRight: 8,
                      verticalAlign:
                        'middle',
                    }}
                  />

                  热门标签

                </SidebarTitle>

              </CardHeader>

              <CardBody>

                <TrendingTags>

                  {[
                    '焦虑',
                    '大学',
                    '疗愈',
                    '社交',
                    '成长',
                    '心理',
                    '就业',
                    '休学',
                  ].map((tag) => (

                    <StyledTag
                      key={tag}
                    >
                      #{tag}
                    </StyledTag>
                  ))}

                </TrendingTags>

              </CardBody>

            </SidebarCard>

            <SidebarCard>

              <CardHeader>

                <SidebarTitle>

                  <Users
                    size={18}
                    style={{
                      marginRight: 8,
                      verticalAlign:
                        'middle',
                    }}
                  />

                  社区统计

                </SidebarTitle>

              </CardHeader>

              <CardBody>

                <div
                  style={{
                    display: 'flex',
                    flexDirection:
                      'column',
                    gap: 20,
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        color: '#6366f1',
                      }}
                    >
                      {posts.length}
                    </div>

                    <div
                      style={{
                        color: '#9ca3af',
                      }}
                    >
                      总帖子数
                    </div>

                  </div>

                  <div
                    style={{
                      height: 1,
                      background:
                        'rgba(229,231,235,0.8)',
                    }}
                  />

                  <div>

                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        color: '#6366f1',
                      }}
                    >
                      {totalComments}
                    </div>

                    <div
                      style={{
                        color: '#9ca3af',
                      }}
                    >
                      总评论数
                    </div>

                  </div>

                  <div
                    style={{
                      height: 1,
                      background:
                        'rgba(229,231,235,0.8)',
                    }}
                  />

                  <div>

                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        color: '#6366f1',
                      }}
                    >
                      {totalLikes}
                    </div>

                    <div
                      style={{
                        color: '#9ca3af',
                      }}
                    >
                      总点赞数
                    </div>

                  </div>

                </div>

              </CardBody>

            </SidebarCard>

          </Sidebar>

        </ForumContent>

      </ForumContentWrapper>

      {/* 发帖 Modal */}

      <ModalOverlay
        isOpen={isModalOpen}
      >

        <ModalContent>

          <ModalHeader>

            <ModalTitle>
              发布新帖
            </ModalTitle>

            <CloseButton
              onClick={() =>
                setIsModalOpen(false)
              }
            >
              <X size={18} />
            </CloseButton>

          </ModalHeader>

          <ModalBody>

            <FormGroup>

              <Label>
                标题
              </Label>

              <Input
                type="text"
                placeholder="输入帖子标题..."
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
              />

            </FormGroup>

            <FormGroup>

              <Label>
                内容
              </Label>

              <TextArea
                placeholder="分享你的故事、想法或问题..."
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
              />

            </FormGroup>

            <FormGroup>

              <Label>
                标签
              </Label>

              <Input
                type="text"
                placeholder="输入标签，用逗号分隔..."
                value={tags}
                onChange={(e) =>
                  setTags(
                    e.target.value
                  )
                }
              />

            </FormGroup>

          </ModalBody>

          <ModalFooter>

            <Button
              variant="ghost"
              onClick={() =>
                setIsModalOpen(false)
              }
            >
              取消
            </Button>

            <Button
              onClick={handleSubmit}
            >
              <Send size={18} />
              发布
            </Button>

          </ModalFooter>

        </ModalContent>

      </ModalOverlay>

      {/* 用户主页弹窗 */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        userId={viewingUserId}
        username={viewingUsername}
      />

      {/* 分享 Modal */}

      <ModalOverlay
        isOpen={
          isShareModalOpen
        }
      >

        <ShareModalContent>

          <ModalHeader>

            <ModalTitle>
              分享帖子
            </ModalTitle>

            <CloseButton
              onClick={
                closeShareModal
              }
            >
              <X size={18} />
            </CloseButton>

          </ModalHeader>

          <ModalBody>

            <ShareOption
              onClick={() => {

                if (
                  sharePostId
                ) {

                  copyLink(
                    sharePostId
                  );
                }
              }}
            >

              <ShareIcon>
                <Copy size={20} />
              </ShareIcon>

              <ShareText>

                <ShareTitle>
                  复制链接
                </ShareTitle>

                <ShareDesc>
                  复制帖子链接分享给他人
                </ShareDesc>

              </ShareText>

            </ShareOption>

            {copied && (

              <CopiedMessage>

                <Check size={16} />

                链接已复制

              </CopiedMessage>
            )}

            <div
              style={{
                marginTop: 24,
              }}
            >

              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 14,
                  color: '#111827',
                }}
              >
                分享给好友
              </div>

              <FriendsList>

                {shareFriends.map(
                  (friend) => (

                    <FriendItem
                      key={friend._id}
                      selected={
                        selectedFriend ===
                        friend._id
                      }
                      onClick={() =>
                        setSelectedFriend(
                          friend._id
                        )
                      }
                    >

                      <FriendAvatar>
                        {friend.username.slice(
                          0,
                          1
                        )}
                      </FriendAvatar>

                      <FriendName>
                        {
                          friend.username
                        }
                      </FriendName>

                      {selectedFriend ===
                        friend._id && (
                        <Check
                          size={18}
                          color="#6366f1"
                        />
                      )}

                    </FriendItem>
                  )
                )}

              </FriendsList>

              <Button
                onClick={
                  shareToFriend
                }
                disabled={
                  !selectedFriend
                }
                style={{
                  width: '100%',
                  marginTop: 16,
                }}
              >
                发送给好友
              </Button>

            </div>

          </ModalBody>

        </ShareModalContent>

      </ModalOverlay>

    </ForumContainer>
  );
};