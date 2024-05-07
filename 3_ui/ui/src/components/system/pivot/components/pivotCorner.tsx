import * as React from 'react';

interface MyProps extends React.HTMLAttributes<HTMLDivElement> {
    additionalMenuItems?: JSX.Element[];
    actionMenuItems?: JSX.Element[];

}

export class PivotCorner extends React.Component<MyProps,{}> {
    render() {
        return (

            <div className="pivot-corner" style={this.props.style}>

            </div>);
        //
        // {/*
        //     <SemanticDropdownMenu
        //         {...this.props}
        //         isButton={true}
        //         className={classNames("pivot-corner", { hidden: this.props.metadata == null })}
        //         systemIcon={SystemIcon.iconicCog}>
        //
        //         <SemanticMenu>
        //             {additionalMenuItems}
        //
        //             {additionalMenuItems ? <SemanticMenuDivider /> : null}
        //
        //             {actionMenuItems}
        //         </SemanticMenu>
        //
        //     </SemanticDropdownMenu>*/}
        // );
    }
}
