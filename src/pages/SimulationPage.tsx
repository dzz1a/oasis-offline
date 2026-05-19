import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import styled, {
  keyframes,
} from 'styled-components';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;

  dx: number;
  dy: number;
}

const GAME_DURATION = 30;

const floatBg = keyframes`
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }

  100% {
    transform: translateY(0px);
  }
`;

const Container = styled.div`
  position: relative;

  width: 100%;
  height: 100vh;

  overflow: hidden;

  background:
    radial-gradient(
      circle at top left,
      rgba(255,255,255,0.35),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(147,197,253,0.25),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #dbeafe 0%,
      #c4b5fd 45%,
      #fbcfe8 100%
    );

  display: flex;
  align-items: center;
  justify-content: center;
`;

const FloatingGlow = styled.div`
  position: absolute;

  width: 600px;
  height: 600px;

  border-radius: 50%;

  background: rgba(255,255,255,0.08);

  filter: blur(80px);

  animation: ${floatBg} 8s ease-in-out infinite;
`;

const TopTitle = styled.div`
  position: absolute;

  top: 24px;
  left: 50%;

  transform: translateX(-50%);

  z-index: 12;

  padding: 14px 28px;

  border-radius: 999px;

  background: rgba(255,255,255,0.4);

  backdrop-filter: blur(18px);

  color: #5b21b6;

  font-size: 24px;
  font-weight: 800;

  letter-spacing: 2px;

  box-shadow:
    0 10px 30px rgba(0,0,0,0.08);
`;

const UI = styled.div`
  position: absolute;

  top: 24px;
  left: 24px;

  z-index: 10;

  display: flex;
  gap: 18px;
`;

const InfoCard = styled.div`
  padding: 14px 22px;

  border-radius: 22px;

  background: rgba(255,255,255,0.55);

  backdrop-filter: blur(18px);

  color: #4c1d95;

  font-size: 18px;
  font-weight: 800;

  box-shadow:
    0 10px 30px rgba(0,0,0,0.12);
`;

const BubbleStyled = styled.div<{
  x: number;
  y: number;
  size: number;
  color: string;
}>`
  position: absolute;

  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;

  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  border-radius: 50%;

  cursor: pointer;

  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255,255,255,0.95),
      ${({ color }) => color}
    );

  box-shadow:
    inset -8px -12px 18px rgba(255,255,255,0.25),
    inset 10px 12px 20px rgba(255,255,255,0.35),
    0 12px 24px rgba(255,255,255,0.2);

  animation:
    ${floatBg} 3s ease-in-out infinite;

  transition:
    transform 0.15s ease,
    opacity 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }

  &::before {
    content: '';

    position: absolute;

    top: 18%;
    left: 22%;

    width: 20%;
    height: 20%;

    border-radius: 50%;

    background: rgba(255,255,255,0.8);

    filter: blur(2px);
  }
`;

const StartScreen = styled.div`
  z-index: 20;

  text-align: center;

  padding: 48px;

  border-radius: 32px;

  background: rgba(255,255,255,0.18);

  backdrop-filter: blur(20px);

  box-shadow:
    0 20px 60px rgba(0,0,0,0.15);

  color: #4c1d95;
`;

const Title = styled.h1`
  font-size: 4rem;

  margin-bottom: 18px;

  font-weight: 800;
`;

const Desc = styled.p`
  font-size: 1.1rem;

  line-height: 1.8;

  margin-bottom: 32px;

  opacity: 0.92;
`;

const StartButton = styled.button`
  padding: 16px 34px;

  border: none;

  border-radius: 999px;

  background: white;

  color: #7c3aed;

  font-size: 18px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px) scale(1.03);
  }
`;

const EndScreen = styled(StartScreen)``;

const colors = [
  'rgba(147,197,253,0.75)',
  'rgba(196,181,253,0.75)',
  'rgba(251,207,232,0.75)',
  'rgba(165,243,252,0.75)',
  'rgba(253,224,71,0.65)',
];

interface SimulationPageProps {
  onNavigate: (page: string) => void;
}

