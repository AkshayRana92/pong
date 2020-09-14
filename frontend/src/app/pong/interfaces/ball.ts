import {Circle} from './circle';

export interface Ball {
  circle: Circle,
  speed: number,
  velocityX: number,
  velocityY: number
}

export interface BallPositions {
  ballTop: number,
  ballBottom: number,
  ballLeft: number,
  ballRight: number
}
