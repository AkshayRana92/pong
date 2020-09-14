import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongCanvasComponent } from './pong-canvas.component';

describe('PongCanvasComponent', () => {
  let component: PongCanvasComponent;
  let fixture: ComponentFixture<PongCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PongCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PongCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
