import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Send, Search, Bell, Smile, Image, MoreVertical, Mail, UserPlus, Users, X, Check } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { theme } from '../styles/theme';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { API_URL } from '../config/api';

const socket = io(API_URL);

interface User {
  _id: string;
  username: string;
  email: string;
  status?: string;
}

interface SharedPost {
  type: string;
  postId: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
}

interface MessageFromTo {
  _id: string;
  username: string;
  email: string;
}

interface Message {
  _id: string;
  from: string | MessageFromTo;
  to: string | MessageFromTo;
  content: string;
  createdAt: Date;
  type?: string;
  read?: boolean;
}

interface FriendRequest {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted';
  createdAt: Date;
  user?: User;
}

interface ChatPageProps {
  onNavigate: (page: string) => void;
  currentUser: User;
}

const ChatContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[4]};
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
`;

const ChatTitle = styled.h1`
  font-size: ${theme.fonts.sizes['2xl']};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
`;

const ChatContent = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: ${theme.spacing[6]};
  height: calc(100vh - 200px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const ContactsList = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const ContactsHeader = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
`;

const Tabs = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  background: ${({ active }) => active ? theme.colors.primary[100] : 'transparent'};
  color: ${({ active }) => active ? theme.colors.primary[700] : theme.colors.neutral[600]};
  border: none;
  font-weight: ${theme.fonts.weights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.neutral[100]};
  }
`;

const SearchBar = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  padding-left: 40px;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.sm};
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.neutral[400]};
`;

const SearchButton = styled.button`
  position: absolute;
  right: ${theme.spacing[2]};
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary[500]};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.primary[600]};
  }
`;

const ContactsItems = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ContactItem = styled.div<{ active: boolean; unread: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border-left: 3px solid ${({ active }) => active ? theme.colors.primary[500] : 'transparent'};

  &:hover {
    background: ${theme.colors.neutral[50]};
  }

  ${({ active }) => active && `
    background: ${theme.colors.primary[50]};
  `}
`;

const ContactAvatar = styled.div`
  position: relative;
`;

const AvatarCircle = styled.div`
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

const ContactInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ContactName = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
`;

const ContactMessage = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadBadge = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${theme.colors.danger[500]};
  color: white;
  font-size: ${theme.fonts.sizes.xs};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatArea = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const ChatHeaderBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
`;

const ChatAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.fonts.weights.medium};
`;

const ChatInfo = styled.div`
  flex: 1;
`;

const ChatName = styled.span`
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
`;

const ChatActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
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

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
  background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.calm[50]} 100%);
`;

const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const MessageItem = styled.div<{ isSender: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isSender }) => isSender ? 'flex-end' : 'flex-start'};
  gap: ${theme.spacing[1]};
`;

const MessageBubble = styled.div<{ isSender: boolean }>`
  max-width: 70%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.xl};
  ${({ isSender }) => isSender 
    ? `
      background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
      color: white;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
    ` 
    : `
      background: white;
      color: ${theme.colors.neutral[800]};
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid ${theme.colors.neutral[100]};
    `
  }
`;

const MessageContent = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const MessageTime = styled.span`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[400]};
  margin-top: ${theme.spacing[1]};
  padding: 0 ${theme.spacing[2]};
`;

const SharedPostCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[100]};
  overflow: hidden;
  margin-top: ${theme.spacing[2]};
`;

const SharedPostHeader = styled.div`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: ${theme.colors.primary[50]};
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.primary[600]};
  font-weight: ${theme.fonts.weights.medium};
`;

const SharedPostContent = styled.div`
  padding: ${theme.spacing[3]};
`;

const SharedPostTitle = styled.h4`
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[2]};
  font-size: ${theme.fonts.sizes.base};
`;

const SharedPostText = styled.p`
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.fonts.sizes.sm};
  margin-bottom: ${theme.spacing[3]};
  line-height: 1.5;
`;

