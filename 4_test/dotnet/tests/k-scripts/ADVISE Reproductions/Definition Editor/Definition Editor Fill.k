serialized: (.,(`Derivatives
    .((`On
       .((`Equity_Option_Integration_Method
          `Combined
          .((`P;1;)
            (`j
             .((`l;`"Integration Method for Equity Derivatives";)
               (`c;`combo;)
               (`fill;`h;)
               (`o
                `Lee `Combined `MF
                )
               (`ol
                (`Lee `Combined `MF
                 `Lee `Combined `MF)
                ))
             )))
         (`Option_Pricing
          `DFA_Proprietary_Precise
          .((`P;1;)
            (`V;{[p;x]
  r:()
  if[x~`Black_Scholes_Approximation
    r,:,(0;"Black Scholes Approximation only applies to Bond Options") ]
  :[#r;r;_n]};)
            (`j
             .((`c;`combo;)
               (`fill;`h;) /(`wy;0.5;)
                (`o
                `DFA_Proprietary_Precise `Intrinsic_Value_Only `Black_Scholes_Approximation `Precise_Initialization_Time_Only
                )
               (`ol
                (`DFA_Proprietary_Precise `Intrinsic_Value_Only `Black_Scholes_Approximation `Precise_Initialization_Time_Only
                 `DFA_Proprietary_Precise `Intrinsic_Value_Only `Black_Scholes_Approximation `Precise_Initialization_Time_Only)
                ))
             )))
         (`Stochastic_Duration
          `Discrete
          .((`P;1;)
            (`j
             .((`c;`combo;)
               (`fill;`h;)
               (`o
                `Discrete `Continuous
                )
               (`popup
                .,(`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };)
                .())
               (`ol
                (`Discrete `Continuous
                 `Discrete `Continuous)
                ))
             )))
         (`Minimum_Price
          0.0001
          .((`j
             .((`l;`"Price Floor";)
               (`c;`Scalar;)
               (`fill;`h;)
               (`f;13.4;)
               (`u;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`g;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`krd;{
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
};))
             )
            (`P;1;)
            (`V;{[p;x]:[x<0;(1;"Must be a non-negative number")]};))))
       .((`P;1;)
         (`j
          .((`c;`panel;)
          	(`wy;1.0;))
          )))
      (`Off

       .((`P;1;)
         (`j
          .,(`c;`panel;)
          ))))
    .((`P;1;)
      (`j
       .,(`c;`panel;)
       )
      (`T;{[nn;x;y]x,(*|y),nn}[`CH];)
      (`B;`Financial_Markets;)
      (`C;`All_Derivatives;)))
 .((`j
    .((`c;`panel;)
      (`border;0;))
    )
   (`PP;`Derivatives;)
   (`II
    (0;`A;`System;`GEMS;`CH;`Derivatives)
    )))


panel: serialized[0]
panel.: serialized[1]
panel..j.close:{_exit 0}
panel..j.c:`window

panel..j.xy:(1200;900)
.j.Java {
  .j.c `panel
}

 p..j.z: {
 if[1~.k[`panel]; _exit 0]
 }