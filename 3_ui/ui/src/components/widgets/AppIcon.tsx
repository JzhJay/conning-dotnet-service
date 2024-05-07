import type {IconName} from '@blueprintjs/core';
import type { IApplicationIcon } from 'stores';
import { utility, Link } from 'stores';
import { sem, bp } from 'components';
import * as css from './AppIcon.css';
import { iconningSize } from 'iconning';
import InlineSVG from 'svg-inline-react';
import { svgIcons } from 'stores/site/iconography/svgIcons';

require('lib/customIconic/styles/conning.css');
require('lib/customIconic/js/conning.js');

interface IconProps extends sem.IconProps {
	icon: IApplicationIcon,
	iconicDataState?: string,
	iconicDataAttribute?: any,
	className?: string;
	title?: string;
	//tooltip?: string | React.ReactNode;
	disabled?: boolean;
	label?: string;
	style?: any;
	to?: ReactRouter.RoutePattern;
	onClick?: React.EventHandler<React.MouseEvent<HTMLElement>>;
	addonClasses?: string,
	includeCustomAttributePicker?: boolean;
	large?: boolean;
	small?: boolean;
	iconningSize?: iconningSize;
}

export class AppIcon extends React.Component<IconProps, {}> {
	node: Node;
	$node: JQuery;

	componentDidMount() {
		this.node = ReactDOM.findDOMNode(this);

		// Parse/evaluate JS in embedded script tag which updates the global iconic.smartIconApis object. Next save update function to the DOM node.
		// The required steps were reverse engineered from looking at minified iconic code
		if (this.isIconicIcon) {
			let $node   = $(this.node);
			let $script = $node.find('script')
			if ($script.length > 0) {
				const iconic: any = window["_Iconic"];
				const iconName = $node.attr("data-icon") || '';
				// Function($script.get(0).textContent)(window);
				
				if (iconic.smartIconApis[iconName]) {
					($node.get(0) as any).update = iconic.smartIconApis[iconName]($node.get(0)).update;
				} else {
					console.error(`Iconic icon ${iconName}'s update script is missing.`)
				}
			}
		}

		this.iconicUpdate()
	}

	componentWillUnmount() {
		this.node = null;
		this.$node = null;
	}

	iconicUpdate() {
		if (this.isIconicIcon) {
			const $node = $(this.node);

			/*
			 for (let key in this.props.iconicDataAttribute) {
			 if (this.props.iconicDataAttribute.hasOwnProperty(key)) {
			 $node.attr(key, this.props.iconicDataAttribute[key]);
			 }
			 }*/

			let iconic: any = window["_Iconic"];
			iconic.update($node.get(0));
		}
	}

	componentDidUpdate() {
		this.iconicUpdate()
	}

	get isIconicIcon() {
		if (this.props.icon) {
			const { type } = this.props.icon;

			return type == 'iconic' || type == 'customIconic';
		}

		return false;
	}

	svgSource(fileName) {
		let src = svgIcons[fileName];
		if (!src) {
			console.warn(`Missing svg for ${fileName}`)
			src = null
		}

		return src.default ? src.default : src;
	}

	renderIcon = () => {
		const { to, icon, style, disabled, large, small, className, onClick, active, iconicDataAttribute, iconicDataState, ...props } = this.props;

		if (icon == null) { return null }

		if (icon.type == 'semantic') {
			return <sem.Icon {...props}
			                 style={style}
			                 name={icon.name as sem.SemanticICONS}
			                 disabled={disabled}
			                 onClick={onClick}
			                 size={large ? 'large' : null}
			                 className={classNames(css.root, className, { disabled: disabled, [css.clickable]: onClick != null })}/>

			// return <i title={this.props.title} onClick={this.props.onClick}
			//           style={this.props.style}
			//           className={classNames(this.props.className, icon.name, {disabled: disabled})}/>
		}
		else if (icon.type == 'blueprint') {
			const extraClasses = { [bp.Classes.LARGE]: large, [bp.Classes.SMALL]: small, [bp.Classes.ACTIVE]: active };
			const title = !!this.props.title ? this.props.title : false;
			const iconProps = { icon: icon.name as IconName, iconSize: large ? bp.Icon.SIZE_LARGE : bp.Icon.SIZE_STANDARD, title: ( title as string|false) }
			let iconElement = <bp.Icon {...iconProps} />;

			return to
			       ? <Link to={to} style={style} className={classNames({ [bp.Classes.DISABLED]: disabled }, bp.Classes.BUTTON, extraClasses, css.root, className)} onClick={onClick}>
				       {iconElement}
			       </Link>
			       : onClick
			         ? <bp.AnchorButton icon={icon.name as IconName}
			                            disabled={disabled}
			                            style={style}
			                            className={classNames(css.root, className, extraClasses, { [css.clickable]: onClick != null })} onClick={onClick}/>
			         : <span style={style} className={classNames(css.root, className, extraClasses)}>
						{iconElement}
			        </span>

		}
		else if (icon.type == 'iconning') {
			const { iconningSize, icon: { name } } = this.props;

			return <InlineSVG
				raw={true}
				title={this.props.title} onClick={onClick}
				style={{ ...this.props.style, visibility: false }}
				className={classNames(css.root, className, `iconning-${name}`, { [css.disabled]: disabled, [css.clickable]: onClick != null })}
				src={this.svgSource(`iconning/svg/static/${name}-${iconningSize ? iconningSize : 20}.svg`)}/>
		}
		else if (this.isIconicIcon) {
			const isCustom = icon.type == 'customIconic';

			const name        = utility.camelTo('-', _.camelCase(icon.name));
			const description = utility.camelTo(' ', _.camelCase(icon.name));
			const folder      = isCustom ? "customIconic" : "Iconic";

			return <InlineSVG
				raw={true}
				title={this.props.title} onClick={onClick}
				style={{ ...this.props.style, visibility: false }}
				className={classNames(css.root, className, 'iconic icon', `iconic-${name}`, { [css.disabled]: disabled, 'iconic-lg': large, 'iconic-sm': small, [css.clickable]: onClick != null })} {...this.props.iconicDataAttribute}
				src={this.svgSource(`lib/${folder}/svg/smart/${name}.svg`)} alt={description}/>
		}
		else if (icon.type == "blueprintSvgPath"){
			// TODO: delete it when upgrade to blueprints 4
			// display icon which not included in blueprints3, should remove this when upgrade to blueprints4
			const { iconningSize, icon: { name } } = this.props;
			const size = iconningSize || 20;

			return <span aria-hidden="true" className="bp3-icon">
					<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
					<path d={name} fillRule={"evenodd"} />
				</svg>
			</span>
		}

		return (
			<i className="unknown">
				Unknown icon {JSON.stringify(icon)}
			</i>
		);
	}

	render() {
		const { icon, disabled, label, className, ...props } = this.props;

		if (icon == null) { return null }

		if (label) {
			return <p className={css.iconWithLabel}>
				{this.renderIcon()}
				<label>{label}</label>
			</p>
		}

		return this.renderIcon();
	}
}
