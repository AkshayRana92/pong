import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PongCanvasComponent } from './presentation-components/pong-canvas/pong-canvas.component';
import { PongContainerComponent } from './smart-components/pong-container/pong-container.component';
import { FormsModule } from '@angular/forms';
import { MessagesComponent } from './presentation-components/messages/messages.component';
import { MessageItemComponent } from './presentation-components/message-item/message-item.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [PongCanvasComponent, PongContainerComponent, MessagesComponent, MessageItemComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule
  ],
  exports: [PongCanvasComponent, PongContainerComponent]
})
export class PongModule {}
