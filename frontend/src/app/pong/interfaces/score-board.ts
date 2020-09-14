import {Line} from './line';
import {Text} from './text';

export interface ScoreBoard {
  verticalLine: Line,
  horizontalLine: Line,
  scoreLeft: Text,
  scoreRight: Text,
  scoreTop: Text,
  scoreBottom: Text
}
