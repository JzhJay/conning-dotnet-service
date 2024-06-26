import * as css from './LoadingEllipsis.css';

export class LoadingEllipsis extends React.Component<React.HTMLProps<LoadingEllipsis>, {}> {
	render() {
		return <div className={classNames(css.root, this.props.className)} style={this.props.style}>
			<div>
				<div className={css.circle}>
					<div/>
				</div>
				<div className={css.circle}>
					<div/>
				</div>
				<div className={css.circle}>
					<div/>
				</div>
				<div className={css.circle}>
					<div/>
				</div>
			</div>
		</div>;
	}
}
