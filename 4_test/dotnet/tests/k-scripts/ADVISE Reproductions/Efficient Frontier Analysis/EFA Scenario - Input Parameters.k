content: (
  (`r
   (0
    ,`haw7d0021.internal.cnngad.com)
   )
  (`nodes
   ` `haw7d0021.internal.cnngad.com
   )
  (`Simulation_Location
   .((`Yield_Curves
      `"C:\\Users\\s2shno\\Documents"
      .((`j
         .((`c;`scalar;)
           (`fill;`h;)
           (`wx;1.0;)
           (`wy;.j.NoExtraSpace;)
           (`t;{.k.update_from_simulation[` . .j.v;`Yield_Curves]};))
         )
        (`V;{:[#r:V.valid_folder x;								r
                      ~"dfs"~-3#$x;									,(1;"Folder is not a valid DFA simulation folder")
                      ~|/.w.hostmatch[.f.getHost x]'1_ .k[`Main;`Input;`Input_Parameters;`nodes];	,(1;"Folder is not located on a grid node")
                      ()]};)))
     (`Browse
      {[w;x]
    .k[`Main;`Toolbar;`Generate.;`j;`e]: 0 /disable generate button, required for test automation
    .j.stop[]
    .[`.k;(`Main;`Input;`Input_Parameters;`Simulation_Location;w);:;sim:`$.f.getNetPath .j.Open@`$".k.",$w];
    .k.update_from_simulation[sim;w]
    .j.go[]
    .k[`Main;`Toolbar;`Generate.;`j;`e]: 1 /required for test automation
    }[`Yield_Curves]
      .,(`j
         .((`c;`button;)
           (`async;2;)
           (`l;`"<html>Browse</html>";)
           (`hpos;`r;)
           (`vpos;`c;)
           (`anchor;`c;)
           (`image;"Open_32.png";)
           (`wx;.j.NoExtraSpace;)
           (`wy;.j.NoExtraSpace;)
           (`halign;`l;))
         )))
   .,(`j
      .((`c;`panel;)
        (`wy;.j.NoExtraSpace;)
        (`a
         ,`Yield_Curves `Browse
         ))
      ))
  (`Horizon

   .((`j
      .((`c;`combo;)
        (`o
         ,`"Unspecified ..."
         )
        (`wy;.j.NoExtraSpace;)
        (`ol
         (,`"Unspecified ..."
          ,`"Unspecified ...")
         ))
      )
     (`V;{:[x=`"Unspecified ...";(1;"Horizon must be specified")]};)))
  (`Economy
   `US
   .((`j
      .((`c;`combo;)
        (`o
         `US `DE `GB `CH `AU `CA `JP `DK `NO `SE `BR `PL `KR `TW `HK `CN
         )
        (`wy;.j.NoExtraSpace;)
        (`ol
         (`US `DE `GB `CH `AU `CA `JP `DK `NO `SE `BR `PL `KR `TW `HK `CN
          `US `DE `GB `CH `AU `CA `JP `DK `NO `SE `BR `PL `KR `TW `HK `CN)
         ))
      )
     (`V;{:[x=`"Unspecified ...";(1;"Economy must be specified")]};)))
  (`Additive_Shift_to_the_Initial_Yield_Curve
   0.0
   .,(`j
      .((`c;`scalar;)
        (`wx;1.0;)
        (`halign;`l;)
        (`fill;`h;)
        (`f;10.4;))
      ))
  (`Extending_the_Initial_Forward_Curve
   `Constant_Yield_Beyond_Highest_Maturity
   .,(`j
      .((`c;`combo;)
        (`o
         `Constant_Yield_Beyond_Highest_Maturity `Constant_Forward_Rate_Beyond_Highest_Maturity
         )
        (`wx;1.0;)
        (`ol
         (`Constant_Yield_Beyond_Highest_Maturity `Constant_Forward_Rate_Beyond_Highest_Maturity
          `Constant_Yield_Beyond_Highest_Maturity `Constant_Forward_Rate_Beyond_Highest_Maturity)
         ))
      ))
  (`Type_of_Risk_Neutral_Adjustment
   `Factors_on_Semi_Annual_Yields
   .,(`j
      .((`c;`combo;)
        (`o
         `Factors_on_Semi_Annual_Yields `Factors_on_Zero_Coupon_Prices `None
         )
        (`wx;1.0;))
      ))
  (`Maturities_in_Years
   0.25 0.5 1 2 3 5 7 10 20 30
   .,(`j
      .((`c;`Vector;)
        (`wy;0.2;)
        (`wx;0.2;)
        (`f;10.4;)
        (`popup
         .((`Insert;{if[#s:of[c:name.c v;`Rows;,v:ad -2_.j.v];of[c;`ins`row;(v;*s;#s)];fire_f[`Insert;`t;v;()]]};)
           (`Append;{of[c;`app`row;(v;1|#of[c:name.c v;`Rows;,v:ad -2_.j.v])];fire_f[`Append;`t;v;()];};)
           (`Delete;{if[#s:of[c:name.c v;`Rows;,v:ad -2_.j.v];of[c;`del`row;(v;s)];fire_f[`Delete;`t;v;()]]};)
           (`s;" ";)
           (`Cut;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`cut;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
           (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
           (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
           (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
         .,(`j
            .,(`ne
               ((,`Insert
                 ,`Append
                 ,`Delete
                 ,`s
                 ,`Cut
                 ,`Copy
                 ,`Copy_All
                 ,`Paste)
                0 1 0 0 0 0 1 0)
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
};))
      ))
  (`Scenario_Selection
   .((`Type_of_Selection
      `Best_Random_Subsample
      .,(`j
         .((`c;`combo;)
           (`o
            `Best_Random_Subsample `Use_All_Scenarios `Random_Subsample `First_N
            )
           (`t;{val:` . .j.v
                                                         path_to_ja:(.k.attr@-1_ .j.v),`j`a
                                                         .k.set_Type_of_Selection_ja[val;path_to_ja]
                                                         };)
           (`ol
            (`Best_Random_Subsample `Use_All_Scenarios `Random_Subsample `First_N
             `Best_Random_Subsample `Use_All_Scenarios `Random_Subsample `First_N)
            ))
         ))
     (`Total_Number_of_Scenarios
      0
      .,(`j
         .((`c;`scalar;)
           (`halign;`l;)
           (`fill;`h;)
           (`f;10.0;)
           (`e;0;)
           (`bg;`n;))
         ))
     (`Number_of_Scenarios_to_Select
      50
      .,(`j
         .((`c;`scalar;)
           (`halign;`l;)
           (`fill;`h;)
           (`f;10.0;))
         ))
     (`Number_of_Subsamples
      10000
      .,(`j
         .((`c;`scalar;)
           (`halign;`l;)
           (`fill;`h;)
           (`f;10.0;))
         ))
     (`filler

      .,(`j
         .((`c;`panel;)
           (`l;`;)
           (`border;0;)
           (`wy;1.0;))
         )))
   .,(`j
      .((`c;`panel;)
        (`wy;.j.NoExtraSpace;)
        (`wx;0.5;)
        (`a
         `Type_of_Selection `Total_Number_of_Scenarios `Number_of_Scenarios_to_Select `Number_of_Subsamples `filler
         ))
      ))
  (`filler

   .,(`j
      .((`c;`panel;)
        (`l;`;)
        (`border;0;)
        (`wy;1.0;))
      )))

content:1_ content

dotstuff:.,(`j
    .((`c;`panel;)
      (`a
       (`Simulation_Location
        `Horizon `Maturities_in_Years `Scenario_Selection
        `Economy `Maturities_in_Years `Scenario_Selection
        `Extending_the_Initial_Forward_Curve `Maturities_in_Years `Scenario_Selection
        `Additive_Shift_to_the_Initial_Yield_Curve `Maturities_in_Years `Scenario_Selection
        `filler `Maturities_in_Years `Scenario_Selection)
       ))
    )

/p: content[0]
/p.: content[1]

asd:.()
adddot:{`$($x),"."}
p:{x[!y]:y[!y];x[adddot'[!y]]:y[adddot'[!y]]; x}/[asd;{r:.(); r[x[0]]:x[1]; r[`$($x[0]),"."]:x[2]; r}'[content]]
p.:dotstuff
p..j.c:`panel
p..j.l: "EFA Scenario Generator"


.j.Java{
  .j.c `p
}


p..j.close:{_exit 0}
p..j.z: {
  if[1~.k[`autoExit];_exit 0]
  }

