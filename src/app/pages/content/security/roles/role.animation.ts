import { animate, state, style, transition, trigger } from '@angular/animations';

export const verticalHide = trigger('verticalHide', [
  state(
    'open',
    style({
      'max-height': '300px',
    })
  ),
  state(
    'close',
    style({
      'max-height': '0',
    })
  ),
  transition('* => *', [animate('250ms linear')]),
]);

export const verticalHideL = trigger('verticalHideL', [
  state(
    'open',
    style({
      'max-height': '800px',
    })
  ),
  state(
    'close',
    style({
      'max-height': '0',
    })
  ),
  transition('* => *', [animate('300ms linear')]),
]);

export const turn90 = trigger('turn90', [
  state(
    'open',
    style({
      transform: 'rotate(0)',
    })
  ),
  state(
    'close',
    style({
      transform: 'rotate(-90deg)',
    })
  ),
  transition('* => *', [animate('250ms linear')]),
]);
