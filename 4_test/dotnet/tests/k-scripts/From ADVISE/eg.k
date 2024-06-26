/ interactive java examples

\l common/java/j
\l common/java/k/color
.j.TRANSLATE:0
\d .k.Class
.f.ld"common/java/eg/classes/k"
\d .k.Tips.a
\l common/java/eg/attributes/tips.k
\d .k.Tips.c
\l common/java/eg/classes/tips.k
\d .k

open:{
 c:split.classes x
 if[~c _in!Class;:.j.ok.w"EG script for ",($c)," not yet defined"]
 o:Class c
 p:.j.C[c;`public]
 p@:<p
 d:`$_dv[.u.lc c;"_"]
 a:Class[~c;`j]
 a.c:c
 if[`l _in p;a.l:c]
 split.panel.split.panel..t::""
 split.panel.split.tab.description::.f.decrypt[6::;"common/java/eg/classes/h/",($d),".htm"]
 split.panel.split.tab.attributes..j.s::_n
 split.panel.split.tab.attributes.attribute::p
 split.panel.split.tab.attributes.value::@[(#p)#`;p?/:!a;:;rep'a[]]
 split.panel.split.tab.attributes..j.rltip.attribute::Tips.a p
 i:&~p _lin .j.C[`gui;`public]
 split.panel.split.tab.attributes..j.bg.attribute::@[(#p)#`n;i;:;`wheat1]
 split.panel.split.tab.data::5:o
 split.panel.split.panel.object..j[`c]:`null
 split.panel.split.panel.object::o
 split.panel.split.panel.object..j::a
 split.panel.split.panel..t::".k.update[]"
 refresh_ _n
}

rep:{`$.u.db _ssr[5:x;"\n";";"]}
exe:{.$x}
att:{i:&~`=y;.+(x i;exe'y i)}

update:{
 split.panel.split.tab.data::5:split.panel.split.panel.object
 a:split.panel.split.panel.object..j
 p:split.panel.split.tab.attributes.attribute
 i:p?/:j:(!a)@&(!a)_lin p
 split.panel.split.tab.attributes[`value;i]:rep'a j
}

refresh_:{split.panel.refresh..j.bg::x}

refresh:{
 o:. split.panel.split.tab.data
 a:att . split.panel.split.tab.attributes[]
 split.panel.split.panel.object..j[`c]:`null
 split.panel.split.panel.object::o
 split.panel.split.panel.object..j::a
 refresh_ _n
}

attribute_description:{}

split.classes:{x@<.u.lc x}.j.Class _dvl .j.Abstract
split.classes..j.e:0
split.classes..j.h:25
split.classes..j.bg:`n
split.classes..j.fg:(-140;)split.classes _lin!Class
split.classes..j.b:`B
split.classes..j.kd:{open@*.j.i}
split.classes..j.tip:`$Tips.c split.classes
split.panel.split.panel.object:_n
split.panel.split.panel..j.border:0
split.panel.split.tab.data:""
split.panel.split.tab.data..j.c:`Text
split.panel.split.tab.data..j.echo:0
split.panel.split.tab.data..j.save:1
split.panel.split.tab.attributes[`attribute`value]:2#,0#`
split.panel.split.tab.attributes..j.b.attribute:`B
split.panel.split.tab.attributes..j.bg.attribute:`n
split.panel.split.tab.attributes..j.e.attribute:0
split.panel.split.tab.attributes..j.h:25
split.panel.split.tab.attributes..j.c:`table
split.panel.split.tab.attributes..j.kd:attribute_description
split.panel.split.tab.attributes..t:".k.refresh_`mediumspringgreen"
split.panel.split.tab.description:""
split.panel.split.tab.description..j.c:`html
split.panel.split.tab..j.a:`data`attributes`description
split.panel.split.tab..j.tab:`data
split.panel.split..j.a:`panel`tab
split.panel.split..j.dir:`v
split.panel.split..j.div:300
split.panel.refresh:refresh
split.panel.refresh..j.fill:`h
split.panel..j.border:0
split..j.dir:`h
split..j.div:300
split..j.xy:1000 900
split..j.l:`EG
split..j.close:{_exit 0}
.j.c`split;

open 0

\

panel.a:!10
a.b.c.d.menu[`one;`two`three`four]:{}
panel..j.with:`a.b.c.d.menu
.j.c`panel

