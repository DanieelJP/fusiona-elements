import React from 'react';

type CellProps = {
  type: 'empty' | 'generator' | 'draggable';
  value?: number;
  isNew?: boolean;
  justCombined?: boolean;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
  onClick?: () => void;
};

const getIcon = (value?: number): string => {
  const icons = {
    1: '🐣', // pollito
    2: '🐥', // pollito crecido
    3: '🐤', // pollito de frente
    4: '🐔', // gallina
    5: '🦃', // pavo
    6: '🦅', // águila
    7: '🦉', // búho
    8: '🦚', // pavo real
    9: '🐉', // dragón
  };
  
  return value ? (icons[value as keyof typeof icons] || '🌟') : '';
};

const Cell: React.FC<CellProps> = ({
  type,
  value,
  isNew,
  justCombined,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onClick
}) => {
  const getCellStyle = (value?: number) => {
    if (!value) return {};
    const hue = (value * 30) % 360;
    return {
      backgroundColor: `hsl(${hue}, 70%, 50%)`,
      fontSize: `${Math.min(32 + value * 4, 48)}px` // Aumenté un poco el tamaño para los emojis
    };
  };

  return (
    <div
      className={`cell ${type} ${isDragging ? 'dragging' : ''} 
        ${isNew ? 'new-draggable' : ''} ${justCombined ? 'combined' : ''}`}
      style={type === 'draggable' ? getCellStyle(value) : {}}
      draggable={type === 'draggable'}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      {type === 'generator' ? '⭐' : getIcon(value)}
    </div>
  );
};

export default Cell; 