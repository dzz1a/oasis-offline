import { useState } from 'react';
import styled from 'styled-components';
import { Heart, MessageCircle, Share2, Send, Plus, Filter, Search, X } from 'lucide-react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { mockPosts, mockCommunities, mockUsers } from '../data/mockData';

interface ForumPageProps {
  onNavigate: (page: string) => void;
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

export const ForumPage = ({ onNavigate }: ForumPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setTags('');
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
          {mockPosts.map((post) => (
            <PostCard key={post.id}>
              <PostHeader>
                <PostAvatar>{post.author.username.slice(0, 1)}</PostAvatar>
                <PostAuthorInfo>
                  <PostAuthor>{post.author.username}</PostAuthor>
                  <PostMeta>
                    {post.createdAt.toLocaleDateString()} · {post.tags[0]}
                  </PostMeta>
                </PostAuthorInfo>
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
                      className={likedPosts.includes(post.id) ? 'liked' : ''}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart size={18} />
                      {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                    </ActionButton>
                    <ActionButton>
                      <MessageCircle size={18} />
                      {post.comments} 评论
                    </ActionButton>
                    <ActionButton>
                      <Share2 size={18} />
                      分享
                    </ActionButton>
                  </PostActions>
                </PostFooter>
              </CardBody>
            </PostCard>
          ))}
        </PostsList>

        <Sidebar>
          <SidebarCard>
            <CardHeader>
              <SidebarTitle>热门社群</SidebarTitle>
            </CardHeader>
            <CardBody>
              <CommunitiesList>
                {mockCommunities.map((community) => (
                  <CommunityItem key={community.id}>
                    <CommunityIcon>
                      <span>{community.name.slice(0, 1)}</span>
                    </CommunityIcon>
                    <CommunityInfo>
                      <CommunityName>{community.name}</CommunityName>
                      <CommunityMembers>{community.members.length} 位成员</CommunityMembers>
                    </CommunityInfo>
                  </CommunityItem>
                ))}
              </CommunitiesList>
            </CardBody>
          </SidebarCard>

          <SidebarCard>
            <CardHeader>
              <SidebarTitle>热门标签</SidebarTitle>
            </CardHeader>
            <CardBody>
              <TrendingTags>
                <TagList>
                  {['休学', '焦虑', '大学生', '社交', '心理', '疗愈', '成长', '就业'].map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagList>
              </TrendingTags>
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
    </ForumContainer>
  );
};