import { useState } from 'react';
import styled from 'styled-components';
import { Play, Clock, CheckCircle, User, MessageSquare, ChevronRight, Mic, MicOff, Video, VideoOff, X } from 'lucide-react';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockSimulations } from '../data/mockData';

interface SimulationPageProps {
  onNavigate: (page: string) => void;
}

const SimulationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[4]};
`;

const SimulationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
`;

const SimulationTitle = styled.h1`
  font-size: ${theme.fonts.sizes['2xl']};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
`;

const SimulationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};
`;

const SimulationCard = styled(Card)`
  cursor: pointer;
`;

const SimulationIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(135deg, ${theme.colors.warm[100]} 0%, ${theme.colors.primary[100]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing[4]};
`;

const SimulationType = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const TypeBadge = styled(Badge)<{ type: string }>`
  background: ${({ type }) => {
    if (type === 'interview') return theme.colors.calm[500];
    if (type === 'social') return theme.colors.primary[500];
    return theme.colors.warning[500];
  }};
`;

const TypeLabel = styled.span`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const SimulationCardTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[2]};
`;

const SimulationDescription = styled.p`
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[4]};
`;

const SimulationDuration = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[500]};
`;

const SimulationModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
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
  max-width: 800px;
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

const VideoArea = styled.div`
  background: ${theme.colors.neutral[900]};
  height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StartButton = styled(Button)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 0;
  font-size: ${theme.fonts.sizes.xl};
`;

const ScenarioInfo = styled(Card)`
  margin: ${theme.spacing[4]};
`;

const ScenarioTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[3]};
`;

const ScenarioText = styled.p`
  color: ${theme.colors.neutral[600]};
  line-height: 1.8;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
`;

const ControlButton = styled.button<{ active?: boolean; danger?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  ${({ active, danger }) => {
    if (danger) {
      return `
        background: ${theme.colors.danger[500]};
        color: white;
        &:hover {
          background: ${theme.colors.danger[600]};
        }
      `;
    }
    return active
      ? `
        background: ${theme.colors.primary[500]};
        color: white;
      `
      : `
        background: ${theme.colors.neutral[100]};
        color: ${theme.colors.neutral[600]};
        &:hover {
          background: ${theme.colors.neutral[200]};
        }
      `;
  }}
`;

const FeedbackSection = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: ${theme.colors.neutral[50]};
`;

const FeedbackTitle = styled.h3`
  font-size: ${theme.fonts.sizes.lg};
  font-weight: ${theme.fonts.weights.bold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[4]};
`;

const FeedbackCard = styled(Card)`
  margin-bottom: ${theme.spacing[4]};
`;

const FeedbackItem = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]} 0;
`;

const FeedbackIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.success[100]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeedbackContent = styled.div``;

const FeedbackLabel = styled.span`
  font-weight: ${theme.fonts.weights.medium};
  color: ${theme.colors.neutral[800]};
`;

const FeedbackText = styled.p`
  font-size: ${theme.fonts.sizes.sm};
  color: ${theme.colors.neutral[600]};
`;

export const SimulationPage = ({ onNavigate }: SimulationPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState(mockSimulations[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleStartSimulation = (simulation: typeof mockSimulations[0]) => {
    setSelectedSimulation(simulation);
    setIsModalOpen(true);
  };

  const typeLabels: Record<string, string> = {
    interview: '面试模拟',
    social: '社交模拟',
    stress: '压力模拟',
  };

  return (
    <SimulationContainer>
      <SimulationHeader>
        <SimulationTitle>情景模拟</SimulationTitle>
      </SimulationHeader>

      <SimulationsGrid>
        {mockSimulations.map((simulation) => (
          <SimulationCard key={simulation.id} hoverable onClick={() => handleStartSimulation(simulation)}>
            <CardBody>
              <SimulationIcon>
                <Play size={32} color={theme.colors.primary[600]} />
              </SimulationIcon>
              <SimulationType>
                <TypeBadge type={simulation.type}>{typeLabels[simulation.type]}</TypeBadge>
              </SimulationType>
              <SimulationCardTitle>{simulation.title}</SimulationCardTitle>
              <SimulationDescription>{simulation.description}</SimulationDescription>
              <SimulationDuration>
                <Clock size={16} />
                预计时长: {simulation.duration} 分钟
              </SimulationDuration>
            </CardBody>
            <CardFooter>
              <Button variant="outline" fullWidth>
                开始模拟
                <ChevronRight size={18} />
              </Button>
            </CardFooter>
          </SimulationCard>
        ))}
      </SimulationsGrid>

      <SimulationModal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{selectedSimulation.title}</ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <X size={18} />
            </CloseButton>
          </ModalHeader>

          <VideoArea>
            {!isRecording ? (
              <VideoOverlay>
                <StartButton onClick={() => setIsRecording(true)}>
                  <Play size={28} />
                </StartButton>
              </VideoOverlay>
            ) : (
              <>
                <div style={{ color: 'white', textAlign: 'center' }}>
                  <User size={64} style={{ marginBottom: theme.spacing[4] }} />
                  <p>模拟进行中...</p>
                </div>
                <div style={{ position: 'absolute', top: theme.spacing[4], right: theme.spacing[4], color: theme.colors.danger[400] }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.danger[500], animation: 'pulse 1s infinite' }} />
                    录制中
                  </span>
                </div>
              </>
            )}
          </VideoArea>

          <ScenarioInfo>
            <CardBody>
              <ScenarioTitle>模拟场景</ScenarioTitle>
              <ScenarioText>{selectedSimulation.scenario}</ScenarioText>
            </CardBody>
          </ScenarioInfo>

          <ControlsBar>
            <ControlButton onClick={() => setIsVideoOn(!isVideoOn)} active={isVideoOn}>
              {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </ControlButton>
            <ControlButton onClick={() => setIsRecording(!isRecording)} active={isRecording}>
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </ControlButton>
            <ControlButton danger onClick={() => setIsRecording(false)}>
              <X size={24} />
            </ControlButton>
          </ControlsBar>

          {!isRecording && (
            <FeedbackSection>
              <FeedbackTitle>模拟反馈</FeedbackTitle>
              <FeedbackCard>
                <CardBody>
                  <FeedbackItem>
                    <FeedbackIcon>
                      <CheckCircle size={20} color={theme.colors.success[600]} />
                    </FeedbackIcon>
                    <FeedbackContent>
                      <FeedbackLabel>表达清晰</FeedbackLabel>
                      <FeedbackText>你的回答逻辑清晰，表达流畅</FeedbackText>
                    </FeedbackContent>
                  </FeedbackItem>
                  <FeedbackItem>
                    <FeedbackIcon>
                      <CheckCircle size={20} color={theme.colors.success[600]} />
                    </FeedbackIcon>
                    <FeedbackContent>
                      <FeedbackLabel>眼神交流</FeedbackLabel>
                      <FeedbackText>保持良好的眼神接触，显得自信</FeedbackText>
                    </FeedbackContent>
                  </FeedbackItem>
                  <FeedbackItem>
                    <FeedbackIcon>
                      <CheckCircle size={20} color={theme.colors.success[600]} />
                    </FeedbackIcon>
                    <FeedbackContent>
                      <FeedbackLabel>肢体语言</FeedbackLabel>
                      <FeedbackText>姿态自然，手势恰当</FeedbackText>
                    </FeedbackContent>
                  </FeedbackItem>
                </CardBody>
              </FeedbackCard>
            </FeedbackSection>
          )}
        </ModalContent>
      </SimulationModal>
    </SimulationContainer>
  );
};