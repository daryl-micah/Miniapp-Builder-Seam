import React, { useEffect, useRef, useState } from 'react';
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import { Card, CardContent, CardHeader } from '@mui/material';

export const DinoFeedComponent = ({ model }: FeedComponentProps) => {
  return (
    <div className='flex text-center items-center'>
      <Card variant="elevation" className='w-[600px] h-[350px] flex-row'>
        <CardHeader className='items-center'>
          <h1 className='text-2xl font-bold mb-4 bg-gray-200'>RunNin'ja</h1>
        </CardHeader>
        <CardContent>
          
        </CardContent>
      </Card>
    </div>
  );
};

export const DinoComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const saveScore = (newScore: number) => {
    model.data['highScore'] = newScore.toString();
    done(model);
  };

  const highScore = parseInt(model.data['highScore'] as string, 10) || 0;

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-2xl font-bold mb-4 text-black-300'>RunNin'ja</h2>
      <Game highScore={highScore} saveScore={saveScore} />
    </div>
  );
};

const tailwindStyle = {
  jump: 'animate-[jump_0.3s_linear]',
  block: 'animate-[block_1s_infinite_linear]'
};

function Game({ highScore, saveScore }: { highScore: number, saveScore?: (newScore: number) => void }) {
  const ninjaRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);

  const jump = () => {
    if (ninjaRef.current && !ninjaRef.current.classList.contains(tailwindStyle.jump)) {
      ninjaRef.current.classList.add(tailwindStyle.jump);
      setTimeout(() => {
        ninjaRef.current?.classList.remove(tailwindStyle.jump);
      }, 300);
    }
  };

  useEffect(() => {
    const isAlive = setInterval(() => {
      const dinoTop = parseInt(
        getComputedStyle(ninjaRef.current!).getPropertyValue('top')
      );
      const cactusLeft = parseInt(
        getComputedStyle(flameRef.current!).getPropertyValue('left')
      );

      if (cactusLeft < 40 && cactusLeft > 0 && dinoTop >= 140) {
        alert('Game Over! Your Score: ' + score);
        if (saveScore && score > highScore) {
          saveScore(score);
        }
        setScore(0);
      } else {
        setScore(prevScore => prevScore + 1);
      }
    }, 10);

    return () => clearInterval(isAlive);
  }, [score, highScore, saveScore]);

  useEffect(() => {
    document.addEventListener('keydown', jump);
    return () => document.removeEventListener('keydown', jump);
  }, []);

  return (
    <div className="w-[400px] h-[225px] border border-black mx-auto">
      Score: {score}
      <div
        ref={ninjaRef}
        className="w-[50px] h-[50px] bg-[url('./blockIcons/ninjaIcon.png')] bg-cover relative top-[150px]"
      ></div>
      <div
        ref={flameRef}
        className="w-[20px] h-[40px] relative top-[110px] left-[580px] bg-[url('./blockIcons/flameIcon.png')] bg-cover block"
      ></div>
    </div>
  );
}

export default Game;
