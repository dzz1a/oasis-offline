import { useState } from 'react';
import styled from 'styled-components';
import { Send, Search, Bell, Smile, Image, MoreVertical, Mail } from 'lucide-react';
import { theme } from '../styles/theme';
import { Card } from '../components/ui/Card';
import { mockMessages, mockUsers } from '../data/mockData';

interface ChatPageProps {
  onNavigate: (page: string) => void;
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

const StatusDot = styled.div<{ online: boolean }>`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ online }) => online ? theme.colors.success[500] : theme.colors.neutral[300]};
  border: 2px solid white;
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

const ContactTime = styled.span`
  font-size: ${theme.fonts.sizes.xs};
  color: ${theme.colors.neutral[400]};
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

const ChatStatus = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.success[500]};
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
`;

const MessageBubble = styled.div<{ isSender: boolean }>`
  max-width: 70%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.xl};
  ${({ isSender }) => isSender 
    ? `
      background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
      color: white;
      border-bottom-right-radius: ${theme.borderRadius.sm};
    ` 
    : `
      background: white;
      color: ${theme.colors.neutral[800]};
      border-bottom-left-radius: ${theme.borderRadius.sm};
      box-shadow: ${theme.shadows.sm};
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

export const ChatPage = ({ onNavigate }: ChatPageProps) => {
  const [selectedContact, setSelectedContact] = useState(mockUsers[2]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages.filter(m => m.senderId === selectedContact.id || m.receiverId === '1'));

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        senderId: '1',
        sender: mockUsers[0],
        receiverId: selectedContact.id,
        content: message,
        createdAt: new Date(),
        isRead: false,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>消息</ChatTitle>
      </ChatHeader>

      <ChatContent>
        <ContactsList>
          <ContactsHeader>
            <SearchBar>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput placeholder="搜索联系人..." />
            </SearchBar>
          </ContactsHeader>
          <ContactsItems>
            {mockUsers.filter(u => u.id !== '1').map((user) => (
              <ContactItem 
                key={user.id} 
                active={selectedContact.id === user.id}
                unread={user.id === '2'}
                onClick={() => setSelectedContact(user)}
              >
                <ContactAvatar>
                  <AvatarCircle>{user.username.slice(0, 1)}</AvatarCircle>
                  <StatusDot online={user.status === 'active'} />
                </ContactAvatar>
                <ContactInfo>
                  <ContactName>{user.username}</ContactName>
                  <ContactMessage>最近的消息...</ContactMessage>
                </ContactInfo>
                <div>
                  <ContactTime>刚刚</ContactTime>
                  {user.id === '2' && <UnreadBadge>2</UnreadBadge>}
                </div>
              </ContactItem>
            ))}
          </ContactsItems>
        </ContactsList>

        <ChatArea>
          {selectedContact ? (
            <>
              <ChatHeaderBar>
                <ChatAvatar>{selectedContact.username.slice(0, 1)}</ChatAvatar>
                <ChatInfo>
                  <ChatName>{selectedContact.username}</ChatName>
                  <ChatStatus>在线</ChatStatus>
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

              <MessagesArea>
                <MessagesList>
                  {messages.map((msg) => (
                    <MessageItem key={msg.id} isSender={msg.senderId === '1'}>
                      <MessageBubble isSender={msg.senderId === '1'}>
                        <MessageContent>{msg.content}</MessageContent>
                      </MessageBubble>
                      <MessageTime>{msg.createdAt.toLocaleTimeString()}</MessageTime>
                    </MessageItem>
                  ))}
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
                  <SendButton onClick={handleSend}>
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
    </ChatContainer>
  );
};