import {Player} from '../interfaces/player';
import {Position} from '../interfaces/position';
import {Circle} from '../interfaces/circle';
import {Ball, BallPositions} from '../interfaces/ball';

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
    position: Position.TOP
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
  radius: number = 10): Ball {
  return {
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    circle : {
      x: canvasWidth/2,
      y: canvasHeight/2,
      color: 'white',
      radius
    }
  };
}

export function getBallPositions(ball: Ball): BallPositions {
  const ballTop = ball.circle.y - ball.circle.radius;
  const ballBottom = ball.circle.y + ball.circle.radius;
  const ballLeft = ball.circle.x - ball.circle.radius;
  const ballRight = ball.circle.x + ball.circle.radius;

  return { ballTop, ballBottom,ballLeft, ballRight};
}

export function didBallHitLeftPlayer(ball: Ball, player: Player, offset): boolean {
  const playerTop = player.rectangle.y;
  const playerBottom = player.rectangle.y + player.rectangle.height;
  const playerLeft = player.rectangle.x + offset;
  const playerRight = player.rectangle.x + player.rectangle.width + offset;

  const { ballTop, ballBottom,ballLeft, ballRight} = getBallPositions(ball);
  return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
}

export function didBallHitRightPlayer(ball: Ball, player: Player, offset: number): boolean {
  const playerTop = player.rectangle.y;
  const playerBottom = player.rectangle.y + player.rectangle.height;
  const playerLeft = player.rectangle.x - offset;
  const playerRight = player.rectangle.x + player.rectangle.width - offset;

  const { ballTop, ballBottom,ballLeft, ballRight} = getBallPositions(ball);
  return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
}

export function didBallHitTopPlayer(ball: Ball, player: Player, offset: number): boolean {
  const playerTop = player.rectangle.y + offset;
  const playerBottom = player.rectangle.y + player.rectangle.height + offset;
  const playerLeft = player.rectangle.x;
  const playerRight = player.rectangle.x + player.rectangle.width;

  const { ballTop, ballBottom,ballLeft, ballRight} = getBallPositions(ball);
  return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
}

export function didBallHitBottomPlayer(ball: Ball, player: Player, offset: number): boolean {
  const playerTop = player.rectangle.y - offset;
  const playerBottom = player.rectangle.y + player.rectangle.height - offset;
  const playerLeft = player.rectangle.x;
  const playerRight = player.rectangle.x + player.rectangle.width;

  const { ballTop, ballBottom,ballLeft, ballRight} = getBallPositions(ball);
  return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
}
