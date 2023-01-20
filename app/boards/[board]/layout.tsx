import initMiro from 'src/initMiro'
import {cookies} from 'next/headers'
import Link from 'next/link'

const getBoard = async (cookies, boardId) => {
	const {miro} = initMiro(cookies)

	// redirect to auth url if user has not authorized the app
	if (!(await miro.isAuthorized(''))) {
		return {
			redirect: {
				destination: miro.getAuthUrl(),
			}
		}
	}

	const api = miro.as('')

	return await api.getBoard(boardId)
}

export default async function BoardLayout(props) {
	const nextCookies = cookies()
	const board = await getBoard(nextCookies, decodeURIComponent(props.params.board))

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