'use server'

import initMiro from '../../../src/initMiro';
import {redirect} from 'next/navigation'
import Link from 'next/link'
import CookieMachine from 'src/CookieMachine/CookieMachine'
import {cookies} from 'next/headers'

// handle redirect with code and exchange it for the access token
export default async function Page({searchParams}) {
	const nextCookies = cookies()
	const {miro} = initMiro(nextCookies);

	// Make sure the code is in query parameters
	const code = searchParams.code
	if (!code) {
		redirect('./')
	}

	let token
	try {
		token = await miro.exchangeCodeForAccessToken('', code);
	} catch (e) {
		console.error('error fetching access token from Miro', e)
	}

	return (
		<div>
			<p>Successfully authorized.</p>
			<CookieMachine token={token}/>
			<Link href={'/'}>Back home</Link>
		</div>
	)
}
