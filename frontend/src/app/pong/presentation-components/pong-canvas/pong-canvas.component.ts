import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { drawCircle, drawRect } from '../../utils/canvas.utils';
import { Player } from '../../interfaces/player';
import {
  didBallHitBottomPlayer,
  didBallHitLeftPlayer,
  didBallHitRightPlayer,
  didBallHitTopPlayer,
  getBall,
  getBottomPlayer, getBottomWall,
  getLeftPlayer,
  getRightPlayer,
  getTopPlayer, getTopWall
} from '../../utils/pong.utils';
import { Ball } from '../../interfaces/ball';
import { Position } from '../../interfaces/position';
import { fromEvent } from 'rxjs';
import { PlayerMovement } from '../../interfaces/player-movement';
import { BallMovement } from '../../interfaces/ball-movement';

@Component({
  selector: 'app-pong-canvas',
  templateUrl: './pong-canvas.component.html',
  styleUrls: ['./pong-canvas.component.scss']
})
export class PongCanvasComponent implements OnInit, OnChanges {

  @Input() playerNumber: number;
  @Input() totalPlayers: number;
  @Input() moveOpponents: PlayerMovement;
  @Input() ballMovement: BallMovement;
  @Input() isHost: boolean;

  @Output() playerMove = new EventEmitter<PlayerMovement>();
  @Output() ballMove = new EventEmitter<BallMovement>();
  @Output() scores = new EventEmitter<number[]>();

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  canvasHeight = 600;
  canvasWidth = 600;
  context: CanvasRenderingContext2D;
  players: {
    leftPlayer: Player,
    rightPlayer: Player,
    bottomPlayer: Player,
    topPlayer: Player
  };
  ball: Ball;
  fps = 45;
  offset = 5;
  activePlayer: Position;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['playerNumber']) {
      this.activePlayer = changes['playerNumber'].currentValue;
      this.context = this.canvas.nativeElement.getContext('2d');
      this.createCanvasBase();
      this.createPlayers();
      this.createBall();
    }

    if (changes && changes['ballMovement']) {
      if (changes['ballMovement'].currentValue) {
        if (!this.isHost) {
          this.ball.circle.x = changes['ballMovement'].currentValue.x;
          this.ball.circle.y = changes['ballMovement'].currentValue.y;
          this.ball.velocityX = changes['ballMovement'].currentValue.velocityX;
          this.ball.velocityY = changes['ballMovement'].currentValue.velocityY;
          this.ball.speed = changes['ballMovement'].currentValue.speed;
        }
      }
    }

    if (changes && changes['moveOpponents']) {
      if (changes['moveOpponents'].currentValue) {
        switch (changes['moveOpponents'].currentValue.position) {
          case Position.LEFT:
            this.players.leftPlayer.rectangle.y = changes['moveOpponents'].currentValue.clientY;
            this.players.leftPlayer.rectangle.y = changes['moveOpponents'].currentValue.clientY;
            break;
          case Position.RIGHT:
            this.players.rightPlayer.rectangle.y = changes['moveOpponents'].currentValue.clientY;
            break;
          case Position.TOP:
            this.players.topPlayer.rectangle.x = changes['moveOpponents'].currentValue.clientX;
            break;
          case Position.BOTTOM:
            this.players.bottomPlayer.rectangle.x = changes['moveOpponents'].currentValue.clientX;
            break;
        }
      }
    }

  }

  ngOnInit(): void {
    this.playGame();
    fromEvent(this.canvas.nativeElement, 'mousemove').subscribe((event: MouseEvent) => {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      switch (this.activePlayer) {
        case Position.LEFT:
          this.players.leftPlayer.rectangle.y = event.clientY - rect.top - 50;
          this.playerMove.emit({ clientY: this.players.leftPlayer.rectangle.y, position: Position.LEFT });
          break;
        case Position.RIGHT:
          this.players.rightPlayer.rectangle.y = event.clientY - rect.top - 50;
          this.playerMove.emit({ clientY: this.players.rightPlayer.rectangle.y, position: Position.RIGHT });
          break;
        case Position.TOP:
          this.players.topPlayer.rectangle.x = event.clientX - rect.left - 50;
          this.playerMove.emit({ clientX: this.players.topPlayer.rectangle.x, position: Position.TOP });
          break;
        case Position.BOTTOM:
          this.players.bottomPlayer.rectangle.x = event.clientX - rect.left - 50;
          this.playerMove.emit({ clientX: this.players.bottomPlayer.rectangle.x, position: Position.BOTTOM });
          break;
      }
    });
  }

  createCanvasBase(): void {
    drawRect(this.context, { x: 0, y: 0, height: 600, width: 600, color: 'black' });
  }

  createPlayers(): void {
    this.players = {
      leftPlayer: getLeftPlayer(Position.LEFT === this.activePlayer, this.canvasHeight),
      rightPlayer: getRightPlayer(Position.RIGHT === this.activePlayer, this.canvasWidth, this.canvasHeight),
      bottomPlayer: this.totalPlayers > 2 ?
        getBottomPlayer(Position.BOTTOM === this.activePlayer, this.canvasWidth, this.canvasHeight) :
        getBottomWall(this.canvasWidth),
      topPlayer: this.totalPlayers > 3 ? getTopPlayer(Position.TOP === this.activePlayer, this.canvasWidth) :
        getTopWall(this.canvasWidth, this.canvasHeight)
    };
  }

  createBall(): void {
    this.ball = getBall(this.canvasWidth, this.canvasHeight);
  }

  render(): void {
    this.createCanvasBase();
    drawRect(this.context, this.players.leftPlayer.rectangle);
    drawRect(this.context, this.players.rightPlayer.rectangle);
    drawRect(this.context, this.players.bottomPlayer.rectangle);
    drawRect(this.context, this.players.topPlayer.rectangle);
    drawCircle(this.context, this.ball.circle);
  }

  playGame(): void {
    setInterval(() => {
      this.game();
    }, 1000 / this.fps);
  }

  game(): void {
    this.update();
    this.render();
  }


  update(): void {
    this.updateScore();
    this.moveBall();
    if (this.isHost) {
      this.inverseBallVelocityOnHit();
      this.handleBallBouncing();
    }
  }

  updateScore(): void {
    if (this.isHost) {
      if (this.ball.circle.x - this.ball.circle.radius < 0) {
        this.players.leftPlayer.score++;
        this.resetBall(Position.LEFT);
      } else if (this.ball.circle.x + this.ball.circle.radius > this.canvasWidth) {
        this.players.rightPlayer.score++;
        this.resetBall(Position.RIGHT);
      } else if (this.ball.circle.y - this.ball.circle.radius < 0) {
        if (!this.players.bottomPlayer.isWall) {
          this.players.bottomPlayer.score++;
          this.resetBall(Position.BOTTOM);
        }
      } else if (this.ball.circle.y + this.ball.circle.radius > this.canvasHeight) {
        if (!this.players.topPlayer.isWall) {
          this.players.topPlayer.score++;
          this.resetBall(Position.TOP);
        }
      }
      this.scores.emit([
        this.players.leftPlayer.score,
        this.players.rightPlayer.score,
        this.players.bottomPlayer.score,
        this.players.topPlayer.score
      ]);
    }
  }

  moveBall(): void {
    this.ball.circle.x += this.ball.velocityX;
    this.ball.circle.y += this.ball.velocityY;
  }

  inverseBallVelocityOnHit(): void {
    // When ball collides top or bottom
    if (this.ball.circle.y + this.ball.circle.radius > this.canvasHeight || this.ball.circle.y - this.ball.circle.radius < 0) {
      this.ball.velocityY = -this.ball.velocityY;
      this.ballMove.emit({
        speed: this.ball.speed,
        velocityX: this.ball.velocityX,
        velocityY: this.ball.velocityY,
        x: this.ball.circle.x,
        y: this.ball.circle.y
      });
    }
  }

  handleBallBouncing(): void {
    if (didBallHitLeftPlayer(this.ball, this.players.leftPlayer, this.offset) ||
      didBallHitRightPlayer(this.ball, this.players.rightPlayer, this.offset)) {
      this.setBallVelocityWhenBallHitsPaddleLeftOrRight();
      this.ball.speed = this.ball.speed + 1;
      this.ballMove.emit({
        speed: this.ball.speed,
        velocityX: this.ball.velocityX,
        velocityY: this.ball.velocityY,
        x: this.ball.circle.x,
        y: this.ball.circle.y
      });
    }

    if (didBallHitTopPlayer(this.ball, this.players.topPlayer, this.offset) && !this.players.topPlayer.isWall) {
      this.setBallVelocityWhenBallHitsPaddleTopOrBottom();
      this.ball.speed = this.ball.speed + 1;
      this.ballMove.emit({
        speed: this.ball.speed,
        velocityX: this.ball.velocityX,
        velocityY: this.ball.velocityY,
        x: this.ball.circle.x,
        y: this.ball.circle.y
      });
    }

    if (didBallHitBottomPlayer(this.ball, this.players.bottomPlayer, this.offset) && !this.players.bottomPlayer.isWall) {
      this.setBallVelocityWhenBallHitsPaddleTopOrBottom();
      this.ball.speed = this.ball.speed + 1;
      this.ballMove.emit({
        speed: this.ball.speed,
        velocityX: this.ball.velocityX,
        velocityY: this.ball.velocityY,
        x: this.ball.circle.x,
        y: this.ball.circle.y
      });
    }
  }

  resetBall(position: Position): void {
    if (this.isHost) {
      this.ball.circle.x = this.canvasWidth / 2;
      this.ball.circle.y = this.canvasHeight / 2;
      this.ball.speed = 5;
      if (position === Position.LEFT || position === Position.RIGHT) {
        this.ball.velocityX = this.ball.velocityX > 0 ? -5 : 5;
      } else if (position === Position.TOP || position === Position.BOTTOM) {
        this.ball.velocityY = this.ball.velocityY > 0 ? -5 : 5;
      }
      this.ballMove.emit({
        speed: this.ball.speed,
        velocityX: this.ball.velocityX,
        velocityY: this.ball.velocityY,
        x: this.ball.circle.x,
        y: this.ball.circle.y
      });
    }
  }

  setBallVelocityWhenBallHitsPaddleLeftOrRight(): void {
    const player = (this.ball.circle.x + this.ball.circle.radius < this.canvasWidth / 2) ?
      this.players.leftPlayer : this.players.rightPlayer;
    const collidePoint = (this.ball.circle.y - (player.rectangle.y + player.rectangle.height / 2));
    const normalizedCollidePoint = collidePoint / (player.rectangle.height / 2);
    const angle = (Math.PI / 4) * normalizedCollidePoint;
    const direction = player.position === Position.LEFT ? 1 : -1;
    this.ball.velocityX = direction * this.ball.speed * Math.cos(angle);
    this.ball.velocityY = this.ball.speed * Math.sin(angle);
  }

  setBallVelocityWhenBallHitsPaddleTopOrBottom(): void {
    const player = (this.ball.circle.y + this.ball.circle.radius < this.canvasHeight / 2) ?
      this.players.topPlayer : this.players.bottomPlayer;
    const collidePoint = (this.ball.circle.x - (player.rectangle.x + player.rectangle.width / 2));
    const normalizedCollidePoint = collidePoint / (player.rectangle.width / 2);
    const angle = (Math.PI / 4) * normalizedCollidePoint;
    const direction = player.position === Position.TOP ? 1 : -1;
    this.ball.velocityX = this.ball.speed * Math.sin(angle);
    this.ball.velocityY = direction * this.ball.speed * Math.cos(angle);
    this.ball.speed = this.ball.speed + 1;
  }

}
