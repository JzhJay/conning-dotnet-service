/ virtual table gadget

\l common/java/j

t..j.l:`footable
t..j.cl.f:`f_field
t..j.clbg.f:`b
t.f:10#0 1
t.g:10.*!10
t..j.bg:{`r`g 5>`..j.v,.j.i}
t..j.f:{:[~@x;_f'x;1=4:x;$x;5.1$x]}
t..j.cell.f:.,`c`check
t..j.font.g:`"Helvetica 1 24"

.j.c`t

a.p..j.ax[`v0`v1`v2]:+`.k.t,'.u.atomicpaths[t;()]
a.p..j.a:(`v0`v1;`v2)
a.p:&#a.p..j.ax`v0
a.p..j.c:`pivot

a.p..j.f:{virtual_out[`value;::;::]}
a.p..j.cell:{virtual_out[`cell;{:[_n~x;x;. x]};::]}
a.p..j.align:{virtual_out[`align;::;,:]}
a.p..j.g:{virtual_in x}
a.p..j.bg:{virtual_atomic[`bg;{:[~_n~x;1000_sv 3#x]};,:]}
a.p..j.fg:{virtual_atomic[`fg;{:[~_n~x;1000_sv 3#x]};,:]}
a.p..j.e:{virtual_atomic[`e;{:[_n~x;1;x]};::]}
a.p..j.b:{virtual_atomic[`b;::;::]}
a.p..j.font:{virtual_atomic[`font;{:[~_n~x;`$1_,/" ",'$x]};,:]}

a..j.c:`panel

virtual_atomic:{[f;g;h]
 if[_n~.j.i;r:{.j.i:,z;virtual_atomic[x;y;::]}[f;g]'!#`..j.v,.j.i;.j.i:_n;:r]
 a:@[v;-1+#v:.j.v;~:]
 .[`;.j.SET:a,`j`SET;:;()]
 ax:`. a,`j`ax,_n,i:.j.i
 c:.j.cl ax[0]:.j.undot ax 0
 .j.of[c;f;(ax 0;1_ ax)]
 .j.v:v
 .j.i:i
 s:`..j.SET
 .j.SET:_n
 s:s[&`set=s[;0]]
 h g@*s[&f=s[;1;;0][;2];1;2;1]}

virtual_in:{
 a:@[v;-1+#v:.j.v;~:]
 ax:`. a,`j`ax,_n,i:.j.i
 c:.j.cl ax[0]:.j.undot ax 0
 .j.of[c;`set;(ax 0;1_ ax;x)]
 .j.v:v
 .j.i:i
 0}

virtual_out:{[f;g;h]
 if[_n~.j.i;r:{.j.i:,z;virtual_out[x;y;::]}[f;g]'!#`..j.v,.j.i;.j.i:_n;:r]
 a:@[v;-1+#v:.j.v;~:]
 .[`;.j.SET:a,`j`SET;:;()]
 ax:`. a,`j`ax,_n,i:.j.i
 c:.j.cl ax[0]:.j.undot ax 0
 .j.dat[ax 0;1_ ax]
 s:`..j.SET
 .j.SET:_n
 s:s[&`set=s[;0]]
 h g@*s[&f=s[;1;;0][;2];1;2;1]}

.j.c`a



