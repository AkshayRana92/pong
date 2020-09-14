import {Rectangle} from '../interfaces/rectangle';
import {Circle} from '../interfaces/circle';
import {Text} from '../interfaces/text';

export function drawRect(
  context: CanvasRenderingContext2D,
  rectangle: Rectangle
  ) {
  context.fillStyle = rectangle.color;
  context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
}

export function drawCircle(
  context: CanvasRenderingContext2D,
  circle: Circle
  ) {
  context.fillStyle = circle.color;
  context.beginPath();
  context.arc( circle.x, circle.y, circle.radius, 0, Math.PI*2, false);
  context.closePath()
  context.fill();
}

export function drawText(
  context: CanvasRenderingContext2D,
  text: Text
  ) {
  context.fillStyle = text.color;
  context.font = text.font;
  context.fillText(text.text, text.x, text.y);
}

