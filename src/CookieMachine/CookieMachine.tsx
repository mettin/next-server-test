'use client'

import {useEffect} from 'react'
import {tokensCookie} from 'src/initMiro'

export default function({token}: {token: string}) {
	useEffect(() => {
		if (!token) return
		document.cookie = `${tokensCookie}=${token};path=/`;
	},[])

	return null
}