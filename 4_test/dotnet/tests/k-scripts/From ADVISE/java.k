/ Copyright (c) 2000-2012 Conning Services (Ireland) Limited

/ In general, the argument v is a k path (`k `widgetname) to the widget
/ You'll find most of the class methods inside of .j.C (do a ! on it and start going in from there e.g. .j.C.table.bg is the code that implements the bg attribute for tables
/ Some parts of .j.C get created during initialization using other functions e.g. meta and cons, the others are directly coded on a per object basis (where .C.<etc.> gets assigned a function e.g. C.text.cut

\d .j

/ messages

SET:_n                                                          / application can .j.SET:(), capture messages
.m.set:{:[~SET~_n;.[`;SET;,;,x];.m.ready;set x;.m.stack,:,x]}   / send message to java if ready or append to buffer
.m.get:{:[.m.ready;r:get x;'"java not ready"];if[~@TRACE;trace r];r}                    / receive from java if ready
.m.get_:{while[~.m.ready;.u.sleep[]];get x}                     / receive from java when ready
.m.stack:()                                                     / java message stack
.m.key:68 83 73 68 81 89 65 68 88 85                            / java key
.m[`ready`ready_`async`csync]:0                                 / java handles
JAVA..d:".m`async`csync"                                        / a and b handles
async:{.m.async:_w;ready_[]}                                    / capture a handle, test for java ready
csync:{.m.csync:_w;ready_[]}                                    / capture b handle, test for java ready

/ execute when java is ready

java:{}
Java:{[f]:[~.m.ready;java,:f;@f;f[];f@\:_n]}

/ default screen-size

XY:1280 1024
XY_:8 27
XY_BORDER:10

/ initial font families (will be loaded from java)

FONT_FAMILIES:0#`

/ operating mode

mode:{
 r:.f.getConfigDirectoryUser[]
 :[*t:.[2::;,r,("\\DFA_java_mode.l");:];`normal;t 1]}

/ java is ready

ready:{[x;y;z;w]
 if[~w~PASSWORD;slash[]]                                        / bad password
 XY::x                                                          / java sends screen-size
 FONT_FAMILIES::`${@[x;&x=" ";:;"_"]}'$y                        / java sends font families
 TIP::z                                                         / java sends tip
 TIP..t::".m.set(`tip;,(`value;TIP))"                           / tip trigger
 .m.ready_:1                                                    / indicate ready state
 ready_[]                                                       / test for rest of ready state
}

ready_:{
 if[.m.ready_&&/JAVA
  .m.ready:1                                                    / indicate ready state
  kid[];player[];recorder[];key[];region[];look[];unstack[]     / initialization routines
  profileStop`.j.ready                                          / profile initialization time
  :[@java;java[];java@'_n]]                                     / execute user java-ready function
}

/ initialize routines

unstack:{if[.m.ready;s:.m.stack;.m.stack:();set's]}                     / initialize stack
kid:{set(`kid,,,`value,`$1_,/".",'$.h`T`I)}                             / initialize 'kid' state of java
player:{[]if[PLAYER::_p~.p`Player;set(`player;)]}                       / if the player process is initializing java.k, send java the `player command so it knows this is the player's session
recorder:{RECORDER::_p~.p`Recorder}                                     / recorder?
key:{set(`key,,,`value,`$_ci .m.key)}                                   / initialize 'key'
look:{set(`look,,,`value,,:[1=#b:$a:.p`Look_and_Feel;a,`;`$'b])}        / initialize look-and-feel, region:
region:{set(`region,,,`value,,(,*.r.sdecimal;,*.r.sthousand;,*.r.snegativesign;,*.r.spositivesign;.r.inegnumber))}

/ message processing

MSG:_n                                                                                  / initialize msg global
set:{:[(~FLUSH)|@MSG;set_ x;MSG,:,x]}                                                   / set or append to message-stack
set_:{if[~@TRACE;trace x];work[];status[];.[.m.S;(.m.async;x);:];}                      / possibly trace, but always set
get:{if[~@TRACE;trace x];:[*r:.[.m.G;(.m.async;x);:];'ss"java process error: ",($r 1);r 1]}      / possibly trace, but always get

/ system working object (not used)

WORK:_n
WORK..t:"WORKING::0"
work:{if[~WORK~_n;if[in undot WORK;m:(`set;(`name,WORK;(`index;());(`value;WORKING+:1)));if[~@TRACE;trace m];.[.m.S;(.m.async;m);:]]]}
WORKING:0

/ system status object (not used)

STATUS:_n
status:{if[~STATUS~_n;if[in undot STATUS;m:(`set;(`name,STATUS;(`index;());(`value;. STATUS)));if[~@TRACE;trace m];.[.m.S;(.m.async;m);:]]]}

/ compress message queue, eliminate redundant messages, message-blocks

COMPRESS:1
Set_:{[m]if[COMPRESS;m:cx.r cx.p cx.m[cx.u;cx.m[cx.s;cx.r_ m]]];if[#m;if[b:TRACE_COMPRESS&(_n~TRACE_FILE)&~@TRACE;`0:,"[",$#m];set_'m;if[b;`0:,,"]"]]}
cx.m:{[f;m]g:=v:cx.n'm;g:f'[g;m g];m{x@<x}@,//g}
cx.u:{[g;m]i:&~1=0-':g;,/{|x y?/:?y}'[|:'i _ g;|:'i _ m]}
cx.s:{[g;m]:[~&/`zap`new _lin o:*:'m;g;|{(1+x?z)#y}[|o;|g;`new`zap@</o?/:`zap`new]]}
cx.n:{[m]:[*r:.[.;(m;1 0 1);:];`;r 1]}
cx.r_:{[m]:[#m;.[m;(&`removeall=*:'m;1;0;1);$:];m]}
cx.p:{[m]:[#m;m _di&{(~x=`zap)&y=`removeall}':*:'m;m]}
cx.r:{[m]:[#m;.[m;(&`removeall=*:'m;1;0;1);`$];m]}

/ system error/warning processing

error:{reportToPlayer[java_format_gui_msg[x;y];`error];if[.v.e;java_error[x;y]]}
warning:{reportToPlayer[java_format_gui_msg[x;y];`warning];if[.v.e;java_warning[x;y]]}
info:{reportToPlayer[java_format_gui_msg[x;y];`infoOnly];if[.v.e;java_info[x;y]]}
JAVA_WARNING:""
JAVA_INFO:""
JAVA_ERROR:""
JAVA_ERROR..j.c:`Text
JAVA_ERROR..j.xy:700 700
JAVA_ERROR..j.e:0
JAVA_ERROR..j.close:{d`.j.JAVA_ERROR;JAVA_ERROR::""}
java_console:{\(`error;x);`0:$y;.w.raise_console[0]}
java_error:{:[@TRACE;java_error_show[x;y];display"ERROR:",_ssr[5:x;"\n";";"],":",_ssr[_ssr[$y;"\r\n";";"];"\t";" "]]}
/Note: info and  warnings are only reported on the application's console, and in their respective global variables .j.JAVA_INFO or .j.JAVA_WARNING.  They are not displayed to the user.
java_warning:{:[@TRACE;do[1;JAVA_WARNING,: msg: java_format_gui_msg[x;y];`0: ,msg];display"WARNING:",_ssr[5:x;"\n";";"],":",_ssr[_ssr[$y;"\r\n";";"];"\t";" "]]}
java_info:{:[@TRACE;do[1;JAVA_INFO,: msg: java_format_gui_msg[x;y];`0: ,msg];display"INFO:",_ssr[5:x;"\n";";"],":",_ssr[_ssr[$y;"\r\n";";"];"\t";" "]]}
java_error_show:{ /java_error_show
  /Add session information to the window title of the java error dialog
  JAVA_ERROR..j.l:: "GUI Errors for session: ",5:.h`T`I
  JAVA_ERROR,:java_format_gui_msg[x;y]
  cf`.j.JAVA_ERROR
  }
java_format_gui_msg:{"\n",(java_truncate@5:x),"\n",(80#"-"),"\n",($y),"\n",80#"="}
JAVA_TRUNCATE:500
java_truncate:{(JAVA_TRUNCATE&#x)#x}

/ system profiling

if[~`Profile _in ~!.j;Profile:0]
profileKey:{`$_ssr[$x;".";"d"]}
profileStart:{profileT[profileKey x]:,_T}
profileStopwatch:{profileT[profileKey x],:_T}
profileStop:{profileStopwatch x;if[Profile;profileDisplay x]}
profileTimes:{t:profileT[profileKey x];86400*:[2<#t;((*|t)-*t);()],-':t}
profileDisplay:{display(`profile;x),profileTimes x}

/ system trace processing - See java.dfk for documentation on how to use TRACE

TRACE:_n
TRACE..t:"if[0<4:TRACE;if[~_n~TRACE;TRACE,:]]"
TRACE_CHARS:_n
TRACE_VALUE:_n
TRACE_FILE:_n
TRACE_COMPRESS:0

jtrace:{if[~@TRACE;trace x]}                         / trace entry-point

trace:{[s]                                            / trace function
 if[~TRACE~_n                                         / if tracing on
  if[TRACE_VALUE~0;if[1<#s;s[1;1_!#s 1;1]:_n]]        /if trace-value is 0, null out message value so it doesn't display
  if[TRACE~();display s;:_n]                          / if trace-all, display everything and exit
  n::[1=#s;;(~_n~s 1)&(2<#s[1]);s[1;0;1]]             / else get name
  m::[`set~*s                                         / and get message type
      :[3=#s[1];s[1;2;0];2=#s[1];s[1;1;0];`"Message Type Unknown"]
      *s]
  i:0;do[#TRACE;t:TRACE i                             / loop over TRACE constraints
   if[1=#t;if[(t~`)|((,/$n)_sm ($t)); display s; :_n]]                   / 1 element constraint
   if[2=#t;if[((`~*t)|((,/$n)_sm ($*t)))&(`~t 1)|m~t 1; display s; :_n]]  / 2 element constraint
   i+:1]]                                             / continue
}

/ display trace value

display:{{:[_n~TRACE_FILE;`0:;{.f.append6[TRACE_FILE;(*x),"\n"]}]x}@,($#_bd x),": ",blank{:[_n~TRACE_CHARS;x;((#x)&(TRACE_CHARS+1))#x]}@5:x}
blank:{_ssr/[x;|"\n",'(1+!10)#\:"";";"]}

/ names
/ v     variable
/ p     parent
/ c     class
/ s     shape that the actual java widget has (takes into account k widget visibility attributes that use a fake arrangement ie missing columns or rows)
/ S     Shape that the k widget has (takes into account the k widget arrangement attribute)
/ R     Rshape
/ C     Cshape
/ D     Displayed?
/ W     Widget ID
/ X     dialog options
/ V     Virtual?

N:.+(`v`p`c`s`S`R`C`D`W`X`V;(();();0#`;();();();();();!0;();!0))
NAME:-1

/ name functions

name.vars:{N.v@&~star'N.v}                                                                                        / real variables
name.nums:{dot'N.v@&star'N.v}                                                                                     / virtual variables
name.i:{if[x~_n;:`"*"];v:`"*",x;while[v _in N.v;v:`"*",v];v}                                                         / construct virtual variable
name.chk:{if[~star x;:x];JUNK::x;c:cl`j`JUNK;r:.[`$($_d),".",($c),$NAME+:1;();:;x];JUNK::_n;r}                          / check valid class
name.new:{n:dot y;N[]::N[],'(,y;,:[_n~z;n;z];x;name.Set[x;y;`shape;()];name.Set[x;y;`Shape;_n];;;;-1;;0);n}       / add new variable
name.Set:{[x;y;z;w],:[star y;w;of[x;z;,y]]}                                                                             / amend variable state
name.var:{undot x}                                                                                                      / variable vector
name.zap:{N[]:N[]_di\:N.v?/:name.var'x}                                                                        / zap variable

isObjectAvailable: {[objName] /isObjectAvailable: returns 1 if object with symbol name ojbName exists, 0 otherwise
  ~(#N.v) = N.v ? name.var[objName]}

/ get functions

name.s:{N.s N.v?x}                                / get shape of variable
name.rank:#name.s@                                / get rank of variable
name.c:{(N.c,`)N.v?x}                             / get class of variable or `
name.S:{N.S N.v?x}                                / get Shape of variable
name.R:{N.R N.v?x}                                / get Reshape of variable
name.C:{N.C N.v?x}                                / get Cshape of variable
name.D:{N.D N.v?x}                                / get is variable displayed?
name.W:{N.W N.v?x}                                / get widget id of variable
name.X:{N.X N.v?x}                                / get dialog options
name.V:{N.V N.v?x}                                / is variable virtual?

/ set functions (inverse of get functions)

name.setS:{N.S[N.v?x]:y}
name.setR:{N.R[N.v?x]:y}
name.setC:{N.C[N.v?x]:y}
name.setD:{N.D[N.v?x]:y}
name.setW:{N.W[N.v?x]:y}
name.setX:{N.X[N.v?x]:y}
name.setV:{N.V[N.v?x]:y}

/ misc name functions

name.reshape:{N.s[N.v?x]:of[name.c x;`shape;,x]}                                  / new shape
name.reShape:{N.S[N.v?x]:of[name.c x;`Shape;,x]}                                  / new Shape
name.parent:{:[x~name.root x;`;N.p N.v?x]}                                        / parent
name.child:{:[#i:(&N.p=x)_dv x;x,,/_f'dot'N.v[i]_dv name.var x;(),x]}             / child

/ root, frame, top, with

name.root:{:[~x _in N.v;name.root_ x;star N.p N.v?x;x;name.root_ x]}
name.root_:{name.root__ N.v@&N.v{:[@x;0;(#x)>#y;0;x~k:(#x)#y;1;x~ad k]}\:x}
name.root__:{:[~#x;`;(x,,*|x)(star'N.p N.v?/:x@:>#:'x)?1]}
name.frame:{:[`~x;x;{:[x=N.p i:N.v?name.var x;x;_f N.p i]}dot x]}
name.top:{while[star x;i:&N.p=dot x;:[#v:N.v[i]_dv x;x:*v;:()]];x}
name.frames:{dot'N.v@&N.c _lin FRAMES}
name.with:{:[~x _in N.v;`;#r:undot@*name.child[name.frame x]_dvl dot[x],name.nums[];r;`]}
FRAMES:`frame`modalframe`nakedframe
frame:{[v](dot;name.frame)[v~name.root v]v}
pframe:{[v;p]:[~`~r:name.root v;name.frame r;`~r:name.parent name.var p;name.frame p;r]}

/ is x a java variable?

in:{x _in N.v}

/ extended shape, take, count, enum, depth, raze, each

shape:{s:!0;i:0;while[(i=#s)&~|/,//into[i;{(@x)&~5=4:x}]x;if[1=#c:?(),i,//into[i;count]x;s,:c];i+:1];s}
bang:{@[shape x;_n;{:[1=4:x;!x;x]}]}
atomic:{(@x)&~5=4:x}
mat:{:[&/0>t:4::'x;1;|/t>0;0;&/,//atomic''x@&~t]}
symbol:{:[x~_n;x;5=t:4:x;@[x;_n;_f];t _in-4 4;x;`$$x]}
into:{x{each[x]}/y}
each:{:[5=4:y;x'y[];x'y]}
drop:{:[1=4:x;x _ y;(y?x)_ y]}
take:{:[-1=4:x;x y;x x?/:y]}
count:{:[5=4:x;,!x;#x]}
enum:{.u.cross bang x}
depth:{:[~5=4:y;x;|/_f[x+1]'y[]]}
raze:{:[~_n~x;(),x]}

/ misc k

hmat:{:[@x;,,x;4:x;,x;lmat x]}                  / horizontal matrix
vmat:{:[@x;,,x;4:x;+,x;lmat x]}                 / vertical matrix
lmat:{:[2=#^x;x;@[x;&@:'x;(|/#:'x)#]]}          / label matrix
null:{x _in(.();)}                              / null predicate
empty:{(x~_n)|~#x}                              / empty predicate
uc:{_ci(-32*(n>96)&n<123)+n:_ic$x}              / upper-case
num:{&/($x)_lin".0123456789"}                   / numeric predicate
Num:{&/($x)_lin"-.0123456789"}                  / extended numeric predicate
star:{"*"~*$*x}                                 / virtual predicate (any predicate that has an "*" as its first character)
vat:{x[i#y],((#y)-i:y _bin#x)#_n}               / variable-at
at1:{[d;i]:[~#i;();*r:.[d;(;i);:];();r 1]}      / at variant
						/ d: dictionary or matrix; i: indices to return from each item in d
						/ returns () if i is empty, or if it would produce an index error
						/ otherwise, returns d[;i]
sym:`$$:                                        / force symbol
kv:{~*.[.:;x;:]}                                / executable

/ general clipboard read/write

cb.r:{:[`k _in f:.w.cbformats[];.w.cbread`k;|/`Csv`CSV _lin f;csv.r[];`text _in f;:[#r:csv.ms .w.cbr.csv[];r;csv.rt[]]]} /cb.r: returns data fro the clipboard using the following precedence: k data, csv data, if there is text data, then try to convert the text into csv, if that doesn't work return the text data
cb.w:{.w.cbwrite[`k`Csv`text;(x;csv.sm x;csv.tk x)]}

/ simulate multiple-inheritance

Meta:(`super`child`abstract`class;`render`public`initial`required`terminal)     / meta-class methods
subcl1:{[d;c]Class@&d[Class;`super]_lin(),c}                                    / subclasses of
subcl:{[d;c]Class@&|/'((),/:d[Class;`super])_lin\:(),c}                         / subclasses of

/ superclass method -> subclass

catenate:{[d;s;v;c]
 .[d;c,s;(:;?,)fundef[s;d;c];v]
 _f[d;s;d . c,s]'subcl[d;c]
}

/ superclass method overrides subclass

override:{[d;s;v;t;c]
 i:&~funsdef[s;d;c];.[d;(c;s i);:;v i];.[d;(c;~s i;`index);:;t i]
 s:(!d c)_dvl,/Meta;_f[d;s;d[c;s];d[c;~s;`index]]'subcl[d;c]
}

/ are functions defined for class?

fundef:{[s;d;c](s _in!d c)&~_n~d[c;s]}
funsdef:{[s;d;c](s _lin!d c)&~_n~'d[c;s]}

/ .j.C -> graph of multiple inheriting subclasses

hierarchy:{
 d:`.j.C;e:`.j.C.object
 Class::{x@<x}@!d                                       / all the classes
 Container::,/subcl[d]\`container                       / all the containers
 c:subcl[d;`object];{catenate[d;x;e x]'c}'Meta 1        / inherit through the hierarchy
 s:(!e)_dvl,/Meta;override[d;s;e s;e[~s;`index]]'c      / override through the hierarchy
 Abstract::Class@&1~'d[Class;`abstract]                 / all the abstract classes
}

/ classification

Types:`scalar`string`text`vector`matrix`slot`button`table`cross`tree    / strongest -> weakest class-filter
data:{&/_n~/:?x[.;`j;`c]}                                               / are variables in dictionary all data?

/determine class of variable

cl:{[v] /for a widget at k path v, return its class
 if[~_n~c:att[v;`c];:vcl[v;c]]                          / if class explicitly defined, then validate and return the class with vcl
 if[(c:*-1#v)_in!`.j.C;if[icl[v;c];:c]]                 / if eponymous variable (the name of the variable is the name of a class), then if icl, then class
 if[(c:clname c)_in!`.j.C;if[icl[v;c];:c]]              / if semi-eponymous variable, then if icl, then class
 i:0;do[#Types;if[icl[v;c:Types i];:c];i+:1];`map}      / iterate through Types, trying to validate, else make it a map

clname:{`$_ci _ic[lc@$x]_dvl 95,48+!10}
clname_:{`$lc[$x]_dv"_"}
lc:{_ci(32*(n>64)&n<91)+n:_ic x}

pcl:{:[in -1_ x;(Container,`window)Container?name.c -1_ x;`window]}
vcl:{[v;c]:[c _in Abstract;'"abstract class: ",$c;of[c;`valid;(c;v)];c;'"invalid class: ",($dot v), " can't be ",$c]} /validate and return an object v class c
icl:{[v;c]:[c _in Abstract;0;of[c;`valid;(c;v)]]}

super:{[c]s:0#`;while[~` _in c,();s,:c:,/`.j.C[c;`super]];?s _dv`}
sub:{[c]c,:();while[#s:((!`.j.C)@&c{|/x _lin(),y}/:`.j.C[;`super])_dvl c;c,:s];c}
dialog:{[c]`dialog _in super c}

/ trigger processing

jktrigger:{(p,_n)(jk'p:|chain x)?1}                             / get triggers along chain
chain:{du'(1+!#x)#\:x}                                          / name chain
du:{:["."~*|*|$x;x;ad x]}                                       / extended ~:
jk:{gt[x]_in(jt;kt)}                                            / is trigger a k/java trigger?
gt:{`. x,`t}                                                    / get trigger
kt:".j.k[];.j.flush[];"                                         / k trigger
jt:".j.k[];"                                                    / java trigger
jtrigger:{[v]jt~`. ad[name.root v],`t}                          / java trigger predicate
tr:{[v;t]if[~ao v;.[`;ad[v],`t;:;t];.[`;ad[jd v],`t;:;t]]}      / install trigger
ao:{[v]|/{(x=`j)&"."=*-1#$y}':v}                                / find java dictionary
ad:{@[x;-1+#x,:();~:]}                                          / attribute dictionary (v..)
jd:{ad[x],`j}                                                   / return x's java dictionary (v..j)
dj:{STACK::STACK _dv(x;())}                                     / delete from stack
no_t:{x@&~"..t"~/:-3#'$dot'x[;0]}                               / ignore trigger attributes added to tree
k:{if[#v:var[_v;_i];if[#v:no_t v;STACK,:v@&~v[;0]_lin STACK_]]} / append vars to stack
STACK:STACK_:()                                                 / initialize stacks
ak:{STACK_,:,x}                                                 / append to auxilliary stack
dk:{STACK_::STACK_ _dv x}                                       / delete from auxilliary stack

st:{[v;a;d]if[b:~`~r:name.root v;t:.[`;ad[r],`t];tr[r;_n]];.[`;jd[v],a;:;d];if[b;tr[r;t]]}

/ variable processing (figure out which variable below trigger receives the event)

var:{,/vc .'vt .',/vs .'vv vn dotted[x],y}                      / variables triggered
vn:{(-+/&\|x~'_n)_ x}                                           / variable name

vv:{
 i:0;r:1 1#`;do[#x
  :[-4=4:v:x i          ;r:,/r,\:/:v
    v~_n                ;r:,/{,/r,\:/::[5=4:x;!x;!#x]}'(),`. i#x
    v~(.)               ;r:r,'+,(~!`.)'1_'r
                         r:r,\::[@v;v;,v]];i+:1]
 vi',/(.u.cross 1_)'r}

vi:{:[(#x)=i:(4=_abs 4::'x)?0;(x;());(0,i)_ x]}
vt:{:[i:(~|&\~|{:[~4=4:x;0;|/in'x,~x]}'(1_!1+#x)#\:x)?0;(i#x;(i _ x),y);(x;y)]}
vs:{:["."=*-1#$*-1#x;{(x;())}'x,/:!dot x;,(x;y)]}
vc:{:[~in x;,(x;y);~(c:cl x)_in Container;,(x;y);(~#y)&~#s:*of[c;`shape;,x];,(x;y);vd[x;y;vr[x;y;s]]]}
vd:{:[1~att[x;`renew];,(x;y);()],z}
vr:{,/vc .' :[_n~*y;x,/:z;x,/:z@&z _lin(),*y]{(x;y)}\:1_ y}

/ java calls these functions

FLUSH:1
jsetc:{[n;i;d]if[~_n~n:widget[`jsetc;n;i;d];FLUSH::0;jglass[1]'name.frames[];res:jset[`jsetc;n;iconv i;d];jglass[0]'name.frames[];FLUSH::1];res}
jsetb:{[n;i;d]if[~_n~n:widget[`jsetb;n;i;d];res:jset[`jsetb;n;iconv i;d]];res}
jsetj:{[n;i;d]if[~_n~n:widget[`jsetj;n;i;d];res:jset[`jsetj;n;iconv i;d]];res}

/ make sure we don't run out of widgets

WIDGET:-1
WIDGET..t:"if[0>WIDGET;outofwidgets[]]"
outofwidgets:{.w.message[`warning;`ok;ss'("Session running low on widgets.";"Save your work and restart soon ...");ss"Warning!"]}
widget:{[m;n;i;d] /widget: check for valid widget number
  :[2=#n;n /if this message does not contain a widget number, just pass it on
  n[2]_in N.W;2#n /else check for widget number being listed in N.W, if so, pass on just the message, else output error message and skip processing of the java message
  trace(`$"*** Ignoring the following message from java because Widget number ",($n[2])," is missing in N.W.:\n",$m;(2#n;i;d))]} /use this line to output only during trace
  /`0: $"*** Ignoring the following message from java because Widget number ",($n[2])," is missing in N.W.:\n",($m),(5:(2#n;i;d)),"\n"]} /use this line to output to console

/ glass one or all windows, set/unset busy cursor

jglass:{[d;v].m.set(`set;(`name,v;(`index;());(`glass;d)))}
jbusy:{[b;v].m.set(`set;(`name,v;(`index;());`busy,b))}

/ global java trigger

t:{}

/ autotesting

isautotestcomplete:{*.m.get_[(`isautotestcomplete;,`$1_,/".",'$x)]1}
autotestcomplete:{if[x _lin 0 1;set(`autotestcomplete,,,`value,x)]}

/ play .dfz

play:{`0: ,"java.k sending GUI play command...";.m.set(`play;(`$1_,/".",'$x;(*y;1_ y)))}

/ record .dfz

record:{
 if[(~RECORDER)&MODE=`record
  if[~`jsetj=*x
   if[~`j`ROOT~-2#undot x[1;1]
    .m.S[`localhost,.p`Recorder;(`record;(.h`T`I;x))]]]]
}


replay:{ / replay
 /If this isn't the player's session i.e. it's one of the application sessions, and we're in play mode, send all the current java
 /information to the player
 if[(~PLAYER~1)&MODE=`play
  .m.S_[`localhost,.p`Player;(`replay;(.w.getpid[];.h`T`I;dot'N.v))]]
}

reportToPlayer:{[msg;level] /reportToPlayer
 /If this isn't the Player's session i.e. it's one of the application sessions, and we're in play mode, send message msg
 /to the Player so it can be output in the test automation results.  If level `error, message will be treated as an error.
 /Any other value will be treated as a warning.
 if[(~PLAYER~1)&MODE=`play
  .m.S_[`localhost,.p`Player;(:[level~`error; `guiError; level~`warning; `guiWarning; `guiInfo];(.h`T`I;msg))]]
}


/ called by jset functions:  process java event

jset:{[m;n;i;d]
 record(m;n;i;d)                                                / record incoming event
 n[1]:undash n 1                                                / convert to canonical k name
 if[~@TRACE;trace(m;(n;i;d))]                                   / possibly process trace
 if[d~(`z;1)
  profileStop n 1]
 t:name.top name.var n 1                                        / get the top of the widget
 if[~`~c:name.c t                                               / if it has a class
  if[~`~r:name.root t                                           / and if it has a root
   VAR::t                                                       / make it global
   CMD::(m;n;i;d)                                               / publish the command being processed
   if[~m=`jsetc;tr[r;jt]]                                       / if not jsetc, install the java trigger
   res:of[c;:[(*d)_in`value`tvalue;`set;*d];(t;i 1;d 1)]        / process the event (special cases: value, tvalue = assign)
   flush[]                                                      / flush the stack
   if[~m=`jsetc;if[in r;tr[r;kt]]]                              / if not jsetc, if r is on the screen, install the k trigger
   .j.t[]                                                       / fire the global java trigger
   CMD::VAR::_n]]                                               / null out the globals
 replay[]                                                       / replay recording
 res}                                                           / return the result

/ undash utility: convert to canonical k name

undash:{`$,/".",'{("_"=*x)_ x}'$undot x}

/ flush the message stack

flush:{.u.exec[flush_;_n]}                                                      / flush under trapped execution

flush_:{
 if[FLUSH&@MSG;MSG::()]                                                         / MSG is a list
 if[~@STACK;validate[];if[#STACK?:;f:flush__[];repaint'f;jiggle'f;STACK::()]]   / send messages, repaint, "jiggle" the window
 if[FLUSH&~@MSG;MSG::Set_ MSG]                                                  / compress MSG stack
}

/ 'validation' means that we move up the variable, flushing new content out to the screen

validate:{{if[`d _in{:[*r:.[!:;x;:];();r 1]}a:~w:dot x;. w;. a]}'N.v@&~star'N.v;}
flush__:{(?(name.frame name.root@)'?,/kset .'STACK)_dv`}

/ v and i are analogous to _v and _i

kset:{[v;i]
 r:();j:k:l:0;f:root v;while[~(#v)<#f
  if[~k;w:va v;a:w 1;w:ad w 0;if[(`j=*a)&in w;r,:,/kaupd[name.c w;w;;(2_ a),i]' :[1<#a;,a 1;!dot jd w];k:1]]
  if[~j;if[:[#i;~"."_in,//$i;1]&in v;c:name.c v;if[~k&dialog c;r,:kdupd[c;v;ni[c;v;i];l];j:1]]]
  if[j&k;:r];i:(*-1#v),i;if["."=*-1#$*i;i:()];v:-1_ v;l:1];r}

root:{[v]v~name.root v}
ni:{[c;v;i]:[~0~the[c;`depth];i;(#i)<r:#name.s v;r#i,r#_n;i]}
va:{(0,:[#w:&"."_in'd;1+*-1#w;#d])_`$d:$x}
kdupd:{[c;v;i;l]:[1~of[c;`renew;(v;i)];renew[v;()];~c _in Container;keupd[c;v;i];~l;kcupd[c;v]];,v}
keupd:{[c;v;i]render[c;v;of[c;`some;(v;i)];`get;()]}
kaupd:{[c;v;a;i]if[~a _in the[c;`public];:()];of[c;a;(v;index[c;v;a;i])];,v}
kcupd:{[c;v]krupd'v,/:d:,/name.s v}
krupd:{[v]renew[v;()];,v}

/ label attributes

att_l:{[v]:[7=4:l:att[v;`l];ji[`l;{y;l[]};(v;);v;_n];l]}

/ new widget

new:{[c;v;p;l] /new: c- v's real class, v-variable; p-v's parent, l-v's layout info
 if[@c;c,:c];if[@p;p,:p];d:c 1;c:*c;m:name.new[d;v;*p];s:scrollable v;if[p[1]~_n;p[1]:m];a::[0~att[v;`panel];"_";""]
 .m.set(`new;(`name,m;`parent,p 1;`class,`$($clname_ c),a;`layout,l;`frame,name.frame v;`glass,~FLUSH;`scrollable,s))
 wnum m
 m}

/ is widget scrollable?
/ If virtual widget (i.e. one whose name starts with a *, then always scrollable, else if no scrollable attribute, then scrollable, else the value of the scrollable attribute
scrollable:{[v]:[star v;1;_n~s:att[v;`scrollable];1;s]}

/ destroy and recreate

renew:{[v;i]
 q:undot p::[~cl[v]_in With;name.parent v;star p:N.p N.v?v;`;p]
 d dot v
 if[~`=p;if[~cl[q]_in Container;:_f[q;()]]]
 if[`=p;:c dot v]
 of[cl v;`new;(v;p;of[pcl v;`arrange;,q][*-1#v])]
 jiggle p
}

/ generate a widget number for variable

wnum:{[v].m.set(`set;(`name,v;(`index;());(`wnum;WIDGET+:1)));name.setW[name.var v;WIDGET]}

/ send a 'cons' message when we want java to construct the widget

end:{[v].m.set(`cons;,`name,v)}

/ send a 'jiggle' message when we want java to refresh

jiggle:{[v]if[in name.var v;.m.set(`set;(`name,v;(`index;());(`jiggle;)))]}

/ send a 'repaint' message when we want java to repaint

repaint:{[v]if[in name.var v;.m.set(`repaint;,`name,v)]}

/ initiate construction of widget

initial:{[c;v]
 /Create initMethods, a list of the methods to be run to initialize the object with k path v of class c as follows:
 /1: create an array of 3 lists that together make up all the available methods for the widget after factoring in method inheritance.  The 3 lists will be the initial, public, and required methods, in that order.
 availMethods: c the'`initial`public`required
 /2: get a list of any initialization methods that the programmer specified when the object was coded.  This is how a programmer overrides the object's initialization defaults
 defaultOverrideMethods: (availMethods[0]@&availMethods[0] _lin!`. jd v)
 /3: remove all the public methods from the initial methods, so we have a list of any private initialization methods that must always be run (otherwise they wouldn't be private)
 privateInitMethods: availMethods[0] _dvl availMethods[1]
 /The initialization list needs to be all the private init methods, the default override methods, and the required methods, in the correct order.
 /Since the methods will be sent to java in the order they are listed, we need to  order the methods such that any initial methods are listed in
 /the same order they are listed in `initial. This insures that the object being created can control the order of the methods it uses to initialize itself
 /e.g. the chooser object should send `get as the last initial method as the java implementation of get relies on the values that can be set by other initial methods such as filetype
 /Note: z (`required methods) may or may not contain methods from the `initial list, so it must be added in twice in order to insure correct ordering, uniqueing will take out any duplicate entries
 initMethods: {?(x@&x _lin defaultOverrideMethods,privateInitMethods,z),z}. availMethods

 /The following is DEBUG code to help figure out object initialization issues now that we've changed how the order in which methods are called is determined
 /When a java error box pops up, look for the method call at the top that had the problem.  It'll probably have a null point exception.
 /if[~c~`chooser;initMethods:{?_dvl[x;y],(x@&x _lin!`. jd v),z}. availMethods] /uncomment out this line to see what the original order was, which should work and show you what methods need to be called before the one that failed
 /Uncomment out the block below so the list of methods, in the order they are called is display.  Run once without the original line above, and once with.  One of the method calls in the original
 /method list, that is ahead of the method that is causing the exception, needs to be called ahead of that problem method in the new order
/ if[`rsel _in initMethods
/   .f.append6[TRACE_FILE;(5: initMethods),"\n"]
/	`0: 5: initMethods
/	`0: "\n"
/ 	`0: 5: N.v
/	`0: "\n"
/ 	`0: 5: (c;v)
/ 	`0: "\n\n"
/  ]
 if[|/a:c all'initMethods;e:of[c;`all;(v;())]] /If any of the methods uses all the indicies of object v of class c, initialize e with all the indicies of v
 a{of[c;y;(v;:[x;e;()])]}'initMethods /execute each method for class c in initMethod on object v with v's indices being e where a was 1, else using () for v's indices

 render[c;v;e;();initMethods]

}

/ terminate construction of widget, apply global font setting after widget is fully created

terminal:{[c;v]{of[c;x;(v;())]}'the[c;`terminal];refont v;}

/ apply global font-setting (if defined)

refont:{[v]if[~_n~Font;Font_.set@,v]}

/ refresh window

refresh:{[v;i]c:name.c v;render[c;v;of[c;`all;(v;i)];`get;()]}
render:{[c;v;i;a;b]{of[c;x;(v;:[all[c;x];i;()])]}'?(a,{x@&x _lin the[c;`render]}@!`. jd v)_dvl b}
all:{[c;s](s=`get)|`.j.C[c;~s;`index]~`all} /all: for method s of class c, returns 1 if s=`get or if the method has an `index attribute whose value is `all else returns 0
index:{[c;v;s;i]:[all[c;s];of[c;`all;(v;i)];i]}

/ symbol utilities

dot:`$,/".",'$(),                                               / a b c -> .a.b.c
undot:{`${@[x;&x="~";:;"."]}'1_'(&d=".")_ d:_ssr[$x;"..";"~."]} / .a.b.c -> a b c
dotted:{:[~` _in d:undot x;d;@[d _di i;-1+i:d?`;~:]]}           / process dotted symbol
dir:{:["."=*d:$x;x;`$($_d),".",d]}                              / fully qualified symbol (`v -> `.x.y.z.v)
wdir:{undot@:["."=*d:$y;y;`$($dot -1_ name.root x),".",d]}      / f.q.s. of root variable

/ call-trace

CALL:_n /set to () to see a call trace in the console.  set to a list of method names to store the call info in CALL_STACK?
CALL_ZERO:1
CALL_STACK:()
call:{[c;s;a]if[:[CALL~_n;0;~#CALL;1;s _in(),CALL];CALL_STACK,:,(_T;c;s;a)]}
uncall:{if[#CALL_STACK;a:*|CALL_STACK;call_ a;CALL_STACK::-1_ CALL_STACK]}
call_:{[a]if[CALL_ZERO|~&/" "=t:({:[x~7.3$0;7#" ";x]}7.3$100000*_T-*a);`0:,t,":",($a 1),,/".",'$CALL_STACK[;2]]}

/ events

EVENTS:,/(`lk`lkl`lkr`lkk`lkkm`lkkr`lkd`lkmd`lkrd`lku`lkmu`lkru
          `clk`clkl`clkr`clkk`clkkm`clkkr`clkd`clkmd`clkrd`clku`clkmu`clkru
          `rlk`rlkl`rlkr`rlkk`rlkkm`rlkkr`rlkd`rlkmd`rlkrd`rlku`rlkmu`rlkru
          `alk`alkl`alkr`alkk`alkkm`alkkr`alkd`alkmd`alkrd`alku`alkmu`alkru
          `rclk`rclkl`rclkr`rclkk`rclkkm`rclkkr`rclkd`rclkmd`rclkrd`rclku`rclkmu`rclkru
          `k`kd`ku`kl`kld`klu`kr`krd`kru
          `kk`kkm`kkr
          `f1`f2`f3`f4`f5`f6`f7`f8`f9`f10`f11`f12
          `z
          `close`cancel
          `singleselect`multiselect`singleselecthint`multiselecthint
          `opened`closed
          `Set)

/ variable utilities

of:{[c;s;a]call[c;s;a];r::[~_n~o:the[c;s];o . a];uncall[];r}    / for class c run method s on arguments a
the:{[c;s]`.j.C . c,s}                                          / return method s of class c
att:{[v;a]:[@v;_n;~star v;dot[jd v]a]}                          / value of attribute a of variable v
attrpath:{[v] (-1_ v),~-1#v}                                    / make attribute path e.g. put a dot after the last term of the path

/ run update attribute (a:b -> a:a..j.u[a;b])

upd_:{[v;i]:[_n~u:att[v;`u];:;(4:u)_in 4 7;u;_n~i;u;do[1;j:0;do[#i:(),i;u:u i j;if[_n~u;:(:)];if[(4:u)_in 4 7;:u];j+:1];:u]]}
/n.b. upd_ is the old upd except that in the two instances where it returned the assignment function : it now returns the function that always returns a null {}

upd:{[v;i]{:[4:e:x[y;z];e;#*e;do[1;.j.e .l.ss@*e;:e 1];e 1]}[upd_[v;i]]}

/ so upd works as before, it creates and returns function that applies the function retrieved by upd_ (projected in as x) to the new data z and if it gets a _n it returns the new z otherwise it signals the error and then returns the old y.

/ ping-pong

PING:.1
T:()
ping:{T,:,x;.t..t:".j.pong[]";."\\t ",$PING;}
pong:{t:T;T::();.:'t;.t..t::_n;."\\t 0";}

/ entry points (see common/java/dfk/java.dfk for documentation)

exists:{[v]in undot dir v}
class:{[v]:[~in v:undot r:dir name.chk v;cl v;`~c:name.c v;cl v;c]}
classd:{[d]JUNK::d;c:cl`j`JUNK;JUNK::_n;c}
dataclass:{[v]class[:[@v;v;dot v]]_in sub`data}
clear:{(.j.d dot@)'name.vars[];}
p:{[v;s]if[f:"_"=*w:$v;v:`$1_ w];.m.set(`print;(`name,:[f;frame undot dir v;dir v];(`scale;1.*s)))}
pf:{[v]if[f:"_"=*w:$v;v:`$1_ w];.m.set`format,,,`name,:[f;frame undot dir v;dir v]}
cw:{[v;w]if[in s:undot dir name.chk w;if[~in undot r:dir name.chk v;cw_[s;r]]]}
cw_:{[v;w]c:cl d:wdir[v;w];with_new[v;();d;c];with_top d}
c:{[v]r:dir name.chk v;profileStart r;if[~in v:undot r;tr[v;kt];c:cl v;:[~0~the[c;`frame];c_[v;c];of[c;`new;(v;r;`)]];profileStopwatch r;:r]}
c_:{[v;c]newl[];defl[];C.frame.new[v;_n;_n];of[c;`v;(v;())]}
d:{[v]if[in v:undot dir v;if[v~name.root v;tr[v;_n]];r_a v;name.zap@:[cl[v]_in With;d_a;d_w][v];gc[] /destroy widget
  /Special handling of modal panels, which don't have parents and can't use the `with attribute to specify them as this wasn't implemented
  if[~_n~p:att[v;`on] /if the widget being destroyed has an `on attribute
    if[(`panel~cl v) & {:[6=4:x;0;x]}@att[v;`modal] /and it's a modal panel
      /Assume the `on attribute specifies the window that should be given the focus when the modal panel is destroyed
      front p
      ]
    ]
  :r]}
r_a:{[v]of[cl v;`removeall;,v]}
z:{[v]if[in v:undot dir v;.[`;jd[v],`c;::]]}
d_a:{[v]c:cl v;.m.set`zap,,,`name,n:dot v;of[c;`destroyed;,undot n];,n}
d_w:{[v]{v:undot x;.m.set`zap,,,`name,x;if[kv[v]&v _in N.v;of[cl v;`destroyed;,v]]}'|n:name.child frame v;n}
GC:0;gc:{if[GC;.m.set(`gc,,,`name`)]}
dc:{[v]d v;c v}
view:{[b;v]if[in v:undot r:dir v;.[dot jd v;`v;:;b];:r]}
s:view[1]
h:view[0]
a:{[v]:[in v:undot dir v;of[cl v;`ask;,v]]}
image:{[v]:[_n~r:gif v;(`jpg;jpg v);(`gif;r)]}
Text:{[v]if[in undot v:dir v;:**|.m.get(`text;,`name,v)]}
text:{[v]if[in undot v:dir v;.m.set(`set;(`name,v;(`index;());(`atext;)))]}
jpg:{[v]if[f:"_"=*w:$v;v:`$1_ w];:[in s:undot r:dir v;**|.m.get(`jpg;,`name,:[f;frame s;r])]}
gif:{[v]if[f:"_"=*w:$v;v:`$1_ w];:[in s:undot r:dir v;**|.m.get(`gif;,`name,:[f;frame s;r])]}
png:{[v]if[f:"_"=*w:$v;v:`$1_ w];:[in s:undot r:dir v;**|.m.get(`png;,`name,:[f;frame s;r])]}
pixels:{[v]if[f:"_"=*w:$v;v:`$1_ w];:[in s:undot r:dir v;**|.m.get(`pixels;,`name,:[f;frame s;r])]}
lineart:{[v]if[f:"_"=*w:$v;v:`$1_ w];:[in s:undot r:dir v;**|.m.get(`lineart;,`name,:[f;frame s;r])]}
pdf:{[v]if[f:"_"=*w:$v;v:`$1_ w];:[in s:undot r:dir v;**|.m.get(`pdf;,`name,:[f;frame s;r])]}
showing:{[v]if[f:"_"=*w:$v;v:`$1_ w];:[in s:undot r:dir v;**|.m.get(`showing;,`name,:[f;frame s;r]);0]}
ct:{[v]TRACE::();c v}
cc:{[v]CALL::();c v}
cf:{[v]c v;front v}
w:{dot'N.v@&(~@:'N.v)&(star undot@)'N.p}
isa:{dot'N.v@&N.c _lin(),x}
x:{[v;i]if[in v:undot dir v;trigger[v;i]]}
front:{[v]if[in v:undot dir v;.m.set`front,,,`name,frame v]}
busy:{[v;b]:[v~_n;jbusy[b]'name.frames[];if[in v:undot dir v;jbusy[b;frame v]]];}
glass:{[v;b]:[v~_n;jglass[b]'name.frames[];if[in v:undot dir v;jglass[b;frame v]]];}
stop:{glass[x;1];busy[x;1]}
go:{glass[x;0];busy[x;0]}
hold:{[v]if[in undot v:dir v;.m.set(`set;(`name,v;(`index;());(`hold;)))]}
release:{[v]if[in undot v:dir v;.m.set(`set;(`name,v;(`index;());(`release;)))]}
floating:{[v;b]if[in undot v:dir v;.m.set(`set;(`name,v;(`index;());(`floating;b)))]}

paths:{:[(t:4:x)_in k:0 5;,/((!#:;!:)[k?t]x),''_f'@[x[];_n;{:[~x~.();x]}];,()]}

/ directed acyclic graphs:  example functions, utilities

dag.polygon:{[s;n]pi:2*_asin 1;i:!n;k:i*(2*pi)%n;dag.scale[s]'(_cos k;_sin k)}
dag.scale:{[s;x]if[0>m:&/x;x-:m];_(s*.1)+s*x}
dag.gen:{[n;m]v:`$"n",'$!n;@[_n;v;:;v _dv'[_draw[n;m]_draw'-n;!n]]}

dag.spring:{[s;h;d;x;y]
 x%:s;y%:s
 ln:{[x;y]_sqrt _sqr[x-\:/:x]+_sqr y-\:/:y}
 gr:{[c;a;x]b:a*x-\:x;+/@[b;_n;{@[x;&~y;:;0]};c]}
 eq:{[l]+/+/_sqr l-1}
 it:{[k]c:*k;h:k 1;x:k 2;y:k 3;a:1-%l:c*ln[x;y];X:x+h*gr[c;a;x];Y:y+h*gr[c;a;y];:[eq[c*ln[X;Y]]<eq l;(c;h;X;Y);(c;h%2;x;y)]}
 c*:~n=\:/:n:!#c:{x|+x}(!d)_lin/:(),/:d[]
 _ s+s*2_ it/(c;h;x;y)}

/ trees and maps:  K API

tree.open:{[v;p]if[in v:undot dir v;of[name.c v;`open_p;(v;p)]]}
tree.close:{[v;p]if[in v:undot dir v;of[name.c v;`close_p;(v;p)]]}
tree.Open:{[v]if[in v:undot dir v;c:name.c v;{of[c;`open_p;(v;x)]}'{x@<x}tree.paths`. v]}
tree.Close:{[v]if[in v:undot dir v;c:name.c v;{of[c;`close_p;(v;x)]}'{x@>x}tree.paths`. v]}
tree.sub:?,/{(1+!#x)#\:x}'
tree.paths:tree.sub paths@
tree.matrix:{[d]p:tree.paths d;q:paths d;(#:'p;(*-1#)'p;@[(#p)#_n;p?/:q;:;d ./:q])}
tree.exists:{[d;p]&/{:[*r:.[.;(d;y);:];0;(*-1#x)_in!r 1]}':(!1+#p)#\:p}
tree.match:{[a;b]:[6=t:4:a;1;~t=u:4:b;0;~(!a)~!b;0;~&/{:[y&x<0;0;y|x<0]}'[a[.;`n];5=4::'b[]];0;&/a[]_f'b[]]}

map.match:{[d;p;s]
 j:<#:'p;p@:j;s@:j
 i:0;do[#p;q:-1_ p i;:[~map.tails[p;q]~map.bang d . q;:0;~{:[y&x<0;0;y|x<0]}[s i;~atomic d . p i];:0];i+:1];1}

map.vars:{[d;p]map.bang d . p}
map.bang:{[d]:[5=4:d;!d;!#d]}
map.tails:{[d;p]d@:&~(#p)>#:'d;d:(#p)_'d@&d[;!#p]~\:p;d@:&0<#:'d;(?*:'d)_dv _n}
map.exists:{[d;p]&/{:[*r:.[.;(d;y);:];0;(*-1#x)_in:[5=4:r 1;!r 1;!#r 1]]}':(!1+#p)#\:p}

first:{[v]:[in v:undot dir v;of[name.c v;`first;,v]]}

/ insert, append, delete

ins.m:{[v;i;n].m.set(`set;(`name,dot v;(`index;i);(`rins;n)))}
app.m:{[v;n].m.set(`set;(`name,dot v;(`index;());(`rapp;n)))}
del.m:{[v;i].m.set(`set;(`name,dot v;(`index;i);(`rdel;)))}
del.i:{[v;u]:[&/u _lin v;u;u[0]>*-1#v;(-(#v)&#u)#v;(#u)=#r:((#r)&#u)#r:(i:v?*u)_ v;r;(-(#u)&#r)#r:(i#v),r]}

/ insert, append, delete rows

ins.row:{[v;i;n]if[in v:undot dir v;of[name.c v;`ins`row;(v;i;n)]]}
app.row:{[v;n]if[in v:undot dir v;of[name.c v;`app`row;(v;n)]]}
del.row:{[v;i]if[in v:undot dir v;of[name.c v;`del`row;(v;i)]]}

Ins.row:{if[#s:of[c:name.c v;`Rows;,v:ad -2_.j.v];of[c;`ins`row;(v;*s;#s)];fire_f[`Insert;`t;v;()]]}
App.row:{of[c;`app`row;(v;1|#of[c:name.c v;`Rows;,v:ad -2_.j.v])];fire_f[`Append;`t;v;()];}
Del.row:{if[#s:of[c:name.c v;`Rows;,v:ad -2_.j.v];of[c;`del`row;(v;s)];fire_f[`Delete;`t;v;()]]}

ins.var:{[v;c;e]if[in v:undot m:dir v;if[~_n~a:arr v;of[name.c v;`ins`var;(v;c;name.c v;a;e;m)]]]}
app.var:{[v;c]if[in v:undot m:dir v;if[~_n~a:arr v;of[name.c v;`app`var;(v;c;name.c v;a;m)]]]}
del.var:{[v;c]if[in v:undot dir v;if[~_n~a:arr v;of[name.c v;`del`var;(v;c;name.c v;a)]]]}

/ copy, cut, paste

copy:{[v;i]if[in v:undot dir v;of[name.c v;`copy;(v;i)]]}
copy_all:{[v;i]if[in v:undot dir v;of[name.c v;`copy_all;(v;)]]}
cut:{[v;i]if[in v:undot dir v;of[name.c v;`cut;(v;i)]]}
paste:{[v;i]if[in v:undot dir v;of[name.c v;`paste;(v;i)]]}
paste_:{[v;i]if[in v:undot dir v;of[name.c v;`paste_transpose;(v;i)]]}

Set:{[v;i;d]if[in v:undot dir v;of[name.c v;`Set;(v;i;d)]]}

Copy_:{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}
Copy_All_:{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}
Cut_:{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`cut;(v;s)]]}
Paste_:{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}
Paste_Transpose_:{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste_transpose;(v;s)]]}

Copy:Copy_[ad -2_]
Copy_All:Copy_All_[ad -2_]
Cut:Cut_[ad -2_]
Paste:Paste_[ad -2_]
Paste_Transpose:Paste_Transpose_[ad -2_]

/ kdb -> pivot

kdb.pivot:{[t]
 v:(!t)_dvl a:(!t)@&`K _lin'!:'t[.]
 if[0=#v;t[v:`VAL]:!#t a 0]
 if[1=#v;v*:];p:t v;ax:.+(a;t a)
 if[1<#v
  ax[`VAR]:v@&(#v)##t v 0
  ax[a]:(#ax`VAR)#'ax a
  p:,/p]
 (p;.,`j,.(`c`pivot;`ax,ax))}

/ create pivot image

pivot:{
/ argument is either a symbol path from the root of a pivot object or
/ it is a two element list, a pivot object and its attribute dictionary
/ returns a 5 element list:
/ [0] - data matrix of indices into pivot vector (null locations in matrix have a value of the count of the pivot vector)
/ [1] - row axis data (matrix of size # rows by # row axes)
/ [2] - column axis data (matrix of size # column axes by # columns)
/ [3] - axes on rows (symbol vector)
/ [4] - axes on columns (symbol vector)
 if[t:4:x;d:`. v:undot dir x;e:`. ad v]			/ d is pivot object, e is attribute dictionary
 if[~t;d:*x;e:x 1]					/ d is pivot object, e is attribute dictionary
 if[~#d			;:5#,()]			/ if pivot is empty, return 5 empty lists as result
 ax:e[`j;`ax]						/ ax from j attribute
 if[~#!ax		;ax:.,(`N;!#d)]			/ if ax attribute has no elements, create default ax
 a:e[`j;`a]						/ a from j attribute
 if[7=4:a		;a:a d]				/ if a is a function, replace it with pivot data applied as its argument
 bax:!ax						/ the list of axes in ax (bang of ax)
 a::[_n~a		;(0,1|_.5*#bax)_ bax		/ if a is null, generate a reasonable default
     4:a,:()		;(a;bax _dvl a)			/ if a is a single list (or scalar), use it as rows and the remaining axes are the columns
     #,/a		;(),/:a				/ otherwise, assuming a row and column arrangement has been specified, make sure each of the parts is a vector
			 (0,1|_.5*#bax)_ bax ]		/ otherwise, generate a reasonable default
 if[~|/#:'a;		;:5#,()]			/ is this possible? leaving in just in case
 axo:e[`j;`axo]						/ axo from j attribute
 if[_n~axo		;axo:.()]			/ if it is null, start with an empty dictionary
 if[#ma:(!ax)_dvl !axo	;axo[ma]:?:'ax ma]		/ add axis orders for all axes not yet present in axo
/ All of the work to this point is to assure we have the following objects in fully specified standard form:
/ d - pivot vector
/ a - arrangement, a list of two symbol vectors
/ ax - the ax attribute, such that (#d)~(*|^ax[])
/ axo - axis order object, containing an entry for each axis
/ Next, generate m, the ordered axis coordinates for rows and for columns
 m:{+{[c;o]						/ c: the unordered axis coordinates, o: the orders for the axes
       if[~#c;:c]
       i:{x@<y x}/[_n;|o?/:'c]				/ generate the permutation
       c[;i] }[+?+ax x;axo x]}'a
 q:ax{+x y}'a						/ row and column coordinates for each pivot element
 b:&0<#:'m
 (,./[(#:'m b)##d;+m[b]?/:'q b;:;!#d]),@[m;1;+:],a }

fill:{[d;e]
 p:pivot(d;e);n:nil d
 if[~|/,//b:p[0]=#d;:(d;e)]
 r:,/&:'b;c:,/&:'+b
 e[`j;`ax;,/p 3 4],:+,/p[1;c],\:/:+p[2;;r]
 d,:((#r)*#c)#n
 (d;e)}

arrangement:{[v]v:undot dir v;::[_n~a:`. jd[v],`a;`.j.C.pivot.arrange@v;a]}

matrix.pivot:{[a]
 if[~k:#a 1;a[0],:]
 b:0N,'a[2],(,(#**a)#0N),*a
 b[!#a 4;0]:a 4
 c:((#b),#a 3)#0N
 if[k
  c[#a 4;]:a 3
  c[(1+#a 4)_!#c;]:a 1]
 c,'b}

u:{[v;d;a]u_s[dotted dir v;d;a]}
u_s:{[v;d;a]if[~d~e:`. v;:[u_r[d;e];_f'[v,/:u;d u;d@~u:?(!d),!e];u_x[v;d]]];u_a[ad v;a]}
u_a:{[v;d]if[~d~e:`. v;u_b'[v,/:u;d u;d@~u:?(!d),!e]]}
u_b:{[v;d;a]:[`j=*-1#v;u_j'[v,/:u;d u;d@~u:?(!d),!`. v];u_s[v;d;a]]}
u_j:{[v;d;a]if[~d~e:`. v;u_x[v;d]];u_a[ad v;a]}
u_r:{[d;e]:[~5=t:4:d;0;t=4:e]}
u_x:{[v;d].[`;v;:;d]}

/ close, destroy, hide, show, iconify (available as callbacks)

close:{_exit 0}
destroy:{d dot name.root .j.v;}
hide:{h dot .j.v;}
show:{s dot .j.v;}
iconify:{.[`;jd[v],`iconify;:;1];}

/ linking objects

WITH:`.j.OK`.j.YESNO`.j.YESNOCANCEL`.j.SAVE`.j.OPEN`.j.INPUT

/ system root object (for dialogs)

ROOT:""
ROOT..j.c:`label
ROOT..j.v:0
ROOT..j.l:`
ROOT..j.loc:_.5*XY
ROOT..j.xy:-XY_
ROOT..j.titlebar:0
ROOT..j.rootchild:_n

/ reparent widget

reparent:{[v]
 ROOT..j[`l`v`loc`rootchild]:(:[_n~l:att_l v;`;l];1;_.5*XY;)
 if[~`~name.with v;ROOT..j.rootchild::v;c`.j.ROOT;c dot v;:_n]
 b::[_n~.j.v;1;`~r:name.root .j.v;1;~the[name.c r;`frame]]
 if[b;ROOT..j.with::dot v;ROOT..j.rootchild::v;c`.j.ROOT;:_n]
 d w:dot v;ROOT..j.rootchild::v;c`.j.ROOT;cw_[r;w]
}

/ synchronous connection to java

ask:{[v]
 replay[] / tell Player.k about the dialog being created.  This makes Player automate the dialog response.
 r:a v / present the dialog to the user
 d`.j.ROOT
 if[`~name.with v;d v] / destroy the dialog if appropriate (not sure what name.with does)
 replay[] / if it's no longer created, remove the dialog from Player's available variables list so it won't try to playback until the next time a dialog is created
 record(`jsetb;(`name;v);(`index;());(`value;r))
 if[~@TRACE;trace r]
 r}

/ OK system object

OK:`OK
OK..j.c:`dialog
OK..j.o:,`OK
OK..j.l:`Error
OK..j.icon:`e
OK..j.font:`"Arial 1 16"

ok_:{d`.j.ROOT}
ok.async:{[i;l;m]OK..j.l::l;reparent`j`OK;OK..j[`icon`msg`t`async]:(i;m;{d`.j.ROOT;d`.j.OK;OK..t::_n};2);OK..j.v::1;refont`j`OK;front`.j.OK;}

ok.z:{if[in`j`OK;r:name.frame`j`OK;d`.j.OK;OK..j[`v]:0;if[in`j`ROOT;if[r~name.frame`j`ROOT;d`.j.ROOT]]]}
ok.e:ok.async[`e;`Error]
ok.w:ok.async[`w;`Warning]
ok.i:ok.async[`i;`Information]
ok.q:ok.async[`q;`Query]
ok.p:ok.async[`p;`]
e:ok.e

ok.sync:{[i;l;m]OK..j.l::l;reparent`j`OK;OK..j[`icon`msg`async]:(i;m;0);refont`j`OK;ask`.j.OK}

ok.E:ok.sync[`e;`Error]
ok.W:ok.sync[`w;`Warning]
ok.I:ok.sync[`i;`Information]
ok.Q:ok.sync[`q;`Query]
ok.P:ok.sync[`p;`]
E:ok.E

nyi:{ok.w`"Operation not yet implemented"}

/ yes/no system object

YESNO:`No
YESNO..j.c:`dialog
YESNO..j.o:`Yes`No
YESNO..j.icon:`q
YESNO..j.font:`"Arial 1 16"
YESNO..j.l:`"Yes/No"

yesno:{[m]reparent`j`YESNO;YESNO::`No;YESNO..j.msg::m;refont`j`YESNO;ask`.j.YESNO}
yesorno:{[yn;m]reparent`j`YESNO;YESNO::`No`Yes"yes"~.j.lc@$yn;YESNO..j.msg::m;refont`j`YESNO;ask`.j.YESNO}

/ yes/no/cancel system object

YESNOCANCEL:`Cancel
YESNOCANCEL..j.c:`dialog
YESNOCANCEL..j.o:`Yes`No`Cancel
YESNOCANCEL..j.icon:`q
YESNOCANCEL..j.font:`"Arial 1 16"
YESNOCANCEL..j.l:`"Yes/No/Cancel"

yesnocancel:{[m]reparent`j`YESNOCANCEL;YESNOCANCEL::`Cancel;YESNOCANCEL..j.msg::m;refont`j`YESNOCANCEL;ask`.j.YESNOCANCEL}
yesornoorcancel:{[yn;m]reparent`j`YESNOCANCEL;YESNOCANCEL::`Yes`No`Cancel("yes";"no")?.j.lc@$yn;YESNOCANCEL..j.msg::m;refont`j`YESNOCANCEL;ask`.j.YESNOCANCEL}

/ input system object

INPUT:""
INPUT..j.msg:""
INPUT..j.c:`input
INPUT..j.l:""

Input:{[i;m;l]INPUT..j.l::l;reparent`j`INPUT;INPUT::input_fmt i;INPUT..j.msg::m;c`.j.INPUT;refont`j`INPUT;r:ask`.j.INPUT;input_cnv[i;r]}
input:{[i;m;l;t]INPUT..j.l::l;reparent`j`INPUT;INPUT::input_fmt i;INPUT..j.msg::m;INPUT..j.t::input_[t;i];INPUT..j.v::1}
input_fmt:{:[(4:x)_in 4 -3;x;$x]}
input_cnv:{[i;r]:[-3=t:4:i;$r;4=t;r;~*k:.[$;(*0#i;$r);:];k 1;{e"Cannot convert input - cancelled";0#i}[]]}
input_:{[t;i;junk]if[#r:INPUT;t input_cnv[i;r]];d`.j.ROOT;INPUT..j.t::_n}

/ save/open system object

SAVE:OPEN:("";)
SAVE..j.c:OPEN..j.c:`chooser

file:{((~(*|x)_in"/\\")+#x)_ y}

save:{[k;j]
 SAVE:::[_n~k;((*.f.cd[]),":/";);-3=4:k,:();(k;);k]
 if[~`type _in!j;j[`type]:ss`Save]
 if[~`newfile _in!j;j[`newfile]:1]
 if[":"=*|l:$j`l;j[`l]:ss[$l],ss"Save"]
 j[`c`async]:`chooser,2
 SAVE..j::j
 jv:.j.v
 reparent`j`SAVE
 r:ask`.j.SAVE
 .j.v:jv
 if[_n~r;:r]
 if[3=#r[1;0];:_n]
 if[~.f.validate r[1;0];.j.e("&0 is an invalid filename -- please choose another";r[1;0]);:_n]
 if[~.f.exists r[1;0];SAVE::.[r;(1;);file[*r]];:r[1;0]]
 if[~.f.canAccess r[1;0];.j.e("You do not have permission to read from/write to/delete &0";r[1;0]);:_n]
 if[`Yes=yesno("&0 exists - Do you want to replace it?";r[1;0]);SAVE::.[r;(1;);file[*r]];:r[1;0]]
}

open:{[k;j]
 OPEN:::[_n~k;((*.f.cd[]),":/";);-3=4:k,:();(k;);k]
 if[~`type _in!j;j[`type]:ss`Select]
 if[":"=*|l:$j`l;j[`l]:ss[$l],ss"Open"]
 j[`c`async]:`chooser,2
 OPEN..j::j
 jv:.j.v
 reparent`j`OPEN
 r:ask`.j.OPEN
 .j.v:jv
 if[_n~r;:r]
 if[~#r;:_n]
 if[~.f.validate r[1;0];.j.e("&0 is an invalid filename -- please choose another";r[1;0]);:_n]
 if[~.f.canRead r[1;0];.j.e("You do not have permission to read &0";r[1;0]);:_n]
 OPEN::.[r;(1;);file[*r]]
 :[1~OPEN..j`multiple;r 1;r[1;0]]}

Open:{[v] /Open
 v:undot dir v
 /Set d to the directory and/or file to be opened.  If there is no directory or file specified to open, return null, else continue
 if[_n~d::[_n~f:att[v;`value];`. v;jit[`value;f;_n;v;()]];:_n]
 j:`. jd v /set j to v's java attributes
 if[~_n~r:open[d;j];.[`;v;:;OPEN];fire_t v]
 r}

Save:{[v]
 v:undot dir v
 if[_n~d::[_n~f:att[v;`value];`. v;jit[`value;f;_n;v;()]];:_n]
 j:`. jd v
 if[~_n~r:save[d;j];.[`;v;:;SAVE];fire_t v]
 r}

/ export by class

export:{[v]export_ undot dir name.chk v}
export_:{[v]d:`. v;j:`. jd v;c:export_cl v;(var_label v;of[c;`export;(v;d;j)])}
export_cl:{[v]:[`tree=c:cl v;`panel;c]}

cell_data:{[d;c]:[~`combo~c.c;d;_n~c.ol;label d;~4:c.ol;label c.ol[1;c.ol[0]?d];label c.ol d]}
cell_cross:{[d;c]:[6=4:c;d[];5=4:*c[];cell_data'[d[];cell_index[c;!d]];cell_data[;c]'d[]]}
cell_index:{[c;d]:[5=4:c@*!c;c d;c]}
row_labels:{[d;j]rc_labels[d;j;`rl]}
col_labels:{[d;j]rc_labels[d;j;`cl]}
rc_labels:{[d;j;a]r:.+(!d;!d);out_label'(:[_n~l:j a;r;@[r;!func_label l;{:[_n~y;x;`$$y]};l[]]][])} / doesn't handle functional rl/cl
path_labels:{[v]var_label'(1+!#v)#\:v}
var_label:{[v]out_label@:[_n~l:att_l v;*-1#v;func_label l]}
var_labels:{[v]var_label'(1+!#v)#'v}
out_label:{[l]`$sep_label _ssr[_ssr[$l;"\n";" "];"_";" "]}
sep_label:{[l]:[(*.r.slist)_in l;"\"",l,"\"";l]}
sep_label:{[l]l}
func_label:{[l]if[7=4:l;'"Object cannot be exported"];l}

C.gui.export:{[v;d;j]'"Not yet implemented"}
C.container.export:{[v;d;j].+(a;export_'v,/:a@:&(a:?,//of[export_cl v;`shape;,v])_lin!d)}
C.scalar.export:{[v;d;j]csv.sm_@,,:[_n~j.cell;d;cell_data[d;j.cell]]}
C.string.export:{[v;d;j]csv.sm_@,,`$d}
C.vector.export:{[v;d;j]csv.sm_@+,:[_n~j.cell;@[d;&d~\:`;:[;`__]];d cell_data'j.cell]}
C.matrix.export:{[v;d;j]csv.sm_@+:[_n~j.cell;d;d cell_data''j.cell]}
C.slot.export:{[v;d;j]csv.sm_ row_labels[d;@[j;`rl;{.+(x;y x)}[!d]]],'+,:[_n~j.cell;d[];d[]cell_data'cell_index[j.cell;!d]]}
C.table.export:{[v;d;j]fill:{[jf;x]t:_abs 4::'x;m:|/#:'x[];f:(0;0;0.;"";`);x:@[x;_n;{y,(x-#y)#z}[m];f t];@[x;_n;{:[7=4:y;`$y'x;x]};jf]}
                       jf::[5=4:j`f;j[`f;!d];(#!d)#,j`f]
                       csv.sm_(,col_labels[d;@[j;`cl;{.+(x;y x)}[!d]]]),+fill[jf;X::[_n~j.cell;d[];d[]cell_data''cell_index[j.cell;!d]]]}
C.cross.export:{[v;d;j]csv.sm_(,`,col_labels[d;@[j;`cl;{.+(x;y x)}[!d]]]),row_labels[*d[];@[j;`rl;{.+(x;y x)}[!*d[]]]],'+:[_n~j.cell;d[;];d[]cell_cross'cell_index[j.cell;!d]]}
C.combo.export:{[v;d;j]csv.sm_@,,`$_ssr[$dd::[_n~j.ol;d;~4:j.ol;j.ol[1;j.ol[0]?d];j.ol d];"_";" "]}
C.radio.export:{[v;d;j]csv.sm_@,,:[_n~j.ol;d;~4:j.ol;j.ol[1;j.ol[0]?d];j.ol d]}
C.spinner.export:{[v;d;j]csv.sm_@,,:[_n~j.ol;d;~4:j.ol;j.ol[1;j.ol[0]?d];j.ol d]}
C.text.export:{[v;d;j] / C.text.export[]
  e:{1_'(&x="\n")_ x}"\n",,/d / data split into lines
  g:@[,:'e;&~#:'e;,[;,"SP"]] / blank lines have extra code (SPace) added
  h:@[g;-1+#g;{(*x;"ETX")}] / last line signals end of text
  csv.sm_ h}

/ export to file by class (NYI)

Export:{[f;v].f.del f;Export_[f;undot dir name.chk v]}
Export_:{[f;v]d:`. v;j:`. jd v;c:export_cl v;of[c;`Export;(f;v;d;j)];}
C.gui.Export:{[f;v;d;j]'"Not yet implemented"}
C.container.Export:{[f;v;d;j].+(a;Export_[f]'v,/:a@:&(a:?,//of[export_cl v;`shape;,v])_lin!d)}
C.scalar.Export:{[f;v;d;j]csv.smf[f;(,var_labels v),,,:[_n~j.cell;d;cell_data[d;j.cell]]]}
C.vector.Export:{[f;v;d;j]csv.smf[f;(,var_labels v),,:[_n~j.cell;d;d cell_data'j.cell]]}
C.matrix.Export:{[f;v;d;j]csv.smf[f;(,var_labels v),:[_n~j.cell;d;d cell_data''j.cell]]}
C.slot.Export:{[f;v;d;j]csv.smf[f;(,var_labels v),row_labels[d;j],'+,:[_n~j.cell;d[];d[]cell_data'cell_index[j.cell;!d]]]}
C.table.Export:{[f;v;d;j]csv.smf[f;(,var_labels v),(,col_labels[d;j]),+:[_n~j.cell;d[];d[]cell_data''cell_index[j.cell;!d]]]}
C.cross.Export:{[f;v;d;j]csv.smf[f;(,var_labels v),(,`,col_labels[d;j]),row_labels[*d[];j],'+:[_n~j.cell;d[;];d[;]cell_data''cell_index[j.cell;!d]]]}
C.combo.Export:{[f;v;d;j]csv.smf[f;(,var_labels v),,,:[_n~j.ol;d;~4:j.ol;j.ol[1;j.ol[0]?d];j.ol d]]}
C.radio.Export:{[f;v;d;j]csv.smf[f;(,var_labels v),,,:[_n~j.ol;d;~4:j.ol;j.ol[1;j.ol[0]?d];j.ol d]]}
C.spinner.Export:{[f;v;d;j]csv.smf[f;(,var_labels v),,,:[_n~j.ol;d;~4:j.ol;j.ol[1;j.ol[0]?d];j.ol d]]}

/ type support for format

TYPE:.()
type:{x _in!TYPE}

/ format number

Fmt:{[v;n;w]
 :[w~_n         ;format n
   type w       ;:[1~att[v;`format];$w;_f[v;n;TYPE[w;`f]]]
   7=4:w        ;w n
   4=4:w        ;:[Num s:$w;_f[v;n;. s];s]
   ~@n          ;n _f\:w
   (4:n)_in 1 2 ;.r.num.f[w;n]
                 :[w<0;-_ _abs w;_ w]$n]}

fmt:{[n;w]Fmt[`;n;w]}

/ scale float by factor

scale:{[n;s]:[s~_n;n;type s;_f[n;TYPE[s;`scale]];~@n;n _f\:s;2=4:n;n*s;n]}
scale_:{[n;s]:[s~_n;n;type s;_f[n;TYPE[s;`scale]];2=4:n;n%s;n]}

/ convert string to number

cnv:{[t;s].r.num.g[t;s]}
cnv_:{[g]:[type g;TYPE[g;`g];g]}

/ format utilities

format:{:[atomic x;io_[1;x]x;_f'x[]]}
align:{:[atomic x;IO[2;4:x];_f'x[]]}
IO:((;cnv[0];cnv[0.];*:;`$;;;.$:);(;`.r.num.FI;`.r.num.FF;,:;$:;;$:;5::);`l`r`r`l`l`l`l`l)
io:{[v;d]if[*r:.[io_[0;v];d;:];e io_error_@4:v;:v];r 1}
io_:{[x;v]:[4=4:f:IO[x;4:v];fmt[;. f];f]}
io_error:{[t;d]("Input error:  &0 must be &1";labels[`l]undot d;``"integer"`"float"````` t)}
io_error_:{[t]("Input error:  data must be &0";``"integer"`"float"````` t)}

/ absolute value

abs:{(::;_:)[1=4:x]_abs x}

/ extended scalar conformance

apply:{[g;h;f;d]:[~atomic f;f[]_f[g;h]'d;7=4:f;g f d;atomic d;g h[d;f];f _f[g;h]'d]}
at:{[f;v;i]:[atomic f;f;(_n~i)&5=4:f;_f'[f[];v,/:j:!f;i];_n~i;f;f{:[atomic x;x;x y]}/i]}
by:{[s;a]:[~5=4:a;a;@[_n;*s;:;(1_ s)_f/:a s 0]]}

/ automatic label translation support (interface to .l)

TRANSLATE:1
ss:{:[TRANSLATE;.l.ss x;x]}
ma:{:[TRANSLATE;.l.ma[x;y];y]}
sv:{:[TRANSLATE&~y~`;.l.sv[x;y];$y]}
sa:{:[TRANSLATE;.l.sa x;$x]}
label:{:[x~_n;;-3=t:4:x;`$x;4=t;ss x;@x;`$$x;_f'x]}
label1:{:[x~_n;;-3=t:4:x;`$x;(4=t)|~t;ss x;`$$x]}

/ cell processing

cell:{:[_n~y;;cell_ add_ol y]}
add_ol:{:[_n~x;x;~@x;_f'x;~#!x;_n;~(`combo=x.c)&~`ol _in!x;x;-4=4:x.o;@[x;`ol;:;(x.o;x.o)];x]}
cell_:{:[_n~x;,`c`text;~@x;_f'x;2#'.@[x;_n;{:[`l=y;ss x;x]};!x]]}
attcell:{[v;i;d]:[7=4:a:att[v;`cell];a d;a]}
combocell:{[c;v;i;d]if[~_n~k:of[c;`getcell;(v;i;d)];if[(`c`combo _in k)&`ol _in*:'k;:k]]}
datcell:{if[(`c`combo _in x)&`ol _in*:'x:ordercell x;x:x _di(*:'x)?`o;x:@[x;(*:'x)?`ol;{(`o;:[7=t:4:x 1;x[1][];5=t;label x[1;];label x[1;1]])}]];x}
ordercell:{:[`c~**x;x;((*:'x)?`c)!x]}
outcell:{[c;d]:[~atomic d;_f'[c;d];(`c`combo _in c)&`ol _in*:'c;`$${:[7=t:4:x;x d;5=t;label x d;label x[1;x[0]?d]]}c[(*:'c)?`ol;1];d]}
incell:{[v;i;r;c;d]:[~`c`combo _in c;d;`ol _in*:'c;incell_ol[v;i;r;c;d;c[(*:'c)?`ol;1]];incell_o[v;i;r;c;d;c[(*:'c)?`o;1]]]}
incell_o:{[v;i;r;c;d;o]
 / combo cell with no ol attribute
 if[-3=4:d
  res:.[cast;(d;o);:]
  if[*res;.j.e("Bad Value: &0";d);:`. v,i]
  d:res 1 ]
 if[of[cl v;`scale_cell;(v;i;d)]_in o;:d]
 .j.e("Bad Value: &0";d)
 `. v,i }
incell_ol:{[v;i;r;c;d;o]:[7=t:4:o;o d;5=t;incell_ol_[v;i;d;!o;o[]];incell_ol_[v;i;d]. o]} /combo cell with ol attribute
incell_ol_:{[v;i;d;e;o]if[-3=4:d;d:cast[d;o]];if[(#o)>k::[GETSET;o;label o]?of[cl v;`scale_cell;(v;i;d)];:e k];.j.e("Bad Value: &0";d);`. v,i}
scalecell:{[d;s]:[~`combo~d.c;d;-2=t:4:d.o;@[d;`o;{x*s}];d]}

/ color processing

color:{:[x~_n;_n;atomic x;cvs white gray@:[4=4:x;COLOR x;x];_f'x[]]}
cvs:{(1000 1000 1000 _vs _ x),{:[x;x;255]}@_1000*.u.rnd[3;x-_ x]}
gray:{:[2=4:x;x;x<0;1000 1000 1000_sv 3#-x;x]}
white:{:[2=4:x;x;255255255=x;254254254;x]}
COLOR:{@[_n;x;:;y]}.+(	(`t		;256256256)
			(`w		;255255255)
			(`r		;255000000)
			(`g		;   255000)
			(`b		;      255)
			(`y		;255255000)
			(`m		;255000255)
			(`c		;   255255)
			(`n		;192192192)
			(`l		;240240240)
			(`z		;        0)
			(`gray85	;217217217)
			(`gray90	;229229229)
			(`gray98	;250250250)
			(`scrollbarblue	;186209252)
			(`bgi		;200215255)
			(`bgw		;255255160)
			(`bge		;255223192)
			(`mgi		;168183223)
			(`mgw		;223223128)
			(`mge		;223192160)
			(`buttonDisable ;161161146)
			(`e		;236233216) ) / ,(.+(`w`m`j;236233216 171178195 238238238))[.p.Look_and_Feel]
FONT:.+(`d`l`rcl`a;`"Courier 0 14"`"Dialog 0 12"`"Helvetica 0 12"`"TimesRoman 0 12")
font:{:[x~_n;  /font: if x is null, return null
        atomic x /if x is atomic but not a dictionary
         (`${@[x;&x="_";:;" "]}@;0$;0$)@'1_'(&d=" ")_ d:" ",$:[x _in!FONT;FONT x;x]
       _f'x[]]}
font3:{(`$;0$;0$)@'1_'(&" "=x)_ x:" ",$x::[x _in!FONT;FONT x;x]}
axis:{if[5=4:x;:_f(!x){(x;y)}'x[]];if[2=#x;if[4=4:*x;x,:]];{@[@[x;0;{`$"ai",("XYZ""xyz"?x[0]),1_ x$:}];1;{:[3=4:x;"",x;()~x;," ";x]}]}'x}
axiscolor:{.[axis x;(;1);color]}
axisfont:{.[axis x;(;1);font]}
axis2:{if[5=4:x;:_f(!x){(x;y)}'x[]];if[2=#x;if[4=4:*x;x,:]];{@[@[x;0;{`$"ai",("XYZ""xyz"?x[0]),"2",1_ x$:}];1;{:[3=4:x;"",x;()~x;," ";x]}]}'x}
axiscolor2:{.[axis2 x;(;1);color]}
axisfont2:{.[axis2 x;(;1);font]}
edit:{:[x~_n;_n;atomic x;,x;_f'x[]]}
is:{:[~#d:$x;x;&/d _lin"0123456789";0$d;x]}
cast:{((::;0$$:;0.$$:;$:;`$$:)@_abs 4:y)@x}
iconv:{:[~@x;_f'x;~4=4:x;x;~&/(c:$x)_lin"0123456789";x;0$c]}
nil:{(;0N;0n;" ";`;;;)@4:*:/x}
proto:{[n;p;r]:[~1=4:n;(),n;p~_n;n#nil r;n#p]}
shade:{b:color'y,x;1000 1000 1000_sv{_(x+((y-x)%z)*!z)}[;;z]'[b 1;b 0]}

/ global font processing

Font_.get:{
 f:{(::;0$;0$)@'1_'(&x=" ")_ x:" ",x}'$FONT[]
 f[;2]:4#Font_.FONT Font;f:`${1_,/" ",'x}'$f;h:*|Font_.FONT Font
 (f;h)}

Font_.FONT:.|((`Tiny            ;10  8  8 12)
              (`Small           ;12 10 10 16)
              (`Medium          ;14 12 12 20)
              (`Large           ;16 14 14 22)
              (`Huge            ;22 16 16 24))

Font_.ATTR:`font`olfont`lfont`nlfont`alfont`rclfont`clfont`rlfont

Font_.set:{ /Font_.set: update the font setting for all variables in list x
 t:Font_.get[];f:*t;h:t 1
 i:0;
 do[#x
   v:x i /v is the variable being updated
   t:Font_.fc v
   g:*t /g is the variables font attributes
   j:t 1
   r:the[c:name.c v;`refont] /r is the variable's class refont method e.g. C.<class>.refont
   a:att[v]'g /a is the variable's current font attribute values
   k:&~a~'b:r'[g;f j;a] /run the variables refont function against each font attribute
   .[`;jd[v],,`h,g k;:;h,b k] /update the variable's font attributes with the new values.
   of[c;`state;,v]
   i+:1]
}

Font_.fc:{[v]c:name.c v;f:Font_.ATTR@&Font_.ATTR _lin the[c;`public];(f;(!FONT)?/:the'[c;`$uc'f])}

Font:_n
Font..t:"Font_.set name.vars[]" /Update the font settings for every variable
Fonts:!Font_.FONT

/ layout

layout:{[c;v;w]:[1=#v;L;of[pcl v;`layout;(c;v;w)]]}
newl:{if[_n~L;.m.set(`new;(`name,L::name.new[`;name.i[];_n];`parent`;`class`layout;`frame`;`layout`;`glass,~FLUSH;`scrollable,0))]} /create a new layout when an object is created ?
defl:{{.m.set(`set;(`name,L;(`index;());(x;y)))}'[!Layout;Layout[]]} /once newl is set, modify it by setting the default layout based on Layout ?

/replace the default Layout attribute values with others as noted
repl:{[v]
  {.m.set(`set;(`name,L;(`index;());(x /send java a message to set the value of attribute x to:
  :[~_n~k:att[v;x];k /the value set by the application program, if it exists
    ~_n~k:the[cl v;`constraint,x];k /else the value of the object's constraint, it it has one
    y])))}'[!Layout;Layout[]]} /else use the default provided by Layout.
setl:{[a;d]if[~_n~d;.m.set(`set;(`name,L;(`index;());(a;d)))]} /applies an object's layout function.  Only container objects can have a layout function ?
Layout[`insets`ix`iy`fill`anchor`wx`wy]:(4#0;0;0;`b;`n;1.;1.)

extent:{s:(m:^x)_vs v?/:u:?v:,/x;e:m-m _vs(|v)?/:u;i:&~u=`;.+(u i;(+s,e-s)i)}

/ attribute-setting functions

nonVisibleIndex: {[v;i] /nonVisibleIndex: returns 1 if index i for widget v is invisible to java i.e. it does not exist in the N.s entry for this widget and hence java can't reference it
  /Make sure the index exists in N.s as it might not if it's visibility attribute has faked out the arrangement in N.S
  /Returns 1 (index is invisible) else return 0 (index is visible and java can reference it)
  if[0=4:i; i: *i] /If we have a k list, then we need to see if the first element is symbol or symbol list
  if[@i; i: ,i] /Make sure i is a list
  if[~-4=4:i; :0] /If the index isn't a list of symbols, we don't need to check it since that's the only kind of index that gets faked out
  /else check to see if the index is available in N.s
  ~&/{x _in y}[;(name.s v)@0]'i}

cat:{.[`.j.C;x,y;{:[_n~x;(),y;x,y]};z]}

ai:{:[2>#^z;z;?z[;,x]]}
ji:{[s;f;a;v;i]@[`.j;`f`v`i;:;(s;v;:[in v;of[c;`ji;(c:name.c v;v;i)];i])];r:f . a;.j.f:.j.v:.j.i:_n;r} /execute the method f for attribute s ...to be continued...
jit:{[s;f;a;v;i]t:`.j@`f`v`i;r:ji[s;f;a;v;i];@[`.j;`f`v`i;:;t];r}
ii:{[a]i:();while[5=4:a;i,:!a;a:*a[]];i}
gi:{[d;i]{:[atomic x;x;~*r:.[.;(x;y);:];r 1]}/[d;i]}

arr:{[v] /given a widget with k path v, if its arrangement is a function, evaluate the function and return the result, else just return the arrangement
 if[~7=4:a:att[v;`a];:a]
 t:`.j@`f`v`i
 @[`.j;`f`v`i;:;(`a;v;)]
 r:a .`. v
 @[`.j;`f`v`i;:;t]
 /We can't apply any non-v visibility attributes and return the effective (what will be displayed to the user) arrangement here.
 /if we don't have a class name and r isn't null, we've got a problem: which class should run nonvVis?  The class' shape function is what determines
 /what the user will see so we handle non-v visibility attributes there instead.
 r}

meta:{[c;s;f].[`.j.C;(c;s);:;f];} /add method (implemented by the k function f) for attribute s of class c to the global Class Hierarchy C
isall:{[c;s].[`.j.C;(c;~s;`index);:;`all];}
noop:{[c;s;n].[`.j.C;(c;s);:;. 1!"}{",1!"][",1_,/";v",/:$!n];}

dat:{[v;i]
 c:name.c v;if[of[c;`getecho;,v];if[#,//d:of[c;`value;(c;v;i)]
  j:*t:of[c;`imap;(c;v;i)]
  if[#j;if[~@k:t 1;i@:k;if[~@d;d@:k]]]
  if[(#j)|~the[c;`rank]
   a:the[c;`atomic]
   if[a;if[~_n~r:of[c;`getcell;(v;i;d)];.m.set(`set;(`name,dot v;(`index;j);(`cell;symbol of[c;`scalecell;(v;i;of[c;`datcell;(v;i;r)])])))]]
   .m.set(`set;(`name,dot v;(`index;j);(`value;of[c;`out;(v;i;d)])))
   if[a;if[~_n~r:of[c;`lrc;(v;i;d)];.m.set(`set;(`name,dot v;(`index;j);(`align;r)))]]]]]
}

cons:{[c;s;f]meta[c;s;get1[s;catt[s;f]]]}
get1:{[s;f;v;i]ji[s;f;(v;i);v;i]}
catt:{[s;f;v;i].m.set(`set;(`name,dot v;(`index;());(s;f@:[7=4:a:att[v;s];a of[c;`value;(c:cl v;v;)];a])))}

ccons:{[c;s;f]meta[c;s;get1[s;ccatt[s;f]]]}
ccatt:{[s;f;v;i]({:[5=4:x;x y;(#y)#x]}[att[v;s];of[name.c v;`geto;,v]]){.m.set(`set;(`name,y;(`index;());(s;f x)))}'1_ name.child dot v}

olist:{[c;s;f]meta[c;s;ocatt[s;f]]}

ocatt:{[s;f;v;i] /ocatt: combo ol attribute processing
 i:att[v;`o];a:f@:[7=4:a:att[v;s];a i;~4:a;(a[1],_n)(a[0]?/:i);atomic a;(#i)#a;a i]
 /`0: "Process combo ol attribute: ",(5:a),"\n"
 .m.set(`set;(`name,dot v;(`index;`$$i);(s;:[_n~a;,a;a])))
}

list:{[c;s;f]meta[c;s;get1[s;latt[s;f]]]}

latt:{[s;f;v;i]
 c:name.c v;i:ii a:att[v;s]
 if[#r:f@:[7=4:a;a of[c;`value;(c;v;i)];atomic a;a;gi[a;i]]
 j:*t:of[c;`imap;(c;v;i)];if[~_n~k:t 1;r@:k]
 if[(s~`e) & (c~`button) /if the edit attribute is changing on a button that is using an html label
   if[(lval: $att[v;`l]) _sm "<html>*"
     /if the button is being disables, force the disabled button foreground color, else set the color to it's lfg value if it has one, else the default label color
     .m.set(`set;(`name,dot v;(`index;());(`lfg; :[a~0; color `buttonDisable; :[~_n~buttonlfg: att[v;`lfg]; color buttonlfg; _n]])))
     ]]
 .m.set(`set;(`name,dot v;(`index;j);(s;r)))]
}

top:{[c;s;f]meta[c;s;tatt[s;f]];}
tatt:{[s;f;v;i]if[~_n~a:att[v;s];if[v~name.root v;.m.set(`set;(`name,name.frame v;(`index;());(s;f a)))]]}
xy:{x&XY-XY_BORDER}

gcons:{[p;f]meta[`g;p;gconsi[p;p;f]]}
gcons2:{[p;f]meta[`g;p;gconsi[p;`$-1_$p;f]]}
gconsi:{[p;q;f;v;i]{.m.set(`set;(`name,dot v;(`index;());(`$($q),$x;f att[v;p]x)))}'gatt[p;v;i];}

ibi:{[v;a;d](!d)ibiset[v;`$"ibi",($a),"box";"";(`color;color);(`;::)]'d[]}
aibi:{[v;a;d](!d)ibiset[v;`$"aibi",($a),"box";"a";(`color;axiscolor);(`;axis)]'d[]}
aibi2:{[v;a;d](!d)ibiset[v;`$"aibi",($a),"box";"a";(`color;axiscolor2);(`;axis2)]'d[]}

ibiset:{[v;a;p;t;e;b;d]:[5=4:d;ibisetp;ibisetm][v;a;p;t;e;b;d]}
ibisetm:{[v;a;p;t;e;b;d].m.set(`set;(`name,dot v;(`index;a);(`$p,$b;e[1]d)))}
ibisetp:{[v;a;p;t;e;b;d]f::[`ibcoi=b;t;e];g:(!d){[c;d](`$,/$p,b,c,*f;f[1]d)}'d[];{.m.set(`set;(`name,dot v;(`index;a);x))}'g;}

gitem:{[p;f]meta[`g;p;gitemi[p;f]]}
gitemi:{[p;f;v;i]{j:0;do[#a::[_n~w:att[v;`vars];#`. v;#w]#att[v;p]x;.m.set(`set;(`name,dot v;(`index;,j);(`$($p),$x;f a j)));j+:1]}'gatt[p;v;i];}
gatt:{[p;v;i]:[~-4=4:i;!att[v;p];,*i]}

ratom:{[c;s;f]meta[c;s;getc[s=`rl;ai[1];f;s]]}
catom:{[c;s;f]meta[c;s;getc[s=`cl;ai[0];f;s]]}
getc:{[p;k;f;s;v;i]{ji[s;cdat;(p;f;s;v;x);v;x]}'k[_n;of[name.c v;`all;(v;())]]}
cdat:{[p;f;s;v;i].m.set(`set;(`name,dot v;(`index;i);(s;f@:[p&_n~a:att[v;s];*i;atomic a;:[7=4:a;a[];a];_n~a:a i 0;*i;a])))}

Atom:{[s;f;v;i]aatt[0;s;f;0;`attr;v;i]}
atom:{[c;s;f]isall[c;s];item[`rl=s;c;s;f;:;0]}
tatom:{[c;s;f] /tatom: create method for attribute s of class c using function f as the basis for the method
  item[s=`cl;c;s;f;{:[#y;ai[0;x;y];+,*name.s x]};1]}
item:{[p;c;s;f;k;l] /item: create and instantiate the method (k function) to be used to implement the attribute s for class c
  /p=1 if we're working with the `rl or `cl attributes, else 0
  /c is the object class e.g. `table
  /s is the attribute of the class
  /f is the k function to use as a basis for creating the method function
  /k is a function to be passed to geta
  /l is 0 if called from the atom function else 1 when called from the tatom function
  meta[c;s;geta[s;k;l;aatt[p;s;f;1;`attr`attr1 l]]];}
geta:{[s;k;l;f;v;i] /geta: execute the method f for attribute s on object v, index i
  /s is the attribute
  /k is a function that returns all the object's indices (I think...)
  /l force processing flag. 0 if called from the atom function else 1 when called from the tatom function
  /f is a function that is the method that implements the attribute s
  /v is the path to the object
  /i is the indices into the object
  if[l|#i /Only process when there is at least one index into the variable, or if the force processing flag is on
    c:name.c v /get the variable's class
    :[(#i)&of[c;`isall;(v;i:k[v;i])] /if we have multiple indices and these happen to be all the indices for the object
        ji[s;f;(v;);v;_n] /process the method on the entire object using _n as the index list (I think this is supposed to be a performance improvement)
      1<#^i /else if we have multiple indices into the variable
        {ji[s;f;(v;x);v;x]}'i /process the method on each of the variable's indices
      ji[s;f;(v;i);v;i]]]} /else just process the method once on the variable and index

aatt:{[p;s;f;b;q;v;i] /aatt
 /p=1 if we're working with the `rl or `cl attributes, else 0
 /s is the attribute of the class
 /f is the k function that implements the attributes method
 /b is boolean, 0 when called the 'Atom' function, else 1 (called from the 'item' function)
 /q is a symbol, either `attr or `attr1
 /v is the path to the object
 /i is the indices into v
 a:att[v;s] /get attribute value
 c:name.c v /get the object's class
 if[p /Special handling for `rl and `cl attributes i.e. if s _in `cl`rl
  /Create a dictionary 'a" of the row or col keys in v, and set each key's value to its attribute value.  If indicies were supplied, only create the subset for those indices.
  w:{.+(x;x)}@u::[_n~i;*of[c;`shape;,v];i] /create a dictionary of the (subset, if indices were specified) rows or cols in v, whose keys and values are the same
  a: :[5=t:4:a;@[w;u;:;a[u@:&u _lin!a]] /if the attribute value is a dictionary, use the attribute values for the key values
       6=t;w /else if the attribute value was null, use the row or col name as the value i.e. use w as is.
       7=t;aatt_i[a;w] /else if the attribute value was a function, run the function and use the function result for the key values
       a] /else just use a as is
  a:{:[5=4:y;@[y;_n;x];x y]}[f;a]] /Set a's key values to their final, actual values by running the attribute method on the attribute value(s).  Note that if a is a dictionary, this will run the method once per each key in a
 if[e:~_n~i;i::[#j:of[c;`imap;(c;v;i)];*j;i]] /If indicies were supplied, translate them with the class's imap method if it returns a result, else just use i as is
 r:adat[c;v;i;a;q] /Set r to the indices to work on?
 if[~p;r:f r] /If we haven't already done special processing, apply method f to r
 if[~e;j:of[c;`imap;(c;v;i)]] /If indicies were not supplied, try to get them from the class's imap method using i=_n
 if[#j /if there are indices to work on
  r:of[c;`enlist;(*j;r)]
  if[~b;:r] /If we we're called by the Atom function, return now
  /else we were called from the item function.  If the index isn't visible, don't send the message to java
  if[#r;if[nonVisibleIndex[v;i]; :_n];.m.set(`set;(`name,dot v;(`index;*j);(s;r)))]]
}

aatt_i:{[a;w] /aatt_i: Apply cl/rl function.  a is the a cl or rl attribute that is a function, w is the dictionary of default column labels.
  I:i /save the global i (note: i is .j.i that k programmers use)
  w:@[w;_n;{i::,y;a[]};!w] /Apply the function to w
  i::I /restore the global i's value
  w}
adat:{[c;v;i;a;q] /adat
  :[7=4:a;a of[c;`value;(c;v;i)] /If a is a function, run it on the value of object of class c at index i
    &/i~'_n;atake[v;atomize of[c;q;(c;v;i;a)]]
    atomic a;a;gi[of[c;q;(c;v;i;a)];i]]}
atake:{[v;a]s:name.s v;{:[atomic y;x#y;x[0]#(1_ x)_f/:y[]]}[@[s;_n;{:[@x;x;#x]}];by[s;a]]}
atomize:{:[5=4:x;@[x;_n;_f];@x;x;-3=4:x;`$x;x]}

node:{[c;l;s;f;k]meta[c;s;getn[s;l;f;k]]}
getn:{[s;l;f;k;v;i]if[k|~_n~a:att[v;s];setn[m;v;;;s;l;f;k]. amendn[v;existn[m:the[name.c v;`Node];v];a]]}
setn:{[m;v;i;d;s;l;f;k]k::[k;_n;(`nl=s)|1~m;&~_n~'d];i@:k;d@:k;if[l;d:ma[i;d]];.m.set(`set;(`name,dot v;(`index;sym i);(s;f d)))}

/amendn is where a single attribute value for a multiple node variable gets expanded to have the same value for each node.
/e.g. if v is a 3 node tree with nodes `a `b `c, and you set tree..j.nl: `"Dialog 2 12", then this function returns ((,`a;,`b;,`c);`"Dialog 2 12" `"Dialog 2 12" `"Dialog 2 12")
amendn:{[v;i;a] /amendn: Take variable v at indicies i and expand the attribute list a as needed to have one attribute per index.
 (i /Return the original index list
 :[4:a;(#i)#,a /If a is a symbol, duplicate it once for each index and return.
   @[(#i)#_n /Else a[0] is a list of paths which match those in i (a can be a subset of i).  Create a template of null values, one for each index.  We'll amend this with the correct attribute value.
      i?/:a[0;j] /See definition of j below. Create the list of indices in i that match the paths specified in a[0].  The null template will be amended with the attribute value at each of these locations.  Use find in case the k programmer listed the paths in a different order than i.
      : /assign the attribute value at each amended index
      a[1;j:&a[0]_lin i]]])} /j is the list of indices into i whose paths were specified in a[0].  a[1;j] are the attribute values to be assigned at these indices.

existn:{[m;v]:[_n~n:att[v;`n];apaths[m;`. v];4:n;apaths[m;n];*n]}
seln:{[v;i;a]:[~#i;:[4:a;alln[v;a];a];:[4:a;somen[i;a];a[;&a[0]_lin i]]]}
somen:{[i;a](i;(#i)#,a)}
alln:{[v;a]m:the[name.c v;`Node];(p;(#p:apaths[m;`. v])#,a)}
apaths:{[m;d]p:tree.paths d;if[~m;:p];p:p _di&0~'(*-1#)'p;p,,/{(-1_ x),/:d . x}'p@&1~'(*-1#)'p}

anno:{[c;s;f]meta[c;s;anno0[s;f]]}
anno0:{[s;f;v;i]{.m.set(`set;(`name,dot v;(`index;x);(s;y)))}.:[_n~a:att[v;s];(;);(hmat;{@[(),x;&~((),x)~\:_n;f]})@'a]}

lcons:{[c;s;t]meta[c;s;lcons0[s;t]]}

lcons0:{[s;t;v;i]
 c:name.c v;e:the[c;`selflabel]
 if[v~name.root v;if[(~e)&s _in!`.j.C.frame;of[`frame;s;,v];:_n]]
 if[1<#v;if[`iL _in!`.j.C p:pcl v;of[p;`iL;(s;t;-1_ v;*-1#v)];if[~e;:_n]]]
 .m.set(`set;(`name,dot v;(`index;());(t;labels[s]v)))
}

labels.l:{[v]`$$:[_n~d:att_l v;label1@*-1#v;label1 d]}
labels.lfg:{[v]:[~_n~d:att[v;`lfg];color d]}
labels.lbg:{[v]:[~_n~d:att[v;`lbg];color d]}
labels.lfont:{[v]:[~_n~d:att[v;`lfont];font d]}

vcons:{[c;s;f;g]meta[c;s;getv[s;f;g]]}
getv:{[s;f;g;v;i].m.set(`set;(`name,dot v;(`index;());(s;:[_n~a:att[v;s];f v;g a])))}

pnull:{[c;s]meta[c;s;{[v;i].m.set(`set;(`name,dot v;(`index;());(s;())))}]}

pcons:{[c;s;f]meta[c;s;getp[s;f]]}
getp:{[s;f;v;i]setp[s;f;v;att[v;s]]}

setp:{[s;f;v;a]
 c:name.c v
 if[#b:of[c;`getai;,v]
  d:,/of[c;`arrange;,v]
  if[5=4:a;a@:d]
  if[7=4:a;a:{ji[s;a;_n;v;x]}'d]
  a:(#b)#a
  if[s=`al;if[_n _in a;a[i]:d i:&a~'_n]]
  .m.set(`set;(`name,dot v;(`index;b);(s;f a)))]
}

pattr:{[c;s;t;f]meta[c;s;getpa[s;s=`rcl;t;f]]}
getpa:{[s;b;t;f;v;i]setpa[s;b;t;f;v;i;att[v;s]]}

setpa:{[s;b;t;f;v;i;a]
 k:name.c v
 if[#br:,/ar:of[k;`arrange;,v]
  ax:of[k;`getaxo;,v]
  tr:~0~att[v;`translate]
  q:name.S v
  sx:q[2;0]
  if[b&(4:a)_in 5 6;a[j]:?:'ax j:(!ax)_dvl!a]
  if[~5=4:a;a:.+(br;a)]
  a[br _dvl!a]:_n
  a:.+(br;a br)
  a[]:sx#'a[]
  q:name.S v
  if[#r:of[k;`rbang;,v];
   ir::[~#q[0;0];();~#r;();q[1;0]?/:'q[0;0;;r]]
   d:a[ar 0]@'ir
   ri:+,/,/:\:/!:'2#^ra::[tr&f~_n;`$+ar[0]sv''d;~f~_n;f@+d]
   .m.set(`set;(`name,dot v;(`index;ri);(`$"prl",$t;,/ra)))]
  if[#c:of[k;`cbang;,v]
   ic::[~#q[0;1];();~#c;();q[1;1]?/:'q[0;1;;c]]
   d:a[ar 1]@'ic
   ci:+,/,/:\:/!:'2#^ca::[tr&f~_n;`$ar[1]sv''d;~f~_n;f d]
   .m.set(`set;(`name,dot v;(`index;ci);(`$"pcl",$t;,/ca)))]]
}

/ event processing, triggers

xeq:{[v]{~</x?/:0 1}@{:[_n~b:`. x,`j`xeq;-1;b]}'|chain v}

pevent:{[c;s;n;f]meta[c;s;pset[`$"rc",1_$s;n;f]]}
pset:{[s;n;f;v;i;d]if[xeq v;if[~_n~a:att[v;s];if[#j:of[name.c v;`getdi;(v;i;n;f)];res::[7=4:a;ji[s;a;,2#j;v;,j 2];ji[s;{dot[x]y};(-1_ v;a);v;,j 2]]]]];res}

qevent:{[c;s]meta[c;s;qfire[s]]}
qfire:{[s;v;i;d]c:name.c v;fire[s;v;of[c;`where;(c;v;i)];d]}

event:{[c;s]meta[c;s;fire[s]]}
fire_f:{[f;s;v;i]if[xeq v;if[~_n~a:att[v;s];res::[-3=4:a;ji[f;{dot[x]y};(-1_ v;a);v;i];ji[f;a;,:[~*r:.[.;(`;v,i);:];r 1];v;i]]]];res}
fire_:{[s;v;i]fire_f[s;s;v;i]}
fire:{[s;v;i;d]fire_[s;v;i]}
trigger:fire_[`t]
fire_t:{[v]trigger[v;_n]}
vset:{[c;s;a]meta[c;s;{[v;i;d]ji[s;{.[`;,/.j`v`i;:;x]};,d;w:jd[v],a;i];dj w,i;fire_t w}]}
Vset:{[c;s;a]meta[c;s;{[v;i;d]ji[s;{.[`;,/.j`v`i;:;x]};,d;w:jd[v],a;i];dj w,i;Vsetz v;fire_t w}]}
Vsetz:{[v]if[`j`ROOT~v;_f ROOT..j.rootchild];if[~name.V v;name.setV[v;1]]}
fset:{[c;s;a]meta[c;s;{[v;i;d]eval[s;v;i;`. jd[v],a]}]}
eval:{[s;v;i;d]if[xeq v;res:ji[s;{:[(4:y)_in 4 7;y[];x . y]};(dot -1_ v;d);v;i]];res}

nevent:{[c;s]meta[c;s;nfire[s]]}
nfire:{[s;v;i;d]fire[s;v;is'i;d]}

gevent:{[c;s]meta[c;s;gfire[s]]}
gfire:{[s;v;i;d]fire_[s;v;i]}

user:{[s;f;v;i]ji[f;att[v;s];_n;v;i]}

/ 'with' processing

with:{[c;s]meta[c;s;{[v;i]if[~_n~att[v;s];d:cl w:jd[v],s;with_new[v;i;w;d]]}]}
with_new:{[v;i;w;d]:[~in w;with_d[v;w];of[d;`get;(w;i)]]}
with_top:{[v]if[v~name.root v;tr[v;kt]]}
with_d:{[v;w]d dot w;of[cl w;`new;(w;dot v;`)];jiggle frame w}
With:`popup`menu`dialog`input`chooser

/ simulate data-entry

Get:{[v;i]geta[`get;:;1;dat;v;i]}
vSet:{[v;i;d]ji[`set;{if[~_n~d:of[name.c x;`in;(x;y;z)];n:upd[x;y][`. x,y;d];.[`;x,y;:;n];trigger[x;y]]};(v;i;d);v;i]}
GETSET:0 / hack! hack! hack!  (= 1 allows in_cell_ol_ to avoid xyz_abc -> xyz abc_
eSet:{[v;i;d]GETSET::1;r:ji[`set;{c:name.c x;if[~0~Atom[`e;::;x;y];if[~_n~d:of[c;`in;(x;y;z)];.[`;x,y;upd[x;y];d];trigger[x;y]]]};(v;i;d);v;i];GETSET::0;r}
eGet:{[v;i;d]GETSET::1;r:ji[`set;{c:name.c x;if[~0~Atom[`e;::;x;y];if[~of[c;`io;(x;y;z)];if[~_n~d:of[c;`in;(x;y;z)];:upd[x;y][`. x,y;d]]]]};(v;i;d);v;i];GETSET::0;r}
New:{[v;p;w]if[~in v;c:cl v;of[c;`New;,v];m:new[real c;v;p;:[`~w;w;layout[c;v;w]]];initial[c;v];end m;terminal[c;v]]}
real:{[c]:[_n~r:the[c;`class];c;r,c]}
Renew:{[v;i]c:name.c v;:[~c=name.c v;1;~of[c;`shape;,v]~name.s v;1;0]}

/ prototype

prototype:{[v;i]
 if[_n~p:att[v;`p]
  if[~_n~a:of[cl v;`getcell;(v;i;_n)];a:. a]
  if[`combo~a`c;o:a`o;p:*0#`. v;p::[p _in o;p;*o]]]
 while[~atomic p;j:*i;p@:j;i:1_ i];p}

// classes

/ object is the root of the class hierarchy

C.object.super:`
C.object[`render`public`initial`required`terminal]:5#,0#`
C.object.abstract:1
C.object.created:{[v]fire_[`created;v;()]}
C.object.destroyed:{[v]fire_[`destroyed;v;()]}

/ null is a gui object with no display

C.null.super:`object
C.null.public:`c
C.null.new:{[v;p;w]if[~in v;c:cl v;m:new[`panel,c;v;p;layout[c;v;w]];.m.set(`set;(`name,dot v;(`index;());`border,0));end m;of[c;`created;,v]]}
C.null.valid:{[c;v]1}
C.null.renew:{[v;i]1}
C.null.c:renew

/ basis of scrollable objects

C.scrollable.super:`object
C.scrollable.public:`scrollable`scrollborder`sg`hscroll`vscroll`hscrollp`vscrollp
C.scrollable.initial:`scrollborder`sg`hscroll`vscroll
C.scrollable.terminal:`hscrollp`vscrollp
C.scrollable.scrollable:renew
C.scrollable.abstract:1
cons'[`scrollable;`scrollborder`hscroll`vscroll`hscrollp`vscrollp;::];
cons[`scrollable;`sg;color]
vset'[`scrollable;`shscrollp`svscrollp;`hscrollp`vscrollp];

/ the basic visible gui object

C.gui.super:`object
C.gui.abstract:1
C.gui.depth:0
C.gui.rank:0
C.gui.frame:1
C.gui.required:`l
C.gui.initial:`async`ljust`lpos`help`lfg`lbg`lfont`font`fg`bg`mg`border`resize`xy`loc`titlebar`killpids
C.gui.terminal:With,`withs`look`theme`iconify`v`xy`loc`ontop
C.gui.render:0#`
C.gui.public:With,`type`panel`async`xeq`with`modal`ljust`lpos`resize`border`b`font`bg`fg`mg`lfg`lbg`lfont`l`v`c`help`look`theme`xy`loc`ontop`iconify`titlebar`on`killpids,!Layout
C.gui.atomic:0
C.gui.type:renew
C.gui.panel:renew
C.gui.modal:renew
C.gui.on:renew
C.gui.getmodal:{[v]:[_n~a:att[v;`modal];0;a]}
C.gui.with:renew
C.gui.withs:{[v;i]if[~_n~w:att[v;`with];cw_[v]' :[w~`;WITH;w]]}
C.gui.getecho:{[v]:[~jtrigger v;1;~v~VAR;1;~0~att[v;`echo]]}
C.gui.value:{[c;v;i]:[_n~i;(#:'of[c;`bang;,v])#dot[v]./:of[c;`all;(v;())];`. v,i]}
C.gui.attr:{[c;v;i;a]a}
C.gui.ji:{[c;v;i]i}
C.gui.imap:{[c;v;i](i;)}
C.gui.enlist:{[i;d]d}
C.gui.get:Get
C.gui.set:vSet
C.gui.new:{[v;p;w]New[v;p;w];of[cl v;`created;,v]}
C.gui.renew:Renew
C.gui.New:{[v]}
with'[`gui;With];
lcons'[`gui;`l`lbg`lfg`lfont;`label`lbg`lfg`lfont];
cons'[`gui;`ljust`lpos`border`async;::];
cons[`gui;`mg;color]
cons'[`gui;`help`s;($label@;{:[_n~x;x;#x;(),x]})];
C.gui.selflabel:0
C.gui.c:renew
event'[`gui;`k`km`kr`kk`kkm`kkr`lk`lkm`lkr`lkk`lkkm`lkkr];
event'[`gui;`ku`kd`kmu`kmd`kru`krd`lku`lkd`lkmu`lkmd`lkru`lkrd];
event'[`gui;`$"f",/:$1+!12];
LIST[`fg`bg`font`b]:(color;color;font;sym);list'[`gui;!LIST;LIST[]];
C.gui[!Layout]:renew
C.gui.first:{[v]}
C.gui.shape:{[v]shape`. v}
C.gui.Shape:{[v]}
C.gui.bang:{[v]@[name.s v;_n;{:[1=4:x;!x;x]}]}
C.gui.some:{[v;i]b:of[cl v;`bang;,v];.u.cross@:[#i;i{:[_n~*x,:();y;x@&x _lin y]}'b;b]}
C.gui.all:{[v;i]b:of[cl v;`bang;,v];.u.cross@:[#i;((#b)#i,(#b)#_n){:[x~_n;y;(),x]}'b;b]}
C.gui.isall:{[v;i]of[cl v;`all;(v;)]~i}
C.gui.close:{[v;i;x]:[_n~c:att[v;`close];d dot v;eval[`close;v;i;c]]}
C.gui.ping:{[v;i;d]if[1~att[v;`ping];ji[`ping;*d;1_ d;v;i]]}
C.gui.V:1
C.gui.refont:{[s;d;a] / C.gui.refont
  :[7=t:4:a;a
    6=t;d
    ~t;@[a;_n;_f[s;d]]
    (5=t)|~t>0;@[a;_n;_f[s;d]]
    _n~d;d
        `$1_,/" ",'$@[font3 a;2;:;font3[d]2]]}
C.gui.FONT:`d
C.gui.LFONT:`l
C.gui.ontop:{[v;i]if[~_n~r::[1~att[v;`modal];1;att[v;`ontop]];if[v~name.root v;.m.set(`set;(`name,name.frame v;(`index;());(`ontop;r)))]]}
C.gui.killpids:{[v;i]if[v~name.root v;.m.set(`set;(`name,name.frame v;(`index;());(`killpids;att[v;`killpids])))];} /if v is the root window, send the killpids attribute to the window's frame
C.gui.z:{[v;i;showing]if[showing;fire[`z;v;_n;_n]]} /if the object is showing, fire the z attribute function if there is one

C.gui.ask:{[v]*.m.get[(`ask;,`name,dot v)]1}

C.gui.v:{[v;i] /C.gui.v: visibility attribute processing. v is a k path to the widget, i is an index into the widget
 if[~b:`~p:name.parent v;if[0~the[cl undot p;`V];:_n]]
 f:frame v;a:att[v;`v] /get the frame and attribute values
 if[-1~a;.m.set(`pack;,`name,f);:_n]
 if[(1~a)&1~att[v;`iconify];.[`;jd[v],`iconify;:;0];.m.set(`set;(`name,f;(`index;());`iconify,0))]
 :[b                                 ;.m.set(`show`hide 0~a;,`name,f)
   1~the[cl undot p;`V]              ;.m.set(`show`hide 0~a;,`name,f)
                                      .m.set(`set;(`name,p;`index,dot v;(`showtab`hidetab 0~a;)))]
}

C.gui.loc:{[v;i]
 if[v~name.root v
  g:{.m.set(`set;(`name,name.frame v;(`index;());(`loc;x)));}
  if[~_n~o:att[v;`on];if[in o:undot dir name.chk o;f:{:[_n~r:att[x;y];0 0;r]};:g 0|f[o;`loc]+_.5*f[o;`xy]-f[v;`xy]]]
  if[~_n~a:att[v;`loc];g a]]
}

C.gui.titlebar:{[v;i]
 if[~_n~a:att[v;`titlebar]
  if[v~name.root v
   if[name.V v;:renew[v;i]]
   .m.set(`set;(`name,name.frame v;(`index;());(`titlebar;~0=a)))]]
}

top'[`gui;`look`theme`xy`resize`iconify;(::;::;xy;::;~0=)];
vset'[`gui;`ss`sxy`siconify;`s`xy`iconify];
Vset[`gui;`sloc;`loc]

/ Can't add these in net.k; they need to be set before the end of this script.
if[()~.j`NET
  C.gui.initial,:`autosize
  C.gui.terminal,:`autosize
  C.gui.public,:`autosize
  top[`gui;`autosize;::]]

/ the empty gui object

C.empty.super:`gui
C.empty.valid:{[c;v]1}
C.empty.class:`panel

/ the splash object

C.splash.super:`gui
C.splash.initial:`get`time
C.splash.public:`time
C.splash.frame:0
C.splash.valid:{[c;v]-3=4:`. v}
C.splash.renew:{[v;i]1}
C.splash.get:{[v;i].m.set(`set;(`name,dot v;(`index;());(`value;`. v)))}
cons[`splash;`time;::]

/ basis of all top-most windows

C.top.super:`gui
C.top.abstract:1
noop'[`top;!Layout;2];

/ basis of modal objects

C.modal.super:`top
C.modal.abstract:1
C.modal.get:{[v;i].m.set(`set;(`name,dot v;(`index;());(`value;`$$`. v)))}
C.modal.set:{[v;i;d].[`;jd[v],`v;:;0];ji[`set;{if[-3=4:`. x,y;z$:];.[`;x,y;upd[x;y];z];trigger[x;y]};(v;i;d);v;i]}
C.modal.l:{[v;i].m.set(`set;(`name,dot v;(`index;());(`label;:[_n~a:att_l v;dot@ss'v;label1 a])))}
C.modal.renew:{[v;i]~cl[v]=name.c v}

C.modal.v:{[v;i]
 :[~1~d:att[v;`v];if[`~name.with v;if[1~name.D v;.m.set(`hide;,`name,frame v)]]
                  if[~1~name.D v;.m.set(`set;(`name,dot v;(`index;());(`show;)))]]
 name.setD[v;d]
}

/ chooser object

C.chooser.super:`modal
C.chooser.public:`filetype`multiple`filter`filterdesc`type`newfile`ndfilter`ntfilter`fileimage / `kfs
C.chooser.initial:`filetype`multiple`filter`filterdesc`type`newfile`ndfilter`ntfilter`fileimage`get / `kfs
/ C.chooser.required:`kfs
C.chooser.valid:{[c;v]:[4:d:`. v;0;~2=#d;0;-3=4:*d]}
C.chooser.kfs:{[v;i].m.set(`set;(`name,dot v;(`index;());(`kfs;1~.v`g)))}
C.chooser.fileimage:{[v;i]if[~_n~a:att[v;`fileimage];.m.set(`set;(`name,dot v;(`index;!a);(`fileimage;`$$a[])))]}
C.chooser.get:{[v;i].m.set(`set;(`name,dot v;(`index;());(`value;{(x;:[y~_n;y;4:y;,(),y;y])}.`. v)))}
C.chooser.set:{[v;i;d].[`;jd[v],`v;:;0];if[~m:1~att[v;`multiple];d[1]*:];ji[`set;{.[`;x,y;upd[x;y];z];trigger[x;y]};(v;();d);v;()]}
C.chooser.cancel:{[v;i;d]:[~_n~c:att[v;`cancel];eval[`cancel;v;i;c]]}
noop[`chooser;`font;2]
cons'[`chooser;`ndfilter`ntfilter`filter`filterdesc`type`newfile`filetype`multiple;(raze;raze;raze;raze;::;::;::;::)];

/ dialog object

C.dialog.super:`modal
C.dialog.initial:`get`msg`icon`o
C.dialog.public:`msg`icon`o
C.dialog.valid:{[c;v]4=4:`. v}
C.dialog.o:{[v;i]name.setX[v;.+(o;ss'o:raze att[v;`o])];.m.set(`set;(`name,dot v;(`index;());(`o;name.X[v]o)))}
C.dialog.set:{[v;i;d]if[~_n~ol:name.X v;d:(!ol)ol[]?d];C.modal.set[v;i;d]}
C.dialog.ask:{[v]d:*.m.get[(`ask;,`name,dot v)]1;ol:name.X v;:[(#!ol)>i:ol[]?d;(!ol)i;d]}

wrap:{
 :[~-3=4:x              ;x                                      / not a char vector -> return
   (99<#x)&~"\n"_in x   ;_f 1_,/"\n",'.u.wrap[100;x]            / cut on words, wrap at 100
   20<+/n:"\n"=x        ;(((+\n)?21)#x)," ...";x]}              / maximum of 20 lines

cons'[`dialog;`msg`icon;(wrap ss@$:;{:[_n~x;`w;x]})];

/ input dialog

C.input.super:`dialog
C.input.valid:{[c;v](4:`. v)_in 4 -3}

/ frame

C.frame.super:`top
C.frame.abstract:1

C.frame.new:{[v;p;w]
 if[~in v;c:cl v
  of[c;`new;(v;q:new[`panel;name.i v;m:new[FRAMES of[c;`getmodal;,v];name.i v;p;`];L];0 0 1 1)]
  C.frame.l v;.m.set(`set;(`name,q;(`index;());`border,0))]
}

DEMO:"Copyright (c) 2000-2009 Conning Services (Ireland) Limited"

NEWFILE_NUMBER:: -1 /Current new file number for this session.
NEWFILENAMES:: () /list of the new file names that have been generated during this session
newfilename: {[preface] NEWFILE_NUMBER +: 1; newName: ($preface),($1+.h`I),:[NEWFILE_NUMBER<1;"";"-",($NEWFILE_NUMBER)]; NEWFILENAMES,: ,newName; newName} /Assigns and returns the next number to use for new files
processWindowTitle: {[titleList] /processWindowTitle: take a list of strings or symbols and format into one title string
  if[titleList[0] _sm "*&0*"; : label1 titleList] /If titleList is a .l.ss formated list, just process it and return the result
  titleList: $label1'titleList /else process each string through .l.ss as appropriate, no &x formating allowed
  paths: {(x _in NEWFILENAMES) | .f.isAbsolute x}'titleList /create boolean list where 1 indicates a filespec
  filespecs: paths
  titleList: @[titleList;&paths;.f.getName] / convert all absolute paths to just their filenames
  commas: {1 1~x,y}':0,filespecs  / determine consecutive filespecs
  titleList: @[titleList;&commas;", ",]  / commas prepended to consecutive filespecs
  if[1<#titleList; titleList[0],: ": "]  / append colon to window name if there is more than one item on the list
  ,/titleList}

C.frame.l:{[v]
 a:$:[~_n~APPLICATION; APPLICATION] /get the application name
 l:$:[~_n~DEMO;DEMO;_n~d:att_l v;dot(-1~the[cl v;`selflabel])_ v;(4:d) _in (0;-4);processWindowTitle d;label1 d]
 labelFormat: att[v;`labelFormat]
 /process the label formatting attribute if there is one
 l: :[_n~labelFormat /if there's no attribute, then use default of append as long as the frame isn't modal
        :[att[v;`modal]~1;l;l," - ",a]
      `prepend~labelFormat /prepend the app name
        a,l
      `none~labelFormat /don't add the app name at all
        l
        _ssr[l;labelFormat;a]] /else labelFormat must be a string that we should replace with the app name
.m.set(`set;(`name,name.frame v;(`index;());(`label;`$l)))
}

C.frame.lfg:{[v]}
C.frame.lbg:{[v]}
C.frame.lfont:{[v]}
C.frame.valid:{[c;v]1}

/ map is the general tree object

C.map.super:`gui`scrollable
C.map.depth:1
C.map.initial:`branches`sbg`sfg`fbg`ffg
C.map.terminal:`s`nsel`h`nv
C.map.public:`branches`h`s`sbg`sfg`fbg`ffg`nlbg`nlfg`nlfont`nl`ne`noimage`ncimage`nlimage`nsel`n`nl_`key`nv`setNodeVis
C.map.n:renew
C.map.nl_:renew
C.map.valid:{[c;v](5=4:d)|~@d:`. v}
C.map.Node:0
C.map.refont:{[s;d;a] /C.map.refont. s is font attribute e.g. `font,`nlfont etc, d is the default font attribute value, a is the current font attribute value
 :[7=t:4:a;a /if the attribute value is a function, return the function
   6=t;d /if the attribute value is null, return the default font value
   t=0; .[a;1,_n;_f[s;d]] /if the attribute value is a list (e.g. ((path list);font value for each path list entry),  return a, amended with font values produced by running this function against each font value
   _n~d;d /if the default value is null, return null
   `$1_,/" ",'$@[font3 a;2;:;font3[d]2]]} /else return something else, comment TBD
C.map.state:{[v]tree.open[dot v;_n]}
C.map.NLFONT:`rcl
C.map.h:{[v;i].m.set(`set;(`name,dot v;(`index;());(`h;att[v;`h])));of[cl v;`state;,v]}

C.map.new:{[v;p;w]
 if[~in v
  c:cl v
  m:new[`tree,c;v;p;layout[c;v;w]]
  of[c;`reset_n;,v]
  n:of[c;`root;(c;m;v)]
  of[c;`setV;(c;v;+,n)]
  initial[c;v]
  end m
  terminal[c;v]
  {of[c;`subchildren;(c;v;x)]}'n
  of[c;`created;,v]]
}

C.map.open_p:{[v;p]if[#q::[@p;p;(-(`. v,p)~.())_ p];.m.set(`set;(`name,dot v;(`index;:[q~_n;q;sym(),q]);(`open;)))]}
C.map.close_p:{[v;p].m.set(`set;(`name,dot v;(`index;:[p~_n;p;sym(),p]);(`close;)))}

C.map.root:{[c;m;v]
 n:of[c;`bang;,`. v]
 .m.set(`set;(`name,dot v;(`index;(,0#`),+,sym n);(`node;(,(*-1#v;1)),+(sym n;{of[c;`dir;,of[c;`dot;(v;x)]]}'n))))
 n}

C.map.children:{[v;i;d] /C.map.children: add k children in tree at path v,d to java tree
 c:cl v;e:is'd;n:of[c;`bang;,of[c;`dot;(v;e)]];f:e,/:n;g:d,/:m:sym n
 if[f~(); :_n ] /if there are no children to add i.e. the k folder is empty, just return, otherwise we send the entire tree's nodes down to java for no reason
 of[c;`setV;(c;v;f)]
 .m.set(`set;(`name,dot v;(`index;g);(`node;+(m;{of[c;`dir;,of[c;`dot;(v;x)]]}'f))))
 {of[c;`subchildren;(c;v;x)]}'f
}

C.map.subchildren:{[c;v;i]:[1~n:of[c;`get_n;(v;i)];of[c;`open_p;(v;i)];_n~n;of[c;`set_n;(v;(),i;0-~5=4:`. v,i)]]}
C.map.set_n:{[v;i;d]if[_n~n:att[v;`n];n:(();!0)];:[(#*n)>j:n[0]?i;n[1;j]:d;n:n,'(,i;d)];st[v;`n;n]}
C.map.get_n:{[v;i]:[_n~n:att[v;`n];;(#*n)>j:n[0]?(),i;n[1;j]]}

C.map.closed:{[v;i;d]of[cl v;`set_n;(v;p:is'd;0)];fire[`closed;v;p;_n]}

/ *** if folder is empty, don't allow it to get into the "opened" state:  close it.

C.map.opened:{[v;i;d]:[#!`. v,p:is'd;do[1;of[cl v;`set_n;(v;p;1)];fire[`opened;v;p;_n]];of[cl v;`close_p;(v;d)]]}

C.map.reset_n:{[v]
 if[~_n~n:att[v;`n]
  b:map.exists[d:`. v]'*n
  st[v;`n;+{(x;:[~atomic d . x;0|y;-1])}.'+n@\:&b]]
}

C.map.setV:{[c;v;i]
 of[c;`setVl;(v;i)]
 {if[~_n~a:att[v;x];setn[the[c;`Node];v;;;x;0;y;z]. seln[v;i;a]]}.'+NODE_ATTRIBUTES
}

C.map.dir:5=4::
C.map.dot:{`. x,y}
C.map.setVl:{[v;i]if[~0~att[v;`nl_];{.m.set(`set;(`name,dot v;(`index;,sym x);(`nl;,label@*-1#x)))}'i]}
C.map.bang:map.bang
C.map.first:{[v],*of[cl v;`bang;,v]}
C.map.match:{[v]:[@n:att[v;`n];0;map.match[`. v]. n]}
C.map.renew:{[v;i]c:cl v;:[~c=name.c v;1;~of[c;`match;,v]]}
C.map.shape:{[v]}
C.map.paths:paths
C.map.ss:{[v;i;d]C.gui.ss[v;i;is''d];.[`;jd[v],`key;:;""];}
C.map.skeystroke:{[v;i;d]if[{(x>31)&x<127}_ic d:*$d;.[`;jd[v],`key;(,;:)_n~att[v;`key];,d]]}
C.map.setNodeVis: {[v;i] /add Node Visibility attibutes to the current nv value of v and process nv
  setNodeVis[v] /set the value of nv
  C.map.nv[v;i] /process the nv attribute
 }

setNodeVis: {[v] /add Node Visibility attibutes to the current nv value of v
  setNodeVisAttr: att[v;`setNodeVis] /get the setNodeVis attibute value
  nvAttr: att[v;`nv] /get the nv attibute value
  :[(_n~nvAttr) | ((!0)~,/nvAttr) /if there aren't any existing non-visible attributes to process
    newNodeVis: setNodeVisAttr /then the new node visibility attribute value will just be nVisAttr
    do[1
      /else we need to modify the current nv value, adding nVisAttr to it
      paths: nvAttr[0] /create a list of the existing paths
      visVals: nvAttr[1] /create a list of the existing visibility values
      newNodeVis: ((paths,setNodeVisAttr 0);(visVals,setNodeVisAttr 1))
      ]]
  .[`;(attrpath v),`j,`nv;:;newNodeVis]
 }

C.map.nv: {[v;i] /C.map.nv: node visibility method implementation. v is k path to widget, i is the index into the widget
  nvAttr: att[v;`nv] /get the nv attibute value
  /if there aren't any non-visible attributes to process, just return
  if[(_n~nvAttr) | ((!0)~,/nvAttr) ; :_n]
  /else get the nv attibute value, removing any duplicates paths introduced by setNodeVisible or the k programmer.  This must be done here in order for tree tt to be created correctly
  nvAttr: *removeDupNV[nvAttr;_n]
  visI: () /default to no visible indices
  /if any of the nodes are becoming visible, we need to determine their position index under their parent node, taking into account any invisible nodes
  if[|/nvAttr 1
    /special processing flag.  If v isn't a dictionary, we'll assume it's a Def Editor left side tree, which is a list of one item, the dictionary.
    sp: :[5=4:`. v; 0; 1]
    tt: :[sp; (`. v)@0; `. v] /create a temporary copy of the tree
    invPaths: nvAttr[0]@invIndices: &0 = nvAttr 1 /create a list of the invisible paths
    visPaths: nvAttr[0] _di invIndices /create a list of the visible paths
    if[sp; invPaths: 1_'invPaths; visPaths: 1_'visPaths] /if special processing required, remove the index term from the beginning of each path
    /remove each of the invisible paths from the temp tree so we have a representation of what the tree should look like when we're done processing the nv attributes
    i: 0
    while[i<#invPaths
      p: invPaths[i]
      parent: :[hasChild: 1<#p; -1_ p] /If p has more than one term in its path, split p into a parent (everything but the last term in the path) and child path (the last term in the path) so we can remove the child
      if[~ _n ~ tt . p /if the path exists in the tree (they don't always due to lazy node loading
        tt: :[hasChild /if there is a child
              .[tt;parent;_di;-1#p] /remove the child from the parent path
               tt _di p] /else just remove p from the root of the tree
        ]
      i: i+1
      ]
    /Now find the index (relative to its parent) of each node becoming visible - that's where java needs to insert it into the tree
    /Expand of the visible paths to all their individual paths from the node itself on up to the root as all must be visible for the node itself to be visible
    expandedPaths: +,/treePathIndex[tt;]'visPaths
    visPaths: expandedPaths 0 /update the visible path list
    ciVisPath: expandedPaths 1 /save the child index for each visible path
    nvAttr: (,(invPaths,visPaths)),(,((#invPaths)#0),((#visPaths)#1)) /update the attribute value with the expanded lists
    ci: ((#invPaths)#-1),ciVisPath /create the corresponding child indices list. note: we give the invisible nodes indices of -1, since java doesn't use need a child index for invisible nodes
    /removed any duplicates caused by the expansion, giving preference to paths becoming visible over those that aren't.
    res: removeDupNV[nvAttr;ci]
    /Re-establish which paths are visible and keep their child indicies intact
    vi:  &1=res[0;1] /get the indicies of the visible paths
    visPaths: res[0;0;vi]
    ciVisPath: res[1;vi]
    invPaths: res[0;0] _di vi
    /Create a message for java, where all the nodes that are invisible are first, followed by the nodes to be made visible,
    /sorted by ascending path length (to insure the parent nodes are added before their children), and by index within path lengh so the nodes will be added at the correct index under that parent
    sorti: < vpLen: #:'visPaths
    vpLen: vpLen@sorti; ciVisPath: ciVisPath@sorti; visPaths: visPaths@sorti /sort each list so they continue to correspond
    lengroups: =vpLen /create groups of paths with the same length
    /sort each group by ascending ciVisPath within its length group
    res: {[i]
      v: ciVisPath@i
      sorti: < v
      ((visPaths@i)@sorti;(ciVisPath@i)@sorti)}'lengroups
    visPaths: ,/res[;0] /correct the shape
    ciVisPath: ,/res[;1] /correct the shape
    /Update nvAttr and ci, using the updated (sorted and duplicates removed) lists
    nvAttr: (,(invPaths,visPaths)),(,((#invPaths)#0),((#visPaths)#1))
    ci: ((#invPaths)#-1),ciVisPath
    /Update the object's nv attribute, removing any nodes that are about to become visible (which may include some that weren't explicitly set to 1 as they will be forced to become visible
    /if they are a parent of a node that was explicitly set to 1.  We remove them so we don't continue to reprocess them for nothing (they're already visible) every time the k programmer changes the nv attribute
    visI: ((nvAttr 0) ?/:visPaths) _dv (#nvAttr 0) /get an index list of all the nv attribute paths that are about to become visible
    if[sp; nvAttr[0]: {`"0",x}'nvAttr[0]] /if special processing, add the 0 index term back into each path
    ]
  .[`;(attrpath v),`j,`nv;:;(nvAttr[0] _di visI;nvAttr[1] _di visI)] /update the object's attribute value
  .m.set(`set;(`name,dot v;(`index;ci);(`nv;nvAttr)))
 }

/remove any duplicate nv attribute paths/values, keeping the visible over the non-visible entries if paths are the same
/nv is the nv attribute to cleanup, ci is the child index vector (may be null), returns a cleaned up nv and ci
removeDupNV: {[nv;ci] /removeDupNV
  paths: nv 0
  vals: nv 1
  i: =paths
  paths@: i[;0] /reduce paths by only keeping the first entry of each group (since all the entries are the same it doesn't matter which you keep)
  ci: :[_n~ci; _n; ci@{*x@>x}'i] /reduce the child index list by keeping the last entry of each group.  We need to sort descending each group of ci values to put the -1 (invalid indices) last, then take the first available indice.  This gives preference to valid indicies
  vals: |/'vals i /since vals are all 0's or 1's, or'ing them give preference to nodes becoming visible
  ((paths;vals);ci)}

/tree is a dictionary, path is a list of keys that make a single path into tree.
/Returns path broken into each individual path from the root to the last node in the path, and
/the index of the child of each path underneath its parent
treePathIndex: {[tree;path] /treePathIndex
  /If p has more than one term in its path, split p into a parent (everything but the last term in the path) and child path (the last term in the path) so we can remove the child
  parent: :[hasChild: 1<#path; -1_ path]
  :[hasChild /if there is a child
    : (,(path;(!tree . parent) ? *-1#path)),_f[tree;parent] /return path, and the index of the child underneath its parent, and recurse through the parent path
    : ,(path;(!tree) ? *path)] /else return path, and the index of path underneath the root of the tree
  }

C.map.key:{[v;i]
 if[#f:of[name.c v;`bang;,`. v]
  if[(s:att[v;`s])_in(;());s:,,*f]
  if[~(d:att[v;`key])_in(;"");l:c::[5=4:e:`. v,s*:;!e;!#e]
   if[~_n~n:att[v;`nl];j@:k:&(#*n)>j:n[0]?/:s,/:c;l[k]:n[1;j]]
   b:&.u.lc[l]_sm\:d,"*";w:name.c v;of[w;`open_p;(v;s)]
   if[~#b       ;.[`;jd[v],`key;:;-1_ d]]
   if[1=#b      ;.[`;jd[v],`key;:;""];.[`;jd[v],`s;:;,s,c b 0];of[w;`s;(v;())]]]]
}

cons'[`map;`s;{:[_n~x;x;#x;{:[1=4:x;`$$x;x]}''(),x]}];
cons'[`map;`branches`nsel;::];
cons'[`map;`sbg`sfg`fbg`ffg;color];

NODE_ATTRIBUTES:(`ne`nl`nlbg`nlfg`nlfont`noimage`ncimage`nlimage
                 ((),;label;color;color;font;$:;$:;$:)
                 0 0 1 1 1 1 1 1)

node[`map;0].'+NODE_ATTRIBUTES;
nevent'[`map;`kr`km`kk`kkm`kkr];
noop'[`map;`get`set`all`some`font;2 3 2 2 2];

/ tree is a map with dictionary as its k model

C.tree.super:`map
C.tree.valid:{[c;v]5=4:`. v}
C.tree.bang:{!:[-4=4:x;dot x;x]}

C.tree.set_n:{[v;i;d]st[v;`n;.[`. jd[v],`n;ad[i],`n;:;d]]} /set the value of the n attribute (node state) of node i in tree v
C.tree.get_n:{[v;i]`. jd[v],`n,ad[i],`n} /get the value of the n attribute (node state) of node i in tree v
C.tree.match:{[v]:[_n~n:att[v;`n];0;tree.match[n;`. v]]}

C.tree.reset_n:{[v]
 if[~_n~n:att[v;`n]
  b:tree.exists'[d:`. v;p:tree.paths n]
  q:{5=4:d . x}'p@:&b
  n:{i:ad[y],`n;.[x;i;:;:[z;0|n . i;-1]]}/[_n;p;q]
  st[v;`n;n]]
}

C.tree.show:{[v;i;b]
 if[~_n~d:of[cl v;`dot;(v;i)]
  .[k:`$".",@[w;&"."=w:1_,/"_",'$v,i;:;"_"];();:;d]
  :[b;.[~k;`j;:;`. v,ad[i],`j];.[~k;`j`l;:;,/".",'$v,i]]
  c:cl undot k;.[~k;`j`c;:;:[c=`tree;`Tree;c=`map;`Map;c]]
  .j.c k]
}

/ Map and Tree are automatic K object editors

C.Map.super:`map
C.Map.k:{[v;i;d]:[_n~att[v;`k];of[cl v;`show;(v;is'i)];nfire[`k;v;i;d]]}

C.Map.show:{[v;i]
 if[~_n~d:of[cl v;`dot;(v;i)]
  .[k:`$".",1_,/"_",'$v,i;();:;d]
  c:cl undot k;.[~k;`j`c;:;:[c=`tree;`Tree;c=`map;`Map;c]]
  .j.c k]
}

C.Tree.super:`tree
C.Tree.k:{[v;i;d]:[_n~att[v;`k];of[cl v;`show;(v;i;1)];fire[`k;v;i;d]]}
C.Tree.kr:{[v;i;d]:[_n~att[v;`kr];of[cl v;`show;(v;ad i;0)];fire[`kr;v;i;d]]}

/ menu is always an attribute (var..j.menu)

C.menu.super:`tree
C.menu.render:`lens
C.menu.public:`type`lens`acc`mnem`a
C.menu.initial:`nlbg`nlfg`nlfont`nl`ne`nv
C.menu.terminal:`acc`mnem`nv
C.menu.valid:{[c;v]5=4:`. v}
node[`menu;0].(`nv;(),;0) /for menus, override the inherited map/tree nv function to make it analogous to the ne attribute function

C.menu.new:{[v;p;w]
 if[~in v
  c:cl v
  p,::[@name.var p;name.frame name.var p;pframe[v;p]]
  m:new[c;v;p;`]
  name.setD[v;`. v]
  of[c;`root;(c;m;v)]
  initial[c;v]
  end m
  terminal[c;v]
  of[c;`created;,v]]
}

C.menu.root:{[c;m;v]a:of[c;`geta;,v];{of[c;`node;(c;m;0#`;x;y)]}'[a;(`. v)a]}
C.menu[`all`some]:{[v;i]?,/{(1+!#x)#\:x}' :[#i;{x@&i~/:(#i)#'x}name.s v;name.s v]}
C.menu.a:renew
C.menu.geta:{[v]:[_n~a:arr v;!`. v;(),a]}

C.menu.node:{[c;m;p;s;d]
 t:4:d;l:sym s;v:undot m
 a::[t=5;of[c;`gettype;(m;p,s)];t=1;`cleaf;t=3;`sleaf;~t;`rleaf;`leaf]
 b::[t _in 0 1;(l;d);t=3;;l]
 if[a=`rleaf
  x:name.X v
  if[_n~f:x . p,s
   name.setX[v;.[x;p,s;:;(b 1;f:sym b 1)]]
   f:(*b;f)]
  b:f]
 .m.set(`set;(`name,m;(`index;sym p,s);(a;b)))
 .m.set(`set;(`name,m;(`index;,sym p,s);(`nl;,label s)))
 if[a=`rleaf
  .m.set(`set;(`name,m;(`index;sym(p,s),/:b[1;1]);(`nl;label'b[1;1])))]
 if[t=5;_f[c;m;p,s]'[!d;d[]]]
}

C.menu.gettype:{[v;i]
 :[_n~a:att[undot v;`type]      ;`node
   atomic a                     ;`$($a),"node"
   (#*a)=j:a[0]?i               ;`node
                                 `$($a[1;j]),"node"]}

C.menu.Node:1
node[`menu;1;`mnem;label'(),;0]
node[`menu;0;`acc;,/{:[~_n~x;uc@$x]}';0]

C.menu.get:{[v;i]
 if[#i;if[i~,_n;i:()]
  t:4::'d:(n:dot v).'p@:&i~/:(#i)#'p:i,/:of[cl v;`paths;`. v,i]
  j:&{0~*|x}'p;ii:-1_'p j;dd:*:'d j;j:&t=1;ii,:p j;dd,:+,d j
  .m.set(`set;(`name,n;(`index;ii);(`value;dd)))]
}

C.menu.set:{[v;i;d]
 i:is''i;c:cl v;f:the[c;`setself]
 if[~t:4:k:`. v,i;x:name.X v;if[~_n~b:x . i;d:b[0;1;b[1;1]?d]]]
 ak v,i;:[1=t;f .(v;i;d);~t;f .(v;i,0;d);6=t;f .(v;i;);r:eval[`set;v;i;k]];dk v,i
 r}

C.menu.renew:{[v;i]c:cl v;if[~c=name.c v;:1];if[~of[c;`changed;(name.D v;`. v)];:0];name.setD[v;`. v];1}
C.menu.changed:{[o;n]:[o~n;0;~(p:paths o)~q:paths n;1;|/{:[~(4:x)~t:4:y;1;t;0;~x[1]~y 1]}'[o ./:p;n ./:q]]}
C.menu.setself:{[v;i;d]ji[`set;{if[~_n~z;.[`;x,y;upd[x;y];z]];trigger[x;y]};(v;i;:[~_n~d;cast[d;`. v,i]]);v;i];}
C.menu.type:renew
list[`menu;`lens;::]
C.menu.setV:{[c;v;i]}
noop'[`menu;`l`n;2];
noop'[`menu;!Layout;2];

/ popup is always an attribute:  var..j.popup

C.popup.super:`menu
C.popup.valid:{[c;v]5=4:`. v}
C.popup.new:{[v;p;w]if[~in v;c:cl v;m:new[c;v;p;`];of[c;`root;(c;m;v)];initial[c;v];end m;terminal[c;v];of[c;`created;,v]]}
noop[`popup;`v;2]

/ basis of all containers

C.container.super:`gui
C.container.abstract:1
C.container.public:`a
C.container.depth:1

C.container.new:{[v;p;w]
 if[~in v
  c:cl v;g:of[c;`arrange;,v];m:new[c;v;p;layout[c;v;w]];initial[c;v]
  {of[cl v,x;`new;(v,x;m;y)]}'[!g;g[]];end m;terminal[c;v];of[c;`created;,v]]}

C.container.a:renew
C.container.arrange:{[v]:[#s:of[cl v;`shape;,v];.+(*s;_n);.()]}
C.container.shape:{[v]:[_n~a:arr v;,!dot v;,(?,//a)_dv`]}
C.container.layout:{[c;v;w]`}

C.container.removeall:{[v].m.set`removeall,,,`name,dot v}

C.container.del.var:{[v;c;k;a]if[c _in,/a;d dot v,c;of[k;`layout_arrange;(v;of[k;`layout_null;(c;a)])]]}

C.container.ins.var:{[v;c;k;a;e;m]
 if[~c _in,/a
  e:of[k;`layout_reshape;,e]
  of[cl v,c;`new;(v,c;m;e)]
  of[k;`layout_arrange;(v;of[k;`layout_set;(a;e;c)])]]
}

C.container.app.var:{[v;c;k;a;m]
 if[~c _in,/a
  e:of[k;`layout_reshape;,of[k;`layout_next;,a]]
  of[cl v,c;`new;(v,c;m;e)]
  of[k;`layout_arrange;(v;of[k;`layout_set;(a;e;c)])]]
}

C.container.layout_null:{[c;a]:[~@a;_f[c]'a;a~c;`;a]}
C.container.layout_reshape:{[e]e,(- 4-#e)#0 0 1 1}
C.container.layout_set:{[a;e;c]:[@a;c;4:a;@[a;e[0]+!e 2;:;c];.[a;e[0 1]+!:'2_ e;:;c]]}
C.container.layout_next:{[a]:[@a;~a=`;4:a;a?`;(^a)_vs(,/a)?`]}
C.container.layout_arrange:{[v;a]st[v;`a;a];name.reshape v;of[cl v;`layout_reset;(v;a)];jiggle dot v}
C.container.layout_reset:{[v;a]}
noop'[`container;`get`set`font;2 3 2];

/ desktop object -- not fully implemented

C.desktop.super:`container
C.desktop.valid:{[c;v](4:`. v)_in 5 6}

/ panel container

C.panel.super:`container
C.panel.public:`geometry
C.panel.geometry:renew
C.panel.getgeometry:{[v]~0~att[v;`geometry]}
C.panel.valid:{[c;v](4:`. v)_in 5 6}
C.panel.arrange:{[v]:[0_in^s:of[c:cl v;`children;,v];.();of[c;`getgeometry;,v];extent s;@[_n;*of[c;`shape;,v];:[;0 0 1 1]]]}
C.panel.children:{[v]:[_n~a:arr v;+,!dot v;vmat a]}
C.panel.layout:{[c;v;w]setl'[`gridy`gridx`gridheight`gridwidth;w];repl v;L}

/ tab container

C.tab.super:`container
C.tab.public:`tabs`tab`scroll
C.tab.terminal:`tab`scroll
C.tab.V:-1
C.tab.initial:`tabs
C.tab.valid:{[c;v](4:`. v)_in 5 6}
C.tab.iL:{[s;t;v;i].m.set(`set;(`name,dot v;(`index;dot v,i);(`$"i",$t;labels[s]v,i)))}
cons'[`tab;`tabs`scroll;::];
C.tab.removeall:{[v]}
C.tab.layout:{[c;v;w]setl[`tpos;:[_n~a:arr p:-1_ v;!dot p;a _dv`]?*-1#v];L}

C.tab.stab:{[v;i;d] /C.tab.stab: handle java message to update the current tab (user has clicked on a new tab)
  w:jd v /get the object's java attribute dictionary
  .[dot w;`tab;:;*-1#undot d] /modify the dictionaries currently selected tab value with the new tab selection from java
  dj w,`tab /write the java attribute dictionary back to the object
  fire_t w,`tab} /fire a tab changed event for the new tab selection

C.tab.tab:{[v;i] /C.tab.tab: set the current tab (k programmer set the tab value to something)
  if[_n~a:att[v;`tab] /if there is no currently selected tab (e.g k programmer set it to null)
    a:*:[_n~b:arr v;!dot v;b] /get a default value
    .[`;attrpath[v],`j,`tab;:;a] /set the selected tab attribute on the object to match
    ]
  .m.set(`set;(`name,dot v;(`index;());(`tab;`$($dot v),".",$a))) /send the value to java so java makes it the selected tab
}
C.tab.ins.var:{[v;c;k;a;e;m]}
C.tab.layout_null:{[c;a]a _dv c}
C.tab.layout_reshape:{[e]e}
C.tab.layout_set:{[a;e;c]a,c}
C.tab.layout_next:{[a]#a}
C.tab.layout_reset:{[v;a]if[~att[v;`tab]_in a;.[`;jd[v],`tab;:;*a]]}

/ C.outlookbar.super:`tab

/ C.slidetab.super:`tab

/ split container

C.split.super:`container
C.split.public:`dir`div`divsize`divweight
C.split.initial:`dir`div`divsize`divweight
C.split.valid:{[c;v]:[~5=4:d:`. v;0;_n~a:arr v;3>#!` . v;3>#,/a]}
cons'[`split;`dir`div`divweight`divsize;::];
C.split.arrange:{[v]@[.();s;:;(#s:*of[cl v;`shape;,v])#`tl`br]}
C.split.layout:{[c;v;w]setl[`pos;w];L}
C.split.sdiv:{[v;i;d]w:jd v;.[dot w;`div;:;*d];dj w,`div;fire_t w,`div}
C.split.sdivweight:{[v;i;d]w:jd v;.[dot w;`divweight;:;*d];dj w,`divweight;fire_t w,`divweight}
C.split.layout_reshape:{[e]e}
C.split.layout_set:{[a;e;c]@[a;`tl`br?e;:;c]}
C.split.layout_next:{[a]a?`}

/ toolbar container

C.toolbar.super:`container
C.toolbar.public:`floatable`rollover`dir`sepSize
C.toolbar.initial:`floatable`rollover`dir
C.toolbar.valid:{[c;v](4:`. v)_in 5 6}
C.toolbar.constraint[`fill`wy`anchor]:`h,0.,`w
cons'[`toolbar;`floatable`rollover`dir;::];

C.toolbar.new:{[v;p;w]
 if[~in v
  c:cl v;g:of[c;`arrange;,v];a::[_n~a:arr v;!g;,//a];m:new[c;v;p;layout[c;v;w]];initial[c;v]
  i:0;do[#a;:[`=a i;.m.set(`set;(`name,dot v;(`index;());(`sep;att[v;`sepSize])));of[cl v,a i;`new;(v,a i;m;g a i)]];i+:1];end m;terminal[c;v];of[c;`created;,v]];jiggle[dot v]}

/ window container (panel with scrollbars)

C.window.super:`panel`scrollable
C.window.public:`sx`sy
C.window.initial:`sx`sy
cons'[`window;`sx`sy;::];

/ basis of all capital classes

C.Data.super:`object
C.Data.abstract:1
C.Data.public:`operations
C.Data.rectangular:1

C.Data.operations:renew

C.Data.getoperations:{[v]
 c:cl v;d::[_n~the[c;`Rows];4;0]
 o:.+(d _`Insert`Append`Delete`s`Cut`Copy`Copy_All`Paste;d _(Ins.row;App.row;Del.row;" ";Cut;Copy;Copy_All;Paste))
 if[2=the[c;`rank];o[`Paste_Transpose]:Paste_Transpose]
 if[0~att[v;`e];o:{x _di y@&y _lin!x}[o;`Insert`Append`Delete`s`Cut`Paste`Paste_Transpose]]
 a::[_n~a:att[v;`operations];!o;a@&a _lin!o]
 .+(a;o a)}

C.Data.New:{[v]
 j:jd v;c:cl v
 o:!a:of[c;`getoperations;,v]
 if[5=4:q:att[v;`popup]
  q:q _di(!q)@&_n~'q[]
  a:@[@[a;`s99;:;" "];!q;:;q[]]]
 .[`;j,`popup;:;a]
 ne:++(+,!`. j,`popup;`Append=!`. j,`popup)
 if[`Copy_All _in,/*ne;ne[1;(,/*ne)?`Copy_All]:1]
 .[`;j,`popup.`j`ne;:;ne]
 .[`;j,`krd;:;the[c;`Sel]]
}

C.Data.Sel:{
 c:cl v:.j.v;p:!att[v;`popup]
 if[(~1~the[c;`alwaysSel])&empty s:att[v;`s]
  k:(+,p;-1_@[&q,(1+#p)-q:p?`s99;p?`Append;:;1])
  if[`Copy_All _in,/*k;k[1;(,/*k)?`Copy_All]:1]
  .[`;jd[v],`popup.`j`ne;:;]
  :_n]
 k:++(+,p;:[(~name.rank v)|#s   ;:[#b:&(o:`Paste`Paste_Transpose)_lin p
                                   @[&0,#p;p?/:o b;:;|/((),the[cl v;`cbformats])_lin .w.cbformats[]]
                                   &0,#p]
                                 0])
 if[`Copy_All _in,/*k;k[1;(,/*k)?`Copy_All]:1]
 if[`Append _in,/*k;k[1;(,/*k)?`Append]:1]
 k:.[k;(1;((,/*k)?`s99)_!#*k);:;1]
 .[`;jd[v],`popup.`j`ne;:;k]
}

/ basis of all capital_ objects

False:`w /this must stay this color as all the right click menu items for selection e.g. All, With, Only etc. check the cell backgound color (which defaults to `w) against False to see if it's unselected.
True:`scrollbarblue
Null:`e
NoExtraSpace: .0000000001 /what you should assign wy or wx to when you don't want any extra space given to a widget

C.Data_.super:`Data
C.Data_.abstract:1
C.Data_.public:`All`None`Operations`Null`Check
C.Data_.O:`All`None`s0`Only`Except`s1`With`Without`In`s2`Up`Down`s3`Copy_Selection`Paste_Selection
C.Data_.Check:renew
C.Data_.All:renew
C.Data_.None:renew
C.Data_.Operations:renew
C.Data_.Null:renew
C.Data_.true:{[v]:[1~att[v;`Check];1;_n~a:att[v;`True];True;a]}
C.Data_.false:{[v]:[1~att[v;`Check];0;_n~a:att[v;`False];False;a]}
C.Data_.null:{[v]:[1~att[v;`Check];0N;_n~a:att[v;`Null];Null;a]}

C.Data_.operations_:{[v]
 c:cl v
 o:the[c;`O]
 if[_n~u:att[v;`Operations];u:o _dvl`s0`s1`s2`s3]
 o@:&o _lin u,`s0`s1`s2`s3
 o:.u.dlte[o;`s0`s1`s2`s3]
 p:`$($o),'"_"
 if[_n~ne:`. jd[v],`popup.`j`ne;ne:(();!0)]
 i:&~(*ne)_lin+,o
 ne[0]:(+,o),ne[0;i];ne[1]:((#o)#0),ne[1;i]
 j:.,`j,.,(`ne;ne)
 (.+(o;the[c]'[p]);j)}

C.Data_.New:{[v]
 c:cl v
 if[~1~att[v;`Check]
  .[`;jd[v],`kk;:;the[c;`KK_]]
   if[_n~att[v;`e];.[`;jd[v],`e;:;0]]]
 C.Data.New v
 p:of[c;`operations_;,v]
 if[5=4:q:att[v;`popup]
  q:q _di(!q)@&_n~'q[]
  p[0]:@[@[*p;`s99;:;" "];!q;:;q[]]]
 .[`;jd[v],,`popup`popup.;:;p]
 if[7=4:att[v;`Set]
  .[`;jd[v],`Set_;:;the[c;`set_]]
  .[`;jd[v],`Get_;:;the[c;`get_]]]
 if[1~att[v;`Check]
  .[`;jd[v],`t;:;att[v;`Set]]]
 of[c;`set_;(`New;v;of[c;`get_;,v])]
.[`;jd[v],`krd;:;the[c;`Sel]]
}

C.Data_.Sel:{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
}

C.Data_.All_:{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`All;v;of[c;`all_;,v])]}
C.Data_.None_:{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`None;v;())]}
C.Data_.Only_:{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Only;v;of[c;`selected_;,v])]}
C.Data_.Except_:{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Except;v;of[cl v;`all_;,v]_dvl of[c;`selected_;,v])]}
C.Data_.With_:{[x]C.Data_.With_v[x;ad -2_.j.v]}
C.Data_.Without_:{[x]C.Data_.Without_v[x;ad -2_.j.v]}
C.Data_.With_v:{[x;v]c:cl v;of[c;`set_;(`With;v;?of[c;`get_;,v],of[c;`selected_;,v])]}
C.Data_.Without_v:{[x;v]c:cl v;of[c;`set_;(`Without;v;of[c;`get_;,v]_dvl of[c;`selected_;,v])]}
C.Data_.In_:{[x]c:cl v:ad -2_.j.v;s:of[c;`get_;,v];of[c;`set_;(`In;v;s@&s _lin of[c;`selected_;,v])]}
C.Data_.Up_:{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;<:)]} /sort data up
C.Data_.Down_:{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;>:)]}  /sort data down
C.Data_[`Only__`Except__`With__`Without__`In__]:{[v]~empty of[cl v;`selected_;,v]}
C.Data_[`Copy_Selection__`Up__`Down__]:{[v]~1~att[v;`Check]}
C.Data_.Paste_Selection__:{[v]:[1~att[v;`Check];0;`DFA_ _in .w.cbformats[]]}
C.Data_.Copy_Selection_:{[x]c:cl v:ad -2_.j.v;of[c;`copy_;(c;v)]}
C.Data_.Paste_Selection_:{[x]c:cl v:ad -2_.j.v;of[c;`paste_;(c;v)]}
C.Data_[`s0_`s1_`s2_`s3_]:" "
C.Data_.KK_:{c:cl .j.v;the[c]'[`With_v`Without_v][|/,//of[c;`true;,.j.v]=`. jd[.j.v],`bg,.j.i][_n;.j.v]}
C.Data_.K_:{c:cl .j.v;the[c]'[`With_v`Without_v][|/,//of[c;`true;,.j.v]=`..j.v,.j.i][_n;.j.v]}

/ basis of all data objects

C.data.super:`gui
C.data.abstract:1
C.data.rectangular:0
C.data.rank:0
C.data.initial:`getshape`get`sbg`sfg`fbg`ffg`cg`autoscroll`pack`geteditor
C.data.terminal:`s`h
C.data.public:`tip`cell`align`scale`f`g`h`s`sbg`sfg`fbg`ffg`e`cg`trim`autoscroll`pack`editor`format
C.data.render:`tip`e`fg`bg`b`font`trim`mg`sg
DLIST:`scale`f`g`tip`trim`cell,!LIST
C.data.getshape:{[v;i].m.set(`set;(`name,dot v;(`index;());(`shape;name.s v)))}

C.data.geteditor:{[v;i]
 if[_n~a:att[v;`editor];a:2]
 c:cl v
 s:*of[c;`shape;,v]
 r:the[c;`rank]
 n::[2=r;s;1]
 a::[5=4:a;@[a;&_n~'a@:n;:;2];:[@n;n;#n]#a]
 .m.set(`set;(`name,dot v;(`index;());(`editor;a)))
}

C.data.editor:renew
C.data.getcell:{[v;i;d]}
C.data.datcell:{[v;i;r]:[-4 _in 4::'r;datcell r;_f[v;i]'r]}

C.data.scalecell:{[v;i;d]
 if[_n~s:att[v;`scale];:d]
 c:cl v
 s:at[by[name.s v;of[c;`attr;(c;v;i;s)]];v;of[c;`mod;(v;i)]]
 of[c;`scalecell_;(v;i;d;s)]}

C.data.scalecell_:{[v;i;d;s]:[-4 _in 4::'d;. scalecell[. d;s];d _f[v;i]'s]}

C.data.scale_cell:{[v;i;d]
 if[_n~s:att[v;`scale];:d]
 c:cl v
 s:at[by[name.s v;of[c;`attr;(c;v;i;s)]];v;of[c;`mod;(v;i)]]
 :[1=4:d;_ d*10^-s;d*10^-s]}

C.data.lrc:{[v;i;d]
 c:cl v
 $:[_n~f:att[v;`align]  ;align d
                         apply[::;:;at[by[name.s v;of[c;`attr;(c;v;i;f)]];v;of[c;`mod;(v;i)]];d]]}

C.data.out:{[v;i;d]
 c:cl v
 :[*.[.;(`;v,i);:];"";of[c;`out_;(c;v;i;:[_n~k:of[c;`getcell;(v;i;d)];d;outcell[k;d]])]]}

C.data.out_:{[c;v;i;d]
 if[~_n~s:att[v;`scale];d:apply[::;scale;at[by[name.s v;of[c;`attr;(c;v;i;s)]];v;of[c;`mod;(v;i)]];d]]
 :[_n~f:att[v;`f];format d;apply[::;Fmt[v];at[by[name.s v;of[c;`attr;(c;v;i;f)]];v;of[c;`mod;(v;i)]];d]]}

C.data.in:{[v;i;d]
 c:cl v
 s::[*r:.[.;(`;v,i);:];;of[c;`in__;(c;r 1;v;i;of[c;`in_;(c;r 1;v;i;:[_n~k:of[c;`getcell;(v;i;d)];d;incell[v;i;r;k;d]])])]]
 s}

C.data.in_:{[c;r;v;i;d]
 :[~-3=4:d                                                              ;d
   _n~f:att[v;`g]                                                       ;io[r;d]
   _n~g:at[by[name.s v;of[c;`attr;(c;v;i;f)]];v;of[c;`mod;(v;i)]]       ;io[r;d]
                                                                         apply[::;:;cnv_ g;d]]}
C.data.in__:{[c;r;v;i;d]
 :[~(4:d)_in 1 2                                                        ;d
   _n~f:att[v;`scale]                                                   ;d
   _n~g:at[by[name.s v;of[c;`attr;(c;v;i;f)]];v;of[c;`mod;(v;i)]]       ;d
                                                                         apply[::;scale_;g;d]]}

C.data.io:{[v;i;d]
 if[-3=4:d;:0]
 if[(4:d)=t:4:`. v,i;:0]
 e io_error[t;dot v]
 1}

C.data.atomic:1
C.data.mod:{[v;i]i}
C.data.reshape:{[v;d]}
C.data.cbformats:`k`Csv`CSV
C.data[`cell`align`scale`f`g`format]:refresh
cons'[`data;`h`autoscroll`pack;::];
cons'[`data;`cg`sbg`sfg`fbg`ffg;color];
atom'[`data;`fg`bg`font`e`trim`tip`b;(color;color;font;edit;edit;label;sym)];

/ large object support

C.big.super:`data
C.big.abstract:1
C.big.initial:`kshape
C.big.renew:{[v;i]c:cl v;:[~c=name.c v;1;~of[c;`shape;,v]~name.s v;1;~of[c;`Shape;,v]~name.S v;1;0]}
C.big.reset:{[v]name.reshape v;name.reShape v;}
C.big.kshape:{[v;i].m.set(`set;(`name,dot v;(`index;());(`kshape;name.S v)))}
C.big.block:{[r;c;f;rc;cc](ROWS,COLS)|(ROWS,COLS)&:[(rc*cc)<f*m:r*c;rc,cc;rc<f*r;rc,-_-m%rc;cc<f*c;(-_-m%cc),cc;t,-_-m%t:-_-rc%-_-rc%r]}
ROWS:200
COLS:100

/ large on the rows dimension

C.rows.super:`big
C.rows.abstract:1
C.rows.public:`rows
C.rows.initial:`getav`getrows
C.rows.getrows:{[v;i].m.set(`set;(`name,dot v;(`index;());(`block;of[cl v;`myrows;,v])))}
C.rows.rows:renew

/ large on the cols dimension

C.cols.super:`big
C.cols.abstract:1
C.cols.public:`cols
C.cols.initial:`getbv`getcols
C.cols.getcols:{[v;i].m.set(`set;(`name,dot v;(`index;());(`cblock;of[cl v;`mycols;,v])))}
C.cols.cols:renew

/ the pivot object

C.pivot.super:`rows`cols`scrollable
C.pivot.initial:`reShape`hgrid`vgrid`getri`getci`acg`rcg`ccg`ebg`getshape`aebg`rebg`cebg`al`altip`alfg`albg`alfont`rclfg`rclbg`rclfont /getshape added here simply to override order of initialization. getshape must occur before aebg
C.pivot.public:`pivot`hgrid`vgrid`ax`axo`a`al`altip`alfg`albg`alfont`rcl`rclfg`rclbg`rclfont`sr`sc`acg`rcg`ccg`ebg`aebg`rebg`cebg`translate
C.pivot.terminal:`alV`pivot`rcl
C.pivot.rank:1
C.pivot.valid:{[c;v]:[~#d:`. v;1;0>t:4:d;1;t;0;&/atomic'd]}
C.pivot.New:{[v]st[v;;_n]'`s`sr`sc`S`SR`SC`SRC;}

C.pivot.translate:renew
C.pivot.ax:renew
C.pivot.axo:renew
C.pivot.a:renew
C.pivot.enlist:{[i;d]:[~4:d;d;&/1=#:'i;,d;d]}
C.pivot.reshape:{[v;d](#`. v)#d}
C.pivot.all:{[v;i]}
C.pivot.some:{[v;i]:[~_n~*i;i]}
C.pivot.first:{[v]:[#`. v;0]}

C.pivot.alV:{[v;i]if[_n~att[v;`al];setp[`al;:[~0~att[v;`translate];`$sa@;::];v;,/of[cl v;`arrange;,v]]]}

C.pivot.renew:{[v;i]c:cl v;:[~c=name.c v;1;~of[c;`shape;,v]~name.s v;1;0]}

C.pivot.shape:{[v],#`. v}
C.pivot.kshape:{[v;i].m.set(`set;(`name,dot v;(`index;());(`kshape;(*|2#^:)'name.S[v]0)))}
C.pivot.rshape:{[v]c:cl v;of[c;`myrows;,v]&*|2#^name.S[v][0;0]}
C.pivot.cshape:{[v]c:cl v;of[c;`mycols;,v]&*|2#^name.S[v][0;1]}

C.pivot.Shape:{[v]
 c:cl v					/ class of variable v
 ax:of[c;`getax;,v]			/ axis dictionary of variable v
 a:of[c;`arrange;,v]			/ (axes along rows ; axes along columns)
 axo:of[c;`getaxo;,v]			/ dictionary of axis orderings
 s::[~#`. v;(();())			/ if variable v is empty, then (();())
            {{:[~#x;();   x[;{x y z x}/[_n;<:;|y?/:'x]]]}[+?+ax a x;axo a x]}'0 1 ]
 /          {{:[~#x;();+?+x[;{x y z x}/[_n;<:;|y?/:'x]]]}[   ax a x;axo a x]}'0 1 ] / worse performance
 /          {{:[~#x;();   x[;<+                y?/:'x ]]}[+?+ax a x;axo a x]}'0 1 ]
 /          {{:[~#x;();   x[;<(#:'y)_sv    1.0*y?/:'x ]]}[+?+ax a x;axo a x]}'0 1 ]
 /          {{:[~#x;();   x[;<(#:'y)_sv        y?/:'x ]]}[+?+ax a x;axo a x]}'0 1 ] / wrong answer if integer overflow
					/ (row axes values for each row sorted ; column axes values for each row sorted)
 b:,/a					/ axes along rows and columns
 u:axo b				/ axis orderings for the axes in b
 w:#:'u					/ number of unique values for the axes in b
 q::[(*/1.0*w)<-2+2^31			/ if no integer overflow problem,
     w _sv u?/:'ax b			/ for each item of the pivot, the encoding of its axis values looked up in the axis orderings
     +ax b ]				/ otherwise, list of coordinates
 (s
  axo@/:a
  (w
   q
   _n
   _n ))}

C.pivot.getaxo:{[v]
 ax:of[c:cl v;`getax;,v]
 if[_n~axo:att[v;`axo];:@[ax;_n;?:]]
 if[#a:(!ax)_dvl!axo;axo[a]:?:'ax a]
 axo}

C.pivot.setaxo:{[v].[`;jd[v],`axo;:;@[of[cl v;`getax;,v];_n;?:]];}

C.pivot.reShape:{[v;i]
 k:cl v							/ class of variable v
 r:of[k;`rbang;,v]					/ the indices of the rows being displayed, taking blocking into consideration
 c:of[k;`cbang;,v]					/ the indices of the columns being displayed, taking blocking into consideration
 t:name.S v						/ t[0;0]: row axes values for each row (# axes on rows by # rows)
							/ t[0;1]: column axes values for each column (# axes on columns by # columns)
							/ t[1;0]: for each axis on rows, the ordered list of unique values
							/ t[1;1]: for each axis on columns, the ordered list of unique values
							/ t[2;0]: #:'t[1;0],t[1;1]
							/ t[2;1]: for each item of the pivot, the encoding of (its axis values looked up in the axis orderings)
							/ t[2;2]: see below
							/ t[2;3]: see below
 s:t 0
 m:at1[s[0];r]						/ row axes values, for the rows being displayed (# axes on rows by # rows displayed)
 n:at1[s[1];c]						/ column axes values, for the columns being displayed (# axes on columns by # columns displayed)
 mn::[~#m;n
      ~#n;m
      m[;*i],n[;*|i:i _vs!*/i:(*|2#^:)'(m;n)] ]		/ for each axis in the rows and columns,
							/ the axis values for each cell in the rectangle being displayed, in row-major order
							/ not a potential integer overflow? (# rows displayed * # columns displayed)
 t[2;2]::[(*/1.0*t[2;0])<-2+2^31			/ if no integer overflow problem,
          t[2;0]_sv(,/t 1)?/:'mn			/ t[2;2]: for each cell in the rectangle being displayed, in row-major order, the encoding of the axis values looked up in the ordered list of unique values for each axis on the rows and columns
          +mn ]						/         otherwise, list of coordinates
 t[2;3]:(1|*|2#^:)'(m;n)				/ t[2;3]: (# rows being displayed ; # columns being displayed) / what is the 1| doing???
 name.setS[v;t]						/ store t in N.S for v
}

C.pivot.sav:{[v;i;d]c:cl v;name.setR[v;:[~d~of[c;`rshape;,v];d]];of[c;`reShape;(v;)];of[c;`getri;(v;)];of[c;`rc;(c;v)];@[dot v;_n;::];}
C.pivot.rbang:{[v]:[_n~a:name.R v;!of[cl v;`rshape;,v];a]}
C.pivot.getav:{[v;i]r:{:[#x;x;,0]}of[cl v;`rbang;,v];if[_n~name.R v;name.setR[v;r]];.m.set(`set;(`name,dot v;(`index;());(`av;r)))}

C.pivot.sbv:{[v;i;d]c:cl v;name.setC[v;:[~d~of[c;`cshape;,v];d]];of[c;`reShape;(v;)];of[c;`getci;(v;)];of[c;`rc;(c;v)];@[dot v;_n;::];}
C.pivot.cbang:{[v]:[_n~a:name.C v;!of[cl v;`cshape;,v];a]}
C.pivot.getbv:{[v;i].m.set(`set;(`name,dot v;(`index;());(`bv;{:[#x;x;,0]}of[cl v;`cbang;,v])))}

C.pivot.rc:{[c;v]of[c;;(v;)]'`rcl`rclbg`rclfg`rclfont;}

C.pivot.arrange:{[v]if[~#b:!of[cl v;`getax;,v];:b];:[_n~a:arr v;(0,1|_.5*#b)_ b;4:a,:();(a;b _dvl a);#,/a;(),/:a;(0,1|_.5*#b)_ b]}
C.pivot.getax:{[v]if[~#`. v;:.()];:[#!t:att[v;`ax];t;.,(`N;!#`. v)]}
C.pivot.geti:{[g;n;f;v;i]c:cl v;.m.set(`set;(`name,dot v;(`index;());(`rows`cols n;f@$$+at1[name.S[v][0;n];of[c;g;,v]])))}
C.pivot.getri:C.pivot.geti[`rbang;0;::]
C.pivot.getci:C.pivot.geti[`cbang;1;+:]
C.pivot.order:{[v]c:cl v;(!of[c;`getax;,v])?/:,/of[c;`arrange;,v]}
C.pivot.getai:{[v]:[#a:of[cl v;`arrange;,v];+(((#*a)##a 1),!#a 1;(!#*a),(#a 1)##*a);a]}
C.pivot.getshape:{[v;i]a:of[cl v;`arrange;,v];.m.set(`set;(`name,dot v;(`index;());(`shape;:[#a;a;2#,0#`])))}
C.pivot.myrows:{[v]if[~_n~r:att[v;`rows];:r];of[cl v;`block;(100;:[_n~c:att[v;`cols];50;c];2),(*|2#^:)'*name.S v]0}
C.pivot.mycols:{[v]if[~_n~c:att[v;`cols];:c];of[cl v;`block;(:[_n~r:att[v;`rows];100;r];50;2),(*|2#^:)'*name.S v]1}
C.pivot.value:{[c;v;i](`. v)of[c;`find;(c;v;i)]}
C.pivot.imap:{[c;v;i]s:name.S[v][2;2 1 3];(s[2]_vs of[c;`find_;(*s;*s;s[1]i)];)}
C.pivot.attr:{[c;v;i;a]if[~#i;:()];if[@a;:a];s:name.S[v][2;2 1 3];vat[a;of[c;`find_;(s 1;*s;s 1)]]}
C.pivot.bang:{[v],!#`. v}
C.pivot.ji:{[c;v;i]:[~#i;i;~_n~i;i;|/(of[c;`rshape;,v],of[c;`cshape;,v])<(*|2#^:)'name.S[v]0;,of[c;`find;(c;v;i)]]}
C.pivot.find:{[c;v;i]s:name.S[v][2;2 1 3];of[c;`find_;(s 1;*s;s[1]i)]}

C.pivot.getcell:{[v;i;d]
 if[b:@i;i,:]
 c:cl v
 j:of[c;`find;(c;v;i)]
 a:of[c;`attr;(c;v;i;attcell[v;i;d])]
 r:cell[,/;:[@a;(#j)#a;a j]]
 if[b;r*:]
 r}

C.pivot.find_:{
 :[x~y::[y~z;       y
         1<#z;      y@&y _lin z
         z[0]_in y; z
                    !0 ];!#x;x?/:y]}
/ returns the indices of the items of x that are in y and z

C.pivot.getdi:{[v;i;n;f]
 if[~#s:name.S[v][0;n];:()]
 if[~&/i<^d:f@+s;:+_f[v;;n;f]'+@[i;~n;!:]]
 c:cl v;a:of[c;`arrange;,v][n]i@~n;b:of[c;`getax;,v]a;d:d . i;(a;d;&b=d)}

C.pivot[`RCLFONT`ALFONT]:`rcl

qevent'[`pivot;`k`km`kr`kk`kkm`kkr`kd`kmd`krd`ku`kmu`kru];
pevent'[`pivot;`rlk`rlkm`rlkr`rlkk`rlkkm`rlkkr`clk`clkm`clkr`clkk`clkkm`clkkr;&6 6;(::;+:)@&6 6];
pevent'[`pivot;`rlkd`rlkmd`rlkrd`rlku`rlkmu`rlkru`clkd`clkmd`clkrd`clku`clkmu`clkru;&6 6;(::;+:)@&6 6];
event'[`pivot;`alk`alkm`alkr`alkk`alkkm`alkkr];
event'[`pivot;`alku`alkmu`alkru`alkd`alkmd`alkrd];

C.pivot.set:{[v;i;d]
 c:cl v;i:(name.R[v]i 0;name.C[v]i 1);k:of[c;`where;(c;v;i)]
 ji[`set;{.[`;x,y;upd[x;y];of[c;`in;(x;y;z)]];trigger[x;y]};(v;k;d);v;k]
}

C.pivot.sa:{[v;i;d]
 if[~|/(&/" "=)'$d
  a:of[c:cl v;`arrange;,v];j:(d[0]_in'a)?1;a[j]:a[j]_dv*d
  a:{@[.[@[a;x;,;,()];(x;a[x]?d 1);{y,x};*d];x;,/]}(d[1]_in'a,'`"."`"..")?1
  w:jd v;ji[`set;{.[dot x;`a;:;y];dj w,`a;fire_t w,`a};(w;a);w;,`a]
  renew[v;i]]
}

C.pivot.sets:{[v;i;s;k]ji[s;{.[`;,/.j`v`i;:;x]};,k;w:jd[v],s;i];dj w,i;fire_t w,i}
C.pivot.ss:{[v;i;d]c:cl v;of[c;`sets;(v;i;`s;of[c;`where;(c;v;d)])];}

C.pivot.where:{[c;v;i]
 if[~&/#:'i:(),/:i;:!0]
 if[~#k::[~*t:(*|2#^:)'s:name.S[v]0;at1[s[1];i 1];~t 1;at1[s[0];i 0];+,/,/:\:/s{+at1[x;y]}'i];:!0]
 b:name.S[v]2;u:,/name.S[v]1;j:b[0]_sv u?/:'k
 of[c;`find_;(b 1;j;b 1)]}

C.pivot.ssrc:{[n;f;s;v;i;d]
 .[`;jd[v],`SRC;:;s]
 .[`;jd[v],`$uc s;:;d]
 if[#!a:of[c:cl v;`getax;,v];of[c;`sets;(v;i;s;(!*|2#^a[])@:[#d;?,/*-1#+the[c;`getdi][v;;n;f]'d;d])]]
}

C.pivot.ssr:C.pivot.ssrc[0;::;`sr]
C.pivot.ssc:C.pivot.ssrc[1;+:;`sc]

C.pivot.s:{[v;i]
 if[#`. v;ss:()
  if[~_n~s:att[v;`s]
   k:cl v
   if[#s:(),s
    t:name.S[v]0;r:+*t;c:+t 1;a:of[k;`arrange;,v];b:of[k;`getax;,v]
    rs:?r?/:+b[*a;s];cs:?c?/:+b[a 1;s];ss::[~#*a;(,0;?cs);~#a 1;(?rs;,0);?:'+,/rs,/:\:cs]]]
  .m.set(`set;(`name,dot v;(`index;());(`s;ss)))]
}

C.pivot.copy_:{[v;i;s]
 / must set axo attribute, since otherwise pivot function may sort axis values
 / by order of occurrence within just the selected cells instead of within the entire pivot
 / (see PRN 2751)
 getax:{[d;e]if[~#d;:.()];:[#!t:e[`ax];t;.,(`N;!#d)]}
 getaxo:{[d;e]ax:getax[d;e];if[_n~axo:e[`axo];:@[ax;_n;?:]];if[#a:(!ax)_dvl!axo;axo[a]:?:'ax a];axo}
 att:`. jd v
 att[`axo]:getaxo[`. v;att]
 att:.[att;(`ax;);@[;s]]
 a:pivot c:(`. v,,s;.,`j,att)
 a[0]:(c[0],(;0N;0n;;`)@_abs 4:*c)a 0
 if[4:*a;a[0]::[~#a 3;,*a;+,*a]]
 cb.w@*a
}

C.pivot.copy:{[v;i]C.pivot.copy_[v;i;att[v;`s]]}
C.pivot.copy_all:{[v;i]C.pivot.copy_[v;i;!#`. v]}

C.pivot.cut:{[v;i]
 of[c:cl v;`copy;(v;i)]
 p:prototype[v;*i]
 k:proto[#i;p;`. v]
 of[`vector;`Set;(v;,:'i;k)]
}

C.pivot.paste:{[v;i]
 if[~att[v;`e]; ok.i[.l.ss"This table is not editable"]; : _n]
 if[~(#i)=#cbContents: ,/cb.r[]; ok.i[.l.ss"Unable to paste.\nThe selected cell areas do not match."]; : _n]
 of[`vector;`Set;(v;,:'i;,:'cbContents)]
}

C.pivot.ctl_c:{[v;i;d]of[cl v;`copy;(v;att[v;`s])]}
C.pivot.ctl_v:{[v;i;d]of[cl v;`paste;(v;att[v;`s])]}
C.pivot.ctl_x:{[v;i;d]of[cl v;`cut;(v;att[v;`s])]}

C.pivot.ctl_shift_c:{[v;i;d]
 s:att[v;`s]
 a:pivot c:(`. v,,s;.,`j,.[`. jd v;(`ax;);@[;s]])
 a[0]:(c[0],(;0N;0n;;`)@_abs 4:*c)a 0
 if[4:*a;a[0]::[~#a 3;,*a;+,*a]]
 cb.w@matrix.pivot a
}

pnull'[`pivot;`sr`sc];
cons'[`pivot;`acg`rcg`ccg`ebg`aebg`rebg`cebg;color];
cons'[`pivot;`vgrid`hgrid`pivot;::];
pcons'[`pivot;`al`altip`albg`alfg`alfont;(label;label;color;color;font)];
pattr'[`pivot;`rcl`rclbg`rclfg`rclfont;``bg`fg`font;(;color;color;font)];

/ the Axes object

C.Axes.super:`object
C.Axes.abstract:1

C.Axes.super:`pivot
C.Axes.Flip_:{[w;junk].[`;w,`a;|:];fire_t w,`a}
C.Axes.Cols_:{[w;junk]C.Axes.Swap_[w;|:]}
C.Axes.Rows_:{[w;junk]C.Axes.Swap_[w;::]}
C.Axes.Swap_:{[w;f].[`;w,`a;:;f(,/`. w,`a;0#`)];fire_t w,`a}

C.Axes.New:{[v]
 w:jd v;c:cl v
 if[_n~arr v;.[`;w,`a;:;of[c;`arrange;,v]]]
 p:.+(`Flip`Rows`Cols;{x[w]}'C.Pivot`Flip_`Rows_`Cols_)
 if[5=4:q:att[v;`popup];p[!q]:q[]]
 .[`;w,`popup;:;p]
}

/

C.Pivot.super:`Axes`Data

C.Pivot.New:{[v]
 of[`pivot;`New;,v]
 of[`Axes;`New;,v]
 of[`Data;`New;,v]
}

/ vector object

C.vector.super:`rows`scrollable
C.vector.initial:`hgrid`rsel
C.vector.terminal:`alV`rsel /must run rsel after `cons as the `cons call sets the row selection model, which would override what the k programmer had set in the rsel attribute
C.vector.public:`hgrid`rsel
C.vector.rank:1
cons'[`vector;`hgrid`rsel;::];
C.vector.valid:{[c;v]:[~#d:`. v;1;0>t:4:d;1;t;0;&/atomic'd]}
C.vector.Shape:{[v],#`. v}
C.vector.first:{[v]:[#`. v;0]}
C.vector.myrows:{[v]if[~_n~r:att[v;`rows];:r];*of[cl v;`block;(250;100;2;#`. v;1)]}
C.vector.shape:{[v],of[cl v;`myrows;,v]&#`. v}
C.vector.bang:{[v],:[_n~a:name.R v;!*of[cl v;`shape;,v];a]}
C.vector.sav:{[v;i;d]of[cl v;`setav;(v;d)];@[dot v;_n;::];}
C.vector.getav:{[v;i]r:*of[cl v;`bang;,v];.m.set(`set;(`name,dot v;(`index;());(`av;r)))}
C.vector.setav:{[v;a]name.setR[v;:[~a~!*of[cl v;`shape;,v];a]]}
C.vector.set:{[v;i;d]vSet[v;:[_n~i;i;_n~a:name.R v;i;a i];d]}
C.vector.reshape:{[v;d](#`. v)#d}
C.vector.some:{[v;i]:[~_n~*i;i]}
C.vector.mod:{[v;i]:[_n~i;i;,i[0]!*name.s v]}

C.vector.imap:{[c;v;i] /C.vector.imap: convert absolute index i (atom or vector) into relative index into the current block if blocking is in use
 :[_n~i;:(i;);_n~a:*of[c;`bang;,v];:(i;)]
 k:&(#a)>j:a?/:i
 :[~@j;(j k;k);#k;(j;);()]}

C.vector.getcell:{[v;i;d]
 c:cl v
 e::[GETSET
  ((#`. v)#of[c;`attr;(c;v;i;attcell[v;i;d])]). i
  (name.s[v]#of[c;`attr;(c;v;i;attcell[v;i;d])]).*of[c;`imap;(c;v;i)]]
 cell[,/;e]}

C.vector.value:{[c;v;i]:[~#i;();~_n~i;::[~*r:.[.;(`;v,i);:];r 1];vat[`. v;*of[c;`bang;,v]]]}
C.vector.attr:{[c;v;i;a]:[~#i;();@a;a;vat[a;*of[c;`bang;,v]]]}
C.vector.ji:{[c;v;i]:[~#i;i;~_n~i;i;(*name.S v)>*name.s v;of[c;`bang;,v]]}

C.vector.ins.row:{[v;i;n]
 c:cl v;if[~#r:`. v;:of[c;`app`row;(v;n)]]
 p:prototype[v;i]
 n:#k:proto[n;p;r];u:*of[c;`bang;,v]
 ak v;.[`;v;:;(i#r),k,i _ r:`. v];dk v;of[c;`reset;,v];w:*of[c;`bang;,v]
 of[c;`setav;(v;w)];of[c;`getav;(v;)];ins.m[v;i;n];.[`;v;::]
}

C.vector.app.row:{[v;n]
 c:cl v
 p:prototype[v;**of[c;`bang;,v]]
 s:*name.s v;n:#k:proto[n;p;r:`. v];u:*of[c;`bang;,v]
 ak v;.[`;v;,;k];dk v;of[c;`reset;,v];w:*of[c;`bang;,v]
 of[c;`setav;(v;w)];of[c;`getav;(v;)];app.m[v;n];.[`;v;::]
}

C.vector.del.row:{[v;i]
 c:cl v;u:*of[c;`bang;,v]
 ak v;.[`;v;:;(`. v)_di i@:>i,:()];dk v;of[c;`reset;,v];w:del.i[!#`. v;u]
 del.m[v;i];of[c;`setav;(v;w)];of[c;`getav;(v;)];.[`;v;::]
}

C.vector.copy:{[v;i]cb.w@+,`. v,,i}
C.vector.copy_all:{[v;i]cb.w@+,`. v}

C.vector.cut:{[v;i]
 of[c:cl v;`copy;(v;i)]
 p:prototype[v;*i]
 k:proto[#i;p;`. v]
 of[c;`Set;(v;i;k)]
}

C.vector.paste:{[v;i]of[cl v;`Set;(v;i;cb.r[])]}
C.vector.ctl_v:{[v;i;d]of[cl v;`paste;(v;att[v;`s])]}
C.vector.ctl_c:{[v;i;d]of[cl v;`copy;(v;att[v;`s])]}
C.vector.ctl_x:{[v;i;d]of[cl v;`cut;(v;att[v;`s])]}

C.vector.Set:{[v;i;d]
 if[#d
  c:cl v;d:*:'d
  if[(1<#d)&1=#i;i:i[0]_!#`. v]
  n::[1=#d;#i;(#i)&#d];d:n#d;i:n#i
  j:&~_n~/:r:{eGet[v;,x;y]}'[i;d]
  m:@[`. v;i j;:;r j]
  .[`;v;:;m]
  trigger[v;i j]]
}

C.vector.Rows:{[v]:[_n~s:att[v;`s];();s]}

/ Vector object

C.Vector.super:`vector`Data

/ matrix object

C.matrix.super:`rows`scrollable
C.matrix.public:`vgrid`hgrid`rsel`csel`selmode
C.matrix.initial:`vgrid`hgrid`rsel`csel`selmode
C.matrix.terminal:`rsel`csel`selmode /must run rsel and csel after `cons as the `cons call sets the row/col selection model, which would override what the k programmer had set in the rsel/csel attributes
C.matrix.rank:2
C.matrix.valid:{[c;v]:[~#d:`. v;1;4:d;0;the[c;`rectangular];2=#^d;mat d]}
C.matrix.value:{[c;v;i]:[~#i;();~_n~i;::[~*r:.[.;(`;v,i);:];r 1];(`. v)vat\:of[c;`bang;,v]1]}
C.matrix.attr_:{[f;c;v;i;a]:[~#i;();f a;a;@[a;_n;{:[@y;(#x)#y;vat[y;x]]}[of[c;`bang;,v]1]]]}
C.matrix.attr:C.matrix.attr_[atomic]
C.matrix.attr1:C.matrix.attr_[@:]
C.matrix.Shape:{[v](#d),|/#:'d:`. v}
C.matrix.shape:{[v]c:cl v;s:of[c;`Shape;,v];@[s;1;{x&of[c;`myrows;,v]}]}
C.matrix.myrows:{[v]if[~_n~r:att[v;`rows];:r];c:cl v;s:|of[c;`Shape;,v];*of[c;`block;(250;s 1;2),s]}
C.matrix.bang:{[v]s:!:'of[cl v;`shape;,v];:[_n~a:name.R v;s;@[s;1;:;a]]}
C.matrix.Bang:{[v]!:'of[cl v;`Shape;,v]}
C.matrix.sav:{[v;i;d]of[cl v;`setav;(v;d)];@[dot v;_n;::];}
C.matrix.getav:{[v;i]r:of[cl v;`bang;,v]1;.m.set(`set;(`name,dot v;(`index;());(`av;r)))}
C.matrix.setav:{[v;a]name.setR[v;:[~a~!of[cl v;`shape;,v]1;a]]}

C.matrix.imap:{[c;v;i]
 :[_n~i;:(;);_n~a:of[c;`bang;,v]1;:(i;)]
 i[1]:a?/:i 1;k:&(#a)>i 1
 :[~@i 1;((*i;i[1;k]);k);#k;(i;);()]}

C.matrix.ji:{[c;v;i]:[~#i;i;~_n~i;i;(name.S[v][1])>*name.s[v]1;(;of[c;`bang;,v]1)]}
C.matrix.set:{[v;i;d]vSet[v;:[_n~i;i;_n~a:name.R v;i;@[i;1;a@]];d]}
C.matrix.reshape:{[v;d](#:'`. v)#'d}
C.matrix.where:{[v;b],/(!#`. v),/:'&:'b}
C.matrix.first:{[v]:[~#`. v;0 0]}
C.matrix.mod:{[v;i]:[_n~i;i;@[i;1;{x!name.s[v]1}]]}

C.matrix.ins.row:{[v;i;n]
 c:cl v;if[~#*r:`. v,_n;:of[c;`app`row;(v;n)]]
 p:{prototype[v;x,i]}'*bang`. v
 n:#*k:proto'[n;p;r]
 ak v;.[`;v,_n;{(i#x),y,i _ x};k];dk v;of[c;`reset;,v]
 of[c;`setav;(v;)];of[c;`getav;(v;)];ins.m[v;i;n];.[`;v;::]
}

C.matrix.app.row:{[v;n]
 s:name.s[v]1;c:cl v
 p:prototype[v]'(*bang`. v),\:*of[c;`bang;,v][1]
 n:#*k:proto'[n;p;`. v,_n]
 ak v;.[`;v,_n;{x,y};k];dk v;of[c;`reset;,v]
 of[c;`setav;(v;)];of[c;`getav;(v;)];app.m[v;n];.[`;v;::]
}

C.matrix.del.row:{[v;i]
 c:cl v;u:of[c;`bang;,v]1
 ak v;i@:>i,:();.[`;v,_n;{x _di i@&i _lin!#x}];dk v;of[c;`reset;,v];w:del.i[!|/#:'`. v,_n;u]
 del.m[v;i];of[c;`setav;(v;w)];of[c;`getav;(v;)];.[`;v;::]
}

C.matrix.copy:{[v;i]cb.w@+`. v,?:'+i}
C.matrix.copy_all:{[v;i]cb.w@+`. v}

C.matrix.cut:{[v;i]
 of[c:cl v;`copy;(v;i)]
 j:?:'+i
 p:{prototype[v;x,0]}'*j
 k:+proto'[#j 1;p;`. v,j]
 of[c;`Set;(v;i;k)]
}

C.matrix.paste:{[v;i]of[cl v;`Set;(v;i;cb.r[])]}
C.matrix.ctl_v:{[v;i;d]of[cl v;`paste;(v;att[v;`s])]}
C.matrix.ctl_c:{[v;i;d]of[cl v;`copy;(v;att[v;`s])]}
C.matrix.ctl_x:{[v;i;d]of[cl v;`cut;(v;att[v;`s])]}
C.matrix.paste_transpose:{[v;i]of[cl v;`Set;(v;i;+cb.r[])]}

C.matrix.Set:{[v;i;d]
 if[1<#^d
  if[#d+:
   c:cl v
   i0::[(1<#d)&1=#u:?i[;0];drop[*u;of[c;`Bang;,v]0];?i[;0]]
   i1::[(1<#*d)&1=#u:?i[;1];drop[*u;of[c;`Bang;,v]1];?i[;1]]
   i:(i0;i1)
   s:2#^d;j:#:'i;if[1=*s;s[0]:*j];if[1=s 1;s[1]:j 1];n:j&s
   j:.u.cross n#'i;d:n[0]#n[1]#'d
   k:&_n~/:r:eGet[v]'[j;,/d]
   r:n#@[r;k;:;{`. v,x}'j k]
   t:i{:[-1=4:x;(&/x)+!y;y#x]}'n
   m:.[`. v;t;:;r]
   .[`;v;:;m]
   trigger[v;t]]]
}

C.matrix.Rows:{[v]:[_n~s:att[v;`s];();#s;?s[;1];s]}

C.matrix.getcell:{[v;i;d]
 c:cl v
 if[GETSET
  s:^`. v
  if[~2=#^t:attcell[v;i;d];t:s#t]
  e:t . i]
 if[~GETSET
  s:name.s v
  if[@t:attcell[v;i;d];t:s[0]#t]
  e:(:[@f:of[c;`attr;(c;v;i;t)];s#f;1=#^f;s[1]#'f;f]).*of[c;`imap;(c;v;i)]]
 cell[,/,/;e]}

cons'[`matrix;`vgrid`hgrid`rsel`csel`selmode;::];

/ Matrix object

C.Matrix.super:`matrix`Data

/ scalar object

C.scalar.super:`data
C.scalar.valid:{[c;v](4:`. v)_in 1 2 3 4}
C.scalar.renew:{[v;i]~cl[v]=name.c v}
list'[`scalar;`tip`fg`bg`font`e`b;(label;color;color;font;edit;sym)];
C.scalar.constraint[`wx`wy`fill]: .1,NoExtraSpace,`n /default to never giving any extra vertical space
C.scalar.getcell:{[v;i;d]cell[::;attcell[v;i;d]]}
C.scalar.reshape:{[v;d]d}
C.scalar.first:{[v]()}

/ Scalar object

C.Scalar.super:`scalar`Data
C.Scalar.alwaysSel:1
C.Scalar.Rows:_n
C.Scalar.copy:{[v;i]cb.w@,,`. v}
C.Scalar.copy_all:C.Scalar.copy

C.Scalar.cut:{[v;i]
 of[c:cl v;`copy;(v;)]
 k:*proto[1;prototype[v;_n];`. v]
 of[c;`Set;(v;i;k)]
}

C.Scalar.paste:{[v;i]of[cl v;`Set;(v;i;cb.r[])]}
C.Scalar.ctl_v:{[v;i;d]of[cl v;`paste;(v;att[v;`s])]}
C.Scalar.ctl_c:{[v;i;d]of[cl v;`copy;(v;att[v;`s])]}
C.Scalar.ctl_x:{[v;i;d]of[cl v;`cut;(v;att[v;`s])]}

C.Scalar.Set:{[v;i;d]if[#d;c:cl v;eSet[v;();**d]]}

/ basis of dictionary objects

C.dictionary.super:`data
C.dictionary.abstract:1
C.dictionary.public:`a
C.dictionary.get:{[v;i]if[#i;if[#i@:&i[;0]_lin*name.s v;of[`data;`get;(v;i)]]]}
C.dictionary.arrange:{[v;d]:[_n~a:arr v;!d;~#a;0#`;4:a;a;,/a]}
C.dictionary.renew:{[v;i]:[~cl[v]=name.c v;1;~&/of[cl v;`shape;,v]{(x@<x,:())~y@<y,:()}'name.s v;1;0]}
C.dictionary.a:renew
C.dictionary.first:{[v]:[#s:name.s v;*s]}
C.dictionary[`CLFONT`RLFONT]:`rcl

/ system tray icon object
/The trickiest part of this object is faking out the code to make buttons with popup menus look like normal menus.  SP is used to help do this, see comments where SP is used

C.systemtrayicon.super:`popup`buttonimage
C.systemtrayicon.initial:`image`traymsg
C.systemtrayicon.required:`image
C.systemtrayicon.public:`image`traymsg
C.systemtrayicon.frame:0  /the system tray object must not be put inside a container
C.systemtrayicon.l:{[v;i]:[~_n~t:att[v;`l]; .m.set(`set;(`name,dot v;(`index;i);(`label;label t)))]} /if the label attribute isn't null, send it to java
C.systemtrayicon.v:{[v;i]:[~_n~showMe:att[v;`v]; .m.set(`hide`show@showMe;,`name,dot v)]} /visibility method
C.systemtrayicon.traymsg: {[v;i] /C.systemtrayicon.traymsg
  if[_n~msg: att[v;`traymsg]; : _n] /if the message is null, just return
  /else send the message and null it out so we don't send it again unless the k programmer resends it
  .m.set(`set;(`name,dot v;(`traymsg;msg)))
  .[`;(-1_ v),(~-1# v),`j,`traymsg;:;_n]
  }
/override C.menu.root in order to handle empty symbol in menu arrangements so toolbar separators can be supported
C.systemtrayicon.root:{[c;m;v]
  a:of[c;`geta;,v] /get the menu arrangement as usual
  /Transform any empty symbol (these are toolbar separators) to Menu separators (insert a menu node and value of " ")
  i: &a=` /the indices of any empty symbols in a
  s: `$'"z",'$i /create a list of unique node names.  This assumes that the k programmer did not use any dictionary terms of the form `z<integer>
  a: @[a;i;:;s] /update 'a', changing all the empty symbols to their node names
  temp: {[vcontent;vindex]:[vindex _in !vcontent; vcontent@vindex;" "] }[(`. v)]'a /add in " " to the contents of v where ever there was an empty symbol
  {of[c;`node;(c;m;0#`;x;y)]}'[a;temp] /now do normal menu processing
  }
C.systemtrayicon.valid:{[c;v]:[~5~4:`. v;0;_n~att[v;`image];0;~systemtrayValidMsg[v];0;1]} /v must be a dictionary, must have a non-null image attribute, and must have a valid msg if there is one
C.systemtrayicon.selflabel:1 /Don't automatically append any window or frame info at the end of the label e.g. leave off the " - <app>"
/C.systemtrayicon.new:{[v;p;w]New[v;p;w];of[cl v;`created;,v]}
SP: () /Special process popup menu list
C.systemtrayicon.removeall: {[v] /C.systemtrayicon.removeall: v is path to object
  /If this object is a parent of any objects in SP, remove them from SP
  kids: {:[v~(#v)#x;x]}'SP /find any kids (any object that starts with the same terms as v)
  SP:: SP _dvl kids /remove them
  }
C.systemtrayicon.set:{[v;i;d] /C.systemtrayicon.set: v is object path, i is index, d is data
 i:is''i;c:cl v;f:the[c;`setself]
 if[#SP /if there are any entries in the shadow popup menu table
  if[1<#i /and i has more than one term
    if[(parent: v,(*i)) _in SP /if the sub-object has a parent in SP
      /Adjust v to insert the path to the popup menu
      v: (attrpath parent),`j,`popup
      if[(-1#parent)~,*i; i: 1_ i] /If i and the parent overlap (this happens when i is the path to any first level menu items in the popup), adjust i to remove the overlap
      ]]]
 if[~t:4:k:`. v,i;x:name.X v;if[~_n~b:x . i;d:b[0;1;b[1;1]?d]]]
 ak v,i;:[1=t;f .(v;i;d);~t;f .(v;i,0;d);6=t;f .(v;i;);r:eval[`set;v;i;k]];dk v,i
 r}
C.systemtrayicon.node:{[c;m;p;s;d] /C.systemtrayicon.node
/c - object class (always `systemtrayicon), m - root path to the system tray object, p - additional path terms during recursion of this function, s - node, d - node data
 v:undot m /v is the variable m as a path
 nodeClass: cl v,s /get the class of the node
 popPath: _n /set the path to the popup menu to null
 /if the node has a popup menu, add it to the special process list and process this node as a node (ie not a leaf) and process its popup menu as its node data
 if[~_n~pop:att[n: p,v,s;`popup]; SP,: ,n; d:pop]
 t:4:d; l:sym s /t is the type of node data, l is a symbol value of s
 a::[t=5;of[c;`gettype;(m;p,s)];t=1;`cleaf;t=3;`sleaf;~t;`rleaf;`leaf]
 b::[t _in 0 1;(l;d);t=3;;l]
 if[a=`rleaf
  x:name.X v
  if[_n~f:x . p,s
   name.setX[v;.[x;p,s;:;(b 1;f:sym b 1)]]
   f:(*b;f)]
  b:f]
 .m.set(`set;(`name,m;(`index;sym p,s);(a;b))) /send java the node
 lbl: systemtrayNodeLabel[v;p,s] /Determine the node's label
 .m.set(`set;(`name,m;(`index;,sym p,s);(`nl;,lbl))) /send java the node's label
 if[a=`rleaf
  .m.set(`set;(`name,m;(`index;sym(p,s),/:b[1;1]);(`nl;label'b[1;1])))]
 if[t=5;_f[c;m;p,s]'[!d;d[]]]
}
/method overrides to prevent toolbar functionality that doesn't apply to system tray
noop'[`systemtrayicon;!Layout;2];
noop'[`systemtrayicon;`hscrollp`vscrollp`layout`layout_null`layout_reshape`layout_set`layout_next`layout_arrange`layout_reset`tip;2];
systemtrayValidMsg:{[v]:[_n~msg:att[v;`traymsg];1;~3=#msg;0;(msg[0]~_n) & msg[1]~_n;0;~msg[2] _in `e`i`n`w;0;1]} /boolean: return 1 if valid msg (only one of caption or message can be null, and must have a message type) else return 0
systemtrayNodeLabel:{[v;i] /systemtrayNodeLabel: v is the path to the object, i is the index of a sub-object in the object
  if[#SP /if there are any entries in the shadow popup menu table
    if[1<#i /and i has more than one term
      if[(parent: v,(*i)) _in SP /if the sub-object has a parent in SP
        /Adjust v to insert the path to the popup menu
        v: (attrpath parent),`j,`popup
        if[(-1#parent)~,*i; i: 1_ i] /If i and the parent overlap (this happens when i is the path to any first level menu items in the popup), adjust i to remove the overlap
        /if there are any node labels specified for the popup menu
        if[~_n~nodeLabels: att[v;`nl]
          /if this is a separator menu item, return null else return the node label for menu item at index i
          : :[" "~`. v,i; `; label[nodeLabels[1;nodeLabels[0]?i]]]
          ]]]]
  /Determine the node's label using the following order of precedence: the sub-object's label attribute (note: popup menu items don't have a label attribute so if we fall through the SP block above, we'll just return the object's name),
  /its node-label attribute, else its name
  t:att[v,i;`l] /start with the node's label attribute.  We'll use it unless it's null or `"" which means don't display the label with the button
  label[:[~((_n~t) | t~`"");t;~_n~t:att[v,i;`nl];t;*-1#i]]}



C.tray.super:`dictionary
C.tray.initial:`traytype`ndefault`getshape`nl`icon /`getshape added here simply to override order of initialization.  `getshape needs to execute before `nl
C.tray.public:`ndefault`nl`icon
C.tray.frame:0
C.tray.shape:{[v]:[_n~a:arr v;,!`. v;hmat a]}
C.tray.reshape:{[v;d]@[_n;of[cl v;`arrange;(v;`. v)];:;d]}
C.tray.arrange:{[v;d]:[_n~a:arr v;!d;(),a]}
C.tray.valid:{[c;v]:[null d:`. v;1;~5=4:d;0;~-4=4:a:C.tray.arrange[v;d];0;~data d _di(!d)_dvl a;0;&/atomic'd a]}
C.tray.traytype:{[v;i].m.set(`set;(`name,dot v;(`index;());(`traytype;~3=4::'d of[cl v;`arrange;(v;d:`. v)])))}
C.tray.out:{[v;i;d]d~'1}
C.tray.set:{[v;i;d]r:`. v,i;:[r _in 0 1;.[`;v,i;~:];eval[`set;v;i;r]]}
C.tray.lrc:{[v;i;d]}
atom[`tray;`nl;label]
cons'[`tray;`icon`ndefault;::];

/ directed acyclic graph (not fully implemented)

C.dag.super:`dictionary
C.dag.initial:`nx`ny`ng`ntext`nfill`nsq
C.dag.public:`nx`ny`ng`nr`ntext`nfill`nsq
C.dag.renew:Renew
C.dag.shape:{[v],!`. v}
C.dag.reshape:{[v;d]@[_n;of[cl v;`arrange;(v;`. v)];:;d]}
C.dag.arrange:{[v;d]*of[cl v;`shape;,v]}
C.dag.valid:{[c;v]:[~(4:d:`. v)_in 5 6;0;&/(,//d[])_lin!d]}
C.dag.lrc:{[v;i;d]}

C.dag.get:{[v;i]
 if[(!d:`. v)~i:,//i;i:_n];r:(),/:d i;s:of[cl v;`sending;,d]i
 .m.set(`set;(`name,dot v;(`index;i);(`value;(r;s))))
}

C.dag.New:{[v]
 s:*of[cl v;`shape;,v];w:jd v
 p:dag.polygon[100;#s]
 if[_n~att[v;`nx];.[`;w,`nx,,s;:;p 0]]
 if[_n~att[v;`ny];.[`;w,`ny,,s;:;p 1]]
 if[_n~att[v;`ntext];.[`;w,`ntext,,s;:;s]]
}

C.dag.sending:{[d]. d{(y;(!x)@&y _in'(),/:x[])}'!d}
C.dag.sm:{[v;i;d]w:jd v;.[dot w;`m;:;(i;d)];dj w,`m;fire_t w,`m;}
event'[`dag;`ml`mr`mm`mL`mR`mM];
C.dag.snr:{[v;i;d]w:jd v;.[dot w;`nr,i;:;d];dj w,`nr;fire_t w,`nr;}

atom'[`dag;`nx`ny`nr`nfill`nsq;{:[~@x;_f'x;~_n~x;,x]}];
atom[`dag;`ntext;label]
atom[`dag;`ng;color]
cons[`dag;`font;font]

/ table object

C.table.super:`dictionary`matrix`rows
C.table.initial:`kshape`getshape`getfixed`cltip`cl`clfg`clbg`clfont`getfixed`hgrid`vgrid`reorder /getshape override, must occur before cl,  must occur before all other attributes else the attributes will be ignored in the fixed columns
C.table.required:`cl
C.table.public:`cl`cltip`clfg`clbg`clfont`hgrid`vgrid`fixed`reorder`cv
C.table.dshape:{[c;v;a;b]~&/of[c;a;,v]{:[x;y~z;(y@<y,:())~z@<z,:()]}[_n~arr v]'name[b]v}
C.table.reshape:{[v;d]a:of[cl v;`arrange;(v;`. v)];@[_n;a;:;(#:'dot[v]a)#'d]}
C.table.reshape_:{[v;d]a:!dot v;@[_n;a;:;(#:'dot[v]a)#'d]}
C.table.renew:{[v;i]:[~cl[v]=c:name.c v;1;of[c;`dshape;(c;v;`shape;`s)];1;of[c;`dshape;(c;v;`Shape;`S)];1;0]}
C.table.valid:{[c;v]:[null d:`. v;1;~5=4:d;0;4:e:d a:C.table.arrange[v;d];0;~data d _di(!d)_dvl a;0;the[c;`rectangular];2=#^e;mat e]}
C.table.Shape:{[v]a:of[cl v;`arrange;(v;`. v)];(a;|/#:'dot[v]a)}
C.table.shape:{[v]c:cl v;res: @[of[c;`Shape;,v];1;{x&of[c;`myrows;,v]}];@[res;0;:;C.table.nonvVis[v;res 0]]} /non-v visibility attribute process is handled at the end of shape processing
C.table.nonvVis: {[v;a] /C.table.nonvVis: non-v visibility method implementation. v is k path to widget, a is its current arrangement as determined by the shape of the widget, not its .j.a, which would be null when in default state
  cols: att[v;`cv] /get the value of any column visibility attributes
  if[&/6=4::'cols; :a] /if there are no invisible cols, return original arrangement
  remove: (!cols)@&0=cols[] /else get the list of cols that have visibility set to 0 and remove them from the result (leaving the actual widget .j.a arrangement intact)
  a _dvl remove}
C.table.myrows:{[v]if[~_n~r:att[v;`rows];:r];c:cl v;s:|@[of[c;`Shape;,v];0;#:];*of[c;`block;(250;s 1;2),s]}
C.table.value:{[c;v;i]:[~#i;();~_n~i;::[~*r:.[.;(`;v,i);:];r 1];{x{vat[`. v,x;y]}\:y}. of[c;`bang;,v]]}
C.table.bang:{[v]s:@[of[cl v;`shape;,v];1;!:];:[_n~a:name.R v;s;@[s;1;:;a]]}
C.table.Bang:{[v]@[name.S v;1;!:]}
C.table.fstructure:{[v]f:att[v;`fixed];s:*name.s v;:[f _in(0;);(0#`;s);(0,f)_ s]}
C.table.where:{[v;b],/(!`. v){x,/:&y}'b}
C.table.first:{[v]s:name.s v;:[(#*s)&0<s 1;(**s;0)]}
C.table.ctl_shift_c:{[v;i;d]s:att[v;`s];cb.w@+s[0],'`. v,s:?:'+s;}
C.table.cv: {[v;r]renew[v;()]} /C.table.cv: column visibility attribute. All we need to do here is trigger arrangement processing, done by renewing the object just as a change to its .j.a would cause

C.table.sa:{[v;i;d]
 c:cl v;f:of[c;`fstructure;,v];d*:;d::[(*d)_in*f;d,f 1;f[0],d]
 w:jd v;.[dot w;`a;:;d];name.reshape v;name.reShape v;dj w,`a;fire_t w,`a
}

C.table.imap:{[c;v;i]
 :[_n~i;:(;);4:i;:(i;);~#i;:(;);_n~a:of[c;`bang;,v]1;:(i;)]
 i[1]:a?/:i 1;k:&(#a)>i 1
 :[~@i 1;((*i;i[1;k]);k);#k;(i;);()]}

C.table.set:{[v;i;d]vSet[v;:[_n~i;i;@[i;1;{of[cl v;`bang;,v][1]x}]];d]}
C.table.getfixed:{[v;i]:[~_n~a:att[v;`fixed];.m.set(`set;(`name,dot v;(`index;());(`fixed;a)))]}
C.table.fixed:renew

C.table.copy_all:{[v;i]cb.w@+`. v,,*name.s v}

C.table.getcell:{[v;i;d]
 c:cl v
 t:attcell[v;i;d]
 if[~@i;if[~(*i)_in!t;:_n]]
 s::[GETSET;name.S;name.s]v
 if[~5=4:*:/t[];t:@[_n;*s;:;t]]
 f:of[c;`attr;(c;v;i;t)];n:depth[0;f]
 i::[GETSET;i;*of[c;`imap;(c;v;i)]]
 cell[,/,/;:[_n~f       ;@[_n;*s;:[;s[1]#f]]. i
             1=n        ;@[f;*s;s[1]#]. :[_n~i;,s 0;i]
                         @[_n;*s;:;@[f;*s;s[1]#]s 0]. i]]}

event'[`table;`clk`clkm`clkr`clkk`clkkm`clkkr];
event'[`table;`clkd`clkmd`clkrd`clku`clkmu`clkru];
cons'[`table;`hgrid`vgrid`reorder;::];
tatom'[`table;`cl`cltip`clfg`clbg`clfont;(label;label;color;color;font)]; /create table column attribute methods

/ Table object

C.Table.super:`table`Data

/ slot object

C.slot.super:`dictionary`scrollable
C.slot.public:`rl`rlfg`rlbg`rlfont`rltip`hgrid`rsel`rv
C.slot.initial:`getshape`rl`rlfg`rlbg`rlfont`rltip`hgrid`rsel /getshape override, must occur before rl
C.slot.required:`rl
C.slot.terminal:`rsel /must run rsel after `cons as the `cons call sets the row selection model, which would override what the k programmer had set in the rsel attribute
C.slot.rank:1
C.slot.shape:{[v]:[_n~a:arr v;,!`. v;hmat a]}
C.slot.reshape:{[v;d]@[_n;of[cl v;`arrange;(v;`. v)];:;d]}
C.slot.reshape_:{[v;d]@[_n;!dot v;:;d]}
C.slot.where:{[v;b](!`. v)@&b}
C.slot.arrange:{[v;d]:[_n~a:arr v;!d;(),a]}
C.slot.valid:{[c;v]:[null d:`. v;1;~5=4:d;0;~-4=4:a:C.slot.arrange[v;d];0;~data d _di(!d)_dvl a;0;&/atomic'd a]}
C.slot.Rows:_n
C.slot.rv: {[v;r] /C.slot.rv: row visibility attribute
  rv: att[v;`rv]
  .m.set(`set;(`name,dot v;(`index;!rv);(`rv;rv[])))
  }

C.slot.getcell:{[v;i;d]
 c:cl v;s:*name.s v;f:attcell[v;i;d];n:depth[0;f]
 cell[,/;(:[_n~f;.+(s;);1=n;.+(s;f);.+(s;f s)]).*of[c;`imap;(c;v;i)]]}

cons'[`slot;`hgrid`rsel;::];
event'[`slot;`rlk`rlkm`rlkr`rlkk`rlkk`rlkkm`rlkkr];
event'[`slot;`rlkd`rlkmd`rlkrd`rlku`rlkmu`rlkru];
atom'[`slot;`rl`rlfg`rlbg`rlfont`rltip;(label;color;color;font;label)];
C.slot.copy:{[v;i]cb.w@+,`. v,,i}
C.slot.copy_all:{[v;i]cb.w@+,`. v,,*name.s v}

C.slot.cut:{[v;i]
 of[c:cl v;`copy;(v;i)]
 p:prototype[v;i]
 k:,/proto'[1;p;`. v,,i]
 of[c;`Set;(v;i;k)]
}
C.slot.paste:{[v;i]of[cl v;`Set;(v;i;cb.r[])]}
C.slot.ctl_v:{[v;i;d]of[cl v;`paste;(v;att[v;`s])]}
C.slot.ctl_c:{[v;i;d]of[cl v;`copy;(v;att[v;`s])]}
C.slot.ctl_x:{[v;i;d]of[cl v;`cut;(v;att[v;`s])]}
C.slot.ctl_shift_c:{[v;i;d]s:att[v;`s];cb.w@s,'`. v,,s;}
C.slot.Set:{[v;i;d]
 if[#d
  c:cl v
  if[(1<#d)&1=#i;i:drop[*i;*of[c;`bang;,v]]]
  d:*:'d;n::[1=#d;#i;(#i)&#d];i:n#i;d:n#d
  j:&~_n~/:r:eGet[v]'[i;d]
  m:@[`. v;i j;:;r j]
 .[`;v;:;m]
  trigger[v;i j]]
}

/ Slot object

C.Slot.super:`slot`Data

/ cross object

C.cross.super:`dictionary`scrollable
C.cross.initial:`getshape`get`cl`cltip`rltip`clfg`clbg`clfont`rl`rlfg`rlbg`rlfont`hgrid`vgrid`rsel`csel`reorder /getshape override, must occur before cltip and get.  get override, must occur before cl
C.cross.required:`cl`rl
C.cross.public:`cl`cltip`rltip`clfg`clbg`clfont`rl`rlfg`rlbg`rlfont`hgrid`vgrid`rsel`csel`reorder`rv`cv
C.cross.terminal:`rsel`csel /must run rsel and csel after `cons as the `cons call sets the row/col selection model, which would override what the k programmer had set in the rsel/csel attributes
C.cross.rank:2
C.cross.valid:{[c;v]:[null d:`. v;1;_n~a:arr v;C.cross.valid0[c;d];~2=#a;0;C.cross.valid1[c;d;a 0;a 1]]}
C.cross.valid1:{[c;d;a;b]:[~5=4:d;0;~&/5=4::'d a;0;the[c;`rectangular];2=#^d .(a;b);mat d .(a;b)]}
C.cross.valid0:{[c;d]:[~5=4:d;0;~&/5=4::'d[];0;the[c;`rectangular];2=#^d[;];mat d[;]]}
C.cross.get:{[v;i]if[#i;s:of[cl v;`shape;,v];if[#i@:&(i[;0]_lin(),*s)&i[;1]_lin(),s 1;of[`data;`get;(v;i)]]]}
C.cross.shape:{[v]res: :[~#e:!dot v;2#,0#`;_n~a:arr v;(e;?,/{!dot v,x}'e);#a;@[a;_n;(),];2#,0#`]; C.cross.nonvVis[v;res]} /non-v visibility attribute process is handled at the end of shape processing
C.cross.nonvVis: {[v;a] /C.cross.nonvVis: non-v visibility method implementation. v is k path to widget, a is its current arrangement as determined by the shape of the widget, not its .j.a, which would be null when in default state
  rows: att[v;`rv] /get the value of any row visibility attributes
  cols: att[v;`cv] /get the value of any col visibility attributes
  /If there are any invisible rows or cols, get a list of them and remove them from the result (leaving the actual widget .j.a arrangement intact)
  (:[~cols~_n;a[0] _dvl (!cols)@&0=cols[];a 0];:[~rows~_n;a[1] _dvl (!rows)@&0=rows[];a 1])}
C.cross.reshape:{[v;d].[;;:;d]/[_n;of[cl v;`all;(v;)]]}
C.cross.reshape_:{[v;d]a:!k:dot v;b:?,/!:'k[];.[;;:;d]/[_n;.u.cross(a;b)]}
C.cross.where:{[v;b]if[~#b;:0];d:`. v;,/{x,/:y z}'[!d;(#!d)#,?,/!:'d[];&:'b]}
C.cross.bang:C.cross.shape
C.cross.first:{[v]:[&/0<#:'s:name.s v;*:'s]}
C.cross.cv: {[v;r]renew[v;()]} /C.cross.cv: column visibility attribute. All we need to do here is trigger arrangement processing, done by renewing the object just as a change to its .j.a would cause
C.cross.rv: {[v;r]renew[v;()]} /C.cross.rv: row visibility attribute. All we need to do here is trigger arrangement processing, done by renewing the object just as a change to its .j.a would cause

C.cross.in:{[v;i;d]
 c:cl v
 :[:[i~_n;0;~i[0]_in!k:`. v;1;~i[1]_in!k i 0]   ;
   *r:.[.;(`;v,i);:]                            ;
                                                 of[c;`in_;(c;r 1;v;i;:[_n~k:of[c;`getcell;(v;i;d)];d;incell[v;i;r;k;d]])]]}

C.cross.in_:{[c;r;v;i;d]
 :[~-3=4:d                                      ;d
   _n~f:att[v;`g]                               ;io[r;d]
   _n~f:at[by[name.s v;f];v;i]                  ;io[r;d]
                                                 apply[::;:;f;d]]}

C.cross.Rows:_n

C.cross.getcell:{[v;i;d]
 s:name.s v;f:attcell[v;i;d];n:depth[0;f]
 cell[,/,/;(:[_n~f;.[_n;s;:;_n];1=n;.[_n;s;:[;f]];2=n;@[_n;*s;:;@[f;*s;{.+(s 1;x)}]s 0];.[_n;s;:;f . s]]). 2#i]}

event'[`cross;`clk`clkm`clkr`clkk`clkkm`clkkr`rlk`rlkm`rlkr`rlkk`rlkkm`rlkkr];
event'[`cross;`clkd`clkmd`clkrd`rlkd`rlkmd`rlkrd];
event'[`cross;`clku`clkmu`clkru`rlku`rlkmu`rlkru];
catom'[`cross;`cl`cltip`clfg`clbg`clfont;(label;label;color;color;font)];
ratom'[`cross;`rl`rltip`rlfg`rlbg`rlfont;(label;label;color;color;font)];
cons'[`cross;`hgrid`vgrid`rsel`csel`reorder;::];
C.cross.sa:{[v;i;d]w:jd v;.[dot w;`a;:;d];dj w,`a;fire_t w,`a}

C.cross.copy:{[v;i]cb.w@+`. v,?:'+i}
C.cross.copy_all:{[v;i]cb.w@+`. v,name.s v}

C.cross.cut:{[v;i]
 of[c:cl v;`copy;(v;i)]
 p:prototype[v]'i
 k:*:''proto''[1;p;`.'v,/:i]
 of[c;`Set;(v;i;k)]
}

C.cross.paste:{[v;i]of[cl v;`Set;(v;i;cb.r[])]}
C.cross.ctl_v:{[v;i;d]of[cl v;`paste;(v;att[v;`s])]}
C.cross.ctl_c:{[v;i;d]of[cl v;`copy;(v;att[v;`s])]}
C.cross.ctl_x:{[v;i;d]of[cl v;`cut;(v;att[v;`s])]}
C.cross.paste_transpose:{[v;i]of[cl v;`Set;(v;i;+cb.r[])]}
C.cross.ctl_shift_c:{[v;i;d]s:att[v;`s];cb.w@+(,`,s 1),s[0],'`. v,s:?:'+s;}

C.cross.Set:{[v;i;d]
 if[#d+:
  c:cl v
  i0::[(1<#d)&1=#u:?i[;0];drop[*u;of[c;`bang;,v]0];?i[;0]]
  i1::[(1<*|^d)&1=#u:?i[;1];drop[*u;of[c;`bang;,v]1];?i[;1]]
  i:(i0;i1)
  s:2#^d;j:#:'i;if[1=*s;s[0]:*j];if[1=s 1;s[1]:j 1];n:j&s
  j:.u.cross n#'i;d:n[0]#n[1]#'d
  k:&_n~/:r:eGet[v]'[j;,/d]
  r:n#@[r;k;:;{`. v,x}'j k]
  t:n#'i
  m:.[`. v;t;:;r]
  .[`;v;:;m]
  trigger[v;t]]
}

/ Cross object

C.Cross.super:`cross`Data

/ Vector_ object

C.Vector_.super:`vector`Data_
C.Vector_.all_:{[v]!#`. v}
C.Vector_.get_:{[v]&of[cl v;`bool_;,v]}
C.Vector_.bool_:{[v]:[1~att[v;`Check];`. v;_n~a:att[v;`bg];&#`. v;~a=of[cl v;`false;,v]]}
C.Vector_.selected_:{[v]:[_n~s:att[v;`s];!0;s]}
C.Vector_.permute:{[v;k]{if[~@att[v;x];.[`;jd[v],x;@[;k]]]}'DLIST;}
C.Vector_.sort_:{[c;v;f]i:f`. v;s:&of[c;`bool_;,v]i;.[`;v;@[;i]];of[c;`permute;(v;i)];of[c;`set_;(`Only;v;s)]}
C.Vector_.Copy_Selection__:{[v]:[1~att[v;`Check];0;0<#of[cl v;`get_;,v]]}
C.Vector_.copy_:{[c;v].w.cbwrite[,`DFA_;,.,(of[c;`gettype;,v];?`. v,,of[c;`get_;,v])]}
C.Vector_.paste_:{[c;v]d:.w.cbread`DFA_;if[~_n~d@:of[c;`gettype;,v];of[c;`set_;(`Only;v;&(`. v)_lin d)]]}
C.Vector_.gettype:{[v]:[~_n~a:att[v;`type];a;clname@*|v]}

C.Vector_.set_:{[f;v;s]
 b:of[cl v;;,v]'`false`true`null
 s::[~0~att[v;`All];s;(#s)~#`. v;!0;s]
 s::[~0~att[v;`None];s;~#s;!#`. v;s]
 w:jd v;d:`. v;if[_n~bg:`. w,`bg;bg:(#d)#*b];i:&~bg _lin b
 :[1~att[v;`Check]
  do[1;.[`;v;:;@[(#d)#*b;s;:;b 1]];fire_t v]
  do[1;.[`;w,`bg;:;@[@[@[(#d)#*b;s;:;b 1];&d~'_n;:;b 2];i;:;bg i]];fire_t w,`bg]]
 .[`;w,`s;:;_n]
 user[`Set;f;v;s]
}

/ Pivot_ object

C.Pivot_.super:`Axes`Vector_
C.Pivot_.selected_:{[v],/att[v]'[`s`sr`sc]_dv _n}

C.Pivot_.New:{[v]
 of[`pivot;`New;,v]
 of[`Axes;`New;,v]
 of[`Data_;`New;,v]
 c:cl v
 .[`;jd[v],`rclkk;:;the[c;`KK_]]
 .[`;jd[v],`rclkrd;:;the[c;`Sel]]
 .[`;jd[v],`alkrd;:;the[c;`Sel]]
 /the following set up various event to corretly set the sort type attribute `S, which is a transient attribute whose value only exists during the event. `S is used by the sort methods to determine which sort function to use
 /`S will be a pair of symbols, the first is the type of data being sorted e.g. `a for pivot axis data, `rc for pivot row/column data.
 .[`;jd[v],`albg;:;{:[(`a;*.j.i)~att[v;`S];0]}]
 .[`;jd[v],`alfg;:;{:[(`a;*.j.i)~att[v;`S];`n]}]
 .[`;jd[v],`kd;:;{.[`;jd[.j.v],`S;:;_n];{.[`;jd[.j.v],x;::]}'`alfg`albg;{.[`;jd[.j.v],x;:;()]}'`sr`sc;}]
 .[`;jd[v],`alkd;:;{.[`;jd[.j.v],`S;:;(`a;*.j.i)];{.[`;jd[.j.v],x;::]}'`alfg`albg;{.[`;jd[.j.v],x;:;()]}'`sr`sc`s;}]
 .[`;jd[v],`rclkd;:;{.[`;jd[.j.v],`S;:;(`rc;*.j.i)];{.[`;jd[.j.v],x;::]}'`alfg`albg;.[`;jd[.j.v],`s;:;()]}]
}

C.Pivot_.Copy_Selection__:{[v]:[1~att[v;`Check];0;(5=4:att[v;`ax])&5=4:att[v;`rclbg]]}
C.Pivot_.Paste_Selection__:{[v]:[1~att[v;`Check];0;5=4:att[v;`ax]]}

C.Pivot_.copy_:{[c;v]
 if[_n~t:att[v;`True];t:True]
 a:att[v;`rclbg]
 d:.+(!of[c;`gettype;,v];(?:'att[v;`ax]@!a)@'&:'t=a[])
 .w.cbwrite[,`DFA_;,d]
}

C.Pivot_.paste_:{[c;v]
 if[_n~d:.w.cbread`DFA_ / if there is no DFA_ data in the clipboard, just exit
  .u.beep[]
  ok.e[.l.ss"No Data to Paste.\nUse Copy Selection before using Paste Selection."]
  :_n]
 a:of[c;`gettype;,v]
 d:d _di(!d)@&~(!d)_lin !a
 i:&|/(`. jd[v],`ax)[!d]_lin'd[]
 of[c;`set_;(`Only;v;i)]
}

C.Pivot_.gettype:{[v]f:!`. jd[v],`ax;:[_n~a:att[v;`type];.+(f;clname'f);@[a;g;:;clname'g:f _dvl!a]]}

C.Pivot_[`Up__`Down__]:{[v]:[_n~att[v;`S];0;1~att[v;`Check];0;5=4:att[v;`ax]]}
C.Pivot_.sort_:{[c;v;f]s:att[v;`S];of[c;`sort_a`sort_rc@`a`rc?s[0];(c;v;f),s]}
C.Pivot_.sort_a:{[c;v;f;g;h] /sort_a: sort axis values.  c is class, v is the variable path, f is the sort function e.g. <:, g is the type of data from `S (e.g. `a or `rc), h is the axis being sorted e.g. `FTime
 o:of[c;`getaxo;,v]h							/ get the list of values to be sorted
 s: :[h _in !.l[`V];.u.apply_each_uniquely[{,.l.sv[x;y]}[h];o];o]	/ use translated axis values for sorting
 .[`;jd[v],`axo,h;:;o f s]
 }
C.Pivot_.sort_rc:{[c;v;f;g;h] /sort_rc: sort non-axis rows or columns
 n:`sr`sc?att[v;`SRC];of[c;`sort_rc_;(c;v;f;g;h;pivot[dot v]0;n)]}

C.Pivot_.sort_rc_:{[c;v;f;g;h;m;n]
 if[2=#^m
  if[#a:att[v;`SR`SC n]
   i:(+a)n;q:(::;+:)n;o:nil d:`. v;
   m:q m;j:{x y(d,o)z x}/[_n;f;|m i];k:(,/q m[;j])_dv#d
   .[`;v;@[;k]];.[`;jd[v],`ax,_n;@[;k]];of[c;`permute;(v;k)]
   if[#s:of[c;`get_;,v];of[c;`set_;(`Only;v;&@[&#`. v;s;:;1]k)]]]]
}

C.Pivot_.set_:{[f;v;s]
 b:of[cl v;;,v]'`false`true`null
 s::[~0~att[v;`All];s;(#s)~#`. v;!0;s]
 s::[~0~att[v;`None];s;~#s;!#`. v;s]
 w:jd v;d:`. v;if[_n~bg:`. w,`bg;bg:(#d)#*b];i:&~bg _lin b
 :[1~att[v;`Check]
  do[1;.[`;v;:;@[(#d)#*b;s;:;b 1]];fire_t v]
  do[1;.[`;w,`bg;:;@[@[@[(#d)#*b;s;:;b 1];&d~'_n;:;b 2];i;:;bg i]];fire_t w,`bg]]
 .[`;w,,`s`sr`sc;:;_n]
 bg:*b
 ax:`. w,`ax
 bx:?:'ax[]
 j:=:'bx?/:'ax[]
 cx:bx@'&:'&/''j _lin\:\:s
 n:{:[4:x;x=nil x;x _lin (_n;0N;0n;" ";`;;;)@?4::'x]}'bx
 t:(2*n)+(~n)*bx[]_lin'cx
 bg:.+(!ax;b t)
 .[`;w,`rclbg;:;bg]
 fire_t w,`rclbg
 user[`Set;f;v;s]
}

/ Matrix_ object

C.Matrix_.super:`matrix`Data_
C.Matrix_.get_:{[v]c:cl v;:[1~att[v;`Check];of[c;`where;(v;`. v)];_n~a:att[v;`bg];();of[c;`where;(v;~a=of[c;`false;,v])]]}
C.Matrix_.selected_:{[v]:[_n~s:att[v;`s];();s]}
C.Matrix_.O:`All`None`s0`Only`Except`s1`With`Without`In
C.Matrix_.all_:{[v].u.cross of[cl v;`Bang;,v]}

C.Matrix_.set_:{[f;v;s]
 b:of[c:cl v;;,v]'`false`true`null
 s::[~0~att[v;`All];s;(#s)~#of[c;`all_;,v];();s]
 s::[~0~att[v;`None];s;~#s;of[c;`all;,v];s]
 w:jd v
 u:1~att[v;`Check]
 a:{:[*r:.[.;(y;z;:;x);:];y;r 1]}
 if[u;.[`;v;:;a[b 1]/[of[c;`reshape;(v;*b)];s]];fire_t v]
 if[~u
  bg:a[b 1]/[of[c;`reshape;(v;*b)];s]
  if[_n~ag:`. w,`bg;ag:bg];i:(!#ag){(x;y)}'&:'~ag _lin\:b
  bg:{.[x;y;:;ag . y]}/[bg;i]
  n:|/#:'bg;bg:@[bg;_n;{n#x,n#b 2}]
  .[`;w,`bg;:;bg]
  fire_t w,`bg]
 .[`;w,`s;:;_n]
 user[`Set;f;v;s]
}

/ Table_ object

C.Table_.super:`table`Data_
C.Table_.get_:{[v]c:cl v;:[1~att[v;`Check];of[c;`where;(v;`. v,_n)];_n~a:att[v;`bg];();of[c;`where;(v;~a[]=of[c;`false;,v])]]}
C.Table_.selected_:{[v]:[_n~s:att[v;`s];();s]}
C.Table_.all_:{[v].u.cross of[cl v;`Bang;,v]}

C.Table_.New:{[v]
 of[`Data_;`New;,v]
 if[#*of[c:cl v;`shape;,v]
  .[`;jd[v],`clbg;:;{:[(*.j.i)~att[v;`S];0;`n]}]
  .[`;jd[v],`clfg;:;{:[(*.j.i)~att[v;`S];`n;0]}]
  .[`;jd[v],`clkd;:;{of[c;`SS;(.j.v;:[~att[v;`S]~*.j.i;*.j.i])]}]]
}

C.Table_.SS:{[v;i].[`;jd[v],`S;:;i];.[`;jd[v],`clbg;::];.[`;jd[v],`clfg;::];}
C.Table_.ss:{[v;i;d]of[`table;`ss;(v;i;d)];if[#d;of[cl v;`SS;(v;)]]}

C.Table_[`Up__`Down__]:{[v]:[_n~att[v;`S];0;1~att[v;`Check];0;1<#^`. v,_n]}
C.Table_.permute:{[v;k]{if[5=4:att[v;x];.[`;jd[v],x,_n;{:[~@y;y x;y]}[k]]]}'DLIST;}

C.Table_.sort_:{[c;v;f]
 g:att[v;`S]
 i:f`. v,g;.[`;v,_n;@[;i]]
 of[c;`SS;(v;)]
 if[#s:of[c;`get_;,v]
  h:?*+s
  s:,/h{x,'&y}'@[.[;;:;1]/[@[_n;h;:[;&#i]];s];_n;@[;i]][]
  of[c;`permute;(v;i)]
  of[c;`set_;(`Only;v;s)]]
}

C.Table_.Copy_Selection__:{[v]:[1~att[v;`Check];0;0<#+of[cl v;`get_;,v]]}

C.Table_.copy_:{[c;v]
 s:+of[c;`get_;,v]
 d:.(?*s){(of[c;`gettype_f;(v;x)];?`. v,(x;y))}'s[1;=*s]
 .w.cbwrite[,`DFA_;,d]
}

C.Table_.paste_:{[c;v]
 d:.w.cbread`DFA_
 a:of[c;`gettype;,v]
 d:d _di(!d)@&~(!d)_lin a[]
 j:(!a)a[]?/:!d
 i:,/j,''(`. v)[j]{&x _lin y}'d j
 of[c;`set_;(`Only;v;i)]
}

C.Table_.gettype_f:{[v;f]:[~_n~a:att[v;`type]f;a;clname f]}
C.Table_.gettype:{[v]f:!`. v;:[_n~a:att[v;`type];.+(f;clname'f);@[a;g;:;clname'g:f _dvl!a]]}

C.Table_.set_:{[f;v;s]
 b:of[c:cl v;;,v]'`false`true`null
 s::[~0~att[v;`All];s;(#s)~#of[c;`all_;,v];();s]
 s::[~0~att[v;`None];s;~#s;of[c;`all;,v];s]
 w:jd v
 u:1~att[v;`Check]
 a:{:[*r:.[.;(y;z;:;x);:];y;r 1]}
 if[u;.[`;v,_n;:;a[b 1]/[of[c;`reshape_;(v;*b)];s][]];fire_t v]
 if[~u
  bg:a[b 1]/[of[c;`reshape_;(v;*b)];s]
  if[_n~ag:`. w,`bg;ag:bg];i:(!ag){(x;y)}'&:'~ag[]_lin\:b
  bg:a[b 2]/[bg;of[c;`where;(v;(`. v,_n)~'\:_n)]]
  n:|/#:'bg[];bg:@[bg;_n;{n#x,n#b 2}]
  bg:{.[x;y;:;ag . y]}/[bg;i]
  .[`;w,`bg;:;bg]
  fire_t w,`bg]
 .[`;w,`s;:;_n]
 user[`Set;f;v;s]
}

/ Slot_ object

C.Slot_.super:`slot`Data_
C.Slot_.all_:{[v]of[cl v;`all;(v;)]}
C.Slot_.get_:{[v]c:cl v;:[1~att[v;`Check];of[c;`where;(v;`. v,_n)];_n~a:att[v;`bg];0#`;of[c;`where;(v;~a[]=of[c;`false;,v])]]}
C.Slot_.selected_:{[v]:[_n~s:att[v;`s];0#`;s]}
C.Slot_.O:`All`None`s0`Only`Except`s1`With`Without`In

C.Slot_.set_:{[f;v;s]
 b:of[c:cl v;;,v]'`false`true`null
 s::[~0~att[v;`All];s;(#s)~#of[c;`all_;,v];();s]
 s::[~0~att[v;`None];s;~#s;of[c;`all;,v];s]
 w:jd v
 u:1~att[v;`Check]
 a:{:[*r:.[.;(y;z;:;x);:];y;r 1]}
 if[u;.[`;v,_n;:;a[b 1]/[of[c;`reshape_;(v;*b)];s][]];fire_t v]
 if[~u
  bg:a[b 1]/[of[c;`reshape_;(v;*b)];s]
  if[_n~ag:`. w,`bg;ag:bg];i:(!ag)@&~ag[]_lin b
  bg:a[b 2]/[bg;of[c;`where;(v;(`. v,_n)~'_n)]]
  bg[i]:ag i
  .[`;w,`bg;:;bg]
  fire_t w,`bg]
 .[`;w,`s;:;_n]
 user[`Set;f;v;s]
}

/ Cross_ object

C.Cross_.super:`cross`Data_
C.Cross_.all_:{[v]of[cl v;`all;(v;)]}
C.Cross_.get_:{[v]c:cl v;:[1~att[v;`Check];of[c;`where;(v;`. v,_n,_n)];_n~a:att[v;`bg];();of[c;`where;(v;~a[;]=of[c;`false;,v])]]}
C.Cross_.selected_:{[v]:[_n~s:att[v;`s];();s]}
C.Cross_.O:`All`None`s0`Only`Except`s1`With`Without`In

C.Cross_.set_:{[f;v;s]
 b:of[c:cl v;;,v]'`false`true`null
 s::[~0~att[v;`All];s;(#s)~#of[c;`all_;,v];();s]
 s::[~0~att[v;`None];s;~#s;of[c;`all;,v];s]
 w:jd v
 u:1~att[v;`Check]
 a:{:[*r:.[.;(y;z;:;x);:];y;r 1]}
 if[u;.[`;v,_n,_n;:;a[b 1]/[of[c;`reshape;(v;*b)];s][]];fire_t v]
 if[~u
  bg:a[b 1]/[of[c;`reshape;(v;*b)];s]
  if[_n~ag:`. w,`bg;ag:bg];i:,/(!bg){x,/:y}'(!:'bg[])
  bg:a[b 2]/[bg;of[c;`where;(v;(`. v,_n)~'_n)]]
  bg:a[b 2]/[bg;paths[bg]_dvl paths`. v]
  bg:{:[(c:ag . y)_lin b;x;.[x;y;:;c]]}/[bg;i]
  .[`;w,`bg;:;bg]
  fire_t w,`bg]
 .[`;w,`s;:;_n]
 user[`Set;f;v;s]
}

/ text object

C.text.super:`scalar`scrollable
C.text.initial:`e`wrap`get`cursor /`get override, must occur before `cursor because you can't set the cursor position till the text value has been sent (which happens during `get)
C.text.public:`save`wrap`cursor`f`g
C.text.terminal:`save
C.text.valid:{[c;v]-3=4:d:`. v}
C.text.set:{[v;i;d]if[7=4:g:att[v;`g]; d:g@d]; ji[`set;{.[`;x;upd[x;_n];y];trigger[x;()]};(v;d);v;()]}
C.text.get:{[v;i]d:`. v; if[7=4:f:att[v;`f]; d:f@d]; if[(of[cl v;`getecho;,v])|pp:(1~att[v;`pastePending]);if[pp;.[`;jd[v];_di;`pastePending]];.m.set(`set;(`name,dot v;(`index;());(`value;{:[~#x;"";x]}@d)))]}
C.text.renew:{[v;i]~cl[v]=name.c v}
C.text.shape:{[v]!0}
C.text.constraint[`wy`fill]:1.,`b
C.text.atomic:0
C.text.copy:{[v;i]d::[7=4:f:att[v;`f]; f@`. v; `. v];if[@i;i:!0];.w.cbwriteraw[,`text;,(d@i),"\000"]}
C.text.cut:{[v;i]d::[7=4:f:att[v;`f]; f@`. v; `. v];g::[7=4:g:att[v;`g];g;{x}];if[@i;i:!0];of[cl v;`copy;(v;i)];.[`;v;:;g@d _di i];}
C.text.all:{[v;i]}
C.text.some:{[v;i]:[~_n~*i;i]}
C.text.first:{[v]:[#name.s v;0]}
C.text.cursor:{[v;i] pos: att[v;`cursor] & #`. v; .m.set(`set;(`name,dot v;(`index;());(`cursor;pos)))} /set the cursor position, making sure we never set it to a point past the end of the current text value

C.text.paste:{[v;i] /C.text.paste: v is k variable, i is the selection interval or null if no selection
 if[#d:1_,/"\n",/:.w.cbread`text /if there's any text in the clipboard
  g::[7=4:g:att[v;`g]; g; {x}]
  c:att[v;`cursor] /get the current cursor location
  k::[~_n~i;i[0],1+*|i;2#c] /determine the start and end points of the paste: either replace the current selection for the length of the paste data, or insert at the cursor location if no selection
  t::[7=4:f:att[v;`f]; f@`. v; `. v]
  .[`;v;:;g@(k[0]#t),d,k[1]_ t] /insert/replace the clipboard text as determined by the start and end points
  .[`;jd[v],`cursor;:;(#d)+*k] /update the cursor location
  .[`;jd[v],`pastePending;:;1]] /set temporary attribute to force text.get functions will send java the updated data
}

C.text.ctl_v:{[v;i;d]of[cl v;`paste;(v;att[v;`s])]}
C.text.ctl_c:{[v;i;d]of[cl v;`copy;(v;att[v;`s])]}
C.text.ctl_x:{[v;i;d]of[cl v;`cut;(v;att[v;`s])]}

C.text.cbformats:`text
cons'[`text;`save`wrap;::];
vset[`text;`scursor;`cursor]
C.text.alwaysSel:1

/ Text object

C.Text.super:`text`Data
C.Text.getecho:{[v]:[~jtrigger v;1;~v~VAR;1;0]}
cons[`Text;`save;{1}]

/ string object

C.string.super:`text
C.string.public:`escape
C.string.constraint[`wy`fill]:1.,`h
C.string.valid:{[c;v]-3=4:`. v}
C.string.escape:renew
C.string.get_nl:{[v]d:{:[~#x;"";x]}`. v;:[1~att[v;`escape];_ssr/[d;("\n";"\t";"\r");("\\n";"\\t";"\\r")];d]}
C.string.set_nl:{[v;d]:[1~att[v;`escape];_ssr/[d;("\\n";"\\t";"\\r");("\n";"\t";"\r")];d]}
C.string.get:{[v;i]c:cl v;if[of[c;`getecho;,v];.m.set(`set;(`name,dot v;(`index;());(`value;of[c;`get_nl;,v])))]}
C.string.set:{[v;i;d]ji[`set;{.[`;x;upd[x;_n];y];trigger[x;()]};(v;of[cl v;`set_nl;(v;d)]);v;()]}

/ String object

C.String.super:`string`Data
C.String.getecho:{[v]:[~jtrigger v;1;~v~VAR;1;0]}
cons[`String;`save;{1}]

/ password object

C.password.super:`string

/ html object

C.html.super:`text
C.html.slink:{[v;i;d].[`;w:jd[v],`link;:;d];fire_t w}

/ url object

C.url.super:`text

/ image object

C.image.super:`text
C.image.renew:{[v;i]1}

/ basis of aligned position objects

C.alignpos.super:`object
C.alignpos.abstract:1
C.alignpos.public:`valign`halign`vpos`hpos
C.alignpos.initial:`valign`halign`vpos`hpos
cons'[`alignpos;`vpos`hpos`valign`halign;::];

/ label object

C.label.super:`text`alignpos
C.label.FONT:`l
C.label.get:{[v;i].m.set(`set;(`name,dot v;(`index;());(`value;{:[~#x,:"";"";~"\n"_in x;x;"<html>",_ssr[x;"\n";"<br>"]]}`. v)))}

/ progress-bar object

C.progress.super:`scalar
C.progress.public:`min`max`dir`indeterminate
C.progress.initial:`min`max`dir`e`indeterminate
C.progress.valid:{[c;v]1=4:`. v}
C.progress.new:{[v;p;w]New[v;p;w];of[cl v;`created;,v]}
C.progress.get:{[v;i].m.set(`set;(`name,dot v;(`index;());(`value;`. v)))}
cons'[`progress;`min`max`dir`indeterminate;::];
C.progress.constraint[`fill]:`h
C.progress.atomic:0

/ slider object

C.slider.super:`progress
C.slider.public:`major`minor
C.slider.initial:`major`minor
C.slider.set:{[v;i;d]ji[`set;{.[`;x,y;upd[x;y];z];trigger[x;y]};(v;i;d);v;i];dj v}
cons'[`slider;`major`minor;::];

/ checkbox object

C.check.super:`scalar`alignpos
C.check.initial:`e
C.check.selflabel:1
C.check.atomic:0
C.check.constraint[`wy`fill]:NoExtraSpace,`h /default to never giving any extra vertical space, and horizontal fill
C.check.in:{[v;i;d]d}
C.check.out:{[v;i;d]d}

/ basis of grouped objects

C.group.super:`object
C.group.abstract:1
C.group.initial:`group
C.group.public:`group
cons[`group;`group;::]
/horizontal groups (all objects in a group are given the same width)
C.hgroup.super:`object
C.hgroup.abstract:1
C.hgroup.initial:`hgroup
C.hgroup.public:`hgroup
cons[`hgroup;`hgroup;::]
/vertical groups (all objects are given the same height)
C.vgroup.super:`object
C.vgroup.abstract:1
C.vgroup.initial:`vgroup
C.vgroup.public:`vgroup
cons[`vgroup;`vgroup;::]

/ basis of button image objects

C.buttonimage.super:`object
C.buttonimage.abstract:1
C.buttonimage.public:`scaledimage`image`size
C.buttonimage.initial:`scaledimage`image`size
C.buttonimage.sfail:{[v;i;d].[`;jd[v],`fail;:;d];}
C.buttonimage.I:{[s;v;i]:[~_n~a:att[v;s];.m.set(`set;(`name,dot v;(`index;());(s;a)));of[cl v;`l;(v;i)]]}
C.buttonimage.image:C.buttonimage.I[`image]
C.buttonimage.scaledimage:C.buttonimage.I[`scaledimage]
cons[`buttonimage;`size;::]

/ basis of margined objects

C.margin.super:`object
C.margin.abstract:1
C.margin.public:`margin
C.margin.initial:`margin
cons[`margin;`margin;::]

/ togglebutton object

C.togglebutton.super:`check`group`buttonimage`alignpos`margin

/ pushbutton object

C.button.super:`scalar`buttonimage`alignpos`margin`hgroup`vgroup
C.button.public:`mnem
C.button.initial:`mnem`e`l /override `l, it must run before `hgroup and `vgroup
C.button.valid:{[c;v](4:`. v)_in -3 4 6 7}
C.button.new:{[v;p;w]New[v;p;w];of[cl v;`created;,v]}
C.button.set:{[v;i;d]eval[`set;v;i;`. v]}
C.button.selflabel:1
C.button.atomic:0
C.button.constraint[`wy]:NoExtraSpace /default to never giving any extra vertical space
cons[`button;`mnem;::]
list[`button;`bg;color]
noop'[`button;`get`font;2];

/ radiobutton object

C.radiobutton.super:`check`group

/ radiobox object

C.radio.super:`scalar`scrollable
C.radio.public:`o`ol
C.radio.initial:`e

C.radio.new:{[v;p;w]
 if[~in v
  c:cl v
  / if there are no ol attribute values, default ol to using the o attribute values.  Do this before the next line or else the new function will create recursion and double create all the buttons
  if[(-4=4:o)&_n~att[v;`ol];.[`;jd[v],`ol;:;(o;o)]]
  m:new[c;v;p;layout[c;v;w]]
  name.setD[v;o:att[v;`o]]
  the[c;`button][v;the[c;`child];m]'of[c;`geto;,v]
  initial[c;v];end m;terminal[c;v];of[c;`created;,v]]}

C.radio.renew:{[v;i]:[~cl[v]=name.c v;1;~att[v;`o]~name.D v]}
C.radio.geto:{[v](?,/att[v;`o])_dv`} / get a list of the unique, non-empty o attribute values for v
C.radio.child:`radiochild
C.radio.valid:{[c;v](4:`. v)_in 4 6}
C.radio.layout:{[v;o]setl'[`fill`ix`iy`gridy`gridx`gridheight`gridwidth;`h,0 0,extent[vmat att[v;`o]]o];L}
C.radio.button:{[v;c;p;o]d:cl v;.m.set(`set;(`name,new[c;name.i v;p;of[d;`layout;(v;o)]];(`index;());(`label;of[d;`getol;(v;o)])))}
C.radio.getol:{[v;o]:[_n~a:att[v;`ol];o;7=t:4:a;a o;5=t;label a o;label a[1;a[0]?o]]}
C.radio.setol:{[v;d]:[_n~a:att[v;`ol];d;7=t:4:a;a d;5=t;(!a)label[a[]]?cast[d;a[]];a[0;label[a 1]?cast[d;a 1]]]}
C.radio.get:{[v;i].m.set(`set;(`name,(1_ name.child dot v)of[cl v;`geto;,v]?of[cl v;`getval;,v];(`index;());`value`true))}
C.radio.set:{[v;i;d]ji[`set;{d:(*0#of[cl x;`geto;,x])$$y;.[`;x;upd[x;_n];d];trigger[x;d]};(v;of[cl v;`setol;(v;d)]);v;()]}
C.radio.getval:{[v]:[~_n~r:`. v;r;*att[v;`o]]}
C.radio.o:renew
C.radio.ol:renew
C.radio.constraint[`wx`wy`fill]:.1 .1,`b
C.radio.atomic:0
ccons'[`radio;`bg`fg`font`e`tip;(color;color;font;edit;label)];

C.toggle.super:`radio`buttonimage`alignpos`margin
C.toggle.child:`togglechild
ccons'[`toggle;`scaledimage`image`size`valign`halign`vpos`hpos`margin;::];
C.toggle.sfail:{[v;i;d].[`;jd[v],`fail,i;:;d];}

/ spinner object

C.spinner.super:`scalar
C.spinner.public:`o`e
C.spinner.initial:`geto
C.spinner.valid:{[c;v](4:`. v)_in 1 2 3 4 6 7}
C.spinner.set:{[v;i;d]c:cl v;ji[`set;{c:cl v;d:of[c;`getscale_;(v;of[c;`setol1;(x;$y)])];.[`;x;upd[x;_n];d];trigger[x;d]};(v;d);v;()]}
C.spinner.get:{[v;i]c:cl v;.m.set(`set;(`name,dot v;(`index;());`value,sym of[c;`getscale;(v;of[c;`getval;,v])]))}
C.spinner.getscale:{[v;d]if[(4:d)_in 1 2;if[~_n~s:att[v;`scale];:scale[d;s]]];d}
C.spinner.getscale_:{[v;d]if[(4:d)_in 1 2;if[~_n~s:att[v;`scale];:scale_[d;s]]];d}
C.spinner.geto:{[v;i]c:cl v;.m.set(`set;(`name,dot v;(`index;());(`o;sym@{of[c;`getscale;(v;x)]}'att[v;`o])))}
C.spinner.setol1:{[v;o](*0#of[cl v;`getval;,v])$o}
C.spinner.getol1:{[v]label@of[cl v;`getval;,v]}
C.spinner.getval:{[v]:[~_n~r:`. v;r;*att[v;`o]]}
C.spinner.o:renew
C.spinner.scale:renew
C.spinner.atomic:0

C.spinner.renew:{[v;i]:[~cl[v]=name.c v;1;~att[v;`o]~name.D v]}

C.spinner.new:{[v;p;w]
  if[~in v
    New[v;p;w]
    name.setD[v;o:att[v;`o]]
    if[-4=4:o					/ If the option list is a symbol vector
      /`0: "spinner.new found symbol option list: ",(5: o),"\n"
      ol: ool: att[v;`ol]
      ol: :[6=4:ol; (o;o)			/ If no option labels have been specified, default the option labels to be the same as their option list value
            7=4:ol; ol				/ If ol is a function, leave it alone
            5=4:ol; @[ol;i;:;i:o _dvl !ol]	/ Otherwise, default any missing option labels to be their option list value
            0=4:ol; ol,'2#,i:o _dvl *ol ]
      if[~ol~ool				/ If we have changed ol
        /`0: "spinner.new setting default: ",(5: ol),"\n"
        .[`;jd[v],`ol;:;ol]
        of[cl v;`ol;(v;())]			/ Run the ol attribute function on the default values just set so java will update the GUI
      ]
    ]
    of[cl v;`created;,v]
  ]
}

/ combo button object

C.combo.super:`spinner
C.combo.public:`ol`olfg`olbg`olfont`rows
C.combo.initial:`geto`ol`olfg`olbg`olfont /geto override, it must run before ol
C.combo.refont:{[s;d;a] / C.combo.refont
  :[~`olfont=s;C.gui.refont[s;d;a]
    6=t:4:a;d
    5=t;@[a;_n;_f[s;d]]
    ~t;.[a;1,_n;_f[s;d]]
    _n~d;d
        `$1_,/" ",'$@[font3 a;2;:;font3[d]2]]}
C.combo.constraint[`wy`fill]:NoExtraSpace,`h /default to never giving any extra vertical space, and always fill horizontally
C.combo.rows:{[v;unused] .m.set(`set;(`name,dot v;(`index;());(`rows;(att[v;`rows];))))}
C.combo.OLFONT:`l
olist'[`combo;`ol`olfg`olbg`olfont;(label;color;color;font)];
C.combo.atomic:0
C.combo.copy:{[v;i] /C.combo.paste: v is k variable, i is unused. Put the current value of the combo (or it's label if it has one) in the clipboard as text.
  lbl: kval: `. v /the actual current value of the combo
  comboLabels: `. (jd v),`ol /get the combo option labels
  if[~_n~comboLabels /if there are any labels, the text value of the copy should be that string
    if[(#comboLabels[0])>i: comboLabels[0] ? kval; lbl: comboLabels[1;i]]
    ]
  .w.cbwrite[`k`text;(kval;$,//lbl)] /can't use cb.w here as it doesn't handle multiple type values, and we don't want to write csv data for a combo
}
C.combo.ctl_c:{[v;i;d]of[cl v;`copy;(v;att[v;`s])]} /C.combo.ctl_c: clipboard copy
C.combo.ctl_v:{[v;i;d] /C.combo.ctl_v: clipboard paste
  pastekval: .w.cbread`k /the actual value to look for among the combo box values
  pastelbl: *.w.cbread`text /only use the first line of text if there are multiple
  if[pastekval~_n; pastekval: `$pastelbl] /if there is no k data, use the text data as a symbol
  if[pastekval~_n; .j.e("No clipboard information to paste"); :_n] /if there isn't a value to paste, bail out
  /else allow paste if there's a matching combo value, else disallow the paste
  if[pastelbl~_n; pastelbl: *$,//pastekval] /if there isn't a text value, make a string from the kval
  comboVals: `. (jd v),`o
  comboLabels: $:[~_n~t: `. (jd v),`ol; t 1; comboVals] /get the combo option labels
  if[(#comboVals) = i: comboVals ? pastekval; .j.e("Paste value '",pastelbl,"' is not available in the option list"); : _n]
  /else change the combo to the paste value
  of[`combo;`set;(v;;comboVals i)]
 }

/ vantagepoint graphics

C.g.super:`gui
C.g.abstract:1
C.g.initial:`getshape`get`anno`annofg`annofont`annoalign`annop`annopalign`annopfg`annopfont`watermark
C.g.terminal:`rownames`colnames`footnote`subtitle`title`oi`pi`aoi`api`coi`fi`axis`aoi2`api2`thi2`axis2`afi2`acoi2`voi`vpi`vcoi`acoi`afi`thi`ibi`aibi`aibi2`mousemode`release`range
C.g.public:`rownames`colnames`footnote`subtitle`title`oi`pi`aoi`api`coi`fi`axis`aoi2`api2`thi2`axis2`afi2`acoi2`voi`vpi`vcoi`acoi`afi`thi`anno`annofg`annofont`annoalign`annop`annopalign`annopfg`annopfont`ibi`aibi`aibi2`mousemode`watermark`range
C.g.rank:0
C.g.gvalid:{[f;c;v]d:hmat@:[4=_abs 4:v;`. v;v];(&/(4::'d)_lin -1 -2)&f d}
C.g.valid:C.g.gvalid[{x;1}]
C.g.getshape:{[v;i].m.set(`set;(`name,dot v;(`index;());(`shape;:[2=#s:name.s v;s;1,s])))}
C.g.imap:{[c;v;i](:[_n~i;i;1=#i;0,i;i];)}
C.g.out:{[v;i;d](::;hmat)[_n~i]@1.*d}
anno'[`g;`anno`annofg`annofont`annoalign`annop`annopalign`annopfg`annopfont;((),;color;font;(),;(),;(),;color;font)];
gcons'[`oi`pi`coi`fi;(::;::;color;font)];
gcons'[`aoi`api`thi`axis`afi`acoi;(axis;axis;axis;axis;axisfont;axiscolor)];
gcons2'[`aoi2`api2`thi2`axis2`afi2`acoi2;(axis2;axis2;axis2;axis2;axisfont2;axiscolor2)];
gitem'[`voi`vpi`vcoi;(::;::;color)];
C.g.ibi:{[v;i]a:att[v;`ibi];if[#i;a:.[_n;i;:;a . i]];(!a)ibi[v]'a[];}
C.g.aibi:{[v;i]a:att[v;`aibi];if[#i;a:.[_n;i;:;a . i]];(!a)aibi[v]'a[];}
C.g.aibi2:{[v;i]a:att[v;`aibi2];if[#i;a:.[_n;i;:;a . i]];(!a)aibi2[v]'a[];}
cons'[`g;`rownames`colnames`footnote`subtitle`title`mousemode`watermark`release;({:[_n~x;0#`;(),x]};{:[_n~x;0#`;(),x]};$:;$:;$:;::;::;::)];
gevent'[`g;`groupselect`singleselect`multiselect`singleselecthint`multiselecthint];

Graphics:`gbar`gboxplot`gbubblescatter`gcombo`gcontour`gcrossscatter`gdial`ggradient`ggrid`ghilowclose`gline`gpie`gpiescatter`gradar`gscatter`gscattermatrix`gvectorscatter`gcrossbubblescatter
cons'[Graphics;`range;::];
vset'[Graphics;`srange;`range];
Graphics3:`gbar3`gbubblescatter3`gcrossscatter3`gline3`gpiescatter3`gscatter3`gsurface3`gvectorscatter3
{.[`.j.C;x,`super;:;`g]}'Graphics,Graphics3;
{cat[x;;`am`sleep`view]'`public`terminal;cons'[x;`am`sleep`view;::];vset[x;`sview;`view]}'Graphics3;

C.ggradient.valid:C.g.gvalid[1=#:]
C.gscatter.valid:C.g.gvalid[2=#:]
C.gbubblescatter.valid:C.g.gvalid[3=#:]
C.gcrossbubblescatter.valid:C.g.gvalid[1<#:]
C.gvectorscatter.valid:C.g.gvalid[4=#:]
C.gcrossscatter.valid:C.g.gvalid[1<#:]
C.gpiescatter.valid:C.g.gvalid[2<#:]
C.gscatter3.valid:C.g.gvalid[3=#:]
C.gbubblescatter3.valid:C.g.gvalid[4=#:]
C.gvectorscatter3.valid:C.g.gvalid[5=#:]
C.gcrossscatter3.valid:C.g.gvalid[2<#:]
C.gpiescatter3.valid:C.g.gvalid[3<#:]

cat[`gcombo;;`bars`lines]'`public`terminal;
vcons'[`gcombo;`bars`lines;(!#hmat name.s@;{x;!0});(),];

cat[`ghilowclose;;`hlocv]'`public`terminal;
vcons[`ghilowclose;`hlocv;{x;!5};(),]

cat[`gcrossscatter;;`vars]'`public`terminal;
vcons[`gcrossscatter;`vars;0,'1_!*name.s@;hmat]

cat[`gcrossbubblescatter;;`vars]'`public`terminal;
cat[`gcrossbubblescatter;;`sizes]'`public`initial;
cons[`gcrossbubblescatter;`sizes;::]
vcons[`gcrossbubblescatter;`vars;0,'1_!*name.s@;hmat]

cat[`gcrossscatter3;;`vars]'`public`terminal;
vcons[`gcrossscatter3;`vars;0 1,/:2_!*name.s@;hmat]

cat[`gpiescatter;;`vars]'`public`terminal;
vcons[`gpiescatter;`vars;2_!*name.s@;(),]

cat[`gpiescatter3;;`vars]'`public`terminal;
vcons[`gpiescatter3;`vars;3_!*name.s@;(),]

/ generate the multiple inheritance hierarchy

hierarchy[]

/ start

\l common/k/env
\l common/java/k/csv

MODE:mode[]

.m.J:1

if[_n~.j`APPLICATION;APPLICATION:`k]

java_start:{
 profileStart`.j.ready
 if[~.a`S;.a[`S]:.p`Start]
 if[s:~.p[`Java]_in?.w.getbusytcp[];java_exec[]]
 .h.init[]
 :[~_p;java_port[];.h.set .u.lc APPLICATION]
 java_connect s
}

java_port:{
 :[APPLICATION~`player          ;do[1;."\\m i ",$.p`Player;.h.set APPLICATION]
   APPLICATION~`recorder        ;do[1;."\\m i ",$.p`Recorder;.h.set APPLICATION]
                                 ."\\m i ",$.h.get .u.lc APPLICATION]
 .h.def[]
 .a[`H`P`U`I`S]:(_h;_p;_u;.h.mypid[];.p`Start)
}

java_jars:{-1_,/({x@&~"/"=*:'x}((.f.decrypt[0::;"common/java/dfk/jars.dfk"]_dv'" ")_dv"")),'";"}

java_exec:{
 s:""
 if[~(0;,"0")~.[6::;,(`L;"Software\\DFA Capital Management";`Splash);:]
  // This is a hack.  Java has no idea of the state of licenses.  We rely on the
  // fact that the user has selected everything in license settings to display
  // the correct splash.
  splash:($.a`A),"/ui/splash"
  if[(`GEMS~.a`A)&(-4~4:.p[`License;`yes;`Modules])
    splash,:"_",:[`Financing _in .p[`License;`yes;`Modules];  "em"  / Enterprise Modeler
                  `Investments _in .p[`License;`yes;`Modules];"pa"  / Portfolio Analyser
                  "sm"]]                                            / Scenario Master
  s,:"-splash:",splash,".png "]
 if[0~.p`Direct_Draw
  s,:"-Dsun.java2d.noddraw "]
 if[.w.useNThacks[]
  s,:"-Dswing.disableFileChooserSpeedFix=true "]
 if[.v.e /if running developer version, add in the jvm debug options
  s,:"-Xdebug -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n "]
 s,:"-Xmx512m -classpath ",java_jars[]," com.dfa.main localhost ",$.p`Java
 :[.v.e
   .h.k"common/java/jre ",.a[`a]," ",s
   .w.exec[`open;.w.os"jre\\bin\\",($.a`a),.f.getAppSuffix[];s;_n;`shownormal;`java]]
}

java_connect:{[s].m.G[:[s;.m.O;.m.O_]@`localhost,.p`Java;(`localhost;_p)]}

g:{java_start[]}