const SharedPostAuthor = styled.div`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[500]};
  margin-bottom: ${theme.spacing[2]};
`;

const SharedPostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[1]};
`;

const SharedPostTag = styled.span`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${theme.colors.neutral[100]};
  color: ${theme.colors.neutral[600]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fonts.sizes.xs};
`;

const InputArea = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
  border-top: 1px solid ${theme.colors.neutral[100]};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const InputButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const InputButton = styled.button`
  width: 44px;
  height: 44px;
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

const MessageInput = styled.input`
  flex: 1;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.fonts.sizes.base};
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${theme.shadows.md};
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[400]};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing[4]};
`;

const EmptyTitle = styled.p`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[600]};
`;

const AddFriendModal = styled.div<{ isOpen: boolean }>`
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
  max-width: 450px;
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

const FriendRequestItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.neutral[50]};
  margin-bottom: ${theme.spacing[3]};
`;

const FriendRequestAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.fonts.weights.medium};
`;

const FriendRequestInfo = styled.div`
  flex: 1;
`;

const FriendRequestName = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
  display: block;
`;

const FriendRequestTime = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const FriendRequestActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const RequestActionButton = styled.button<{ accept: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  border: none;
  font-weight: ${theme.fonts.weights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  ${({ accept }) => accept ? `
    background: ${theme.colors.primary[500]};
    color: white;
    &:hover { background: ${theme.colors.primary[600]}; }
  ` : `
    background: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[600]};
    &:hover { background: ${theme.colors.neutral[200]}; }
  `}
`;

const AddFriendButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary[500]};
  color: white;
  border: none;
  font-weight: ${theme.fonts.weights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.primary[600]};
  }
`;

const SearchResultItem = styled.div`
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

const SearchResultAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.fonts.weights.medium};
`;

const SearchResultInfo = styled.div`
  flex: 1;
`;

const SearchResultName = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
  display: block;
`;

const SearchResultEmail = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const AddButton = styled.button`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary[100]};
  color: ${theme.colors.primary[700]};
  border: none;
  font-weight: ${theme.fonts.weights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.primary[200]};
  }
`;

const NoFriendsMessage = styled.div`
  padding: ${theme.spacing[6]};
  text-align: center;
  color: ${theme.colors.neutral[500]};
