import {Miro} from '@mirohq/miro-api';
import {serialize} from 'cookie';
import {RequestCookies} from 'next/dist/server/web/spec-extension/cookies'
import {ReadonlyRequestCookies} from 'next/dist/server/app-render'

function getSerializedCookie(name: string, value: string) {
  return serialize(name, value, {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
}

export const tokensCookie = 'miro_tokens';
const userIdCookie = 'miro_user_id';
export default function initMiro(
    cookies: RequestCookies | ReadonlyRequestCookies
) {

  // set up a Miro instance that loads tokens from cookies
  return {
    miro: new Miro({
      storage: {
        get: () => {
          // Load state (tokens) from a cookie if it's set
          try {
            return {
              userId: '',
              accessToken: cookies.get(tokensCookie)?.value,
            }
          } catch (err) {
            return null;
          }
        },
        set: (_) => {},
      },
    }),
    userId: cookies.get(userIdCookie) || '',
  };
}
