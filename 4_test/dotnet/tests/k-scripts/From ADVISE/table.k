/ table editor (demo)

\l common/java/j

\d T

BG:-190
LG:-240

atp:{set_a`T__}

atp_:{
 if[`=n:p.T__.q.nm;:.j.e`"Table property must have a name"]
 if[n _in!p.T;:.j.e`"Table property must be a unique name"]
 if[*.[.:;,,`n`;:];:.j.e`"Property name must begin with a letter and contain only letters, digits and '_'"]
 d:(0N;0n;`)`Integer`Float`Symbol?p.T__.q.pt
 p.T[n]:d
 if[p.T__.q.cb;p.T..j.cell[n]:cell@,d]
 p.T..j.a,:n
 set_a`T
}

label:{:[p[~x;`i]_in!p[~x;`j;`rl];p[~x;`j;`rl;p[~x;`i]];p[~x;`i]]}

rtp:{
 if[`Yes~.j.yesno`"Are you certain that you want to remove ",$label`T
  p.T..j.a::p.T..j.a _dv p.T..i
  p.T::p.T _di p.T..i
  p.T..j.rl::p.T..j.rl _di p.T..i
  p.T..j.cell::p.T..j.cell _di p.T..i]
}

etp:{
 p.T_::p.T..j.cell[p.T..i;`o]
 p.T_..j.l::label`T
 set_a`T_
}

etp_:{
 v:?((;0N;0n;;`)@4:*v),v:p.T_
 if[~p.T[p.T..i]_in v;p.T[p.T..i]:*v]
 p.T..j.cell[p.T..i;`o]:v
 set_a`T
}

afp:{set_a`F__}

afp_:{
 if[`=n:p.F__[`q;`nm];:.j.e`"Field property must have a name"]
 if[n _in!p.F;:.j.e`"Field property must be a unique name"]
 if[*.[.:;,,`n`;:];:.j.e`"Property name must begin with a letter and contain only letters, digits and '_'"]
 d:(0N;0n;`)`Integer`Float`Symbol?p.F__[`q;`pt]
 E[n]:(#E`fn)#d
 p.F[n]:d
 if[p.F__[`q;`cb];p.F..j.cell[n]:cell@,d]
 p.F..j.a,:n
 p.S[n]:`All
 p.S..j.cell[n]:cell2 n
 p.S..j.a,:n
 set_a`F
}

efp:{
 p.F_::p.F..j.cell[p.F..i;`o]
 p.F_..j.l::label`F
 set_a`F_
}

efp_:{
 n:(;0N;0n;;`)@4:*v:p.F_
 v:(?n,v)_dv`All
 if[~p.F[p.F..i]_in v;p.F[p.F..i]:*v]
 p.F..j.cell[p.F..i;`o]:v
 if[~p.S[p.F..i]=`All;if[~p.S[p.F..i]_in v;p.S[p.F..i]:`All]]
 p.S..j.cell[p.F..i;`o]:?`All,v
 if[|/b:~E[p.F..i]_lin v;E[p.F..i;i:&b]:n;V..j.cl[E[`fn;i]]:field_l'E[`fn;i]]
 set_a`F
}

rfp:{
 if[`Yes~.j.yesno`"Are you certain that you want to remove ",$label`F
  p.F..j.s::_n
  p.F..j.a::p.F..j.a _dv p.F..i
  p.F::p.F _di p.F..i
  p.F..j.rl::p.F..j.rl _di p.F..i
  p.F..j.cell::p.F..j.cell _di p.F..i
  p.S..j.s::_n
  p.S..j.a::p.S..j.a _dv p.F..i
  p.S::p.S _di p.F..i
  p.S..j.rl::p.S..j.rl _di p.F..i
  p.S..j.cell::p.S..j.cell _di p.F..i
  E::E _di p.F..i
  V..j.cl[]:field_l'E`fn]
}

set_a:{p..j.a[0;"F"=*$x]:x}

gen_time:{time.gen[p.T`tt]. p.T`fr`ip`pi`np}

time.gen.Biological:{[f;i;j;p]i+j*!p}
time.gen.Policy:{[f;i;j;p]i+j*!p}
time.gen.Calendar:{[f;i;j;p]:[f=`A;i+!p;100 _sv(a[0]++\1=t;1+t:(-1+(*|a:0 100 _vs i)+!p)!2 4 12`S`Q`M?f)]}
time.gen.Event:{[f;i;j;p]i+j*!p}

fmt_time:{({time.fmt[p.T`tt][x;y;z]}. p.T`fr`ip`np)x}

time.fmt.Biological:{[f;i;p;x]-10$x}
time.fmt.Policy:{[f;i;p;x]-10$x}
time.fmt.Calendar:{[f;i;p;x]-10$:[~@x;_f[f;i;p]'x;`A=f;$x;{($x),($f),$y}. 0 100 _vs x]}
time.fmt.Event:{[f;i;p;x]-10$"+",$x}

