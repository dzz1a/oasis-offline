import { useState } from 'react';
import styled from 'styled-components';

import {
  BookOpen,
  PlayCircle,
  FileAudio,
  FileText,
  Search,
  Filter,
  Eye,
  ArrowRight,
  Globe,
  MapPin,
} from 'lucide-react';

import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';

interface ResourcesPageProps {
  onNavigate: (page: string) => void;
}

const onlineEmotionResources = [
  {
    id: '1',
    type: 'article',
    title: '如何缓解长期焦虑感',
    description:
      '来自简单心理的心理科普文章，讲解焦虑与压力调节。',
    tags: ['焦虑', '心理'],
    views: 2481,
    link: 'https://www.youpsy.cn/',
    author: {
      username: '简单心理',
    },
  },
  {
    id: '2',
    type: 'audio',
    title: '睡前减压冥想',
    description:
      '适合夜晚放松情绪的轻冥想音频资源。',
    tags: ['冥想', '睡眠'],
    views: 3912,
    link: 'https://www.ximalaya.com/so/%E7%9D%A1%E5%89%8D%E5%86%A5%E6%83%B3',
    author: {
      username: '喜马拉雅',
    },
  },
  {
    id: '3',
    type: 'video',
    title: '情绪低落时怎么办？',
    description:
      '关于情绪恢复与自我接纳的视频。',
    tags: ['情绪', '视频'],
    views: 5210,
    link: 'https://www.bilibili.com/video/BV19G411K7qU/?spm_id_from=333.337.search-card.all.click&vd_source=481426d5fe1b1fb623d4212c951ba05d',
    author: {
      username: 'Bilibili',
    },
  },
];

const onlineFamilyResources = [
  {
    id: 'f1',
    type: 'article',
    title: '如何与青春期孩子有效沟通',
    description:
      '帮助家长了解青春期孩子的心理特点，建立良好的沟通方式。',
    tags: ['家庭教育', '沟通'],
    views: 8532,
    link: 'https://mp.weixin.qq.com/s/6tgd4tr41rBaUbBKUcI-wg',
    author: {
      username: '家庭教育指导',
    },
  },
  {
    id: 'f2',
    type: 'article',
    title: '家长如何识别孩子的情绪问题',
    description:
      '学习识别孩子情绪异常的信号，及时给予支持和帮助。',
    tags: ['情绪识别', '家长学习'],
    views: 6234,
    link: 'https://mp.weixin.qq.com/s/saUR5o1Tyaoi8uJzzQyUUA',
    author: {
      username: '心理成长课堂',
    },
  },
  {
    id: 'f3',
    type: 'article',
    title: '家庭环境对孩子心理健康的影响',
    description:
      '了解家庭环境如何塑造孩子的心理状态，营造健康的家庭氛围。',
    tags: ['家庭环境', '心理健康'],
    views: 4891,
    link: 'https://mp.weixin.qq.com/s/mu-GINBjL6DoQf45Tyu7SA',
    author: {
      username: '亲子教育平台',
    },
  },
];

const offlineResources = [
  {
    id: 'o1',
    title: 'GLT 实景剧本杀沉浸式成长夏令营',
    description:
      '采用实景剧本杀 + GLT 成长力赋能双模式，通过古风 & 湖畔实景探案、马术、非洲鼓体验搭配专业心理课程，改善孩子社交胆怯、情绪内耗、自我封闭等问题，由专业心理导师全程陪伴辅导。',
    tags: ['夏令营', '剧本杀', '心理成长'],
    views: 2340,
    link: 'https://mp.weixin.qq.com/s/kFVSv4h7ZHALTI2efzqcLA',
    location: '山东济南（大明湖、曲水亭街、专业马术营地）',
    date: '2026年7月21日-7月26日（6天5晚）',
  },
  {
    id: 'o2',
    title: '社交重塑・摆脱成瘾家庭关系工作坊',
    description:
      '冯雪臻老师主讲，依托认知重构、互动游戏、真实家庭案例解析，探寻孩子电子产品成瘾、亲子疏离、社交焦虑根源，传授可落地的亲子相处与社交修复实操方法。',
    tags: ['工作坊', '家庭关系', '社交焦虑'],
    views: 1856,
    link: 'https://mp.weixin.qq.com/s/gTtuEtagm5u8zWFyccQuIw',
    location: '山东济南',
    date: '2026年5月4日-5月6日',
  },
];

const ResourcesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[4]};
`;

const ResourcesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
`;

const ResourcesTitle = styled.h1`
  font-size: ${theme.fonts.sizes['2xl']};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
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
  margin-left: ${theme.spacing[3]};

  &:hover {
    background: ${theme.colors.neutral[50]};
  }
`;

const MainTabs = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[6]};
`;

const MainTabButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  border-radius: ${theme.borderRadius.md};
  border: none;
  font-weight: ${theme.fonts.weights.medium};
  font-size: ${theme.fonts.sizes.lg};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  ${({ active }) =>
    active
      ? `
      background: linear-gradient(
        135deg,
        ${theme.colors.primary[500]} 0%,
        ${theme.colors.primary[600]} 100%
      );
      color: white;
    `
      : `
      background: white;
      color: ${theme.colors.neutral[600]};
      border: 1px solid ${theme.colors.neutral[200]};

      &:hover {
        background: ${theme.colors.neutral[50]};
      }
    `}
`;

const SubCategories = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[6]};
  overflow-x: auto;
`;

const SubCategoryButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.full};
  border: none;
  font-weight: ${theme.fonts.weights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  white-space: nowrap;

  ${({ active }) =>
    active
      ? `
      background: linear-gradient(
        135deg,
        ${theme.colors.calm[500]} 0%,
        ${theme.colors.calm[600]} 100%
      );
      color: white;
    `
      : `
      background: white;
      color: ${theme.colors.neutral[600]};
      border: 1px solid ${theme.colors.neutral[200]};

      &:hover {
        background: ${theme.colors.neutral[50]};
      }
    `}
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(350px, 1fr)
  );
  gap: ${theme.spacing[6]};
`;

const ResourceCard = styled(Card)`
  cursor: pointer;
`;

const ResourceThumbnail = styled.div`
  height: 180px;

  background: linear-gradient(
    135deg,
    ${theme.colors.primary[100]} 0%,
    ${theme.colors.calm[100]} 100%
  );

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
`;

const OfflineThumbnail = styled.div`
  height: 180px;

  background: linear-gradient(
    135deg,
    ${theme.colors.warm[100]} 0%,
    ${theme.colors.primary[100]} 100%
  );

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
`;

const PlayButton = styled.div`
  width: 48px;
  height: 48px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.9);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all ${theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.md};
  }
`;

const ResourceInfo = styled(CardBody)`
  padding: ${theme.spacing[4]};
`;

const ResourceTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const ResourceTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[2]};
`;

const ResourceDescription = styled.p`
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[4]};
`;

const ResourceMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OfflineMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const AuthorAvatar = styled.div`
  width: 32px;
  height: 32px;

  border-radius: 50%;

  background: linear-gradient(
    135deg,
    ${theme.colors.primary[400]} 0%,
    ${theme.colors.calm[400]} 100%
  );

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  font-size: ${theme.fonts.sizes.sm};
`;

const AuthorName = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[600]};
`;

const ResourceStats = styled.div`
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

const ViewAllButton = styled.div`
  text-align: center;
  margin-top: ${theme.spacing[8]};
