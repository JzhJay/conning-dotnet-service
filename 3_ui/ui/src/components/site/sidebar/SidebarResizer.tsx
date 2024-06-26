import * as css from "./SidebarResizer.css";
import * as React from 'react';
import {observer} from 'mobx-react';
import { action, observable, reaction, makeObservable } from 'mobx';
import {sidebar} from 'stores';

@observer
export class SidebarResizer extends React.Component<{}, {}>{
    constructor(props: {}) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {settings: {show, width}, resizerWidth} = sidebar;
		return (
			<div className={classNames(css.root, {[css.visible]: show})}
			     style={{width: resizerWidth}}
			     title="Double-click to collapse"
			     onMouseDown={this.onMouseDown}
			     onDoubleClick={this.onDoubleClick}
			/>)
	}

    onDoubleClick = () => {
		sidebar.settings.width = sidebar.defaultWidth;
	}

    private document_onMouseMove =(e: MouseEvent) => {
		if (sidebar.isDragging && e.button !== 0) {
			sidebar.isDragging = true;
		}
		else if (sidebar.isDragging) {
			if (e.button !== 0) {
				this.onMouseUp();
			}
			else {
				sidebar.settings.width = Math.min(sidebar.maxWidth, Math.max(e.clientX + sidebar.resizerWidth, sidebar.minWidth));
			}
		}
	};

    componentDidMount() {
		document.addEventListener('mousemove', this.document_onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	}

    componentWillUnmount() {
		document.removeEventListener("mousemove", this.document_onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);

	}

    @action onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (e.button === 0) {
			sidebar.isDragging = true;
			e.preventDefault();
		}
	}

    onMouseUp = () => {
		sidebar.isDragging = false;
	}
}
