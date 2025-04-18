import { Line } from "react-konva";
import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";

interface TileProps {
  x: number;
  y: number;
  tileWidth: number;
  tileHeight: number;
  fill?: string;
  isSelected?: boolean;
  onClick?: (e: KonvaEventObject<MouseEvent>) => void;
  onHover?: () => void;
}

export default function Tile({
  x,
  y,
  tileWidth,
  tileHeight,
  fill = "green",
  isSelected = false,
  onClick,
  onHover,
}: TileProps) {
  const [localHovered, setLocalHovered] = useState(false);

  function handleMouseEnter() {
    setLocalHovered(true);
    onHover?.();
  }

  function handleMouseLeave() {
    setLocalHovered(false);
  }

  const computedFill = isSelected ? "#00FF00" : localHovered ? "#66FF66" : fill;

  return (
    <Line
      draggable={false}
      listening={true}
      onDragStart={(e) => (e.cancelBubble = true)}
      x={x}
      y={y}
      points={[
        0,
        tileHeight / 2,
        tileWidth / 2,
        0,
        tileWidth,
        tileHeight / 2,
        tileWidth / 2,
        tileHeight,
      ]}
      closed
      stroke="black"
      fill={computedFill}
      strokeWidth={1}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}
