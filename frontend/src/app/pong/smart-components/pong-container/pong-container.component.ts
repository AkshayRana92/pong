import { Component, OnDestroy, OnInit } from '@angular/core';
import { PongService } from '../../services/pong.service';
import { Observable, Subject } from 'rxjs';
import { PlayerMovement } from '../../interfaces/player-movement';
import { BallMovement } from '../../interfaces/ball-movement';
import { PlayerApiResponse } from '../../interfaces/player-api-response';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pong-container',
  templateUrl: './pong-container.component.html',
  styleUrls: ['./pong-container.component.scss']
})
export class PongContainerComponent implements OnInit, OnDestroy {

  unsubscribe: Subject<boolean> = new Subject<boolean>();

  unsubscribe$: Observable<boolean> = this.unsubscribe.asObservable();
  messages$: Observable<string>;
  playerMoved$: Observable<PlayerMovement>;
  ballMovement$: Observable<BallMovement>;

  playerNumber: number;
  totalPlayers: number;
  isHost: boolean;
  timer: number;
  winner: boolean;
  lost: boolean;
  playerList: PlayerApiResponse[];
  name = '';
  isGameStarted = false;
  isGameEnded = false;

  constructor(private service: PongService) { }

  ngOnInit(): void {
    this.service.setupSocketConnection();
    this.initializeEvents();
  }

  initializeEvents(): void {
    this.service.playerList$.pipe(takeUntil(this.unsubscribe$)).subscribe((data: PlayerApiResponse[]) => {
      this.playerList = data;
      this.totalPlayers = this.playerList.length;
      this.playerNumber = data.map(val => val.name).indexOf(this.name) + 1;
      this.isHost = this.playerNumber === 1;
    });
    this.service.winner$.pipe(takeUntil(this.unsubscribe$)).subscribe(won => {
      this.winner = won;
      this.isGameEnded = true;
    });
    this.service.timer$.pipe(takeUntil(this.unsubscribe$)).subscribe(timer => this.timer = timer);
    this.service.lost$.pipe(takeUntil(this.unsubscribe$)).subscribe(lost => {
      this.lost = lost;
      this.isGameEnded = true;
    });
    this.service.clear$.pipe(takeUntil(this.unsubscribe$)).subscribe(clear => {
      this.tryAgain();
    });

    this.playerMoved$ = this.service.playerMoved$;
    this.ballMovement$ = this.service.ballMovement$;
    this.messages$ = this.service.message$;
  }

  join(): void {
    if (this.name) {
      this.isGameStarted = true;
      this.service.joinGame(this.name);
    }
  }

  tryAgain(): void {
    this.isGameStarted = false;
    this.isGameEnded = false;
    this.winner = false;
    this.lost = false;
    this.name = '';
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

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
  }

}
