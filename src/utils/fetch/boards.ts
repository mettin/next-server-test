import {RequestCookies} from 'next/dist/server/web/spec-extension/cookies'
import {ReadonlyRequestCookies} from 'next/dist/server/app-render'
import {Board} from '@mirohq/miro-api'
import initMiro from 'src/initMiro'

type GetDataInterface = (cookies: RequestCookies | ReadonlyRequestCookies) => Promise<{boards: Board[]} | {redirect: {destination: string}}>
export const fetchBoards: GetDataInterface = async (cookies) => {
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

	const boards: Board[] = []

	for await (const board of api.getAllBoards()) {
		boards.push(board)
	}

	return boards
}