`;

export const ResourcesPage = ({
  onNavigate,
}: ResourcesPageProps) => {
  const [activeMainTab, setActiveMainTab] = useState('online');
  const [activeSubCategory, setActiveSubCategory] = useState('emotion');

  const onlineSubCategories = [
    {
      id: 'emotion',
      label: '情绪缓解',
      icon: FileText,
    },
    {
      id: 'family',
      label: '家庭教育',
      icon: BookOpen,
    },
  ];

  const currentOnlineResources =
    activeSubCategory === 'emotion'
      ? onlineEmotionResources
      : onlineFamilyResources;

  return (
    <ResourcesContainer>
      <ResourcesHeader>
        <ResourcesTitle>资源中心</ResourcesTitle>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SearchBar>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>

            <SearchInput placeholder="搜索资源..." />
          </SearchBar>

          <FilterButton>
            <Filter size={18} />
            筛选
          </FilterButton>
        </div>
      </ResourcesHeader>

      <MainTabs>
        <MainTabButton
          active={activeMainTab === 'online'}
          onClick={() => setActiveMainTab('online')}
        >
          <Globe size={20} />
          线上资源
        </MainTabButton>

        <MainTabButton
          active={activeMainTab === 'offline'}
          onClick={() => setActiveMainTab('offline')}
        >
          <MapPin size={20} />
          线下资源
        </MainTabButton>
      </MainTabs>

      {activeMainTab === 'online' && (
        <SubCategories>
          {onlineSubCategories.map((category) => (
            <SubCategoryButton
              key={category.id}
              active={activeSubCategory === category.id}
              onClick={() => setActiveSubCategory(category.id)}
            >
              <category.icon size={18} />
              {category.label}
            </SubCategoryButton>
          ))}
        </SubCategories>
      )}

      <ResourcesGrid>
        {activeMainTab === 'online' &&
          currentOnlineResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              hoverable
              onClick={() =>
                window.open(resource.link, '_blank')
              }
            >
              <ResourceThumbnail>
                {resource.type === 'video' && (
                  <PlayButton>
                    <PlayCircle
                      size={28}
                      color={theme.colors.primary[600]}
                    />
                  </PlayButton>
                )}

                {resource.type === 'audio' && (
                  <FileAudio
                    size={48}
                    color={theme.colors.primary[600]}
                  />
                )}

                {resource.type === 'article' && (
                  <BookOpen
                    size={48}
                    color={theme.colors.calm[600]}
                  />
                )}
              </ResourceThumbnail>

              <ResourceInfo>
                <ResourceTags>
                  {resource.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </ResourceTags>

                <ResourceTitle>{resource.title}</ResourceTitle>

                <ResourceDescription>
                  {resource.description}
                </ResourceDescription>

                <ResourceMeta>
                  <AuthorInfo>
                    <AuthorAvatar>
                      {resource.author.username.slice(0, 1)}
                    </AuthorAvatar>

                    <AuthorName>
                      {resource.author.username}
                    </AuthorName>
                  </AuthorInfo>

                  <ResourceStats>
                    <StatItem>
                      <Eye size={16} />
                      {resource.views}
                    </StatItem>
                  </ResourceStats>
                </ResourceMeta>
              </ResourceInfo>
            </ResourceCard>
          ))}

        {activeMainTab === 'offline' &&
          offlineResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              hoverable
              onClick={() =>
                window.open(resource.link, '_blank')
              }
            >
              <OfflineThumbnail>
                <MapPin size={56} color={theme.colors.warm[600]} />
              </OfflineThumbnail>

              <ResourceInfo>
                <ResourceTags>
                  {resource.tags.map((tag) => (
                    <Tag key={tag} variant="warm">
                      {tag}
                    </Tag>
                  ))}
                </ResourceTags>

                <ResourceTitle>{resource.title}</ResourceTitle>

                <ResourceDescription>
                  {resource.description}
                </ResourceDescription>

                <OfflineMeta>
                  <LocationInfo>
                    <MapPin size={16} />
                    {resource.location}
                  </LocationInfo>
                  <DateInfo>
                    <CalendarIcon />
                    {resource.date}
                  </DateInfo>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto',
                    }}
                  >
                    <span
                      style={{
                        fontSize: theme.fonts.sizes.sm,
                        color: theme.colors.neutral[500],
                      }}
                    >
                      点击查看详情
                    </span>
                    <StatItem>
                      <Eye size={16} />
                      {resource.views}
                    </StatItem>
                  </div>
                </OfflineMeta>
              </ResourceInfo>
            </ResourceCard>
          ))}
      </ResourcesGrid>

      <ViewAllButton>
        <Button
          variant="outline"
          onClick={() => {
            if (activeMainTab === 'online') {
              window.open('https://www.jiandanxinli.com', '_blank');
            }
          }}
        >
          查看更多资源
          <ArrowRight size={18} />
        </Button>
      </ViewAllButton>
    </ResourcesContainer>
  );
};

const CalendarIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E")
            center/contain no-repeat;
`;