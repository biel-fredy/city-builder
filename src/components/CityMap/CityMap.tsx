import { Stage, Layer, Rect } from "react-konva";
import { useSelection } from "@/hooks/useSelection";
import Tile from "../Tiles/Tile/Tile";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";

const tilesX = 10;
const tilesY = 6;
const tileWidth = 64;
const tileHeight = 32;

export default function CityMap() {
  const {
    isSelecting,
    selectionStart,
    selectionEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTileClick,
    handleTileHover,
    isTileSelected,
  } = useSelection(tilesX, tilesY, tileWidth, tileHeight, 400);

  const stageWidth = 2400; // aumentei bastante
  const stageHeight = 1200; // aumentei bastante

  const tiles = [];
  const [isDragging, setIsDragging] = useState(false);

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

  function handleWheel(e: KonvaEventObject<WheelEvent>) {
    if (!e.evt.ctrlKey) {
      return; // Ignora scroll se não estiver pressionando CTRL
    }
  
    e.evt.preventDefault();
  
    const stage = e.target.getStage();
    if (!stage) return;
  
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();
  
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
  
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
  
    const direction = e.evt.deltaY > 0 ? 1 : -1;
    const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;
  
    stage.scale({ x: newScale, y: newScale });
  
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
  
    stage.position(newPos);
    stage.batchDraw();
  }

  return (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center overflow-auto">
      <Stage
        width={stageWidth}
        height={stageHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        draggable
        style={{ backgroundColor: "#1f2937" }}
      >
        <Layer>
          {/* Só tiles e retângulo de seleção agora */}
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
    </div>
  );
}
