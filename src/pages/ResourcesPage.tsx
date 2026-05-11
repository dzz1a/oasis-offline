import { useState } from 'react';
import styled from 'styled-components';
import { BookOpen, PlayCircle, FileAudio, FileText, Search, Filter, ChevronRight, Clock, Eye, ArrowRight } from 'lucide-react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { mockResources } from '../data/mockData';

interface ResourcesPageProps {
  onNavigate: (page: string) => void;
}

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

const Categories = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[6]};
  overflow-x: auto;
`;

const CategoryButton = styled.button<{ active: boolean }>`
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

  ${({ active }) => active 
    ? `
      background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
      color: white;
    ` 
    : `
      background: white;
      color: ${theme.colors.neutral[600]};
      border: 1px solid ${theme.colors.neutral[200]};
      &:hover {
        background: ${theme.colors.neutral[50]};
      }
    `
  }
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing[6]};
`;

const ResourceCard = styled(Card)`
  cursor: pointer;
`;

const ResourceThumbnail = styled.div`
  height: 180px;
  background: linear-gradient(135deg, ${theme.colors.primary[100]} 0%, ${theme.colors.calm[100]} 100%);
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

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const AuthorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.calm[400]} 100%);
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

export const ResourcesPage = ({ onNavigate }: ResourcesPageProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: '全部', icon: FileText },
    { id: 'article', label: '文章', icon: FileText },
    { id: 'audio', label: '音频', icon: FileAudio },
    { id: 'video', label: '视频', icon: PlayCircle },
  ];

  const filteredResources = activeCategory === 'all' 
    ? mockResources 
    : mockResources.filter(r => r.type === activeCategory);

  return (
    <ResourcesContainer>
      <ResourcesHeader>
        <ResourcesTitle>资源中心</ResourcesTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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

      <Categories>
        {categories.map((category) => (
          <CategoryButton 
            key={category.id} 
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            <category.icon size={18} />
            {category.label}
          </CategoryButton>
        ))}
      </Categories>

      <ResourcesGrid>
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} hoverable>
            <ResourceThumbnail>
              {resource.type === 'video' && (
                <PlayButton>
                  <PlayCircle size={28} color={theme.colors.primary[600]} />
                </PlayButton>
              )}
              {resource.type === 'audio' && (
                <FileAudio size={48} color={theme.colors.primary[600]} />
              )}
              {resource.type === 'article' && (
                <BookOpen size={48} color={theme.colors.calm[600]} />
              )}
            </ResourceThumbnail>
            <ResourceInfo>
              <ResourceTags>
                {resource.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </ResourceTags>
              <ResourceTitle>{resource.title}</ResourceTitle>
              <ResourceDescription>{resource.description}</ResourceDescription>
              <ResourceMeta>
                <AuthorInfo>
                  <AuthorAvatar>{resource.author.username.slice(0, 1)}</AuthorAvatar>
                  <AuthorName>{resource.author.username}</AuthorName>
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
      </ResourcesGrid>

      <ViewAllButton>
        <Button variant="outline">
          查看更多资源
          <ArrowRight size={18} />
        </Button>
      </ViewAllButton>
    </ResourcesContainer>
  );
};