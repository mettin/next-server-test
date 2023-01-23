import initMiro from 'src/initMiro'
import {RequestCookies} from 'next/dist/server/web/spec-extension/cookies'

export const fetchBoard = async (cookies: RequestCookies, boardId: string) => {
	const {miro} = initMiro(cookies)

	// redirect to auth url if user has not authorized the app
	if (!(await miro.isAuthorized(''))) {
		return new Error('Authentication error', {
				cause: {
					authenticated: false,
					redirect: {
						destination: miro.getAuthUrl()
					}
				}
			}
		)
	}
	const api = miro.as('')

	return await api.getBoard(boardId)
}
