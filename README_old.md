## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

##Запуск проекта с прокси-настройками для правильной работы с кейклок
Запуск проекта : ng serve --proxy-config proxy.conf.json --port 4200

Здесь лежит обработчик ошибок. Если ошибка доступа или запроса (в любом запросе) перекидывает на то, что там указано : src/app/core/http/api.service.ts

Гарда, проверяет есть права делать запросы : src/app/core/helpers/auth.guard.ts

Куда перекидывать хранится в proxy.conf.json

адреса апи для дев-режима хранятся в environments/environment.ts

запрос проверки авторизации лежит в core/services/auth.service.ts (keyCloakIsLogin),
он вызывается в гарде в core/guards/auth.guard.ts.