`;

export const ChatPage = ({ onNavigate, currentUser }: ChatPageProps) => {
  const [selectedTab, setSelectedTab] = useState<'friends' | 'requests'>('friends');
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const messagesAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();

    socket.emit('authenticate', localStorage.getItem('token'));

    socket.on('newMessage', (newMessage: Message) => {
      if (selectedFriend && newMessage.from === selectedFriend._id) {
        setMessages(prev => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${API_URL}/api/friends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.friends) {
        setFriends(data.friends);
        if (data.friends.length > 0 && !selectedFriend) {
          setSelectedFriend(data.friends[0]);
        }
      }
    } catch (err) {
      console.error('获取好友列表失败:', err);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/friends/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.requests) {
        setFriendRequests(data.requests);
      }
    } catch (err) {
      console.error('获取好友请求失败:', err);
    }
  };

  const fetchMessages = async (friendId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/chat/messages/${friendId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('获取消息失败:', err);
    }
  };

  const handleSelectFriend = (friend: User) => {
    setSelectedFriend(friend);
    fetchMessages(friend._id);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedFriend) return;

    try {
      const response = await fetch(`${API_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          to: selectedFriend._id,
          content: message
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          setMessages(prev => [...prev, data.message]);
          setMessage('');
        }
      }
    } catch (err) {
      console.error('发送消息失败:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/search?keyword=${searchQuery}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.users) {
        setSearchResults(data.users.filter((u: User) => u._id !== currentUser._id));
      }
    } catch (err) {
      console.error('搜索用户失败:', err);
    }
  };

  const handleSendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/friends/request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ friendId: userId })
      });

      if (response.ok) {
        setSearchResults(prev => prev.filter(u => u._id !== userId));
        alert('好友请求已发送');
      }
    } catch (err) {
      console.error('发送好友请求失败:', err);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/friends/accept`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ requestId })
      });

      if (response.ok) {
        setFriendRequests(prev => prev.filter(r => r.id !== requestId));
        await fetchFriends();
        setSelectedTab('friends');
        alert('已添加好友');
      }
    } catch (err) {
      console.error('接受好友请求失败:', err);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/friends/reject`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ requestId })
      });

      if (response.ok) {
        setFriendRequests(prev => prev.filter(r => r.id !== requestId));
      }
    } catch (err) {
      console.error('拒绝好友请求失败:', err);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>消息</ChatTitle>
        <AddFriendButton onClick={() => setIsAddFriendModalOpen(true)}>
          <UserPlus size={18} />
          添加好友
        </AddFriendButton>
      </ChatHeader>

      <ChatContent>
        <ContactsList>
          <ContactsHeader>
            <Tabs>
              <TabButton active={selectedTab === 'friends'} onClick={() => setSelectedTab('friends')}>
                <Users size={16} style={{ marginRight: theme.spacing[1] }} />
                好友
              </TabButton>
              <TabButton active={selectedTab === 'requests'} onClick={() => setSelectedTab('requests')}>
                <Mail size={16} style={{ marginRight: theme.spacing[1] }} />
                请求 {friendRequests.length > 0 && `(${friendRequests.length})`}
              </TabButton>
            </Tabs>
            <SearchBar>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput 
                placeholder="搜索联系人..." 
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchUsers();
                }}
              />
            </SearchBar>
          </ContactsHeader>
          <ContactsItems>
            {selectedTab === 'friends' ? (
              friends.length > 0 ? (
                friends.map((friend) => (
                  <ContactItem 
                    key={friend._id} 
                    active={selectedFriend?._id === friend._id}
                    unread={false}
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <ContactAvatar>
                      <AvatarCircle>{friend.username.slice(0, 1)}</AvatarCircle>
                    </ContactAvatar>
                    <ContactInfo>
                      <ContactName>{friend.username}</ContactName>
                      <ContactMessage>点击开始聊天...</ContactMessage>
                    </ContactInfo>
                  </ContactItem>
                ))
              ) : (
                <NoFriendsMessage>
                  <Users size={40} style={{ marginBottom: theme.spacing[2], opacity: 0.5 }} />
                  <p>暂无好友，点击右上角添加好友</p>
                </NoFriendsMessage>
              )
            ) : (
              friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <FriendRequestItem key={request.id}>
                    <FriendRequestAvatar>
                      {request.user?.username.slice(0, 1) || '?'}
                    </FriendRequestAvatar>
                    <FriendRequestInfo>
                      <FriendRequestName>{request.user?.username}</FriendRequestName>
                      <FriendRequestTime>请求添加你为好友</FriendRequestTime>
                    </FriendRequestInfo>
                    <FriendRequestActions>
                      <RequestActionButton accept={true} onClick={() => handleAcceptRequest(request.id)}>
                        <Check size={16} />
                      </RequestActionButton>
                      <RequestActionButton accept={false} onClick={() => handleRejectRequest(request.id)}>
                        <X size={16} />
                      </RequestActionButton>
                    </FriendRequestActions>
                  </FriendRequestItem>
                ))
              ) : (
                <NoFriendsMessage>
                  <Mail size={40} style={{ marginBottom: theme.spacing[2], opacity: 0.5 }} />
                  <p>暂无好友请求</p>
                </NoFriendsMessage>
              )
            )}
          </ContactsItems>
        </ContactsList>

        <ChatArea>
          {selectedFriend ? (
            <>
              <ChatHeaderBar>
                <ChatAvatar>{selectedFriend.username.slice(0, 1)}</ChatAvatar>
                <ChatInfo>
                  <ChatName>{selectedFriend.username}</ChatName>
                </ChatInfo>
                <ChatActions>
                  <ActionButton>
                    <Bell size={18} />
                  </ActionButton>
                  <ActionButton>
                    <MoreVertical size={18} />
                  </ActionButton>
                </ChatActions>
              </ChatHeaderBar>

              <MessagesArea ref={messagesAreaRef}>
                <MessagesList>
                  {messages.map((msg) => {
                    const fromId = typeof msg.from === 'object' ? msg.from._id : msg.from;
                    const isSender = fromId === currentUser._id;
                    
                    let sharedPost: SharedPost | null = null;
                    if (msg.type === 'share') {
                      try {
                        sharedPost = JSON.parse(msg.content);
                      } catch (e) {
                        console.error('解析分享内容失败:', e);
                      }
                    }
                    
                    return (
                      <MessageItem key={msg._id} isSender={isSender}>
                        <MessageBubble isSender={isSender}>
                          {sharedPost ? (
                            <>
                              <SharedPostCard>
                                <SharedPostHeader>分享了一篇帖子</SharedPostHeader>
                                <SharedPostContent>
                                  <SharedPostTitle>{sharedPost.title}</SharedPostTitle>
                                  <SharedPostText>{sharedPost.content}</SharedPostText>
                                  <SharedPostAuthor>作者: {sharedPost.author}</SharedPostAuthor>
                                  <SharedPostTags>
                                    {sharedPost.tags.map((tag, index) => (
                                      <SharedPostTag key={index}>{tag}</SharedPostTag>
                                    ))}
                                  </SharedPostTags>
                                </SharedPostContent>
                              </SharedPostCard>
                            </>
                          ) : (
                            <MessageContent>{msg.content}</MessageContent>
                          )}
                        </MessageBubble>
                        <MessageTime>{new Date(msg.createdAt).toLocaleString()}</MessageTime>
                      </MessageItem>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </MessagesList>
              </MessagesArea>

              <InputArea>
                <InputContainer>
                  <InputButtons>
                    <InputButton>
                      <Smile size={18} />
                    </InputButton>
                    <InputButton>
                      <Image size={18} />
                    </InputButton>
                  </InputButtons>
                  <MessageInput 
                    type="text" 
                    placeholder="输入消息..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <SendButton onClick={handleSendMessage}>
                    <Send size={18} color="white" />
                  </SendButton>
                </InputContainer>
              </InputArea>
            </>
          ) : (
            <EmptyState>
              <EmptyIcon>
                <Mail size={40} />
              </EmptyIcon>
              <EmptyTitle>选择一个联系人开始聊天</EmptyTitle>
            </EmptyState>
          )}
        </ChatArea>
      </ChatContent>

      <AddFriendModal isOpen={isAddFriendModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>添加好友</ModalTitle>
            <CloseButton onClick={() => setIsAddFriendModalOpen(false)}>
              <X size={18} />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <SearchBar>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput 
                placeholder="搜索用户名或邮箱..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchUsers();
                  }
                }}
              />
              <SearchButton onClick={handleSearchUsers}>
                <Search size={16} />
              </SearchButton>
            </SearchBar>
            {searchResults.length > 0 && (
              <div style={{ marginTop: theme.spacing[4] }}>
                {searchResults.map((user) => (
                  <SearchResultItem key={user._id}>
                    <SearchResultAvatar>{user.username.slice(0, 1)}</SearchResultAvatar>
                    <SearchResultInfo>
                      <SearchResultName>{user.username}</SearchResultName>
                      <SearchResultEmail>{user.email}</SearchResultEmail>
                    </SearchResultInfo>
                    <AddButton onClick={() => handleSendFriendRequest(user._id)}>
                      <UserPlus size={16} />
                      添加
                    </AddButton>
                  </SearchResultItem>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div style={{ marginTop: theme.spacing[4], textAlign: 'center', color: theme.colors.neutral[500] }}>
                未找到用户
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </AddFriendModal>
    </ChatContainer>
  );
};