import {Miro} from '@mirohq/miro-api';
import {serialize} from 'cookie';
import {RequestCookies} from 'next/dist/server/web/spec-extension/cookies'

function getSerializedCookie(name: string, value: string) {
  return serialize(name, value, {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
}

export default function initMiro(
    cookies: any,
  response?: {setHeader(name: string, value: string[]): void},
) {
  const tokensCookie = 'miro_tokens';
  const userIdCookie = 'miro_user_id';

  // set up a Miro instance that loads tokens from cookies
  return {
    miro: new Miro({
      storage: {
        get: () => {
          // Load state (tokens) from a cookie if it's set
          try {
            return JSON.parse(cookies.get(tokensCookie)?.value || '')
          } catch (err) {
            return null;
          }
        },
        set: (_, state) => {
          if (!response)
            throw new Error(
              'initMiro should be invoked with a response object',
            );
          // store state (tokens) in the cookie
          response.setHeader('Set-Cookie', [
            getSerializedCookie(tokensCookie, JSON.stringify(state)),
          ]);
        },
      },
    }),
    userId: cookies.get(userIdCookie) || '',
  };
}
