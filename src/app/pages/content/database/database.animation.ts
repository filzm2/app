import { trigger, state, style, animate, transition, animateChild, query, group } from '@angular/animations';

export const verticalHide = trigger('verticalHide', [
    state('open', style({
      'max-height': '800px',
      opacity: 1,
    })),
    state('close', style({
      'max-height': '0',
      opacity: 0,
    })),
    transition('* => *',
      [
        animate('200ms linear')
      ]
    ),
  ]
);

export const turn180 = trigger('turn180', [
    state('open', style({
      transform: 'rotate(180deg)'
    })),
    state('close', style({
      transform: 'rotate(0)'
    })),
    transition('* => *',
      [
        animate('200ms linear')
      ]
    ),
  ]
);
