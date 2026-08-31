"use client";

import { BaseEdge, getBezierPath, type EdgeProps } from "reactflow";

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, stroke: "var(--color-gold-dim)", strokeWidth: 2 }}
      />
      {label && (
        <text
          x={labelX}
          y={labelY}
          className="text-[10px] fill-muted-foreground"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {label}
        </text>
      )}
    </>
  );
}
