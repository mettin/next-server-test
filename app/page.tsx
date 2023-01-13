'use server'

import initMiro from '../src/initMiro'
import Image from 'next/image'
import {redirect} from 'next/navigation'

// @ts-ignore
import congratulations from '../public/congratulations.png'
import {Board} from '@mirohq/miro-api'
import Link from 'next/link'
import * as moment from 'moment'
import {cookies} from 'next/headers'
import {RequestCookies} from 'next/dist/server/web/spec-extension/cookies'

type GetDataInterface = (cookies:RequestCookies) => Promise<{boards: Board[]} | {redirect: { destination: string; permanent: boolean}}>
const getData: GetDataInterface = async (cookies) => {
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
	const boards: Board[] = []

	for await (const board of api.getAllBoards()) {
		boards.push(board)
	}

	return {
		boards
	}
}


export default async function Main() {
	const nextCookies = cookies()
	const data = await getData(nextCookies)

	if ('redirect' in data) {
		redirect(data.redirect.destination)
	}

	moment().locale('nl')

	const {boards} = data

	return (
		<div className="grid wrapper">
			<div className="cs1 ce12">
				<Image src={congratulations} alt="Congratulations" style={{width: '100%', height: 'auto'}}/>
			</div>
			<div className='cs1 ce12'>
				The current time is <time>{moment().format('MMMM Do YYYY, hh:mm:ss')}</time>
			</div>
			<div className="cs1 ce12">
				<h1>Congratulations!</h1>
				<p>You've just created your first Miro app!</p>
				<p>This is a list of all the boards that your user has access to:</p>

				<ul>
					{boards?.map((board) => (
						<li key={board.id}>
							<Link href={`/boards/${board.id}`}>
								{board.name}
							</Link>
						</li>
					))}
				</ul>

				<p>
					To explore more and build your own app, see the Miro Developer
					Platform documentation.
				</p>
			</div>
			<div className="cs1 ce12">
				<a
					className="button button-primary"
					style={{lineHeight: '48px', textDecoration: 'none'}}
					target="_blank"
					href="https://developers.miro.com"
				>
					Read the documentation
				</a>
			</div>
		</div>
	)
}
