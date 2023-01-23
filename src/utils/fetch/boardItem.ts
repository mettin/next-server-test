import {RequestCookies} from 'next/dist/server/web/spec-extension/cookies'
import initMiro from 'src/initMiro'
import {Item} from '@mirohq/miro-api'
import {fetchBoard} from 'src/utils/fetch/board'

export const fetchBoardItem: (cookies: RequestCookies, boardId: string, itemId: string) => Item = async (cookies, boardId, itemId) => {
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

	const board = await fetchBoard(cookies, boardId)


	let item
	try {
		item = await board.getItem(itemId)
	}catch (e) {
		throw new Error('item not found')
	}

	return item as Item
}
