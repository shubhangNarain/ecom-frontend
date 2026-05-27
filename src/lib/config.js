export const API_BASE_URL =
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'http://jauter-backend-env-2.eba-mgbdvgp2.ap-south-1.elasticbeanstalk.com/';
