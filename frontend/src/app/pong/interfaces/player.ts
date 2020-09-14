import {Rectangle} from './rectangle';
import {Position} from './position';

export interface Player {
  isWall: boolean;
  score: number;
  rectangle: Rectangle
  position: Position;
}
