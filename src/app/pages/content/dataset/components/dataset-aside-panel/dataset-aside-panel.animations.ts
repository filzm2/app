import { trigger, state, style, animate, transition, animateChild, query, group } from '@angular/animations';

export const toggleMenu = trigger('toggleMenu', [
    state('open', style({
      'flex-basis': '455px',
    })),
    state('close', style({
      'flex-basis': '56px',
    })),
    transition('* => *',
      group([
        query('@horizontalHide', [
          animateChild()
        ]),
        animate('250ms linear')
      ])
    ),
  ]
);

export const horizontalHide = trigger('horizontalHide', [
    state('open', style({
      width: 'auto',
      height: 'auto',
      opacity: 1,
    })),
    state('close', style({
      width: 0,
      height: 0,
      opacity: 0,
    })),
    transition('* => *',
      [
        animate('250ms linear')
      ]
    ),
  ]
);

export const verticalHide = trigger('verticalHide', [
    state('open', style({
      'max-height': '300px',
      opacity: 1,
    })),
    state('close', style({
      'max-height': '0',
      opacity: 0,
    })),
    transition('* => *',
      [
        animate('250ms linear')
      ]
    ),
  ]
);

export const verticalHide600 = trigger('verticalHide', [
    state('open', style({
      'max-height': '700px',
      opacity: 1,
    })),
    state('close', style({
      'max-height': '0',
      opacity: 0,
    })),
    transition('* => *',
      [
        animate('250ms linear')
      ]
    ),
  ]
);

export const verticalHideDescription = trigger('verticalHideDescription', [
    state('open', style({
      'max-height': '300px',
    })),
    state('close', style({
      'max-height': '40px',
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
      transform: 'rotate(0)'
    })),
    state('close', style({
      transform: 'rotate(180deg)'
    })),
    transition('* => *',
      [
        animate('250ms linear')
      ]
    ),
  ]
);

