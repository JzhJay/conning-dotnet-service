import {utility} from 'components';
import PropTypes from 'prop-types';
import React from 'react-router/node_modules/@types/react';

const rootUrl = 'http://localhost:8572';  // Todo - this obviously needs to change.

const style = {
    tree: {
        base: {
            listStyle: 'none',
            backgroundColor: '',
            margin: 0,
            padding: 0,
            fontSize: '14px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: 'lightblue'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#9DA5AB',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: 'black'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
}

export interface IChildNode {
    axis: string;
    coordinate: string;
    children?: string;
}

interface MyProps {
    definition: string;
    juliaPort: number;
}

interface MyState {
    data?: {
        name: string,
        toggled: boolean,
        children: any
    }
    cursor?: {
        active: boolean;
    }
}

export default class DefinitionTree extends React.Component<MyProps, MyState> {
    static propTypes = {
        definition: PropTypes.string.isRequired,
        juliaPort: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {};

        this.onToggle = this.onToggle.bind(this);

	    this.loadDefinition();
    }

    loadDefinition() {
        const url = `http://localhost:${this.props.juliaPort}/${this.props.definition}`;

        return utility.superAgent.get(url).then((response) => {
                console.log(response.body);

                this.setState({
                    data: {
                        name: this.props.definition,
                        toggled: true,
                        children: this.parseChildren(response.body)
                    }
                });
            })
    }

    parseChildren(json, parentNode?) {
        return _.map(json, (child:IChildNode) => {
            return {
                name: `${child.axis} - ${child.coordinate}`,
                tag: child,
                parent: parentNode,
                children: child.children === 'true' ? [] : null,
                loading: child.children === 'true'
            }
        })
    }

	componentDidUpdate(prevProps) {
        if (this.props.definition !== prevProps.definition) {
            this.setState({data: null});

            this.loadDefinition();
        }
    }

    onToggle(node, toggled) {
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({cursor: node});

        //console.log(this.props);
        //this.props.scope.$apply(() => {
        //    this.props.scope.vm.selectedDefinitionNode = node;
        //});

        if (node.loading) {
            const axis = node.tag;

            let walker = node.parent;
            let axisQuery = `${axis.axis}=${axis.coordinate}`;
            while (walker != null) {
                axisQuery = `${walker.tag.axis}=${walker.tag.coordinate}&` + axisQuery;
                walker = walker.parent;
            }

            return utility.superAgent.get(`${rootUrl}/${this.props.definition}?${axisQuery}`)
                .then((response) => {
                    console.log(response.body);
                    node.children = this.parseChildren(response.body, node)
                    node.loading = false;
                    this.forceUpdate();
                })
        }
    }

    render() {
        let content;
        if (this.state.data != null) {
            content =
                <Treebeard
                    data={this.state.data}
                    style={style}
                    onToggle={this.onToggle}
                />
        }
        else {
            content =
                <span>
                    Loading definition...
                </span>
        }
        return (
            <div>
                {content}
            </div>
        );
    }
}

