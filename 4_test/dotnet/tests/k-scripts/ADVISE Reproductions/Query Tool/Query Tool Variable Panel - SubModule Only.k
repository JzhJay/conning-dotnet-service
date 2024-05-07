vars.F:{vars.f[*|.j.v;x]}
vars.f:{:[~@y;_f[x]'y;.l.sv[x;y]]}

variableWindow: (.((`Simulation
    ,`Definition1
    .,(`j
       .((`l;"Simulation";)
         (`s;!0;)
         (`e;0;)
         (`bg
          ,`scrollbarblue
          )
         (`fg
          ,0
          )
         (`font
          ,`"Dialog 0 14"
          )
         (`v;0;)
         (`pack;1;)
         (`kk;{
 w:~*|var[]                                     / or-tab in which the event occurred
 v:((!m.t.v[w;`A])@&m.t.v[w;`A;.;`j;`v])_dv*|.j.v      / other visible variables
 v@:&0<#:'m.t.v[w;`A;~v;`j;`s]                  / with non-empty selection vectors
 .u.log"vars.A.kk ",($w)," [emptying selections]: ",2_,/", ",/:$v
 m.t.v[w;`A;~v;`j;`s]:(#v)#,!0                  / zero their selections
 vars.A.c[w;::]                                 / compute effects
};)
         (`f;{vars.f[*|.j.v;x]};)
         (`popup
          .((`Only;{vars.A.c[*-3#var[];::]};)
            (`Except;{vars.A.c[*-3#var[];~:]};))
          .,(`j
             .((`h;20;)
               (`font;`"Courier 0 14";)
               (`lfont;`"Dialog 0 12";)
               (`nlfont;`"Helvetica 0 12";))
             ))
         (`h;20;)
         (`lfont;`"Dialog 0 12";))
       ))
   (`SubModule
    `Bonds `Common_Stock_Index `Foreign_Exchange `GDP `Inflation_Index `Unemployment `Universe
    .,(`j
       .((`l;"SubModule";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
          )
         (`v;1;)
         (`pack;1;)
         (`kk;{
 w:~*|var[]                                     / or-tab in which the event occurred
 v:((!m.t.v[w;`A])@&m.t.v[w;`A;.;`j;`v])_dv*|.j.v      / other visible variables
 v@:&0<#:'m.t.v[w;`A;~v;`j;`s]                  / with non-empty selection vectors
 .u.log"vars.A.kk ",($w)," [emptying selections]: ",2_,/", ",/:$v
 m.t.v[w;`A;~v;`j;`s]:(#v)#,!0                  / zero their selections
 vars.A.c[w;::]                                 / compute effects
};)
         (`f;{vars.f[*|.j.v;x]};)
         (`popup
          .((`Only;{vars.A.c[*-3#var[];::]};)
            (`Except;{vars.A.c[*-3#var[];~:]};))
          .,(`j
             .((`h;20;)
               (`font;`"Courier 0 14";)
               (`lfont;`"Dialog 0 12";)
               (`nlfont;`"Helvetica 0 12";))
             ))
         (`h;20;)
         (`lfont;`"Dialog 0 12";))
       )))
 .,(`j
    .((`l;"Module=GEMS, Simulation=Definition1";)
      (`c;`window;)
      (`a
       ,`SubModule `Other
       )
      (`h;20;)
      (`font;`"Courier 0 14";)
      (`lfont;`"Dialog 0 12";))
    ))

p: .()
p..j.c: `panel
p..j.l: "Query Tool / Vector Test"
p..j.xy: (700;600)
p..j.loc: (200;50)

p.A: variableWindow[0]
p.A.: variableWindow[1]

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
