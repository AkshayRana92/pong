import { Position } from './position';

export interface PlayerMovement {
  clientX?: number;
  clientY?: number;
  position: Position;
}
