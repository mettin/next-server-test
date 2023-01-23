import initMiro from 'src/initMiro'
import {WidgetItem} from '@mirohq/miro-api/dist/highlevel/Item'
import {fetchBoard} from 'src/utils/fetch/board'

export const fetchBoardItems = async (cookies, boardId: string) => {
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

	try {
		const board = await fetchBoard(cookies, boardId)
		const rawItems = await board.getAllItems()

		const items: WidgetItem[] = []
		for await (const item of rawItems) {
			items.push(item)
		}

		return items
	} catch (e) {
		throw new Error('board not found')
	}
}