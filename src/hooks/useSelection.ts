import { useState } from "react";

interface Tile {
  row: number;
  col: number;
}

export function useSelection(tilesX: number, tilesY: number, tileWidth: number, tileHeight: number, offsetX: number = 400) {
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
  const [lastSelectedTile, setLastSelectedTile] = useState<Tile | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);


  const handleMouseDown = (e: any) => {
    setIsMouseDown(true);
    setIsSelecting(true);
    const stage = e.target.getStage();
    const clickedOnEmpty = e.target === stage;
  
    if (!clickedOnEmpty) return;
  
    if (!e.evt.ctrlKey) {
      setSelectedTiles([]);
    }
  
    const { x, y } = stage.getPointerPosition();
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
    setIsSelecting(true);
  };
  

  const handleMouseMove = (e: any) => {
    if (!isSelecting) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    setSelectionEnd({ x, y });
  };

  const handleTileHover = (row: number, col: number) => {
    if (isMouseDown) {
      setSelectedTiles((prev) => {
        const alreadySelected = prev.some((tile) => tile.row === row && tile.col === col);
        if (alreadySelected) return prev;
        return [...prev, { row, col }];
      });
    }
  };  

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    if (!selectionStart || !selectionEnd) return;

    const minX = Math.min(selectionStart.x, selectionEnd.x);
    const maxX = Math.max(selectionStart.x, selectionEnd.x);
    const minY = Math.min(selectionStart.y, selectionEnd.y);
    const maxY = Math.max(selectionStart.y, selectionEnd.y);

    const newlySelected: Tile[] = [];

    for (let row = 0; row < tilesY; row++) {
      for (let col = 0; col < tilesX; col++) {
        const tileX = (col - row) * (tileWidth / 2) + offsetX;
        const tileY = (col + row) * (tileHeight / 2);

        if (tileX >= minX && tileX <= maxX && tileY >= minY && tileY <= maxY) {
          newlySelected.push({ row, col });
        }
      }
    }

    setSelectedTiles(newlySelected);
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
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
    isSelecting,
    selectionStart,
    selectionEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTileClick,
    handleTileHover,
    isTileSelected,
  };
  
}
