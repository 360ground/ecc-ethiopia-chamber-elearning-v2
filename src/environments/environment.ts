// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // general
  production: false,
  logoUrl: '/assets/logo.png',
  emptyCertificateUrl: '/assets/emptyCertificate.png',
  usericonUrl: '/assets/user_icon.png',
  baseUrlCanvas: 'http://ecclms.360magic.link/api/v1/',
  canvasUrl: 'http://ecclms.360magic.link',
  canvasClient_id: '10000000000001',
  canvasClient_secret:
    'biZJ8hh9durwy4D82KeuKIZelnwI8739xII4lILjsgdQNSq8e7MvkNthFyNRJVVY',
  redirectUrlAfterLoginIncanvas: 'http://localhost:4200/account/login',
  tokenCanvas:
    'xBNfZYaVzkltBoU12RPeuRl0IBgOxwJ6FzSb1IbBDsJcj6foBSYeM0McMMvxXNin',

  applicationUrl: 'http://localhost:4200',

  // backend express
  baseUrlBackend: 'http://localhost:4000',
  passwordResetLink: 'http://localhost:4200/profile/setnewpassword/',
  paymentSuccessCallbackUrl: 'https://28ec-196-188-51-250.eu.ngrok.io',

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
