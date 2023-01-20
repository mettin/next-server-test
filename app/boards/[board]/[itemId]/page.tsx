'use server'

import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import initMiro from 'src/initMiro'
import {RequestCookies} from 'next/dist/server/web/spec-extension/cookies'
import {cookies} from 'next/headers'
import Link from 'next/link'
import {AppCard} from 'src/AppCard/AppCard'

const getData = async (cookies: RequestCookies, boardId: string, itemId: string) => {
	const {miro} = initMiro(cookies)

	// redirect to auth url if user has not authorized the app
	if (!(await miro.isAuthorized(''))) {
		return {
			redirect: {
				destination: miro.getAuthUrl(),
				permanent: false
			}
		}
	}

	const api = miro.as('')

	let board
	let item
	try {
		board = await api.getBoard(boardId)
	} catch (e) {
		throw new Error('board not found')
	}

	try {
		item = await board.getItem(itemId)
	}catch (e) {
		throw new Error('item not found')
	}

	return {item, board}
}

export default async function Page ({params}: Params) {
	const nextCookies = cookies()
	const {item,board} = await getData(nextCookies, decodeURIComponent(params.board), params.itemId)

	return (
		<div>
			<Link href={`https://miro.com/app/board/${decodeURIComponent(params.board)}/?moveToWidget=${params.itemId}`}>Open item on board</Link>
			{['app_card', 'card'].includes(item.type) && <AppCard {...item.data}/>}
			<pre>
				{JSON.stringify(item, null,  2)}
			</pre>
		</div>
	)
}