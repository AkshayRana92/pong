import {Player} from '../interfaces/player';
import {Position} from '../interfaces/position';
import {Circle} from '../interfaces/circle';

export function getLeftPlayer(
  canvasHeight: number,
  paddleHeight: number = 100,
  paddleWidth: number = 10,
  offset: number = 5,
  ): Player {
  return {
    rectangle: {
      x: offset,
      y: canvasHeight/2 - paddleHeight/2,
      width: paddleWidth,
      height: paddleHeight,
      color: 'white'
    },
    isWall: false,
    score: 0,
    position: Position.LEFT
  }
}

export function getRightPlayer(
  canvasWidth: number,
  canvasHeight: number,
  paddleHeight: number = 100,
  paddleWidth: number = 10,
  offset: number = 5): Player {
  return {
    rectangle: {
      x: canvasWidth - paddleWidth - offset,
      y: canvasHeight/2 - paddleHeight/2,
      width: paddleWidth,
      height: paddleHeight,
      color: 'white'
    },
    isWall: false,
    score: 0,
    position: Position.RIGHT
  }
}

export function getTopPlayer(
  canvasWidth: number,
  paddleHeight: number = 10,
  paddleWidth: number = 100,
  offset: number = 5): Player {
  return {
    rectangle: {
      x: canvasWidth/2 - paddleWidth/2,
      y: offset,
      width: paddleWidth,
      height: paddleHeight,
      color: 'white'
    },
    isWall: false,
    score: 0,
    position: Position.Top
  }
}

export function getBottomPlayer(
  canvasWidth: number,
  canvasHeight: number,
  paddleHeight: number = 10,
  paddleWidth: number = 100,
  offset: number = 5): Player {
  return {
    rectangle: {
      x: canvasWidth/2 - paddleWidth/2,
      y: canvasHeight - paddleHeight - offset,
      width: paddleWidth,
      height: paddleHeight,
      color: 'white'
    },
    isWall: false,
    score: 0,
    position: Position.BOTTOM
  }
}

export function getBall(
  canvasWidth: number,
  canvasHeight: number,
  radius: number = 10): Circle {
  return {
    x: canvasWidth/2,
    y: canvasHeight/2,
    color: 'white',
    radius
  };
}
