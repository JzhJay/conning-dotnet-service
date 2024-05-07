maketabcolfn:{[numfcolsign;valsmatch;colorign;colorifm;colorelse]
  igncolfn:{[x;y](#x)#y}[;colorign]
  /docolfn:{[x;y;z;w]`0;{[x;y;z;w]:[|/x~/::[1~4:y;,y;y];z;w]}[;y;z;w]'x}[;valsmatch;colorifm;colorelse]
  docolfn:{[x;y;z;w]@[t;&0=t:z*|/x~\:/:y;:;w]}[;valsmatch;colorifm;colorelse]
  {if[(^x)~!0;:colorelse];@[@[x;td;igncolfn];(tb) _di td:numfcolsign#tb:!#x;docolfn]}}

tabfgfnmatch0retgreyowblack:maketabcolfn[;,0.;0;125125125;0]

asd:(.((`Run
    0N 0N 0N 0N 0N
    )
   (`Lambda
    1000 1001 1002 1003 1004.0
    )
   (`Iterations
    0 0 0 0 0
    )
   (`Status
    `"Initial Random Allocations" `"Initial Random Allocations" `"Initial Random Allocations" `"Initial Random Allocations" `"Initial Random Allocations"
    )
   (`Objective
    0i 0i 0i 0i 0i
    )
   (`Risk
    0n 0n 0n 0n 0n
    )
   (`Reward
    0n 0n 0n 0n 0n
    )
   (`a0
    0n 0n 0n 0n 0n
    )
   (`a1
    0n 0n 0n 0n 0n
    )
   (`a2
    0n 0n 0n 0n 0n
    )
   (`a3
    0n 0n 0n 0n 0n
    )
   (`a4
    0n 0n 0n 0n 0n
    )
   (`a5
    0n 0n 0n 0n 0n
    )
   (`a6
    0n 0n 0n 0n 0n
    )
   (`a7
    0n 0n 0n 0n 0n
    )
   (`a8
    0n 0n 0n 0n 0n
    )
   (`a9
    0n 0n 0n 0n 0n
    )
   (`a10
    0n 0n 0n 0n 0n
    )
   (`a11
    0n 0n 0n 0n 0n
    ))
 .,(`j
    .((`cl
       .((`a0;`"Government 00 01";)
         (`a1;`"Government 01 03";)
         (`a2;`"Government 03 05";)
         (`a3;`"Government 05 07";)
         (`a4;`"Government 07 10";)
         (`a5;`"Government 10 20";)
         (`a6;`"Government 20 up";)
         (`a7;`"Bonds Corp A 00 05";)
         (`a8;`"Bonds Corp A 05 10";)
         (`a9;`"Bonds Corp A 10 20";)
         (`a10;`"Bonds Corp A 20 up";)
         (`a11;`"US Stock";))
       )
      (`clbg
       .((`Objective;128128255;)
         (`Risk;128255128;)
         (`Reward;128255128;)
         (`a0;255128128;)
         (`a1;255128128;)
         (`a2;255128128;)
         (`a3;255128128;)
         (`a4;255128128;)
         (`a5;255128128;)
         (`a6;255128128;)
         (`a7;255128128;)
         (`a8;255128128;)
         (`a9;255128128;)
         (`a10;255128128;)
         (`a11;255128128;))
       )
      (`bg
       .((`Objective;200200255;)
         (`Risk;200255200;)
         (`Reward;200255200;)
         (`a0;255200200;)
         (`a1;255200200;)
         (`a2;255200200;)
         (`a3;255200200;)
         (`a4;255200200;)
         (`a5;255200200;)
         (`a6;255200200;)
         (`a7;255200200;)
         (`a8;255200200;)
         (`a9;255200200;)
         (`a10;255200200;)
         (`a11;255200200;))
       )
      (`c;`Table;)
      (`e;0;)
      (`f
       .((`Lambda;{7.4$ :[x>999.;0n;x]};)
         (`Iterations;6;)
         (`Status;-28;)
         (`Reward;15.0;)
         (`Risk;15.0;)
         (`Objective;15.0;)
         (`a0;7.4;)
         (`a1;7.4;)
         (`a2;7.4;)
         (`a3;7.4;)
         (`a4;7.4;)
         (`a5;7.4;)
         (`a6;7.4;)
         (`a7;7.4;)
         (`a8;7.4;)
         (`a9;7.4;)
         (`a10;7.4;)
         (`a11;7.4;))
       )
      (`wy;1e-010;)
      (`l;"Optimization Status Table";)
      (`a
       `Lambda `Iterations `Status `Risk `Reward `a0 `a1 `a2 `a3 `a4 `a5 `a6 `a7 `a8 `a9 `a10 `a11
       )
      (`p
       .((`Run;0N;)
         (`Lambda;0n;)
         (`Status;`Optimizing;)
         (`Iterations;0;)
         (`Risk;0n;)
         (`Reward;0n;)
         (`Objective;0i;)
         (`a0;0n;)
         (`a1;0n;)
         (`a2;0n;)
         (`a3;0n;)
         (`a4;0n;)
         (`a5;0n;)
         (`a6;0n;)
         (`a7;0n;)
         (`a8;0n;)
         (`a9;0n;)
         (`a10;0n;)
         (`a11;0n;))
       )
      (`popup
       .((`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
         (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];))
       .,(`j
          .,(`ne
             ((,`Copy
               ,`Copy_All)
              0 1)
             )
          ))
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
};)
      (`s;();.()))
    ))

p:asd[0]
p.:asd[1]

p..j..fg:tabfgfnmatch0retgreyowblack[5]

updlambda:{[x].[`;`k`p`Iterations,x;+;10]}
updlambdasx:{[x]updlambda'[,/x#,!5]}

updlambdastimer:{updlambdasx[1000]}
/ JOSP - 200 is chosen because Java is able to meet this amount before the 5 seconds are up...
/ ON MY MACHINE AT LEAST!
/ We can see Java finish updating and take a small breather before doing the next batch.
/ Kui on the other hand never takes a breather--except when it cheats by freezing the screen!
/ If Java is not taking a break with 200, this should be decreased...
/ perhaps on slower machines the difference between Java and Kui is less apparent? Or maybe it's worse...?
////
/ One issue concerning this with Kui is that when it freezes the screen, you can miss a LOT of stuff.
/ for example, with the EFA, the screen frequently freezes when this phase (the initial allocation phase) nears completion
/ and then when it unfreezes there is suddently a lot of data of which you have no idea where it came from
////
/ But the MAIN issue with Kui concerning this issue is that the user cannot interact with the EFA tool as well because it is takes so long to update the GUI
/ In this example, the Kui window is basically untouchable by the user because it never finishes its updates
/ Java can finish the updates, which allows the user to do things like change the tab
////

.u.setTimerEvent[5;`.k.updlambdastimer]

p..j.l:"EFA Monitor Iterations Updating"

p..j.xy: (500;500)
p..j.loc:(200;200)

.j.Java{
  .j.c `p
}

p..j.close:{_exit 0}
p..j.z: {
  if[1~.k[`autoExit];_exit 0]
  }