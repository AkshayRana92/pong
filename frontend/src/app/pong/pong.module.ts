import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PongCanvasComponent } from './presentation-components/pong-canvas/pong-canvas.component';
import { PongContainerComponent } from './smart-components/pong-container/pong-container.component';
import { FormsModule } from '@angular/forms';
import { MessagesComponent } from './presentation-components/messages/messages.component';
import { MessageItemComponent } from './presentation-components/message-item/message-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScoreboardComponent } from './presentation-components/scoreboard/scoreboard.component';


@NgModule({
  declarations: [PongCanvasComponent, PongContainerComponent, MessagesComponent, MessageItemComponent, ScoreboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [PongCanvasComponent, PongContainerComponent]
})
export class PongModule {}
