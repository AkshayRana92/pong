import {Component, OnInit} from '@angular/core';
import {PongService} from '../../services/pong.service';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-pong-container',
  templateUrl: './pong-container.component.html',
  styleUrls: ['./pong-container.component.scss']
})
export class PongContainerComponent implements OnInit {
  playerNumber: number;
  totalPlayers: number;
  timer$: Observable<number>;
  name: string = '';
  isGameStarted: boolean = false;
  constructor(private service: PongService) { }

  ngOnInit(): void {
    this.service.setupSocketConnection();
    this.service.playerList$.subscribe((val: {id: string, name: string, playerNumber: number}[]) => {
      console.log(val);
      const currentPlayer = val.map(val => val.name);
      this.playerNumber = currentPlayer.indexOf(this.name);
    });
    this.service.totalPlayers$.subscribe(val => this.totalPlayers = val);
    this.timer$ = this.service.timer$;
  }

  join() {
    if(this.name) {
      this.isGameStarted = true;
      this.service.joinGame(this.name);
    }
  }

  tryAgain() {
    this.isGameStarted = false;
    this.service.reset();
  }
}
