import classNames from"classnames";import*as React from"react";import*as Classes from"../../common/classes";import{DISPLAYNAME_PREFIX}from"../../common/props";import{isFunction}from"../../common/utils";import{TreeNode}from"./treeNode";export class Tree extends React.Component{constructor(){super(...arguments),this.nodeRefs={},this.handleNodeCollapse=(e,s)=>{this.handlerHelper(this.props.onNodeCollapse,e,s)},this.handleNodeClick=(e,s)=>{this.handlerHelper(this.props.onNodeClick,e,s)},this.handleContentRef=(e,s)=>{null!=s?this.nodeRefs[e.props.id]=s:delete this.nodeRefs[e.props.id]},this.handleNodeContextMenu=(e,s)=>{this.handlerHelper(this.props.onNodeContextMenu,e,s)},this.handleNodeDoubleClick=(e,s)=>{this.handlerHelper(this.props.onNodeDoubleClick,e,s)},this.handleNodeExpand=(e,s)=>{this.handlerHelper(this.props.onNodeExpand,e,s)},this.handleNodeMouseEnter=(e,s)=>{this.handlerHelper(this.props.onNodeMouseEnter,e,s)},this.handleNodeMouseLeave=(e,s)=>{this.handlerHelper(this.props.onNodeMouseLeave,e,s)}}static ofType(){return Tree}static nodeFromPath(e,s){return 1===e.length?s[e[0]]:Tree.nodeFromPath(e.slice(1),s[e[0]].childNodes)}render(){return React.createElement("div",{className:classNames(Classes.TREE,this.props.className)},this.renderNodes(this.props.contents,[],Classes.TREE_ROOT))}getNodeContentElement(e){return this.nodeRefs[e]}renderNodes(e,s,o){if(null==e)return null;const t=e.map(((e,o)=>{const t=s.concat(o),n=TreeNode.ofType();return React.createElement(n,Object.assign({},e,{key:e.id,contentRef:this.handleContentRef,depth:t.length-1,onClick:this.handleNodeClick,onContextMenu:this.handleNodeContextMenu,onCollapse:this.handleNodeCollapse,onDoubleClick:this.handleNodeDoubleClick,onExpand:this.handleNodeExpand,onMouseEnter:this.handleNodeMouseEnter,onMouseLeave:this.handleNodeMouseLeave,path:t}),this.renderNodes(e.childNodes,t))}));return React.createElement("ul",{className:classNames(Classes.TREE_NODE_LIST,o)},t)}handlerHelper(e,s,o){isFunction(e)&&e(Tree.nodeFromPath(s.props.path,this.props.contents),s.props.path,o)}}Tree.displayName=`${DISPLAYNAME_PREFIX}.Tree`;