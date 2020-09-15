import { Component, Input, OnInit } from '@angular/core';
import { PlayerApiResponse } from '../../interfaces/player-api-response';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {

  @Input() players: PlayerApiResponse[];
  SCORE_LIMIT = 3;

  constructor() { }

  ngOnInit(): void {
  }

  getArray(n: number): number[] {
    return Array(n).map((_, i) => i);
  }

}
