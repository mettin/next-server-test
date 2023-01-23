import Link from 'next/link'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {cookies} from 'next/headers'
import {fetchBoard} from 'src/utils/fetch/board'
import {fetchBoardItems} from 'src/utils/fetch/boardItems'


export default async function Page({params}: Params) {
	try {
		const nextCookies = cookies()
		let items, board
		try{
			board = await fetchBoard(nextCookies, decodeURIComponent(params.board))
			items = await fetchBoardItems(nextCookies, decodeURIComponent(params.board))
		} catch (e){
			console.log('boards/page error',e)
		}

		return (
			<div>
				<Link href={board?.viewLink}>Open board on Miro.com</Link>

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
		return <div>Error fetching data {JSON.stringify(e,  null, 2)}</div>
	}
}
