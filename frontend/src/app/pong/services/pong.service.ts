import {Injectable} from '@angular/core';
import {Position} from '../interfaces/position';

@Injectable({
  providedIn: 'root'
})
export class PongService {
  private totalNumberOfPlayers = 4;
  private isHost: boolean = true;

  getIsHost(): boolean {
    return this.isHost;
  }

  getMyPosition(): Position {
    return Position.LEFT;
  }

}
