import { create } from 'apisauce';
import { API } from 'config';
import AuthStorage from 'repo/auth/AuthStorage';
import { AppLog } from 'utils/Util';

export const apiClient = create({
  baseURL: API.BASE_URL + API.API_URL,
  timeout: 60000, // pehle agar 10000/15000 tha to usay 60000 kar dein
  headers: { Accept: 'application/json' },
});

resetApiClient();

function clientsInNeedOfTokens() {
  return [apiClient];
}

export function resetApiClient(providedAuthToken?: string) {
  clientsInNeedOfTokens().forEach(it =>
    it.addAsyncRequestTransform(async request => {
      request.headers.accept = 'application/json';

      const authToken = providedAuthToken ?? AuthStorage.getUserToken();

      AppLog.log(() => 'Authorization Token: ' + authToken, 'auth');

      if (authToken === undefined) {
        return;
      }

      request.headers.Authorization = 'Bearer ' + authToken;
    }),
  );
}
