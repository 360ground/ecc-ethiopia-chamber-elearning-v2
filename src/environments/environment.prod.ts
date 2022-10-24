export const environment = {
  production: true,
  logoUrl: `${window.location.origin}/eccNew/assets/logo.png`,
  usericonUrl: `${window.location.origin}/eccNew/assets/user_icon.png`,
  baseUrlCanvas: 'http://3.122.238.52/api/v1/',
  canvasUrl: 'http://3.122.238.52',
  canvasClient_id: '10000000000004',
  canvasClient_secret:
    'a1tqQmIaA6RWluysJGVhePsU7ZEz9Du7i33jWttYfHIXl77lAQqDmKPmcJ8XbMrf',
  redirectUrlAfterLoginIncanvas: `${window.location.origin}/eccNew/redirect.html`,
  tokenCanvas:
    'N7nn2Vp9QEeubZYx1Ywy5fhPOaJPqSEfpkFsoA9qA82gCAbdefSKlT4sNSkaeisO',

  // back end
  baseUrlBackend: 'http://3.125.158.58:4000',

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
