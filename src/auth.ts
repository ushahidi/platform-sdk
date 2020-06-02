/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';

export const getAuthToken = async (
  username: string,
  password: string,
  backendURL: string,
): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${backendURL}/oauth/token`, {
      grant_type: 'password',
      client_secret: '35e7f0bca957836d05ca0492211b0ac707671261',
      client_id: 'ushahidiui',
      scope:
        'posts country_codes media forms api tags savedsearches sets users stats layers config messages notifications webhooks contacts permissions csv',
      password: password,
      username: username,
    });
    return { token: response.data.access_token };
  } catch (err) {
    return err;
  }
};
