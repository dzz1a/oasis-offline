import styled from 'styled-components';
import { TreeDeciduous, Heart, Users, BookOpen, PlayCircle, Sparkles } from 'lucide-react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { mockPosts, mockResources, mockCommunities } from '../data/mockData';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HeroSection = styled.section`
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
  background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.calm[50]} 50%, ${theme.colors.warm[50]} 100%);
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: ${theme.fonts.sizes['4xl']};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[4]};

  @media (max-width: 768px) {
    font-size: ${theme.fonts.sizes['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.fonts.sizes.lg};
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[8]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
`;

const FeaturesSection = styled.section`
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
`;

const FeaturesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fonts.sizes['2xl']};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing[6]};
`;

const FeatureCard = styled(Card)`
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(135deg, ${theme.colors.primary[100]} 0%, ${theme.colors.calm[100]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing[4]};
`;

const FeatureTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[2]};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.neutral[600]};
`;

const PostsSection = styled.section`
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
  background: ${theme.colors.neutral[50]};
`;

const PostsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing[6]};
`;

const PostCard = styled(Card)`
  cursor: pointer;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};
`;

const PostAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.fonts.weights.medium};
`;

const PostAuthorInfo = styled.div``;

const PostAuthor = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
`;

const PostDate = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const PostTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[2]};
`;

const PostContent = styled.p`
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[4]};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const PostStats = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const ResourcesSection = styled.section`
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
`;

const ResourcesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};
`;

const ResourceCard = styled(Card)`
  display: flex;
  gap: ${theme.spacing[4]};
  cursor: pointer;
`;

const ResourceIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(135deg, ${theme.colors.warm[100]} 0%, ${theme.colors.primary[100]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ResourceInfo = styled.div`
  flex: 1;
`;

const ResourceTitle = styled.h3`
  font-size: ${theme.fonts.sizes.base};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[1]};
`;

const ResourceDescription = styled.p`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[2]};
`;

const ResourceMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResourceAuthor = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const ResourceViews = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const CommunitiesSection = styled.section`
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
  background: ${theme.colors.neutral[50]};
`;

const CommunitiesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const CommunitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[6]};
`;

const CommunityCard = styled(Card)`
  text-align: center;
`;

const CommunityIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing[4]};
`;

const CommunityName = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[2]};
`;

const CommunityDescription = styled.p`
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[4]};
`;

const CommunityMembers = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing[1]};
`;

const MemberAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.warm[300]} 0%, ${theme.colors.primary[300]} 100%);
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fonts.sizes.xs};
  color: white;
`;

const MemberCount = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
  margin-left: ${theme.spacing[2]};
