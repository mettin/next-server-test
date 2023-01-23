import {cookies} from 'next/headers'
import {fetchBoards} from 'src/utils/fetch/boards'
import React from 'react'

type RootLayoutProps = {
	children: React.ReactNode
}
export default async function RootLayout({
											 children
										 }: RootLayoutProps) {
	const nextCookies = cookies()
	const data = await fetchBoards(nextCookies)
	
	return (
		<html>
		<head>
			<link
				rel="stylesheet"
				href="https://unpkg.com/mirotone/dist/styles.css"
			/>
			<title>Miro</title>
		</head>
		<body>
		<div style={{maxWidth: '500px', margin: 'var(--space-large) auto', display: 'block'}}>
			<h1>Miro board info viewer</h1>
			<hr/>
			{data?.cause && data.cause.redirect ?
				<>
					<a href={data.cause.redirect.destination}>Login to Miro</a>
					<hr/>
					{children}
				</>
				: children}
		</div>
		</body>
		</html>
	)
}
