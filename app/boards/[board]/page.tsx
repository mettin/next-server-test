import initMiro from '../../../src/initMiro'
import Link from 'next/link'
import {WidgetItem} from '@mirohq/miro-api/dist/highlevel/Item'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {cookies} from 'next/headers'
import {RequestCookies} from 'next/dist/server/web/spec-extension/cookies'

const getData = async (nextCookies: RequestCookies, boardId: string) => {
	const {miro} = initMiro(nextCookies)

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

	try {
		const board = await api.getBoard(boardId)
		const rawItems = await board.getAllItems()

		const items: WidgetItem[] = []
		for await (const item of rawItems) {
			items.push(item)
		}

		return {items, board}
	} catch (e) {
		throw new Error('board not found')
	}
}

export default async function Page({params}: Params) {
	try {
		const nextCookies = cookies()
		const {items, board} = await getData(nextCookies, decodeURIComponent(params.board))

		return (
			<div>
				<div className="grid">
					<h1 className="cs1 ce10">{board?.name}</h1>
					<Link className="cs11 ce12" href="/">&lt; Back</Link>
				</div>
				{board?.viewLink && <><Link href={board.viewLink}>Open board on Miro.com</Link><br/></>}
				{items?.length
					? <ul>
						{items?.map(item => (
							<li key={item.id}>
								id: <Link href={`/boards/${decodeURIComponent(params.board)}/${item.id}`}>{item.id}</Link> <br/>
								type: {item.type} <br/>
								{item.data && 'content' in item.data && item.data.content && <>content: <span dangerouslySetInnerHTML={{__html: item.data.content || ''}}/></>}
							</li>
						))}
					</ul>
					: <p>No items on this board found.</p>}
			</div>
		)
	} catch (e) {
		return <div>Error fetching data </div>
	}
}
