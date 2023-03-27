export const environment = {
  production: true,
  logoUrl: `${window.location.origin}/assets/logo.png`,
  emptyCertificateUrl: `${window.location.origin}/assets/emptyCertificate.png`,

  usericonUrl: `${window.location.origin}/assets/user_icon.png`,
  baseUrlCanvas: 'http://ecclms.360magic.link/api/v1/',
  canvasUrl: 'http://ecclms.360magic.link',
  canvasClient_id: '10000000000001',
  canvasClient_secret:
    'biZJ8hh9durwy4D82KeuKIZelnwI8739xII4lILjsgdQNSq8e7MvkNthFyNRJVVY',
  redirectUrlAfterLoginIncanvas: `${window.location.origin}/`,
  tokenCanvas:
    'xBNfZYaVzkltBoU12RPeuRl0IBgOxwJ6FzSb1IbBDsJcj6foBSYeM0McMMvxXNin',

  applicationUrl: `${window.location.origin}`,  

  passwordResetLink: `${window.location.origin}/profile/setnewpassword/`,


  // back end
  baseUrlBackend: 'http://ecc.360magic.link:4000',
  paymentSuccessCallbackUrl: 'http://ecc.360magic.link:4000',


   // back end
  //  baseUrlBackend: 'http://localhost:4000',
  //  paymentSuccessCallbackUrl: 'http://localhost:4000',

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