cnv_time:{({time.cnv[p.T`tt][x;y;z]}. p.T`fr`ip`np)x}

time.cnv.Biological:{[f;i;p;x]0$x}
time.cnv.Policy:{[f;i;p;x]0$x}
time.cnv.Calendar:{[f;i;p;x]:[`A=f;0$x;100 _sv 0$(i#x;(1+i:x?*$f)_ x)]}
time.cnv.Event:{[f;i;p;x]0$x _dv"+"}

time_type:{[b]
 t:p.T`tt
 f:p.T`fr
 j:p.T`pi
 if[b;p.T[`ip]::[t=`Biological;0;t=`Policy;1;t=`Event;1;t=`Calendar;200401 2004 f=`A]]
 V[`Time]:gen_time[]
}

p.F_:p.T_:()
p.F_..j.c:p.T_..j.c:`Vector
p.T_..j.popup[`OK]:etp_
p.T_..j.popup[`Cancel]:{set_a`T}
p.F_..j.popup[`OK]:efp_
p.F_..j.popup[`Cancel]:{set_a`F}

p.T__.q[`nm`pt`cb]:(`;`Integer;1)
p.T__.q..j.c:`slot
p.T__.q..j.rl[`nm`pt`cb]:`Name`Type`Combination
p.T__.q..j.border:0
p.T__.q..j.cell[`pt]:.+(`c`o;(`combo;`Integer`Float`Symbol))
p.T__.q..j.cell[`cb]:.,`c`check
p.T__.q..j.editor:1
p.T__.OK:atp_
p.T__.Cancel:{set_a`T}
p.T__[~`OK`Cancel;`j;`fill]:`h
p.T__..j.c:`panel
p.T__..j.l:`"Add Table Property"
p.T__..j.a:(`q;`OK`Cancel)

p.F__:p.T__
p.F__.:p.T__.
p.F__..j.l:`"Add Field Property"
p.F__.OK:afp_
p.F__.Cancel:{set_a`F}

/ table window

p.T.tt:`Biological
p.T.fr:`A
p.T.ip:0
p.T.np:1
p.T.pi:1
p.T.nf:1
p.T.ty:`
p.T.dt:`
p.T.at:`

p.T..j.a:`tt`fr`ip`np`pi`nf`ty`at`dt
p.T..j.bg[`tt`fr`ip`np`pi`nf]:LG
p.T..j.f.ip:fmt_time
p.T..j.g.ip:cnv_time
p.T..j.popup.Add_Table_Property:atp
p.T..j.popup.Edit_Table_Property:etp
p.T..j.popup.Remove_Table_Property:rtp
p.T..j.popup..j.ne:(+,!p.T..j.popup;1 1 1)
p.T..j.popup..j.async:2

p.T..j.krd:{
 p.T..i::*.j.i
 p.T..j.popup..j.ne[1;2]:~.j.i[0]_in`tt`fr`ip`np`pi`nf
 p.T..j.popup..j.ne[1;1]:.j.i[0]_in!p.T..j.cell
}

p.T..j.t:{
 i:*.j.i
 :[`nf=i		;n_fields[]
   `np=i		;n_periods[]
   i _in`tt`fr		;time_type 1
   i _in`ip`np`pi	;time_type 0]
}

p.T..j.rl.ty:`Accounting_Type
p.T..j.rl.tt:`Time_Type
p.T..j.rl.fr:`Frequency
p.T..j.rl.dt:`Decrement_Type
p.T..j.rl.at:`Age_Treatment
p.T..j.rl.ip:`Initial_Period
p.T..j.rl.np:`Number_of_Periods
p.T..j.rl.pi:`Period_Increment
p.T..j.rl.nf:`Number_of_Fields

cell:{.+(`c`o;(`combo;x))}

p.T..j.cell.tt:cell`Biological`Policy`Calendar`Event
p.T..j.cell.fr:cell`A`S`Q`M
p.T..j.cell.at:cell``A
p.T..j.cell.ty:cell``Stock`Flow`Rate
p.T..j.cell.dt:cell``Non_Decrement`Mortality`Lapse`Surrender`Maturity`Morbidity`Recovery`Mortality_Improvement

p.T..j.c:`slot
p.T..j.editor:1
p.T..j.l:`"Table Properties"

/ property table

E.fn:`$"f",'$!p.T.nf
E.ge:p.T.nf#`
E.rc:p.T.nf#`
E.ia:p.T.nf#0N

/ property window

set_field:{
 E[;E[`fn]?Field]:p.F[!E]
 V..j.cl[Field]:field_l Field
 select[]
}

p.F..j.rl[`ge`rc`ia]:`Gender`Risk_Class`Issue_Age
p.F..j.c:`slot
p.F..j.cell[`ge`rc]:cell'(``M`F`A;``Smoker`Non_Smoker`Rated`Aggregate)
p.F..j.editor:1
p.F..j.a:!p.F..j.rl
p.F..j.l:`"Field Properties"
p.F..j.t:set_field
p.F..j.popup.Add_Field_Property:afp
p.F..j.popup.Edit_Field_Property:efp
p.F..j.popup.Remove_Field_Property:rfp
p.F..j.popup..j.ne:(+,!p.F..j.popup;1 1 1)
p.F..j.popup..j.async:2

p.F..j.krd:{
 p.F..i::*.j.i
 p.F..j.popup..j.ne[1;1]:.j.i[0]_in!p.F..j.cell
}

select:{
 if[~#i:(!p.S)@&~`All~'p.S[];if[~Fields~s:E`fn;V..j.a::`Time,Fields::s];:_n]
 if[~#f:E[`fn]@&&/E[i]=p.S i;:.j.ok.w"No fields with this set of properties - no action"]
 if[~Field _in f;field f 0]
 V..j.a::`Time,Fields::f
}

cell2:{.+(`c`o;(`combo;`All,:[_n~o:p.F..j.cell[x;`o];?E x;o]))}

p.S[!E]:`All
p.S..j.rl:p.F..j.rl
p.S..j.c:`slot
p.S..j.cell[!E]:cell2'!E
p.S..j.editor:1
p.S..j.a:p.F..j.a
p.S..j.l:`"Field Selection"
p.S..j.t:select

p.C:""
p.C..j.c:`string
p.C..j.l:`"Comment"
p.C..j.wy:0.

p..j.c:`panel
p..j.a:(`T`F`S;`C)
p..j.border:0

field:{[i]
 if[~`Time=i
  p.F[!E]:E[!E;E[`fn]?Field::i]
  g:f(f:!V..j.clbg)?Field
  V..j.clbg[]:BG;V..j.clbg[g]:.j.True
  V..j.bg[Fields]:`w;V..j.bg[g]:`y]
}

field_l:{[i]
 j:E[`fn]?i;f:(!p.F)_dv`fn
 k:f@&~E[f;j]_lin(0N;0n;`)
 l:1_,/"\n",'_ssr[;"_";" "]'({$:[_n~r:p.F..j.rl x;x;r]}'k){x,"=",y}'$E[k;j]
 :[#l;l;"<Empty>"]}

insert_field:{
 a:V..j.a
 append_field
 b:*|V..j.a
 i:1+a?Field
 a:(i#a),b,i _ a
 V..j.a::a
}

append_field:{
 p.T[`nf]+:1
 n_fields[]
}

delete_field:{
 if[2=#f:`Time,E`fn;:.j.e"Number of periods must be >= 0"]
 V..j.s::_n
 i:E[`fn]?Field
 E::@[E;_n;_di[;i]]
 V..j.a::V..j.a _dv Field
 V..j.clbg::V..j.clbg _dv Field
 V..j.bg::V..j.bg _dv Field
 V::V _di Field
 Fields::Fields _dv Field
 field E[`fn;i&-1+#E`fn]
}

Fields:E`fn

v_time:{
 p.T[`np]:#V`Time
 V[`Time]:gen_time[]
}

n_periods:{
 if[0>n:p.T`np;:.j.e"Number of periods must be >= 0"]
 if[1>n:p.T`pi;:.j.e"Period increment must be > 0"]
 V..j.s::_n
 m:#V`Time
 :[n<m	;V::@[V;_n;@[;!n]]
   n>m	;V::@[V;_n;{x,(n-m)#y};{(;0N;0n)@4:*x}'V[]]]
 if[n-m;V[`Time]:gen_time[]]
}

n_fields:{
 if[1>n:p.T`nf;:.j.e"Number of fields must be >= 1"]
 V..j.s::_n
 m:#E`fn
 if[n<m
  E::@[E;_n;@[;!n]]
  f:`Time,E`fn
  g:(!V)_dvl f
  V..j.a::V..j.a _dvl g
  V..j.bg::V..j.bg _dvl g
  V..j.clbg::V..j.clbg _dvl g
  V::.+(f;V f)
  Fields::Fields _dvl g
  if[Field _in g;field f 1]]
 if[n>m
  f:E`fn
  k:|/0$1_'$f
  g:`$"f",'$1+k+!d:n-m
  E[`fn],:g
  h:(!E)_dv`fn
  E::@[E;h;{x,d#y};{(;0N;0n;;`)@4:*x}'E h]
  V::@[V;g;:[;p.T[`np]#0N]]
  V..j.cl[g]:field_l'g
  V..j.clbg[g]:BG
  V..j.bg[g]:`w
  select[]]
}

V.Time:!p.T.np
V:@[V;Fields;:[;p.T.np#0n]]
V..j.e.Time:0
V..j.bg.Time:BG
V..j.clbg.Time:BG
V..j.b.Time:`B
V..j.f.Time:fmt_time
V..j.c:`Table
V..j.l:`Table
V..j.fixed:1			// redraw bug
V..j.cl[Fields]:field_l'Fields
V..j.clbg[Fields]:BG
V..j.bg[Fields]:`w
V..j.clk:{field .j.i 0}
V..j.popup[`Insert`Append`Delete]:{{y;x[];v_time[]}[x]}'(.j.Ins.row;.j.App.row;.j.Del.row)
V..j.popup[`Insert_Field`Append_Field`Delete_Field]:(insert_field;append_field;delete_field)
V..j.a:`Time,Fields

field`f0

\d ^

T..j.c:`split
T..j.dir:`v
T..j.div:270
T..j.a:`p`V
T..j.l:`"Table Editor"
T..j.xy:820 800
.j.c`T






