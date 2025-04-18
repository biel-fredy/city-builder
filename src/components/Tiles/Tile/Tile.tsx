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

export default function Tile({ x, y, tileWidth, tileHeight, fill = "green", isSelected = false, onClick, onHover }: TileProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Line
      x={x}
      y={y}
      points={[
        0, tileHeight / 2,
        tileWidth / 2, 0,
        tileWidth, tileHeight / 2,
        tileWidth / 2, tileHeight,
      ]}
      closed
      stroke="black"
      fill={isHovered ? "#66FF66" : isSelected ? "#00FF00" : fill}
      strokeWidth={1}
      onClick={onClick}
      onMouseEnter={(e) => {
        setIsHovered(true);
        onHover?.();
      }}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
}
