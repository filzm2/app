import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';

import { environment } from '../../environments/environment';
import { reducers, effects, RouterSerializer } from './index';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      name: 'EXD Store',
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    {
      provide: RouterStateSerializer,
      useClass: RouterSerializer,
    },
  ],
})

export class AppStoreModule {}
