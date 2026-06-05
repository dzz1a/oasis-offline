import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Heart,
  Users,
  BookOpen,
  PlayCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import {
  mockResources,
  mockCommunities,
} from '../data/mockData';
import { API_URL } from '../config/api';

interface Post {
  _id: string;
  id: string;
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  comments: { _id: string; content: string }[];
  createdAt: string;
  author: {
    _id: string;
    username: string;
  };
}

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const PageWrapper = styled.div`
  background: linear-gradient(
    180deg,
    #f8fafc 0%,
    #f3f7ff 35%,
    #f8fafc 100%
  );
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  padding: 140px 24px 120px;

  background:
    radial-gradient(
      circle at top left,
      rgba(129, 140, 248, 0.25),
      transparent 35%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(96, 165, 250, 0.18),
      transparent 35%
    ),
    linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%);
`;

const HeroGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(167, 139, 250, 0.15);
  filter: blur(100px);
  top: -120px;
  right: -120px;
`;

const HeroContent = styled(Container)`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 10px 18px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.7);

  backdrop-filter: blur(16px);

  border: 1px solid rgba(255, 255, 255, 0.8);

  margin-bottom: 28px;

  color: #6366f1;

  font-size: 14px;
  font-weight: 600;
`;

const HeroTitle = styled.h1`
  font-size: clamp(3rem, 7vw, 5.5rem);
  line-height: 1.05;
  letter-spacing: -0.05em;
  font-weight: 800;

  color: #111827;

  margin-bottom: 28px;
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroSubtitle = styled.p`
  max-width: 760px;

  margin: 0 auto 52px;

  font-size: 1.15rem;
  line-height: 1.9;

  color: #6b7280;
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
`;

const GlassButton = styled(Button)`
  padding: 14px 28px !important;

  border-radius: 16px !important;

  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.2);

  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-4px);
  }
`;

const OutlineButton = styled(Button)`
  padding: 14px 28px !important;

  border-radius: 16px !important;

  background: rgba(255, 255, 255, 0.7) !important;

  backdrop-filter: blur(12px);

  border: 1px solid rgba(255, 255, 255, 0.9) !important;

  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-4px);
    background: white !important;
  }
`;

const Section = styled.section`
  padding: 120px 24px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-weight: 800;

  text-align: center;

  color: #111827;

  margin-bottom: 18px;
`;

const SectionSubtitle = styled.p`
  text-align: center;

  max-width: 680px;

  margin: 0 auto 72px;

  line-height: 1.8;

  color: #6b7280;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
`;

const GlassCard = styled(Card)`
  position: relative;

  overflow: hidden;

  border-radius: 28px !important;

  border: 1px solid rgba(255, 255, 255, 0.8);

  background: rgba(255, 255, 255, 0.72);

  backdrop-filter: blur(16px);

  box-shadow:
    0 10px 40px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);

  transition: all 0.35s ease !important;

  &:hover {
    transform: translateY(-8px);
    box-shadow:
      0 20px 60px rgba(15, 23, 42, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }
`;

const FeatureIcon = styled.div`
  width: 74px;
  height: 74px;

  border-radius: 24px;

  margin: 0 auto 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.15) 0%,
    rgba(139, 92, 246, 0.18) 100%
  );
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;

  text-align: center;

  margin-bottom: 16px;

  color: #111827;
`;

const FeatureDescription = styled.p`
  text-align: center;
  line-height: 1.8;
  color: #6b7280;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
`;

const PostCard = styled(GlassCard)`
  cursor: pointer;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  margin-bottom: 24px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

  color: white;
  font-weight: 700;
`;

const PostTitle = styled.h3`
  font-size: 1.4rem;
  line-height: 1.4;
  font-weight: 700;

  margin-bottom: 16px;

  color: #111827;
`;

const PostContent = styled.p`
  line-height: 1.9;

  color: #6b7280;

  margin-bottom: 24px;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StyledTag = styled(Tag)`
  background: rgba(99, 102, 241, 0.08) !important;

  color: #6366f1 !important;

  border: none !important;

  border-radius: 999px !important;

  padding: 6px 12px !important;
`;

const TagsWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  margin-bottom: 28px;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(229, 231, 235, 0.7);

  margin-bottom: 18px;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatGroup = styled.div`
  display: flex;
  gap: 18px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  color: #6b7280;

  font-size: 14px;
`;

const ExploreLink = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 600;

  color: #6366f1;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
`;

