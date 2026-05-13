import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Heart, MessageCircle, Share2, Send, Plus, Filter, Search, X, User, ChevronDown, ChevronUp, Trash2, Bookmark, Users, Copy, Check } from 'lucide-react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';

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
  createdAt: Date;
}

interface Post {
  _id: string;
  author: PostAuthor;
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

interface Friend {
  _id: string;
  username: string;
  email: string;
}

interface User {
  username: string;
  email: string;
  id: string;
  _id: string;
}

interface ForumPageProps {
  onNavigate: (page: string) => void;
  currentUser: User;
}

const ForumContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[4]};
`;

const ForumHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
`;

const ForumTitle = styled.h1`
  font-size: ${theme.fonts.sizes['2xl']};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  padding-left: 48px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.base};
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing[3]};
  color: ${theme.colors.neutral[400]};
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  background: white;
  color: ${theme.colors.neutral[600]};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.neutral[50]};
  }
`;

const ForumContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${theme.spacing[6]};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PostsList = styled.div``;

const PostCard = styled(Card)`
  margin-bottom: ${theme.spacing[4]};
`;

const PostHeader = styled(CardHeader)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding-bottom: ${theme.spacing[3]};
`;

const PostAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.fonts.weights.medium};
`;

const PostAuthorInfo = styled.div`
  flex: 1;
`;

const PostAuthor = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
`;

const PostMeta = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const PostTitle = styled.h2`
  font-size: ${theme.fonts.sizes.xl};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[2]};
`;

const PostContent = styled.p`
  color: ${theme.colors.neutral[600]};
  line-height: 1.8;
  margin-bottom: ${theme.spacing[4]};
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing[3]};
  border-top: 1px solid ${theme.colors.neutral[100]};
`;

const PostActions = styled.div`
  display: flex;
  gap: ${theme.spacing[6]};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  background: transparent;
  border: none;
  color: ${theme.colors.neutral[600]};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[800]};
  }

  &.liked {
    color: ${theme.colors.danger[500]};
  }
`;

const Sidebar = styled.aside``;

const SidebarCard = styled(Card)`
  margin-bottom: ${theme.spacing[4]};
`;

const SidebarTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[4]};
`;

const CommunitiesList = styled.div``;

const CommunityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.neutral[50]};
  }
`;

const CommunityIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const CommunityInfo = styled.div``;

const CommunityName = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
`;

const CommunityMembers = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const TrendingTags = styled.div``;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

const CreatePostModal = styled.div<{ isOpen: boolean }>`
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
  max-width: 600px;
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
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.neutral[200]};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const Label = styled.label`
  display: block;
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing[2]};
`;

const TitleInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.lg};
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.base};
`;

const TagsInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.base};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.neutral[100]};
`;

const CommentsSection = styled.div`
  margin-top: ${theme.spacing[4]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.neutral[100]};
`;

const CommentsList = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const CommentItem = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]} 0;
  border-bottom: 1px solid ${theme.colors.neutral[50]};
`;

const CommentAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${theme.fonts.sizes.sm};
  font-weight: ${theme.fonts.weights.medium};
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentAuthor = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
  margin-right: ${theme.spacing[2]};
`;

const CommentText = styled.p`
  color: ${theme.colors.neutral[600]};
  margin-top: ${theme.spacing[1]};
`;

const CommentInput = styled.input`
  flex: 1;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.base};
`;

const CommentSubmit = styled.button`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary[500]};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  &:hover {
    background: ${theme.colors.primary[600]};
  }
`;

const ReplyButton = styled.button`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.neutral[100]};
  border: none;
  cursor: pointer;
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.fonts.sizes.sm};
  margin-top: ${theme.spacing[2]};

  &:hover {
    background: ${theme.colors.neutral[200]};
  }
`;

const ReplyInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.sm};
  margin-top: ${theme.spacing[2]};
`;

const ShareModal = styled.div<{ isOpen: boolean }>`
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

const ShareModalContent = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  width: 90%;
  max-width: 450px;
`;

const ShareModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
`;

const ShareModalTitle = styled.h2`
  font-size: ${theme.fonts.sizes.xl};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
`;

const ShareModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const ShareOption = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[3]};
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

const ShareIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary[600]};
`;

const ShareText = styled.div``;

const ShareTitle = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
  display: block;
`;

const ShareDesc = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const FriendsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: ${theme.spacing[4]};
`;

const FriendItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  background: transparent;
  border: 2px solid transparent;
  text-align: left;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.neutral[50]};
  }

  &.selected {
    border-color: ${theme.colors.primary[500]};
    background: ${theme.colors.primary[50]};
  }
`;

const FriendAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${theme.fonts.sizes.sm};
  font-weight: ${theme.fonts.weights.medium};
`;

const FriendName = styled.span`
  flex: 1;
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
`;

const CopiedMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.success[100]};
  color: ${theme.colors.success[600]};
  margin-top: ${theme.spacing[3]};
`;

export const ForumPage = ({ onNavigate, currentUser }: ForumPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [posts, setPosts] = useState<(Post & { author: PostAuthor })[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [shareFriends, setShareFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [replyTo, setReplyTo] = useState<{ postId: string; commentId: string; authorId: string; authorName: string } | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchFavorites();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/forum/posts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
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
      const response = await fetch('http://localhost:5000/api/users/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setFavorites(data.favorites.map((fav: Post) => fav._id));
      }
    } catch (err) {
      console.error('获取收藏失败:', err);
    }
  };

  const handleFavorite = async (postId: string) => {
    console.log('尝试收藏帖子:', postId);
    try {
      const response = await fetch('http://localhost:5000/api/users/favorite', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ postId })
      });
      console.log('收藏响应状态:', response.status);
      const data = await response.json();
      console.log('收藏响应数据:', data);
      if (data.success) {
        setFavorites(prev => 
          prev.includes(postId) 
            ? prev.filter(id => id !== postId)
            : [...prev, postId]
        );
        console.log('收藏状态已更新');
      }
    } catch (err) {
      console.error('收藏失败:', err);
    }
  };

  const openShareModal = async (postId: string) => {
    setSharePostId(postId);
    try {
      const response = await fetch('http://localhost:5000/api/friends', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
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
    setSharePostId(null);
    setSelectedFriend(null);
  };

  const copyLink = async (postId: string) => {
    const url = `${window.location.origin}/forum/post/${postId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToFriend = async () => {
    if (!selectedFriend || !sharePostId) return;
    try {
      const response = await fetch('http://localhost:5000/api/chat/share', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ friendId: selectedFriend, postId: sharePostId })
      });
      const data = await response.json();
      if (data.success) {
        alert('已成功分享帖子给好友！');
      } else {
        alert('分享失败: ' + data.message);
      }
    } catch (err) {
      console.error('分享失败:', err);
      alert('分享失败，请重试');
    }
    closeShareModal();
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/forum/posts/${postId}/like`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId ? data.post : post
        ));
      }
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  const handleSubmit = async () => {
    alert(`准备发帖\n标题: ${title}\n内容: ${content}`);
    console.log('开始发帖，标题:', title, '内容:', content);
    try {
      const token = localStorage.getItem('token');
      console.log('token:', token ? '已获取' : '未获取');
      
      const response = await fetch('http://localhost:5000/api/forum/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      console.log('响应状态:', response.status);
      const data = await response.json();
      console.log('响应数据:', data);
      
      if (data.success) {
        setPosts(prev => [data.post, ...prev]);
        console.log('帖子添加成功');
      } else {
        console.log('发帖失败:', data.message);
      }
    } catch (err) {
      console.error('发帖异常:', err);
    }
    
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setTags('');
  };

  const toggleComments = (postId: string) => {
    setExpandedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleComment = async (postId: string) => {
    const commentContent = commentInputs[postId];
    if (!commentContent?.trim()) return;

    try {
      const body: { content: string; replyTo?: string; replyToComment?: string } = { content: commentContent };
      if (replyTo && replyTo.postId === postId) {
        body.replyTo = replyTo.authorId;
        body.replyToComment = replyTo.commentId;
      }

      const response = await fetch(`http://localhost:5000/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId ? data.post : post
        ));
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        setReplyTo(null);
      }
    } catch (err) {
      console.error('评论失败:', err);
    }
  };

  const handleReply = (postId: string, commentId: string, authorId: string, authorName: string) => {
    setReplyTo({ postId, commentId, authorId, authorName });
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('确定要删除这篇帖子吗？')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      if (data.success) {
        setPosts(prev => prev.filter(post => post._id !== postId));
      }
    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  return (
    <ForumContainer>
      <ForumHeader>
        <ForumTitle>绿洲社区</ForumTitle>
        <Actions>
          <SearchBar>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput placeholder="搜索话题..." />
          </SearchBar>
          <FilterButton>
            <Filter size={18} />
            筛选
          </FilterButton>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            发帖
          </Button>
        </Actions>
      </ForumHeader>

      <ForumContent>
        <PostsList>
          {posts.map((post) => {
            if (!post.author) {
              console.error('Post has no author:', post);
              return null;
            }
            return (
            <PostCard key={post._id}>
              <PostHeader>
                <PostAvatar>{post.author.username.slice(0, 1)}</PostAvatar>
                <PostAuthorInfo>
                  <PostAuthor>{post.author.username}</PostAuthor>
                  <PostMeta>
                    {new Date(post.createdAt).toLocaleDateString()} · {post.tags[0] || ''}
                  </PostMeta>
                </PostAuthorInfo>
                {post.author._id === currentUser._id && (
                  <button 
                    onClick={() => handleDeletePost(post._id)}
                    style={{ 
                      padding: '8px', 
                      borderRadius: '8px',
                      border: 'none',
                      background: theme.colors.danger[50],
                      color: theme.colors.danger[500],
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </PostHeader>
              <CardBody>
                <PostTitle>{post.title}</PostTitle>
                <PostContent>{post.content}</PostContent>
                <PostTags>
                  {post.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </PostTags>
                <PostFooter>
                  <PostActions>
                    <ActionButton 
                      className={post.likes.includes(currentUser._id) ? 'liked' : ''}
                      onClick={() => handleLike(post._id)}
                    >
                      <Heart size={18} />
                      {post.likes.length}
                    </ActionButton>
                    <ActionButton onClick={() => toggleComments(post._id)}>
                      {expandedPosts.includes(post._id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      {post.comments.length} 评论
                    </ActionButton>
                    <ActionButton onClick={() => handleFavorite(post._id)}>
                      <Bookmark size={18} />
                      {favorites.includes(post._id) ? '已收藏' : '收藏'}
                    </ActionButton>
                    <ActionButton onClick={() => openShareModal(post._id)}>
                      <Share2 size={18} />
                      分享
                    </ActionButton>
                  </PostActions>
                </PostFooter>

                {expandedPosts.includes(post._id) && (
                  <CommentsSection>
                    <CommentsList>
                      {post.comments.map((comment) => {
                        if (!comment.author) {
                          console.error('Comment has no author:', comment);
                          return null;
                        }
                        return (
                        <CommentItem key={comment._id}>
                          <CommentAvatar>{comment.author.username.slice(0, 1)}</CommentAvatar>
                          <CommentContent>
                            <CommentAuthor>{comment.author.username}</CommentAuthor>
                            <span style={{ color: theme.colors.neutral[400], fontSize: theme.fonts.sizes.sm }}>
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                            {comment.replyTo && (
                              <div style={{ color: theme.colors.primary[600], fontSize: theme.fonts.sizes.sm, marginBottom: theme.spacing[1] }}>
                                回复 @{comment.replyTo.username}
                              </div>
                            )}
                            <CommentText>{comment.content}</CommentText>
                            <ReplyButton onClick={() => handleReply(post._id, comment._id, comment.author._id, comment.author.username)}>
                              回复
                            </ReplyButton>
                          </CommentContent>
                        </CommentItem>
                        );
                      })}
                    </CommentsList>
                    <div style={{ display: 'flex', gap: theme.spacing[3] }}>
                      {replyTo && replyTo.postId === post._id && (
                        <div style={{ padding: theme.spacing[2], background: theme.colors.primary[50], borderRadius: theme.borderRadius.md, fontSize: theme.fonts.sizes.sm, color: theme.colors.primary[700] }}>
                          回复 @{replyTo.authorName}
                          <button 
                            onClick={() => setReplyTo(null)} 
                            style={{ marginLeft: theme.spacing[2], color: theme.colors.neutral[400], cursor: 'pointer' }}
                          >
                            取消
                          </button>
                        </div>
                      )}
                      <CommentInput
                        type="text"
                        placeholder={replyTo && replyTo.postId === post._id ? `回复 @${replyTo.authorName}...` : '写下你的评论...'}
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleComment(post._id))}
                      />
                      <CommentSubmit onClick={() => handleComment(post._id)}>
                        <Send size={16} />
                        发送
                      </CommentSubmit>
                    </div>
                  </CommentsSection>
                )}
              </CardBody>
            </PostCard>
            );
          })}
        </PostsList>

        <Sidebar>
          <SidebarCard>
            <CardHeader>
              <SidebarTitle>热门标签</SidebarTitle>
            </CardHeader>
            <CardBody>
              <TrendingTags>
                <TagList>
                  {['休学', '焦虑', '大学生', '社交', '心理', '疗愈', '成长', '就业', '压力', '自我成长'].map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagList>
              </TrendingTags>
            </CardBody>
          </SidebarCard>

          <SidebarCard>
            <CardHeader>
              <SidebarTitle>社区统计</SidebarTitle>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
                <div>
                  <div style={{ fontSize: theme.fonts.sizes.xl, fontWeight: theme.fonts.weights.bold, color: theme.colors.primary[600] }}>
                    {posts.length}
                  </div>
                  <div style={{ fontSize: theme.fonts.sizes.sm, color: theme.colors.neutral[500] }}>总帖子数</div>
                </div>
                <div style={{ height: '1px', background: theme.colors.neutral[100] }} />
                <div>
                  <div style={{ fontSize: theme.fonts.sizes.xl, fontWeight: theme.fonts.weights.bold, color: theme.colors.primary[600] }}>
                    {posts.reduce((sum, post) => sum + post.comments.length, 0)}
                  </div>
                  <div style={{ fontSize: theme.fonts.sizes.sm, color: theme.colors.neutral[500] }}>总评论数</div>
                </div>
                <div style={{ height: '1px', background: theme.colors.neutral[100] }} />
                <div>
                  <div style={{ fontSize: theme.fonts.sizes.xl, fontWeight: theme.fonts.weights.bold, color: theme.colors.primary[600] }}>
                    {posts.reduce((sum, post) => sum + post.likes.length, 0)}
                  </div>
                  <div style={{ fontSize: theme.fonts.sizes.sm, color: theme.colors.neutral[500] }}>总点赞数</div>
                </div>
              </div>
            </CardBody>
          </SidebarCard>
        </Sidebar>
      </ForumContent>

      <CreatePostModal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>发布新帖</ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <X size={18} />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>标题</Label>
              <TitleInput 
                type="text" 
                placeholder="输入帖子标题..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>内容</Label>
              <ContentTextarea 
                placeholder="分享你的故事、想法或问题..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>标签</Label>
              <TagsInput 
                type="text" 
                placeholder="输入标签，用逗号分隔..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>
              <Send size={18} />
              发布
            </Button>
          </ModalFooter>
        </ModalContent>
      </CreatePostModal>

      <ShareModal isOpen={isShareModalOpen}>
        <ShareModalContent>
          <ShareModalHeader>
            <ShareModalTitle>分享帖子</ShareModalTitle>
            <CloseButton onClick={closeShareModal}>
              <X size={18} />
            </CloseButton>
          </ShareModalHeader>
          <ShareModalBody>
            <ShareOption onClick={() => { sharePostId && copyLink(sharePostId); }}>
              <ShareIcon>
                <Copy size={20} />
              </ShareIcon>
              <ShareText>
                <ShareTitle>复制链接</ShareTitle>
                <ShareDesc>复制帖子链接分享给他人</ShareDesc>
              </ShareText>
            </ShareOption>
            {copied && <CopiedMessage><Check size={16} />链接已复制</CopiedMessage>}

            <div style={{ marginTop: theme.spacing[4], paddingTop: theme.spacing[4], borderTop: `1px solid ${theme.colors.neutral[100]}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
                <Users size={18} color={theme.colors.neutral[500]} />
                <span style={{ fontWeight: theme.fonts.weights.medium, color: theme.colors.neutral[800] }}>分享给好友</span>
              </div>
              <FriendsList>
                {shareFriends.map(friend => (
                  <FriendItem 
                    key={friend._id} 
                    className={selectedFriend === friend._id ? 'selected' : ''}
                    onClick={() => setSelectedFriend(friend._id)}
                  >
                    <FriendAvatar>{friend.username.slice(0, 1)}</FriendAvatar>
                    <FriendName>{friend.username}</FriendName>
                    {selectedFriend === friend._id && <Check size={18} color={theme.colors.primary[600]} />}
                  </FriendItem>
                ))}
              </FriendsList>
              <Button 
                onClick={shareToFriend} 
                disabled={!selectedFriend}
                style={{ width: '100%' }}
              >
                发送给好友
              </Button>
            </div>
          </ShareModalBody>
        </ShareModalContent>
      </ShareModal>
    </ForumContainer>
  );
};