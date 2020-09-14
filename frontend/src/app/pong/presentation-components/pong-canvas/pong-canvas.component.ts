import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {drawCircle, drawRect} from '../../utils/canvas.utils';
import {PongService} from '../../services/pong.service';
import {Player} from '../../interfaces/player';
import {getBall, getBottomPlayer, getLeftPlayer, getRightPlayer, getTopPlayer} from '../../utils/pong.utils';

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
    user: Player,
    opponent1: Player,
    opponent2: Player,
    opponent3: Player
  }
  ball;

  constructor(private service: PongService) { }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.createCanvasBase();
    this.createPlayers();
    this.createBall();
    this.render();
  }

  createCanvasBase() {
    drawRect(this.context, {x: 0, y:0, height:600, width: 600, color:'black'});
  }

  createPlayers() {
    this.players = {
      user: getLeftPlayer(this.canvasHeight),
      opponent1: getRightPlayer(this.canvasWidth, this.canvasHeight),
      opponent2: getBottomPlayer(this.canvasWidth, this.canvasHeight),
      opponent3: getTopPlayer(this.canvasWidth)
    }
  }

  createBall() {
    this.ball = getBall(this.canvasWidth, this.canvasHeight);
  }

  createBall() {
    this.ball = getBall(this.canvasWidth, this.canvasHeight);
  }

  render() {
    drawRect(this.context, this.players.user.rectangle);
    drawRect(this.context, this.players.opponent1.rectangle);
    drawRect(this.context, this.players.opponent2.rectangle);
    drawRect(this.context, this.players.opponent3.rectangle);
    drawCircle(this.context, this.ball)
  }

}
