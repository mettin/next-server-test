'use server'

import Image from 'next/image'
import Link from 'next/link'
import {cookies} from 'next/headers'

import moment from 'moment'

// @ts-ignore
import congratulations from '../public/congratulations.png'
import {fetchBoards} from 'src/utils/fetch/boards'

export default async function Main() {
	const nextCookies = cookies()

	let boards
	try {
		boards = await fetchBoards(nextCookies)
	} catch (e){
		console.log('page error', e)
	}
	moment().locale('nl')

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
					{!!boards.length && boards?.map((board) => (
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