`;

export const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            <Sparkles size={40} color={theme.colors.primary[500]} style={{ display: 'inline-block', marginRight: theme.spacing[3] }} />
            欢迎来到离线绿洲
          </HeroTitle>
          <HeroSubtitle>
            在这里，找到属于你的宁静与力量。我们陪伴你走过每一段旅程，共同成长，共同疗愈。
          </HeroSubtitle>
          <HeroButtons>
            <Button onClick={() => onNavigate('forum')}>开始探索</Button>
            <Button variant="outline" onClick={() => onNavigate('resources')}>查看资源</Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContent>
          <SectionTitle>我们能为你做什么</SectionTitle>
          <FeaturesGrid>
            <FeatureCard hoverable>
              <CardBody>
                <FeatureIcon>
                  <Heart size={32} color={theme.colors.primary[600]} />
                </FeatureIcon>
                <FeatureTitle>心理支持</FeatureTitle>
                <FeatureDescription>专业心理咨询师在线陪伴，为你提供温暖的倾听和专业的指导</FeatureDescription>
              </CardBody>
            </FeatureCard>
            <FeatureCard hoverable>
              <CardBody>
                <FeatureIcon>
                  <Users size={32} color={theme.colors.calm[600]} />
                </FeatureIcon>
                <FeatureTitle>社区交流</FeatureTitle>
                <FeatureDescription>与志同道合的朋友交流分享，找到归属感和支持</FeatureDescription>
              </CardBody>
            </FeatureCard>
            <FeatureCard hoverable>
              <CardBody>
                <FeatureIcon>
                  <BookOpen size={32} color={theme.colors.warm[500]} />
                </FeatureIcon>
                <FeatureTitle>资源中心</FeatureTitle>
                <FeatureDescription>丰富的心理知识、冥想音频、视频课程等学习资源</FeatureDescription>
              </CardBody>
            </FeatureCard>
            <FeatureCard hoverable>
              <CardBody>
                <FeatureIcon>
                  <PlayCircle size={32} color={theme.colors.primary[500]} />
                </FeatureIcon>
                <FeatureTitle>情景模拟</FeatureTitle>
                <FeatureDescription>面试、社交等场景模拟，帮助你提升应对能力</FeatureDescription>
              </CardBody>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContent>
      </FeaturesSection>

      <PostsSection>
        <PostsContent>
          <SectionTitle>最新动态</SectionTitle>
          <PostsGrid>
            {mockPosts.slice(0, 3).map((post) => (
              <PostCard key={post.id} hoverable onClick={() => onNavigate('forum')}>
                <CardBody>
                  <PostHeader>
                    <PostAvatar>{post.author.username.slice(0, 1)}</PostAvatar>
                    <PostAuthorInfo>
                      <PostAuthor>{post.author.username}</PostAuthor>
                      <PostDate>{post.createdAt.toLocaleDateString()}</PostDate>
                    </PostAuthorInfo>
                  </PostHeader>
                  <PostTitle>{post.title}</PostTitle>
                  <PostContent>{post.content}</PostContent>
                  <PostTags>
                    {post.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </PostTags>
                  <PostFooter>
                    <PostStats>
                      <StatItem>
                        <Heart size={16} />
                        {post.likes}
                      </StatItem>
                      <StatItem>
                        <Users size={16} />
                        {post.comments}
                      </StatItem>
                    </PostStats>
                  </PostFooter>
                </CardBody>
              </PostCard>
            ))}
          </PostsGrid>
        </PostsContent>
      </PostsSection>

      <ResourcesSection>
        <ResourcesContent>
          <SectionTitle>热门资源</SectionTitle>
          <ResourcesGrid>
            {mockResources.map((resource) => (
              <ResourceCard key={resource.id} hoverable onClick={() => onNavigate('resources')}>
                <ResourceIcon>
                  {resource.type === 'audio' && <BookOpen size={32} color={theme.colors.primary[600]} />}
                  {resource.type === 'video' && <PlayCircle size={32} color={theme.colors.warm[500]} />}
                  {resource.type === 'article' && <BookOpen size={32} color={theme.colors.calm[600]} />}
                </ResourceIcon>
                <ResourceInfo>
                  <ResourceTitle>{resource.title}</ResourceTitle>
                  <ResourceDescription>{resource.description}</ResourceDescription>
                  <ResourceMeta>
                    <ResourceAuthor>{resource.author.username}</ResourceAuthor>
                    <ResourceViews>{resource.views} 次浏览</ResourceViews>
                  </ResourceMeta>
                </ResourceInfo>
              </ResourceCard>
            ))}
          </ResourcesGrid>
        </ResourcesContent>
      </ResourcesSection>

      <CommunitiesSection>
        <CommunitiesContent>
          <SectionTitle>加入社群</SectionTitle>
          <CommunitiesGrid>
            {mockCommunities.map((community) => (
              <CommunityCard key={community.id} hoverable onClick={() => onNavigate('forum')}>
                <CardBody>
                  <CommunityIcon>
                    <Users size={32} color="white" />
                  </CommunityIcon>
                  <CommunityName>{community.name}</CommunityName>
                  <CommunityDescription>{community.description}</CommunityDescription>
                  <CommunityMembers>
                    {community.members.slice(0, 3).map((member) => (
                      <MemberAvatar key={member.id}>{member.username.slice(0, 1)}</MemberAvatar>
                    ))}
                    <MemberCount>{community.members.length} 位成员</MemberCount>
                  </CommunityMembers>
                </CardBody>
              </CommunityCard>
            ))}
          </CommunitiesGrid>
        </CommunitiesContent>
      </CommunitiesSection>
    </>
  );
};