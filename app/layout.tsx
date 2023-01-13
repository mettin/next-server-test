export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          {children}
      </div>
      </body>
    </html>
  )
}
