asd:(.((`filler

    .,(`j
       .((`c;`panel;)
         (`border;0;)
         (`fill;`n;)
         (`wy;0.03;))
       ))
   (`Input
    .((`Standard_Parameters
       .((`Simulation_Locations
          .((`Company_Balance_Sheet
             `"E:\\SIMS\\Life Case Study.dfs"
             .((`j
                .((`c;`scalar;)
                  (`fill;`h;)
                  (`wx;1.0;)
                  (`l;`"Entity Data";)
                  (`t;{.k.display_sim_loc_errors[_n;.k.update_from_simulation[` . .j.v;`Company_Balance_Sheet]]};)
                  (`e;0;))
                )
               (`V;{:[.k[`Main;`Input;`Standard_Parameters;`Target;`Scope]=`ALM;.L.V.valid_dfs_folder@x]};)))
            (`Asset_Class_Returns
             `"E:\\SIMS\\Life Case Study.dfs"
             .((`j
                .((`c;`scalar;)
                  (`fill;`h;)
                  (`wx;1.0;)
                  (`l;`"Return Data";)
                  (`t;{.k.display_sim_loc_errors[.k.update_from_simulation[` . .j.v;`Asset_Class_Returns];_n]};)
                  (`e;0;))
                )
               (`V;{
  :[#r:valid_file x;				r
    ~"dfs"~-3#$x;				,(1;"Folder is not a valid DFA simulation folder")
    ~|/.w.hostmatch[.f.getHost x]'1_ .C.nodes;	,(1;"Folder is not located on a grid node")
                      				()]};)))
            (`Simulation_Browse;{[w;x]
  sim:`$.f.getNetPath .j.Open@`$".k.",$w
  if[~sim~`
    .[`.k;(`Main;`Input;`Standard_Parameters;`Simulation_Locations;w);:;sim]
    errao::[w~`Asset_Class_Returns;.k.update_from_simulation[sim;w]; _n]
    erralm::[errao~_n; .k.update_from_simulation[sim;w]; _n]
    .k.display_sim_loc_errors[errao;erralm]
    ]
  };)
            (`Base_Browse
             {[w;x]
  sim:`$.f.getNetPath .j.Open@`$".k.",$w
  if[~sim~`
    .[`.k;(`Main;`Input;`Standard_Parameters;`Simulation_Locations;w);:;sim]
    errao::[w~`Asset_Class_Returns;.k.update_from_simulation[sim;w]; _n]
    erralm::[errao~_n; .k.update_from_simulation[sim;w]; _n]
    .k.display_sim_loc_errors[errao;erralm]
    ]
  }[`Company_Balance_Sheet]
             .,(`j
                .((`c;`button;)
                  (`async;2;)
                  (`l;`"<html>Browse</html>";)
                  (`hpos;`r;)
                  (`vpos;`c;)
                  (`anchor;`c;)
                  (`image;"Open_32.png";)
                  (`wx;0.01;)
                  (`halign;`l;)
                  (`e;0;))
                ))
            (`Asset_Browse
             {[w;x]
  sim:`$.f.getNetPath .j.Open@`$".k.",$w
  if[~sim~`
    .[`.k;(`Main;`Input;`Standard_Parameters;`Simulation_Locations;w);:;sim]
    errao::[w~`Asset_Class_Returns;.k.update_from_simulation[sim;w]; _n]
    erralm::[errao~_n; .k.update_from_simulation[sim;w]; _n]
    .k.display_sim_loc_errors[errao;erralm]
    ]
  }[`Asset_Class_Returns]
             .,(`j
                .((`c;`button;)
                  (`async;2;)
                  (`l;`"<html>Browse</html>";)
                  (`hpos;`r;)
                  (`vpos;`c;)
                  (`anchor;`c;)
                  (`image;"Open_32.png";)
                  (`wx;0.01;)
                  (`halign;`l;)
                  (`e;0;))
                )))
          .,(`j
             .((`c;`panel;)
               (`a
                (`Asset_Class_Returns `Asset_Browse
                 `Company_Balance_Sheet `Base_Browse)
                )
               (`wy;0.01;))
             ))
         (`Target
          .((`Scope;`Statutory_PVDE_ALM;)
            (`Horizon;`"3 Years";)
            (`Entity;`LifeEnt;)
            (`Outcome;`Ending_Surp;)
            (`Tolerance;`None;)
            (`Buy_Sequence;`By_Asset_Class;)
            (`Sell_Sequence;`By_Asset_Class;)
            (`Return_Currency;`USD;)
            (`Reward_Measure;`avg;)
            (`Risk_Measure;`"80.000-";)
            (`Area;`Under;)
            (`Threshold;`Fixed;)
            (`Percentile;0.2;)
            (`Fixed;0;))
          .((`j
             .((`c;`Slot;)
               (`editor;1;)
               (`wx;0.15;)
               (`wy;0.3;)
               (`a
                `Scope `Horizon `Entity `Tolerance `Reward_Measure `Risk_Measure
                )
               (`t;{.k.reset_GUI_scope . (.j.v;.j.i)};)
               (`cell
                .((`Scope
                   .((`c;`combo;)
                     (`o
                      `Asset_Only `ALM `Statutory_PVDE_ALM
                      )
                     (`ol
                      (`Asset_Only `ALM `Statutory_PVDE_ALM
                       `"Asset Based" `"Economic Value ALM" `"PVDE ALM")
                      ))
                   )
                  (`Horizon
                   .((`c;`combo;)
                     (`o
                      `"31 Years" `"30 Years" `"29 Years" `"28 Years" `"27 Years" `"26 Years" `"25 Years" `"24 Years" `"23 Years" `"22 Years" `"21 Years" `"20 Years" `"19 Years" `"18 Years" `"17 Years" `"16 Years" `"15 Years" `"14 Years" `"13 Years" `"12 Years" `"11 Years" `"10 Years" `"9 Years" `"8 Years" `"7 Years" `"6 Years" `"5 Years" `"4 Years" `"3 Years" `"2 Years" `"1 Year"
                      ))
                   )
                  (`Entity
                   .((`c;`combo;)
                     (`o
                      `"Unspecified ..." `LifeEnt
                      ))
                   )
                  (`Outcome
                   .((`c;`combo;)
                     (`o
                      `Rel_Chg_in_Surp `Chg_in_Surp `Ending_Surp
                      ))
                   )
                  (`Tolerance
                   .((`c;`combo;)
                     (`o
                      `None `By_Asset_Class `By_Asset_Class_by_Time
                      ))
                   )
                  (`Buy_Sequence
                   .((`c;`combo;)
                     (`o
                      `Based_on_Distance_from_Target `By_Asset_Class `By_Asset_Class_by_Time
                      ))
                   )
                  (`Sell_Sequence
                   .((`c;`combo;)
                     (`o
                      `Based_on_Distance_from_Target `By_Asset_Class `By_Asset_Class_by_Time
                      ))
                   )
                  (`Reward_Measure
                   .((`c;`combo;)
                     (`o
                      `avg `" 0.500%" `" 1.000%" `" 2.000%" `" 2.500%" `" 5.000%" `"10.000%" `"20.000%" `"25.000%" `"50.000%" `"75.000%" `"80.000%" `"65.000-" `"75.000-" `"80.000-" `"85.000-" `"90.000-" `"95.000-" `"99.000-" `"99.500-"
                      ))
                   )
                  (`Risk_Measure
                   .((`c;`combo;)
                     (`o
                      `avg `std `min `" 0.500%" `" 1.000%" `" 2.000%" `" 2.500%" `" 5.000%" `"10.000%" `"20.000%" `"25.000%" `"50.000%" `"75.000%" `"80.000%" `"65.000-" `"75.000-" `"80.000-" `"85.000-" `"90.000-" `"95.000-" `"99.000-" `"99.500-" `Semi_Standard_Deviation `Conditional_Standard_Deviation
                      ))
                   )
                  (`Return_Currency
                   .((`c;`combo;)
                     (`o
                      `USD `EUR `GBP `CHF `AUD `CAD `JPY `DKK `NOK `SEK `BRL `PLN `KRW `TWD `HKD `CNY
                      ))
                   )
                  (`Area
                   .((`c;`combo;)
                     (`o
                      `Under `Over
                      ))
                   )
                  (`Threshold
                   .((`c;`combo;)
                     (`o
                      `Mean `Percentile `Fixed
                      ))
                   ))
                )
               (`rl
                .((`Threshold;`"Threshold Type";)
                  (`Fixed;`"Fixed Threshold";))
                )
               (`f
                .((`Percentile;9.6;)
                  (`Fixed;14.0;))
                )
               (`g
                .((`Percentile;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Fixed;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
                )
               (`u
                .((`Percentile;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Fixed;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`e
                .((`Scope;0;)
                  (`Horizon;0;)
                  (`Entity;0;)
                  (`Outcome;0;)
                  (`Tolerance;0;)
                  (`Buy_Sequence;0;)
                  (`Sell_Sequence;0;)
                  (`Return_Currency;0;)
                  (`Reward_Measure;0;)
                  (`Risk_Measure;0;)
                  (`Area;0;)
                  (`Threshold;0;)
                  (`Percentile;0;)
                  (`Fixed;0;))
                )
               (`popup
                .((`Cut;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`cut;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`ne
                      ((,`Cut
                        ,`Copy
                        ,`Copy_All
                        ,`Paste)
                       0 0 1 0)
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
               (`s
                ,`Horizon
                .()))
             )
            (`V;{
   r:()
   if[`"Unspecified ..."=x`Horizon; r,:,(1;"Horizon must be specified")]
   if[`Asset_Only=x`Scope; if[`"Unspecified ..."=x`Return_Currency;r,:,(1;"Return Currency must be specified")]]
   if[x[`Scope] _in `ALM`Statutory_PVDE_ALM; if[`"Unspecified ..."=x`Entity;         r,:,(1;"Entity must be specified")]]
   :[~#r; _n; r]};)))
         (`Asset_Classes
          .((`Asset_Class
             `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `Government_10_20 `Government_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `US_Stock
             .,(`V;{[x]:[~(#x)=#?x;			(1;"Asset Classes must not appear more than once")
                                    `"Unspecified ..." _in x;	(1;"Asset Classes cannot be left unspecified")]};))
            (`Minimum_Value
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Maximum_Value
             1 1 1 1 1 1 1 1 1 1 1 0.2
             )
            (`Market_Value
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Book_Value
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Tax_Basis
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`down
             0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0
             )
            (`up
             0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0
             )
            (`inv
             1 1 1 1 1 1 1 1 1 1 1 1
             )
            (`sel
             1 1 1 1 1 1 1 1 1 1 1 1
             )
            (`mbv
             1 1 1 1 1 1 1 1 1 1 1 0
             )
            (`Fraction_of_Income_Exempt_from_Tax
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Turnover
             1 0 0 0 0 0 0 0.2 0 0 0 0
             )
            (`tbv
             1 0 0 0 0 0 0 1 0 0 0 0
             )
            (`Transaction_Costs
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Asset_Management_Fees
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Bond_Rating_Class
             `None `None `None `None `None `None `None `None `None `None `None `None
             )
            (`Migration_Fraction
             0 0.5 0.5 0.5 0.33 0.1 0.1 0 0.2 0.1 0.1 0
             )
            (`Migration_Target
             `"Unspecified ..." `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `Government_10_20 `"Unspecified ..." `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `"Unspecified ..."
             )
            (`RBC_Factor
             0 0 0 0 0 0 0 0 0.008 0.008 0.008 0.3
             )
            (`RBC_Tax_Factor
             0.35 0.35 0.35 0.35 0.35 0.35 0.35 0.3 0.3 0.3 0.3 0.3
             )
            (`RBC_Stock_Class
             0 0 0 0 0 0 0 0 0 0 0 0
             ))
          .((`V;{[x]
  r:()
  if[`Optimize=.k[`Main;`Input;`Standard_Parameters;`Controls;`Controls;`Mode]
    if[+/{:[x~0n;0;y~0n;0;x>y]}.'+x`Minimum_Value`Maximum_Value;		r,:,(1;"Minimum Value must not be greater than Maximum Value")]
    if[~1.>+/x`Minimum_Value;						r,:,(1;"The sum of the Minimum Value column must be less than 1.0")]
    if[~1.<+/x`Maximum_Value;						r,:,(1;"The sum of the Maximum Value column must be greater than 1.0")]
    ]
  if[`Statutory_PVDE_ALM=.k[`Main;`Input;`Standard_Parameters;`Target;`Scope]
    if[`"Unspecified ..." _in migtargs:x.Migration_Target@miglocs:&0<x.Migration_Fraction;r,:,(1;"Asset Class Migration Targets must be specified if the Migration Fraction is not 0.0")]
    if[|/{x=y}'[x.Asset_Class@miglocs;migtargs];r,:,(1;"An Asset Class cannot migrate into the same Asset Class")]
    if[0=&/{y _in x}[x.Asset_Class]'[migtargs];r,:,(1;"An Asset Class cannot migrate into an unavailable Asset Class")]
    ]
  mcc:.k[`Main;`Input;`MultiClass_Constraints]
  names:!mcc`Max_and_Min
  names@:&1<+/'~0.=mcc[`Factors;names]
  if[#r;:r]};)
            (`j
             .((`cl
                .((`Minimum_Value;`"Minimum\nValue";)
                  (`Maximum_Value;`"Maximum\nValue";)
                  (`Market_Value;`"Market\nValue";)
                  (`Book_Value;`"Book\nValue";)
                  (`Tax_Basis;`"Tax\nBasis";)
                  (`Fraction_of_Income_Exempt_from_Tax;`"Fraction\nTax Exempt";)
                  (`Transaction_Costs;`"Transaction\nCosts";)
                  (`Asset_Management_Fees;`"Asset\nMgmt Fees";)
                  (`down;`"Down\nTolerance";)
                  (`up;`"Up\nTolerance";)
                  (`inv;`"Buy\nSequence";)
                  (`sel;`"Sell\nSequence";)
                  (`mbv;`"Maintain at\nCost Value";)
                  (`tbv;`"Turnover at\nCost Value";)
                  (`Bond_Rating_Class;`"Bond Rating\nClass";)
                  (`Migration_Fraction;`"Migration\nFraction";)
                  (`Migration_Target;`"Migration\nTarget";)
                  (`RBC_Factor;`"RBC\nFactor";)
                  (`RBC_Tax_Factor;`"RBC Tax\nFactor";)
                  (`RBC_Stock_Class;`"RBC Stock\nClass";))
                )
               (`cell
                .((`Asset_Class
                   .((`c;`combo;)
                     (`o
                      `"Unspecified ..." `Bonds_Corp `Bonds_Corp_A `Bonds_Corp_AA `Bonds_Corp_AAA `Bonds_Corp_AAA_00_05 `Bonds_Corp_AAA_05_10 `Bonds_Corp_AAA_10_20 `Bonds_Corp_AAA_20_up `Bonds_Corp_AA_00_05 `Bonds_Corp_AA_05_10 `Bonds_Corp_AA_10_20 `Bonds_corp_AA_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `Bonds_Corp_BBB `Bonds_Corp_BBB_00_05 `Bonds_Corp_BBB_05_10 `Bonds_Corp_BBB_10_20 `Bonds_Corp_BBB_20_up `US_Stock `MBS `Government_00_05 `Government_05_10 `Government_10_20 `Government_20_up `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `All_Assets `ABS `CMBS `Private_Placement `Cash `US_HDiv_Equity `Structured
                      ))
                   )
                  (`mbv
                   .,(`c;`check;)
                   )
                  (`tbv
                   .,(`c;`check;)
                   )
                  (`Bond_Rating_Class
                   .((`c;`combo;)
                     (`o
                      `None `AAA `AA `A `BBB `High_Yield `Investment_Grade
                      ))
                   )
                  (`RBC_Stock_Class
                   .,(`c;`check;)
                   )
                  (`Migration_Target
                   .((`c;`combo;)
                     (`o
                      `"Unspecified ..." `Bonds_Corp `Bonds_Corp_A `Bonds_Corp_AA `Bonds_Corp_AAA `Bonds_Corp_AAA_00_05 `Bonds_Corp_AAA_05_10 `Bonds_Corp_AAA_10_20 `Bonds_Corp_AAA_20_up `Bonds_Corp_AA_00_05 `Bonds_Corp_AA_05_10 `Bonds_Corp_AA_10_20 `Bonds_corp_AA_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `Bonds_Corp_BBB `Bonds_Corp_BBB_00_05 `Bonds_Corp_BBB_05_10 `Bonds_Corp_BBB_10_20 `Bonds_Corp_BBB_20_up `US_Stock `MBS `Government_00_05 `Government_05_10 `Government_10_20 `Government_20_up `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `All_Assets `ABS `CMBS `Private_Placement `Cash `US_HDiv_Equity `Structured
                      ))
                   ))
                )
               (`p
                .((`mbv;0;)
                  (`tbv;0;)
                  (`Bond_Rating_Class;`None;)
                  (`Asset_Class;`"Unspecified ...";)
                  (`Migration_Target;`"Unspecified ...";)
                  (`RBC_Stock_Class;0;)
                  (`Asset_Management_Fees;0.0;)
                  (`Transaction_Costs;0.0;)
                  (`Turnover;0.0;)
                  (`Minimum_Value;0.0;)
                  (`Maximum_Value;1.0;)
                  (`down;0.0;)
                  (`up;0.0;)
                  (`Fraction_of_Income_Exempt_from_Tax;0.0;)
                  (`Migration_Fraction;0.0;)
                  (`RBC_Factor;0.0;)
                  (`RBC_Tax_Factor;0.3;)
                  (`Market_Value;0.0;)
                  (`Book_Value;0.0;)
                  (`Tax_Basis;0.0;)
                  (`inv;1;)
                  (`sel;1;))
                )
               (`f
                .((`Asset_Management_Fees;7.4;)
                  (`Transaction_Costs;7.4;)
                  (`Turnover;7.4;)
                  (`Minimum_Value;7.4;)
                  (`Maximum_Value;7.4;)
                  (`down;7.4;)
                  (`up;7.4;)
                  (`Fraction_of_Income_Exempt_from_Tax;7.4;)
                  (`Migration_Fraction;7.4;)
                  (`RBC_Factor;7.4;)
                  (`RBC_Tax_Factor;7.4;)
                  (`Market_Value;13.0;)
                  (`Book_Value;13.0;)
                  (`Tax_Basis;13.0;)
                  (`inv;4.0;)
                  (`sel;4.0;))
                )
               (`g
                .((`Asset_Management_Fees;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Transaction_Costs;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Turnover;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Minimum_Value;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Maximum_Value;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`down;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`up;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Fraction_of_Income_Exempt_from_Tax;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Migration_Fraction;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`RBC_Factor;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`RBC_Tax_Factor;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Market_Value;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Book_Value;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Tax_Basis;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`inv;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`sel;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};))
                )
               (`u
                .((`Asset_Management_Fees;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Transaction_Costs;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Turnover;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Minimum_Value;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Maximum_Value;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`down;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`up;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Fraction_of_Income_Exempt_from_Tax;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Migration_Fraction;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`RBC_Factor;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`RBC_Tax_Factor;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Market_Value;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Book_Value;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Tax_Basis;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`inv;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`sel;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`a
                `Asset_Class `Minimum_Value `Maximum_Value `Turnover `tbv `Transaction_Costs `Asset_Management_Fees `mbv `Bond_Rating_Class `Migration_Fraction `Migration_Target `RBC_Factor `RBC_Tax_Factor `RBC_Stock_Class
                )
               (`wx;1.3;)
               (`wy;0.7;)
               (`t;{
  if[`Asset_Class _in `,*.j.i
    i:.j.i[1]
    locations:{(`k`Main`Input),y,(`Asset_Class;x)}[i]'1_ .L.P.asset_locations
    ./[`;locations;:;(-1+#.L.P.asset_locations)#,*` . .j.v,.j.i]
    ]
  };)
               (`P;1;)
               (`c;`Table;)
               (`popup
                .((`Insert;{[f;junk]
  nul:{(x~_n)|~#x}                               / null or empty?
  j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
  if[nul i:`. d,a,`j`s
    i:,(`Asset_Class;0)] 			/ default to first selectable if null
  i:.[i;(;0);:[;`Asset_Class]]
  locations:(`k`Main`Input),/:.L.P.asset_locations
  visible:{[v]&/{:[`a _in !a:`. (.u.attr -1_ x),`j; (*|x) _in ,/a`a; 1]}'3_{y#x}[v]'1+!#v}'locations
  {[f;i;visible;v] f[visible;`. v;`. .u.attr v;v;i]}[f;i]'[visible;locations]

 / c:r[1;`j;`c]                                  / save class
 / r[1;`j;`c]:`null                              / set class to null
 / .[`;d,a,`j`c;:;`null]                         / set screen object class to null
 / .[`;d,,v,a;:;r]                               / reset object
 / .[`;d,a,`j`c;:;c]                            / reset screen object class to c
  }[{[visible;d;e;v;i]
  rows:(^d[])@1
  rti:#ixs::[rows; ?i[;1]; ,0]
  :[visible
    .j.ins.row[`$,/".",'$v;&/ixs;rti]
    .[`;v,_n;{[x;y;z](x#y),z,x _ y}[*ixs];rti#/:`./:((.u.attr v),`j`p),/:!`. v] ]
  }];)
                  (`Append;{[f;junk]
  nul:{(x~_n)|~#x}                               / null or empty?
  j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
  if[nul i:`. d,a,`j`s
    i:,(`Asset_Class;0)] 			/ default to first selectable if null
  i:.[i;(;0);:[;`Asset_Class]]
  locations:(`k`Main`Input),/:.L.P.asset_locations
  visible:{[v]&/{:[`a _in !a:`. (.u.attr -1_ x),`j; (*|x) _in ,/a`a; 1]}'3_{y#x}[v]'1+!#v}'locations
  {[f;i;visible;v] f[visible;`. v;`. .u.attr v;v;i]}[f;i]'[visible;locations]

 / c:r[1;`j;`c]                                  / save class
 / r[1;`j;`c]:`null                              / set class to null
 / .[`;d,a,`j`c;:;`null]                         / set screen object class to null
 / .[`;d,,v,a;:;r]                               / reset object
 / .[`;d,a,`j`c;:;c]                            / reset screen object class to c
  }[{[visible;d;e;v;i]
  rows:(^d[])@1
  rti::[rows; 1|#?i[;1]; 1]
  :[visible
    .j.app.row[`$,/".",'$v;rti]
    .[`;v,_n;,;rti#/:`./:((.u.attr v),`j`p),/:!`. v] ]
  }];)
                  (`Delete;{[f;junk]
  nul:{(x~_n)|~#x}                               / null or empty?
  j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
  if[nul i:`. d,a,`j`s
    i:,(`Asset_Class;0)] 			/ default to first selectable if null
  i:.[i;(;0);:[;`Asset_Class]]
  locations:(`k`Main`Input),/:.L.P.asset_locations
  visible:{[v]&/{:[`a _in !a:`. (.u.attr -1_ x),`j; (*|x) _in ,/a`a; 1]}'3_{y#x}[v]'1+!#v}'locations
  {[f;i;visible;v] f[visible;`. v;`. .u.attr v;v;i]}[f;i]'[visible;locations]

 / c:r[1;`j;`c]                                  / save class
 / r[1;`j;`c]:`null                              / set class to null
 / .[`;d,a,`j`c;:;`null]                         / set screen object class to null
 / .[`;d,,v,a;:;r]                               / reset object
 / .[`;d,a,`j`c;:;c]                            / reset screen object class to c
  }[{[visible;d;e;v;i]
  if[rows:(^d[])@1
    :[visible
      .j.del.row[`$,/".",'$v;?i[;1]]
      .[`;v,_n;_di[;?i[;1]]] ]
    ]
  }];)
                  (`s;" ";)
                  (`Cut;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`cut;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste_Transpose;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste_transpose;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`s99;" ";))
                .,(`j
                   .((`async;2;)
                     (`ne
                      ((,`Insert
                        ,`Append
                        ,`Delete
                        ,`s
                        ,`Cut
                        ,`Copy
                        ,`Copy_All
                        ,`Paste
                        ,`Paste_Transpose
                        ,`s99)
                       0 1 0 0 0 0 1 0 0 0)
                      ))
                   ))
               (`e
                .((`Asset_Class;0;)
                  (`Minimum_Value;0;)
                  (`Maximum_Value;0;)
                  (`Market_Value;0;)
                  (`Book_Value;0;)
                  (`Tax_Basis;0;)
                  (`down;0;)
                  (`up;0;)
                  (`inv;0;)
                  (`sel;0;)
                  (`mbv;0;)
                  (`Fraction_of_Income_Exempt_from_Tax;0;)
                  (`Turnover;0;)
                  (`tbv;0;)
                  (`Transaction_Costs;0;)
                  (`Asset_Management_Fees;0;)
                  (`Bond_Rating_Class;0;)
                  (`Migration_Fraction;0;)
                  (`Migration_Target;0;)
                  (`RBC_Factor;0;)
                  (`RBC_Tax_Factor;0;)
                  (`RBC_Stock_Class;0;))
                )
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
               (`s
                ,(`RBC_Stock_Class;0)
                .()))
             )))
         (`Controls
          .((`Controls
             .((`Approximate_Number_of_Frontier_Points
                12
                .,(`V;{:[(`Optimize=.k[`Main;`Input;`Standard_Parameters;`Controls;`Controls;`Mode])&x<2;(1;"The efficient frontier must contain at least two points")]};))
               (`Maximum_Number_of_Iterations;5000;)
               (`Number_of_Simultaneous_Optimizers;5;)
               (`Mode;`Optimize;)
               (`Optimization_Method;`Grid_Search;)
               (`Calculate_Intermediate_Results;`Yes;))
             .,(`j
                .((`cell
                   .((`Mode
                      .((`c;`combo;)
                        (`o
                         `Optimize `Additional_Points_Only
                         ))
                      )
                     (`Optimization_Method
                      .((`c;`combo;)
                        (`o
                         `Gradient_Descent `Grid_Search
                         ))
                      )
                     (`Calculate_Intermediate_Results
                      .((`c;`combo;)
                        (`o
                         `Yes `No
                         ))
                      ))
                   )
                  (`c;`Slot;)
                  (`e
                   .((`Approximate_Number_of_Frontier_Points;0;)
                     (`Maximum_Number_of_Iterations;0;)
                     (`Number_of_Simultaneous_Optimizers;0;)
                     (`Mode;0;)
                     (`Optimization_Method;0;)
                     (`Calculate_Intermediate_Results;0;))
                   )
                  (`popup
                   .((`Cut;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`cut;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                   .,(`j
                      .,(`ne
                         ((,`Cut
                           ,`Copy
                           ,`Copy_All
                           ,`Paste)
                          0 0 1 0)
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
            (`Advanced_Controls
             .((`Minimum_Lambda;0.0;)
               (`Maximum_Lambda;1.0;)
               (`Lambda_Coverage_Factor
                2.0
                .,(`V;{:[(`Optimize=.k[`Main;`Input;`Standard_Parameters;`Controls;`Controls;`Mode])&~x>1.; (1;"Lambda Coverage Factor must be greater than 1.0")]};))
               (`Frontier_Point_Spacing;`Show_All;)
               (`Iteration_Details_in_Monitor;`Off;)
               (`Inefficient_Points_Plotting;`Gradient;)
               (`Minimum_Percent_Distance_between_Efficient_Points;0.02;)
               (`Supervisor_Job_Resource_Units;0;))
             .((`V;{:[(`Optimize=.k[`Main;`Input;`Standard_Parameters;`Controls;`Controls;`Mode])&~x.Minimum_Lambda<x.Maximum_Lambda; (1;"Minimum Lambda must be less than Maximum Lambda")]};)
               (`j
                .((`g
                   .((`Minimum_Lambda;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                     (`Maximum_Lambda;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                     (`Minimum_Percent_Distance_between_Efficient_Points;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                     (`Lambda_Coverage_Factor;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Supervisor_Job_Resource_Units;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 0|r]};))
                   )
                  (`u
                   .((`Simultaneous_Optimizers;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Minimum_Lambda;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Maximum_Lambda;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Lambda_Coverage_Factor;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Supervisor_Job_Resource_Units;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                   )
                  (`f
                   .((`Minimum_Lambda;5.2;)
                     (`Maximum_Lambda;5.2;)
                     (`Lambda_Coverage_Factor;5.2;)
                     (`Minimum_Percent_Distance_between_Efficient_Points;7.4;))
                   )
                  (`cell
                   .((`Frontier_Point_Spacing
                      .((`c;`combo;)
                        (`o
                         `Return_Levels `Risk_Levels `Distances_along_Frontier `Show_All
                         ))
                      )
                     (`Initial_Allocations
                      .((`c;`combo;)
                        (`o
                         `Use_Intermediate_Results `Always_Use_User_Input
                         ))
                      )
                     (`Iteration_Details_in_Monitor
                      .((`c;`combo;)
                        (`o
                         `On `Off
                         ))
                      )
                     (`Inefficient_Points_Plotting
                      .((`c;`combo;)
                        (`o
                         `None `Gradient `Scatter `All
                         ))
                      ))
                   )
                  (`rltip
                   .,(`Supervisor_Job_Resource_Units;`"<html>&nbsp;<html>Default value is 0 which means that the supervisor will not be allocated any dedicated resources.&nbsp;<br>&nbsp;For large optimizations more resource units are recommended to prevent memory overload.</html>&nbsp;</html>";)
                   )
                  (`c;`Slot;)
                  (`e
                   .((`Minimum_Lambda;0;)
                     (`Maximum_Lambda;0;)
                     (`Lambda_Coverage_Factor;0;)
                     (`Frontier_Point_Spacing;0;)
                     (`Iteration_Details_in_Monitor;0;)
                     (`Inefficient_Points_Plotting;0;)
                     (`Minimum_Percent_Distance_between_Efficient_Points;0;)
                     (`Supervisor_Job_Resource_Units;0;))
                   )
                  (`popup
                   .((`Cut;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`cut;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                   .,(`j
                      .,(`ne
                         ((,`Cut
                           ,`Copy
                           ,`Copy_All
                           ,`Paste)
                          0 0 1 0)
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
                )))
            (`Advanced_Optimization_Settings
             .((`Maximum_Absolute_Parameter_Tolerance;0.0001;)
               (`Maximum_Absolute_Gradient_Tolerance;0.001;)
               (`Maximum_Step_Size;1.0;)
               (`Line_Search_Parameter_Tolerance;0.1;)
               (`Line_Search_Gradient_Tolerance;0.1;)
               (`Line_Search_Function_Calls;50;)
               (`Vertex_Coverage_Factor;4;)
               (`Pre_Opt_Randomness_Quantity_Factor;10;)
               (`Starting_Random_Seed;0;)
               (`Brute_Force_Power;`Puny;)
               (`Grid_Search_Granularity;0.01;)
               (`Random_Allocation_Granularity;0.01;))
             .,(`j
                .((`rl
                   .,(`Pre_Opt_Randomness_Quantity_Factor;`"Initial Random Allocations per Asset Class";)
                   )
                  (`cell
                   .((`Brute_Force_Power
                      .((`c;`combo;)
                        (`o
                         `Puny `Weak `Moderate `Strong `Superhuman
                         ))
                      )
                     (`Grid_Search_Granularity
                      .((`c;`combo;)
                        (`o
                         0.001 0.002 0.005 0.01 0.02 0.05 0.1
                         ))
                      )
                     (`Random_Allocation_Granularity
                      .((`c;`combo;)
                        (`o
                         0.001 0.002 0.005 0.01 0.02 0.05 0.1
                         ))
                      ))
                   )
                  (`f
                   .((`Maximum_Absolute_Parameter_Tolerance;13.9;)
                     (`Maximum_Absolute_Gradient_Tolerance;13.9;)
                     (`Maximum_Step_Size;13.9;)
                     (`Line_Search_Parameter_Tolerance;13.9;)
                     (`Line_Search_Gradient_Tolerance;13.9;)
                     (`Line_Search_Function_Calls;{9$_ x};)
                     (`Vertex_Coverage_Factor;13.9;)
                     (`Pre_Opt_Randomness_Quantity_Factor;{9$_ x};)
                     (`Starting_Random_Seed;{9$_ x};)
                     (`Brute_Force_Power;13.9;)
                     (`Grid_Search_Granularity;{t:5.3$x;:["0"=t[4]; -1_ t; t]};)
                     (`Random_Allocation_Granularity;{t:5.3$x;:["0"=t[4]; -1_ t; t]};))
                   )
                  (`g
                   .((`Maximum_Absolute_Parameter_Tolerance;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Maximum_Absolute_Gradient_Tolerance;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Maximum_Step_Size;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Line_Search_Parameter_Tolerance;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Line_Search_Gradient_Tolerance;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Line_Search_Function_Calls;{ / always produces integer
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0];x _dvl"()$%\"";:]
  _ :[(|/1 2=4:v 1)&~v 0;(((1 -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Vertex_Coverage_Factor;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Pre_Opt_Randomness_Quantity_Factor;{ / always produces integer
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0];x _dvl"()$%\"";:]
  _ :[(|/1 2=4:v 1)&~v 0;(((1 -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Starting_Random_Seed;{ / always produces integer
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0];x _dvl"()$%\"";:]
  _ :[(|/1 2=4:v 1)&~v 0;(((1 -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                     (`Brute_Force_Power;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
                   )
                  (`u
                   .((`Maximum_Absolute_Parameter_Tolerance;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Maximum_Absolute_Gradient_Tolerance;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Maximum_Step_Size;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Line_Search_Parameter_Tolerance;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Line_Search_Gradient_Tolerance;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Line_Search_Function_Calls;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Vertex_Coverage_Factor;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Pre_Opt_Randomness_Quantity_Factor;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Starting_Random_Seed;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`Brute_Force_Power;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                   )
                  (`rv
                   .,(`Brute_Force_Power;0;)
                   )
                  (`e
                   .((`Maximum_Absolute_Parameter_Tolerance;0;)
                     (`Maximum_Absolute_Gradient_Tolerance;0;)
                     (`Maximum_Step_Size;0;)
                     (`Line_Search_Parameter_Tolerance;0;)
                     (`Line_Search_Gradient_Tolerance;0;)
                     (`Line_Search_Function_Calls;0;)
                     (`Vertex_Coverage_Factor;0;)
                     (`Pre_Opt_Randomness_Quantity_Factor;0;)
                     (`Starting_Random_Seed;0;)
                     (`Brute_Force_Power;0;)
                     (`Grid_Search_Granularity;0;)
                     (`Random_Allocation_Granularity;0;))
                   ))
                )))
          .((`j
             .((`c;`tab;)
               (`wx;0.425;)
               (`wy;0.3;)
               (`g
                .((`Approximate_Number_of_Frontier_Points;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Maximum_Number_of_Iterations;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Number_of_Simultaneous_Optimizers;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};))
                )
               (`f
                .((`Approximate_Number_of_Frontier_Points;{9$_ x};)
                  (`Maximum_Number_of_Iterations;{9$_ x};)
                  (`Number_of_Simultaneous_Optimizers;{9$_ x};))
                )
               (`u
                .((`Approximate_Number_of_Frontier_Points;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Maximum_Number_of_Iterations;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Number_of_Simultaneous_Optimizers;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`tab;`Controls;))
             )
            (`V;{[x]
  r:()
  if[(`Statutory_PVDE_ALM=.k[`Main;`Input;`Standard_Parameters;`Target;`Scope])&x.Advanced_Controls.Iteration_Details_in_Monitor~`On; r,:,(0;"The Iteration Detail Tab is automatically disabled when running PVDE and will not be present in the monitor")]
  if[`All~x.Advanced_Controls.Inefficient_Points_Plotting; r,:,(0;"Plotting all inefficient points may cause poor graphics performance")]
  :[~#r; _n; r]};)))
         (`Data_Sources
          .((`Model_Choices
             .((`NI_Cashflows;`User_Value;)
               (`NI_EconValue;`Economic_Accounting_Module;)
               (`Stat_LifeReserves;`User_Value;)
               (`Starting_MV;`Investments_Module;)
               (`Starting_BV;`Investments_Module;)
               (`Tax_Model;`Tax_Module;)
               (`NI_TaxableIncome;`Statutory_Accounting_Module;)
               (`Starting_TB;`Statutory_Accounting_Module;)
               (`OIRate;0.35;)
               (`CGRate;0.35;))
             .,(`j
                .((`c;`slot;)
                  (`editor;1;)
                  (`a
                   `NI_Cashflows `Stat_LifeReserves `Starting_MV `Starting_BV
                   )
                  (`t;{
    if[(,`Tax_Model)~.j.i; .k.set_ds_mc_ja[]]
    if[|/((,`Starting_TB);(,`Starting_MV);(,`Starting_BV))~\:.j.i
      pth:`k`Main`Input`Standard_Parameters`Asset_Classes.`j`a
      .k.reorderasscl[(` . pth) _dvl`Market_Value`Book_Value`Tax_Basis;pth]]
    };)
                  (`cell
                   .((`NI_Cashflows
                      .((`c;`combo;)
                        (`o
                         `Cash_Accounting_Module `User_Value
                         ))
                      )
                     (`NI_EconValue
                      .((`c;`combo;)
                        (`o
                         `Economic_Accounting_Module `User_Value
                         ))
                      )
                     (`Stat_LifeReserves
                      .((`c;`combo;)
                        (`o
                         `User_Value `US_Statutory_Life_Accounting_Module
                         ))
                      )
                     (`Starting_MV
                      .((`c;`combo;)
                        (`o
                         `Investments_Module `Direct_Input
                         ))
                      )
                     (`Starting_BV
                      .((`c;`combo;)
                        (`o
                         `Investments_Module `Direct_Input
                         ))
                      )
                     (`Tax_Model
                      .((`c;`combo;)
                        (`o
                         `Tax_Module `Simple `None
                         ))
                      )
                     (`NI_TaxableIncome
                      .((`c;`combo;)
                        (`o
                         `Statutory_Accounting_Module `User_Value
                         ))
                      )
                     (`Starting_TB
                      .((`c;`combo;)
                        (`o
                         `Statutory_Accounting_Module `Direct_Input
                         ))
                      ))
                   )
                  (`rl
                   .((`NI_Cashflows;`"Net Pre-Tax Non-Investment Cash Flow";)
                     (`NI_EconValue;`"Net Non-Investment Economic Value";)
                     (`Stat_LifeReserves;`"Statutory Reserves";)
                     (`Starting_MV;`"Starting Market Values by Asset Class";)
                     (`Starting_BV;`"Starting Book Values by Asset Class";)
                     (`Tax_Model;`"Tax Model";)
                     (`NI_TaxableIncome;`"Net Non-Investment Taxable Income";)
                     (`Starting_TB;`"Starting Tax Basis by Asset Class";)
                     (`OIRate;`"Effective Tax Rate (Ordinary Income)";)
                     (`CGRate;`"Effective Tax Rate (Capital Gains)";))
                   )
                  (`f
                   .((`OIRate;7.4;)
                     (`CGRate;7.4;))
                   )
                  (`g
                   .((`OIRate;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                     (`CGRate;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};))
                   )
                  (`u
                   .((`OIRate;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`CGRate;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                   )
                  (`e
                   .((`NI_Cashflows;0;)
                     (`NI_EconValue;0;)
                     (`Stat_LifeReserves;0;)
                     (`Starting_MV;0;)
                     (`Starting_BV;0;)
                     (`Tax_Model;0;)
                     (`NI_TaxableIncome;0;)
                     (`Starting_TB;0;)
                     (`OIRate;0;)
                     (`CGRate;0;))
                   )
                  (`s
                   ,`Starting_MV
                   .()))
                ))
            (`User_Values
             .((`NI_Cashflows;`Total_Weighted_CF;)
               (`NI_EconValue;`"Unspecified ...";)
               (`NI_TaxableIncome;`"Unspecified ...";)
               (`Stat_LifeReserves;`Weighted_Stat_Reserve;))
             .,(`j
                .((`c;`slot;)
                  (`editor;1;)
                  (`a
                   `NI_Cashflows `Stat_LifeReserves
                   )
                  (`cell
                   .((`NI_Cashflows
                      .((`c;`combo;)
                        (`o
                         `"Unspecified ..." `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                         ))
                      )
                     (`NI_EconValue
                      .((`c;`combo;)
                        (`o
                         `"Unspecified ..." `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                         ))
                      )
                     (`NI_TaxableIncome
                      .((`c;`combo;)
                        (`o
                         `"Unspecified ..." `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                         ))
                      )
                     (`Stat_LifeReserves
                      .((`c;`combo;)
                        (`o
                         `"Unspecified ..." `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                         ))
                      ))
                   )
                  (`rl
                   .((`NI_Cashflows;`"User Value for Net Pre-Tax Non-Investment Cashflows";)
                     (`NI_EconValue;`"User Value for Net Non-Investment Economic Value";)
                     (`NI_TaxableIncome;`"User Value for Net Non-Investment Taxable Income";)
                     (`Stat_LifeReserves;`"User Value for Statutory Reserves";))
                   )
                  (`e
                   .((`NI_Cashflows;0;)
                     (`NI_EconValue;0;)
                     (`NI_TaxableIncome;0;)
                     (`Stat_LifeReserves;0;))
                   ))
                )))
          .((`j
             .((`c;`panel;)
               (`wx;0.425;)
               (`wy;0.3;)
               (`a
                `Model_Choices `User_Values
                ))
             )
            (`V;{
   if[`Asset_Only=` . `k`Main`Input`Standard_Parameters`Target`Scope; :()]
   visible:` . `k`Main`Input`Standard_Parameters`Data_Sources`User_Values.`j`a / UVs that are displayed to the user (based on Scope, etc.)
   map:x.Model_Choices..j.rl / maps names to user-visible descriptions
   f:{[map;d;vis;uv] :[(uv _in vis)&(d[`Model_Choices;uv]=`User_Value)&d[`User_Values;uv]=`"Unspecified ..."; (1;"User Value is in use but not specified: ",$map[uv]); ()]}[map;x;visible]
   r:f'`NI_Cashflows`NI_EconValue`Stat_LifeReserves`NI_TaxableIncome
   :[~#r:{x@&~x~\:()}@r; _n; r]};))))
       .((`j
          .((`c;`panel;)
            (`a
             (`Simulation_Locations `Simulation_Locations `Simulation_Locations
              `Asset_Classes `Asset_Classes `Asset_Classes
              `Target `Data_Sources `Controls)
             ))
          )
         (`V;{
  r:()
  if[#.L.V.valid_dfs_folder[t:x[`Simulation_Locations;`Asset_Class_Returns]];:()]
  ga:.f.read2 .f.makePath_(t;`S;`G.l)
  if[`stored_periods _in !ga; if[~&/(!1+ga`nsp) _lin ga`stored_periods; :(1;.l.ss("The Return Data simulation has been run without storing all required time periods (the last historical periods and all future time periods must be stored)")) ]]
  if[~`Asset_Only~x.Target.Scopt
    if[#.L.V.valid_dfs_folder[t:x[`Simulation_Locations;`Company_Balance_Sheet]];:()]
    gl:.f.read2 .f.makePath_(t;`S;`G.l)
    if[`stored_periods _in !gl; if[~&/(!1+gl`nsp) _lin gl`stored_periods; :(1;.l.ss("The Entity Data simulation has been run without storing all required time periods (the last historical periods and all future time periods must be stored)")) ]]
    pdy_txt:{:[1=x	;	"Annual"
             4=x	;	"Quarterly"
           			"Monthly"]}
    if[~ga.pdy~gl.pdy; r,:,(1;.l.ss("Periodicity does not match between simulations. The Return Data simulation is &0 while the Entity Data simulation is &1";pdy_txt[ga.pdy];pdy_txt[gl.pdy]))]
    ]
  if[`Statutory_PVDE_ALM=x.Target.Scope
    ///////////////////////////////////////
    // JOSP - FOR NOW I AM GOING TO DEMAND THAT LIAB AND ASSET FILE HAVE THE EXACT SAME TIME AND PATHS
    // IN NEXT UPDATE WE WILL ALLOW ASSET FILE TO CONTAIN MORE TIMES/PATHS (BUT NOT LESS) AND JUST USE THE NECESSARY AMOUNT NEEDED FOR THE LIABILITY
    // NOTE THAT WE COULD DO THE SAME FOR ANNUAL VS QUARTERLY VS MONTHLY (BUT DO WE WANT TO?)
    if[~ga.nsp~gl.nsp; r,:,(1;.l.ss("Simulation length does not match between simulations. The Return Data simulation has &0 periods, while the Entity Data simulation has &1 periods";ga.nsp;gl.nsp))]
    if[~ga.tnp~gl.tnp; r,:,(1;.l.ss("Number of paths does not match between simulations. The Return Data simulation has &0 paths, while the Entity Data simulation has &1 paths";ga.tnp;gl.tnp))]
    ///////////////////////////////////////
    if[~(.k[`Main;`Input;`User_Value_Inputs_and_Discounting;`Discounting;.k[`Main;`Input;`User_Value_Inputs_and_Discounting;`Discounting;`method];`economy]) _in ga.e2r; r,:,(1;"The selected economy for discounting is not available in the Return Data simulation.")]

    / next two are temporary, until that functionality is working
    if[~`User_Value=x[`Data_Sources;`Model_Choices;`NI_Cashflows]; r,:,(1;"TEMPORARY: Scope is Statutory PVDE ALM, which requires User Values for Net Non-Investment Cashflows";(`Target`Scope;`"Data Sources"`"Model Choices"`"Net Non-Investment Cashflows"))]
    if[~`User_Value=x[`Data_Sources;`Model_Choices;`Stat_LifeReserves]; r,:,(1;"TEMPORARY: Scope is Statutory PVDE ALM, which requires User Values for Statutory Reserves";(`Target`Scope;`"Data Sources"`"Model Choices"`"Statutory Reserves"))]
    ]
    :[~#r; _n; r]};)))
      (`User_Value_Inputs_and_Discounting
       .((`User_Value_Inputs
          .((`c0;`C_0;)
            (`c2;`C_2;)
            (`c3a;`C_3;)
            (`c3b;`Zero;)
            (`c3c;`Zero;)
            (`c4a;`C_4;)
            (`c4b;`Zero;))
          .,(`j
             .((`wy;1.8;)
               (`cell
                .((`c0
                   .((`c;`combo;)
                     (`o
                      `Zero `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                      ))
                   )
                  (`c2
                   .((`c;`combo;)
                     (`o
                      `Zero `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                      ))
                   )
                  (`c3a
                   .((`c;`combo;)
                     (`o
                      `Zero `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                      ))
                   )
                  (`c3b
                   .((`c;`combo;)
                     (`o
                      `Zero `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                      ))
                   )
                  (`c3c
                   .((`c;`combo;)
                     (`o
                      `Zero `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                      ))
                   )
                  (`c4a
                   .((`c;`combo;)
                     (`o
                      `Zero `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                      ))
                   )
                  (`c4b
                   .((`c;`combo;)
                     (`o
                      `Zero `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                      ))
                   ))
                )
               (`rl
                .((`c0;`"Asset Risk - Affiliated Amounts (C-0)";)
                  (`c2;`"Insurance Risk (C-2)";)
                  (`c3a;`"Interest Rate Risk (C-3a)";)
                  (`c3b;`"Health Credit Risk (C-3b)";)
                  (`c3c;`"Market Risk (C-3c)";)
                  (`c4a;`"Business Risk (C-4a)";)
                  (`c4b;`"Business Risk (C-4b)";))
                )
               (`e
                .((`c0;0;)
                  (`c2;0;)
                  (`c3a;0;)
                  (`c3b;0;)
                  (`c3c;0;)
                  (`c4a;0;)
                  (`c4b;0;))
                )
               (`s
                ,`c2
                .()))
             ))
         (`targsurp
          .((`mints;2.0;)
            (`targts;2.5;)
            (`maxts;20.0;)
            (`mintsact;`When_Minimum_Surplus_is_Reached;)
            (`method;`Expected_End_of_Period;))
          .,(`j
             .((`l;"Surplus Held";)
               (`f
                .((`mints;7.4;)
                  (`maxts;7.4;)
                  (`targts;7.4;))
                )
               (`u
                .((`mints;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`maxts;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`targts;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`g
                .((`mints;{r:.C.G.positive_number[x];:[(2=4:r)|1=4:r;:[1.>r;1.;r];r]};)
                  (`maxts;{r:.C.G.positive_number[x];:[(2=4:r)|1=4:r;:[1.>r;1.;r];r]};)
                  (`targts;{r:.C.G.positive_number[x];:[(2=4:r)|1=4:r;:[1.>r;1.;r];r]};))
                )
               (`rl
                .((`mints;`"Minimum Factor of RBC";)
                  (`maxts;`"Maximum Factor of RBC";)
                  (`targts;`"Target Factor of RBC";)
                  (`mintsact;`"Minimum Surplus Activation";)
                  (`method;`"Asset Allocation used to Estimate Surplus";))
                )
               (`cell
                .((`mintsact
                   .((`c;`combo;)
                     (`o
                      `Effective_Immediately `When_Minimum_Surplus_is_Reached `When_Target_Surplus_is_Reached
                      ))
                   )
                  (`method
                   .((`c;`combo;)
                     (`o
                      `Expected_End_of_Period `Start_of_Period `After_Price_Returns_Before_Turnover `After_Turnover_Before_Migration `After_Migration
                      ))
                   ))
                )
               (`rltip
                .((`mintsact;`"<html>&nbsp;By default, the minimum surplus will be in effect immediately. When surplus is below the minimum, a capital infusion is required (causing negative DE).&nbsp;<br>&nbsp;If set to 'When Minimum Surplus is Reached,' the minimum surplus requirement will not be activated until surplus has reached the minimum surplus.&nbsp;<br>&nbsp;If set to 'When Target Surplus is Reached,' the minimum surplus requirement will not be activated until surplus has reached the target surplus.&nbsp;<br>&nbsp;Note that there is a default global minimum surplus of 100% of RBC. A capital infusion always will be required if surplus is below this amount.&nbsp;<br>&nbsp;See documentation for more information.&nbsp;<br>&nbsp;&nbsp;</html>";)
                  (`method;`"<html>&nbsp;By default, surplus calculations will be performed based on the expected allocation after distributed earnings, new investments, and rebalancing. This is the recommended and most accurate method.&nbsp;<br>&nbsp;If set to 'Start of Period' surplus will based on the asset allocation at the start of the period.&nbsp;<br>&nbsp;If set to 'After Price Returns Before Turnover' surplus will be based on the asset allocation after price returns but before any turnover amounts.&nbsp;<br>&nbsp;If set to 'After Turnover Before Migration' surplus will be based on the asset allocation after price returns and turnover amounts but before any migration is performed.&nbsp;<br>&nbsp;If set to 'After Migration' surplus will be based on the asset allocation after price returns, turnover amounts, and migration.&nbsp;<br>&nbsp;See documentation for more information.&nbsp;<br>&nbsp;&nbsp;</html>";))
                )
               (`e
                .((`mints;0;)
                  (`targts;0;)
                  (`maxts;0;)
                  (`mintsact;0;)
                  (`method;0;))
                )
               (`s
                ,`method
                .()))
             ))
         (`Initial_Holdings
          .((`multinit;1.05;)
            (`uvaddinit;`Zero;)
            (`addinit;0.0;))
          .,(`j
             .((`l;"Initial Holdings Modifiers (these are applied in the order listed at time 0)";)
               (`wy;2.4;)
               (`cell
                .,(`uvaddinit
                   .((`c;`combo;)
                     (`o
                      `Zero `Zero `Term_Weight `WL_Weight `UL_Weight `DA_Weight `Weighted_Premium `Weighted_Benefits `Weighted_Expenses `Weighted_Stat_Reserve `Total_Weighted_CF `C_0 `C_2 `C_3 `C_4 `US_HDiv_Equity_Price `US_HDiv_Equity_Div `Term_Premium `Term_Benefits `Term_Expenses `Term_Stat_Reserve `Term_Net_Liab `WL_Premium `WL_Benefits `WL_Expenses `WL_Stat_Reserve `WL_Net_Liab `UL_Premium `UL_Benefits `UL_Expenses `UL_Stat_Reserve `UL_Net_Liab `DA_Premium `DA_Benefits `DA_Expenses `DA_Stat_Reserve `DA_Net_Liab
                      ))
                   )
                )
               (`rl
                .((`uvaddinit;`"User Value Addition to Initial Holdings";)
                  (`multinit;`"Multiple of Initial Holdings";)
                  (`addinit;`"Addition to Initial Holdings";))
                )
               (`u
                .((`addinit;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`multinit;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`g
                .,(`multinit;{:[0>r:G.number x; -r; r]};)
                )
               (`f
                .((`multinit;7.4;)
                  (`addinit;14.0;))
                )
               (`e
                .((`multinit;0;)
                  (`uvaddinit;0;)
                  (`addinit;0;))
                )
               (`s
                ,`multinit
                .()))
             ))
         (`Discounting
          .((`method
             `path_specific_point
             .,(`j
                .((`c;`combo;)
                  (`l;`Method;)
                  (`fill;`h;)
                  (`wy;0.0;)
                  (`ol
                   (`fixed `starting_yield_curve `path_specific_point
                    ("Fixed Rate"
                     "Point on Starting Yield Curve"
                     "Path Specific Point on Yield Curve over Time"))
                   )
                  (`o
                   `fixed `starting_yield_curve `path_specific_point
                   )
                  (`t;{.[`;({(-1_ x),~-1#x}[-1_ .j.v]),`j`a;:;`method,(`. .j.v),`fill]};)
                  (`e;0;))
                ))
            (`fixed
             .((`rate
                0.03
                .,(`j
                   .((`c;`scalar;)
                     (`u;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`l;`"Interest Rate";)
                     (`fill;`h;)
                     (`f;7.4;)
                     (`e;0;))
                   ))
               (`economy
                `US
                .,(`j
                   .((`l;"Economy";)
                     (`c;`combo;)
                     (`o
                      `"Unspecified ..." `US
                      )
                     (`e;0;))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`border;0;)
                  (`wy;0.0;)
                  (`a
                   `economy `rate
                   ))
                ))
            (`starting_yield_curve
             .((`spread
                0.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;`"Additive Spread to Point on Starting Yield Curve";)
                     (`fill;`h;)
                     (`f;7.4;)
                     (`u;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`e;0;))
                   ))
               (`factor
                1.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;`"Multiplicative Factor to Point on Starting Yield Curve";)
                     (`fill;`h;)
                     (`f;7.4;)
                     (`u;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`g;{:[0>r:G.number x; -r; r]};)
                     (`e;0;))
                   ))
               (`maturity
                `"1 Year"
                .,(`j
                   .((`c;`combo;)
                     (`l;`"Point on Starting Yield Curve";)
                     (`o
                      `"Unspecified ..." `"Overnight Rate" `"1 Year" `"2 Year" `"3 Year" `"4 Year" `"5 Year" `"6 Year" `"7 Year" `"8 Year" `"9 Year" `"10 Year" `"11 Year" `"12 Year" `"13 Year" `"14 Year" `"15 Year" `"16 Year" `"17 Year" `"18 Year" `"19 Year" `"20 Year" `"21 Year" `"22 Year" `"23 Year" `"24 Year" `"25 Year" `"26 Year" `"27 Year" `"28 Year" `"29 Year" `"30 Year"
                      )
                     (`fill;`h;)
                     (`e;0;))
                   ))
               (`economy
                `US
                .,(`j
                   .((`c;`combo;)
                     (`l;"Economy";)
                     (`o
                      `"Unspecified ..." `US
                      )
                     (`e;0;))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`border;0;)
                  (`wy;0.0;)
                  (`a
                   `economy `spread `factor `maturity
                   ))
                ))
            (`path_specific_point
             .((`spread
                0.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;`"Additive Spread to Path Specific Yield";)
                     (`fill;`h;)
                     (`f;7.4;)
                     (`u;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`e;0;))
                   ))
               (`factor
                1.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;`"Multiplicative Factor to Path Specific Yield";)
                     (`fill;`h;)
                     (`f;7.4;)
                     (`u;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                     (`g;{:[0>r:G.number x; -r; r]};)
                     (`e;0;)
                     (`s;();.()))
                   ))
               (`maturity
                `"1 Year"
                .,(`j
                   .((`c;`combo;)
                     (`l;`"Point on Yield Curve";)
                     (`o
                      `"Unspecified ..." `"Overnight Rate" `"1 Year" `"2 Year" `"3 Year" `"4 Year" `"5 Year" `"6 Year" `"7 Year" `"8 Year" `"9 Year" `"10 Year" `"11 Year" `"12 Year" `"13 Year" `"14 Year" `"15 Year" `"16 Year" `"17 Year" `"18 Year" `"19 Year" `"20 Year" `"21 Year" `"22 Year" `"23 Year" `"24 Year" `"25 Year" `"26 Year" `"27 Year" `"28 Year" `"29 Year" `"30 Year"
                      )
                     (`fill;`h;)
                     (`e;0;)
                     (`ol
                      (`"Unspecified ..." `"Overnight Rate" `"1 Year" `"2 Year" `"3 Year" `"4 Year" `"5 Year" `"6 Year" `"7 Year" `"8 Year" `"9 Year" `"10 Year" `"11 Year" `"12 Year" `"13 Year" `"14 Year" `"15 Year" `"16 Year" `"17 Year" `"18 Year" `"19 Year" `"20 Year" `"21 Year" `"22 Year" `"23 Year" `"24 Year" `"25 Year" `"26 Year" `"27 Year" `"28 Year" `"29 Year" `"30 Year"
                       `"Unspecified ..." `"Overnight Rate" `"1 Year" `"2 Year" `"3 Year" `"4 Year" `"5 Year" `"6 Year" `"7 Year" `"8 Year" `"9 Year" `"10 Year" `"11 Year" `"12 Year" `"13 Year" `"14 Year" `"15 Year" `"16 Year" `"17 Year" `"18 Year" `"19 Year" `"20 Year" `"21 Year" `"22 Year" `"23 Year" `"24 Year" `"25 Year" `"26 Year" `"27 Year" `"28 Year" `"29 Year" `"30 Year")
                      ))
                   ))
               (`economy
                `US
                .,(`j
                   .((`c;`combo;)
                     (`l;`Economy;)
                     (`o
                      `"Unspecified ..." `US
                      )
                     (`e;0;)
                     (`ol
                      (`"Unspecified ..." `US
                       `"Unspecified ..." `US)
                      ))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`border;0;)
                  (`wy;0.0;)
                  (`a
                   `economy `spread `factor `maturity
                   ))
                ))
            (`fill

             .,(`j
                .((`c;`panel;)
                  (`border;0;)
                  (`wy;0.5;))
                )))
          .,(`j
             .((`c;`panel;)
               (`l;`"Risk-Free Rate";)
               (`wy;1e-010;)
               (`anchor;`s;)
               (`a
                `method `path_specific_point `fill
                ))
             ))
         (`Hurdle_Rate
          .((`rfadd;0.04;)
            (`rfmult;1.0;))
          .,(`j
             .((`f
                .((`rfadd;7.4;)
                  (`rfmult;7.4;))
                )
               (`rl
                .((`rfadd;`"Additive Spread to Risk-Free Rate";)
                  (`rfmult;`"Multiplicative Factor to Risk-Free Rate";))
                )
               (`wy;0.3;)
               (`u
                .((`rfadd;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`rfmult;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`g
                .,(`rfmult;{:[0>r:G.number x; -r; r]};)
                )
               (`e
                .((`rfadd;0;)
                  (`rfmult;0;))
                )
               (`s
                ,`rfmult
                .()))
             ))
         (`Borrowing_Rate
          .((`rfadd;0.02;)
            (`rfmult;1.0;))
          .,(`j
             .((`f
                .((`rfadd;7.4;)
                  (`rfmult;7.4;))
                )
               (`rl
                .((`rfadd;`"Additive Spread to Risk-Free Rate";)
                  (`rfmult;`"Multiplicative Factor to Risk-Free Rate";))
                )
               (`wy;0.3;)
               (`u
                .((`rfadd;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`rfmult;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`g
                .,(`rfmult;{:[0>r:G.number x; -r; r]};)
                )
               (`e
                .((`rfadd;0;)
                  (`rfmult;0;))
                )
               (`s
                ,`rfadd
                .()))
             ))
         (`Tax_Rates
          .,(`inctax;0.35;)
          .,(`j
             .((`f
                .,(`inctax;7.4;)
                )
               (`g
                .,(`inctax;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                )
               (`u
                .,(`inctax;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                )
               (`rl
                .,(`inctax;`"Income Tax Rate";)
                )
               (`wy;0.3;)
               (`e
                .,(`inctax;0;)
                )
               (`s
                ,`inctax
                .()))
             ))
         (`Miscellaneous
          .((`bondrecfrac;0.65;)
            (`netcfstaxed;1;)
            (`sellasswhenable;`Down_to_Target_Surplus;)
            (`borrow;0;)
            (`sellassfordebt;`Never;))
          .,(`j
             .((`l;"Miscellaneous (Cash Flow Related)";)
               (`f
                .,(`bondrecfrac;7.4;)
                )
               (`u
                .,(`bondrecfrac;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                )
               (`g
                .,(`bondrecfrac;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                )
               (`rl
                .((`bondrecfrac;`"Bond Default Recovery Fraction";)
                  (`netcfstaxed;`"Net Liability Cash Flows Are After Tax";)
                  (`sellasswhenable;`"Sell Assets If Net Cash Flow Is Negative ...";)
                  (`borrow;`"Borrow Money When Remaining Net Cash Flow Is Negative";)
                  (`sellassfordebt;`"Sell Assets To Pay Outstanding Debt ...";))
                )
               (`rltip
                .((`bondrecfrac;`"<html>&nbsp;When a bond defaults, what fraction per dollar is recovered?&nbsp;</html>";)
                  (`netcfstaxed;`"<html>&nbsp;Check this box if the Net Liability Cash Flow User Value Input is already after tax.&nbsp;</html>";)
                  (`sellasswhenable;`"<html>&nbsp;Defines the point to which we sell assets to pay liability cash outflows.&nbsp;<br>&nbsp;'Never' prohibits the company from selling assets to meet liability cash outflows. Capital would be required from shareholders.&nbsp;<br>&nbsp;Down to Minimum Surplus allows the company to sell assets down to the minimum factor of RBC surplus as defined by the user under 'surplus held.'&nbsp;<br>&nbsp;If the Minimum Factor of RBC is not currently active, assets can be sold down to a limit of 100% of RBC.&nbsp;<br>&nbsp;Down to Target Surplus allows the company to sell assets down to the target factor of RBC surplus as defined by the user under 'surples held.'&nbsp;<br>&nbsp;See documentation for further information.&nbsp;<br>&nbsp;&nbsp;</html>";)
                  (`borrow;`"<html>&nbsp;When enabled, if the Net Cash Flow is negative (after selling any available assets if the above option is enabled), money will be borrowed at the defined Borrowing Rate.&nbsp;<br>&nbsp;If disabled, a cash infusion would be required causing distributable earnings to be negative.&nbsp;<br>&nbsp;&nbsp;</html>";)
                  (`sellassfordebt;`"<html>&nbsp;Defines the point to which we sell assets to pay any outstanding debt.&nbsp;<br>&nbsp;'Never' prohibits the company from selling assets to pay outstanding debt. Debt will accumulate unless there is cash available (from premium, investment income, maturities, turnover, etc.) to make payments.&nbsp;<br>&nbsp;Down to Minimum Surplus allows the company to sell assets down to the minimum factor of RBC surplus as defined by the user under 'surplus held.'&nbsp;<br>&nbsp;If the Minimum Factor of RBC is not currently active, assets can be sold down to a limit of 100% of RBC.&nbsp;<br>&nbsp;Down to Target Surplus allows the company to sell assets down to the target factor of RBC surplus as defined by the user under 'surples held.'&nbsp;<br>&nbsp;See documentation for further information.&nbsp;<br>&nbsp;&nbsp;</html>";))
                )
               (`cell
                .((`netcfstaxed
                   .,(`c;`check;)
                   )
                  (`sellasswhenable
                   .((`c;`combo;)
                     (`o
                      `Never `Down_to_Minimum_Surplus `Down_to_Target_Surplus
                      ))
                   )
                  (`borrow
                   .,(`c;`check;)
                   )
                  (`sellassfordebt
                   .((`c;`combo;)
                     (`o
                      `Never `Down_to_Minimum_Surplus `Down_to_Target_Surplus
                      ))
                   ))
                )
               (`e
                .((`bondrecfrac;0;)
                  (`netcfstaxed;0;)
                  (`sellasswhenable;0;)
                  (`borrow;0;)
                  (`sellassfordebt;0;))
                )
               (`s
                ,`sellasswhenable
                .()))
             ))
         (`Miscellaneous2
          .((`bondrecfrac;0.65;)
            (`inv2init;0;)
            (`sel2init;0;))
          .,(`j
             .((`l;"Miscellaneous (Asset Class Related)";)
               (`f
                .,(`bondrecfrac;7.4;)
                )
               (`rv
                .,(`bondrecfrac;0;)
                )
               (`cell
                .((`inv2init
                   .,(`c;`check;)
                   )
                  (`sel2init
                   .,(`c;`check;)
                   ))
                )
               (`rl
                .((`inv2init;`"Only Invest Up To The Target Allocation";)
                  (`sel2init;`"Only Sell Down To The Target Allocation                                      ";))
                )
               (`rltip
                .((`inv2init;`"<html>&nbsp;By default (disabled), the optimizer will invest excess cash until the maximum tolerance is hit in the order of investment priorities.&nbsp;<br>&nbsp;If this option is enabled, the optimizer will only invest until the target allocation is reached and then move on to the next priority.&nbsp;<br>&nbsp;If the target allocation is 0%, even if the investment priority is highest, no investment will be made to the asset class while this option is enabled.&nbsp;<br>&nbsp;See documentation for more information.&nbsp;<br>&nbsp;&nbsp;</html>";)
                  (`sel2init;`"<html>&nbsp;By default (disabled), the optimizer will sell as required until the minimum tolerance is hit in the order of sell priorities.&nbsp;<br>&nbsp;If this option is enabled, the optimizer will only sell until the target allocation is reached and then move on to the next priority.&nbsp;<br>&nbsp;If the target allocation is 100%, even if the sell priority is highest, no selling of the asset class will be performed while this option is enabled.&nbsp;<br>&nbsp;See documentation for more information.&nbsp;<br>&nbsp;&nbsp;</html>";))
                )
               (`e
                .((`bondrecfrac;0;)
                  (`inv2init;0;)
                  (`sel2init;0;))
                )
               (`s
                ,`sel2init
                .()))
             )))
       .((`j
          .((`c;`panel;)
            (`a
             (`User_Value_Inputs `Tax_Rates
              `User_Value_Inputs `targsurp
              `Miscellaneous `Initial_Holdings
              `Miscellaneous2 `Initial_Holdings
              `Discounting `Hurdle_Rate
              `Discounting `Borrowing_Rate)
             )
            (`l;`"PVDE - User Values and Rates";))
          )
         (`V;{
  r:()
  if[`Statutory_PVDE_ALM=.k[`Main;`Input;`Standard_Parameters;`Target;`Scope]
    if[`"Unspecified ..." _in x.User_Value_Inputs[]; r,:,(1;"User Values must be specified")]
    if[`"Unspecified ..."~(x.Discounting . x.Discounting.method) . `economy; r,:,(1;"Discounting Economy must be specified")]
    if[`"Unspecified ..."~(x.Discounting . x.Discounting.method) . `maturity; r,:,(1;"Discounting Yield Curve Point must be specified")]
    if[x.targsurp.targts<x.targsurp.mints; r,:,(1;"Target Surplus must be greater than or equal to Minimum Surplus")]
    if[x.targsurp.mints>x.targsurp.maxts; r,:,(1;"Minimum Surplus must be less than or equal to Maximum Surplus")]
    if[x.targsurp.targts>x.targsurp.maxts; r,:,(1;"Target Surplus must be less than or equal to Maximum Surplus")]
    ]
  :[~#r; _n; r]};)))
      (`imr
       .((`init
          .((`Year_1
             ,0.0
             )
            (`Year_2
             ,0.0
             )
            (`Year_3
             ,0.0
             )
            (`Year_4
             ,0.0
             )
            (`Year_5
             ,0.0
             )
            (`Year_6
             ,0.0
             )
            (`Year_7
             ,0.0
             )
            (`Year_8
             ,0.0
             )
            (`Year_9
             ,0.0
             )
            (`Year_10
             ,0.0
             )
            (`Year_11
             ,0.0
             )
            (`Year_12
             ,0.0
             )
            (`Year_13
             ,0.0
             )
            (`Year_14
             ,0.0
             )
            (`Year_15
             ,0.0
             )
            (`Year_16
             ,0.0
             )
            (`Year_17
             ,0.0
             )
            (`Year_18
             ,0.0
             )
            (`Year_19
             ,0.0
             )
            (`Year_20
             ,0.0
             )
            (`Year_21
             ,0.0
             )
            (`Year_22
             ,0.0
             )
            (`Year_23
             ,0.0
             )
            (`Year_24
             ,0.0
             )
            (`Year_25
             ,0.0
             )
            (`Year_26
             ,0.0
             )
            (`Year_27
             ,0.0
             )
            (`Year_28
             ,0.0
             )
            (`Year_29
             ,0.0
             )
            (`Year_30
             ,0.0
             ))
          .,(`j
             .((`c;`table;)
               (`l;`"Initial Interest Maintenance Reserve Schedule";)
               (`wy;0.1;)
               (`f;12.0;)
               (`g;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`u;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
               (`popup
                .((`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`async;2;)
                   ))
               (`e
                .((`Year_1;0;)
                  (`Year_2;0;)
                  (`Year_3;0;)
                  (`Year_4;0;)
                  (`Year_5;0;)
                  (`Year_6;0;)
                  (`Year_7;0;)
                  (`Year_8;0;)
                  (`Year_9;0;)
                  (`Year_10;0;)
                  (`Year_11;0;)
                  (`Year_12;0;)
                  (`Year_13;0;)
                  (`Year_14;0;)
                  (`Year_15;0;)
                  (`Year_16;0;)
                  (`Year_17;0;)
                  (`Year_18;0;)
                  (`Year_19;0;)
                  (`Year_20;0;)
                  (`Year_21;0;)
                  (`Year_22;0;)
                  (`Year_23;0;)
                  (`Year_24;0;)
                  (`Year_25;0;)
                  (`Year_26;0;)
                  (`Year_27;0;)
                  (`Year_28;0;)
                  (`Year_29;0;)
                  (`Year_30;0;))
                )
               (`s
                ,(`Year_8;0)
                .()))
             ))
         (`assimr
          .((`Asset_Class
             `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `Government_10_20 `Government_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `US_Stock
             )
            (`Year_0
             1 1 1 1 1 1 1 1 1 1 1 1.0
             )
            (`Year_1
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_2
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_3
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_4
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_5
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_6
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_7
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_8
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_9
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_10
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_11
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_12
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_13
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_14
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_15
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_16
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_17
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_18
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_19
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_20
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_21
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_22
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_23
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_24
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_25
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_26
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_27
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_28
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_29
             0 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_30
             0 0 0 0 0 0 0 0 0 0 0 0.0
             ))
          .,(`j
             .((`c;`table;)
               (`l;`"Amortization Schedule for the Interest Maintenance Reserve by Asset Class";)
               (`p
                .((`Asset_Class;`"Unspecified ...";)
                  (`Year_0;1.0;)
                  (`Year_1;0.0;)
                  (`Year_2;0.0;)
                  (`Year_3;0.0;)
                  (`Year_4;0.0;)
                  (`Year_5;0.0;)
                  (`Year_6;0.0;)
                  (`Year_7;0.0;)
                  (`Year_8;0.0;)
                  (`Year_9;0.0;)
                  (`Year_10;0.0;)
                  (`Year_11;0.0;)
                  (`Year_12;0.0;)
                  (`Year_13;0.0;)
                  (`Year_14;0.0;)
                  (`Year_15;0.0;)
                  (`Year_16;0.0;)
                  (`Year_17;0.0;)
                  (`Year_18;0.0;)
                  (`Year_19;0.0;)
                  (`Year_20;0.0;)
                  (`Year_21;0.0;)
                  (`Year_22;0.0;)
                  (`Year_23;0.0;)
                  (`Year_24;0.0;)
                  (`Year_25;0.0;)
                  (`Year_26;0.0;)
                  (`Year_27;0.0;)
                  (`Year_28;0.0;)
                  (`Year_29;0.0;)
                  (`Year_30;0.0;))
                )
               (`e
                .((`Asset_Class;0;)
                  (`Year_0;0;)
                  (`Year_1;0;)
                  (`Year_2;0;)
                  (`Year_3;0;)
                  (`Year_4;0;)
                  (`Year_5;0;)
                  (`Year_6;0;)
                  (`Year_7;0;)
                  (`Year_8;0;)
                  (`Year_9;0;)
                  (`Year_10;0;)
                  (`Year_11;0;)
                  (`Year_12;0;)
                  (`Year_13;0;)
                  (`Year_14;0;)
                  (`Year_15;0;)
                  (`Year_16;0;)
                  (`Year_17;0;)
                  (`Year_18;0;)
                  (`Year_19;0;)
                  (`Year_20;0;)
                  (`Year_21;0;)
                  (`Year_22;0;)
                  (`Year_23;0;)
                  (`Year_24;0;)
                  (`Year_25;0;)
                  (`Year_26;0;)
                  (`Year_27;0;)
                  (`Year_28;0;)
                  (`Year_29;0;)
                  (`Year_30;0;))
                )
               (`f
                .((`Asset_Class;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
                  (`Year_0;7.4;)
                  (`Year_1;7.4;)
                  (`Year_2;7.4;)
                  (`Year_3;7.4;)
                  (`Year_4;7.4;)
                  (`Year_5;7.4;)
                  (`Year_6;7.4;)
                  (`Year_7;7.4;)
                  (`Year_8;7.4;)
                  (`Year_9;7.4;)
                  (`Year_10;7.4;)
                  (`Year_11;7.4;)
                  (`Year_12;7.4;)
                  (`Year_13;7.4;)
                  (`Year_14;7.4;)
                  (`Year_15;7.4;)
                  (`Year_16;7.4;)
                  (`Year_17;7.4;)
                  (`Year_18;7.4;)
                  (`Year_19;7.4;)
                  (`Year_20;7.4;)
                  (`Year_21;7.4;)
                  (`Year_22;7.4;)
                  (`Year_23;7.4;)
                  (`Year_24;7.4;)
                  (`Year_25;7.4;)
                  (`Year_26;7.4;)
                  (`Year_27;7.4;)
                  (`Year_28;7.4;)
                  (`Year_29;7.4;)
                  (`Year_30;7.4;))
                )
               (`clbg
                .,(`Asset_Class;192192192;)
                )
               (`bg
                .,(`Asset_Class;217217217;)
                )
               (`fixed;1;)
               (`popup
                .((`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`async;2;)
                   ))
               (`g
                .((`Year_0;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_1;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_2;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_3;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_4;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_5;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_6;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_7;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_8;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_9;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_10;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_11;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_12;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_13;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_14;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_15;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_16;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_17;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_18;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_19;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_20;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_21;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_22;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_23;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_24;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_25;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_26;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_27;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_28;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_29;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
                  (`Year_30;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
                )
               (`u
                .((`Year_0;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_1;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_2;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_3;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_4;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_5;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_6;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_7;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_8;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_9;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_10;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_11;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_12;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_13;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_14;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_15;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_16;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_17;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_18;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_19;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_20;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_21;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_22;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_23;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_24;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_25;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_26;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_27;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_28;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_29;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_30;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`s
                ,(`Year_7;5)
                .()))
             )))
       .((`j
          .((`c;`panel;)
            (`l;`"Interest Maintenance Reserve";))
          )
         (`V;{
  if[~`Statutory_PVDE_ALM=.k[`Main;`Input;`Standard_Parameters;`Target;`Scope]; :_n]
  r:()
  if[#.L.V.valid_dfs_folder[.k[`Main;`Input;`Standard_Parameters;`Simulation_Locations;`Asset_Class_Returns]];: _n]
  /if[0>+/,/.k[`Main;`Input;`imr;`init;`initimr][];  r,:,(1;("The Initial IMR Balance can not be negative."))] / note we may not want this guy !!! Under our current understand, negative IMRs exist but are not displayed...
  if[~6=4:.k[`Main;`Input;`imr;`assimr;`Asset_Class]
    if[~.k[`Main;`Input;`imr;`assimr;`Asset_Class]~.k[`Main;`Input;`Standard_Parameters;`Asset_Classes;`Asset_Class]; r,:,(1;"IMR Amortization Schedule Asset Classes must exactly match those used in Standard Parameters. Re-fetch Asset Classes if necessary")]
    if[#badclasses:({:[~1=+/x;y;_n]}'[+1_ .k[`Main;`Input;`imr;`assimr][];.k[`Main;`Input;`imr;`assimr;`Asset_Class]]) _dv _n
      r,:,(1;("The IMR Amortization Schedules for the following asset classes do not sum to 100%:<br>",-4_ _ssr[,/($badclasses),\:"<br>";"_";" "]))
      /r,:,(1;("The IMR Amortization Schedules for the following asset classes do not sum to 100%:<br>",-2_ ,/($badclasses),',", "))
      /r,:,(1;("The IMR Amortization Schedules for the following asset classes do not sum to 100%: &0";-2_ ,/($badclasses),',", "))
      /r,:,(1;("The IMR Amortization Schedules for the following asset classes do not sum to 100%: &0";123))
      ]
    ]
  :[~#r; _n; r]};)))
      (`dyntol
       .((`down
          .((`Asset_Class
             `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `Government_10_20 `Government_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `US_Stock
             )
            (`Year_1
             1 1 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_2
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_3
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_4
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_5
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_6
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_7
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_8
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_9
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_10
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_11
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_12
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_13
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_14
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_15
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_16
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_17
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_18
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_19
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_20
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_21
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_22
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_23
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_24
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_25
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_26
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_27
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_28
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_29
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_30
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             ))
          .,(`j
             .((`c;`table;)
               (`l;`"Down Tolerance";)
               (`p
                .((`Asset_Class;`"Unspecified ...";)
                  (`Year_1;0.0;)
                  (`Year_2;0n;)
                  (`Year_3;0n;)
                  (`Year_4;0n;)
                  (`Year_5;0n;)
                  (`Year_6;0n;)
                  (`Year_7;0n;)
                  (`Year_8;0n;)
                  (`Year_9;0n;)
                  (`Year_10;0n;)
                  (`Year_11;0n;)
                  (`Year_12;0n;)
                  (`Year_13;0n;)
                  (`Year_14;0n;)
                  (`Year_15;0n;)
                  (`Year_16;0n;)
                  (`Year_17;0n;)
                  (`Year_18;0n;)
                  (`Year_19;0n;)
                  (`Year_20;0n;)
                  (`Year_21;0n;)
                  (`Year_22;0n;)
                  (`Year_23;0n;)
                  (`Year_24;0n;)
                  (`Year_25;0n;)
                  (`Year_26;0n;)
                  (`Year_27;0n;)
                  (`Year_28;0n;)
                  (`Year_29;0n;)
                  (`Year_30;0n;))
                )
               (`e
                .((`Asset_Class;0;)
                  (`Year_1;0;)
                  (`Year_2;0;)
                  (`Year_3;0;)
                  (`Year_4;0;)
                  (`Year_5;0;)
                  (`Year_6;0;)
                  (`Year_7;0;)
                  (`Year_8;0;)
                  (`Year_9;0;)
                  (`Year_10;0;)
                  (`Year_11;0;)
                  (`Year_12;0;)
                  (`Year_13;0;)
                  (`Year_14;0;)
                  (`Year_15;0;)
                  (`Year_16;0;)
                  (`Year_17;0;)
                  (`Year_18;0;)
                  (`Year_19;0;)
                  (`Year_20;0;)
                  (`Year_21;0;)
                  (`Year_22;0;)
                  (`Year_23;0;)
                  (`Year_24;0;)
                  (`Year_25;0;)
                  (`Year_26;0;)
                  (`Year_27;0;)
                  (`Year_28;0;)
                  (`Year_29;0;)
                  (`Year_30;0;))
                )
               (`f
                .((`Asset_Class;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
                  (`Year_1;7.4;)
                  (`Year_2;7.4;)
                  (`Year_3;7.4;)
                  (`Year_4;7.4;)
                  (`Year_5;7.4;)
                  (`Year_6;7.4;)
                  (`Year_7;7.4;)
                  (`Year_8;7.4;)
                  (`Year_9;7.4;)
                  (`Year_10;7.4;)
                  (`Year_11;7.4;)
                  (`Year_12;7.4;)
                  (`Year_13;7.4;)
                  (`Year_14;7.4;)
                  (`Year_15;7.4;)
                  (`Year_16;7.4;)
                  (`Year_17;7.4;)
                  (`Year_18;7.4;)
                  (`Year_19;7.4;)
                  (`Year_20;7.4;)
                  (`Year_21;7.4;)
                  (`Year_22;7.4;)
                  (`Year_23;7.4;)
                  (`Year_24;7.4;)
                  (`Year_25;7.4;)
                  (`Year_26;7.4;)
                  (`Year_27;7.4;)
                  (`Year_28;7.4;)
                  (`Year_29;7.4;)
                  (`Year_30;7.4;))
                )
               (`clbg
                .,(`Asset_Class;192192192;)
                )
               (`bg
                .,(`Asset_Class;217217217;)
                )
               (`fixed;1;)
               (`popup
                .((`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`async;2;)
                   ))
               (`g
                .((`Year_1;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_2;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_3;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_4;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_5;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_6;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_7;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_8;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_9;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_10;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_11;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_12;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_13;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_14;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_15;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_16;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_17;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_18;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_19;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_20;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_21;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_22;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_23;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_24;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_25;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_26;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_27;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_28;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_29;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_30;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};))
                )
               (`u
                .((`Year_1;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_2;{[x;y]		("";y) };)
                  (`Year_3;{[x;y]		("";y) };)
                  (`Year_4;{[x;y]		("";y) };)
                  (`Year_5;{[x;y]		("";y) };)
                  (`Year_6;{[x;y]		("";y) };)
                  (`Year_7;{[x;y]		("";y) };)
                  (`Year_8;{[x;y]		("";y) };)
                  (`Year_9;{[x;y]		("";y) };)
                  (`Year_10;{[x;y]		("";y) };)
                  (`Year_11;{[x;y]		("";y) };)
                  (`Year_12;{[x;y]		("";y) };)
                  (`Year_13;{[x;y]		("";y) };)
                  (`Year_14;{[x;y]		("";y) };)
                  (`Year_15;{[x;y]		("";y) };)
                  (`Year_16;{[x;y]		("";y) };)
                  (`Year_17;{[x;y]		("";y) };)
                  (`Year_18;{[x;y]		("";y) };)
                  (`Year_19;{[x;y]		("";y) };)
                  (`Year_20;{[x;y]		("";y) };)
                  (`Year_21;{[x;y]		("";y) };)
                  (`Year_22;{[x;y]		("";y) };)
                  (`Year_23;{[x;y]		("";y) };)
                  (`Year_24;{[x;y]		("";y) };)
                  (`Year_25;{[x;y]		("";y) };)
                  (`Year_26;{[x;y]		("";y) };)
                  (`Year_27;{[x;y]		("";y) };)
                  (`Year_28;{[x;y]		("";y) };)
                  (`Year_29;{[x;y]		("";y) };)
                  (`Year_30;{[x;y]		("";y) };))
                ))
             ))
         (`up
          .((`Asset_Class
             `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `Government_10_20 `Government_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `US_Stock
             )
            (`Year_1
             1 1 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Year_2
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_3
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_4
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_5
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_6
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_7
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_8
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_9
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_10
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_11
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_12
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_13
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_14
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_15
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_16
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_17
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_18
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_19
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_20
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_21
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_22
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_23
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_24
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_25
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_26
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_27
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_28
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_29
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             )
            (`Year_30
             0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n 0n
             ))
          .,(`j
             .((`c;`table;)
               (`l;`"Up Tolerance";)
               (`p
                .((`Asset_Class;`"Unspecified ...";)
                  (`Year_1;0.0;)
                  (`Year_2;0n;)
                  (`Year_3;0n;)
                  (`Year_4;0n;)
                  (`Year_5;0n;)
                  (`Year_6;0n;)
                  (`Year_7;0n;)
                  (`Year_8;0n;)
                  (`Year_9;0n;)
                  (`Year_10;0n;)
                  (`Year_11;0n;)
                  (`Year_12;0n;)
                  (`Year_13;0n;)
                  (`Year_14;0n;)
                  (`Year_15;0n;)
                  (`Year_16;0n;)
                  (`Year_17;0n;)
                  (`Year_18;0n;)
                  (`Year_19;0n;)
                  (`Year_20;0n;)
                  (`Year_21;0n;)
                  (`Year_22;0n;)
                  (`Year_23;0n;)
                  (`Year_24;0n;)
                  (`Year_25;0n;)
                  (`Year_26;0n;)
                  (`Year_27;0n;)
                  (`Year_28;0n;)
                  (`Year_29;0n;)
                  (`Year_30;0n;))
                )
               (`e
                .((`Asset_Class;0;)
                  (`Year_1;0;)
                  (`Year_2;0;)
                  (`Year_3;0;)
                  (`Year_4;0;)
                  (`Year_5;0;)
                  (`Year_6;0;)
                  (`Year_7;0;)
                  (`Year_8;0;)
                  (`Year_9;0;)
                  (`Year_10;0;)
                  (`Year_11;0;)
                  (`Year_12;0;)
                  (`Year_13;0;)
                  (`Year_14;0;)
                  (`Year_15;0;)
                  (`Year_16;0;)
                  (`Year_17;0;)
                  (`Year_18;0;)
                  (`Year_19;0;)
                  (`Year_20;0;)
                  (`Year_21;0;)
                  (`Year_22;0;)
                  (`Year_23;0;)
                  (`Year_24;0;)
                  (`Year_25;0;)
                  (`Year_26;0;)
                  (`Year_27;0;)
                  (`Year_28;0;)
                  (`Year_29;0;)
                  (`Year_30;0;))
                )
               (`f
                .((`Asset_Class;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
                  (`Year_1;7.4;)
                  (`Year_2;7.4;)
                  (`Year_3;7.4;)
                  (`Year_4;7.4;)
                  (`Year_5;7.4;)
                  (`Year_6;7.4;)
                  (`Year_7;7.4;)
                  (`Year_8;7.4;)
                  (`Year_9;7.4;)
                  (`Year_10;7.4;)
                  (`Year_11;7.4;)
                  (`Year_12;7.4;)
                  (`Year_13;7.4;)
                  (`Year_14;7.4;)
                  (`Year_15;7.4;)
                  (`Year_16;7.4;)
                  (`Year_17;7.4;)
                  (`Year_18;7.4;)
                  (`Year_19;7.4;)
                  (`Year_20;7.4;)
                  (`Year_21;7.4;)
                  (`Year_22;7.4;)
                  (`Year_23;7.4;)
                  (`Year_24;7.4;)
                  (`Year_25;7.4;)
                  (`Year_26;7.4;)
                  (`Year_27;7.4;)
                  (`Year_28;7.4;)
                  (`Year_29;7.4;)
                  (`Year_30;7.4;))
                )
               (`clbg
                .,(`Asset_Class;192192192;)
                )
               (`bg
                .,(`Asset_Class;217217217;)
                )
               (`fixed;1;)
               (`popup
                .((`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`async;2;)
                   ))
               (`g
                .((`Year_1;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_2;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_3;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_4;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_5;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_6;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_7;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_8;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_9;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_10;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_11;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_12;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_13;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_14;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_15;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_16;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_17;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_18;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_19;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_20;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_21;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_22;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_23;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_24;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_25;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_26;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_27;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_28;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_29;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Year_30;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};))
                )
               (`u
                .((`Year_1;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_2;{[x;y]		("";y) };)
                  (`Year_3;{[x;y]		("";y) };)
                  (`Year_4;{[x;y]		("";y) };)
                  (`Year_5;{[x;y]		("";y) };)
                  (`Year_6;{[x;y]		("";y) };)
                  (`Year_7;{[x;y]		("";y) };)
                  (`Year_8;{[x;y]		("";y) };)
                  (`Year_9;{[x;y]		("";y) };)
                  (`Year_10;{[x;y]		("";y) };)
                  (`Year_11;{[x;y]		("";y) };)
                  (`Year_12;{[x;y]		("";y) };)
                  (`Year_13;{[x;y]		("";y) };)
                  (`Year_14;{[x;y]		("";y) };)
                  (`Year_15;{[x;y]		("";y) };)
                  (`Year_16;{[x;y]		("";y) };)
                  (`Year_17;{[x;y]		("";y) };)
                  (`Year_18;{[x;y]		("";y) };)
                  (`Year_19;{[x;y]		("";y) };)
                  (`Year_20;{[x;y]		("";y) };)
                  (`Year_21;{[x;y]		("";y) };)
                  (`Year_22;{[x;y]		("";y) };)
                  (`Year_23;{[x;y]		("";y) };)
                  (`Year_24;{[x;y]		("";y) };)
                  (`Year_25;{[x;y]		("";y) };)
                  (`Year_26;{[x;y]		("";y) };)
                  (`Year_27;{[x;y]		("";y) };)
                  (`Year_28;{[x;y]		("";y) };)
                  (`Year_29;{[x;y]		("";y) };)
                  (`Year_30;{[x;y]		("";y) };))
                ))
             )))
       .,(`j
          .((`c;`panel;)
            (`l;`Tolerances;))
          ))
      (`dynpr
       .((`inv
          .((`Asset_Class
             `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `Government_10_20 `Government_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `US_Stock
             )
            (`Year_1
             1 1 1 1 1 1 1 1 1 1 1 1
             )
            (`Year_2
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_3
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_4
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_5
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_6
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_7
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_8
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_9
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_10
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_11
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_12
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_13
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_14
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_15
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_16
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_17
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_18
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_19
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_20
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_21
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_22
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_23
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_24
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_25
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_26
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_27
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_28
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_29
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_30
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             ))
          .,(`j
             .((`c;`table;)
               (`l;`"Buy Sequence";)
               (`p
                .((`Asset_Class;`"Unspecified ...";)
                  (`Year_1;1;)
                  (`Year_2;0N;)
                  (`Year_3;0N;)
                  (`Year_4;0N;)
                  (`Year_5;0N;)
                  (`Year_6;0N;)
                  (`Year_7;0N;)
                  (`Year_8;0N;)
                  (`Year_9;0N;)
                  (`Year_10;0N;)
                  (`Year_11;0N;)
                  (`Year_12;0N;)
                  (`Year_13;0N;)
                  (`Year_14;0N;)
                  (`Year_15;0N;)
                  (`Year_16;0N;)
                  (`Year_17;0N;)
                  (`Year_18;0N;)
                  (`Year_19;0N;)
                  (`Year_20;0N;)
                  (`Year_21;0N;)
                  (`Year_22;0N;)
                  (`Year_23;0N;)
                  (`Year_24;0N;)
                  (`Year_25;0N;)
                  (`Year_26;0N;)
                  (`Year_27;0N;)
                  (`Year_28;0N;)
                  (`Year_29;0N;)
                  (`Year_30;0N;))
                )
               (`e
                .((`Asset_Class;0;)
                  (`Year_1;0;)
                  (`Year_2;0;)
                  (`Year_3;0;)
                  (`Year_4;0;)
                  (`Year_5;0;)
                  (`Year_6;0;)
                  (`Year_7;0;)
                  (`Year_8;0;)
                  (`Year_9;0;)
                  (`Year_10;0;)
                  (`Year_11;0;)
                  (`Year_12;0;)
                  (`Year_13;0;)
                  (`Year_14;0;)
                  (`Year_15;0;)
                  (`Year_16;0;)
                  (`Year_17;0;)
                  (`Year_18;0;)
                  (`Year_19;0;)
                  (`Year_20;0;)
                  (`Year_21;0;)
                  (`Year_22;0;)
                  (`Year_23;0;)
                  (`Year_24;0;)
                  (`Year_25;0;)
                  (`Year_26;0;)
                  (`Year_27;0;)
                  (`Year_28;0;)
                  (`Year_29;0;)
                  (`Year_30;0;))
                )
               (`f
                .((`Asset_Class;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
                  (`Year_1;4;)
                  (`Year_2;4;)
                  (`Year_3;4;)
                  (`Year_4;4;)
                  (`Year_5;4;)
                  (`Year_6;4;)
                  (`Year_7;4;)
                  (`Year_8;4;)
                  (`Year_9;4;)
                  (`Year_10;4;)
                  (`Year_11;4;)
                  (`Year_12;4;)
                  (`Year_13;4;)
                  (`Year_14;4;)
                  (`Year_15;4;)
                  (`Year_16;4;)
                  (`Year_17;4;)
                  (`Year_18;4;)
                  (`Year_19;4;)
                  (`Year_20;4;)
                  (`Year_21;4;)
                  (`Year_22;4;)
                  (`Year_23;4;)
                  (`Year_24;4;)
                  (`Year_25;4;)
                  (`Year_26;4;)
                  (`Year_27;4;)
                  (`Year_28;4;)
                  (`Year_29;4;)
                  (`Year_30;4;))
                )
               (`clbg
                .,(`Asset_Class;192192192;)
                )
               (`bg
                .,(`Asset_Class;217217217;)
                )
               (`fixed;1;)
               (`popup
                .((`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`async;2;)
                   ))
               (`g
                .((`Year_1;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_2;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_3;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_4;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_5;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_6;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_7;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_8;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_9;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_10;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_11;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_12;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_13;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_14;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_15;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_16;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_17;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_18;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_19;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_20;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_21;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_22;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_23;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_24;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_25;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_26;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_27;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_28;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_29;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_30;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};))
                )
               (`u
                .((`Year_1;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_2;{[x;y]		("";y) };)
                  (`Year_3;{[x;y]		("";y) };)
                  (`Year_4;{[x;y]		("";y) };)
                  (`Year_5;{[x;y]		("";y) };)
                  (`Year_6;{[x;y]		("";y) };)
                  (`Year_7;{[x;y]		("";y) };)
                  (`Year_8;{[x;y]		("";y) };)
                  (`Year_9;{[x;y]		("";y) };)
                  (`Year_10;{[x;y]		("";y) };)
                  (`Year_11;{[x;y]		("";y) };)
                  (`Year_12;{[x;y]		("";y) };)
                  (`Year_13;{[x;y]		("";y) };)
                  (`Year_14;{[x;y]		("";y) };)
                  (`Year_15;{[x;y]		("";y) };)
                  (`Year_16;{[x;y]		("";y) };)
                  (`Year_17;{[x;y]		("";y) };)
                  (`Year_18;{[x;y]		("";y) };)
                  (`Year_19;{[x;y]		("";y) };)
                  (`Year_20;{[x;y]		("";y) };)
                  (`Year_21;{[x;y]		("";y) };)
                  (`Year_22;{[x;y]		("";y) };)
                  (`Year_23;{[x;y]		("";y) };)
                  (`Year_24;{[x;y]		("";y) };)
                  (`Year_25;{[x;y]		("";y) };)
                  (`Year_26;{[x;y]		("";y) };)
                  (`Year_27;{[x;y]		("";y) };)
                  (`Year_28;{[x;y]		("";y) };)
                  (`Year_29;{[x;y]		("";y) };)
                  (`Year_30;{[x;y]		("";y) };))
                ))
             ))
         (`sel
          .((`Asset_Class
             `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `Government_10_20 `Government_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `US_Stock
             )
            (`Year_1
             1 1 1 1 1 1 1 1 1 1 1 1
             )
            (`Year_2
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_3
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_4
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_5
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_6
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_7
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_8
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_9
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_10
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_11
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_12
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_13
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_14
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_15
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_16
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_17
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_18
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_19
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_20
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_21
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_22
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_23
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_24
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_25
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_26
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_27
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_28
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_29
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             )
            (`Year_30
             0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N 0N
             ))
          .,(`j
             .((`c;`table;)
               (`l;`"Sell Sequence";)
               (`p
                .((`Asset_Class;`"Unspecified ...";)
                  (`Year_1;1;)
                  (`Year_2;0N;)
                  (`Year_3;0N;)
                  (`Year_4;0N;)
                  (`Year_5;0N;)
                  (`Year_6;0N;)
                  (`Year_7;0N;)
                  (`Year_8;0N;)
                  (`Year_9;0N;)
                  (`Year_10;0N;)
                  (`Year_11;0N;)
                  (`Year_12;0N;)
                  (`Year_13;0N;)
                  (`Year_14;0N;)
                  (`Year_15;0N;)
                  (`Year_16;0N;)
                  (`Year_17;0N;)
                  (`Year_18;0N;)
                  (`Year_19;0N;)
                  (`Year_20;0N;)
                  (`Year_21;0N;)
                  (`Year_22;0N;)
                  (`Year_23;0N;)
                  (`Year_24;0N;)
                  (`Year_25;0N;)
                  (`Year_26;0N;)
                  (`Year_27;0N;)
                  (`Year_28;0N;)
                  (`Year_29;0N;)
                  (`Year_30;0N;))
                )
               (`e
                .((`Asset_Class;0;)
                  (`Year_1;0;)
                  (`Year_2;0;)
                  (`Year_3;0;)
                  (`Year_4;0;)
                  (`Year_5;0;)
                  (`Year_6;0;)
                  (`Year_7;0;)
                  (`Year_8;0;)
                  (`Year_9;0;)
                  (`Year_10;0;)
                  (`Year_11;0;)
                  (`Year_12;0;)
                  (`Year_13;0;)
                  (`Year_14;0;)
                  (`Year_15;0;)
                  (`Year_16;0;)
                  (`Year_17;0;)
                  (`Year_18;0;)
                  (`Year_19;0;)
                  (`Year_20;0;)
                  (`Year_21;0;)
                  (`Year_22;0;)
                  (`Year_23;0;)
                  (`Year_24;0;)
                  (`Year_25;0;)
                  (`Year_26;0;)
                  (`Year_27;0;)
                  (`Year_28;0;)
                  (`Year_29;0;)
                  (`Year_30;0;))
                )
               (`f
                .((`Asset_Class;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
                  (`Year_1;4;)
                  (`Year_2;4;)
                  (`Year_3;4;)
                  (`Year_4;4;)
                  (`Year_5;4;)
                  (`Year_6;4;)
                  (`Year_7;4;)
                  (`Year_8;4;)
                  (`Year_9;4;)
                  (`Year_10;4;)
                  (`Year_11;4;)
                  (`Year_12;4;)
                  (`Year_13;4;)
                  (`Year_14;4;)
                  (`Year_15;4;)
                  (`Year_16;4;)
                  (`Year_17;4;)
                  (`Year_18;4;)
                  (`Year_19;4;)
                  (`Year_20;4;)
                  (`Year_21;4;)
                  (`Year_22;4;)
                  (`Year_23;4;)
                  (`Year_24;4;)
                  (`Year_25;4;)
                  (`Year_26;4;)
                  (`Year_27;4;)
                  (`Year_28;4;)
                  (`Year_29;4;)
                  (`Year_30;4;))
                )
               (`clbg
                .,(`Asset_Class;192192192;)
                )
               (`bg
                .,(`Asset_Class;217217217;)
                )
               (`fixed;1;)
               (`popup
                .((`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`async;2;)
                   ))
               (`g
                .((`Year_1;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_2;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_3;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_4;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_5;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_6;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_7;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_8;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_9;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_10;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_11;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_12;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_13;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_14;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_15;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_16;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_17;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_18;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_19;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_20;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_21;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_22;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_23;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_24;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_25;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_26;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_27;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_28;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_29;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};)
                  (`Year_30;{:[(r:G.integer x) _in 0N,0I,-0I; 0N; 1|r]};))
                )
               (`u
                .((`Year_1;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Year_2;{[x;y]		("";y) };)
                  (`Year_3;{[x;y]		("";y) };)
                  (`Year_4;{[x;y]		("";y) };)
                  (`Year_5;{[x;y]		("";y) };)
                  (`Year_6;{[x;y]		("";y) };)
                  (`Year_7;{[x;y]		("";y) };)
                  (`Year_8;{[x;y]		("";y) };)
                  (`Year_9;{[x;y]		("";y) };)
                  (`Year_10;{[x;y]		("";y) };)
                  (`Year_11;{[x;y]		("";y) };)
                  (`Year_12;{[x;y]		("";y) };)
                  (`Year_13;{[x;y]		("";y) };)
                  (`Year_14;{[x;y]		("";y) };)
                  (`Year_15;{[x;y]		("";y) };)
                  (`Year_16;{[x;y]		("";y) };)
                  (`Year_17;{[x;y]		("";y) };)
                  (`Year_18;{[x;y]		("";y) };)
                  (`Year_19;{[x;y]		("";y) };)
                  (`Year_20;{[x;y]		("";y) };)
                  (`Year_21;{[x;y]		("";y) };)
                  (`Year_22;{[x;y]		("";y) };)
                  (`Year_23;{[x;y]		("";y) };)
                  (`Year_24;{[x;y]		("";y) };)
                  (`Year_25;{[x;y]		("";y) };)
                  (`Year_26;{[x;y]		("";y) };)
                  (`Year_27;{[x;y]		("";y) };)
                  (`Year_28;{[x;y]		("";y) };)
                  (`Year_29;{[x;y]		("";y) };)
                  (`Year_30;{[x;y]		("";y) };))
                ))
             )))
       .,(`j
          .((`c;`panel;)
            (`l;`Sequences;))
          ))
      (`addlpts
       .((`labelpanel
          .((`labels
             .((`Point
                `Pt_1 `Pt_2 `Pt_3 `Pt_4 `Pt_5 `Pt_6 `Pt_7 `Pt_8 `Pt_9 `Pt_10 `Pt_11 `Pt_12 `Pt_13 `Pt_14 `Pt_15
                )
               (`Label
                `"79% Government 20 up; 21% Government Other" `"100% Bonds Corp A" `"100% Government" `"100% Government 00 01" `"100% Government 01 03" `"100% Government 03 05" `"100% Government 05 07" `"100% Government 07 10" `"100% Government 10 20" `"100% Government 20 up" `"100% Bonds Corp A 00 05" `"100% Bonds Corp A 05 10" `"100% Bonds Corp A 10 20" `"100% Bonds Corp A 20 up" `"75% Bonds Corp A; 25% Government 20 up"
                ))
             .((`V;{[x]
     r:()
     if[` _in x`Label; r,:,(1;"Labels cannot be empty")]
     if[(`Additional_Points_Only=.k[`Main;`Input;`Standard_Parameters;`Controls;`Controls;`Mode])&0=#x`Label; r,:,(1;"No Additional Points (required when Mode is set to Additional Points Only)")]
     :[~#r; _n; r]};)
               (`j
                .((`l;`"Point Labels";)
                  (`border;0;)
                  (`c;`table;)
                  (`f
                   .((`Point;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
                     (`Label;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};))
                   )
                  (`u
                   .,(`Label;{:[y~x;							("";y)
		   ~#$y;						("";y)
		   |/("\\";"/";":";"*";"?";"<";">";"|";"\"") _in\: $y;	("Cannot contain \\ / : * ? \" < > |";x)
									("";y)]};)
                   )
                  (`fixed;1;)
                  (`clbg
                   .,(`Point;192192192;)
                   )
                  (`bg
                   .,(`Point;217217217;)
                   )
                  (`p
                   .((`Point;`"Unspecified ...";)
                     (`Label;`"Point x";))
                   )
                  (`P;1;)
                  (`wy;0.2;)
                  (`wx;0.8;)
                  (`popup
                   .((`Append;{[f;junk]
  nul:{(x~_n)|~#x}                               / null or empty?
  dot:`${($x),".",$y}/`,                         / dotted name from vector
  j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
  if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
  r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
  if[2=#r                                        / if there is a result
    if[r~(w;b)    ;:_n]                          / if it is identical, no op
    c:r[1;`j;`c]                                 / save class
    r[1;`j;`c]:`null                             / set class to null
    .[`;d,a,`j`c;:;`null]                        / set screen object class to null
    .[`;d,,v,a;:;r]                              / reset object
    .[`;d,a,`j`c;:;c] ]                          / reset screen object class to c
}[{[l;d;e;v;i]
  old:` . v,`Point
  rows:(^d[])@1; label:. `$,/".",'$v,`Label
  rti::[rows; 1|#?i[;1]; 1]
  .j.app.row[`$,/".",'$v;rti]
  .[`;v,`Label;:;new:label,get_unique_labels[rti;label;l]]
  .[`;v,`Point;:;`$"Pt_",/:$1+!#new]
  table:`k`Main`Input`addlpts`points
  newdict:` . v,`Point
  oldtable:` . table
  newpts:newdict _dvl old
  bang:!oldtable
  asscl:oldtable[assclheader:*bang]
  newtable:.+(assclheader,old,newpts;(,asscl),oldtable[old],(#newpts)#,(#asscl)#0.)
  oldtabledot:` . .u.attr table
  oldtabledot.j.f[newpts]:.C.F.bp_fraction
  oldtabledot.j.g[newpts]:.C.G.zero_to_one
  oldtabledot.j.u[newpts]:.C.U.number
  oldtabledot.j.p[newpts]:0.0
  .[`;table;:;newtable]
  .[`;.u.attr table;:;oldtabledot]
}[`Point]];)
                     (`Insert;{[f;junk]
  nul:{(x~_n)|~#x}                               / null or empty?
  dot:`${($x),".",$y}/`,                         / dotted name from vector
  j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
  if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
  r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
  if[2=#r                                        / if there is a result
    if[r~(w;b)    ;:_n]                          / if it is identical, no op
    c:r[1;`j;`c]                                 / save class
    r[1;`j;`c]:`null                             / set class to null
    .[`;d,a,`j`c;:;`null]                        / set screen object class to null
    .[`;d,,v,a;:;r]                              / reset object
    .[`;d,a,`j`c;:;c] ]                          / reset screen object class to c
}[{[l;d;e;v;i]
  old:` . v,`Point
  rows:(^d[])@1; label:. `$,/".",'$v,`Label
  rti:#ixs::[rows; ?i[;1]; ,0]
  .j.ins.row[`$,/".",'$v;&/ixs;rti]
  .[`;(v,`Label),,ixs;:;new:get_unique_labels[rti;label;l]]
  d:@[d;_n;{(i#y),((#x)#z),(i:&/x)_ y}[ixs];e.j.p[!d]]
  d:.[d;(`Label;ixs);:;new]
  d:@[d;`Point;:;`$"Pt_",/:$1+!#d[*!d]]
  table:`k`Main`Input`addlpts`points
  newdict:d[`Point]
  oldtable:` . table
  newpts:newdict _dvl old
  bang:!oldtable
  asscl:oldtable[assclheader:*bang]
  if[~0=*ixs
    bef:old@!*ixs
    aft:bang _dvl `Asset_Class,bef
    newtable:.+(assclheader,old,newpts;(,asscl),oldtable[bef],((#newpts)#,(#asscl)#0.),oldtable[aft])
    ]
  if[0=*ixs
    aft:bang _dv `Asset_Class
    newtable:.+(assclheader,old,newpts;(,asscl),((#newpts)#,(#asscl)#0.),oldtable[aft])
    ]
  oldtabledot:` . .u.attr table
  oldtabledot.j.f[newpts]:.C.F.bp_fraction
  oldtabledot.j.g[newpts]:.C.G.zero_to_one
  oldtabledot.j.u[newpts]:.C.U.number
  oldtabledot.j.p[newpts]:0.0
  .[`;table;:;newtable]
  .[`;.u.attr table;:;oldtabledot]
  (d;e)}[`Point]];)
                     (`Delete;{[f;junk]
  nul:{(x~_n)|~#x}                               / null or empty?
  dot:`${($x),".",$y}/`,                         / dotted name from vector
  j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
  if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
  r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
  if[2=#r                                        / if there is a result
    if[r~(w;b)    ;:_n]                          / if it is identical, no op
    c:r[1;`j;`c]                                 / save class
    r[1;`j;`c]:`null                             / set class to null
    .[`;d,a,`j`c;:;`null]                        / set screen object class to null
    .[`;d,,v,a;:;r]                              / reset object
    .[`;d,a,`j`c;:;c] ]                          / reset screen object class to c
}[{[d;e;v;i]
 if[rows:(^d[])@1
   old:` . v,`Point
   .j.del.row[`$,/".",'$v;?i[;1]]
   table:`k`Main`Input`addlpts`points
   .[`;(.u.attr@table),`j`s;:;_n] / set sel to null to avoid deleting a column that is currently selected!
   oldbang:!` . table
   newdict:` . v,`Point
   .[`;v,`Point;:;`$"Pt_",/:$1+!#newdict]
   finaldict:` . v,`Point
   oldtable:` . table
   misspts:old _dvl newdict
   oldtable:oldtable _di misspts
   bang:!oldtable
   asscl:oldtable[assclheader:*bang]
   newtable:.+(assclheader,finaldict;(,asscl),oldtable[bang _dv `Asset_Class])
   .[`;table;:;newtable]
   oldtabledot:` . .u.attr table
   delme:((#oldbang)-#bang)#|oldbang
   oldtabledot:./[oldtabledot;(`j,/:`p`f`g`u);{x _di delme}]
   .[`;.u.attr table;:;oldtabledot]
   ]
}];)
                     (`s;" ";)
                     (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                   .,(`j
                      .,(`async;2;)
                      ))
                  (`e
                   .((`Point;0;)
                     (`Label;0;))
                   )
                  (`s
                   ,(`Label;5)
                   .()))
                )))
            (`buttons
             .((`resetlabels
                {	tablepath:(-2_ .j.v),`labels
   			table: ` . tablepath
   			if[~#table[`Label]; :()]
   			table[`Label]:`${_ssr[z;x;y]}["Pt";"Point"]'[$table[`Point]]
   			.[`;tablepath;:;table]
   			}
                .,(`j
                   .((`l;"<html><div align=center>Reset<br>Labels</html>";)
                     (`c;`button;)
                     (`wy;0.2;)
                     (`valign;`c;)
                     (`e;0;))
                   ))
               (`alphapoints
                {	tablepath:(-2_ .j.v),`labels
   			table: ` . tablepath
   			if[~#table[`Label]; :()]
   			table[`Label]:table[`Label]@order:<table[`Label]
   			ptspath:(-2_ tablepath),`points
   			pts:` . ptspath
   			pts:.+(!pts;(,*pts[]),(1_ pts[])@order)
   			.[`;tablepath;:;table]
   			.[`;ptspath;:;pts]
   			}
                .,(`j
                   .((`l;"<html><div align=center>Alphabetize&nbsp&nbsp<br>Points</html>";)
                     (`c;`button;)
                     (`wy;0.2;)
                     (`valign;`c;)
                     (`e;0;))
                   ))
               (`LASTADDLPTSLAB;;)
               (`undolastlabel
                {	if[LASTADDLPTSLAB~_n; :()]
   			tablepath:(-2_ .j.v),`labels
   			table: ` . tablepath
   			if[~#table[`Label]; :()]
   			table[`Label]:LASTADDLPTSLAB
   			.[`;tablepath;:;table]
   			LASTADDLPTSLAB::` . .k.PATHTOADDLPTSLABELS
   			}
                .,(`j
                   .((`l;"<html><div align=center>Undo Last<br>Label Operation</html>";)
                     (`c;`button;)
                     (`wy;0.2;)
                     (`valign;`c;)
                     (`e;0;))
                   ))
               (`newf;;)
               (`r;;)
               (`c;;)
               (`relab;;)
               (`autolabel
                {		// params
   			ptoe:.5 / percent to explain - must explain at least this percent of current alloc to add label
   			ptog:.9 / percent to get - keeps adding labels until it gets to at least this percent
   			// end params
   			tablepath:(-2_ .j.v),`labels
   			table: ` . tablepath
   			if[~#table[`Label]; :()]
			ptspath:(-2_ tablepath),`points
   			pts:` . ptspath
   			asscl:$*pts[]
   			if[~#asscl; :()]
   			/LASTADDLPTSLAB::` . .k.PATHTOADDLPTSLABELS
   			pfn:{,($_ .5+100*+/x@y),"% "}
   			pfnv:{,($_ .5+100*x),"% "}
   			ssr_:{_ssr[x;"_";" "]}
   			dlb_:{:[|/("_";" ")~\:*|x;-1 _ x;x]}
   			jsd_:{:[1<#`$x;-1 _ ,/x,\:" ";,/x]}
   			caps:"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
   			lows:"abcdefghijklmnopqrstuvwxyz"
   			num:"0123456789"
   			reo:{[x;lows;num]
   			  mfn:{&+/x ~/:\: *:'y}[;x]
   			  wn:mfn[num]
   			  wl:mfn[lows]
   			  no:(!#x) _di wn,wl
   			  x@no,wn,wl}[;lows;num]
   			rdupe:{({[x;y]:[|/">" _in/: _ssr[;x@y;">"]'[x _di y];_n;x@y]}[x]'[!#x]) _dv _n}
   			reolen:{x@>#:'x}
   			break2:{[ci;a;caps;num;lows]
   			  c::oc:a@ci
   			  r::_n
   			  vld:caps,num
   			  iffn:{[t;ad] :[|/">" _in/: _ssr[;t;">"]'[ad];1;0]}[;a _di ci]
   			  dofn:{[t;tk]newf::1; r::r,,t; c::tk _ c}
   			  ifdofn:{[t;tk]if[iffn[t];dofn[t;tk]]}
   			  while[1<tk:#c
   			    while[tk>1
   			      t:tk#c
   			      newf::0
   			      if[~"_"=frt:*|t
   			      if[tk>2
   			        if[(|/num ~\: ft)|(~|/num ~\: frt:*|t)&|/caps ~\: ft:*t
   			          cando:1
   			          if[|/vld ~\: frt
   			            if[~(tk=#c)|"_"=*|(1+tk)#c
   			              cando:0
   			              ]
   			            ]
   			          if[|/lows ~\: frt
   			            if[~tk=#c
   			              pfct:1+tk
   			              pfrt:*|pfct#c
   			              if[|/lows ~\: pfrt
   			                cando:0
   			                ]
   			              if["_"=pfrt
   			                pfct+:1
   			                pfrt:*|pfct#c
   			                ]
   			              if[(|/num ~\: ft)&|/num ~\: pfrt
   			                cando:0
   			                ]
   			              ]
   			            ]
   			          if[cando; ifdofn[t;tk]]
   			          ]
   			        ]
   			      if[~newf
   			        if[&/|/'caps ~\:/: t
   			          ifdofn[t;tk]
   			          ]
   			        ]
   			        ]
   			      tk::[newf;0;tk-1]
   			      ]
   			      c:::[newf;c;1 _ c]
   			    ]
   			  r::r _dv _n
   			  :[#r;r;,oc]}[;asscl;caps;num;lows]
   			breakup:{[x;flg]
                          locs:&+/(" ";"_")=\:x
                          if[~#locs;::[flg;,_n;,x]]
                          ix:(1_ {(?(*x),y _dvl x;y _dvl *x)}\[(!0;!0);!:'locs,#x])[;1]
                          (0,(-1+#ix)#1) _' x@ix}
   			bspc:breakup[;1]'asscl
   			/nonm:bspc _di' &:',/'|/'''num~\:/:/:/:{,:'*:'x}'[bspc]
   			nonc:bspc _di' &:'~,/'|/'''caps~\:/:/:/:{,:'*:'x}'[bspc]
   			broken:break2'[!#asscl]
   			nols:dlb_''broken
   			fb:?:'nols,'nonc
   			us:?,/fb
   			us:?asscl,us
   			/map:us _in\:/: fb
   			map:+{">" _in/: _ssr[;y;">"]'[x]}[asscl]'[us]
   			em:&:'+map
   			///coloring
   			corder:#:'em
   			corder:@[corder;&1=corder;:;1000]
   			corder:@[corder;&|/num~/:\:*:'us;:;500]
   			fcorder:corder+1000-#:'us
   			groupfn:{t:x[0]
   			  x[0]:x[0] _dvl y
   			  if[~t~x[0]
   			    x[1],:,.C.intersection[t;y]
   			    ]
   			  x}
   			groups:(groupfn/[(!#asscl;());em@<fcorder])@1
   			cfn:{y*! _ x%y}[360]
   			bcolors:?,/cfn'[120 60 30]
   			ctbcolors:#bcolors
   			ctbcolors#100
   			sats:,/ctbcolors#/:100 50 75
   			hues:,/3#,bcolors
   			huesat:+(,hues),,sats
   			usehuesat:(#groups)#huesat
   			lite:{[s;e;c]:[c=1;,_ (s+e)%2;c=2;_ s+(1+!2)*(e-s)%3; _ s+(!c)*(e-s)%(c-1)]}[10;80]'[#:'groups]
   			usehsl:,/usehuesat,/:'lite
   			ordhsl:usehsl@<,/groups
   			scaledordhsl:ordhsl%\:(360;100;100)
   			hsltorgb:{[h;s;l]
   			  v::[~l>.5;l*s+1;l+s-l*s]
   			  rgb:(l;l;l)
   			  if[v>0
   			    m:l+l-v
   			    sv:(v-m)%v
   			    h*:6
   			    s:_ h
   			    fract:h-s
   			    vsf:v*sv*fract
   			    m1:m+vsf
   			    m2:v-vsf
   			    rgb::[s=0; (v;m1;m)
   				  s=1; (m2;v;m)
   			    	  s=2; (m;v;m1)
   				  s=3; (m;m2;v)
   			          s=4; (m1;m;v)
   			          s=5; (v;m;m2)
   			          rgb]
   			    ]
   			  :(rgb[0];rgb[1];rgb[2])}
   			unfmtrgb:_ .5+255*hsltorgb .' scaledordhsl
   			fmtrgb:+/'(1000000 1000 1) */: unfmtrgb
   			/// end coloring
   			expl:{y*+/x}[;ptoe]
   			relab::{[a;orig;asscl;map;em;tp]
   			  if[#loc:&tp<a; :ssr_@,/pfn[a;loc],asscl@loc]
   			  sumover:+/a*map
   			  c:cp:#pl:&~expl[a]>sumover
   			  r:""
   			  do[c
   			    .C.n_choose_k[cp;c]
   			    try:pl@.C.n_choose_k[cp;c]
   			    ix:{.C.intersection/[x;y]}[!#a]'[em@try]
   			    if[~expl[a]>max:|/sov:+/'a@/:ix
   			      loc:*&max=sov
   			      tr:jsd_@?breakup[jsd_@reo@rdupe@us@try@loc;0]
   			      if[">"~*orig
   			        if[#&"<"=_ssr[orig;tr;"<"]
   			          tr,:" Other"
   			          ]
   			        ]
   			      r,:dlb_@ssr_@,/pfnv[max],tr
   			      sa:+/ta:@[a;ix@loc;:;0.]
   			      if[sa>(1-tp)
   			        snd::[">"~*orig;orig,tr;">",tr]
   			        rn:relab[ta;snd]
   			        if[~rn~snd
   			          r,:"; ",rn
   			          ]
   			        ]
   			      :r
   			      ]
   			    c-:1
     			  ]
   			  :orig}[;;asscl;map;em;ptog]
   			table[`Label]:`$relab'[1_ pts[];$table[`Label]]
   			.[`;tablepath;:;table]
   			}
                .,(`j
                   .((`l;"<html><div align=center>Perform<br>AutoLabel</html>";)
                     (`c;`button;)
                     (`wy;0.2;)
                     (`valign;`c;)
                     (`e;0;))
                   ))
               (`fillver

                .,(`j
                   .((`c;`panel;)
                     (`anchor;`n;)
                     (`border;0;)
                     (`wy;0.8;))
                   )))
             .,(`j
                .((`a
                   `resetlabels `autolabel
                   )
                  (`fill;`v;)
                  (`anchor;`nw;)
                  (`c;`panel;)
                  (`border;0;)
                  (`wx;1e-010;))
                ))
            (`fillver

             .,(`j
                .((`c;`panel;)
                  (`anchor;`n;)
                  (`border;0;)
                  (`wy;0.0;))
                )))
          .,(`j
             .((`l;`"Point Labels";)
               (`c;`panel;)
               (`a
                (`labels `buttons
                 `fillver)
                )
               (`wy;0.2;))
             ))
         (`points
          .((`Asset_Class
             `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `Government_10_20 `Government_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `US_Stock
             )
            (`Pt_1
             0.01 0.02 0.03 0.04 0.05 0.06 0.79 0 0 0 0 0
             )
            (`Pt_2
             0 0 0 0 0 0 0 0.25 0.25 0.25 0.25 0
             )
            (`Pt_3
             0 0.1 0.1 0.2 0.2 0.2 0.2 0 0 0 0 0
             )
            (`Pt_4
             1 0 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Pt_5
             0 1 0 0 0 0 0 0 0 0 0 0.0
             )
            (`Pt_6
             0 0 1 0 0 0 0 0 0 0 0 0.0
             )
            (`Pt_7
             0 0 0 1 0 0 0 0 0 0 0 0.0
             )
            (`Pt_8
             0 0 0 0 1 0 0 0 0 0 0 0.0
             )
            (`Pt_9
             0 0 0 0 0 1 0 0 0 0 0 0.0
             )
            (`Pt_10
             0 0 0 0 0 0 1 0 0 0 0 0.0
             )
            (`Pt_11
             0 0 0 0 0 0 0 1 0 0 0 0.0
             )
            (`Pt_12
             0 0 0 0 0 0 0 0 1 0 0 0.0
             )
            (`Pt_13
             0 0 0 0 0 0 0 0 0 1 0 0.0
             )
            (`Pt_14
             0 0 0 0 0 0 0 0 0 0 1 0.0
             )
            (`Pt_15
             0 0 0 0 0 0 0.25 0.25 0.25 0.25 0 0
             ))
          .((`j
             .((`c;`table;)
               (`l;`"Point Allocations";)
               (`p
                .((`Asset_Class;`"Unspecified ...";)
                  (`Pt_1;0.0;)
                  (`Pt_2;0.0;)
                  (`Pt_3;0.0;)
                  (`Pt_4;0.0;)
                  (`Pt_5;0.0;)
                  (`Pt_6;0.0;)
                  (`Pt_7;0.0;)
                  (`Pt_8;0.0;)
                  (`Pt_9;0.0;)
                  (`Pt_10;0.0;)
                  (`Pt_11;0.0;)
                  (`Pt_12;0.0;)
                  (`Pt_13;0.0;)
                  (`Pt_14;0.0;)
                  (`Pt_15;0.0;))
                )
               (`e
                .((`Asset_Class;0;)
                  (`Pt_1;0;)
                  (`Pt_2;0;)
                  (`Pt_3;0;)
                  (`Pt_4;0;)
                  (`Pt_5;0;)
                  (`Pt_6;0;)
                  (`Pt_7;0;)
                  (`Pt_8;0;)
                  (`Pt_9;0;)
                  (`Pt_10;0;)
                  (`Pt_11;0;)
                  (`Pt_12;0;)
                  (`Pt_13;0;)
                  (`Pt_14;0;)
                  (`Pt_15;0;)
                  (`Pt_16;0;)
                  (`Pt_17;0;)
                  (`Pt_18;0;)
                  (`Pt_19;0;)
                  (`Pt_20;0;)
                  (`Pt_21;0;)
                  (`Pt_22;0;)
                  (`Pt_23;0;)
                  (`Pt_24;0;)
                  (`Pt_25;0;)
                  (`Pt_26;0;)
                  (`Pt_27;0;)
                  (`Pt_28;0;)
                  (`Pt_29;0;)
                  (`Pt_30;0;)
                  (`Pt_31;0;)
                  (`Pt_32;0;)
                  (`Pt_33;0;)
                  (`Pt_34;0;)
                  (`Pt_35;0;)
                  (`Pt_36;0;)
                  (`Pt_37;0;)
                  (`Pt_38;0;)
                  (`Pt_39;0;)
                  (`Pt_40;0;)
                  (`Pt_41;0;)
                  (`Pt_42;0;)
                  (`Pt_43;0;)
                  (`Pt_44;0;)
                  (`Pt_45;0;)
                  (`Pt_46;0;)
                  (`Pt_47;0;)
                  (`Pt_48;0;)
                  (`Pt_49;0;)
                  (`Pt_50;0;)
                  (`Pt_51;0;)
                  (`Pt_52;0;)
                  (`Pt_53;0;)
                  (`Pt_54;0;)
                  (`Pt_55;0;)
                  (`Pt_56;0;)
                  (`Pt_57;0;)
                  (`Pt_58;0;)
                  (`Pt_59;0;)
                  (`Pt_60;0;)
                  (`Pt_61;0;)
                  (`Pt_62;0;)
                  (`Pt_63;0;)
                  (`Pt_64;0;)
                  (`Pt_65;0;)
                  (`Pt_66;0;)
                  (`Pt_67;0;)
                  (`Pt_68;0;)
                  (`Pt_69;0;)
                  (`Pt_70;0;)
                  (`Pt_71;0;)
                  (`Pt_72;0;)
                  (`Pt_73;0;)
                  (`Pt_74;0;)
                  (`Pt_75;0;)
                  (`Pt_76;0;)
                  (`Pt_77;0;)
                  (`Pt_78;0;)
                  (`Pt_79;0;)
                  (`Pt_80;0;)
                  (`Pt_81;0;)
                  (`Pt_82;0;)
                  (`Pt_83;0;)
                  (`Pt_84;0;)
                  (`Pt_85;0;)
                  (`Pt_86;0;)
                  (`Pt_87;0;)
                  (`Pt_88;0;)
                  (`Pt_89;0;)
                  (`Pt_90;0;)
                  (`Pt_91;0;)
                  (`Pt_92;0;)
                  (`Pt_93;0;)
                  (`Pt_94;0;)
                  (`Pt_95;0;)
                  (`Pt_96;0;)
                  (`Pt_97;0;)
                  (`Pt_98;0;)
                  (`Pt_99;0;)
                  (`Pt_100;0;))
                )
               (`f
                .((`Asset_Class;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
                  (`Pt_1;7.4;)
                  (`Pt_2;7.4;)
                  (`Pt_3;7.4;)
                  (`Pt_4;7.4;)
                  (`Pt_5;7.4;)
                  (`Pt_6;7.4;)
                  (`Pt_7;7.4;)
                  (`Pt_8;7.4;)
                  (`Pt_9;7.4;)
                  (`Pt_10;7.4;)
                  (`Pt_11;7.4;)
                  (`Pt_12;7.4;)
                  (`Pt_13;7.4;)
                  (`Pt_14;7.4;)
                  (`Pt_15;7.4;))
                )
               (`clbg
                .,(`Asset_Class;192192192;)
                )
               (`bg
                .,(`Asset_Class;217217217;)
                )
               (`fixed;1;)
               (`popup
                .((`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`async;2;)
                   ))
               (`g
                .((`Pt_1;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_2;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_3;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_4;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_5;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_6;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_7;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_8;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_9;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_10;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_11;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_12;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_13;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_14;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
                  (`Pt_15;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};))
                )
               (`u
                .((`Pt_1;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_2;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_3;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_4;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_5;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_6;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_7;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_8;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_9;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_10;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_11;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_12;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_13;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_14;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Pt_15;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`s
                ,(`Pt_2;0)
                .()))
             )
            (`V;{[x]
     r:()
     if[#locs:&~1=sums:+/'vals:1_ @[x;_n]
       /pathtolabels:`k`Main`Input`addlpts`labelpanel`labels
       r,:,(1;("Allocations do not sum to 1.0 for the following additional points:<br>",-4_ _ssr[,/(($(1_ !x)@locs),\:" - Current Sum = "),'($sums@locs),\:"<br>";"_";" "]))
       ]
     f:{[x;y;z]
       if[#idenlocs:(&&/'z=/:x) _dv y
         :("Pt ",($y)," is identical to ",-2_ ,/("Pt ",/:$idenlocs),\:", ")
         ]
       :()}
     if[#iden:(f[vals]'[!#vals;vals]) _dv ()
       r,:,(1;("Additional Points cannot repeat:<br>",-4_ ,/iden,\:"<br>"))
       ]
     mins:.k[`Main;`Input;`Standard_Parameters;`Asset_Classes;`Minimum_Value]
     lessmin:vals<\:mins
     maxs:.k[`Main;`Input;`Standard_Parameters;`Asset_Classes;`Maximum_Value]
     biggmax:vals>\:maxs
     violations:lessmin+biggmax
     violocs:&|/'violations
     violocs:violocs _dvl locs / delete locations that are not valid
     if[#violocs
       vioclasses:x[`Asset_Class]@/:&:'violations@violocs
       strvioclasses:-2 _' ,/'($vioclasses),\:\:", "
       r,:,(0;("Individual Minimum Value and Maximum Value Allocation Constraints are ignored for the following Additional Points which violate them:<br>",-4_ _ssr[,/((($(1_ !x)@violocs),\:" - Violates Constraints on Classes: "),'strvioclasses),\:"<br>";"_";" "]))
       ]
     :[~#r; _n; r]};))))
       .,(`j
          .((`c;`panel;)
            (`l;`"Additional Points";))
          ))
      (`MultiClass_Constraints
       .((`constraints
          `Constraint_1 `Constraint_2 `Constraint_3 `Constraint_4 `Constraint_5 `Constraint_6 `Constraint_7 `Constraint_8 `Constraint_9 `Constraint_10
          )
         (`Max_and_Min
          .((`Constraint_1
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             )
            (`Constraint_2
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             )
            (`Constraint_3
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             )
            (`Constraint_4
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             )
            (`Constraint_5
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             )
            (`Constraint_6
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             )
            (`Constraint_7
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             )
            (`Constraint_8
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             )
            (`Constraint_9
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             )
            (`Constraint_10
             .((`Maximum;0.0;)
               (`Minimum;0.0;))
             ))
          .((`j
             .((`c;`Cross;)
               (`f;7.4;)
               (`g;{ / always produces float
  if[~-3=4:x;x*:]
  v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
  :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`u;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
               (`e
                .((`Constraint_1;0;)
                  (`Constraint_2;0;)
                  (`Constraint_3;0;)
                  (`Constraint_4;0;)
                  (`Constraint_5;0;)
                  (`Constraint_6;0;)
                  (`Constraint_7;0;)
                  (`Constraint_8;0;)
                  (`Constraint_9;0;)
                  (`Constraint_10;0;))
                )
               (`popup
                .((`Cut;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`cut;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste_Transpose;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste_transpose;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`ne
                      ((,`Cut
                        ,`Copy
                        ,`Copy_All
                        ,`Paste
                        ,`Paste_Transpose)
                       0 0 1 0 0)
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
               (`s
                ,`Constraint_3 `Minimum
                .()))
             )
            (`V;{:[(`Optimize=.k[`Main;`Input;`Standard_Parameters;`Controls;`Controls;`Mode])&#ix:&x[;`Maximum]<x[;`Minimum];(1;"Multi-Class Constraints with Maximum less than Minimum:",,/" ",/:$(!x)@ix)]};)))
         (`Factors
          .((`Asset_Class
             0#`
             .,(`V;{
  r:()
  if[`Optimize=.k[`Main;`Input;`Standard_Parameters;`Controls;`Controls;`Mode]
    vc:?.k[`Main;`Input;`Standard_Parameters;`Asset_Classes;`Asset_Class]
    if[|/~x _lin vc; r,:,(1;"Multi-Class Constraints cannot reference an Asset Class that is not included in Standard_Parameters / Asset_Classes")]
    if[(#x)&~`None=.k[`Main;`Input;`Standard_Parameters;`Target;`Tolerance]; r,:,(0;"Tolerances may cause Multi-Class Constraints to become violated over the optimization horizon")]
    ]
  r};))
            (`Constraint_1;0#0.0;)
            (`Constraint_2;0#0.0;)
            (`Constraint_3;0#0.0;)
            (`Constraint_4;0#0.0;)
            (`Constraint_5;0#0.0;)
            (`Constraint_6;0#0.0;)
            (`Constraint_7;0#0.0;)
            (`Constraint_8;0#0.0;)
            (`Constraint_9;0#0.0;)
            (`Constraint_10;0#0.0;))
          .,(`j
             .((`c;`Table;)
               (`cell
                .,(`Asset_Class
                   .((`c;`combo;)
                     (`o
                      `"Unspecified ..." `Bonds_Corp `Bonds_Corp_A `Bonds_Corp_AA `Bonds_Corp_AAA `Bonds_Corp_AAA_00_05 `Bonds_Corp_AAA_05_10 `Bonds_Corp_AAA_10_20 `Bonds_Corp_AAA_20_up `Bonds_Corp_AA_00_05 `Bonds_Corp_AA_05_10 `Bonds_Corp_AA_10_20 `Bonds_corp_AA_20_up `Bonds_Corp_A_00_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `Bonds_Corp_BBB `Bonds_Corp_BBB_00_05 `Bonds_Corp_BBB_05_10 `Bonds_Corp_BBB_10_20 `Bonds_Corp_BBB_20_up `US_Stock `MBS `Government_00_05 `Government_05_10 `Government_10_20 `Government_20_up `Government_00_01 `Government_01_03 `Government_03_05 `Government_05_07 `Government_07_10 `All_Assets `ABS `CMBS `Private_Placement `Cash `US_HDiv_Equity `Structured
                      ))
                   )
                )
               (`f
                .((`Constraint_1;7.4;)
                  (`Constraint_2;7.4;)
                  (`Constraint_3;7.4;)
                  (`Constraint_4;7.4;)
                  (`Constraint_5;7.4;)
                  (`Constraint_6;7.4;)
                  (`Constraint_7;7.4;)
                  (`Constraint_8;7.4;)
                  (`Constraint_9;7.4;)
                  (`Constraint_10;7.4;))
                )
               (`p
                .((`Asset_Class;`"Unspecified ...";)
                  (`Constraint_1;0.0;)
                  (`Constraint_2;0.0;)
                  (`Constraint_3;0.0;)
                  (`Constraint_4;0.0;)
                  (`Constraint_5;0.0;)
                  (`Constraint_6;0.0;)
                  (`Constraint_7;0.0;)
                  (`Constraint_8;0.0;)
                  (`Constraint_9;0.0;)
                  (`Constraint_10;0.0;))
                )
               (`g
                .((`Constraint_1;9.6$;)
                  (`Constraint_2;9.6$;)
                  (`Constraint_3;9.6$;)
                  (`Constraint_4;9.6$;)
                  (`Constraint_5;9.6$;)
                  (`Constraint_6;9.6$;)
                  (`Constraint_7;9.6$;)
                  (`Constraint_8;9.6$;)
                  (`Constraint_9;9.6$;)
                  (`Constraint_10;9.6$;))
                )
               (`u
                .((`Constraint_1;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Constraint_2;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Constraint_3;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Constraint_4;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Constraint_5;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Constraint_6;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Constraint_7;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Constraint_8;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Constraint_9;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};)
                  (`Constraint_10;{:[~y _in (0n;0N);	("";y)
                   y~0n;		("Input should be numeric";x)
                   y~0N;		("Input should be integer-valued";x)]};))
                )
               (`e
                .((`Asset_Class;0;)
                  (`Constraint_1;0;)
                  (`Constraint_2;0;)
                  (`Constraint_3;0;)
                  (`Constraint_4;0;)
                  (`Constraint_5;0;)
                  (`Constraint_6;0;)
                  (`Constraint_7;0;)
                  (`Constraint_8;0;)
                  (`Constraint_9;0;)
                  (`Constraint_10;0;))
                )
               (`popup
                .((`Insert;{if[#s:of[c:name.c v;`Rows;,v:ad -2_.j.v];of[c;`ins`row;(v;*s;#s)];fire_f[`Insert;`t;v;()]]};)
                  (`Append;{of[c;`app`row;(v;1|#of[c:name.c v;`Rows;,v:ad -2_.j.v])];fire_f[`Append;`t;v;()];};)
                  (`Delete;{if[#s:of[c:name.c v;`Rows;,v:ad -2_.j.v];of[c;`del`row;(v;s)];fire_f[`Delete;`t;v;()]]};)
                  (`s;" ";)
                  (`Cut;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`cut;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                  (`Paste_Transpose;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste_transpose;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];))
                .,(`j
                   .,(`ne
                      ((,`Insert
                        ,`Append
                        ,`Delete
                        ,`s
                        ,`Cut
                        ,`Copy
                        ,`Copy_All
                        ,`Paste
                        ,`Paste_Transpose)
                       0 1 0 0 0 0 1 0 0)
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
             )))
       .,(`j
          .((`c;`panel;)
            (`a
             `Max_and_Min `Factors
             )
            (`l;`"Multi-Class Constraints";))
          ))
      (`Updates
       `var_to_std `add_mgmt_fee `reset_outcome `feb_11_2012 `stddev_rename `evo_files `pre_pvde_dff `value_to_fixed `average_to_mean `addrbctaxfactors `which_optimizer `pre_addlpts_dff `prn_8534 `prn_8534b
       )
      (`Version;"6.0.99.99";))
    .((`j
       .((`c;`tab;)
         (`a
          `Standard_Parameters `MultiClass_Constraints `addlpts `User_Value_Inputs_and_Discounting `imr
          )
         (`border;0;)
         (`tab;`Standard_Parameters;.()))
       )
      (`t;;))))
 .,(`j
    .,(`c;`panel;)
    ))

p:asd[0]
p.:asd[1]

p..j.l:"IO Post-Opt Parameter Input Tab 12-31-2012"
p..j.loc:(0;0)
p..j.xy:1440 900

.j.Java{
  .j.c `p
}

p..j.close:{_exit 0}
p..j.z: {
  if[1~.k[`autoExit];_exit 0]
  }