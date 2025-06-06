import React, { useState, useEffect } from 'react';
import Cell from './Cell';

type CellType = {
  type: 'empty' | 'generator' | 'draggable';
  value?: number;
  isNew?: boolean;
  justCombined?: boolean;
};

const GameBoard: React.FC = () => {
  const initializeBoard = (): CellType[][] => {
    // Crear una matriz 6x6 usando bucles para asegurar 36 celdas independientes
    const newBoard: CellType[][] = [];
    for (let i = 0; i < 6; i++) {
      const row: CellType[] = [];
      for (let j = 0; j < 6; j++) {
        row.push({ type: 'empty' });
      }
      newBoard.push(row);
    }
    
    // Colocar generadores en las esquinas
    newBoard[0][0] = { type: 'generator', value: 1 };
    newBoard[0][5] = { type: 'generator', value: 2 };
    newBoard[5][0] = { type: 'generator', value: 3 };
    newBoard[5][5] = { type: 'generator', value: 4 };
    
    return newBoard;
  };

  const [board, setBoard] = useState<CellType[][]>(initializeBoard());
  const [draggingItem, setDraggingItem] = useState<{row: number, col: number} | null>(null);

  // Limpiar los estados de animación
  useEffect(() => {
    const timer = setTimeout(() => {
      const newBoard = board.map(row =>
        row.map(cell => ({
          ...cell,
          isNew: false,
          justCombined: false
        }))
      );
      setBoard(newBoard);
    }, 300);

    return () => clearTimeout(timer);
  }, [board]);

  const findEmptyCell = (): [number, number] | null => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col].type === 'empty') {
          return [row, col];
        }
      }
    }
    return null;
  };

  const handleGeneratorClick = (row: number, col: number) => {
    if (board[row][col].type !== 'generator') return;

    const emptyCell = findEmptyCell();
    if (!emptyCell) return;

    const [emptyRow, emptyCol] = emptyCell;
    const newBoard = [...board];
    newBoard[emptyRow][emptyCol] = {
      type: 'draggable',
      value: board[row][col].value,
      isNew: true
    };
    setBoard(newBoard);
  };

  const handleDragStart = (row: number, col: number) => {
    if (board[row][col].type === 'draggable') {
      setDraggingItem({ row, col });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetRow: number, targetCol: number) => {
    if (!draggingItem) return;
    
    // Si soltamos en la misma casilla, no hacemos nada
    if (targetRow === draggingItem.row && targetCol === draggingItem.col) {
      setDraggingItem(null);
      return;
    }
    
    const targetCell = board[targetRow][targetCol];
    const sourceCell = board[draggingItem.row][draggingItem.col];
    
    if (targetCell.type === 'empty') {
      const newBoard = [...board];
      newBoard[targetRow][targetCol] = sourceCell;
      newBoard[draggingItem.row][draggingItem.col] = { type: 'empty' };
      setBoard(newBoard);
    } 
    else if (
      targetCell.type === 'draggable' && 
      sourceCell.type === 'draggable' &&
      targetCell.value === sourceCell.value
    ) {
      const newValue = (targetCell.value || 1) + 1;
      const newBoard = [...board];
      newBoard[targetRow][targetCol] = {
        type: 'draggable',
        value: newValue,
        justCombined: true
      };
      newBoard[draggingItem.row][draggingItem.col] = { type: 'empty' };
      setBoard(newBoard);
    }

    setDraggingItem(null);
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            type={cell.type}
            value={cell.value}
            isNew={cell.isNew}
            justCombined={cell.justCombined}
            isDragging={draggingItem?.row === rowIndex && draggingItem?.col === colIndex}
            onDragStart={() => handleDragStart(rowIndex, colIndex)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(rowIndex, colIndex)}
            onClick={() => handleGeneratorClick(rowIndex, colIndex)}
          />
        ))
      ))}
    </div>
  );
};

export default GameBoard; 