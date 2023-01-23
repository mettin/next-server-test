'use server'

import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {cookies} from 'next/headers'
import Link from 'next/link'
import {AppCard} from 'src/AppCard/AppCard'
import {fetchBoardItem} from 'src/utils/fetch/boardItem'


export default async function Page ({params}: Params) {
	const nextCookies = cookies()
	const item = await fetchBoardItem(nextCookies, decodeURIComponent(params.board), params.itemId)

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