const ResourceCard = styled(GlassCard)`
  cursor: pointer;
`;

const ResourceTop = styled.div`
  display: flex;
  gap: 18px;
`;

const ResourceIcon = styled.div`
  width: 72px;
  height: 72px;

  border-radius: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.14) 0%,
    rgba(96, 165, 250, 0.16) 100%
  );

  flex-shrink: 0;
`;

const ResourceTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;

  margin-bottom: 10px;

  color: #111827;
`;

const ResourceDescription = styled.p`
  line-height: 1.7;

  color: #6b7280;

  margin-bottom: 18px;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;

  color: #9ca3af;

  font-size: 14px;
`;

const CommunityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
`;

const CommunityCard = styled(GlassCard)`
  text-align: center;
  cursor: pointer;
`;

const CommunityIcon = styled.div`
  width: 88px;
  height: 88px;

  margin: 0 auto 24px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
`;

const CommunityName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;

  margin-bottom: 12px;

  color: #111827;
`;

const CommunityDescription = styled.p`
  line-height: 1.8;
  color: #6b7280;

  margin-bottom: 28px;
`;

const MemberRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MemberAvatar = styled.div`
  width: 34px;
  height: 34px;

  margin-left: -8px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);

  border: 2px solid white;

  color: white;
  font-size: 12px;
`;

const MemberCount = styled.span`
  margin-left: 12px;

  color: #6b7280;

  font-size: 14px;
