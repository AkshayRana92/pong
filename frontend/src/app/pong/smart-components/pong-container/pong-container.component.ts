import { Component, OnInit } from '@angular/core';
import { PongService } from '../../services/pong.service';
import { Observable } from 'rxjs';
import { PlayerMovement } from '../../interfaces/player-movement';
import { BallMovement } from '../../interfaces/ball-movement';
import { PlayerApiResponse } from '../../interfaces/player-api-response';

@Component({
  selector: 'app-pong-container',
  templateUrl: './pong-container.component.html',
  styleUrls: ['./pong-container.component.scss']
})
export class PongContainerComponent implements OnInit {
  playerNumber: number;
  totalPlayers: number;
  isHost: boolean;
  timer$: Observable<number>;
  winner$: Observable<PlayerApiResponse>;
  messages$: Observable<string>;
  clear$: Observable<boolean>;
  playerMoved$: Observable<PlayerMovement>;
  ballMovement$: Observable<BallMovement>;
  playerList: PlayerApiResponse[];

  name = '';
  isGameStarted = false;

  constructor(private service: PongService) { }

  ngOnInit(): void {
    this.service.setupSocketConnection();
    this.service.playerList$.subscribe((data: PlayerApiResponse[]) => {
      this.playerList = data;
      this.totalPlayers = this.playerList.length;
      this.playerNumber = data.map(val => val.name).indexOf(this.name) + 1;
      this.isHost = this.playerNumber === 1;
    });
    this.timer$ = this.service.timer$;
    this.playerMoved$ = this.service.playerMoved$;
    this.playerMoved$ = this.service.playerMoved$;
    this.ballMovement$ = this.service.ballMovement$;
    this.winner$ = this.service.winner$;
    this.messages$ = this.service.message$;
    this.service.clear$.subscribe(clear => {
      this.isGameStarted = false;
    });
  }

  join(): void {
    if (this.name) {
      this.isGameStarted = true;
      this.service.joinGame(this.name);
    }
  }

  tryAgain(): void {
    this.isGameStarted = false;
    this.service.reset();
  }

  onPlayerMove($event: PlayerMovement): void {
    this.service.onPlayerMove($event);
  }

  onBallMove($event: BallMovement): void {
    this.service.onBallMove($event);
  }

  onSetScore($event: number[]): void {
    this.service.onSetScore($event);
  }

}
