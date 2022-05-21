// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  supersetURI: 'http://172.31.32.254:8089',
  absoluteURI: 'http://10.66.4.50:8088',
  // baseApiURL: 'http://frontend-sp.apps.lab.okd.netintel.ru/api',
  // baseApiAuthURL: 'http://frontend-sp.apps.lab.okd.netintel.ru/sso',
  // TODO если включаете прокси, то есть запускаете проект с npm run proxystart, использовать эти!
  baseApiURL: '/api',
  baseApiAuthURL: '/sso',
  baseDDTURL: 'http://dadata-sp.apps.lab.okd.netintel.ru',

  APIForSendingEmails: 'https://exd-mail.psb.netintel.ru',
  // APIForSendingEmails: 'http://localhost:8080',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
