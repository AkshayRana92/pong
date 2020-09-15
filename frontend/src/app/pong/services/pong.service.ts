import {Injectable} from '@angular/core';
import {Position} from '../interfaces/position';
import * as io from 'socket.io-client';
import {environment} from '../../../environments/environment';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PongService {
  socket;
  playerNumber: Subject<number> = new Subject<number>();
  playerNumber$: Observable<number> = this.playerNumber.asObservable();

  totalPlayers: Subject<number> = new Subject<number>();
  totalPlayers$: Observable<number> = this.totalPlayers.asObservable();

  timer: Subject<number> = new Subject<number>();
  timer$: Observable<number> = this.timer.asObservable();

  message: Subject<string> = new Subject<string>();
  message$: Observable<string> = this.message.asObservable();

  playerList: Subject<{id: string, name: string, playerNumber: number}[]> = new Subject<{id: string, name: string, playerNumber: number}[]>();
  playerList$: Observable<{id: string, name: string, playerNumber: number}[]> = this.playerList.asObservable();

  constructor() {}

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);

    this.socket.on('playerNumber', (playerNumber: number) => {
      if (playerNumber) {
        this.playerNumber.next(playerNumber)
      }
    });

    this.socket.on('totalPlayers', (total: number) => {
      if (total) {
        this.totalPlayers.next(total)
      }
    });

    this.socket.on('playerList', (playerList: {id: string, name: string, playerNumber: number}[]) => {
      if (playerList && playerList.length > 0) {
        this.playerList.next(playerList)
      }
    });

    this.socket.on('message', (message: string) => {
      console.log(message);
      this.message.next(message);
    });

    this.socket.on('timer', (timer: number) => {
      this.timer.next(timer);
    });
  }

  joinGame(name: string) {
    this.socket.emit('join', name)
  }

  reset() {
    this.socket.emit('reset')
  }

  getMyPosition(): Position {
    return Position.LEFT;
  }

}
