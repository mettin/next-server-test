export const AppCard = ({title, description}) => {
	return (
		<div className="app-card">
			<h1 className="app-card--title">{title}</h1>
			<h1 className="app-card--description p-medium">{description}</h1>
		</div>
	)
}