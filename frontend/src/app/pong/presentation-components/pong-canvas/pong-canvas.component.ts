import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {drawCircle, drawRect} from '../../utils/canvas.utils';
import {PongService} from '../../services/pong.service';
import {Player} from '../../interfaces/player';
import {
  didBallHitBottomPlayer,
  didBallHitLeftPlayer,
  didBallHitRightPlayer,
  didBallHitTopPlayer,
  getBall,
  getBottomPlayer,
  getLeftPlayer,
  getRightPlayer,
  getTopPlayer
} from '../../utils/pong.utils';
import {Ball} from '../../interfaces/ball';
import {Position} from '../../interfaces/position';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-pong-canvas',
  templateUrl: './pong-canvas.component.html',
  styleUrls: ['./pong-canvas.component.scss']
})
export class PongCanvasComponent implements OnInit {

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
  }
  ball: Ball;
  fps = 20;
  offset = 5;

  constructor(private service: PongService) { }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.createCanvasBase();
    this.createPlayers();
    this.createBall();
    this.playGame();

    fromEvent(this.canvas.nativeElement, 'mousemove').subscribe(event => {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      this.players.leftPlayer.rectangle.y = event['clientY'] - rect.top - 50;
      this.players.rightPlayer.rectangle.y = event['clientY'] - rect.top - 50;
      this.players.bottomPlayer.rectangle.x = event['clientX'] - rect.left - 50;
      this.players.topPlayer.rectangle.x = event['clientX'] - rect.left - 50;
    })
  }

  createCanvasBase() {
    drawRect(this.context, {x: 0, y:0, height:600, width: 600, color:'black'});
  }

  createPlayers() {
    this.players = {
      leftPlayer: getLeftPlayer(this.canvasHeight),
      rightPlayer: getRightPlayer(this.canvasWidth, this.canvasHeight),
      bottomPlayer: getBottomPlayer(this.canvasWidth, this.canvasHeight),
      topPlayer: getTopPlayer(this.canvasWidth)
    }
  }

  createBall() {
    this.ball = getBall(this.canvasWidth, this.canvasHeight);
  }

  render() {
    this.createCanvasBase()
    drawRect(this.context, this.players.leftPlayer.rectangle);
    drawRect(this.context, this.players.rightPlayer.rectangle);
    drawRect(this.context, this.players.bottomPlayer.rectangle);
    drawRect(this.context, this.players.topPlayer.rectangle);
    drawCircle(this.context, this.ball.circle)
  }

  playGame() {
    setInterval(() => {
      this.game()
    }, 1000/ this.fps)
  }

  game() {
    this.update();
    this.render();
  }


  update() {
    this.updateScore();
    this.moveBall()
    this.inverseBallVelocityOnHit()
    this.handleBallBouncing()
  }

  updateScore() {
    if (this.ball.circle.x - this.ball.circle.radius < 0 ){
      this.players.leftPlayer.score++;
      this.resetBall(Position.LEFT);
    } else if( this.ball.circle.x + this.ball.circle.radius > this.canvasWidth){
      this.players.rightPlayer.score++;
      this.resetBall(Position.RIGHT);
    } else if(this.ball.circle.y - this.ball.circle.radius < 0 ){
      this.players.bottomPlayer.score++;
      this.resetBall(Position.BOTTOM);
    } else if( this.ball.circle.y + this.ball.circle.radius > this.canvasHeight){
      this.players.topPlayer.score++;
      this.resetBall(Position.TOP);
    }
  }

  moveBall() {
    this.ball.circle.x += this.ball.velocityX;
    this.ball.circle.y += this.ball.velocityY;
  }

  inverseBallVelocityOnHit() {
    // When ball collides top or bottom
    if( this.ball.circle.y + this.ball.circle.radius > this.canvasHeight || this.ball.circle.y - this.ball.circle.radius < 0) {
      this.ball.velocityY = -this.ball.velocityY;
    }
    // When ball collides left ot right
    if( this.ball.circle.x + this.ball.circle.radius > this.canvasWidth || this.ball.circle.x - this.ball.circle.radius < 0) {
      this.ball.velocityX = -this.ball.velocityX;
    }
  }

  handleBallBouncing() {
    if (didBallHitLeftPlayer(this.ball, this.players.leftPlayer, this.offset) || didBallHitRightPlayer(this.ball, this.players.rightPlayer, this.offset)) {
      const player = (this.ball.circle.x + this.ball.circle.radius < this.canvasWidth/2) ? this.players.leftPlayer : this.players.rightPlayer;
      const collidePoint = (this.ball.circle.y - (player.rectangle.y + player.rectangle.height/2));
      const normalizedCollidePoint = collidePoint / (player.rectangle.height/2);
      const angle = (Math.PI / 4) * normalizedCollidePoint;
      let direction = player.position === Position.LEFT ? 1 : -1;
      this.ball.velocityX = direction * this.ball.speed * Math.cos(angle);
      this.ball.velocityY = this.ball.speed * Math.sin(angle);
      this.ball.speed = this.ball.speed + 1;
    }

    if (didBallHitTopPlayer(this.ball, this.players.topPlayer, this.offset) || didBallHitBottomPlayer(this.ball, this.players.bottomPlayer, this.offset)) {
      const player = (this.ball.circle.y + this.ball.circle.radius < this.canvasHeight/2) ? this.players.topPlayer : this.players.bottomPlayer;
      const collidePoint = (this.ball.circle.x - (player.rectangle.x + player.rectangle.width/2));
      const normalizedCollidePoint = collidePoint / (player.rectangle.width/2);
      const angle = (Math.PI / 4) * normalizedCollidePoint;
      let direction = player.position === Position.TOP ? 1 : -1;
      this.ball.velocityX = this.ball.speed * Math.sin(angle);
      this.ball.velocityY = direction * this.ball.speed * Math.cos(angle);
      this.ball.speed = this.ball.speed + 1;
    }
  }

  resetBall(position: Position) {
     this.ball.circle.x = this.canvasWidth / 2;
     this.ball.circle.y = this.canvasHeight / 2;
     this.ball.speed = 5;
     if(position === Position.LEFT || position === Position.RIGHT) {
       this.ball.velocityX = -this.ball.velocityX;
     }else if(position === Position.TOP || position === Position.BOTTOM) {
       this.ball.velocityY = -this.ball.velocityY;
     }

  }

}
