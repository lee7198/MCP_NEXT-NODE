import { CustomEdge, CustomNode } from '@/app/types/dashboard';
import {
  DatabaseIcon,
  HardDrivesIcon,
  RobotIcon,
} from '@phosphor-icons/react/dist/ssr';
import { MarkerType, Position } from '@xyflow/react';

export const initialNodes: CustomNode[] = [
  {
    id: 'Web Server',
    position: { x: 250, y: 100 },
    data: {
      title: 'IIS Web Server',
      subtitle: 'this serveer',
      icon: HardDrivesIcon,
      isTargetVisible: true,
      isSourceVisible: true,
      sourcePosition: Position.Top,
    },
    type: 'custom',
    state: 'offline',
  },
  {
    id: 'DB Server',
    position: { x: 0, y: 100 },
    data: {
      title: 'DB Server',
      subtitle: 'ORACLE 19c',
      icon: DatabaseIcon,
      isSourceVisible: true,
    },
    type: 'custom',
    state: 'offline',
  },
  {
    id: 'AI Model',
    position: { x: 0, y: 0 },
    data: {
      title: 'AI Model',
      subtitle: 'QWEN3:8B',
      icon: RobotIcon,
      isSourceVisible: true,
      isTargetVisible: true,
      targetPosition: Position.Right,
    },
    type: 'custom',
    state: 'offline',
  },
  {
    id: 'AI Agent',
    position: { x: 300, y: 0 },
    data: {
      title: 'AI Agent',
      subtitle: 'Servers',
      icon: HardDrivesIcon,
      isTargetVisible: true,
      isSourceVisible: true,
      sourcePosition: Position.Left,
      targetPosition: Position.Bottom,
    },
    type: 'custom',
    state: 'offline',
  },
];
export const initialEdges: CustomEdge[] = [
  {
    id: 'eb-w',
    source: 'DB Server',
    target: 'Web Server',
    animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
    },
    type: 'custom',
  },
  {
    id: 'ea-w',
    source: 'AI Model',
    target: 'Web Server',
    animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
    },
    type: 'custom',
  },
  {
    id: 'ew-c',
    source: 'Web Server',
    target: 'AI Agent',
    animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
    },
    type: 'custom',
  },
  {
    id: 'ec-a',
    source: 'AI Agent',
    target: 'AI Model',
    animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
    },
    type: 'custom',
  },
];
