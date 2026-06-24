import Env from 'envs/env';

export default {
  BASE_URL: Env.BASE_URL,
  API_URL: 'api/v1',
  CHECK_FOCRCE_UPDATE: 'version?platform=android&version=',

  // Auth
  LOGIN_URL: '/auth/login',
  CREATE_TEAM_URL: '/auth/register',
  FORGOT_PASSWORD: 'password',
  LOGOUT_URL: 'logout',
  VERIFY_URL: 'code',
  VERIFY_AGAIN_URL: 'code/resend',
  LEAVE_REQUEST_URL: 'leave_requests',
  GET_ALL_LEAVES_URL: 'leave_request',
  SET_PROFILE_PICTURE_URL: 'user',
  CONTACT_US_URL: 'contact-us',
  QUOUTE_URL: 'v1/quote/random',
  GET_ATTENDANCE_URL: 'punch_in_out',
  ACCOUNT_VERIFY: 'code',
  UPDATE_USER: 'updated-user',
  CODE_RESEND: 'code/resend',
  VERSION: 'version',
  PRIVACY_POLICY: 'https://www.ittendance.com/privacy',
  TERMS_CONDITIONS: 'https://www.ittendance.com/terms',
  PUNCH_IN_AND_OUT: 'punch_in_out',
};
