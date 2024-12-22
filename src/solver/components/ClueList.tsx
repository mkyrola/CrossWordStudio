import React from 'react';
import { PuzzleWord } from '../../common/types/puzzle';

interface ClueListProps {
  words: PuzzleWord[];
  onClueSelect: (wordNumber: number, direction: 'across' | 'down') => void;
  currentWord?: { number: number; direction: 'across' | 'down' };
}

export const ClueList: React.FC<ClueListProps> = ({
  words,
  onClueSelect,
  currentWord
}) => {
  const acrossWords = words.filter(word => word.direction === 'across');
  const downWords = words.filter(word => word.direction === 'down');

  const renderClue = (word: PuzzleWord) => {
    const isSelected = currentWord?.number === word.number && 
                      currentWord?.direction === word.direction;

    return (
      <div
        key={`${word.direction}-${word.number}`}
        onClick={() => onClueSelect(word.number, word.direction)}
        style={{
          padding: '8px',
          cursor: 'pointer',
          backgroundColor: isSelected ? '#e6f3ff' : 'transparent',
          borderRadius: '4px',
          marginBottom: '4px',
          transition: 'background-color 0.2s'
        }}
      >
        <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
          {word.number}.
        </span>
        {word.answer}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '12px' }}>Across</h3>
        {acrossWords.map(renderClue)}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '12px' }}>Down</h3>
        {downWords.map(renderClue)}
      </div>
    </div>
  );
};
