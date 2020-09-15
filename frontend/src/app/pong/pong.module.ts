import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PongCanvasComponent} from './presentation-components/pong-canvas/pong-canvas.component';
import { PongContainerComponent } from './smart-components/pong-container/pong-container.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [PongCanvasComponent, PongContainerComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [PongCanvasComponent, PongContainerComponent]
})
export class PongModule { }
