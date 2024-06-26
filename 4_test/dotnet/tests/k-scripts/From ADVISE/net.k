/ Copyright (c) 2011-2012 Conning Services (Ireland) Limited

`0:,"Loading Kui extensions to common/java."

\d .j

java_exec:{
 `0:,"Kui port ",($.p`Java)," not listening; exiting."
 _exit -50
}

java_connect:{
 `0:,"Connecting to Kui..."
 .m.G[`localhost,.p`Java;(`localhost;_p;.p`SessionGuid;.j`splash)]
}


netReady:{[x;y;z;w;themes]
 .j.ready[x;y;z;w]
 .j.netThemes::themes
}

/ Retrieves the ..j dictionary for a given widget
.j.queryJkDictionary:{[widgetName]
	r:.b.get `. .j.undot (($widgetName),"..j")
	if[r~_n;r:.()]
	r}

/ Retrieves the values and parts of the ..j dictionary for a given JK pivot
.j.getJkPivot:{[pivotName]
	values:`. .j.undot pivotName
	attr: `. .j.undot (($pivotName),"..j")

	// return a dictionary containing the Values, Axis Values, and Axes
	@[_n;`values`axes`axisValues;:;(,values),attr`a`ax]}

/ Add `autocomplete attribute to combo

C.combo.public,:`autocomplete
C.combo.initial,:`autocomplete
cons[`combo;`autocomplete;::]

/ Add `okbuttonlabel attribute to chooser

C.chooser.public,:`okbuttonlabel
C.chooser.initial,:`okbuttonlabel
cons[`chooser;`okbuttonlabel;::]

/ Turn HTML labels back to normal text

removeHtml:{_ssr/[x;("<html>";"</html>";"<body>";"<br>";"<p>";"&nbsp;");("";"";"";"\n";"\n";" ")]}
C.label.get:{[v;i].m.set(`set;(`name,dot v;(`index;());(`value;{:[~#x,:"";"";~"<html>"~6#x;x;removeHtml x]}`. v)))}

/ .NET object

kaupd:{[c;v;a;i] /kaupd: This is a .NET version java.k's kaupd function, the code is the same except where noted
  if[~a _in the[c;`public]
	: :[`net~cl v;netAttr[v;a] /.NET modification.  If this is a .NET object, just pass the attribute through, it doesn't need to be in public
	  ()]]
	of[c;a;(v;index[c;v;a;i])];,v}

/ new .NET widget. This is a .NET version java.k's new function, the code is the same other than the commented out lines
newNet:{[c;v;p;l] /newNet: c- v's real class, v-variable; p-v's parent, l-v's layout info
 if[@c;c,:c];if[@p;p,:p];d:c 1;c:*c;m:name.new[d;v;*p] /Add v to the N dictionary
 /The following 2 lines are commented out as they aren't needed for .NET, at least for now
 /s:scrollable v;if[p[1]~_n;p[1]:m];a::[0~att[v;`panel];"_";""]
 /.m.set(`new;(`name,m;`parent,p 1;`class,`$($clname_ c),a;`layout,l;`frame,name.frame v;`glass,~FLUSH;`scrollable,s))
 /wnum m /assume .NET doesn't use the widget number scheme
 m}
C.net.super:`object
C.net.initial:0#`
C.net.terminal:0#`
C.net.public:0#` /`foo`bar /public attributes allowed by .NET object.  We're using the global netAttr handler instead but could add attributes here as well.  See sample foo and bar methods below if we add these back in.
/cons'[`net;`foo`bar;::]; /Not sure if this is needed or why the other objects have it, put in if using foo and bar
C.net.render:() /List the attributes that require .NET to render something.  This causes their methods below to be called when ..j.<attribute> changes
C.net.frame:1 /put .NET objects inside a java.k container
C.net.new: {[v;p;w] /C.net.new v-variable, p-v's parent, w-v's layout info
  if[~in v /Only proceed if this variable hasn't already been created
	c:cl v
	of[c;`New;,v] /Do any .NET specific creation work.
	m:newNet[real c;v;p;:[`~w;w;layout[c;v;w]]] /Do .NET specific java.k creation work instead of normal java.k creation work
	/initial[c;v] /run any .NET initial methods, i.e. methods that should be run before the widget is constructed.  Commented out as there aren't any.
	/end m /assume .NET handles its own construction (cons) call
	/terminal[c;v] /run any .NET terminal methods, i.e. methods that should be run after the widget is constructed.  Commented out as there aren't any.
	]
  of[cl v;`created;,v]}

C.net.valid:{[c;v]1} /.NET object validation. Default to always valid
C.net.renew:{[v;i]0} /.NET object recreation when object is updated.  Return 1 if you want the object to be recreated, return 0 if not.
C.net.get: {[v;i] /C.net.get. Called when the .NET objects's k data gets changed via k programmer. Put code here that updates the .NET gui when this happens.
  `1;}
C.net.set: {[v;i] /C.net.set.  Not sure, should be called when .NET gui changes.  This method should update the k data when this happens
  `1;}
C.net.removeall: {[v] /C.net.removeall. Called when the .NET object is specifically destroyed by .j.d.  If an owning object is destroyed, this will not be called, instead, a zap will be sent directly down to destroy the .NET object.
  `1
  /NOTE: a zap for v will also be sent to the .NET layer after this call completes
}
C.net.New: {[v] /c.net.New: v-variable name.  Put .NET object initialization code here
 `1
}
netAttr: {[v;a] /netAttr: generic .NET attribute handler.  v-variable, a-..j.<attribute> that was added or modified
  `1
}
/C.net.foo: {[v;i] /C.net.foo. Called when the .NET object's ..j dictionary gets changed via k programmer. Put code here that updates the .NET gui when this happens.
/  `1;}
/C.net.bar: {[v;i] /C.net.bar. Called when the .NET object's ..j dictionary gets changed via k programmer. Put code here that updates the .NET gui when this happens.
/  `1;}

