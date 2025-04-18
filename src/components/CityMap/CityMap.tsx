import { useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useSelection } from "@/hooks/useSelection";
import Tile from "../Tiles/Tile/Tile";
import { KonvaEventObject } from "konva/lib/Node";

const tilesX = 25;
const tilesY = 25;
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

  const stageWidth = 2400;
  const stageHeight = 1200;
  const initialStageX = (2400 - stageWidth) / 2;
  const initialStageY = (1200 - stageHeight) / 2;

  const [stagePosition, setStagePosition] = useState({
    x: (window.innerWidth - stageWidth) / 2,
    y: (window.innerHeight - stageHeight) / 2,
  });

  useEffect(() => {
    function handleResize() {
      setStagePosition({
        x: (window.innerWidth - stageWidth) / 2,
        y: (window.innerHeight - stageHeight) / 2,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  function handleWheel(e: KonvaEventObject<WheelEvent>) {
    if (!e.evt.ctrlKey) return;
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
    <div className="w-full h-full bg-gray-900 flex items-center justify-center overflow-x-auto overflow-y-auto">
      <Stage
        width={stageWidth}
        height={stageHeight}
        x={initialStageX}
        y={initialStageY}
        onMouseDown={(e) => {
          const stage = e.target.getStage();
          if (!stage) return;

          if (e.evt.button === 1) {
            stage.draggable(true);
            stage.startDrag();
          } else {
            stage.draggable(false);
          }
          handleMouseDown(e);
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={(e) => {
          e.target.draggable(false);
          handleMouseUp();
        }}
        onWheel={handleWheel}
        style={{ backgroundColor: "#1f2937" }}
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
    </div>
  );
}
