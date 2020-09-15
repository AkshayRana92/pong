import { Injectable } from '@angular/core';
import { Position } from '../interfaces/position';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { PlayerMovement } from '../interfaces/player-movement';
import { BallMovement } from '../interfaces/ball-movement';
import { PlayerApiResponse } from '../interfaces/player-api-response';

@Injectable({
  providedIn: 'root'
})
export class PongService {
  socket;

  clear: Subject<boolean> = new Subject<boolean>();
  clear$: Observable<boolean> = this.clear.asObservable();

  lost: Subject<boolean> = new Subject<boolean>();
  lost$: Observable<boolean> = this.lost.asObservable();

  timer: Subject<number> = new Subject<number>();
  timer$: Observable<number> = this.timer.asObservable();

  winner: Subject<boolean> = new Subject<boolean>();
  winner$: Observable<boolean> = this.winner.asObservable();

  message: Subject<string> = new Subject<string>();
  message$: Observable<string> = this.message.asObservable();

  playerMoved: Subject<PlayerMovement> = new Subject<PlayerMovement>();
  playerMoved$: Observable<PlayerMovement> = this.playerMoved.asObservable();

  ballMovement: Subject<BallMovement> = new Subject<BallMovement>();
  ballMovement$: Observable<BallMovement> = this.ballMovement.asObservable();

  playerList: Subject<{ id: string, name: string, playerNumber: number }[]> =
    new Subject<{ id: string, name: string, playerNumber: number }[]>();
  playerList$: Observable<{ id: string, name: string, playerNumber: number }[]> = this.playerList.asObservable();

  constructor() {}

  setupSocketConnection(): void {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.initializeEventListeners();
  }

  joinGame(name: string): void {
    this.socket.emit('join', name);
  }

  onPlayerMove(movement: PlayerMovement): void {
    this.socket.emit('onPlayerMove', movement);
  }

  onBallMove(movement: BallMovement): void {
    this.socket.emit('onBallMove', movement);
  }

  onSetScore(scores: number[]): void {
    this.socket.emit('setScore', scores);
  }

  initializeEventListeners(): void {
    this.socket.on('playerList', (playerList: { id: string, name: string, playerNumber: number }[]) => {
      if (playerList && playerList.length > 0) {
        this.playerList.next(playerList);
      }
    });

    this.socket.on('message', (message: string) => {
      this.message.next(message);
    });

    this.socket.on('timer', (timer: number) => {
      this.timer.next(timer);
    });

    this.socket.on('playerMoved', (playerMovement: PlayerMovement) => {
      this.playerMoved.next(playerMovement);
    });

    this.socket.on('ballMoved', (ballMovement: BallMovement) => {
      this.ballMovement.next(ballMovement);
    });

    this.socket.on('winner', (player: boolean) => {
      this.winner.next(player);
    });

    this.socket.on('lost', (lost: boolean) => {
      this.lost.next(lost);
    });

    this.socket.on('clear', (clear: boolean) => {
      this.clear.next(clear);
    });
  }

}
