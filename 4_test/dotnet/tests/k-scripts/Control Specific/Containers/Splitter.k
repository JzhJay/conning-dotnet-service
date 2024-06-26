\l main\j\j

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
   (`Module
    ,`GEMS
    .,(`j
       .((`l;"Module";)
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
       ))
   (`Economy
    ` `CH `DE `GB `US
    .,(`j
       .((`l;"Economy";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Numerator_Currency
    ` `CHF `EUR `GBP `USD
    .,(`j
       .((`l;"Numerator_Currency";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Grouping
    ` `Common_Stock_Index `Foreign_Exchange `Macro_Economy `Spot_Curve `Yield_Curve
    .,(`j
       .((`l;"Grouping";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`BondModule
    ` `Zero_Curve
    .,(`j
       .((`l;"BondModule";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Index
    ` `Construction `Consumer_Prices `Hospital `Motors `New_Vehicle `Professional `Wages
    .,(`j
       .((`l;"Index";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`StockModule
    ` `Large_Cap
    .,(`j
       .((`l;"StockModule";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Field
    ` `Dividend_Yield `GDP_Rate `Levels `Price `Rates `Unemployment_Rate `Yield
    .,(`j
       .((`l;"Field";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Denominator_Currency
    ` `EUR `GBP `USD
    .,(`j
       .((`l;"Denominator_Currency";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Projection
    ` `Base
    .,(`j
       .((`l;"Projection";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Type
    ` `Annual `Level `Normalized `Rate `YY_Annual
    .,(`j
       .((`l;"Type";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Common_Stock_Index
    ` `CH_Large_Cap `DE_Large_Cap `GB_Large_Cap `US_Large_Cap
    .,(`j
       .((`l;"Common_Stock_Index";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Item
    ` `Annual_Nominal_Yield `Annual_Real_Yield `Continuous_Nominal_Yield `Continuous_Real_Yield `Discount_to_Start `Dividend_Yield `GDP_Growth_Rate `GDP_Level `Inflation_Level `Inflation_Level_Expectation `Inflation_Level_Expectation_Normalized `Inflation_Level_Fine_Expectation `Inflation_Level_Fine_Expectation_Normalized `Inflation_Rate `Inflation_Rate_Forward_Expectation `Inflation_Rate_Spot_Expectation `Nominal_Annual `Nominal_Price `Nominal_SA `Price `Rate `Real_Annual `Real_Price `Real_SA `SA_Nominal_Yield `SA_Real_Yield `Unemployment_Rate
    .,(`j
       .((`l;"Item";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Class
    ` `Treasury
    .,(`j
       .((`l;"Class";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Frequency
    ` `Sim_Frequency
    .,(`j
       .((`l;"Frequency";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`Rating
    ` `Treasury
    .,(`j
       .((`l;"Rating";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14"
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
       ))
   (`FTime
    ` `f0 `f1 `f2 `f3 `f4 `f5 `f6 `f7 `f8 `f9 `f10 `f11 `f12 `f13 `f14 `f15 `f16 `f17 `f18 `f19 `f20 `f21 `f22 `f23 `f24 `f25 `f26 `f27 `f28 `f29 `f30 `f31 `f32 `f33 `f34 `f35 `f36 `f37 `f38 `f39 `f40 `f41 `f42 `f43 `f44 `f45 `f46 `f47 `f48 `f49 `f50 `f51 `f52 `f53 `f54 `f55 `f56 `f57 `f58 `f59 `f60 `f61 `f62 `f63 `f64 `f65 `f66 `f67 `f68 `f69 `f70 `f71 `f72 `f73 `f74 `f75 `f76 `f77 `f78 `f79 `f80 `f81 `f82 `f83 `f84 `f85 `f86 `f87 `f88 `f89 `f90 `f91 `f92 `f93 `f94 `f95 `f96 `f97 `f98 `f99 `f100 `f101 `f102 `f103 `f104 `f105 `f106 `f107 `f108 `f109 `f110 `f111 `f112 `f113 `f114 `f115 `f116 `f117 `f118 `f119 `f120 `f121 `f122 `f123 `f124 `f125 `f126 `f127 `f128 `f129 `f130 `f131 `f132 `f133 `f134 `f135 `f136 `f137 `f138 `f139 `f140 `f141 `f142 `f143 `f144 `f145 `f146 `f147 `f148 `f149 `f150 `f151 `f152 `f153 `f154 `f155 `f156 `f157 `f158 `f159 `f160 `f161 `f162 `f163 `f164 `f165 `f166 `f167 `f168 `f169 `f170 `f171 `f172 `f173 `f174 `f175 `f176 `f177 `f178 `f179 `f180 `f181 `f182 `f183 `f184 `f185 `f186 `f187 `f188 `f189 `f190 `f191 `f192 `f193 `f194 `f195 `f196 `f197 `f198 `f199 `f200 `f201 `f202 `f203 `f204 `f205 `f206 `f207 `f208 `f209 `f210 `f211 `f212 `f213 `f214 `f215 `f216 `f217 `f218 `f219 `f220 `f221 `f222 `f223 `f224 `f225 `f226 `f227 `f228 `f229 `f230 `f231 `f232 `f233 `f234 `f235 `f236 `f237 `f238 `f239 `f240 `f241 `f242 `f243 `f244 `f245 `f246 `f247 `f248 `f249 `f250 `f251 `f252 `f253 `f254 `f255 `f256 `f257 `f258 `f259 `f260 `f261 `f262 `f263 `f264 `f265 `f266 `f267 `f268 `f269 `f270 `f271 `f272 `f273 `f274 `f275 `f276 `f277 `f278 `f279 `f280 `f281 `f282 `f283 `f284 `f285 `f286 `f287 `f288 `f289 `f290 `f291 `f292 `f293 `f294 `f295 `f296 `f297 `f298 `f299 `f300 `f301 `f302 `f303 `f304 `f305 `f306 `f307 `f308 `f309 `f310 `f311 `f312 `f313 `f314 `f315 `f316 `f317 `f318 `f319 `f320 `f321 `f322 `f323 `f324 `f325 `f326 `f327 `f328 `f329 `f330 `f331 `f332 `f333 `f334 `f335 `f336 `f337 `f338 `f339 `f340 `f341 `f342 `f343 `f344 `f345 `f346 `f347 `f348 `f349 `f350 `f351 `f352 `f353 `f354 `f355 `f356 `f357 `f358 `f359 `f360 `f361 `f362 `f363 `f364 `f365 `f366 `f367 `f368 `f369 `f370 `f371 `f372 `f373 `f374 `f375 `f376 `f377 `f378 `f379 `f380 `f381 `f382 `f383 `f384 `f385 `f386 `f387 `f388 `f389 `f390 `f391 `f392 `f393 `f394 `f395 `f396 `f397 `f398 `f399 `f400 `f401 `f402 `f403 `f404 `f405 `f406 `f407 `f408 `f409 `f410 `f411 `f412 `f413 `f414 `f415 `f416 `f417 `f418 `f419 `f420 `f421 `f422 `f423 `f424 `f425 `f426 `f427 `f428 `f429 `f430 `f431 `f432 `f433 `f434 `f435 `f436 `f437 `f438 `f439 `f440 `f441 `f442 `f443 `f444 `f445 `f446 `f447 `f448 `f449 `f450 `f451 `f452 `f453 `f454 `f455 `f456 `f457 `f458 `f459 `f460 `f461 `f462 `f463 `f464 `f465 `f466 `f467 `f468 `f469 `f470 `f471 `f472 `f473 `f474 `f475 `f476 `f477 `f478 `f479 `f480 `f481 `f482 `f483 `f484 `f485 `f486 `f487 `f488 `f489 `f490 `f491 `f492 `f493 `f494 `f495 `f496 `f497 `f498 `f499 `f500 `f501 `f502 `f503 `f504 `f505 `f506 `f507 `f508 `f509 `f510 `f511 `f512 `f513 `f514 `f515 `f516 `f517 `f518 `f519 `f520 `f521 `f522 `f523 `f524 `f525 `f526 `f527 `f528 `f529 `f530 `f531 `f532 `f533 `f534 `f535 `f536 `f537 `f538 `f539 `f540 `f541 `f542 `f543 `f544 `f545 `f546 `f547 `f548 `f549 `f550 `f551 `f552 `f553 `f554 `f555 `f556 `f557 `f558 `f559 `f560 `f561 `f562 `f563 `f564 `f565 `f566 `f567 `f568 `f569 `f570 `f571 `f572 `f573 `f574 `f575 `f576 `f577 `f578 `f579 `f580 `f581 `f582 `f583 `f584 `f585 `f586 `f587 `f588 `f589 `f590 `f591 `f592 `f593 `f594 `f595 `f596 `f597 `f598 `f599 `f600
    .,(`j
       .((`l;"FTime";)
         (`s;!0;)
         (`e;0;)
         (`bg
          `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
          )
         (`fg
          0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
          )
         (`font
          `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14" `"Dialog 0 14"
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
       ,`Simulation `Module `SubModule `Economy `Numerator_Currency `Grouping `BondModule `Index `StockModule `Field `Denominator_Currency `Projection `Type `Common_Stock_Index `Item `Class `Frequency `Rating `FTime
       )
      (`h;20;)
      (`font;`"Courier 0 14";)
      (`lfont;`"Dialog 0 12";))
    ))


p:.()
p..j.c: `panel
p..j.l: "Complex panels with draw issues"
p..j.xy: (500;500)
p..j.border: 1


p.split..j.c: `split
p.split..j.divweight: 0.25
/p.split..j.divsize: 10


p.split.left..j.l: "check box 2"
p.split.left: 0
p.split.left..j.c: `check
p.split.left..j.anchor: `w

p.split.right..j.c: `text
p.split.right: "Onions, carrots, and celery.
asdf
asdf
asdf
asdf
ddadf"
p.split.right..j.border: 1
p.split..j.wy:.j.NoExtraSpace

p.split2..j.c: `split
p.split2..j.dir: `v
p.split2..j.border: 0
p.split2..j.fill: `b
p.split2..j.divweight: .75


p.split2.left..j.c: `panel
p.split2.left.panel..j.c: `panel
/p.split2.left.panel.label: "Just a toolbar"
/p.split2.left.panel.label..j.c: `label

p.split2.left.panel.v: variableWindow[0]
p.split2.left.panel.v.: variableWindow[1]


/p.split2.left.text: "<html><body>
/<h1 align=\"center\">The html class</h1><hr>
/</body></html>"
/p.split2.left.text..j.c: `html
/p.split2.left.text..j.border: 0
/p.split2.left.text..j.e: 0
/p.split2.left.text..j.save: 0
/p.split2.left.text..j.echo: 0

p.split2.right: "Scallions, garlic, and ginger."
p.split2.right..j.c: `text
p.split2.right..j.wy: 0
p.split2.right..j.border: 1

p..j.close:{_exit 0}

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

