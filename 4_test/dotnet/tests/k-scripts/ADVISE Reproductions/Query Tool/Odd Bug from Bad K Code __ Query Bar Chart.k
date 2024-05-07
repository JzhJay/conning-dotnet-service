asd:(.((`g
    (-1.315322 -2.070717 -2.371454 -2.812098 -2.62854 -2.211327
     -1.168267 -2.116212 -2.741818 -2.920422 -2.989426 -2.269639
     -1.155128 -1.655135 -2.19379 -3.005833 -3.400198 -2.692869
     -7.232252 -1.106365 -1.908839 -2.328272 -2.591044 -1.962188
     -1.111033 -1.953229 -2.893293 -3.225918 -3.540862 -2.712588
     -9.46165 -1.616244 -1.976925 -2.398186 -2.653359 -2.076271
     -1.070026 -1.598529 -2.239954 -2.716539 -2.992013 -2.343451
     -1.002391 -2.067116 -2.499643 -3.401347 -3.168588 -2.704829
     -1.092156 -2.070304 -2.401393 -2.787907 -2.993594 -2.561984
     -1.045332 -1.651377 -2.482717 -2.537277 -2.404435 -2.080428
     -1.336321 -1.728366 -2.145268 -2.704848 -2.972949 -2.43287
     -1.344284 -2.129851 -2.802157 -3.225598 -3.176614 -2.569533)
    .,(`j
       .((`c;`gbar;)
         (`border;0;)
         (`rownames
          `"2012" `"2013" `"2014" `"2015" `"2016" `"2017"
          )
         (`colnames
          `"0" `"1" `"2" `"3" `"4" `"5" `"6" `"7" `"8" `"9" `"10" `"11"
          )
         (`pi
          .,(`obsspacing;80;)
          )
         (`title;"Module=User_Values, Projection=Base, User_Value=AllLiabPV,\n Item=Result, Grouping=None, Simulation=EFA_Liability_Data";)
         (`axis
          .,(`label
             ((`x;"Time")
              (`y;" "))
             )
          )
         (`fi
          .((`titlefont;`"Helvetica 1 20";)
            (`subtitlefont;`"Helvetica 0 12";)
            (`footnotefont;`"Helvetica 1 10";)
            (`legendfont;`"Helvetica 0 12";))
          )
         (`afi
          .((`axislabelfont
             (`x `"Helvetica 1 12"
              `y `"Helvetica 1 12")
             )
            (`ticklabelfont
             (`x `"Helvetica 0 12"
              `y `"Helvetica 0 12")
             ))
          )
         (`api
          .,(`ticklabelrotation
             ((`x;30)
              (`y;0))
             )
          )
         (`ibi
          .,(`legend
             .,(`iboi
                .((`drawbackground;0;)
                  (`drawborder;1;)
                  (`threedimout;0;)
                  (`threedim;0;))
                )
             )
          )
         (`aibi
          .,(`axislabel
             .,(`ibpi
                .,(`textmargin
                   ((`x;10)
                    (`y;30))
                   )
                )
             )
          )
         (`oi
          .,(`horizontal;1;)
          ))
       ))
   (`toolbar
    .((`Bar_Chart_Stacked
       0
       .,(`j
          .((`group;`a;)
            (`image;"Bar_Chart_Stacked.png";)
            (`help;"Bar Chart Stacked";)
            (`c;`togglebutton;)
            (`l;`;)
            (`t;{
    v:`. .j.v
    g:dot (3#.j.v),~`g
    b:*|.j.v
    if[b~PC 0;.[~g;();:;(100*ss%\:+/ss:{@[x;&x=0n;:;0.]}'save;save)v=0];:_n]
    if[v=0;:_n]
    :[b~SA 0;.[g;(`j`oi`stacked);:;1]
      b~SA 1;.[g;(`j`oi`stacked);:;0]
      b~HV 0;.[g;(`j`oi`horizontal);:;0]
      b~HV 1;.[g;(`j`oi`horizontal);:;1]
      b~TT 0;.[g;(`j`oi`threedim);:;0]
      b~TT 1;.[g;(`j`oi`threedim);:;1]
     ]
  };))
          ))
      (`Bar_Chart_Adjacent
       1
       .,(`j
          .((`group;`a;)
            (`image;"Bar_Chart_Adjacent.png";)
            (`help;"Bar Chart Adjacent";)
            (`c;`togglebutton;)
            (`l;`;)
            (`t;{
    v:`. .j.v
    g:dot (3#.j.v),~`g
    b:*|.j.v
    if[b~PC 0;.[~g;();:;(100*ss%\:+/ss:{@[x;&x=0n;:;0.]}'save;save)v=0];:_n]
    if[v=0;:_n]
    :[b~SA 0;.[g;(`j`oi`stacked);:;1]
      b~SA 1;.[g;(`j`oi`stacked);:;0]
      b~HV 0;.[g;(`j`oi`horizontal);:;0]
      b~HV 1;.[g;(`j`oi`horizontal);:;1]
      b~TT 0;.[g;(`j`oi`threedim);:;0]
      b~TT 1;.[g;(`j`oi`threedim);:;1]
     ]
  };))
          ))
      (`Bar_Chart_Horizontal
       0
       .,(`j
          .((`group;`b;)
            (`image;"Bar_Chart_Horizontal.png";)
            (`help;"Bar Chart Horizontal";)
            (`c;`togglebutton;)
            (`l;`;)
            (`t;{
    v:`. .j.v
    g:dot (3#.j.v),~`g
    b:*|.j.v
    if[b~PC 0;.[~g;();:;(100*ss%\:+/ss:{@[x;&x=0n;:;0.]}'save;save)v=0];:_n]
    if[v=0;:_n]
    :[b~SA 0;.[g;(`j`oi`stacked);:;1]
      b~SA 1;.[g;(`j`oi`stacked);:;0]
      b~HV 0;.[g;(`j`oi`horizontal);:;0]
      b~HV 1;.[g;(`j`oi`horizontal);:;1]
      b~TT 0;.[g;(`j`oi`threedim);:;0]
      b~TT 1;.[g;(`j`oi`threedim);:;1]
     ]
  };))
          ))
      (`Bar_Chart_Vertical
       1
       .,(`j
          .((`group;`b;)
            (`image;"Bar_Chart_Vertical.png";)
            (`help;"Bar Chart Vertical";)
            (`c;`togglebutton;)
            (`l;`;)
            (`t;{
    v:`. .j.v
    g:dot (3#.j.v),~`g
    b:*|.j.v
    if[b~PC 0;.[~g;();:;(100*ss%\:+/ss:{@[x;&x=0n;:;0.]}'save;save)v=0];:_n]
    if[v=0;:_n]
    :[b~SA 0;.[g;(`j`oi`stacked);:;1]
      b~SA 1;.[g;(`j`oi`stacked);:;0]
      b~HV 0;.[g;(`j`oi`horizontal);:;0]
      b~HV 1;.[g;(`j`oi`horizontal);:;1]
      b~TT 0;.[g;(`j`oi`threedim);:;0]
      b~TT 1;.[g;(`j`oi`threedim);:;1]
     ]
  };))
          ))
      (`Bar_Chart_2D
       1
       .,(`j
          .((`group;`c;)
            (`image;"Bar_Chart_2D.png";)
            (`help;"Bar Chart 2D";)
            (`c;`togglebutton;)
            (`l;`;)
            (`t;{
    v:`. .j.v
    g:dot (3#.j.v),~`g
    b:*|.j.v
    if[b~PC 0;.[~g;();:;(100*ss%\:+/ss:{@[x;&x=0n;:;0.]}'save;save)v=0];:_n]
    if[v=0;:_n]
    :[b~SA 0;.[g;(`j`oi`stacked);:;1]
      b~SA 1;.[g;(`j`oi`stacked);:;0]
      b~HV 0;.[g;(`j`oi`horizontal);:;0]
      b~HV 1;.[g;(`j`oi`horizontal);:;1]
      b~TT 0;.[g;(`j`oi`threedim);:;0]
      b~TT 1;.[g;(`j`oi`threedim);:;1]
     ]
  };))
          ))
      (`Bar_Chart_3D
       0
       .,(`j
          .((`group;`c;)
            (`image;"Bar_Chart_3D.png";)
            (`help;"Bar Chart 3D";)
            (`c;`togglebutton;)
            (`l;`;)
            (`t;{
    v:`. .j.v
    g:dot (3#.j.v),~`g
    b:*|.j.v
    if[b~PC 0;.[~g;();:;(100*ss%\:+/ss:{@[x;&x=0n;:;0.]}'save;save)v=0];:_n]
    if[v=0;:_n]
    :[b~SA 0;.[g;(`j`oi`stacked);:;1]
      b~SA 1;.[g;(`j`oi`stacked);:;0]
      b~HV 0;.[g;(`j`oi`horizontal);:;0]
      b~HV 1;.[g;(`j`oi`horizontal);:;1]
      b~TT 0;.[g;(`j`oi`threedim);:;0]
      b~TT 1;.[g;(`j`oi`threedim);:;1]
     ]
  };))
          ))
      (`Percent
       0
       .,(`j
          .((`image;"Percent.png";)
            (`help;"Percent";)
            (`c;`togglebutton;)
            (`l;`;)
            (`t;{
    v:`. .j.v
    g:dot (3#.j.v),~`g
    b:*|.j.v
    if[b~PC 0;.[~g;();:;(100*ss%\:+/ss:{@[x;&x=0n;:;0.]}'save;save)v=0];:_n]
    if[v=0;:_n]
    :[b~SA 0;.[g;(`j`oi`stacked);:;1]
      b~SA 1;.[g;(`j`oi`stacked);:;0]
      b~HV 0;.[g;(`j`oi`horizontal);:;0]
      b~HV 1;.[g;(`j`oi`horizontal);:;1]
      b~TT 0;.[g;(`j`oi`threedim);:;0]
      b~TT 1;.[g;(`j`oi`threedim);:;1]
     ]
  };))
          )))
    .,(`j
       .((`a
          `Bar_Chart_Stacked `Bar_Chart_Adjacent ` `Bar_Chart_Horizontal `Bar_Chart_Vertical ` `Bar_Chart_2D `Bar_Chart_3D ` `Percent
          )
         (`border;0;)
         (`l;`;))
       )))
 .,(`j
    .((`c;`panel;)
      (`border;0;)
      (`v;1;)
      (`wy;1.0;))
    ))

p:asd[0]
p.:asd[1]

  SA:`Bar_Chart_Stacked`Bar_Chart_Adjacent
  HV:`Bar_Chart_Horizontal`Bar_Chart_Vertical
  TT:`Bar_Chart_2D`Bar_Chart_3D
  PC:,`Percent
  data::p.g
  save::data
  p..j.l:"Odd Bug from bad K Code -- Click the Horizontal Bar Chart Button"
  /rn:{`$,/$-1_,/x,'`"\n"}'d 1
  /cn:{`$,/$-1_,/x,'`","}'+d 2

JUSTCHANGED::0

  p[`toolbar;~:'!p[`toolbar];`j;`t]:{
  DOIT::1
  if[JUSTCHANGED=1; DOIT::0; JUSTCHANGED::0]
  if[(JUSTCHANGED=0)&DOIT=1
    JUSTCHANGED::1
    v:`. .j.v
    g:`. (2#.j.v),~`g
    b:*|.j.v
    if[b~PC 0;.k[`p;`g]:.[~g;();:;(100*ss%\:+/ss:{@[x;&x=0n;:;0.]}'save;save)v=0];:_n]
    /if[v=0;:_n]
    .k[`p;`g.]::[b~SA 0;.[g;(`j`oi`stacked);:;1]
      b~SA 1;.[g;(`j`oi`stacked);:;0]
      b~HV 0;.[g;(`j`oi`horizontal);:;0]
      b~HV 1;.[g;(`j`oi`horizontal);:;1]
      b~TT 0;.[g;(`j`oi`threedim);:;0]
      b~TT 1;.[g;(`j`oi`threedim);:;1]
     ]
   ]
  }
/

.j.Java{
  .j.c `p
}

p..j.close:{_exit 0}
p..j.z: {
  if[1~.k[`autoExit];_exit 0]
  }

