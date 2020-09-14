import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PongCanvasComponent } from './presentation-components/pong-canvas/pong-canvas.component';



@NgModule({
  declarations: [PongCanvasComponent],
  imports: [
    CommonModule
  ],
  exports: [PongCanvasComponent]
})
export class PongModule { }
