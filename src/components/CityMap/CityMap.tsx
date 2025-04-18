import { Stage, Layer, Rect } from "react-konva";
import { useSelection } from "@/hooks/useSelection";
import Tile from "../Tiles/Tile/Tile";
import { KonvaEventObject } from "konva/lib/Node";

const tilesX = 10;
const tilesY = 6;
const tileWidth = 64;
const tileHeight = 32;

export default function CityMap() {
  const {
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
  }  = useSelection(tilesX, tilesY, tileWidth, tileHeight, 400);

  const tiles = [];

  for (let row = 0; row < tilesY; row++) {
    for (let col = 0; col < tilesX; col++) {
      const x = (col - row) * (tileWidth / 2) + 400;
      const y = (col + row) * (tileHeight / 2);

      tiles.push(
        <Tile
          key={`${row}-${col}`}
          x={x}
          y={y}
          tileWidth={tileWidth}
          tileHeight={tileHeight}
          isSelected={isTileSelected(row, col)}
          onClick={(e: KonvaEventObject<MouseEvent>) =>
            handleTileClick(e, row, col)
          }
          onHover={() => handleTileHover(row, col)}
        />
      );
    }
  }

  return (
    <Stage
      width={1200}
      height={800}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {tiles}
        {isSelecting && selectionStart && selectionEnd && (
          <Rect
            x={Math.min(selectionStart.x, selectionEnd.x)}
            y={Math.min(selectionStart.y, selectionEnd.y)}
            width={Math.abs(selectionEnd.x - selectionStart.x)}
            height={Math.abs(selectionEnd.y - selectionStart.y)}
            fill="rgba(0, 255, 0, 0.2)"
            stroke="green"
            dash={[4, 4]}
          />
        )}
      </Layer>
    </Stage>
  );
}