export const SimulationPage = ({
  onNavigate,
}: SimulationPageProps) => {

  const [bubbles, setBubbles] =
    useState<Bubble[]>([]);

  const [score, setScore] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(GAME_DURATION);

  const [gameStarted, setGameStarted] =
    useState(false);

  const [gameOver, setGameOver] =
    useState(false);

  const idRef = useRef(0);

  useEffect(() => {

    if (!gameStarted || gameOver) {
      return;
    }

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          clearInterval(timer);

          setGameOver(true);

          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(timer);

  }, [gameStarted, gameOver]);

  useEffect(() => {

    if (!gameStarted || gameOver) {
      return;
    }

    const interval = setInterval(() => {

      createBubble();

    }, 350);

    return () => clearInterval(interval);

  }, [gameStarted, gameOver]);

  useEffect(() => {

    if (!gameStarted || gameOver) {
      return;
    }

    const moveInterval = setInterval(() => {

      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            x: bubble.x + bubble.dx,
            y: bubble.y + bubble.dy,
          }))
          .filter(
            (bubble) =>
              bubble.x > -150 &&
              bubble.x <
                window.innerWidth + 150 &&
              bubble.y > -150 &&
              bubble.y <
                window.innerHeight + 150
          )
      );

    }, 16);

    return () =>
      clearInterval(moveInterval);

  }, [gameStarted, gameOver]);

  const createBubble = () => {

    const size =
      Math.random() * 70 + 40;

    const side =
      Math.floor(Math.random() * 4);

    let x = 0;
    let y = 0;

    let dx = 0;
    let dy = 0;

    const speed =
      Math.random() * 1.5 + 0.8;

    if (side === 0) {

      x = -size;

      y =
        Math.random() *
        window.innerHeight;

      dx = speed;

      dy =
        (Math.random() - 0.5) * 1.2;

    } else if (side === 1) {

      x = window.innerWidth + size;

      y =
        Math.random() *
        window.innerHeight;

      dx = -speed;

      dy =
        (Math.random() - 0.5) * 1.2;

    } else if (side === 2) {

      x =
        Math.random() *
        window.innerWidth;

      y = -size;

      dx =
        (Math.random() - 0.5) * 1.2;

      dy = speed;

    } else {

      x =
        Math.random() *
        window.innerWidth;

      y =
        window.innerHeight + size;

      dx =
        (Math.random() - 0.5) * 1.2;

      dy = -speed;
    }

    const bubble: Bubble = {
      id: idRef.current++,
      x,
      y,
      size,
      color:
        colors[
          Math.floor(
            Math.random() *
            colors.length
          )
        ],
      dx,
      dy,
    };

    setBubbles((prev) => [
      ...prev,
      bubble,
    ]);
  };

  const popBubble = (id: number) => {

    const target =
      bubbles.find(
        (bubble) => bubble.id === id
      );

    if (!target) {
      return;
    }

    const gained =
      Math.floor(target.size / 10);

    setScore((prev) => prev + gained);

    setBubbles((prev) =>
      prev.filter(
        (bubble) => bubble.id !== id
      )
    );
  };

  const startGame = () => {

    setScore(0);

    setTimeLeft(GAME_DURATION);

    setBubbles([]);

    setGameOver(false);

    setGameStarted(true);
  };

  return (

    <Container>

      <FloatingGlow />

      <TopTitle>
        解压小游戏
      </TopTitle>

      {gameStarted && !gameOver && (

        <UI>

          <InfoCard>
            分数：{score}
          </InfoCard>

          <InfoCard>
            剩余时间：{timeLeft}s
          </InfoCard>

        </UI>
      )}

      {!gameStarted && (

        <StartScreen>

          <Title>
            泡泡疗愈
          </Title>

          <Desc>
            点击飘来的泡泡获得分数。<br />
            放空一下自己吧。
          </Desc>

          <StartButton
            onClick={startGame}
          >
            开始游戏
          </StartButton>

        </StartScreen>
      )}

      {gameOver && (

        <EndScreen>

          <Title>
            游戏结束
          </Title>

          <Desc>
            你获得了 <b>{score}</b> 分
          </Desc>

          <StartButton
            onClick={startGame}
          >
            再玩一次
          </StartButton>

        </EndScreen>
      )}

      {gameStarted &&
        !gameOver &&
        bubbles.map((bubble) => (

          <BubbleStyled
            key={bubble.id}
            x={bubble.x}
            y={bubble.y}
            size={bubble.size}
            color={bubble.color}
            onClick={() =>
              popBubble(bubble.id)
            }
          />

        ))}

    </Container>
  );
};
