import {cookies} from 'next/headers'
import Link from 'next/link'
import {fetchBoard} from 'src/utils/fetch/board'


export default async function BoardLayout(props) {
	const nextCookies = cookies()
	const board = await fetchBoard(nextCookies, decodeURIComponent(props.params.board))

	return (
		<div>
			<div className="grid">
				<h1 className="cs1 ce10">{board?.name}</h1>
				<Link className="cs11 ce12" href="../../">&lt; Back</Link>
			</div>
			<hr/>
		<div>{props.children}</div>
		</div>
	)
}