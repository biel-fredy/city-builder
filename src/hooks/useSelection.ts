import { useState } from "react";

interface Tile {
  row: number;
  col: number;
}

export function useSelection(tilesX: number, tilesY: number, tileWidth: number, tileHeight: number, offsetX: number = 400) {
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [lastSelectedTile, setLastSelectedTile] = useState<Tile | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseMove = () => {
    // Não faz mais nada aqui
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleTileHover = (row: number, col: number) => {
    if (isMouseDown) {
      setSelectedTiles((prev) => {
        if (prev.some((tile) => tile.row === row && tile.col === col)) {
          return prev;
        }
        return [...prev, { row, col }];
      });
    }
  };

  const handleTileClick = (e: any, row: number, col: number) => {
    const ctrlPressed = e.evt.ctrlKey;
    const shiftPressed = e.evt.shiftKey;

    if (shiftPressed && lastSelectedTile) {
      const tilesInBetween: Tile[] = [];

      const minRow = Math.min(lastSelectedTile.row, row);
      const maxRow = Math.max(lastSelectedTile.row, row);
      const minCol = Math.min(lastSelectedTile.col, col);
      const maxCol = Math.max(lastSelectedTile.col, col);

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          tilesInBetween.push({ row: r, col: c });
        }
      }

      setSelectedTiles(tilesInBetween);
    } else if (ctrlPressed) {
      setSelectedTiles((prev) => {
        const alreadySelected = prev.some((tile) => tile.row === row && tile.col === col);
        if (alreadySelected) {
          return prev.filter((tile) => !(tile.row === row && tile.col === col));
        } else {
          return [...prev, { row, col }];
        }
      });
      setLastSelectedTile({ row, col });
    } else {
      setSelectedTiles([{ row, col }]);
      setLastSelectedTile({ row, col });
    }
  };

  const isTileSelected = (row: number, col: number) => {
    return selectedTiles.some((tile) => tile.row === row && tile.col === col);
  };

  return {
    selectedTiles,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTileClick,
    handleTileHover,
    isTileSelected,
  };
}
