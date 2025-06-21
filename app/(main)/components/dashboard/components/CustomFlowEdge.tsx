import React, { type FC } from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';
import { Icon } from '@phosphor-icons/react';
import { ServerStatus } from '@/app/types';

const CustomFlowEdge: FC<
  EdgeProps<Edge<{ icon?: Icon; label?: ServerStatus }>>
> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const Icon = data?.icon;
  const label = data?.label;
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className={`absolute rounded-full bg-white/40 backdrop-blur`}
        >
          {Icon && (
            <Icon
              size={10}
              className={`${label === 'loading' ? 'animate-spin' : ''}`}
              color={label === 'offline' ? '#FB2C36' : '#222'}
            />
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomFlowEdge;
