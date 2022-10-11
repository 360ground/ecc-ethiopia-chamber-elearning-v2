// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // general
  production: false,
  logoUrl: '/assets/logo.png',

  baseUrlCanvas: 'http://3.122.238.52/api/v1/',
  canvasUrl: 'http://3.122.238.52',
  canvasClient_id: '10000000000004',
  canvasClient_secret:
    'a1tqQmIaA6RWluysJGVhePsU7ZEz9Du7i33jWttYfHIXl77lAQqDmKPmcJ8XbMrf',
  redirectUrlAfterLoginIncanvas: 'http://localhost:4200/account/login',
  tokenCanvas:
    'S2E9x9n0gzg6in9Nn5eRumHrUftJSX6Rttu8dPl4cCNeJ2pyyT9SNOVyXVHM7asK',

  // backend express
  baseUrlBackend: 'http://localhost:4000',

  // medapay
  medapayUrl: 'https://api.pay.meda.chat/v1/bills',
  medapayToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdG9tZWRhQDM2MGdyb3VuZC5jb20iLCJuYW1lIjoiTWVkYSBWb3VjaGVyIiwicGhvbmUiOiIrMjUxOTEzMDA4NTk1IiwiaXNzIjoiIiwiaWF0IjoxNTk4OTY0NTQwLCJleHAiOjIwMzA1MDA1NDB9.0xCu1GltD3fM8EoZOryDtw7zQMvyBWq1vBbIzQEH1Fk',
  callBackUrlAfterPayment: 'http://localhost:4000/paymentSuccessCallBack',

  // moodle
  baseUrl: 'https://devengender.360ground.com/webservice/rest/server.php',
  loginUrl: 'https://devengender.360ground.com/login/token.php',
  adminToken: 'e466a3adcc463e1b0e7c5296288f6641',
  afterSignupRedirectUrl: 'http://www.google.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