`;
//做出了小修改，使得在跳转的时候自动回到页面顶部
export const HomePage = ({ onNavigate }: HomePageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/forum/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.posts) {
          setPosts(data.posts);
        }
      })
      .catch((err) => {
        console.error('获取帖子失败:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleNavigate = (page: string) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    onNavigate(page);
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroGlow />

        <HeroContent>
          <HeroBadge>
            <Sparkles size={20} />
            温柔、平静、被理解
          </HeroBadge>

          <HeroTitle>
            欢迎来到
            <br />
            <GradientText>离线绿洲</GradientText>
          </HeroTitle>

          <HeroSubtitle>
            一个关注情绪疗愈与内心成长的空间。
            <br />
            在焦虑、疲惫与孤独之外，给自己留一块可以慢慢呼吸的地方。
          </HeroSubtitle>

          <HeroButtons>
            <GlassButton onClick={() => handleNavigate('forum')}>
              开始探索
            </GlassButton>

            <OutlineButton
              variant="outline"
              onClick={() => handleNavigate('resources')}
            >
              查看资源
            </OutlineButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle>我们能为你做什么</SectionTitle>

          <SectionSubtitle>
            从心理支持到社区陪伴，我们希望这里不仅仅是一个网站，
            更像是你偶尔想回来坐一会儿的地方。
          </SectionSubtitle>

          <FeaturesGrid>
            <GlassCard>
              <CardBody>
                <FeatureIcon>
                  <Heart size={34} color="#6366f1" />
                </FeatureIcon>

                <FeatureTitle>心理支持</FeatureTitle>

                <FeatureDescription>
                  专业咨询与温柔陪伴，帮助你面对情绪压力与内心困惑。
                </FeatureDescription>
              </CardBody>
            </GlassCard>

            <GlassCard>
              <CardBody>
                <FeatureIcon>
                  <Users size={34} color="#8b5cf6" />
                </FeatureIcon>

                <FeatureTitle>社区交流</FeatureTitle>

                <FeatureDescription>
                  与拥有相似经历的人交流，找到理解与归属感。
                </FeatureDescription>
              </CardBody>
            </GlassCard>

            <GlassCard>
              <CardBody>
                <FeatureIcon>
                  <BookOpen size={34} color="#60a5fa" />
                </FeatureIcon>

                <FeatureTitle>成长资源</FeatureTitle>

                <FeatureDescription>
                  冥想、文章、课程与心理知识，陪你慢慢建立力量。
                </FeatureDescription>
              </CardBody>
            </GlassCard>

            <GlassCard>
              <CardBody>
                <FeatureIcon>
                  <PlayCircle size={34} color="#6366f1" />
                </FeatureIcon>

                <FeatureTitle>情景模拟</FeatureTitle>

                <FeatureDescription>
                  社交、面试与表达训练，让你更自然地面对现实生活。
                </FeatureDescription>
              </CardBody>
            </GlassCard>
          </FeaturesGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>最新动态</SectionTitle>

          <SectionSubtitle>
            一些真实的分享、情绪记录与温柔回应。
          </SectionSubtitle>

          <PostsGrid>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <PostCard key={index} hoverable>
                  <CardBody>
                    <PostHeader>
                      <Avatar style={{ opacity: 0.5 }}>
                        ...
                      </Avatar>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: '#111827',
                            opacity: 0.5,
                          }}
                        >
                          加载中...
                        </div>
                      </div>
                    </PostHeader>
                    <div
                      style={{
                        height: '40px',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '8px',
                        marginBottom: '16px',
                      }}
                    />
                    <div
                      style={{
                        height: '60px',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '8px',
                      }}
                    />
                  </CardBody>
                </PostCard>
              ))
            ) : posts.length > 0 ? (
              posts.slice(0, 3).map((post) => (
                <PostCard
                  key={post._id}
                  hoverable
                  onClick={() => handleNavigate('forum')}
                >
                  <CardBody>
                    <PostHeader>
                      <Avatar>
                        {post.author.username.slice(0, 1)}
                      </Avatar>

                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: '#111827',
                          }}
                        >
                          {post.author.username}
                        </div>

                        <div
                          style={{
                            fontSize: 14,
                            color: '#9ca3af',
                          }}
                        >
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </PostHeader>

                    <PostTitle>{post.title}</PostTitle>

                    <PostContent>{post.content}</PostContent>

                    <TagsWrapper>
                      {post.tags.map((tag) => (
                        <StyledTag key={tag}>{tag}</StyledTag>
                      ))}
                    </TagsWrapper>

                    <Divider />

                    <Stats>
                      <StatGroup>
                        <StatItem>
                          <Heart size={16} />
                          {post.likes.length}
                        </StatItem>

                        <StatItem>
                          <Users size={16} />
                          {post.comments.length}
                        </StatItem>
                      </StatGroup>

                      <ExploreLink>
                        阅读更多
                        <ArrowRight size={16} />
                      </ExploreLink>
                    </Stats>
                  </CardBody>
                </PostCard>
              ))
            ) : (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6b7280',
                }}
              >
                <Heart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>还没有动态，成为第一个分享的人吧</p>
              </div>
            )}
          </PostsGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>热门资源</SectionTitle>

          <SectionSubtitle>
            适合一个人慢慢听、慢慢看、慢慢恢复能量的内容。
          </SectionSubtitle>

          <ResourceGrid>
            {mockResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                hoverable
                onClick={() => handleNavigate('resources')}
              >
                <CardBody>
                  <ResourceTop>
                    <ResourceIcon>
                      {resource.type === 'audio' && (
                        <BookOpen size={30} color="#6366f1" />
                      )}

                      {resource.type === 'video' && (
                        <PlayCircle size={30} color="#8b5cf6" />
                      )}

                      {resource.type === 'article' && (
                        <BookOpen size={30} color="#60a5fa" />
                      )}
                    </ResourceIcon>

                    <div>
                      <ResourceTitle>
                        {resource.title}
                      </ResourceTitle>

                      <ResourceDescription>
                        {resource.description}
                      </ResourceDescription>

                      <Meta>
                        <span>{resource.author.username}</span>

                        <span>
                          {resource.views} 次浏览
                        </span>
                      </Meta>
                    </div>
                  </ResourceTop>
                </CardBody>
              </ResourceCard>
            ))}
          </ResourceGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>加入社群</SectionTitle>

          <SectionSubtitle>
            在这里，你不需要假装自己一直很坚强。
          </SectionSubtitle>

          <CommunityGrid>
            {mockCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                hoverable
                onClick={() => handleNavigate('forum')}
              >
                <CardBody>
                  <CommunityIcon>
                    <Users size={36} color="white" />
                  </CommunityIcon>

                  <CommunityName>
                    {community.name}
                  </CommunityName>

                  <CommunityDescription>
                    {community.description}
                  </CommunityDescription>

                  <MemberRow>
                    {community.members
                      .slice(0, 3)
                      .map((member) => (
                        <MemberAvatar key={member.id}>
                          {member.username.slice(0, 1)}
                        </MemberAvatar>
                      ))}

                    <MemberCount>
                      {community.members.length} 位成员
                    </MemberCount>
                  </MemberRow>
                </CardBody>
              </CommunityCard>
            ))}
          </CommunityGrid>
        </Container>
      </Section>
    </PageWrapper>
  );
};