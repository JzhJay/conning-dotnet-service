rpt:(.((`o
    .((`OK
       {.j.stop'.j.w[];if[~apply[];r.[`j;`v]:1;attach[];hide_option[]];.j.go'.j.w[]}
       .,(`j
          .((`c;`button;)
            (`fill;`h;)
            (`async;2;))
          ))
      (`Apply
       {.j.stop'.j.w[];if[~apply[];detach[]];.j.go'.j.w[]}
       .,(`j
          .((`c;`button;)
            (`fill;`h;)
            (`async;2;))
          ))
      (`Cancel
       {.j.stop'.j.w[];revert_option[];:[Invalid|_n~.k.r`r;sexit 0;hide_option[]];.j.go'.j.w[]}
       .,(`j
          .((`c;`button;)
            (`fill;`h;)
            (`async;2;))
          ))
      (`o
       .((`view
          .((`Pivot
             1
             .,(`j
                .((`l;"";)
                  (`e;1;)
                  (`image;"Pivot64.gif";)
                  (`help;"Pivot";)
                  (`c;`togglebutton;)
                  (`group;`a;))
                ))
            (`Statistics
             0
             .,(`j
                .((`l;"";)
                  (`e;1;)
                  (`image;"Statistics64.gif";)
                  (`help;"Statistics";)
                  (`c;`togglebutton;)
                  (`group;`a;))
                ))
            (`Martingale
             0
             .,(`j
                .((`l;"";)
                  (`e;1;)
                  (`image;"Martingale64.gif";)
                  (`help;"Martingale";)
                  (`c;`togglebutton;)
                  (`group;`a;))
                )))
          .,(`j
             .((`c;`panel;)
               (`l;`View;)
               (`a
                ,`Pivot `Statistics `Martingale `
                ))
             ))
         (`discount
          .((`method
             `fixed
             .,(`j
                .((`ol
                   (`fixed `starting_yield_curve `path_specific_point
                    ("Fixed Discount Rate"
                     "Starting Yield Curve"
                     "Path Specific Point on Yield Curve"))
                   )
                  (`o
                   `fixed `starting_yield_curve `path_specific_point
                   )
                  (`c;`combo;)
                  (`l;`"Discounting Method";)
                  (`fill;`h;)
                  (`wy;0.0;))
                ))
            (`fixed
             .((`rate
                0.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;"Discount Rate (.01=1%)";)
                     (`fill;`h;)
                     (`f;6.4;))
                   ))
               (`economy
                `US
                .,(`j
                   .((`l;"Economy";)
                     (`c;`combo;)
                     (`o
                      `US `DE `GB `CH `AU `CA
                      )
                     (`ol
                      .((`US;`"United States (US)";)
                        (`DE;`"Germany (DE)";)
                        (`GB;`"Great Britain (GB)";)
                        (`CH;`"Switzerland (CH)";)
                        (`AU;`"Australia (AU)";)
                        (`CA;`"Canada (CA)";))
                      ))
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
                     (`l;"Additive Spread to Starting Yield Curve (.01=1%)";)
                     (`fill;`h;)
                     (`f;6.4;))
                   ))
               (`factor
                1.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;"Multiplicative Factor to Starting Yield Curve";)
                     (`fill;`h;)
                     (`f;6.4;))
                   ))
               (`economy
                `US
                .,(`j
                   .((`l;"Economy";)
                     (`c;`combo;)
                     (`o
                      `US `DE `GB `CH `AU `CA
                      )
                     (`ol
                      .((`US;`"United States (US)";)
                        (`DE;`"Germany (DE)";)
                        (`GB;`"Great Britain (GB)";)
                        (`CH;`"Switzerland (CH)";)
                        (`AU;`"Australia (AU)";)
                        (`CA;`"Canada (CA)";))
                      ))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`border;0;)
                  (`wy;0.0;)
                  (`a
                   `economy `spread `factor
                   ))
                ))
            (`path_specific_point
             .((`spread
                0.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;"Additive Spread to Path Specific Yield (.01=1%)";)
                     (`fill;`h;)
                     (`f;6.4;))
                   ))
               (`factor
                1.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;"Multiplicative Factor to Path Specific Yield";)
                     (`fill;`h;)
                     (`f;6.4;))
                   ))
               (`maturity
                1.0
                .,(`j
                   .((`c;`combo;)
                     (`l;`"Point on Yield Curve";)
                     (`o
                      -4 -3 -2 -1 0 0.25 0.5 0.75 1 1.25 1.5 1.75 2 2.25 2.5 2.75 3 3.25 3.5 3.75 4 4.25 4.5 4.75 5 5.25 5.5 5.75 6 6.25 6.5 6.75 7 7.25 7.5 7.75 8 8.25 8.5 8.75 9 9.25 9.5 9.75 10 10.25 10.5 10.75 11 11.25 11.5 11.75 12 12.25 12.5 12.75 13 13.25 13.5 13.75 14 14.25 14.5 14.75 15 15.25 15.5 15.75 16 16.25 16.5 16.75 17 17.25 17.5 17.75 18 18.25 18.5 18.75 19 19.25 19.5 19.75 20 20.25 20.5 20.75 21 21.25 21.5 21.75 22 22.25 22.5 22.75 23 23.25 23.5 23.75 24 24.25 24.5 24.75 25 25.25 25.5 25.75 26 26.25 26.5 26.75 27 27.25 27.5 27.75 28 28.25 28.5 28.75 29 29.25 29.5 29.75 30
                      )
                     (`ol
                      (-4 -3 -2 -1 0 0.25 0.5 0.75 1 1.25 1.5 1.75 2 2.25 2.5 2.75 3 3.25 3.5 3.75 4 4.25 4.5 4.75 5 5.25 5.5 5.75 6 6.25 6.5 6.75 7 7.25 7.5 7.75 8 8.25 8.5 8.75 9 9.25 9.5 9.75 10 10.25 10.5 10.75 11 11.25 11.5 11.75 12 12.25 12.5 12.75 13 13.25 13.5 13.75 14 14.25 14.5 14.75 15 15.25 15.5 15.75 16 16.25 16.5 16.75 17 17.25 17.5 17.75 18 18.25 18.5 18.75 19 19.25 19.5 19.75 20 20.25 20.5 20.75 21 21.25 21.5 21.75 22 22.25 22.5 22.75 23 23.25 23.5 23.75 24 24.25 24.5 24.75 25 25.25 25.5 25.75 26 26.25 26.5 26.75 27 27.25 27.5 27.75 28 28.25 28.5 28.75 29 29.25 29.5 29.75 30
                       `"Roll Forward Deflators Annual" `"Roll Forward Deflators Overnight" `"Overnight Deflators " `"Overnight Average " `"Overnight Rate" `"0.25 Years" `"0.50 Years" `"0.75 Years" `"1.00 Years" `"1.25 Years" `"1.50 Years" `"1.75 Years" `"2.00 Years" `"2.25 Years" `"2.50 Years" `"2.75 Years" `"3.00 Years" `"3.25 Years" `"3.50 Years" `"3.75 Years" `"4.00 Years" `"4.25 Years" `"4.50 Years" `"4.75 Years" `"5.00 Years" `"5.25 Years" `"5.50 Years" `"5.75 Years" `"6.00 Years" `"6.25 Years" `"6.50 Years" `"6.75 Years" `"7.00 Years" `"7.25 Years" `"7.50 Years" `"7.75 Years" `"8.00 Years" `"8.25 Years" `"8.50 Years" `"8.75 Years" `"9.00 Years" `"9.25 Years" `"9.50 Years" `"9.75 Years" `"10.00 Years" `"10.25 Years" `"10.50 Years" `"10.75 Years" `"11.00 Years" `"11.25 Years" `"11.50 Years" `"11.75 Years" `"12.00 Years" `"12.25 Years" `"12.50 Years" `"12.75 Years" `"13.00 Years" `"13.25 Years" `"13.50 Years" `"13.75 Years" `"14.00 Years" `"14.25 Years" `"14.50 Years" `"14.75 Years" `"15.00 Years" `"15.25 Years" `"15.50 Years" `"15.75 Years" `"16.00 Years" `"16.25 Years" `"16.50 Years" `"16.75 Years" `"17.00 Years" `"17.25 Years" `"17.50 Years" `"17.75 Years" `"18.00 Years" `"18.25 Years" `"18.50 Years" `"18.75 Years" `"19.00 Years" `"19.25 Years" `"19.50 Years" `"19.75 Years" `"20.00 Years" `"20.25 Years" `"20.50 Years" `"20.75 Years" `"21.00 Years" `"21.25 Years" `"21.50 Years" `"21.75 Years" `"22.00 Years" `"22.25 Years" `"22.50 Years" `"22.75 Years" `"23.00 Years" `"23.25 Years" `"23.50 Years" `"23.75 Years" `"24.00 Years" `"24.25 Years" `"24.50 Years" `"24.75 Years" `"25.00 Years" `"25.25 Years" `"25.50 Years" `"25.75 Years" `"26.00 Years" `"26.25 Years" `"26.50 Years" `"26.75 Years" `"27.00 Years" `"27.25 Years" `"27.50 Years" `"27.75 Years" `"28.00 Years" `"28.25 Years" `"28.50 Years" `"28.75 Years" `"29.00 Years" `"29.25 Years" `"29.50 Years" `"29.75 Years" `"30.00 Years")
                      )
                     (`fill;`h;))
                   ))
               (`economy
                `US
                .,(`j
                   .((`l;"Economy";)
                     (`c;`combo;)
                     (`o
                      `US `DE `GB `CH `AU `CA
                      )
                     (`ol
                      .((`US;`"United States (US)";)
                        (`DE;`"Germany (DE)";)
                        (`GB;`"Great Britain (GB)";)
                        (`CH;`"Switzerland (CH)";)
                        (`AU;`"Australia (AU)";)
                        (`CA;`"Canada (CA)";))
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
                  (`wy;1.0;))
                )))
          .,(`j
             .((`c;`panel;)
               (`l;`Discounting;)
               (`a
                `method `fixed `fill
                ))
             ))
         (`times
          .((`extra
             `ZERO `ALL `NONE `NONINSURANCE
             )
            (`indices
             0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80
             )
            (`labels
             `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
             )
            (`times
             (;;;`"2009Q4";`"2010Q1";`"2010Q2";`"2010Q3";`"2010Q4";`"2011Q1";`"2011Q2";`"2011Q3";`"2011Q4";`"2012Q1";`"2012Q2";`"2012Q3";`"2012Q4";`"2013Q1";`"2013Q2";`"2013Q3";`"2013Q4";`"2014Q1";`"2014Q2";`"2014Q3";`"2014Q4";`"2015Q1";`"2015Q2";`"2015Q3";`"2015Q4";`"2016Q1";`"2016Q2";`"2016Q3";`"2016Q4";`"2017Q1";`"2017Q2";`"2017Q3";`"2017Q4";`"2018Q1";`"2018Q2";`"2018Q3";`"2018Q4";`"2019Q1";`"2019Q2";`"2019Q3";`"2019Q4";`"2020Q1";`"2020Q2";`"2020Q3";`"2020Q4";`"2021Q1";`"2021Q2";`"2021Q3";`"2021Q4";`"2022Q1";`"2022Q2";`"2022Q3";`"2022Q4";`"2023Q1";`"2023Q2";`"2023Q3";`"2023Q4";`"2024Q1";`"2024Q2";`"2024Q3";`"2024Q4";`"2025Q1";`"2025Q2";`"2025Q3";`"2025Q4";`"2026Q1";`"2026Q2";`"2026Q3";`"2026Q4";`"2027Q1";`"2027Q2";`"2027Q3";`"2027Q4";`"2028Q1";`"2028Q2";`"2028Q3";`"2028Q4";`"2029Q1";`"2029Q2";`"2029Q3";`"2029Q4")
             .,(`j
                .((`ax
                   .((`Year
                      `"2009" `"2009" `"2009" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029"
                      )
                     (`Quarter
                      `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4
                      ))
                   )
                  (`c;`Pivot_;)
                  (`e;0;)
                  (`bg
                   `e `e `e `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
                   .())
                  (`border;0;)
                  (`wx;1.0;)
                  (`s;;)
                  (`sr;;)
                  (`sc;;)
                  (`S;;)
                  (`SR;;)
                  (`SC;;)
                  (`SRC;;)
                  (`a
                   (,`Year
                    ,`Quarter)
                   )
                  (`popup
                   .((`All;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`All;v;of[c;`all_;,v])]};)
                     (`None;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`None;v;())]};)
                     (`s0;" ";)
                     (`Only;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Only;v;of[c;`selected_;,v])]};)
                     (`Except;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Except;v;of[cl v;`all_;,v]_dvl of[c;`selected_;,v])]};)
                     (`s1;" ";)
                     (`With;{[x]C.Data_.With_v[x;ad -2_.j.v]};)
                     (`Without;{[x]C.Data_.Without_v[x;ad -2_.j.v]};)
                     (`In;{[x]c:cl v:ad -2_.j.v;s:of[c;`get_;,v];of[c;`set_;(`In;v;s@&s _lin of[c;`selected_;,v])]};)
                     (`s2;" ";)
                     (`Up;{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;<:)]};)
                     (`Down;{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;>:)]};)
                     (`s3;" ";)
                     (`Copy_Selection;{[x]c:cl v:ad -2_.j.v;of[c;`copy_;(c;v)]};)
                     (`Paste_Selection;{[x]c:cl v:ad -2_.j.v;of[c;`paste_;(c;v)]};)
                     (`s99;" ";)
                     (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Flip;{[w;junk].[`;w,`a;|:];fire_t w,`a}[`k `r `o `o `times `times. `j];)
                     (`Rows;{[w;junk]C.Axes.Swap_[w;::]}[`k `r `o `o `times `times. `j];)
                     (`Cols;{[w;junk]C.Axes.Swap_[w;|:]}[`k `r `o `o `times `times. `j];))
                   .,(`j
                      .,(`ne
                         ((,`All
                           ,`None
                           ,`s0
                           ,`Only
                           ,`Except
                           ,`s1
                           ,`With
                           ,`Without
                           ,`In
                           ,`s2
                           ,`Up
                           ,`Down
                           ,`s3
                           ,`Copy_Selection
                           ,`Paste_Selection
                           ,`Copy
                           ,`Copy_All
                           ,`s99
                           ,`Flip
                           ,`Rows
                           ,`Cols)
                          0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0)
                         )
                      ))
                  (`kk;{c:cl .j.v;the[c]'[`With_v`Without_v][|/,//of[c;`true;,.j.v]=`. jd[.j.v],`bg,.j.i][_n;.j.v]};)
                  (`krd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
                  (`rclbg
                   .((`Year
                      `w `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
                      )
                     (`Quarter
                      `w `w `w `scrollbarblue
                      ))
                   .())
                  (`rclkk;{c:cl .j.v;the[c]'[`With_v`Without_v][|/,//of[c;`true;,.j.v]=`. jd[.j.v],`bg,.j.i][_n;.j.v]};)
                  (`rclkrd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
                  (`alkrd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
                  (`albg;{:[(`a;*.j.i)~att[v;`S];0]};)
                  (`alfg;{:[(`a;*.j.i)~att[v;`S];`n]};)
                  (`kd;{.[`;jd[.j.v],`S;:;_n];{.[`;jd[.j.v],x;::]}'`alfg`albg;{.[`;jd[.j.v],x;:;()]}'`sr`sc;};)
                  (`alkd;{.[`;jd[.j.v],`S;:;(`a;*.j.i)];{.[`;jd[.j.v],x;::]}'`alfg`albg;{.[`;jd[.j.v],x;:;()]}'`sr`sc`s;};)
                  (`rclkd;{.[`;jd[.j.v],`S;:;(`rc;*.j.i)];{.[`;jd[.j.v],x;::]}'`alfg`albg;.[`;jd[.j.v],`s;:;()]};))
                ))
            (`accumulate
             .((`none
                1
                .,(`j
                   .((`c;`radiobutton;)
                     (`group;`a;)
                     (`e;1;)
                     (`anchor;`w;)
                     (`l;`None;))
                   ))
               (`ytd
                0
                .,(`j
                   .((`c;`radiobutton;)
                     (`group;`a;)
                     (`e;0;)
                     (`anchor;`w;)
                     (`l;`"Year-to-Date";))
                   ))
               (`std
                0
                .,(`j
                   .((`c;`radiobutton;)
                     (`group;`a;)
                     (`e;0;)
                     (`anchor;`w;)
                     (`l;`"Simulation-to-Date";))
                   ))
               (`range
                0
                .,(`j
                   .((`c;`radiobutton;)
                     (`group;`a;)
                     (`e;0;)
                     (`anchor;`w;)
                     (`l;`"Selected Range";))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`l;`Accumulate;)
                  (`wy;0.0;))
                ))
            (`derivative
             .((`raw
                1
                .,(`j
                   .((`c;`radiobutton;)
                     (`group;`b;)
                     (`l;`None;)
                     (`e;0;)
                     (`anchor;`w;))
                   ))
               (`change
                0
                .,(`j
                   .((`c;`radiobutton;)
                     (`group;`b;)
                     (`l;`Change;)
                     (`e;0;)
                     (`anchor;`w;))
                   ))
               (`percentchange
                0
                .,(`j
                   .((`c;`radiobutton;)
                     (`group;`b;)
                     (`l;`"% Change";)
                     (`e;0;)
                     (`anchor;`w;))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`a
                   `raw `change `percentchange
                   )
                  (`l;`Derivative;)
                  (`wy;0.0;))
                ))
            (`scale
             .((`annualize
                0
                .,(`j
                   .((`c;`check;)
                     (`l;`"Annualize Values";)
                     (`e;0;)
                     (`anchor;`w;))
                   ))
               (`discount
                0
                .,(`j
                   .((`c;`check;)
                     (`l;`"Discount to Simulation Start";)
                     (`e;0;)
                     (`anchor;`w;))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`a
                   `annualize `discount
                   )
                  (`l;`Scale;)
                  (`wy;0.0;))
                ))
            (`fill

             .,(`j
                .((`c;`panel;)
                  (`border;0;)
                  (`wy;1.0;))
                )))
          .((`V;{[x;y]
   n:+/U.True=x.times..j.bg
   if[(`ZERO _in x.extra)&(n>0)&(U.True=x.times..j.bg[*&~x.times~'_n])&~x.derivative.raw
     :("Please don't select &0 with derivative operation requested.";*x.labels)]
   :[x.accumulate.range
     :[2=n;_n;"Please select exactly two periods, start and end of range."]
     :[0<n;_n;"Please select at least one period."] ]};)
            (`j
             .((`l;`Times;)
               (`c;`panel;)
               (`a
                (`accumulate `times
                 `derivative `times
                 `scale `times
                 `fill `times)
                ))
             )))
         (`paths
          .((`flags
             .((`ALL
                {(`.(-2_.j.v),`paths.`j`Set_)[`All;(-2_.j.v),`paths;_n]}
                .,(`j
                   .((`l;`ALL;)
                     (`fill;`h;)
                     (`c;`button;)
                     (`wy;0.0;))
                   ))
               (`DISTRESS
                {[x;y;z]
    m:`.(-2_.j.v),`distress`metric
    l:`.(-2_.j.v),`distress`level
    h:`.(-2_.j.v),`distress`horizon
    s:`.(-3_.j.v),`paths.`S,m
    f:`.(-3_.j.v),`paths.`F,m
    H:`.(-3_.j.v),`paths.`H
    e:{[o]
      / e is symbol vector of the selected entities
      / (eventually, this will need to be updated to handle consolidations)
      e::[~_n~t:o`entity_and_accounting_standard; {(!x)@&x[]}{                        x.Entity              }t
          ~_n~t:o`entity_or_portfolio           ; {(!x)@&x[]}{:[x.Display_Entity_Data;x.Entity _di`fill;.()]}t
          ~_n~t:o`treaties_and_products         ; {x.entities@&.j.True=x.entities..j.bg}                     t
                                                  0#` ]
      e }[`.-3_ .j.v]
    if[1<#e;:.j.ok.w .l.ss "More than one entity selected"]
    if[0=#e;:.j.ok.w .l.ss "No entity selected"]
    s[`Entity]:e
    if[(*.m.G[H;(`raxis;s)])~.();:.j.ok.w .l.ss("Distress metric not available for entity &0: &1";e;`.(-2_.j.v),`distress`metric)]
    r:.m.G[H;(`sum_vt;(s;_n;,h))]
    d:r[2;0;0]
    p:&x@f[d;l]
    .[`;(-2_.j.v),y;:;p]
    (`.(-2_.j.v),`paths.`j`Set_)[`Only;(-2_.j.v),`paths;p] }[::;`DISTRESSED]
                .,(`j
                   .((`l;`DISTRESS;)
                     (`fill;`h;)
                     (`c;`button;)
                     (`wy;0.0;)
                     (`e;0;))
                   ))
               (`NO_DISTRESS
                {[x;y;z]
    m:`.(-2_.j.v),`distress`metric
    l:`.(-2_.j.v),`distress`level
    h:`.(-2_.j.v),`distress`horizon
    s:`.(-3_.j.v),`paths.`S,m
    f:`.(-3_.j.v),`paths.`F,m
    H:`.(-3_.j.v),`paths.`H
    e:{[o]
      / e is symbol vector of the selected entities
      / (eventually, this will need to be updated to handle consolidations)
      e::[~_n~t:o`entity_and_accounting_standard; {(!x)@&x[]}{                        x.Entity              }t
          ~_n~t:o`entity_or_portfolio           ; {(!x)@&x[]}{:[x.Display_Entity_Data;x.Entity _di`fill;.()]}t
          ~_n~t:o`treaties_and_products         ; {x.entities@&.j.True=x.entities..j.bg}                     t
                                                  0#` ]
      e }[`.-3_ .j.v]
    if[1<#e;:.j.ok.w .l.ss "More than one entity selected"]
    if[0=#e;:.j.ok.w .l.ss "No entity selected"]
    s[`Entity]:e
    if[(*.m.G[H;(`raxis;s)])~.();:.j.ok.w .l.ss("Distress metric not available for entity &0: &1";e;`.(-2_.j.v),`distress`metric)]
    r:.m.G[H;(`sum_vt;(s;_n;,h))]
    d:r[2;0;0]
    p:&x@f[d;l]
    .[`;(-2_.j.v),y;:;p]
    (`.(-2_.j.v),`paths.`j`Set_)[`Only;(-2_.j.v),`paths;p] }[~:;`NON_DISTRESSED]
                .,(`j
                   .((`l;`"NO DISTRESS";)
                     (`fill;`h;)
                     (`c;`button;)
                     (`wy;0.0;)
                     (`e;0;))
                   ))
               (`NONE
                {(`.(-2_.j.v),`paths.`j`Set_)[`None;(-2_.j.v),`paths;!0]}
                .,(`j
                   .((`l;`NONE;)
                     (`fill;`h;)
                     (`c;`button;)
                     (`wy;0.0;))
                   ))
               (`COPY
                {.w.cbwrite[,`DFA_;,.,(`Path;(`.(-2_.j.v),`paths)@(`.(-2_.j.v),`paths.`j`Get_)[(-2_.j.v),`paths])]}
                .,(`j
                   .((`l;`COPY;)
                     (`fill;`h;)
                     (`c;`button;)
                     (`wy;0.0;))
                   ))
               (`PASTE
                {
    if[~`DFA_ _in .w.cbformats[];:.u.beep[]]
    c:.w.cbread `DFA_
    if[~`Path _in !c;:.u.beep[]]
    d:(-2_.j.v),`paths
    j:(-2_.j.v),`paths.`j
    p:c`Path
    p:p@&p _lin `. d
    (`. j,`Set_)[`Only;d;p]}
                .,(`j
                   .((`l;`PASTE;)
                     (`fill;`h;)
                     (`c;`button;)
                     (`wy;0.0;))
                   ))
               (`PASTE_WITH
                {
    if[~`DFA_ _in .w.cbformats[];:.u.beep[]]
    c:.w.cbread `DFA_
    if[~`Path _in !c;:.u.beep[]]
    d:(-2_.j.v),`paths
    j:(-2_.j.v),`paths.`j
    p:c`Path
    p:p@&p _lin `. d
    (`. j,`Set_)[`With;d;{x@<x}@?p,(`. j,`Get_)[d]]}
                .,(`j
                   .((`l;`"PASTE WITH";)
                     (`fill;`h;)
                     (`c;`button;)
                     (`wy;0.0;))
                   ))
               (`panel
                .()
                .,(`j
                   .((`c;`panel;)
                     (`wy;1.0;)
                     (`border;0;))
                   )))
             .,(`j
                .((`border;0;)
                  (`c;`panel;)
                  (`wx;0.2;))
                ))
            (`paths
             0 1 2 3 4 5 6 7 8 9
             .((`j
                .((`c;`Vector_;)
                  (`type;`Path;)
                  (`bg
                   `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue `scrollbarblue
                   .())
                  (`l;"Paths 10";)
                  (`e;0;)
                  (`kk;{c:cl .j.v;the[c]'[`With_v`Without_v][|/,//of[c;`true;,.j.v]=`. jd[.j.v],`bg,.j.i][_n;.j.v]};)
                  (`wx;0.4;)
                  (`pack;1;)
                  (`popup
                   .((`All;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`All;v;of[c;`all_;,v])]};)
                     (`None;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`None;v;())]};)
                     (`s0;" ";)
                     (`Only;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Only;v;of[c;`selected_;,v])]};)
                     (`Except;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Except;v;of[cl v;`all_;,v]_dvl of[c;`selected_;,v])]};)
                     (`s1;" ";)
                     (`With;{[x]C.Data_.With_v[x;ad -2_.j.v]};)
                     (`Without;{[x]C.Data_.Without_v[x;ad -2_.j.v]};)
                     (`In;{[x]c:cl v:ad -2_.j.v;s:of[c;`get_;,v];of[c;`set_;(`In;v;s@&s _lin of[c;`selected_;,v])]};)
                     (`s2;" ";)
                     (`Up;{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;<:)]};)
                     (`Down;{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;>:)]};)
                     (`s3;" ";)
                     (`Copy_Selection;{[x]c:cl v:ad -2_.j.v;of[c;`copy_;(c;v)]};)
                     (`Paste_Selection;{[x]c:cl v:ad -2_.j.v;of[c;`paste_;(c;v)]};)
                     (`s99;" ";)
                     (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
                     (`S98;" ";)
                     (`Ranges;{
   .k.RANGES.functions.a:{[op;all;list]
    new:.k.RANGES.functions[op][all;list]
    if[0=#new
     .k.RANGES.panel.message:"At least one Path must be selected"
     :_n
    ]
    .k[`r;`o;`o;`paths;`paths.;`j;`bg]:.j[`False`True]@.k[`r;`o;`o;`paths;`paths] _lin new
    .k[`r;`o;`o;`paths;`paths.;`j;`s]:!0
    .j.d`.k.RANGES
   }
   .k.RANGES.functions.Only   :{[all;list] all@& all _lin list}
   .k.RANGES.functions.Except :{[all;list] all@&~all _lin list}
   .k.RANGES.functions.With   :{[all;list] prev:all@&.j.True=.k[`r;`o;`o;`paths;`paths.;`j;`bg]; all@&all _lin list,prev}
   .k.RANGES.functions.Without:{[all;list] prev:all@&.j.True=.k[`r;`o;`o;`paths;`paths.;`j;`bg]; prev _dvl list}
   .k.RANGES.functions.In     :{[all;list] prev:all@&.j.True=.k[`r;`o;`o;`paths;`paths.;`j;`bg]; prev@&prev _lin list}
   .k.RANGES.functions.main:{
    op:*-1#.j.v
    if[op _in`Cancel`RANGES;.j.d`.k.RANGES;:_n]
    r:.u.check_path_list[`paths;0I;_n;.k.RANGES.panel.text]
    if[1~**r
     .k.RANGES.panel.message:.l.ss r[0;1]
     :_n
    ]
    all:.k[`r;`o;`o;`paths;`paths]
    list:@[.u.string2intlist;.k.RANGES.panel.text;:]
    if[*list
     .k.RANGES.panel.message:list 1
     :_n
    ]
    if[#invalid:list[1;&~list[1] _lin all]
     .j.ok.W .l.ss("The following invalid paths will be ignored:\n&0";.u.bunch_numbers[0I;invalid])
    ]
    .k.RANGES.functions.a[op;all;list 1]
   }
   .k.RANGES[`Only`Except`With`Without`In`Cancel]:.k.RANGES.functions.main
   .k.RANGES[~`Only`Except`With`Without`In`Cancel;`j;`async]:2
   .k.RANGES[~`Only`Except`With`Without`In`Cancel;`j;`mnem]:`o`e`w`t`i`c
   .k.RANGES..j.close:.k.RANGES.functions.main
   .k.RANGES..j.modal:1
   .k.RANGES.panel.label:"Ranges are separated by spaces, commas or newlines.\nExample: \"0-4,7-21,1999-2010\"."
   .k.RANGES.panel.message:""
   .k.RANGES.panel.text:""
   .k.RANGES.panel.label..j.c:`label
   .k.RANGES.panel.text..j.c:`text
   .k.RANGES.panel.message..j.c:`label
   .k.RANGES.panel.message..j.fg:`r
   .k.RANGES.panel.text..j.l:""
   .k.RANGES.panel.text..j.border:0
   .k.RANGES.panel.text..j.save:1
   .k.RANGES.panel.text..j.echo:0	/ this is necessary to prevent lost character when typing quickly with save:1
   .k.RANGES.panel..j.border:0
   .k.RANGES.panel..j.c:`panel
   .k.RANGES.panel..j.a:`label`text`message
   .k.RANGES..j.c:`panel
   .k.RANGES..j.a:(`panel;`Only`Except`With`Without`In`Cancel)
   .k.RANGES..j.on:`.k.r
   .k.RANGES..j.l:"Specify Ranges of Paths"
   .k.RANGES.panel.text:.u.bunch_numbers[0I;.k[`r;`o;`o;`paths;`paths]@&.j.True=.k[`r;`o;`o;`paths;`paths.;`j;`bg]]
   .k.RANGES.panel.message:""
   .j.c `.k.RANGES
   .k.RANGES.panel.text..j.s:!#.k.RANGES.panel.text
  };))
                   .,(`j
                      .,(`ne
                         ((,`All
                           ,`None
                           ,`s0
                           ,`Only
                           ,`Except
                           ,`s1
                           ,`With
                           ,`Without
                           ,`In
                           ,`s2
                           ,`Up
                           ,`Down
                           ,`s3
                           ,`Copy_Selection
                           ,`Paste_Selection
                           ,`Copy
                           ,`Copy_All
                           ,`s99
                           ,`S98
                           ,`Ranges)
                          0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0)
                         )
                      ))
                  (`Set;{.[`;(-1_.j.v),`paths.`j`l;:;(.l.ss"Paths")," ",$#(`.(-1_.j.v),`paths.`j`Get_)@.j.v]};)
                  (`krd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
                  (`Set_;{[f;v;s]
 b:of[cl v;;,v]'`false`true`null
 s::[~0~att[v;`All];s;(#s)~#`. v;!0;s]
 s::[~0~att[v;`None];s;~#s;!#`. v;s]
 w:jd v;d:`. v;if[_n~bg:`. w,`bg;bg:(#d)#*b];i:&~bg _lin b
 :[1~att[v;`Check]
  do[1;.[`;v;:;@[(#d)#*b;s;:;b 1]];fire_t v]
  do[1;.[`;w,`bg;:;@[@[@[(#d)#*b;s;:;b 1];&d~'_n;:;b 2];i;:;bg i]];fire_t w,`bg]]
 .[`;w,`s;:;_n]
 user[`Set;f;v;s]
};)
                  (`Get_;{[v]&of[cl v;`bool_;,v]};)
                  (`s;;))
                )
               (`V;{[x;y]:[+/U.True=y.j.bg;_n;"Please select at least one path"]};))))
          .((`I;.();)
            (`O;.();)
            (`L;.();)
            (`S;.();)
            (`F;.();)
            (`C;.();)
            (`H;572;)
            (`j
             .((`l;`Paths;)
               (`c;`panel;)
               (`a
                ,`flags `paths
                ))
             )))
         (`critical_values
          .((`Name
             ,`"5%"
             )
            (`Value
             ,0.05
             )
            (`Symmetric
             ,1
             )
            (`Type
             ,`Probability
             ))
          .,(`j
             .((`f
                .,(`Value;9.6;)
                )
               (`l;`"Test Critical Values";)
               (`c;`Table;)
               (`cltip
                .((`Value;"Input value of tail probability. Critical values are created with half of that probability in each tail";)
                  (`Symmetric;"If yes, 1-probability or -critical value is automatically added as another statistic";)
                  (`Type;"Critical value is either entered directly or computed from Probability using the inverse cumulative normal distribution";))
                )
               (`cl
                .((`Value;`"Critical\nValue or\nRejection\nProbability";)
                  (`Type;`"Value Type";))
                )
               (`p
                .((`Value;0.01;)
                  (`Symmetric;1;)
                  (`Type;`Probability;)
                  (`Name;`"1%";))
                )
               (`cell
                .((`Symmetric
                   .((`c;`combo;)
                     (`o
                      0 1
                      )
                     (`ol
                      (0 1
                       `No `Yes)
                      ))
                   )
                  (`Type
                   .((`c;`combo;)
                     (`o
                      `Critical_Value `Probability
                      ))
                   ))
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
             ))
         (`possible_returns
          .((`Source
             `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Treasury `Common_Stock `Common_Stock `Common_Stock `Common_Stock `Common_Stock `Common_Stock `Common_Stock `Common_Stock `Common_Stock `Common_Stock `Asset_Class_Return `Asset_Class_Return `Asset_Class_Return `Asset_Class_Return `Asset_Class_Return `Asset_Class_Return `Asset_Class_Return `Return_Class_Return
             )
            (`Item
             `AU_f0 `AU_f1 `AU_f2 `AU_f3 `AU_f4 `AU_f5 `AU_f6 `AU_f7 `AU_f8 `AU_f9 `AU_f10 `AU_f11 `AU_f12 `AU_f13 `AU_f14 `AU_f15 `AU_f16 `AU_f17 `AU_f18 `AU_f19 `AU_f20 `AU_f21 `AU_f22 `AU_f23 `AU_f24 `AU_f25 `AU_f26 `AU_f27 `AU_f28 `AU_f29 `AU_f30 `AU_f31 `AU_f32 `AU_f33 `AU_f34 `AU_f35 `AU_f36 `AU_f37 `AU_f38 `AU_f39 `AU_f40 `AU_f41 `AU_f42 `AU_f43 `AU_f44 `AU_f45 `AU_f46 `AU_f47 `AU_f48 `AU_f49 `AU_f50 `AU_f51 `AU_f52 `AU_f53 `AU_f54 `AU_f55 `AU_f56 `AU_f57 `AU_f58 `AU_f59 `AU_f60 `AU_f61 `AU_f62 `AU_f63 `AU_f64 `AU_f65 `AU_f66 `AU_f67 `AU_f68 `AU_f69 `AU_f70 `AU_f71 `AU_f72 `AU_f73 `AU_f74 `AU_f75 `AU_f76 `AU_f77 `AU_f78 `AU_f79 `AU_f80 `AU_f81 `AU_f82 `AU_f83 `AU_f84 `AU_f85 `AU_f86 `AU_f87 `AU_f88 `AU_f89 `AU_f90 `AU_f91 `AU_f92 `AU_f93 `AU_f94 `AU_f95 `AU_f96 `AU_f97 `AU_f98 `AU_f99 `AU_f100 `AU_f101 `AU_f102 `AU_f103 `AU_f104 `AU_f105 `AU_f106 `AU_f107 `AU_f108 `AU_f109 `AU_f110 `AU_f111 `AU_f112 `AU_f113 `AU_f114 `AU_f115 `AU_f116 `AU_f117 `AU_f118 `AU_f119 `AU_f120 `AU_f121 `AU_f122 `AU_f123 `AU_f124 `AU_f125 `AU_f126 `AU_f127 `AU_f128 `AU_f129 `AU_f130 `AU_f131 `AU_f132 `AU_f133 `AU_f134 `AU_f135 `AU_f136 `AU_f137 `AU_f138 `AU_f139 `AU_f140 `AU_f141 `AU_f142 `AU_f143 `AU_f144 `AU_f145 `AU_f146 `AU_f147 `AU_f148 `AU_f149 `AU_f150 `AU_f151 `AU_f152 `AU_f153 `AU_f154 `AU_f155 `AU_f156 `AU_f157 `AU_f158 `AU_f159 `AU_f160 `AU_f161 `AU_f162 `AU_f163 `AU_f164 `AU_f165 `AU_f166 `AU_f167 `AU_f168 `AU_f169 `AU_f170 `AU_f171 `AU_f172 `AU_f173 `AU_f174 `AU_f175 `AU_f176 `AU_f177 `AU_f178 `AU_f179 `AU_f180 `AU_f181 `AU_f182 `AU_f183 `AU_f184 `AU_f185 `AU_f186 `AU_f187 `AU_f188 `AU_f189 `AU_f190 `AU_f191 `AU_f192 `AU_f193 `AU_f194 `AU_f195 `AU_f196 `AU_f197 `AU_f198 `AU_f199 `AU_f200 `CA_f0 `CA_f1 `CA_f2 `CA_f3 `CA_f4 `CA_f5 `CA_f6 `CA_f7 `CA_f8 `CA_f9 `CA_f10 `CA_f11 `CA_f12 `CA_f13 `CA_f14 `CA_f15 `CA_f16 `CA_f17 `CA_f18 `CA_f19 `CA_f20 `CA_f21 `CA_f22 `CA_f23 `CA_f24 `CA_f25 `CA_f26 `CA_f27 `CA_f28 `CA_f29 `CA_f30 `CA_f31 `CA_f32 `CA_f33 `CA_f34 `CA_f35 `CA_f36 `CA_f37 `CA_f38 `CA_f39 `CA_f40 `CA_f41 `CA_f42 `CA_f43 `CA_f44 `CA_f45 `CA_f46 `CA_f47 `CA_f48 `CA_f49 `CA_f50 `CA_f51 `CA_f52 `CA_f53 `CA_f54 `CA_f55 `CA_f56 `CA_f57 `CA_f58 `CA_f59 `CA_f60 `CA_f61 `CA_f62 `CA_f63 `CA_f64 `CA_f65 `CA_f66 `CA_f67 `CA_f68 `CA_f69 `CA_f70 `CA_f71 `CA_f72 `CA_f73 `CA_f74 `CA_f75 `CA_f76 `CA_f77 `CA_f78 `CA_f79 `CA_f80 `CA_f81 `CA_f82 `CA_f83 `CA_f84 `CA_f85 `CA_f86 `CA_f87 `CA_f88 `CA_f89 `CA_f90 `CA_f91 `CA_f92 `CA_f93 `CA_f94 `CA_f95 `CA_f96 `CA_f97 `CA_f98 `CA_f99 `CA_f100 `CA_f101 `CA_f102 `CA_f103 `CA_f104 `CA_f105 `CA_f106 `CA_f107 `CA_f108 `CA_f109 `CA_f110 `CA_f111 `CA_f112 `CA_f113 `CA_f114 `CA_f115 `CA_f116 `CA_f117 `CA_f118 `CA_f119 `CA_f120 `CA_f121 `CA_f122 `CA_f123 `CA_f124 `CA_f125 `CA_f126 `CA_f127 `CA_f128 `CA_f129 `CA_f130 `CA_f131 `CA_f132 `CA_f133 `CA_f134 `CA_f135 `CA_f136 `CA_f137 `CA_f138 `CA_f139 `CA_f140 `CA_f141 `CA_f142 `CA_f143 `CA_f144 `CA_f145 `CA_f146 `CA_f147 `CA_f148 `CA_f149 `CA_f150 `CA_f151 `CA_f152 `CA_f153 `CA_f154 `CA_f155 `CA_f156 `CA_f157 `CA_f158 `CA_f159 `CA_f160 `CA_f161 `CA_f162 `CA_f163 `CA_f164 `CA_f165 `CA_f166 `CA_f167 `CA_f168 `CA_f169 `CA_f170 `CA_f171 `CA_f172 `CA_f173 `CA_f174 `CA_f175 `CA_f176 `CA_f177 `CA_f178 `CA_f179 `CA_f180 `CA_f181 `CA_f182 `CA_f183 `CA_f184 `CA_f185 `CA_f186 `CA_f187 `CA_f188 `CA_f189 `CA_f190 `CA_f191 `CA_f192 `CA_f193 `CA_f194 `CA_f195 `CA_f196 `CA_f197 `CA_f198 `CA_f199 `CA_f200 `CH_f0 `CH_f1 `CH_f2 `CH_f3 `CH_f4 `CH_f5 `CH_f6 `CH_f7 `CH_f8 `CH_f9 `CH_f10 `CH_f11 `CH_f12 `CH_f13 `CH_f14 `CH_f15 `CH_f16 `CH_f17 `CH_f18 `CH_f19 `CH_f20 `CH_f21 `CH_f22 `CH_f23 `CH_f24 `CH_f25 `CH_f26 `CH_f27 `CH_f28 `CH_f29 `CH_f30 `CH_f31 `CH_f32 `CH_f33 `CH_f34 `CH_f35 `CH_f36 `CH_f37 `CH_f38 `CH_f39 `CH_f40 `CH_f41 `CH_f42 `CH_f43 `CH_f44 `CH_f45 `CH_f46 `CH_f47 `CH_f48 `CH_f49 `CH_f50 `CH_f51 `CH_f52 `CH_f53 `CH_f54 `CH_f55 `CH_f56 `CH_f57 `CH_f58 `CH_f59 `CH_f60 `CH_f61 `CH_f62 `CH_f63 `CH_f64 `CH_f65 `CH_f66 `CH_f67 `CH_f68 `CH_f69 `CH_f70 `CH_f71 `CH_f72 `CH_f73 `CH_f74 `CH_f75 `CH_f76 `CH_f77 `CH_f78 `CH_f79 `CH_f80 `CH_f81 `CH_f82 `CH_f83 `CH_f84 `CH_f85 `CH_f86 `CH_f87 `CH_f88 `CH_f89 `CH_f90 `CH_f91 `CH_f92 `CH_f93 `CH_f94 `CH_f95 `CH_f96 `CH_f97 `CH_f98 `CH_f99 `CH_f100 `CH_f101 `CH_f102 `CH_f103 `CH_f104 `CH_f105 `CH_f106 `CH_f107 `CH_f108 `CH_f109 `CH_f110 `CH_f111 `CH_f112 `CH_f113 `CH_f114 `CH_f115 `CH_f116 `CH_f117 `CH_f118 `CH_f119 `CH_f120 `CH_f121 `CH_f122 `CH_f123 `CH_f124 `CH_f125 `CH_f126 `CH_f127 `CH_f128 `CH_f129 `CH_f130 `CH_f131 `CH_f132 `CH_f133 `CH_f134 `CH_f135 `CH_f136 `CH_f137 `CH_f138 `CH_f139 `CH_f140 `CH_f141 `CH_f142 `CH_f143 `CH_f144 `CH_f145 `CH_f146 `CH_f147 `CH_f148 `CH_f149 `CH_f150 `CH_f151 `CH_f152 `CH_f153 `CH_f154 `CH_f155 `CH_f156 `CH_f157 `CH_f158 `CH_f159 `CH_f160 `CH_f161 `CH_f162 `CH_f163 `CH_f164 `CH_f165 `CH_f166 `CH_f167 `CH_f168 `CH_f169 `CH_f170 `CH_f171 `CH_f172 `CH_f173 `CH_f174 `CH_f175 `CH_f176 `CH_f177 `CH_f178 `CH_f179 `CH_f180 `CH_f181 `CH_f182 `CH_f183 `CH_f184 `CH_f185 `CH_f186 `CH_f187 `CH_f188 `CH_f189 `CH_f190 `CH_f191 `CH_f192 `CH_f193 `CH_f194 `CH_f195 `CH_f196 `CH_f197 `CH_f198 `CH_f199 `CH_f200 `DE_f0 `DE_f1 `DE_f2 `DE_f3 `DE_f4 `DE_f5 `DE_f6 `DE_f7 `DE_f8 `DE_f9 `DE_f10 `DE_f11 `DE_f12 `DE_f13 `DE_f14 `DE_f15 `DE_f16 `DE_f17 `DE_f18 `DE_f19 `DE_f20 `DE_f21 `DE_f22 `DE_f23 `DE_f24 `DE_f25 `DE_f26 `DE_f27 `DE_f28 `DE_f29 `DE_f30 `DE_f31 `DE_f32 `DE_f33 `DE_f34 `DE_f35 `DE_f36 `DE_f37 `DE_f38 `DE_f39 `DE_f40 `DE_f41 `DE_f42 `DE_f43 `DE_f44 `DE_f45 `DE_f46 `DE_f47 `DE_f48 `DE_f49 `DE_f50 `DE_f51 `DE_f52 `DE_f53 `DE_f54 `DE_f55 `DE_f56 `DE_f57 `DE_f58 `DE_f59 `DE_f60 `DE_f61 `DE_f62 `DE_f63 `DE_f64 `DE_f65 `DE_f66 `DE_f67 `DE_f68 `DE_f69 `DE_f70 `DE_f71 `DE_f72 `DE_f73 `DE_f74 `DE_f75 `DE_f76 `DE_f77 `DE_f78 `DE_f79 `DE_f80 `DE_f81 `DE_f82 `DE_f83 `DE_f84 `DE_f85 `DE_f86 `DE_f87 `DE_f88 `DE_f89 `DE_f90 `DE_f91 `DE_f92 `DE_f93 `DE_f94 `DE_f95 `DE_f96 `DE_f97 `DE_f98 `DE_f99 `DE_f100 `DE_f101 `DE_f102 `DE_f103 `DE_f104 `DE_f105 `DE_f106 `DE_f107 `DE_f108 `DE_f109 `DE_f110 `DE_f111 `DE_f112 `DE_f113 `DE_f114 `DE_f115 `DE_f116 `DE_f117 `DE_f118 `DE_f119 `DE_f120 `DE_f121 `DE_f122 `DE_f123 `DE_f124 `DE_f125 `DE_f126 `DE_f127 `DE_f128 `DE_f129 `DE_f130 `DE_f131 `DE_f132 `DE_f133 `DE_f134 `DE_f135 `DE_f136 `DE_f137 `DE_f138 `DE_f139 `DE_f140 `DE_f141 `DE_f142 `DE_f143 `DE_f144 `DE_f145 `DE_f146 `DE_f147 `DE_f148 `DE_f149 `DE_f150 `DE_f151 `DE_f152 `DE_f153 `DE_f154 `DE_f155 `DE_f156 `DE_f157 `DE_f158 `DE_f159 `DE_f160 `DE_f161 `DE_f162 `DE_f163 `DE_f164 `DE_f165 `DE_f166 `DE_f167 `DE_f168 `DE_f169 `DE_f170 `DE_f171 `DE_f172 `DE_f173 `DE_f174 `DE_f175 `DE_f176 `DE_f177 `DE_f178 `DE_f179 `DE_f180 `DE_f181 `DE_f182 `DE_f183 `DE_f184 `DE_f185 `DE_f186 `DE_f187 `DE_f188 `DE_f189 `DE_f190 `DE_f191 `DE_f192 `DE_f193 `DE_f194 `DE_f195 `DE_f196 `DE_f197 `DE_f198 `DE_f199 `DE_f200 `GB_f0 `GB_f1 `GB_f2 `GB_f3 `GB_f4 `GB_f5 `GB_f6 `GB_f7 `GB_f8 `GB_f9 `GB_f10 `GB_f11 `GB_f12 `GB_f13 `GB_f14 `GB_f15 `GB_f16 `GB_f17 `GB_f18 `GB_f19 `GB_f20 `GB_f21 `GB_f22 `GB_f23 `GB_f24 `GB_f25 `GB_f26 `GB_f27 `GB_f28 `GB_f29 `GB_f30 `GB_f31 `GB_f32 `GB_f33 `GB_f34 `GB_f35 `GB_f36 `GB_f37 `GB_f38 `GB_f39 `GB_f40 `GB_f41 `GB_f42 `GB_f43 `GB_f44 `GB_f45 `GB_f46 `GB_f47 `GB_f48 `GB_f49 `GB_f50 `GB_f51 `GB_f52 `GB_f53 `GB_f54 `GB_f55 `GB_f56 `GB_f57 `GB_f58 `GB_f59 `GB_f60 `GB_f61 `GB_f62 `GB_f63 `GB_f64 `GB_f65 `GB_f66 `GB_f67 `GB_f68 `GB_f69 `GB_f70 `GB_f71 `GB_f72 `GB_f73 `GB_f74 `GB_f75 `GB_f76 `GB_f77 `GB_f78 `GB_f79 `GB_f80 `GB_f81 `GB_f82 `GB_f83 `GB_f84 `GB_f85 `GB_f86 `GB_f87 `GB_f88 `GB_f89 `GB_f90 `GB_f91 `GB_f92 `GB_f93 `GB_f94 `GB_f95 `GB_f96 `GB_f97 `GB_f98 `GB_f99 `GB_f100 `GB_f101 `GB_f102 `GB_f103 `GB_f104 `GB_f105 `GB_f106 `GB_f107 `GB_f108 `GB_f109 `GB_f110 `GB_f111 `GB_f112 `GB_f113 `GB_f114 `GB_f115 `GB_f116 `GB_f117 `GB_f118 `GB_f119 `GB_f120 `GB_f121 `GB_f122 `GB_f123 `GB_f124 `GB_f125 `GB_f126 `GB_f127 `GB_f128 `GB_f129 `GB_f130 `GB_f131 `GB_f132 `GB_f133 `GB_f134 `GB_f135 `GB_f136 `GB_f137 `GB_f138 `GB_f139 `GB_f140 `GB_f141 `GB_f142 `GB_f143 `GB_f144 `GB_f145 `GB_f146 `GB_f147 `GB_f148 `GB_f149 `GB_f150 `GB_f151 `GB_f152 `GB_f153 `GB_f154 `GB_f155 `GB_f156 `GB_f157 `GB_f158 `GB_f159 `GB_f160 `GB_f161 `GB_f162 `GB_f163 `GB_f164 `GB_f165 `GB_f166 `GB_f167 `GB_f168 `GB_f169 `GB_f170 `GB_f171 `GB_f172 `GB_f173 `GB_f174 `GB_f175 `GB_f176 `GB_f177 `GB_f178 `GB_f179 `GB_f180 `GB_f181 `GB_f182 `GB_f183 `GB_f184 `GB_f185 `GB_f186 `GB_f187 `GB_f188 `GB_f189 `GB_f190 `GB_f191 `GB_f192 `GB_f193 `GB_f194 `GB_f195 `GB_f196 `GB_f197 `GB_f198 `GB_f199 `GB_f200 `US_f0 `US_f1 `US_f2 `US_f3 `US_f4 `US_f5 `US_f6 `US_f7 `US_f8 `US_f9 `US_f10 `US_f11 `US_f12 `US_f13 `US_f14 `US_f15 `US_f16 `US_f17 `US_f18 `US_f19 `US_f20 `US_f21 `US_f22 `US_f23 `US_f24 `US_f25 `US_f26 `US_f27 `US_f28 `US_f29 `US_f30 `US_f31 `US_f32 `US_f33 `US_f34 `US_f35 `US_f36 `US_f37 `US_f38 `US_f39 `US_f40 `US_f41 `US_f42 `US_f43 `US_f44 `US_f45 `US_f46 `US_f47 `US_f48 `US_f49 `US_f50 `US_f51 `US_f52 `US_f53 `US_f54 `US_f55 `US_f56 `US_f57 `US_f58 `US_f59 `US_f60 `US_f61 `US_f62 `US_f63 `US_f64 `US_f65 `US_f66 `US_f67 `US_f68 `US_f69 `US_f70 `US_f71 `US_f72 `US_f73 `US_f74 `US_f75 `US_f76 `US_f77 `US_f78 `US_f79 `US_f80 `US_f81 `US_f82 `US_f83 `US_f84 `US_f85 `US_f86 `US_f87 `US_f88 `US_f89 `US_f90 `US_f91 `US_f92 `US_f93 `US_f94 `US_f95 `US_f96 `US_f97 `US_f98 `US_f99 `US_f100 `US_f101 `US_f102 `US_f103 `US_f104 `US_f105 `US_f106 `US_f107 `US_f108 `US_f109 `US_f110 `US_f111 `US_f112 `US_f113 `US_f114 `US_f115 `US_f116 `US_f117 `US_f118 `US_f119 `US_f120 `US_f121 `US_f122 `US_f123 `US_f124 `US_f125 `US_f126 `US_f127 `US_f128 `US_f129 `US_f130 `US_f131 `US_f132 `US_f133 `US_f134 `US_f135 `US_f136 `US_f137 `US_f138 `US_f139 `US_f140 `US_f141 `US_f142 `US_f143 `US_f144 `US_f145 `US_f146 `US_f147 `US_f148 `US_f149 `US_f150 `US_f151 `US_f152 `US_f153 `US_f154 `US_f155 `US_f156 `US_f157 `US_f158 `US_f159 `US_f160 `US_f161 `US_f162 `US_f163 `US_f164 `US_f165 `US_f166 `US_f167 `US_f168 `US_f169 `US_f170 `US_f171 `US_f172 `US_f173 `US_f174 `US_f175 `US_f176 `US_f177 `US_f178 `US_f179 `US_f180 `US_f181 `US_f182 `US_f183 `US_f184 `US_f185 `US_f186 `US_f187 `US_f188 `US_f189 `US_f190 `US_f191 `US_f192 `US_f193 `US_f194 `US_f195 `US_f196 `US_f197 `US_f198 `US_f199 `US_f200 `AU_Large_Cap `CA_Large_Cap `CH_Large_Cap `DE_Large_Cap `GB_Large_Cap `US_Large_Cap `DE_Other_Sector `US_Mid_Cap `US_Small_Cap `US_Other_Sector `AUD `CAD `CHF `EUR `GBP `USD `Asset_Class_1 `Return_Class_1
             )
            (`Name
             `Treasury_AU_f0 `Treasury_AU_f1 `Treasury_AU_f2 `Treasury_AU_f3 `Treasury_AU_f4 `Treasury_AU_f5 `Treasury_AU_f6 `Treasury_AU_f7 `Treasury_AU_f8 `Treasury_AU_f9 `Treasury_AU_f10 `Treasury_AU_f11 `Treasury_AU_f12 `Treasury_AU_f13 `Treasury_AU_f14 `Treasury_AU_f15 `Treasury_AU_f16 `Treasury_AU_f17 `Treasury_AU_f18 `Treasury_AU_f19 `Treasury_AU_f20 `Treasury_AU_f21 `Treasury_AU_f22 `Treasury_AU_f23 `Treasury_AU_f24 `Treasury_AU_f25 `Treasury_AU_f26 `Treasury_AU_f27 `Treasury_AU_f28 `Treasury_AU_f29 `Treasury_AU_f30 `Treasury_AU_f31 `Treasury_AU_f32 `Treasury_AU_f33 `Treasury_AU_f34 `Treasury_AU_f35 `Treasury_AU_f36 `Treasury_AU_f37 `Treasury_AU_f38 `Treasury_AU_f39 `Treasury_AU_f40 `Treasury_AU_f41 `Treasury_AU_f42 `Treasury_AU_f43 `Treasury_AU_f44 `Treasury_AU_f45 `Treasury_AU_f46 `Treasury_AU_f47 `Treasury_AU_f48 `Treasury_AU_f49 `Treasury_AU_f50 `Treasury_AU_f51 `Treasury_AU_f52 `Treasury_AU_f53 `Treasury_AU_f54 `Treasury_AU_f55 `Treasury_AU_f56 `Treasury_AU_f57 `Treasury_AU_f58 `Treasury_AU_f59 `Treasury_AU_f60 `Treasury_AU_f61 `Treasury_AU_f62 `Treasury_AU_f63 `Treasury_AU_f64 `Treasury_AU_f65 `Treasury_AU_f66 `Treasury_AU_f67 `Treasury_AU_f68 `Treasury_AU_f69 `Treasury_AU_f70 `Treasury_AU_f71 `Treasury_AU_f72 `Treasury_AU_f73 `Treasury_AU_f74 `Treasury_AU_f75 `Treasury_AU_f76 `Treasury_AU_f77 `Treasury_AU_f78 `Treasury_AU_f79 `Treasury_AU_f80 `Treasury_AU_f81 `Treasury_AU_f82 `Treasury_AU_f83 `Treasury_AU_f84 `Treasury_AU_f85 `Treasury_AU_f86 `Treasury_AU_f87 `Treasury_AU_f88 `Treasury_AU_f89 `Treasury_AU_f90 `Treasury_AU_f91 `Treasury_AU_f92 `Treasury_AU_f93 `Treasury_AU_f94 `Treasury_AU_f95 `Treasury_AU_f96 `Treasury_AU_f97 `Treasury_AU_f98 `Treasury_AU_f99 `Treasury_AU_f100 `Treasury_AU_f101 `Treasury_AU_f102 `Treasury_AU_f103 `Treasury_AU_f104 `Treasury_AU_f105 `Treasury_AU_f106 `Treasury_AU_f107 `Treasury_AU_f108 `Treasury_AU_f109 `Treasury_AU_f110 `Treasury_AU_f111 `Treasury_AU_f112 `Treasury_AU_f113 `Treasury_AU_f114 `Treasury_AU_f115 `Treasury_AU_f116 `Treasury_AU_f117 `Treasury_AU_f118 `Treasury_AU_f119 `Treasury_AU_f120 `Treasury_AU_f121 `Treasury_AU_f122 `Treasury_AU_f123 `Treasury_AU_f124 `Treasury_AU_f125 `Treasury_AU_f126 `Treasury_AU_f127 `Treasury_AU_f128 `Treasury_AU_f129 `Treasury_AU_f130 `Treasury_AU_f131 `Treasury_AU_f132 `Treasury_AU_f133 `Treasury_AU_f134 `Treasury_AU_f135 `Treasury_AU_f136 `Treasury_AU_f137 `Treasury_AU_f138 `Treasury_AU_f139 `Treasury_AU_f140 `Treasury_AU_f141 `Treasury_AU_f142 `Treasury_AU_f143 `Treasury_AU_f144 `Treasury_AU_f145 `Treasury_AU_f146 `Treasury_AU_f147 `Treasury_AU_f148 `Treasury_AU_f149 `Treasury_AU_f150 `Treasury_AU_f151 `Treasury_AU_f152 `Treasury_AU_f153 `Treasury_AU_f154 `Treasury_AU_f155 `Treasury_AU_f156 `Treasury_AU_f157 `Treasury_AU_f158 `Treasury_AU_f159 `Treasury_AU_f160 `Treasury_AU_f161 `Treasury_AU_f162 `Treasury_AU_f163 `Treasury_AU_f164 `Treasury_AU_f165 `Treasury_AU_f166 `Treasury_AU_f167 `Treasury_AU_f168 `Treasury_AU_f169 `Treasury_AU_f170 `Treasury_AU_f171 `Treasury_AU_f172 `Treasury_AU_f173 `Treasury_AU_f174 `Treasury_AU_f175 `Treasury_AU_f176 `Treasury_AU_f177 `Treasury_AU_f178 `Treasury_AU_f179 `Treasury_AU_f180 `Treasury_AU_f181 `Treasury_AU_f182 `Treasury_AU_f183 `Treasury_AU_f184 `Treasury_AU_f185 `Treasury_AU_f186 `Treasury_AU_f187 `Treasury_AU_f188 `Treasury_AU_f189 `Treasury_AU_f190 `Treasury_AU_f191 `Treasury_AU_f192 `Treasury_AU_f193 `Treasury_AU_f194 `Treasury_AU_f195 `Treasury_AU_f196 `Treasury_AU_f197 `Treasury_AU_f198 `Treasury_AU_f199 `Treasury_AU_f200 `Treasury_CA_f0 `Treasury_CA_f1 `Treasury_CA_f2 `Treasury_CA_f3 `Treasury_CA_f4 `Treasury_CA_f5 `Treasury_CA_f6 `Treasury_CA_f7 `Treasury_CA_f8 `Treasury_CA_f9 `Treasury_CA_f10 `Treasury_CA_f11 `Treasury_CA_f12 `Treasury_CA_f13 `Treasury_CA_f14 `Treasury_CA_f15 `Treasury_CA_f16 `Treasury_CA_f17 `Treasury_CA_f18 `Treasury_CA_f19 `Treasury_CA_f20 `Treasury_CA_f21 `Treasury_CA_f22 `Treasury_CA_f23 `Treasury_CA_f24 `Treasury_CA_f25 `Treasury_CA_f26 `Treasury_CA_f27 `Treasury_CA_f28 `Treasury_CA_f29 `Treasury_CA_f30 `Treasury_CA_f31 `Treasury_CA_f32 `Treasury_CA_f33 `Treasury_CA_f34 `Treasury_CA_f35 `Treasury_CA_f36 `Treasury_CA_f37 `Treasury_CA_f38 `Treasury_CA_f39 `Treasury_CA_f40 `Treasury_CA_f41 `Treasury_CA_f42 `Treasury_CA_f43 `Treasury_CA_f44 `Treasury_CA_f45 `Treasury_CA_f46 `Treasury_CA_f47 `Treasury_CA_f48 `Treasury_CA_f49 `Treasury_CA_f50 `Treasury_CA_f51 `Treasury_CA_f52 `Treasury_CA_f53 `Treasury_CA_f54 `Treasury_CA_f55 `Treasury_CA_f56 `Treasury_CA_f57 `Treasury_CA_f58 `Treasury_CA_f59 `Treasury_CA_f60 `Treasury_CA_f61 `Treasury_CA_f62 `Treasury_CA_f63 `Treasury_CA_f64 `Treasury_CA_f65 `Treasury_CA_f66 `Treasury_CA_f67 `Treasury_CA_f68 `Treasury_CA_f69 `Treasury_CA_f70 `Treasury_CA_f71 `Treasury_CA_f72 `Treasury_CA_f73 `Treasury_CA_f74 `Treasury_CA_f75 `Treasury_CA_f76 `Treasury_CA_f77 `Treasury_CA_f78 `Treasury_CA_f79 `Treasury_CA_f80 `Treasury_CA_f81 `Treasury_CA_f82 `Treasury_CA_f83 `Treasury_CA_f84 `Treasury_CA_f85 `Treasury_CA_f86 `Treasury_CA_f87 `Treasury_CA_f88 `Treasury_CA_f89 `Treasury_CA_f90 `Treasury_CA_f91 `Treasury_CA_f92 `Treasury_CA_f93 `Treasury_CA_f94 `Treasury_CA_f95 `Treasury_CA_f96 `Treasury_CA_f97 `Treasury_CA_f98 `Treasury_CA_f99 `Treasury_CA_f100 `Treasury_CA_f101 `Treasury_CA_f102 `Treasury_CA_f103 `Treasury_CA_f104 `Treasury_CA_f105 `Treasury_CA_f106 `Treasury_CA_f107 `Treasury_CA_f108 `Treasury_CA_f109 `Treasury_CA_f110 `Treasury_CA_f111 `Treasury_CA_f112 `Treasury_CA_f113 `Treasury_CA_f114 `Treasury_CA_f115 `Treasury_CA_f116 `Treasury_CA_f117 `Treasury_CA_f118 `Treasury_CA_f119 `Treasury_CA_f120 `Treasury_CA_f121 `Treasury_CA_f122 `Treasury_CA_f123 `Treasury_CA_f124 `Treasury_CA_f125 `Treasury_CA_f126 `Treasury_CA_f127 `Treasury_CA_f128 `Treasury_CA_f129 `Treasury_CA_f130 `Treasury_CA_f131 `Treasury_CA_f132 `Treasury_CA_f133 `Treasury_CA_f134 `Treasury_CA_f135 `Treasury_CA_f136 `Treasury_CA_f137 `Treasury_CA_f138 `Treasury_CA_f139 `Treasury_CA_f140 `Treasury_CA_f141 `Treasury_CA_f142 `Treasury_CA_f143 `Treasury_CA_f144 `Treasury_CA_f145 `Treasury_CA_f146 `Treasury_CA_f147 `Treasury_CA_f148 `Treasury_CA_f149 `Treasury_CA_f150 `Treasury_CA_f151 `Treasury_CA_f152 `Treasury_CA_f153 `Treasury_CA_f154 `Treasury_CA_f155 `Treasury_CA_f156 `Treasury_CA_f157 `Treasury_CA_f158 `Treasury_CA_f159 `Treasury_CA_f160 `Treasury_CA_f161 `Treasury_CA_f162 `Treasury_CA_f163 `Treasury_CA_f164 `Treasury_CA_f165 `Treasury_CA_f166 `Treasury_CA_f167 `Treasury_CA_f168 `Treasury_CA_f169 `Treasury_CA_f170 `Treasury_CA_f171 `Treasury_CA_f172 `Treasury_CA_f173 `Treasury_CA_f174 `Treasury_CA_f175 `Treasury_CA_f176 `Treasury_CA_f177 `Treasury_CA_f178 `Treasury_CA_f179 `Treasury_CA_f180 `Treasury_CA_f181 `Treasury_CA_f182 `Treasury_CA_f183 `Treasury_CA_f184 `Treasury_CA_f185 `Treasury_CA_f186 `Treasury_CA_f187 `Treasury_CA_f188 `Treasury_CA_f189 `Treasury_CA_f190 `Treasury_CA_f191 `Treasury_CA_f192 `Treasury_CA_f193 `Treasury_CA_f194 `Treasury_CA_f195 `Treasury_CA_f196 `Treasury_CA_f197 `Treasury_CA_f198 `Treasury_CA_f199 `Treasury_CA_f200 `Treasury_CH_f0 `Treasury_CH_f1 `Treasury_CH_f2 `Treasury_CH_f3 `Treasury_CH_f4 `Treasury_CH_f5 `Treasury_CH_f6 `Treasury_CH_f7 `Treasury_CH_f8 `Treasury_CH_f9 `Treasury_CH_f10 `Treasury_CH_f11 `Treasury_CH_f12 `Treasury_CH_f13 `Treasury_CH_f14 `Treasury_CH_f15 `Treasury_CH_f16 `Treasury_CH_f17 `Treasury_CH_f18 `Treasury_CH_f19 `Treasury_CH_f20 `Treasury_CH_f21 `Treasury_CH_f22 `Treasury_CH_f23 `Treasury_CH_f24 `Treasury_CH_f25 `Treasury_CH_f26 `Treasury_CH_f27 `Treasury_CH_f28 `Treasury_CH_f29 `Treasury_CH_f30 `Treasury_CH_f31 `Treasury_CH_f32 `Treasury_CH_f33 `Treasury_CH_f34 `Treasury_CH_f35 `Treasury_CH_f36 `Treasury_CH_f37 `Treasury_CH_f38 `Treasury_CH_f39 `Treasury_CH_f40 `Treasury_CH_f41 `Treasury_CH_f42 `Treasury_CH_f43 `Treasury_CH_f44 `Treasury_CH_f45 `Treasury_CH_f46 `Treasury_CH_f47 `Treasury_CH_f48 `Treasury_CH_f49 `Treasury_CH_f50 `Treasury_CH_f51 `Treasury_CH_f52 `Treasury_CH_f53 `Treasury_CH_f54 `Treasury_CH_f55 `Treasury_CH_f56 `Treasury_CH_f57 `Treasury_CH_f58 `Treasury_CH_f59 `Treasury_CH_f60 `Treasury_CH_f61 `Treasury_CH_f62 `Treasury_CH_f63 `Treasury_CH_f64 `Treasury_CH_f65 `Treasury_CH_f66 `Treasury_CH_f67 `Treasury_CH_f68 `Treasury_CH_f69 `Treasury_CH_f70 `Treasury_CH_f71 `Treasury_CH_f72 `Treasury_CH_f73 `Treasury_CH_f74 `Treasury_CH_f75 `Treasury_CH_f76 `Treasury_CH_f77 `Treasury_CH_f78 `Treasury_CH_f79 `Treasury_CH_f80 `Treasury_CH_f81 `Treasury_CH_f82 `Treasury_CH_f83 `Treasury_CH_f84 `Treasury_CH_f85 `Treasury_CH_f86 `Treasury_CH_f87 `Treasury_CH_f88 `Treasury_CH_f89 `Treasury_CH_f90 `Treasury_CH_f91 `Treasury_CH_f92 `Treasury_CH_f93 `Treasury_CH_f94 `Treasury_CH_f95 `Treasury_CH_f96 `Treasury_CH_f97 `Treasury_CH_f98 `Treasury_CH_f99 `Treasury_CH_f100 `Treasury_CH_f101 `Treasury_CH_f102 `Treasury_CH_f103 `Treasury_CH_f104 `Treasury_CH_f105 `Treasury_CH_f106 `Treasury_CH_f107 `Treasury_CH_f108 `Treasury_CH_f109 `Treasury_CH_f110 `Treasury_CH_f111 `Treasury_CH_f112 `Treasury_CH_f113 `Treasury_CH_f114 `Treasury_CH_f115 `Treasury_CH_f116 `Treasury_CH_f117 `Treasury_CH_f118 `Treasury_CH_f119 `Treasury_CH_f120 `Treasury_CH_f121 `Treasury_CH_f122 `Treasury_CH_f123 `Treasury_CH_f124 `Treasury_CH_f125 `Treasury_CH_f126 `Treasury_CH_f127 `Treasury_CH_f128 `Treasury_CH_f129 `Treasury_CH_f130 `Treasury_CH_f131 `Treasury_CH_f132 `Treasury_CH_f133 `Treasury_CH_f134 `Treasury_CH_f135 `Treasury_CH_f136 `Treasury_CH_f137 `Treasury_CH_f138 `Treasury_CH_f139 `Treasury_CH_f140 `Treasury_CH_f141 `Treasury_CH_f142 `Treasury_CH_f143 `Treasury_CH_f144 `Treasury_CH_f145 `Treasury_CH_f146 `Treasury_CH_f147 `Treasury_CH_f148 `Treasury_CH_f149 `Treasury_CH_f150 `Treasury_CH_f151 `Treasury_CH_f152 `Treasury_CH_f153 `Treasury_CH_f154 `Treasury_CH_f155 `Treasury_CH_f156 `Treasury_CH_f157 `Treasury_CH_f158 `Treasury_CH_f159 `Treasury_CH_f160 `Treasury_CH_f161 `Treasury_CH_f162 `Treasury_CH_f163 `Treasury_CH_f164 `Treasury_CH_f165 `Treasury_CH_f166 `Treasury_CH_f167 `Treasury_CH_f168 `Treasury_CH_f169 `Treasury_CH_f170 `Treasury_CH_f171 `Treasury_CH_f172 `Treasury_CH_f173 `Treasury_CH_f174 `Treasury_CH_f175 `Treasury_CH_f176 `Treasury_CH_f177 `Treasury_CH_f178 `Treasury_CH_f179 `Treasury_CH_f180 `Treasury_CH_f181 `Treasury_CH_f182 `Treasury_CH_f183 `Treasury_CH_f184 `Treasury_CH_f185 `Treasury_CH_f186 `Treasury_CH_f187 `Treasury_CH_f188 `Treasury_CH_f189 `Treasury_CH_f190 `Treasury_CH_f191 `Treasury_CH_f192 `Treasury_CH_f193 `Treasury_CH_f194 `Treasury_CH_f195 `Treasury_CH_f196 `Treasury_CH_f197 `Treasury_CH_f198 `Treasury_CH_f199 `Treasury_CH_f200 `Treasury_DE_f0 `Treasury_DE_f1 `Treasury_DE_f2 `Treasury_DE_f3 `Treasury_DE_f4 `Treasury_DE_f5 `Treasury_DE_f6 `Treasury_DE_f7 `Treasury_DE_f8 `Treasury_DE_f9 `Treasury_DE_f10 `Treasury_DE_f11 `Treasury_DE_f12 `Treasury_DE_f13 `Treasury_DE_f14 `Treasury_DE_f15 `Treasury_DE_f16 `Treasury_DE_f17 `Treasury_DE_f18 `Treasury_DE_f19 `Treasury_DE_f20 `Treasury_DE_f21 `Treasury_DE_f22 `Treasury_DE_f23 `Treasury_DE_f24 `Treasury_DE_f25 `Treasury_DE_f26 `Treasury_DE_f27 `Treasury_DE_f28 `Treasury_DE_f29 `Treasury_DE_f30 `Treasury_DE_f31 `Treasury_DE_f32 `Treasury_DE_f33 `Treasury_DE_f34 `Treasury_DE_f35 `Treasury_DE_f36 `Treasury_DE_f37 `Treasury_DE_f38 `Treasury_DE_f39 `Treasury_DE_f40 `Treasury_DE_f41 `Treasury_DE_f42 `Treasury_DE_f43 `Treasury_DE_f44 `Treasury_DE_f45 `Treasury_DE_f46 `Treasury_DE_f47 `Treasury_DE_f48 `Treasury_DE_f49 `Treasury_DE_f50 `Treasury_DE_f51 `Treasury_DE_f52 `Treasury_DE_f53 `Treasury_DE_f54 `Treasury_DE_f55 `Treasury_DE_f56 `Treasury_DE_f57 `Treasury_DE_f58 `Treasury_DE_f59 `Treasury_DE_f60 `Treasury_DE_f61 `Treasury_DE_f62 `Treasury_DE_f63 `Treasury_DE_f64 `Treasury_DE_f65 `Treasury_DE_f66 `Treasury_DE_f67 `Treasury_DE_f68 `Treasury_DE_f69 `Treasury_DE_f70 `Treasury_DE_f71 `Treasury_DE_f72 `Treasury_DE_f73 `Treasury_DE_f74 `Treasury_DE_f75 `Treasury_DE_f76 `Treasury_DE_f77 `Treasury_DE_f78 `Treasury_DE_f79 `Treasury_DE_f80 `Treasury_DE_f81 `Treasury_DE_f82 `Treasury_DE_f83 `Treasury_DE_f84 `Treasury_DE_f85 `Treasury_DE_f86 `Treasury_DE_f87 `Treasury_DE_f88 `Treasury_DE_f89 `Treasury_DE_f90 `Treasury_DE_f91 `Treasury_DE_f92 `Treasury_DE_f93 `Treasury_DE_f94 `Treasury_DE_f95 `Treasury_DE_f96 `Treasury_DE_f97 `Treasury_DE_f98 `Treasury_DE_f99 `Treasury_DE_f100 `Treasury_DE_f101 `Treasury_DE_f102 `Treasury_DE_f103 `Treasury_DE_f104 `Treasury_DE_f105 `Treasury_DE_f106 `Treasury_DE_f107 `Treasury_DE_f108 `Treasury_DE_f109 `Treasury_DE_f110 `Treasury_DE_f111 `Treasury_DE_f112 `Treasury_DE_f113 `Treasury_DE_f114 `Treasury_DE_f115 `Treasury_DE_f116 `Treasury_DE_f117 `Treasury_DE_f118 `Treasury_DE_f119 `Treasury_DE_f120 `Treasury_DE_f121 `Treasury_DE_f122 `Treasury_DE_f123 `Treasury_DE_f124 `Treasury_DE_f125 `Treasury_DE_f126 `Treasury_DE_f127 `Treasury_DE_f128 `Treasury_DE_f129 `Treasury_DE_f130 `Treasury_DE_f131 `Treasury_DE_f132 `Treasury_DE_f133 `Treasury_DE_f134 `Treasury_DE_f135 `Treasury_DE_f136 `Treasury_DE_f137 `Treasury_DE_f138 `Treasury_DE_f139 `Treasury_DE_f140 `Treasury_DE_f141 `Treasury_DE_f142 `Treasury_DE_f143 `Treasury_DE_f144 `Treasury_DE_f145 `Treasury_DE_f146 `Treasury_DE_f147 `Treasury_DE_f148 `Treasury_DE_f149 `Treasury_DE_f150 `Treasury_DE_f151 `Treasury_DE_f152 `Treasury_DE_f153 `Treasury_DE_f154 `Treasury_DE_f155 `Treasury_DE_f156 `Treasury_DE_f157 `Treasury_DE_f158 `Treasury_DE_f159 `Treasury_DE_f160 `Treasury_DE_f161 `Treasury_DE_f162 `Treasury_DE_f163 `Treasury_DE_f164 `Treasury_DE_f165 `Treasury_DE_f166 `Treasury_DE_f167 `Treasury_DE_f168 `Treasury_DE_f169 `Treasury_DE_f170 `Treasury_DE_f171 `Treasury_DE_f172 `Treasury_DE_f173 `Treasury_DE_f174 `Treasury_DE_f175 `Treasury_DE_f176 `Treasury_DE_f177 `Treasury_DE_f178 `Treasury_DE_f179 `Treasury_DE_f180 `Treasury_DE_f181 `Treasury_DE_f182 `Treasury_DE_f183 `Treasury_DE_f184 `Treasury_DE_f185 `Treasury_DE_f186 `Treasury_DE_f187 `Treasury_DE_f188 `Treasury_DE_f189 `Treasury_DE_f190 `Treasury_DE_f191 `Treasury_DE_f192 `Treasury_DE_f193 `Treasury_DE_f194 `Treasury_DE_f195 `Treasury_DE_f196 `Treasury_DE_f197 `Treasury_DE_f198 `Treasury_DE_f199 `Treasury_DE_f200 `Treasury_GB_f0 `Treasury_GB_f1 `Treasury_GB_f2 `Treasury_GB_f3 `Treasury_GB_f4 `Treasury_GB_f5 `Treasury_GB_f6 `Treasury_GB_f7 `Treasury_GB_f8 `Treasury_GB_f9 `Treasury_GB_f10 `Treasury_GB_f11 `Treasury_GB_f12 `Treasury_GB_f13 `Treasury_GB_f14 `Treasury_GB_f15 `Treasury_GB_f16 `Treasury_GB_f17 `Treasury_GB_f18 `Treasury_GB_f19 `Treasury_GB_f20 `Treasury_GB_f21 `Treasury_GB_f22 `Treasury_GB_f23 `Treasury_GB_f24 `Treasury_GB_f25 `Treasury_GB_f26 `Treasury_GB_f27 `Treasury_GB_f28 `Treasury_GB_f29 `Treasury_GB_f30 `Treasury_GB_f31 `Treasury_GB_f32 `Treasury_GB_f33 `Treasury_GB_f34 `Treasury_GB_f35 `Treasury_GB_f36 `Treasury_GB_f37 `Treasury_GB_f38 `Treasury_GB_f39 `Treasury_GB_f40 `Treasury_GB_f41 `Treasury_GB_f42 `Treasury_GB_f43 `Treasury_GB_f44 `Treasury_GB_f45 `Treasury_GB_f46 `Treasury_GB_f47 `Treasury_GB_f48 `Treasury_GB_f49 `Treasury_GB_f50 `Treasury_GB_f51 `Treasury_GB_f52 `Treasury_GB_f53 `Treasury_GB_f54 `Treasury_GB_f55 `Treasury_GB_f56 `Treasury_GB_f57 `Treasury_GB_f58 `Treasury_GB_f59 `Treasury_GB_f60 `Treasury_GB_f61 `Treasury_GB_f62 `Treasury_GB_f63 `Treasury_GB_f64 `Treasury_GB_f65 `Treasury_GB_f66 `Treasury_GB_f67 `Treasury_GB_f68 `Treasury_GB_f69 `Treasury_GB_f70 `Treasury_GB_f71 `Treasury_GB_f72 `Treasury_GB_f73 `Treasury_GB_f74 `Treasury_GB_f75 `Treasury_GB_f76 `Treasury_GB_f77 `Treasury_GB_f78 `Treasury_GB_f79 `Treasury_GB_f80 `Treasury_GB_f81 `Treasury_GB_f82 `Treasury_GB_f83 `Treasury_GB_f84 `Treasury_GB_f85 `Treasury_GB_f86 `Treasury_GB_f87 `Treasury_GB_f88 `Treasury_GB_f89 `Treasury_GB_f90 `Treasury_GB_f91 `Treasury_GB_f92 `Treasury_GB_f93 `Treasury_GB_f94 `Treasury_GB_f95 `Treasury_GB_f96 `Treasury_GB_f97 `Treasury_GB_f98 `Treasury_GB_f99 `Treasury_GB_f100 `Treasury_GB_f101 `Treasury_GB_f102 `Treasury_GB_f103 `Treasury_GB_f104 `Treasury_GB_f105 `Treasury_GB_f106 `Treasury_GB_f107 `Treasury_GB_f108 `Treasury_GB_f109 `Treasury_GB_f110 `Treasury_GB_f111 `Treasury_GB_f112 `Treasury_GB_f113 `Treasury_GB_f114 `Treasury_GB_f115 `Treasury_GB_f116 `Treasury_GB_f117 `Treasury_GB_f118 `Treasury_GB_f119 `Treasury_GB_f120 `Treasury_GB_f121 `Treasury_GB_f122 `Treasury_GB_f123 `Treasury_GB_f124 `Treasury_GB_f125 `Treasury_GB_f126 `Treasury_GB_f127 `Treasury_GB_f128 `Treasury_GB_f129 `Treasury_GB_f130 `Treasury_GB_f131 `Treasury_GB_f132 `Treasury_GB_f133 `Treasury_GB_f134 `Treasury_GB_f135 `Treasury_GB_f136 `Treasury_GB_f137 `Treasury_GB_f138 `Treasury_GB_f139 `Treasury_GB_f140 `Treasury_GB_f141 `Treasury_GB_f142 `Treasury_GB_f143 `Treasury_GB_f144 `Treasury_GB_f145 `Treasury_GB_f146 `Treasury_GB_f147 `Treasury_GB_f148 `Treasury_GB_f149 `Treasury_GB_f150 `Treasury_GB_f151 `Treasury_GB_f152 `Treasury_GB_f153 `Treasury_GB_f154 `Treasury_GB_f155 `Treasury_GB_f156 `Treasury_GB_f157 `Treasury_GB_f158 `Treasury_GB_f159 `Treasury_GB_f160 `Treasury_GB_f161 `Treasury_GB_f162 `Treasury_GB_f163 `Treasury_GB_f164 `Treasury_GB_f165 `Treasury_GB_f166 `Treasury_GB_f167 `Treasury_GB_f168 `Treasury_GB_f169 `Treasury_GB_f170 `Treasury_GB_f171 `Treasury_GB_f172 `Treasury_GB_f173 `Treasury_GB_f174 `Treasury_GB_f175 `Treasury_GB_f176 `Treasury_GB_f177 `Treasury_GB_f178 `Treasury_GB_f179 `Treasury_GB_f180 `Treasury_GB_f181 `Treasury_GB_f182 `Treasury_GB_f183 `Treasury_GB_f184 `Treasury_GB_f185 `Treasury_GB_f186 `Treasury_GB_f187 `Treasury_GB_f188 `Treasury_GB_f189 `Treasury_GB_f190 `Treasury_GB_f191 `Treasury_GB_f192 `Treasury_GB_f193 `Treasury_GB_f194 `Treasury_GB_f195 `Treasury_GB_f196 `Treasury_GB_f197 `Treasury_GB_f198 `Treasury_GB_f199 `Treasury_GB_f200 `Treasury_US_f0 `Treasury_US_f1 `Treasury_US_f2 `Treasury_US_f3 `Treasury_US_f4 `Treasury_US_f5 `Treasury_US_f6 `Treasury_US_f7 `Treasury_US_f8 `Treasury_US_f9 `Treasury_US_f10 `Treasury_US_f11 `Treasury_US_f12 `Treasury_US_f13 `Treasury_US_f14 `Treasury_US_f15 `Treasury_US_f16 `Treasury_US_f17 `Treasury_US_f18 `Treasury_US_f19 `Treasury_US_f20 `Treasury_US_f21 `Treasury_US_f22 `Treasury_US_f23 `Treasury_US_f24 `Treasury_US_f25 `Treasury_US_f26 `Treasury_US_f27 `Treasury_US_f28 `Treasury_US_f29 `Treasury_US_f30 `Treasury_US_f31 `Treasury_US_f32 `Treasury_US_f33 `Treasury_US_f34 `Treasury_US_f35 `Treasury_US_f36 `Treasury_US_f37 `Treasury_US_f38 `Treasury_US_f39 `Treasury_US_f40 `Treasury_US_f41 `Treasury_US_f42 `Treasury_US_f43 `Treasury_US_f44 `Treasury_US_f45 `Treasury_US_f46 `Treasury_US_f47 `Treasury_US_f48 `Treasury_US_f49 `Treasury_US_f50 `Treasury_US_f51 `Treasury_US_f52 `Treasury_US_f53 `Treasury_US_f54 `Treasury_US_f55 `Treasury_US_f56 `Treasury_US_f57 `Treasury_US_f58 `Treasury_US_f59 `Treasury_US_f60 `Treasury_US_f61 `Treasury_US_f62 `Treasury_US_f63 `Treasury_US_f64 `Treasury_US_f65 `Treasury_US_f66 `Treasury_US_f67 `Treasury_US_f68 `Treasury_US_f69 `Treasury_US_f70 `Treasury_US_f71 `Treasury_US_f72 `Treasury_US_f73 `Treasury_US_f74 `Treasury_US_f75 `Treasury_US_f76 `Treasury_US_f77 `Treasury_US_f78 `Treasury_US_f79 `Treasury_US_f80 `Treasury_US_f81 `Treasury_US_f82 `Treasury_US_f83 `Treasury_US_f84 `Treasury_US_f85 `Treasury_US_f86 `Treasury_US_f87 `Treasury_US_f88 `Treasury_US_f89 `Treasury_US_f90 `Treasury_US_f91 `Treasury_US_f92 `Treasury_US_f93 `Treasury_US_f94 `Treasury_US_f95 `Treasury_US_f96 `Treasury_US_f97 `Treasury_US_f98 `Treasury_US_f99 `Treasury_US_f100 `Treasury_US_f101 `Treasury_US_f102 `Treasury_US_f103 `Treasury_US_f104 `Treasury_US_f105 `Treasury_US_f106 `Treasury_US_f107 `Treasury_US_f108 `Treasury_US_f109 `Treasury_US_f110 `Treasury_US_f111 `Treasury_US_f112 `Treasury_US_f113 `Treasury_US_f114 `Treasury_US_f115 `Treasury_US_f116 `Treasury_US_f117 `Treasury_US_f118 `Treasury_US_f119 `Treasury_US_f120 `Treasury_US_f121 `Treasury_US_f122 `Treasury_US_f123 `Treasury_US_f124 `Treasury_US_f125 `Treasury_US_f126 `Treasury_US_f127 `Treasury_US_f128 `Treasury_US_f129 `Treasury_US_f130 `Treasury_US_f131 `Treasury_US_f132 `Treasury_US_f133 `Treasury_US_f134 `Treasury_US_f135 `Treasury_US_f136 `Treasury_US_f137 `Treasury_US_f138 `Treasury_US_f139 `Treasury_US_f140 `Treasury_US_f141 `Treasury_US_f142 `Treasury_US_f143 `Treasury_US_f144 `Treasury_US_f145 `Treasury_US_f146 `Treasury_US_f147 `Treasury_US_f148 `Treasury_US_f149 `Treasury_US_f150 `Treasury_US_f151 `Treasury_US_f152 `Treasury_US_f153 `Treasury_US_f154 `Treasury_US_f155 `Treasury_US_f156 `Treasury_US_f157 `Treasury_US_f158 `Treasury_US_f159 `Treasury_US_f160 `Treasury_US_f161 `Treasury_US_f162 `Treasury_US_f163 `Treasury_US_f164 `Treasury_US_f165 `Treasury_US_f166 `Treasury_US_f167 `Treasury_US_f168 `Treasury_US_f169 `Treasury_US_f170 `Treasury_US_f171 `Treasury_US_f172 `Treasury_US_f173 `Treasury_US_f174 `Treasury_US_f175 `Treasury_US_f176 `Treasury_US_f177 `Treasury_US_f178 `Treasury_US_f179 `Treasury_US_f180 `Treasury_US_f181 `Treasury_US_f182 `Treasury_US_f183 `Treasury_US_f184 `Treasury_US_f185 `Treasury_US_f186 `Treasury_US_f187 `Treasury_US_f188 `Treasury_US_f189 `Treasury_US_f190 `Treasury_US_f191 `Treasury_US_f192 `Treasury_US_f193 `Treasury_US_f194 `Treasury_US_f195 `Treasury_US_f196 `Treasury_US_f197 `Treasury_US_f198 `Treasury_US_f199 `Treasury_US_f200 `Common_Stock_AU_Large_Cap `Common_Stock_CA_Large_Cap `Common_Stock_CH_Large_Cap `Common_Stock_DE_Large_Cap `Common_Stock_GB_Large_Cap `Common_Stock_US_Large_Cap `Common_Stock_DE_Other_Sector `Common_Stock_US_Mid_Cap `Common_Stock_US_Small_Cap `Common_Stock_US_Other_Sector `Asset_Class_Return_AUD `Asset_Class_Return_CAD `Asset_Class_Return_CHF `Asset_Class_Return_EUR `Asset_Class_Return_GBP `Asset_Class_Return_USD `Asset_Class_Return_Asset_Class_1 `Return_Class_Return_Return_Class_1
             )
            (`Active
             0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0
             ))
          .,(`j
             .((`c;`table;)
               (`cl
                .((`Source;`"Data Source";)
                  (`Item;`"GEMS Variable";)
                  (`Name;`"User-Specified\nName";)
                  (`Active;`"Include\nin Test";))
                )
               (`cell
                .,(`Active
                   .,(`c;`check;)
                   )
                )
               (`e
                .((`Item;0;)
                  (`Source;0;))
                )
               (`bg
                .((`Item;192192192;)
                  (`Source;192192192;))
                )
               (`f
                .,(`Name;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
                )
               (`g
                .,(`Name;{`$_ssr[x;" ";"_"]};)
                )
               (`u
                .,(`Name;{:[   ~x;				("";y)
		   ~#$y;			("";y)
		   y _in ` . .j.v,`Name;	(("&0 already exists as a Name";$y);x)
		   *@[.:;,(`$$y;);:];		("Must begin with a-z, A-Z and contain only a-z, A-Z, 0-9, and space";x)
						("";y)]};)
                )
               (`l;`Returns;)
               (`s
                ,(`Active;581)
                .()))
             )))
       .,(`j
          .((`c;`tab;)
            (`border;0;)
            (`tab;`possible_returns;.()))
          )))
    .,(`j
       .((`a
          (`o
           `OK `Apply `Cancel)
          )
         (`border;0;)
         (`c;`panel;)
         (`v;0;))
       ))
   (`s;;)
   (`t
    .,(`toggle
       `Pivot
       .,(`j
          .((`o
             ,`Pivot `Statistics `Martingale
             )
            (`border;0;)
            (`fill;`n;)
            (`anchor;`nw;)
            (`image
             .((`Pivot;"Pivot.gif";)
               (`Statistics;"Statistics.gif";)
               (`Martingale;"Martingale.gif";))
             )
            (`tip
             .((`Pivot;"Pivot";)
               (`Statistics;"Statistics";)
               (`Martingale;"Martingale";))
             )
            (`bg
             .((`Pivot;`w;)
               (`Statistics;`w;)
               (`Martingale;`w;))
             )
            (`margin
             .((`Pivot
                0 0 0 0
                )
               (`Statistics
                0 0 0 0
                )
               (`Martingale
                0 0 0 0
                ))
             )
            (`v;1;))
          ))
    .,(`j
       .((`border;0;)
         (`c;`panel;)
         (`scrollable;0;)
         (`wy;0.1;))
       ))
   (`r
    .((`ts
       .,(`text
          "<html><center><font size=3><font face=\"Helvetica\"><b>Company Name (set via Preferences)</b><br></font></font><font size=4><font face=\"Helvetica\"><b>Martingale Test Variables<br>Data by Period</b></font></font></center></html>"
          .,(`j
             .((`c;`label;)
               (`halign;`c;))
             ))
       .,(`j
          .((`wy;0.0;)
            (`c;`panel;)
            (`bg;`w;)
            (`border;0;)
            (`l;"";))
          ))
      (`mw
       1 1.009338 1.018968 1.02899 1.037964 1.046653 1.055963 1.065779 1.077184 1.089186 1.101002 1.113785 1.127689 1.14256 1.157199 1.17273 1.187705 1.203076 1.220498 1.239348 1.256527 1.273488 1.290064 1.306593 1.32323 1.339572 1.35713 1.374158 1.391352 1.408218 1.425671 1.443767 1.463096 1.483878 1.504646 1.526132 1.548629 1.572233 1.596337 1.619432 1.6425 1.666276 1.691523 1.717058 1.741586 1.767071 1.792645 1.818953 1.846286 1.876909 1.908279 1.941551 1.974988 2.007696 2.040539 2.07556 2.112937 2.149852 2.183905 2.218644 2.253184 2.288383 2.325217 2.361139 2.397339 2.435089 2.472987 2.511266 2.551572 2.592391 2.633653 2.67283 2.712913 2.753205 2.793774 2.834855 2.876063 2.921707 2.967281 3.014814 3.062769 0 7.021667e-017 0.0006710079 0.001327318 0.002015764 0.002823836 0.003549245 0.004389865 0.005320381 0.006733402 0.007923891 0.00931764 0.01080535 0.01233212 0.01403265 0.01517313 0.01595814 0.01653354 0.01768175 0.01869234 0.01982815 0.0208271 0.02176377 0.02301191 0.02431597 0.02572604 0.02715683 0.02846723 0.02959809 0.03072434 0.03174326 0.03267918 0.03338708 0.03422427 0.03508797 0.03540561 0.03532029 0.03520517 0.03517113 0.03534886 0.03572772 0.03628143 0.03711371 0.03843912 0.03941317 0.04028934 0.04129466 0.04245056 0.0440718 0.04577734 0.04711515 0.04891178 0.05052231 0.05180891 0.05327359 0.05480694 0.05673754 0.05850946 0.06075664 0.06255652 0.06424433 0.06588367 0.06848147 0.07033683 0.0723573 0.07470729 0.07733508 0.07969292 0.08233913 0.08547492 0.08789508 0.09063484 0.09335136 0.09652337 0.09960374 0.1022639 0.104835 0.1072653 0.109708 0.1121807
       .,(`j
          .((`border;0;)
            (`l;"";)
            (`ax
             .((`Return
                `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap"
                )
               (`Statistic
                `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score"
                )
               (`Year
                `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029"
                )
               (`Period
                `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4
                ))
             )
            (`axo
             .((`Return
                `"Treasury AU f1" `"Treasury CH f168" `"Treasury CH f179" `"Common Stock US Large Cap"
                )
               (`Statistic
                `Mean `"Standard Deviation" `"Z Score"
                )
               (`Year
                `"2009" `"2010" `"2011" `"2012" `"2013" `"2014" `"2015" `"2016" `"2017" `"2018" `"2019" `"2020" `"2021" `"2022" `"2023" `"2024" `"2025" `"2026" `"2027" `"2028" `"2029"
                )
               (`Period
                `Q1 `Q2 `Q3 `Q4
                ))
             )
            (`a
             (`Year `Period
              `Return `Statistic)
             )
            (`c;`Pivot_;)
            (`sg;`w;)
            (`f;21.0;)
            (`e;0;)
            (`s;;)
            (`sr;;)
            (`sc;;)
            (`S;;)
            (`SR;;)
            (`SC;;)
            (`SRC;;)
            (`popup
             .((`All;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`All;v;of[c;`all_;,v])]};)
               (`None;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`None;v;())]};)
               (`s0;" ";)
               (`Only;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Only;v;of[c;`selected_;,v])]};)
               (`Except;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Except;v;of[cl v;`all_;,v]_dvl of[c;`selected_;,v])]};)
               (`s1;" ";)
               (`With;{[x]C.Data_.With_v[x;ad -2_.j.v]};)
               (`Without;{[x]C.Data_.Without_v[x;ad -2_.j.v]};)
               (`In;{[x]c:cl v:ad -2_.j.v;s:of[c;`get_;,v];of[c;`set_;(`In;v;s@&s _lin of[c;`selected_;,v])]};)
               (`s2;" ";)
               (`Up;{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;<:)]};)
               (`Down;{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;>:)]};)
               (`s3;" ";)
               (`Copy_Selection;{[x]c:cl v:ad -2_.j.v;of[c;`copy_;(c;v)]};)
               (`Paste_Selection;{[x]c:cl v:ad -2_.j.v;of[c;`paste_;(c;v)]};)
               (`s99;" ";)
               (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
               (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
               (`Flip;{[w;junk].[`;w,`a;|:];fire_t w,`a}[`k `r `r `mw. `j];)
               (`Rows;{[w;junk]C.Axes.Swap_[w;::]}[`k `r `r `mw. `j];)
               (`Cols;{[w;junk]C.Axes.Swap_[w;|:]}[`k `r `r `mw. `j];))
             .,(`j
                .,(`ne
                   ((,`All
                     ,`None
                     ,`s0
                     ,`Only
                     ,`Except
                     ,`s1
                     ,`With
                     ,`Without
                     ,`In
                     ,`s2
                     ,`Up
                     ,`Down
                     ,`s3
                     ,`Copy_Selection
                     ,`Paste_Selection
                     ,`Copy
                     ,`Copy_All
                     ,`s99
                     ,`Flip
                     ,`Rows
                     ,`Cols)
                    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0)
                   )
                ))
            (`kk;{c:cl .j.v;the[c]'[`With_v`Without_v][|/,//of[c;`true;,.j.v]=`. jd[.j.v],`bg,.j.i][_n;.j.v]};)
            (`krd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
            (`bg
             `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w
             .())
            (`rclbg
             .((`Return
                `w `w `w `w
                )
               (`Statistic
                `w `w `w
                )
               (`Year
                `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w
                )
               (`Period
                `w `w `w `w
                ))
             .())
            (`rclkk;{c:cl .j.v;the[c]'[`With_v`Without_v][|/,//of[c;`true;,.j.v]=`. jd[.j.v],`bg,.j.i][_n;.j.v]};)
            (`rclkrd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
            (`alkrd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
            (`albg;{:[(`a;*.j.i)~att[v;`S];0]};)
            (`alfg;{:[(`a;*.j.i)~att[v;`S];`n]};)
            (`kd;{.[`;jd[.j.v],`S;:;_n];{.[`;jd[.j.v],x;::]}'`alfg`albg;{.[`;jd[.j.v],x;:;()]}'`sr`sc;};)
            (`alkd;{.[`;jd[.j.v],`S;:;(`a;*.j.i)];{.[`;jd[.j.v],x;::]}'`alfg`albg;{.[`;jd[.j.v],x;:;()]}'`sr`sc`s;};)
            (`rclkd;{.[`;jd[.j.v],`S;:;(`rc;*.j.i)];{.[`;jd[.j.v],x;::]}'`alfg`albg;.[`;jd[.j.v],`s;:;()]};))
          ))
      (`tb
       .((`Flip
          {.[`;(-2 _ .j.v),(~`mw),`j`a;|:]}
          .,(`j
             .((`image;"Flip_32.png";)
               (`help;"Flip Axes";)
               (`l;"";)
               (`c;`button;))
             ))
         (`Cols
          {.[`;(-2 _ .j.v),(~`mw),`j`a;{(0#`;,/x)}]}
          .,(`j
             .((`image;"Columns_32.png";)
               (`help;"Columns";)
               (`l;"";)
               (`c;`button;))
             ))
         (`Rows
          {.[`;(-2 _ .j.v),(~`mw),`j`a;{(,/x;0#`)}]}
          .,(`j
             .((`image;"Rows_32.png";)
               (`help;"Rows";)
               (`l;"";)
               (`c;`button;))
             )))
       .,(`j
          .((`c;`toolbar;)
            (`panel;0;)
            (`wy;0.0;)
            (`border;0;)
            (`l;"";))
          )))
    .((`sims
       ,`Gem_Test_All_Assets_Noah
       )
      (`simd
       ,`s0
       )
      (`Gs
       ,.((`G
           .((`ruin_rbc_factor;1.0;)
             (`tsi
              0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80
              )
             (`tfi
              1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80
              )
             (`tfi0
              0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80
              )
             (`tfiye
              4 8 12 16 20 24 28 32 36 40 44 48 52 56 60 64 68 72 76 80
              )
             (`tfi0ye
              0 4 8 12 16 20 24 28 32 36 40 44 48 52 56 60 64 68 72 76 80
              )
             (`tsc
              `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
              )
             (`tfc
              `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
              )
             (`tfc0
              `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
              )
             (`tfcye
              `"2010" `"2011" `"2012" `"2013" `"2014" `"2015" `"2016" `"2017" `"2018" `"2019" `"2020" `"2021" `"2022" `"2023" `"2024" `"2025" `"2026" `"2027" `"2028" `"2029"
              )
             (`tfc0ye
              `"2009" `"2010" `"2011" `"2012" `"2013" `"2014" `"2015" `"2016" `"2017" `"2018" `"2019" `"2020" `"2021" `"2022" `"2023" `"2024" `"2025" `"2026" `"2027" `"2028" `"2029"
              )
             (`nsp;80;)
             (`pdy;4;)
             (`fyr;2010;)
             (`npa;5;)
             (`ipc;0;)
             (`modules
              `gems `no_user_values
              )
             (`submodules
              `GEMS `Economic_Variables `Financial_Markets `Developer
              )
             (`axes
              .((`Library_Pattern
                 .,(`Library_Pattern_1;1;)
                 )
                (`Greek
                 .,(`Greek_1;1;)
                 )
                (`Function
                 .,(`Function_1;1;)
                 )
                (`Transform
                 .,(`Transform_1;1;)
                 )
                (`Life_Table
                 .,(`Life_Table_1;1;)
                 )
                (`Compression
                 .,(`Compression_1;1;)
                 )
                (`Inner_Loop
                 .,(`Inner_Loop_1;1;)
                 )
                (`Risk_Class
                 .,(`Risk_Class_1;1;)
                 )
                (`Asset_Class
                 .((`AAA_Corporate_Bonds_Summary;0;)
                   (`AA_Corporate_Bonds_Summary;0;)
                   (`A_Corporate_Bonds_Summary;0;)
                   (`A_plus_Corporate_Bonds_Summary;0;)
                   (`BBB_Corporate_Bonds_Summary;0;)
                   (`High_Yield_Corporate_Bonds_Summary;0;)
                   (`Default_Corporate_Bonds_Summary;0;)
                   (`Class_1_Preferred_Stock_Summary;0;)
                   (`BBB_Preferred_Stock_Summary;0;)
                   (`High_Yield_Preferred_Stock_Summary;0;)
                   (`Default_Preferred_Stock_Summary;0;)
                   (`Treasury_Bonds_Summary;0;)
                   (`State_GO_Bonds_Summary;0;)
                   (`Pfandbriefe_Summary;0;)
                   (`Schuldschein_Pools_Summary;0;)
                   (`Alternative_Assets_Bond_Model_Class_Summary;0;)
                   (`Unquoted_Summary;0;)
                   (`Mortgage_Securities_Summary;0;)
                   (`German_Style_Mortgage_Summary;0;)
                   (`Common_Stock_Market_Indices_Summary;0;)
                   (`Property_Market_Indices_Summary;0;)
                   (`Fixed_Income_Market_Indices_Summary;0;)
                   (`Alternative_Asset_Market_Indices_Summary;0;)
                   (`Preferred_Stock_Market_Indices_Summary;0;)
                   (`Property_Model_Summary;0;)
                   (`FRN_Instruments_Summary;0;)
                   (`Interest_Rate_Derivatives_Summary;0;)
                   (`Equity_Derivatives_Summary;0;)
                   (`Common_Stock_Affiliates_Summary;0;)
                   (`Preferred_Stock_Affiliates_Summary;0;)
                   (`Debt_Affiliates_Summary;0;)
                   (`Class_0_Bonds_Summary;0;)
                   (`Class_1_Bonds_Summary;0;)
                   (`Corporate_Bonds_Summary;0;)
                   (`Preferred_Stock_Summary;0;)
                   (`Preferred_Stock_Model_Summary;0;)
                   (`Bonds_Model_Class_Summary;0;)
                   (`Mortgages_Summary;0;)
                   (`Common_Stock_Summary;0;)
                   (`Stock_Summary;0;)
                   (`HGB_Stock_Summary;0;)
                   (`Property_Summary;0;)
                   (`Taxable_Bonds_Summary;0;)
                   (`Tax_Exempt_Bonds_Summary;0;)
                   (`Bonds_Summary;0;)
                   (`HGB_Bonds_Summary;0;)
                   (`Fixed_Income_Summary;0;)
                   (`Derivatives_Summary;0;)
                   (`HGB_Other_Summary;0;)
                   (`Investments_in_Affiliates_Summary;0;)
                   (`Alternative_Assets_Summary;0;)
                   (`All_Investments_Summary;0;)
                   (`Common_Stock_except_Affiliates_Summary;0;)
                   (`Bonds_except_Affiliates_Summary;0;)
                   (`Taxable_Bonds_except_Affiliates_Summary;0;)
                   (`Preferred_Stock_except_Affiliates_Summary;0;)
                   (`Stock_except_Affiliates_Summary;0;)
                   (`Stock_in_Affiliates_Summary;0;)
                   (`Decision_Class_1_Decision;0;)
                   (`Bonds_Decision;0;)
                   (`Preferred_Stock_Decision;0;)
                   (`Alternative_Assets_Decision;0;)
                   (`Treasury_Bonds_Decision;0;)
                   (`Corporate_Bonds_Decision;0;)
                   (`Investment_Grade_Bonds_Decision;0;)
                   (`Investment_Grade_Corporate_Bonds_Decision;0;)
                   (`Taxable_Bonds_Decision;0;)
                   (`Tax_Exempt_Bonds_Decision;0;)
                   (`Risk_Free_Bonds_Decision;0;)
                   (`AAA_Rated_Bonds_Decision;0;)
                   (`AA_Rated_Bonds_Decision;0;)
                   (`A_Rated_Bonds_Decision;0;)
                   (`BBB_Rated_Bonds_Decision;0;)
                   (`High_Yield_Bonds_Decision;0;)
                   (`Bonds_Rated_AAA_or_Lower_Decision;0;)
                   (`Bonds_Rated_AA_or_Lower_Decision;0;)
                   (`Bonds_Rated_A_or_Lower_Decision;0;)
                   (`Bonds_Rated_BBB_or_Lower_Decision;0;)
                   (`Bonds_Rated_High_Yield_or_Lower_Decision;0;)
                   (`Bonds_Maturing_Within_1_Year_Decision;0;)
                   (`Bonds_Maturing_Within_2_Years_Decision;0;)
                   (`Bonds_Maturing_Within_3_Years_Decision;0;)
                   (`Bonds_Maturing_Within_5_Years_Decision;0;)
                   (`Bonds_Maturing_Within_7_Years_Decision;0;)
                   (`Bonds_Maturing_Within_10_Years_Decision;0;)
                   (`Bonds_Maturing_Within_15_Years_Decision;0;)
                   (`Pfandbriefe_Decision;0;)
                   (`Schuldschein_Pools_Decision;0;)
                   (`Mortgages_Decision;0;)
                   (`Mortgage_Backed_Securities_Decision;0;)
                   (`German_Style_Mortgages_Decision;0;)
                   (`CMOs_Decision;0;)
                   (`Sequential_CMO_Tranches_Decision;0;)
                   (`VADM_CMO_Tranches_Decision;0;)
                   (`PAC_CMO_Tranches_Decision;0;)
                   (`Scheduled_CMO_Tranches_Decision;0;)
                   (`Support_CMO_Tranches_Decision;0;)
                   (`SoftZ_CMO_Tranches_Decision;0;)
                   (`HardZ_CMO_Tranches_Decision;0;)
                   (`Common_Stock_Decision;0;)
                   (`Common_Stock_Large_Cap_Decision;0;)
                   (`Property_Decision;0;)
                   (`Residential_Property_Decision;0;)
                   (`Office_Property_Decision;0;)
                   (`Retail_Property_Decision;0;)
                   (`Interest_Rate_Derivatives_Decision;0;)
                   (`Caps_Decision;0;)
                   (`Floors_Decision;0;)
                   (`Swaps_Decision;0;)
                   (`FRNs_Decision;0;)
                   (`RFRNs_Decision;0;)
                   (`FRNnCs_Decision;0;)
                   (`cRFRNs_Decision;0;)
                   (`RFRN_Options_Decision;0;)
                   (`Floating_Coupon_Decision;0;)
                   (`Bond_Options_Decision;0;)
                   (`Receiver_Swaptions_Decision;0;)
                   (`Annuity_Settlement_Swaptions_Decision;0;)
                   (`Annuity_Settlements_Decision;0;)
                   (`Equity_Derivatives_Decision;0;)
                   (`Equity_Put_Options_Decision;0;)
                   (`Equity_Call_Options_Decision;0;)
                   (`Large_Cap_Options_Decision;0;)
                   (`Mid_Cap_Options_Decision;0;)
                   (`Small_Cap_Options_Decision;0;)
                   (`Broad_Cap_Options_Decision;0;)
                   (`Other_Sector_Options_Decision;0;)
                   (`Large_Cap_Puts_Decision;0;)
                   (`Large_Cap_Calls_Decision;0;)
                   (`Mid_Cap_Puts_Decision;0;)
                   (`Mid_Cap_Calls_Decision;0;)
                   (`Small_Cap_Puts_Decision;0;)
                   (`Small_Cap_Calls_Decision;0;)
                   (`Broad_Cap_Puts_Decision;0;)
                   (`Broad_Cap_Calls_Decision;0;)
                   (`Other_Sector_Puts_Decision;0;)
                   (`Other_Sector_Calls_Decision;0;)
                   (`Alternative_Asset_Market_Indices_Decision;0;)
                   (`Alternative_Assets_Bond_Model_Class_Decision;0;)
                   (`Preferred_Stock_Market_Indices_Decision;0;)
                   (`Preferred_Stock_Model_Decision;0;)
                   (`Property_Market_Indices_Decision;0;)
                   (`Property_Model_Decision;0;)
                   (`Fixed_Income_Market_Indices_Decision;0;)
                   (`Common_Stock_Broad_Cap_Decision;0;)
                   (`Common_Stock_Mid_Cap_Decision;0;)
                   (`Common_Stock_Small_Cap_Decision;0;)
                   (`Common_Stock_Other_Sector_Decision;0;)
                   (`Asset_Class_1;1;))
                 )
                (`HGB_Equalization_Line
                 .,(`HGB_Equalization_Line_1;1;)
                 )
                (`Claim_Cost_Index
                 .,(`Claim_Cost_Index_1;1;)
                 )
                (`Financing_Instrument
                 .((`Financing_Instrument_1;1;)
                   (`Common_Stock;1;))
                 )
                (`Supplemental_Model
                 .,(`Supplemental_Model_1;1;)
                 )
                (`Portfolio
                 .((`Portfolio_1;1;)
                   (`Direct;1;)
                   (`Fund_1;1;))
                 )
                (`Entity
                 .,(`Entity_1;1;)
                 )
                (`User_Value
                 .,(`User_Value_1;1;)
                 )
                (`Consolidation
                 .,(`Consolidation_1;1;)
                 )
                (`Peril
                 .,(`Peril_1;1;)
                 )
                (`Product
                 .,(`Product_1;1;)
                 )
                (`Product_Group
                 .,(`Product_Group_1;1;)
                 )
                (`Treaty
                 .,(`Treaty_1;1;)
                 )
                (`Treaty_Group
                 .,(`Treaty_Group_1;1;)
                 )
                (`Life_Product
                 .,(`Life_Product_1;1;)
                 )
                (`Plan
                 .,(`Plan_1;1;)
                 )
                (`Counterparty
                 .,(`Counterparty_1;1;)
                 )
                (`Lookup
                 .,(`Lookup_1;1;)
                 )
                (`State
                 .,(`State_1;1;)
                 )
                (`Transition
                 .,(`Transition_1;1;)
                 )
                (`Return_Class
                 .,(`Return_Class_1;1;)
                 )
                (`Market_Index
                 .((`Barra_E0;1;)
                   (`Barra_EC;1;)
                   (`Barra_TR;1;)
                   (`CISDMFOF_E0;1;)
                   (`CISDMFOF_EC;1;)
                   (`CISDMFOF_TR;1;)
                   (`LSTPE_E0;1;)
                   (`LSTPE_EC;1;)
                   (`LSTPE_TR;1;)
                   (`MSCI_E0;1;)
                   (`MSCI_EC;1;)
                   (`MSCI_TR;1;)
                   (`US14_E0;0;)
                   (`US14_EC;0;)
                   (`US14_TR;0;)
                   (`LPXEUR;1;)
                   (`ASX_E0;0;)
                   (`ASX_EC;0;)
                   (`ASX;0;)
                   (`AUD_E0;0;)
                   (`AUD_EC;0;)
                   (`AUD;0;)
                   (`AUCPI_E0;0;)
                   (`AUCPI_EC;0;)
                   (`AUCPI;0;)
                   (`AUIPD_E0;0;)
                   (`AUIPD_EC;0;)
                   (`AUIPD;1;)
                   (`AUTR35_E0;0;)
                   (`AUTR35_EC;0;)
                   (`AUTR35;0;)
                   (`DE_SX5E;0;)
                   (`DE_TR10Y;0;)
                   (`DE_TR1Y;0;)
                   (`Market_Index_11;1;))
                 )
                (`User_Relative_Value
                 .,(`User_Relative_Value_1;1;)
                 )
                (`QIS5_Region
                 .,(`QIS5_Region_1;1;)
                 )
                (`QIS5_Line
                 .,(`QIS5_Line_1;1;)
                 ))
              )
             (`tax_rate;0.35;)
             (`property_use
              .((`Residential
                 .((`Price;1000.0;)
                   (`Sustainable_Rent;25.0;)
                   (`Depreciation_Rate;0.03;)
                   (`Expenses_Per_Square_Meter;0.25;)
                   (`Expenses_Per_Rent;0.05;)
                   (`Vacancy_Rate;0.03;)
                   (`Useful_Lifetime;40.0;)
                   (`Land_Value_Ratio;0.2;)
                   (`Trade_Cost_Buying;0.03;)
                   (`Trade_Cost_Selling;0.0;)
                   (`Selling_Bound;25000.0;)
                   (`Regulated;1.0;)
                   (`CPI;0.0;)
                   (`Stepped;0.0;)
                   (`Fixed;0.0;)
                   (`Purchase_Portfolio;`All;)
                   (`Price_Ratio;0.6130076;)
                   (`Leases
                    ,0
                    )
                   (`Weights
                    ,1.0
                    )
                   (`Starting_GEMS_Rent;105.16;)
                   (`Period_Depreciation;0.9924141;))
                 )
                (`Office
                 .((`Price;1000.0;)
                   (`Sustainable_Rent;25.0;)
                   (`Depreciation_Rate;0.03;)
                   (`Expenses_Per_Square_Meter;0.25;)
                   (`Expenses_Per_Rent;0.05;)
                   (`Vacancy_Rate;0.03;)
                   (`Useful_Lifetime;40.0;)
                   (`Land_Value_Ratio;0.2;)
                   (`Trade_Cost_Buying;0.03;)
                   (`Trade_Cost_Selling;0.0;)
                   (`Selling_Bound;25000.0;)
                   (`Regulated;0.0;)
                   (`CPI;1.0;)
                   (`Stepped;0.0;)
                   (`Fixed;0.0;)
                   (`Purchase_Portfolio;`All;)
                   (`Price_Ratio;0.2848727;)
                   (`Leases
                    ,1
                    )
                   (`Weights
                    ,1.0
                    )
                   (`Starting_GEMS_Rent;196.1;)
                   (`Period_Depreciation;0.9924141;))
                 )
                (`Retail
                 .((`Price;1000.0;)
                   (`Sustainable_Rent;25.0;)
                   (`Depreciation_Rate;0.03;)
                   (`Expenses_Per_Square_Meter;0.25;)
                   (`Expenses_Per_Rent;0.05;)
                   (`Vacancy_Rate;0.03;)
                   (`Useful_Lifetime;40.0;)
                   (`Land_Value_Ratio;0.2;)
                   (`Trade_Cost_Buying;0.03;)
                   (`Trade_Cost_Selling;0.0;)
                   (`Selling_Bound;25000.0;)
                   (`Regulated;0.0;)
                   (`CPI;1.0;)
                   (`Stepped;0.0;)
                   (`Fixed;0.0;)
                   (`Purchase_Portfolio;`All;)
                   (`Price_Ratio;0.03354241;)
                   (`Leases
                    ,1
                    )
                   (`Weights
                    ,1.0
                    )
                   (`Starting_GEMS_Rent;1528.0;)
                   (`Period_Depreciation;0.9924141;))
                 ))
              )
             (`economies
              `US `DE `GB `CH `AU `CA
              )
             (`econ_info
              .((`AF
                 .((`Currency;`AFN;)
                   (`FX_Pair
                    `AFN `USD
                    )
                   (`Economy_Verbose;`"Afghanistan (AF)";)
                   (`Currency_Verbose;`"Afghan Afghani (AFN)";)
                   (`Currency_Symbol;"AFN";)
                   (`GDP_Units;1000000.0;))
                 )
                (`AR
                 .((`Currency;`ARS;)
                   (`FX_Pair
                    `ARS `USD
                    )
                   (`Economy_Verbose;`"Argentina (AR)";)
                   (`Currency_Verbose;`"Argentine Peso (ARS)";)
                   (`Currency_Symbol;"ARS";)
                   (`GDP_Units;1000000.0;))
                 )
                (`AU
                 .((`Currency;`AUD;)
                   (`FX_Pair
                    `USD `AUD
                    )
                   (`Economy_Verbose;`"Australia (AU)";)
                   (`Currency_Verbose;`"Australian Dollar (AUD)";)
                   (`Currency_Symbol;"AUD";)
                   (`GDP_Units;1000000.0;))
                 )
                (`BR
                 .((`Currency;`BRL;)
                   (`FX_Pair
                    `BRL `USD
                    )
                   (`Economy_Verbose;`"Brazil (BR)";)
                   (`Currency_Verbose;`"Brazilian Real (BRL)";)
                   (`Currency_Symbol;"BRL";)
                   (`GDP_Units;1000000.0;))
                 )
                (`CA
                 .((`Currency;`CAD;)
                   (`FX_Pair
                    `CAD `USD
                    )
                   (`Economy_Verbose;`"Canada (CA)";)
                   (`Currency_Verbose;`"Canadian Dollar (CAD)";)
                   (`Currency_Symbol;"CAD";)
                   (`GDP_Units;2.5008;))
                 )
                (`CH
                 .((`Currency;`CHF;)
                   (`FX_Pair
                    `CHF `USD
                    )
                   (`Economy_Verbose;`"Switzerland (CH)";)
                   (`Currency_Verbose;`"Swiss Franc (CHF)";)
                   (`Currency_Symbol;"CHF";)
                   (`GDP_Units;1000000.0;))
                 )
                (`CL
                 .((`Currency;`CLP;)
                   (`FX_Pair
                    `CLP `USD
                    )
                   (`Economy_Verbose;`"Chile (CL)";)
                   (`Currency_Verbose;`"Chilean Peso (CLP)";)
                   (`Currency_Symbol;"CLP";)
                   (`GDP_Units;1000000.0;))
                 )
                (`CN
                 .((`Currency;`CNY;)
                   (`FX_Pair
                    `CNY `USD
                    )
                   (`Economy_Verbose;`"China (CN)";)
                   (`Currency_Verbose;`"Chinese Yuan (CNY)";)
                   (`Currency_Symbol;"CNY";)
                   (`GDP_Units;1000000.0;))
                 )
                (`CZ
                 .((`Currency;`CZK;)
                   (`FX_Pair
                    `CZK `USD
                    )
                   (`Economy_Verbose;`"Czech Republic (CZ)";)
                   (`Currency_Verbose;`"Czech Koruna (CZK)";)
                   (`Currency_Symbol;"CZK";)
                   (`GDP_Units;1000000.0;))
                 )
                (`DE
                 .((`Currency;`EUR;)
                   (`FX_Pair
                    `USD `EUR
                    )
                   (`Economy_Verbose;`"Germany (DE)";)
                   (`Currency_Verbose;`"Euro (EUR)";)
                   (`Currency_Symbol;"\200";)
                   (`GDP_Units;1000000.0;))
                 )
                (`DK
                 .((`Currency;`DKK;)
                   (`FX_Pair
                    `DKK `USD
                    )
                   (`Economy_Verbose;`"Denmark (DK)";)
                   (`Currency_Verbose;`"Danish Krone (DKK)";)
                   (`Currency_Symbol;"DKK";)
                   (`GDP_Units;1000000.0;))
                 )
                (`GB
                 .((`Currency;`GBP;)
                   (`FX_Pair
                    `USD `GBP
                    )
                   (`Economy_Verbose;`"Great Britain (GB)";)
                   (`Currency_Verbose;`"British Pound (GBP)";)
                   (`Currency_Symbol;"\243";)
                   (`GDP_Units;1000000.0;))
                 )
                (`HK
                 .((`Currency;`HKD;)
                   (`FX_Pair
                    `HKD `USD
                    )
                   (`Economy_Verbose;`"Hong Kong (HK)";)
                   (`Currency_Verbose;`"Hong Kong Dollar (HKD)";)
                   (`Currency_Symbol;"HKD";)
                   (`GDP_Units;1000000.0;))
                 )
                (`HU
                 .((`Currency;`HUF;)
                   (`FX_Pair
                    `HUF `USD
                    )
                   (`Economy_Verbose;`"Hungary (HU)";)
                   (`Currency_Verbose;`"Hungarian Forint (HUF)";)
                   (`Currency_Symbol;"HUF";)
                   (`GDP_Units;1000000.0;))
                 )
                (`ID
                 .((`Currency;`IDR;)
                   (`FX_Pair
                    `IDR `USD
                    )
                   (`Economy_Verbose;`"Indonesia (ID)";)
                   (`Currency_Verbose;`"Indonesian Rupiah (IDR)";)
                   (`Currency_Symbol;"IDR";)
                   (`GDP_Units;1000000.0;))
                 )
                (`IL
                 .((`Currency;`ILS;)
                   (`FX_Pair
                    `ILS `USD
                    )
                   (`Economy_Verbose;`"Israel (IL)";)
                   (`Currency_Verbose;`"Israeli Shekel (ILS)";)
                   (`Currency_Symbol;"ILS";)
                   (`GDP_Units;1000000.0;))
                 )
                (`IN
                 .((`Currency;`INR;)
                   (`FX_Pair
                    `INR `USD
                    )
                   (`Economy_Verbose;`"India (IN)";)
                   (`Currency_Verbose;`"Indian Rupee (INR)";)
                   (`Currency_Symbol;"INR";)
                   (`GDP_Units;1000000.0;))
                 )
                (`JM
                 .((`Currency;`JMD;)
                   (`FX_Pair
                    `JMD `USD
                    )
                   (`Economy_Verbose;`"Jamaica (JM)";)
                   (`Currency_Verbose;`"Jamaican Dollar (JMD)";)
                   (`Currency_Symbol;"JMD";)
                   (`GDP_Units;1000000.0;))
                 )
                (`JP
                 .((`Currency;`JPY;)
                   (`FX_Pair
                    `JPY `USD
                    )
                   (`Economy_Verbose;`"Japan (JP)";)
                   (`Currency_Verbose;`"Japanese Yen (JPY)";)
                   (`Currency_Symbol;"\245";)
                   (`GDP_Units;2.5008;))
                 )
                (`KR
                 .((`Currency;`KRW;)
                   (`FX_Pair
                    `KRW `USD
                    )
                   (`Economy_Verbose;`"South Korea (KR)";)
                   (`Currency_Verbose;`"South Korean Won (KRW)";)
                   (`Currency_Symbol;"KRW";)
                   (`GDP_Units;1000000.0;))
                 )
                (`MX
                 .((`Currency;`MXN;)
                   (`FX_Pair
                    `MXN `USD
                    )
                   (`Economy_Verbose;`"Mexico (MX)";)
                   (`Currency_Verbose;`"Mexican Peso (MXN)";)
                   (`Currency_Symbol;"MXN";)
                   (`GDP_Units;1000000.0;))
                 )
                (`MY
                 .((`Currency;`MYR;)
                   (`FX_Pair
                    `MYR `USD
                    )
                   (`Economy_Verbose;`"Malaysia (MY)";)
                   (`Currency_Verbose;`"Malaysian Ringgit (MYR)";)
                   (`Currency_Symbol;"MYR";)
                   (`GDP_Units;1000000.0;))
                 )
                (`NO
                 .((`Currency;`NOK;)
                   (`FX_Pair
                    `NOK `USD
                    )
                   (`Economy_Verbose;`"Norway (NO)";)
                   (`Currency_Verbose;`"Norwaegian Krone (NOK)";)
                   (`Currency_Symbol;"NOK";)
                   (`GDP_Units;1000000.0;))
                 )
                (`NZ
                 .((`Currency;`NZD;)
                   (`FX_Pair
                    `USD `NZD
                    )
                   (`Economy_Verbose;`"New Zealand (NZ)";)
                   (`Currency_Verbose;`"New Zealand Dollar (NZD)";)
                   (`Currency_Symbol;"NZD";)
                   (`GDP_Units;1000000.0;))
                 )
                (`PL
                 .((`Currency;`PLN;)
                   (`FX_Pair
                    `PLN `USD
                    )
                   (`Economy_Verbose;`"Poland (PL)";)
                   (`Currency_Verbose;`"Polish Zloty (PLN)";)
                   (`Currency_Symbol;"PLN";)
                   (`GDP_Units;1000000.0;))
                 )
                (`RU
                 .((`Currency;`RUB;)
                   (`FX_Pair
                    `RUB `USD
                    )
                   (`Economy_Verbose;`"Russia (RU)";)
                   (`Currency_Verbose;`"Russian Ruble (RUB)";)
                   (`Currency_Symbol;"RUB";)
                   (`GDP_Units;1000000.0;))
                 )
                (`SA
                 .((`Currency;`SAR;)
                   (`FX_Pair
                    `SAR `USD
                    )
                   (`Economy_Verbose;`"Saudi Arabia (SA)";)
                   (`Currency_Verbose;`"Saudi Arabian Riyal (SAR)";)
                   (`Currency_Symbol;"SAR";)
                   (`GDP_Units;1000000.0;))
                 )
                (`SE
                 .((`Currency;`SEK;)
                   (`FX_Pair
                    `SEK `USD
                    )
                   (`Economy_Verbose;`"Sweden (SE)";)
                   (`Currency_Verbose;`"Swedish Krona (SEK)";)
                   (`Currency_Symbol;"SEK";)
                   (`GDP_Units;1000000.0;))
                 )
                (`SG
                 .((`Currency;`SGD;)
                   (`FX_Pair
                    `SGD `USD
                    )
                   (`Economy_Verbose;`"Singapore (SG)";)
                   (`Currency_Verbose;`"Singapore Dollar (SGD)";)
                   (`Currency_Symbol;"SGD";)
                   (`GDP_Units;1000000.0;))
                 )
                (`TH
                 .((`Currency;`THB;)
                   (`FX_Pair
                    `THB `USD
                    )
                   (`Economy_Verbose;`"Thailand (TH)";)
                   (`Currency_Verbose;`"Thai Baht (THB)";)
                   (`Currency_Symbol;"THB";)
                   (`GDP_Units;1000000.0;))
                 )
                (`TR
                 .((`Currency;`TRY;)
                   (`FX_Pair
                    `TRY `USD
                    )
                   (`Economy_Verbose;`"Turkey (TR)";)
                   (`Currency_Verbose;`"Turkish Lira (TRY)";)
                   (`Currency_Symbol;"TRY";)
                   (`GDP_Units;1000000.0;))
                 )
                (`TT
                 .((`Currency;`TTD;)
                   (`FX_Pair
                    `TTD `USD
                    )
                   (`Economy_Verbose;`"Trinidad and Tobago (TT)";)
                   (`Currency_Verbose;`"Trinidad and Tobago Dollar (TTD)";)
                   (`Currency_Symbol;"TTD";)
                   (`GDP_Units;1000000.0;))
                 )
                (`TW
                 .((`Currency;`TWD;)
                   (`FX_Pair
                    `TWD `USD
                    )
                   (`Economy_Verbose;`"Taiwan (TW)";)
                   (`Currency_Verbose;`"Taiwan Dollar (TWD)";)
                   (`Currency_Symbol;"TWD";)
                   (`GDP_Units;1000000.0;))
                 )
                (`US
                 .((`Currency;`USD;)
                   (`FX_Pair
                    `USD `USD
                    )
                   (`Economy_Verbose;`"United States (US)";)
                   (`Currency_Verbose;`"US Dollar (USD)";)
                   (`Currency_Symbol;"$";)
                   (`GDP_Units;250000;))
                 )
                (`VN
                 .((`Currency;`VND;)
                   (`FX_Pair
                    `VND `USD
                    )
                   (`Economy_Verbose;`"Vietnam (VN)";)
                   (`Currency_Verbose;`"Vietnamese Dong (VND)";)
                   (`Currency_Symbol;"VND";)
                   (`GDP_Units;1000000.0;))
                 )
                (`ZA
                 .((`Currency;`ZAR;)
                   (`FX_Pair
                    `ZAR `USD
                    )
                   (`Economy_Verbose;`"South Africa (ZA)";)
                   (`Currency_Verbose;`"South African Rand (ZAR)";)
                   (`Currency_Symbol;"ZAR";)
                   (`GDP_Units;1000000.0;))
                 ))
              )
             (`e2c
              .((`US;`USD;)
                (`DE;`EUR;)
                (`GB;`GBP;)
                (`CH;`CHF;)
                (`AU;`AUD;)
                (`CA;`CAD;))
              )
             (`c2e
              .((`USD;`US;)
                (`EUR;`DE;)
                (`GBP;`GB;)
                (`CHF;`CH;)
                (`AUD;`AU;)
                (`CAD;`CA;))
              )
             (`economies_verbose
              .((`US;`"United States (US)";)
                (`DE;`"Germany (DE)";)
                (`GB;`"Great Britain (GB)";)
                (`CH;`"Switzerland (CH)";)
                (`AU;`"Australia (AU)";)
                (`CA;`"Canada (CA)";))
              )
             (`Version;"6.0.99.99";)
             (`time_gaps;0;)
             (`paths
              0 1 2 3 4 5 6 7 8 9
              )
             (`tnp;10;))
           )
          (`L
           .((`Dummy;0#`;)
             (`Entity_to_Product
              .,(`Entity_1;0#`;)
              ))
           ))
       )
      (`G
       .((`ruin_rbc_factor;1.0;)
         (`tsi
          0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80
          )
         (`tfi
          1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80
          )
         (`tfi0
          0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80
          )
         (`tfiye
          4 8 12 16 20 24 28 32 36 40 44 48 52 56 60 64 68 72 76 80
          )
         (`tfi0ye
          0 4 8 12 16 20 24 28 32 36 40 44 48 52 56 60 64 68 72 76 80
          )
         (`tsc
          `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
          )
         (`tfc
          `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
          )
         (`tfc0
          `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
          )
         (`tfcye
          `"2010" `"2011" `"2012" `"2013" `"2014" `"2015" `"2016" `"2017" `"2018" `"2019" `"2020" `"2021" `"2022" `"2023" `"2024" `"2025" `"2026" `"2027" `"2028" `"2029"
          )
         (`tfc0ye
          `"2009" `"2010" `"2011" `"2012" `"2013" `"2014" `"2015" `"2016" `"2017" `"2018" `"2019" `"2020" `"2021" `"2022" `"2023" `"2024" `"2025" `"2026" `"2027" `"2028" `"2029"
          )
         (`nsp;80;)
         (`pdy;4;)
         (`fyr;2010;)
         (`npa;5;)
         (`ipc;0;)
         (`modules
          `gems `no_user_values
          )
         (`submodules
          `GEMS `Economic_Variables `Financial_Markets `Developer
          )
         (`axes
          .((`Library_Pattern
             .,(`Library_Pattern_1;1;)
             )
            (`Greek
             .,(`Greek_1;1;)
             )
            (`Function
             .,(`Function_1;1;)
             )
            (`Transform
             .,(`Transform_1;1;)
             )
            (`Life_Table
             .,(`Life_Table_1;1;)
             )
            (`Compression
             .,(`Compression_1;1;)
             )
            (`Inner_Loop
             .,(`Inner_Loop_1;1;)
             )
            (`Risk_Class
             .,(`Risk_Class_1;1;)
             )
            (`Asset_Class
             .((`AAA_Corporate_Bonds_Summary;0;)
               (`AA_Corporate_Bonds_Summary;0;)
               (`A_Corporate_Bonds_Summary;0;)
               (`A_plus_Corporate_Bonds_Summary;0;)
               (`BBB_Corporate_Bonds_Summary;0;)
               (`High_Yield_Corporate_Bonds_Summary;0;)
               (`Default_Corporate_Bonds_Summary;0;)
               (`Class_1_Preferred_Stock_Summary;0;)
               (`BBB_Preferred_Stock_Summary;0;)
               (`High_Yield_Preferred_Stock_Summary;0;)
               (`Default_Preferred_Stock_Summary;0;)
               (`Treasury_Bonds_Summary;0;)
               (`State_GO_Bonds_Summary;0;)
               (`Pfandbriefe_Summary;0;)
               (`Schuldschein_Pools_Summary;0;)
               (`Alternative_Assets_Bond_Model_Class_Summary;0;)
               (`Unquoted_Summary;0;)
               (`Mortgage_Securities_Summary;0;)
               (`German_Style_Mortgage_Summary;0;)
               (`Common_Stock_Market_Indices_Summary;0;)
               (`Property_Market_Indices_Summary;0;)
               (`Fixed_Income_Market_Indices_Summary;0;)
               (`Alternative_Asset_Market_Indices_Summary;0;)
               (`Preferred_Stock_Market_Indices_Summary;0;)
               (`Property_Model_Summary;0;)
               (`FRN_Instruments_Summary;0;)
               (`Interest_Rate_Derivatives_Summary;0;)
               (`Equity_Derivatives_Summary;0;)
               (`Common_Stock_Affiliates_Summary;0;)
               (`Preferred_Stock_Affiliates_Summary;0;)
               (`Debt_Affiliates_Summary;0;)
               (`Class_0_Bonds_Summary;0;)
               (`Class_1_Bonds_Summary;0;)
               (`Corporate_Bonds_Summary;0;)
               (`Preferred_Stock_Summary;0;)
               (`Preferred_Stock_Model_Summary;0;)
               (`Bonds_Model_Class_Summary;0;)
               (`Mortgages_Summary;0;)
               (`Common_Stock_Summary;0;)
               (`Stock_Summary;0;)
               (`HGB_Stock_Summary;0;)
               (`Property_Summary;0;)
               (`Taxable_Bonds_Summary;0;)
               (`Tax_Exempt_Bonds_Summary;0;)
               (`Bonds_Summary;0;)
               (`HGB_Bonds_Summary;0;)
               (`Fixed_Income_Summary;0;)
               (`Derivatives_Summary;0;)
               (`HGB_Other_Summary;0;)
               (`Investments_in_Affiliates_Summary;0;)
               (`Alternative_Assets_Summary;0;)
               (`All_Investments_Summary;0;)
               (`Common_Stock_except_Affiliates_Summary;0;)
               (`Bonds_except_Affiliates_Summary;0;)
               (`Taxable_Bonds_except_Affiliates_Summary;0;)
               (`Preferred_Stock_except_Affiliates_Summary;0;)
               (`Stock_except_Affiliates_Summary;0;)
               (`Stock_in_Affiliates_Summary;0;)
               (`Decision_Class_1_Decision;0;)
               (`Bonds_Decision;0;)
               (`Preferred_Stock_Decision;0;)
               (`Alternative_Assets_Decision;0;)
               (`Treasury_Bonds_Decision;0;)
               (`Corporate_Bonds_Decision;0;)
               (`Investment_Grade_Bonds_Decision;0;)
               (`Investment_Grade_Corporate_Bonds_Decision;0;)
               (`Taxable_Bonds_Decision;0;)
               (`Tax_Exempt_Bonds_Decision;0;)
               (`Risk_Free_Bonds_Decision;0;)
               (`AAA_Rated_Bonds_Decision;0;)
               (`AA_Rated_Bonds_Decision;0;)
               (`A_Rated_Bonds_Decision;0;)
               (`BBB_Rated_Bonds_Decision;0;)
               (`High_Yield_Bonds_Decision;0;)
               (`Bonds_Rated_AAA_or_Lower_Decision;0;)
               (`Bonds_Rated_AA_or_Lower_Decision;0;)
               (`Bonds_Rated_A_or_Lower_Decision;0;)
               (`Bonds_Rated_BBB_or_Lower_Decision;0;)
               (`Bonds_Rated_High_Yield_or_Lower_Decision;0;)
               (`Bonds_Maturing_Within_1_Year_Decision;0;)
               (`Bonds_Maturing_Within_2_Years_Decision;0;)
               (`Bonds_Maturing_Within_3_Years_Decision;0;)
               (`Bonds_Maturing_Within_5_Years_Decision;0;)
               (`Bonds_Maturing_Within_7_Years_Decision;0;)
               (`Bonds_Maturing_Within_10_Years_Decision;0;)
               (`Bonds_Maturing_Within_15_Years_Decision;0;)
               (`Pfandbriefe_Decision;0;)
               (`Schuldschein_Pools_Decision;0;)
               (`Mortgages_Decision;0;)
               (`Mortgage_Backed_Securities_Decision;0;)
               (`German_Style_Mortgages_Decision;0;)
               (`CMOs_Decision;0;)
               (`Sequential_CMO_Tranches_Decision;0;)
               (`VADM_CMO_Tranches_Decision;0;)
               (`PAC_CMO_Tranches_Decision;0;)
               (`Scheduled_CMO_Tranches_Decision;0;)
               (`Support_CMO_Tranches_Decision;0;)
               (`SoftZ_CMO_Tranches_Decision;0;)
               (`HardZ_CMO_Tranches_Decision;0;)
               (`Common_Stock_Decision;0;)
               (`Common_Stock_Large_Cap_Decision;0;)
               (`Property_Decision;0;)
               (`Residential_Property_Decision;0;)
               (`Office_Property_Decision;0;)
               (`Retail_Property_Decision;0;)
               (`Interest_Rate_Derivatives_Decision;0;)
               (`Caps_Decision;0;)
               (`Floors_Decision;0;)
               (`Swaps_Decision;0;)
               (`FRNs_Decision;0;)
               (`RFRNs_Decision;0;)
               (`FRNnCs_Decision;0;)
               (`cRFRNs_Decision;0;)
               (`RFRN_Options_Decision;0;)
               (`Floating_Coupon_Decision;0;)
               (`Bond_Options_Decision;0;)
               (`Receiver_Swaptions_Decision;0;)
               (`Annuity_Settlement_Swaptions_Decision;0;)
               (`Annuity_Settlements_Decision;0;)
               (`Equity_Derivatives_Decision;0;)
               (`Equity_Put_Options_Decision;0;)
               (`Equity_Call_Options_Decision;0;)
               (`Large_Cap_Options_Decision;0;)
               (`Mid_Cap_Options_Decision;0;)
               (`Small_Cap_Options_Decision;0;)
               (`Broad_Cap_Options_Decision;0;)
               (`Other_Sector_Options_Decision;0;)
               (`Large_Cap_Puts_Decision;0;)
               (`Large_Cap_Calls_Decision;0;)
               (`Mid_Cap_Puts_Decision;0;)
               (`Mid_Cap_Calls_Decision;0;)
               (`Small_Cap_Puts_Decision;0;)
               (`Small_Cap_Calls_Decision;0;)
               (`Broad_Cap_Puts_Decision;0;)
               (`Broad_Cap_Calls_Decision;0;)
               (`Other_Sector_Puts_Decision;0;)
               (`Other_Sector_Calls_Decision;0;)
               (`Alternative_Asset_Market_Indices_Decision;0;)
               (`Alternative_Assets_Bond_Model_Class_Decision;0;)
               (`Preferred_Stock_Market_Indices_Decision;0;)
               (`Preferred_Stock_Model_Decision;0;)
               (`Property_Market_Indices_Decision;0;)
               (`Property_Model_Decision;0;)
               (`Fixed_Income_Market_Indices_Decision;0;)
               (`Common_Stock_Broad_Cap_Decision;0;)
               (`Common_Stock_Mid_Cap_Decision;0;)
               (`Common_Stock_Small_Cap_Decision;0;)
               (`Common_Stock_Other_Sector_Decision;0;)
               (`Asset_Class_1;1;))
             )
            (`HGB_Equalization_Line
             .,(`HGB_Equalization_Line_1;1;)
             )
            (`Claim_Cost_Index
             .,(`Claim_Cost_Index_1;1;)
             )
            (`Financing_Instrument
             .((`Financing_Instrument_1;1;)
               (`Common_Stock;1;))
             )
            (`Supplemental_Model
             .,(`Supplemental_Model_1;1;)
             )
            (`Portfolio
             .((`Portfolio_1;1;)
               (`Direct;1;)
               (`Fund_1;1;))
             )
            (`Entity
             .,(`Entity_1;1;)
             )
            (`User_Value
             .,(`User_Value_1;1;)
             )
            (`Consolidation
             .,(`Consolidation_1;1;)
             )
            (`Peril
             .,(`Peril_1;1;)
             )
            (`Product
             .,(`Product_1;1;)
             )
            (`Product_Group
             .,(`Product_Group_1;1;)
             )
            (`Treaty
             .,(`Treaty_1;1;)
             )
            (`Treaty_Group
             .,(`Treaty_Group_1;1;)
             )
            (`Life_Product
             .,(`Life_Product_1;1;)
             )
            (`Plan
             .,(`Plan_1;1;)
             )
            (`Counterparty
             .,(`Counterparty_1;1;)
             )
            (`Lookup
             .,(`Lookup_1;1;)
             )
            (`State
             .,(`State_1;1;)
             )
            (`Transition
             .,(`Transition_1;1;)
             )
            (`Return_Class
             .,(`Return_Class_1;1;)
             )
            (`Market_Index
             .((`Barra;1;)
               (`Barra_EC;1;)
               (`Barra_TR;1;)
               (`CISDMFOF_E0;1;)
               (`CISDMFOF_EC;1;)
               (`CISDMFOF_TR;1;)
               (`LSTPE_E0;1;)
               (`LSTPE_EC;1;)
               (`LSTPE_TR;1;)
               (`MSCI_E0;1;)
               (`MSCI_EC;1;)
               (`MSCI_TR;1;)
               (`US14_E0;0;)
               (`US14_EC;0;)
               (`US14_TR;0;)
               (`LPXEUR;1;)
               (`ASX_E0;0;)
               (`ASX_EC;0;)
               (`ASX;0;)
               (`AUD_E0;0;)
               (`AUD_EC;0;)
               (`AUD;0;)
               (`AUCPI_E0;0;)
               (`AUCPI_EC;0;)
               (`AUCPI;0;)
               (`AUIPD_E0;0;)
               (`AUIPD_EC;0;)
               (`AUIPD;1;)
               (`AUTR35_E0;0;)
               (`AUTR35_EC;0;)
               (`AUTR35;0;)
               (`DE_SX5E;0;)
               (`DE_TR10Y;0;)
               (`DE_TR1Y;0;)
               (`Market_Index_11;1;))
             )
            (`User_Relative_Value
             .,(`User_Relative_Value_1;1;)
             )
            (`QIS5_Region
             .,(`QIS5_Region_1;1;)
             )
            (`QIS5_Line
             .,(`QIS5_Line_1;1;)
             ))
          )
         (`tax_rate;0.35;)
         (`property_use
          .((`Residential
             .((`Price;1000.0;)
               (`Sustainable_Rent;25.0;)
               (`Depreciation_Rate;0.03;)
               (`Expenses_Per_Square_Meter;0.25;)
               (`Expenses_Per_Rent;0.05;)
               (`Vacancy_Rate;0.03;)
               (`Useful_Lifetime;40.0;)
               (`Land_Value_Ratio;0.2;)
               (`Trade_Cost_Buying;0.03;)
               (`Trade_Cost_Selling;0.0;)
               (`Selling_Bound;25000.0;)
               (`Regulated;1.0;)
               (`CPI;0.0;)
               (`Stepped;0.0;)
               (`Fixed;0.0;)
               (`Purchase_Portfolio;`All;)
               (`Price_Ratio;0.6130076;)
               (`Leases
                ,0
                )
               (`Weights
                ,1.0
                )
               (`Starting_GEMS_Rent;105.16;)
               (`Period_Depreciation;0.9924141;))
             )
            (`Office
             .((`Price;1000.0;)
               (`Sustainable_Rent;25.0;)
               (`Depreciation_Rate;0.03;)
               (`Expenses_Per_Square_Meter;0.25;)
               (`Expenses_Per_Rent;0.05;)
               (`Vacancy_Rate;0.03;)
               (`Useful_Lifetime;40.0;)
               (`Land_Value_Ratio;0.2;)
               (`Trade_Cost_Buying;0.03;)
               (`Trade_Cost_Selling;0.0;)
               (`Selling_Bound;25000.0;)
               (`Regulated;0.0;)
               (`CPI;1.0;)
               (`Stepped;0.0;)
               (`Fixed;0.0;)
               (`Purchase_Portfolio;`All;)
               (`Price_Ratio;0.2848727;)
               (`Leases
                ,1
                )
               (`Weights
                ,1.0
                )
               (`Starting_GEMS_Rent;196.1;)
               (`Period_Depreciation;0.9924141;))
             )
            (`Retail
             .((`Price;1000.0;)
               (`Sustainable_Rent;25.0;)
               (`Depreciation_Rate;0.03;)
               (`Expenses_Per_Square_Meter;0.25;)
               (`Expenses_Per_Rent;0.05;)
               (`Vacancy_Rate;0.03;)
               (`Useful_Lifetime;40.0;)
               (`Land_Value_Ratio;0.2;)
               (`Trade_Cost_Buying;0.03;)
               (`Trade_Cost_Selling;0.0;)
               (`Selling_Bound;25000.0;)
               (`Regulated;0.0;)
               (`CPI;1.0;)
               (`Stepped;0.0;)
               (`Fixed;0.0;)
               (`Purchase_Portfolio;`All;)
               (`Price_Ratio;0.03354241;)
               (`Leases
                ,1
                )
               (`Weights
                ,1.0
                )
               (`Starting_GEMS_Rent;1528.0;)
               (`Period_Depreciation;0.9924141;))
             ))
          )
         (`economies
          `US `DE `GB `CH `AU `CA
          )
         (`econ_info
          .((`AF
             .((`Currency;`AFN;)
               (`FX_Pair
                `AFN `USD
                )
               (`Economy_Verbose;`"Afghanistan (AF)";)
               (`Currency_Verbose;`"Afghan Afghani (AFN)";)
               (`Currency_Symbol;"AFN";)
               (`GDP_Units;1000000.0;))
             )
            (`AR
             .((`Currency;`ARS;)
               (`FX_Pair
                `ARS `USD
                )
               (`Economy_Verbose;`"Argentina (AR)";)
               (`Currency_Verbose;`"Argentine Peso (ARS)";)
               (`Currency_Symbol;"ARS";)
               (`GDP_Units;1000000.0;))
             )
            (`AU
             .((`Currency;`AUD;)
               (`FX_Pair
                `USD `AUD
                )
               (`Economy_Verbose;`"Australia (AU)";)
               (`Currency_Verbose;`"Australian Dollar (AUD)";)
               (`Currency_Symbol;"AUD";)
               (`GDP_Units;1000000.0;))
             )
            (`BR
             .((`Currency;`BRL;)
               (`FX_Pair
                `BRL `USD
                )
               (`Economy_Verbose;`"Brazil (BR)";)
               (`Currency_Verbose;`"Brazilian Real (BRL)";)
               (`Currency_Symbol;"BRL";)
               (`GDP_Units;1000000.0;))
             )
            (`CA
             .((`Currency;`CAD;)
               (`FX_Pair
                `CAD `USD
                )
               (`Economy_Verbose;`"Canada (CA)";)
               (`Currency_Verbose;`"Canadian Dollar (CAD)";)
               (`Currency_Symbol;"CAD";)
               (`GDP_Units;250000;))
             )
            (`CH
             .((`Currency;`CHF;)
               (`FX_Pair
                `CHF `USD
                )
               (`Economy_Verbose;`"Switzerland (CH)";)
               (`Currency_Verbose;`"Swiss Franc (CHF)";)
               (`Currency_Symbol;"CHF";)
               (`GDP_Units;1000000.0;))
             )
            (`CL
             .((`Currency;`CLP;)
               (`FX_Pair
                `CLP `USD
                )
               (`Economy_Verbose;`"Chile (CL)";)
               (`Currency_Verbose;`"Chilean Peso (CLP)";)
               (`Currency_Symbol;"CLP";)
               (`GDP_Units;1000000.0;))
             )
            (`CN
             .((`Currency;`CNY;)
               (`FX_Pair
                `CNY `USD
                )
               (`Economy_Verbose;`"China (CN)";)
               (`Currency_Verbose;`"Chinese Yuan (CNY)";)
               (`Currency_Symbol;"CNY";)
               (`GDP_Units;1000000.0;))
             )
            (`CZ
             .((`Currency;`CZK;)
               (`FX_Pair
                `CZK `USD
                )
               (`Economy_Verbose;`"Czech Republic (CZ)";)
               (`Currency_Verbose;`"Czech Koruna (CZK)";)
               (`Currency_Symbol;"CZK";)
               (`GDP_Units;1000000.0;))
             )
            (`DE
             .((`Currency;`EUR;)
               (`FX_Pair
                `USD `EUR
                )
               (`Economy_Verbose;`"Germany (DE)";)
               (`Currency_Verbose;`"Euro (EUR)";)
               (`Currency_Symbol;"\200";)
               (`GDP_Units;1000000.0;))
             )
            (`DK
             .((`Currency;`DKK;)
               (`FX_Pair
                `DKK `USD
                )
               (`Economy_Verbose;`"Denmark (DK)";)
               (`Currency_Verbose;`"Danish Krone (DKK)";)
               (`Currency_Symbol;"DKK";)
               (`GDP_Units;1000000.0;))
             )
            (`GB
             .((`Currency;`GBP;)
               (`FX_Pair
                `USD `GBP
                )
               (`Economy_Verbose;`"Great Britain (GB)";)
               (`Currency_Verbose;`"British Pound (GBP)";)
               (`Currency_Symbol;"\243";)
               (`GDP_Units;1000000.0;))
             )
            (`HK
             .((`Currency;`HKD;)
               (`FX_Pair
                `HKD `USD
                )
               (`Economy_Verbose;`"Hong Kong (HK)";)
               (`Currency_Verbose;`"Hong Kong Dollar (HKD)";)
               (`Currency_Symbol;"HKD";)
               (`GDP_Units;1000000.0;))
             )
            (`HU
             .((`Currency;`HUF;)
               (`FX_Pair
                `HUF `USD
                )
               (`Economy_Verbose;`"Hungary (HU)";)
               (`Currency_Verbose;`"Hungarian Forint (HUF)";)
               (`Currency_Symbol;"HUF";)
               (`GDP_Units;1000000.0;))
             )
            (`ID
             .((`Currency;`IDR;)
               (`FX_Pair
                `IDR `USD
                )
               (`Economy_Verbose;`"Indonesia (ID)";)
               (`Currency_Verbose;`"Indonesian Rupiah (IDR)";)
               (`Currency_Symbol;"IDR";)
               (`GDP_Units;1000000.0;))
             )
            (`IL
             .((`Currency;`ILS;)
               (`FX_Pair
                `ILS `USD
                )
               (`Economy_Verbose;`"Israel (IL)";)
               (`Currency_Verbose;`"Israeli Shekel (ILS)";)
               (`Currency_Symbol;"ILS";)
               (`GDP_Units;1000000.0;))
             )
            (`IN
             .((`Currency;`INR;)
               (`FX_Pair
                `INR `USD
                )
               (`Economy_Verbose;`"India (IN)";)
               (`Currency_Verbose;`"Indian Rupee (INR)";)
               (`Currency_Symbol;"INR";)
               (`GDP_Units;1000000.0;))
             )
            (`JM
             .((`Currency;`JMD;)
               (`FX_Pair
                `JMD `USD
                )
               (`Economy_Verbose;`"Jamaica (JM)";)
               (`Currency_Verbose;`"Jamaican Dollar (JMD)";)
               (`Currency_Symbol;"JMD";)
               (`GDP_Units;1000000.0;))
             )
            (`JP
             .((`Currency;`JPY;)
               (`FX_Pair
                `JPY `USD
                )
               (`Economy_Verbose;`"Japan (JP)";)
               (`Currency_Verbose;`"Japanese Yen (JPY)";)
               (`Currency_Symbol;"\245";)
               (`GDP_Units;2500008;))
             )
            (`KR
             .((`Currency;`KRW;)
               (`FX_Pair
                `KRW `USD
                )
               (`Economy_Verbose;`"South Korea (KR)";)
               (`Currency_Verbose;`"South Korean Won (KRW)";)
               (`Currency_Symbol;"KRW";)
               (`GDP_Units;1000000.0;))
             )
            (`MX
             .((`Currency;`MXN;)
               (`FX_Pair
                `MXN `USD
                )
               (`Economy_Verbose;`"Mexico (MX)";)
               (`Currency_Verbose;`"Mexican Peso (MXN)";)
               (`Currency_Symbol;"MXN";)
               (`GDP_Units;1000000.0;))
             )
            (`MY
             .((`Currency;`MYR;)
               (`FX_Pair
                `MYR `USD
                )
               (`Economy_Verbose;`"Malaysia (MY)";)
               (`Currency_Verbose;`"Malaysian Ringgit (MYR)";)
               (`Currency_Symbol;"MYR";)
               (`GDP_Units;1000000.0;))
             )
            (`NO
             .((`Currency;`NOK;)
               (`FX_Pair
                `NOK `USD
                )
               (`Economy_Verbose;`"Norway (NO)";)
               (`Currency_Verbose;`"Norwaegian Krone (NOK)";)
               (`Currency_Symbol;"NOK";)
               (`GDP_Units;1000000.0;))
             )
            (`NZ
             .((`Currency;`NZD;)
               (`FX_Pair
                `USD `NZD
                )
               (`Economy_Verbose;`"New Zealand (NZ)";)
               (`Currency_Verbose;`"New Zealand Dollar (NZD)";)
               (`Currency_Symbol;"NZD";)
               (`GDP_Units;1000000.0;))
             )
            (`PL
             .((`Currency;`PLN;)
               (`FX_Pair
                `PLN `USD
                )
               (`Economy_Verbose;`"Poland (PL)";)
               (`Currency_Verbose;`"Polish Zloty (PLN)";)
               (`Currency_Symbol;"PLN";)
               (`GDP_Units;1000000.0;))
             )
            (`RU
             .((`Currency;`RUB;)
               (`FX_Pair
                `RUB `USD
                )
               (`Economy_Verbose;`"Russia (RU)";)
               (`Currency_Verbose;`"Russian Ruble (RUB)";)
               (`Currency_Symbol;"RUB";)
               (`GDP_Units;1000000.0;))
             )
            (`SA
             .((`Currency;`SAR;)
               (`FX_Pair
                `SAR `USD
                )
               (`Economy_Verbose;`"Saudi Arabia (SA)";)
               (`Currency_Verbose;`"Saudi Arabian Riyal (SAR)";)
               (`Currency_Symbol;"SAR";)
               (`GDP_Units;1000000.0;))
             )
            (`SE
             .((`Currency;`SEK;)
               (`FX_Pair
                `SEK `USD
                )
               (`Economy_Verbose;`"Sweden (SE)";)
               (`Currency_Verbose;`"Swedish Krona (SEK)";)
               (`Currency_Symbol;"SEK";)
               (`GDP_Units;1000000.0;))
             )
            (`SG
             .((`Currency;`SGD;)
               (`FX_Pair
                `SGD `USD
                )
               (`Economy_Verbose;`"Singapore (SG)";)
               (`Currency_Verbose;`"Singapore Dollar (SGD)";)
               (`Currency_Symbol;"SGD";)
               (`GDP_Units;1000000.0;))
             )
            (`TH
             .((`Currency;`THB;)
               (`FX_Pair
                `THB `USD
                )
               (`Economy_Verbose;`"Thailand (TH)";)
               (`Currency_Verbose;`"Thai Baht (THB)";)
               (`Currency_Symbol;"THB";)
               (`GDP_Units;1000000.0;))
             )
            (`TR
             .((`Currency;`TRY;)
               (`FX_Pair
                `TRY `USD
                )
               (`Economy_Verbose;`"Turkey (TR)";)
               (`Currency_Verbose;`"Turkish Lira (TRY)";)
               (`Currency_Symbol;"TRY";)
               (`GDP_Units;1000000.0;))
             )
            (`TT
             .((`Currency;`TTD;)
               (`FX_Pair
                `TTD `USD
                )
               (`Economy_Verbose;`"Trinidad and Tobago (TT)";)
               (`Currency_Verbose;`"Trinidad and Tobago Dollar (TTD)";)
               (`Currency_Symbol;"TTD";)
               (`GDP_Units;1000000.0;))
             )
            (`TW
             .((`Currency;`TWD;)
               (`FX_Pair
                `TWD `USD
                )
               (`Economy_Verbose;`"Taiwan (TW)";)
               (`Currency_Verbose;`"Taiwan Dollar (TWD)";)
               (`Currency_Symbol;"TWD";)
               (`GDP_Units;1000000.0;))
             )
            (`US
             .((`Currency;`USD;)
               (`FX_Pair
                `USD `USD
                )
               (`Economy_Verbose;`"United States (US)";)
               (`Currency_Verbose;`"US Dollar (USD)";)
               (`Currency_Symbol;"$";)
               (`GDP_Units;2500008;))
             )
            (`VN
             .((`Currency;`VND;)
               (`FX_Pair
                `VND `USD
                )
               (`Economy_Verbose;`"Vietnam (VN)";)
               (`Currency_Verbose;`"Vietnamese Dong (VND)";)
               (`Currency_Symbol;"VND";)
               (`GDP_Units;1000000.0;))
             )
            (`ZA
             .((`Currency;`ZAR;)
               (`FX_Pair
                `ZAR `USD
                )
               (`Economy_Verbose;`"South Africa (ZA)";)
               (`Currency_Verbose;`"South African Rand (ZAR)";)
               (`Currency_Symbol;"ZAR";)
               (`GDP_Units;1000000.0;))
             ))
          )
         (`e2c
          .((`US;`USD;)
            (`DE;`EUR;)
            (`GB;`GBP;)
            (`CH;`CHF;)
            (`AU;`AUD;)
            (`CA;`CAD;))
          )
         (`c2e
          .((`USD;`US;)
            (`EUR;`DE;)
            (`GBP;`GB;)
            (`CHF;`CH;)
            (`AUD;`AU;)
            (`CAD;`CA;))
          )
         (`economies_verbose
          .((`US;`"United States (US)";)
            (`DE;`"Germany (DE)";)
            (`GB;`"Great Britain (GB)";)
            (`CH;`"Switzerland (CH)";)
            (`AU;`"Australia (AU)";)
            (`CA;`"Canada (CA)";))
          )
         (`Version;"6.0.99.99";)
         (`time_gaps;0;)
         (`paths
          0 1 2 3 4 5 6 7 8 9
          )
         (`tnp;10;))
       )
      (`U
       .((`view
          `Pivot
          .,(`j
             .((`c;`panel;)
               (`l;`View;)
               (`a
                ,`Pivot `Statistics `Martingale `
                ))
             ))
         (`discount
          .((`method;`fixed;)
            (`fixed
             .((`rate;0.0;)
               (`economy;`US;))
             )
            (`starting_yield_curve
             .((`spread;0.0;)
               (`factor;1.0;)
               (`economy;`US;))
             )
            (`path_specific_point
             .((`spread;0.0;)
               (`factor;1.0;)
               (`maturity;1.0;)
               (`economy;`US;))
             )
            (`fill;;)
            (`factors;{[a;h;g]+g.tnp#,(1+a.rate)^(!1+g.nsp)%g.pdy}[.((`rate
                0.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;"Discount Rate (.01=1%)";)
                     (`fill;`h;)
                     (`f;6.4;))
                   ))
               (`economy
                `US
                .,(`j
                   .((`l;"Economy";)
                     (`c;`combo;)
                     (`o
                      `US `DE `GB `CH `AU `CA
                      )
                     (`ol
                      .((`US;`"United States (US)";)
                        (`DE;`"Germany (DE)";)
                        (`GB;`"Great Britain (GB)";)
                        (`CH;`"Switzerland (CH)";)
                        (`AU;`"Australia (AU)";)
                        (`CA;`"Canada (CA)";))
                      ))
                   )))];)
            (`rates;{[a;h;g]a.rate}[.((`rate
                0.0
                .,(`j
                   .((`c;`scalar;)
                     (`l;"Discount Rate (.01=1%)";)
                     (`fill;`h;)
                     (`f;6.4;))
                   ))
               (`economy
                `US
                .,(`j
                   .((`l;"Economy";)
                     (`c;`combo;)
                     (`o
                      `US `DE `GB `CH `AU `CA
                      )
                     (`ol
                      .((`US;`"United States (US)";)
                        (`DE;`"Germany (DE)";)
                        (`GB;`"Great Britain (GB)";)
                        (`CH;`"Switzerland (CH)";)
                        (`AU;`"Australia (AU)";)
                        (`CA;`"Canada (CA)";))
                      ))
                   )))];))
          .,(`j
             .((`c;`panel;)
               (`l;`Discounting;)
               (`a
                `method `fixed `fill
                ))
             ))
         (`times
          .((`extra
             `ZERO `ALL `NONE `NONINSURANCE
             )
            (`indices
             0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80
             )
            (`labels
             `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
             )
            (`times
             (;;;`"2009Q4";`"2010Q1";`"2010Q2";`"2010Q3";`"2010Q4";`"2011Q1";`"2011Q2";`"2011Q3";`"2011Q4";`"2012Q1";`"2012Q2";`"2012Q3";`"2012Q4";`"2013Q1";`"2013Q2";`"2013Q3";`"2013Q4";`"2014Q1";`"2014Q2";`"2014Q3";`"2014Q4";`"2015Q1";`"2015Q2";`"2015Q3";`"2015Q4";`"2016Q1";`"2016Q2";`"2016Q3";`"2016Q4";`"2017Q1";`"2017Q2";`"2017Q3";`"2017Q4";`"2018Q1";`"2018Q2";`"2018Q3";`"2018Q4";`"2019Q1";`"2019Q2";`"2019Q3";`"2019Q4";`"2020Q1";`"2020Q2";`"2020Q3";`"2020Q4";`"2021Q1";`"2021Q2";`"2021Q3";`"2021Q4";`"2022Q1";`"2022Q2";`"2022Q3";`"2022Q4";`"2023Q1";`"2023Q2";`"2023Q3";`"2023Q4";`"2024Q1";`"2024Q2";`"2024Q3";`"2024Q4";`"2025Q1";`"2025Q2";`"2025Q3";`"2025Q4";`"2026Q1";`"2026Q2";`"2026Q3";`"2026Q4";`"2027Q1";`"2027Q2";`"2027Q3";`"2027Q4";`"2028Q1";`"2028Q2";`"2028Q3";`"2028Q4";`"2029Q1";`"2029Q2";`"2029Q3";`"2029Q4")
             )
            (`accumulate
             .((`none;1;)
               (`ytd;0;)
               (`std;0;)
               (`range;0;))
             )
            (`derivative
             .((`raw;1;)
               (`change;0;)
               (`percentchange;0;))
             )
            (`scale
             .((`annualize;0;)
               (`discount;0;))
             )
            (`fill;;)
            (`heading;`Period;)
            (`time_and_nodes
             ,`Total
             )
            (`title_prefix;"";)
            (`subtitle;"by Period";))
          .((`V;{[x;y]
   n:+/U.True=x.times..j.bg
   if[(`ZERO _in x.extra)&(n>0)&(U.True=x.times..j.bg[*&~x.times~'_n])&~x.derivative.raw
     :("Please don't select &0 with derivative operation requested.";*x.labels)]
   :[x.accumulate.range
     :[2=n;_n;"Please select exactly two periods, start and end of range."]
     :[0<n;_n;"Please select at least one period."] ]};)
            (`j
             .((`l;`Times;)
               (`c;`panel;)
               (`a
                (`accumulate `times
                 `derivative `times
                 `scale `times
                 `fill `times)
                ))
             )))
         (`paths
          .((`paths
             0 1 2 3 4 5 6 7 8 9
             )
            (`indices
             0 1 2 3 4 5 6 7 8 9
             ))
          .((`I;.();)
            (`O;.();)
            (`L;.();)
            (`S;.();)
            (`F;.();)
            (`C;.();)
            (`H;572;)
            (`j
             .((`l;`Paths;)
               (`c;`panel;)
               (`a
                ,`flags `paths
                ))
             )))
         (`critical_values
          .((`Name
             ,`"5%"
             )
            (`Value
             ,0.05
             )
            (`Symmetric
             ,1
             )
            (`Type
             ,`Probability
             ))
          .,(`j
             .((`f
                .,(`Value;9.6;)
                )
               (`l;`"Test Critical Values";)
               (`c;`Table;)
               (`cltip
                .((`Value;"Input value of tail probability. Critical values are created with half of that probability in each tail";)
                  (`Symmetric;"If yes, 1-probability or -critical value is automatically added as another statistic";)
                  (`Type;"Critical value is either entered directly or computed from Probability using the inverse cumulative normal distribution";))
                )
               (`cl
                .((`Value;`"Critical\nValue or\nRejection\nProbability";)
                  (`Type;`"Value Type";))
                )
               (`p
                .((`Value;0.01;)
                  (`Symmetric;1;)
                  (`Type;`Probability;)
                  (`Name;`"1%";))
                )
               (`cell
                .((`Symmetric
                   .((`c;`combo;)
                     (`o
                      0 1
                      )
                     (`ol
                      (0 1
                       `No `Yes)
                      ))
                   )
                  (`Type
                   .((`c;`combo;)
                     (`o
                      `Critical_Value `Probability
                      ))
                   ))
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
             ))
         (`possible_returns
          .((`Name
             `Treasury_AU_f1 `Treasury_CH_f168 `Treasury_CH_f179 `Common_Stock_US_Large_Cap
             )
            (`Type
             `Price `Price `Price `Stock
             )
            (`Data
             ({[field;econ;time;curr;g;h].m.G[h;(`rquery;(.+(`Module`BondModule`Class`Field`Economy`FTime;(,`GEMS;,`Zero_Curve;,`Treasury;,field;,econ;time));.();g.tfi0;g.paths))]}[`Price;`AU;`f1 `f0];{[field;econ;time;curr;g;h].m.G[h;(`rquery;(.+(`Module`BondModule`Class`Field`Economy`FTime;(,`GEMS;,`Zero_Curve;,`Treasury;,field;,econ;time));.();g.tfi0;g.paths))]}[`Price;`CH;`f168 `f167];{[field;econ;time;curr;g;h].m.G[h;(`rquery;(.+(`Module`BondModule`Class`Field`Economy`FTime;(,`GEMS;,`Zero_Curve;,`Treasury;,field;,econ;time));.();g.tfi0;g.paths))]}[`Price;`CH;`f179 `f178];{[econ;index;curr;g;h].m.G[h;(`rquery;(.+(`Module`Field`StockModule`Economy;(,`GEMS;`Price`Dividend_Yield;,index;,econ));.();g.tfi0;g.paths))]}[`US;`Large_Cap])
             ))
          .,(`j
             .((`c;`table;)
               (`cl
                .((`Source;`"Data Source";)
                  (`Item;`"GEMS Variable";)
                  (`Name;`"User-Specified\nName";)
                  (`Active;`"Include\nin Test";))
                )
               (`cell
                .,(`Active
                   .,(`c;`check;)
                   )
                )
               (`e
                .((`Item;0;)
                  (`Source;0;))
                )
               (`bg
                .((`Item;192192192;)
                  (`Source;192192192;))
                )
               (`f
                .,(`Name;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
                )
               (`g
                .,(`Name;{`$_ssr[x;" ";"_"]};)
                )
               (`u
                .,(`Name;{:[   ~x;				("";y)
		   ~#$y;			("";y)
		   y _in ` . .j.v,`Name;	(("&0 already exists as a Name";$y);x)
		   *@[.:;,(`$$y;);:];		("Must begin with a-z, A-Z and contain only a-z, A-Z, 0-9, and space";x)
						("";y)]};)
                )
               (`l;`Returns;)
               (`s
                ,(`Active;581)
                .()))
             )))
       )
      (`j
       .((`a
          `ts `mw `tb
          )
         (`c;`panel;)
         (`border;0;)
         (`label;"";)
         (`v;1;)
         (`wy;0.9;))
       )
      (`CACHE
       .((`returns
          .((`Treasury_AU_f1
             .((`Mean
                1 1.009338 1.018968 1.02899 1.037964 1.046653 1.055963 1.065779 1.077184 1.089186 1.101002 1.113785 1.127689 1.14256 1.157199 1.17273 1.187705 1.203076 1.220498 1.239348 1.256527 1.273488 1.290064 1.306593 1.32323 1.339572 1.35713 1.374158 1.391352 1.408218 1.425671 1.443767 1.463096 1.483878 1.504646 1.526132 1.548629 1.572233 1.596337 1.619432 1.6425 1.666276 1.691523 1.717058 1.741586 1.767071 1.792645 1.818953 1.846286 1.876909 1.908279 1.941551 1.974988 2.007696 2.040539 2.07556 2.112937 2.149852 2.183905 2.218644 2.253184 2.288383 2.325217 2.361139 2.397339 2.435089 2.472987 2.511266 2.551572 2.592391 2.633653 2.67283 2.712913 2.753205 2.793774 2.834855 2.876063 2.921707 2.967281 3.014814 3.062769
                )
               (`Standard_Deviation
                0 7.021667e-017 0.0006710079 0.001327318 0.002015764 0.002823836 0.003549245 0.004389865 0.005320381 0.006733402 0.007923891 0.00931764 0.01080535 0.01233212 0.01403265 0.01517313 0.01595814 0.01653354 0.01768175 0.01869234 0.01982815 0.0208271 0.02176377 0.02301191 0.02431597 0.02572604 0.02715683 0.02846723 0.02959809 0.03072434 0.03174326 0.03267918 0.03338708 0.03422427 0.03508797 0.03540561 0.03532029 0.03520517 0.03517113 0.03534886 0.03572772 0.03628143 0.03711371 0.03843912 0.03941317 0.04028934 0.04129466 0.04245056 0.0440718 0.04577734 0.04711515 0.04891178 0.05052231 0.05180891 0.05327359 0.05480694 0.05673754 0.05850946 0.06075664 0.06255652 0.06424433 0.06588367 0.06848147 0.07033683 0.0723573 0.07470729 0.07733508 0.07969292 0.08233913 0.08547492 0.08789508 0.09063484 0.09335136 0.09652337 0.09960374 0.1022639 0.104835 0.1072653 0.109708 0.1121807 0.1142461
                )
               (`Z_Score
                0 1329812014 28.26759 21.84117 18.83333 16.52098 15.76754 14.98417 14.50719 13.24525 12.74653 12.21179 11.81724 11.56007 11.20238 11.38393 11.76236 12.28265 12.47036 12.80461 12.93754 13.13138 13.32782 13.32322 13.29291 13.19956 13.15064 13.14345 13.22222 13.28647 13.40982 13.57951 13.87052 14.13846 14.3823 14.86012 15.53297 16.25425 16.95529 17.5234 17.98324 18.3641 18.63254 18.65439 18.8157 19.03904 19.19484 19.29193 19.20244 19.15595 19.27786 19.24999 19.29817 19.45025 19.53199 19.62453 19.61553 19.65242 19.48602 19.48068 19.50653 19.55542 19.35147 19.35172 19.31166 19.20949 19.04681 18.96362 18.84368 18.62992 18.5864 18.45681 18.3491 18.16353 18.0091 17.94235 17.89539 17.91545 17.93197 17.96044 18.05549
                ))
             )
            (`Treasury_CH_f168
             .((`Mean
                1 1.027752 0.9679623 0.9627307 0.9635181 0.9235753 0.9315717 0.8887028 0.8471148 0.8673537 0.8486072 0.8353017 0.8652655 0.8687724 0.8941647 0.9025511 0.8909841 0.8625798 0.8465387 0.8322285 0.811194 0.8360884 0.872524 0.8741734 0.8797612 0.8447219 0.8966554 0.8918932 0.8941607 0.8986213 0.91178 0.9412061 0.9265313 0.9386584 0.9784437 0.9774354 0.9655661 1.007534 1.062533 1.114663 1.117773 1.134848 1.223195 1.225402 1.191504 1.18953 1.228023 1.267915 1.274552 1.257237 1.257571 1.259078 1.277617 1.366683 1.354092 1.343537 1.324911 1.433984 1.363778 1.442601 1.466814 1.46572 1.476141 1.47131 1.492338 1.514591 1.506174 1.46582 1.525017 1.518492 1.583347 1.560922 1.568848 1.569102 1.568454 1.530345 1.478059 1.473111 1.455363 1.450452 1.438756
                )
               (`Standard_Deviation
                0 0.02223358 0.02801551 0.04391506 0.04203961 0.04342465 0.04955619 0.04686719 0.03960902 0.04089437 0.0396348 0.05179814 0.05772472 0.05846844 0.0578238 0.06115004 0.06957071 0.08065987 0.07541096 0.07571964 0.08629285 0.08996275 0.08569559 0.08148316 0.08542127 0.0674616 0.0745235 0.07240348 0.08187346 0.09639191 0.08993256 0.1061462 0.1043632 0.09821422 0.09507585 0.08710037 0.07916582 0.07338918 0.08096912 0.07246528 0.07461105 0.09808469 0.1059774 0.1172029 0.1154028 0.1071889 0.09861189 0.1033126 0.1074502 0.09889175 0.09916873 0.08563091 0.0861673 0.0965981 0.09391682 0.1038947 0.1051894 0.1350933 0.1155415 0.1215001 0.1340228 0.1501131 0.1401395 0.1380828 0.1419548 0.1403795 0.1361769 0.1269263 0.1301755 0.1108714 0.106323 0.09280831 0.113608 0.1130564 0.1217293 0.107138 0.1057774 0.1004649 0.09647191 0.1056364 0.106555
                )
               (`Z_Score
                0 1.2482 -1.14357 -0.8486688 -0.8677975 -1.759939 -1.380822 -2.374737 -3.859859 -3.243632 -3.819695 -3.179618 -2.334087 -2.244418 -1.830308 -1.593603 -1.56698 -1.703699 -2.035 -2.215693 -2.187968 -1.821994 -1.487545 -1.544204 -1.407597 -2.301725 -1.386738 -1.493116 -1.292719 -1.051734 -0.9809568 -0.5538956 -0.703971 -0.6245698 -0.2267272 -0.2590639 -0.4349593 0.1026572 0.7723013 1.58232 1.578488 1.374815 2.10606 1.923175 1.659436 1.768188 2.312333 2.59325 2.555157 2.601201 2.597301 3.025515 3.221832 3.795963 3.770268 3.30659 3.088819 3.212476 3.148457 3.642804 3.483096 3.102459 3.397617 3.413244 3.46827 3.665716 3.717034 3.670007 4.033149 4.676516 5.486554 6.043874 5.007111 5.033793 4.669818 4.950114 4.519482 4.709219 4.720164 4.264176 4.117644
                ))
             )
            (`Treasury_CH_f179
             .((`Mean
                1 1.029134 0.9672596 0.9621308 0.9628883 0.9215275 0.9297723 0.885304 0.8421038 0.862763 0.8431396 0.8295331 0.8603018 0.8635951 0.8895027 0.8979272 0.8859789 0.8568264 0.8397943 0.8246426 0.8031615 0.8285132 0.8652574 0.8664264 0.8717562 0.8347612 0.8877194 0.8823051 0.8845644 0.8893315 0.9022138 0.9326827 0.9171684 0.9288213 0.9689105 0.9670693 0.9542353 0.9964139 1.052554 1.105093 1.107817 1.125637 1.21608 1.21837 1.182953 1.179952 1.218582 1.259116 1.26541 1.247004 1.24675 1.247444 1.265922 1.357129 1.34331 1.332199 1.312687 1.425431 1.351965 1.432364 1.457244 1.455827 1.465676 1.459878 1.481029 1.502749 1.493475 1.451236 1.511319 1.50298 1.568525 1.54445 1.553247 1.552628 1.551497 1.511063 1.457142 1.450749 1.431672 1.425586 1.413089
                )
               (`Standard_Deviation
                0 0.02308995 0.02903209 0.04553591 0.04365238 0.04503788 0.05139968 0.04853119 0.04092221 0.04234469 0.0409074 0.05344868 0.05959268 0.06023535 0.05963903 0.06306624 0.0717303 0.08298918 0.07765778 0.0780295 0.08885321 0.09242916 0.08813341 0.08372457 0.08779042 0.0693552 0.07696646 0.07468882 0.08470468 0.09959443 0.0928352 0.1097832 0.1077886 0.1015537 0.09862282 0.09026649 0.08192155 0.07587453 0.08407311 0.07575597 0.0779166 0.1019545 0.1104392 0.1221615 0.1200667 0.1115745 0.1026761 0.1076945 0.1117154 0.1028299 0.1030607 0.08914148 0.08956417 0.1003556 0.09695858 0.1068448 0.1089667 0.1400546 0.1191673 0.1250924 0.1381832 0.1552419 0.1451863 0.143365 0.1473124 0.1455531 0.1415429 0.13257 0.1360643 0.1161622 0.1114132 0.09756225 0.1187702 0.1178477 0.1272284 0.1123312 0.1102312 0.1035908 0.09920093 0.1081137 0.1091987
                )
               (`Z_Score
                0 1.261775 -1.127731 -0.8316327 -0.8501635 -1.742368 -1.366306 -2.363347 -3.858446 -3.240949 -3.834523 -3.189357 -2.344217 -2.264533 -1.852768 -1.618502 -1.58958 -1.725209 -2.06297 -2.247322 -2.215322 -1.855333 -1.528849 -1.595393 -1.460795 -2.382501 -1.458825 -1.575803 -1.362801 -1.111191 -1.053331 -0.6131844 -0.7684635 -0.7008975 -0.3152359 -0.364817 -0.5586402 -0.04726331 0.6251017 1.387251 1.383751 1.23228 1.956552 1.787548 1.523763 1.612842 2.128851 2.406029 2.375768 2.402058 2.394217 2.775856 2.969071 3.558636 3.54079 3.109172 2.869561 3.03761 2.953535 3.456358 3.308973 2.936236 3.207438 3.20774 3.265364 3.454056 3.486399 3.403754 3.757919 4.32998 5.102851 5.580543 4.658125 4.689336 4.334703 4.549607 4.147118 4.351244 4.351494 3.936465 3.782909
                ))
             )
            (`Common_Stock_US_Large_Cap
             .((`Mean
                1 1.041582 1.049257 1.068807 1.087005 1.092945 1.144275 1.106527 1.124977 1.170189 1.21935 1.227416 1.222794 1.26363 1.285085 1.37752 1.417646 1.399042 1.388551 1.475356 1.510932 1.600477 1.625143 1.69851 1.77162 1.798826 1.832609 1.860515 2.046169 2.115694 2.143097 2.243425 2.406939 2.468712 2.500089 2.500453 2.641016 2.770598 2.841609 2.973108 3.150383 3.138186 3.292521 3.414217 3.61976 3.961141 3.980151 4.394443 4.565011 4.758886 4.995895 5.2939 5.322189 5.706472 5.688008 6.122258 6.43007 6.771548 7.010166 7.047461 7.402433 7.795033 7.994221 8.382159 8.796132 8.862627 8.928729 9.128481 9.703639 9.362423 9.433551 9.762469 10.17523 10.3966 10.51306 10.54712 11.08545 11.25075 12.27373 11.96842 12.8677
                )
               (`Standard_Deviation
                0 0.0178872 0.02371761 0.03232049 0.03466935 0.05080127 0.05757086 0.05270153 0.0553868 0.05012568 0.0540401 0.07916092 0.09005547 0.1062644 0.1196511 0.1319764 0.1580403 0.1516408 0.1366363 0.1343701 0.1373954 0.162745 0.1760101 0.1829071 0.1907082 0.1999597 0.2305694 0.2677174 0.314417 0.3319166 0.3150618 0.3527718 0.3421872 0.3348315 0.3269802 0.3144516 0.3257147 0.3625348 0.3899482 0.4265118 0.4694797 0.4836427 0.5083232 0.579737 0.6267429 0.6760881 0.6479884 0.7646981 0.7913596 0.8764637 0.932599 1.025437 1.076416 1.179921 1.16189 1.416138 1.537613 1.53226 1.612194 1.654422 1.818479 1.948856 2.100822 2.201647 2.341286 2.337915 2.382142 2.457634 2.750514 2.613639 2.770815 2.847181 3.012635 3.093132 3.145485 3.08245 3.370879 3.330225 3.786804 3.539464 3.849007
                )
               (`Z_Score
                0 2.324692 2.076824 2.128882 2.50956 1.829579 2.50604 2.021329 2.256445 3.395236 4.059028 2.872837 2.473964 2.480885 2.382635 2.860513 2.642657 2.631497 2.843689 3.537664 3.718696 3.68968 3.551745 3.818935 4.046078 3.994935 3.611101 3.214267 3.327329 3.361369 3.628168 3.52473 4.111606 4.386421 4.587705 4.771649 5.038201 4.883938 4.722701 4.62615 4.580354 4.421003 4.509968 4.164332 4.179959 4.379816 4.59908 4.438932 4.50492 4.288695 4.284687 4.187385 4.015352 3.988802 4.034812 3.617061 3.531494 3.76669 3.727942 3.655331 3.520763 3.486677 3.329278 3.353016 3.32985 3.363094 3.328403 3.307442 3.164369 3.199532 3.043707 3.077595 3.045583 3.037892 3.024354 3.09725 2.991935 3.078096 2.977109 3.098893 3.083314
                ))
             ))
          )
         (`critical
          .((`names
             `"Upper 5%" `"Lower 5%"
             )
            (`values
             1.644854 -1.644854
             ))
          )
         (`Pivot
          (.((`ts
              .,(`text
                 "<html><center><font size=3><font face=\"Helvetica\"><b>Company Name (set via Preferences)</b><br></font></font><font size=4><font face=\"Helvetica\"><b>Martingale Test Variables<br>Data by Period</b></font></font></center></html>"
                 .,(`j
                    .((`c;`label;)
                      (`halign;`c;))
                    ))
              .,(`j
                 .((`wy;0.0;)
                   (`c;`panel;)
                   (`bg;`w;)
                   (`border;0;)
                   (`l;"";))
                 ))
             (`mw
              1 1.009338 1.018968 1.02899 1.037964 1.046653 1.055963 1.065779 1.077184 1.089186 1.101002 1.113785 1.127689 1.14256 1.157199 1.17273 1.187705 1.203076 1.220498 1.239348 1.256527 1.273488 1.290064 1.306593 1.32323 1.339572 1.35713 1.374158 1.391352 1.408218 1.425671 1.443767 1.463096 1.483878 1.504646 1.526132 1.548629 1.572233 1.596337 1.619432 1.6425 1.666276 1.691523 1.717058 1.741586 1.767071 1.792645 1.818953 1.846286 1.876909 1.908279 1.941551 1.974988 2.007696 2.040539 2.07556 2.112937 2.149852 2.183905 2.218644 2.253184 2.288383 2.325217 2.361139 2.397339 2.435089 2.472987 2.511266 2.551572 2.592391 2.633653 2.67283 2.712913 2.753205 2.793774 2.834855 2.876063 2.921707 2.967281 3.014814 3.062769 0 7.021667e-017 0.0006710079 0.001327318 0.002015764 0.002823836 0.003549245 0.004389865 0.005320381 0.006733402 0.007923891 0.00931764 0.01080535 0.01233212 0.01403265 0.01517313 0.01595814 0.01653354 0.01768175 0.01869234 0.01982815 0.0208271 0.02176377 0.02301191 0.02431597 0.02572604 0.02715683 0.02846723 0.02959809 0.03072434 0.03174326 0.03267918 0.03338708 0.03422427 0.03508797 0.03540561 0.03532029 0.03520517 0.03517113 0.03534886 0.03572772 0.03628143 0.03711371 0.03843912 0.03941317 0.04028934 0.04129466 0.04245056 0.0440718 0.04577734 0.04711515 0.04891178 0.05052231 0.05180891 0.05327359 0.05480694 0.05673754 0.05850946 0.06075664 0.06255652 0.06424433 0.06588367 0.06848147 0.07033683 0.0723573 0.07470729 0.07733508 0.07969292 0.08233913 0.08547492 0.08789508 0.09063484 0.09335136 0.09652337 0.09960374 0.1022639 0.104835 0.1072653 0.109708 0.1121807 0.1142461 0 1.329812014 28.26759 21.84117 18.83333 16.52098 15.76754 14.98417 14.50719 13.24525 12.74653 12.21179 11.81724 11.56007 11.20238 11.38393 11.76236 12.28265 12.47036 12.80461 12.93754 13.13138 13.32782 13.32322 13.29291 13.19956 13.15064 13.14345 13.22222 13.28647 13.40982 13.57951 13.87052 14.13846 14.3823 14.86012 15.53297 16.25425 16.95529 17.5234 17.98324 18.3641 18.63254 18.65439 18.8157 19.03904 19.19484 19.29193 19.20244 19.15595 19.27786 19.24999 19.29817 19.45025 19.53199 19.62453 19.61553 19.65242 19.48602 19.48068 19.50653 19.55542 19.35147 19.35172 19.31166 19.20949 19.04681 18.96362 18.84368 18.62992 18.5864 18.45681 18.3491 18.16353 18.0091 17.94235 17.89539 17.91545 17.93197 17.96044 18.05549 1 1.027752 0.9679623 0.9627307 0.9635181 0.9235753 0.9315717 0.8887028 0.8471148 0.8673537 0.8486072 0.8353017 0.8652655 0.8687724 0.8941647 0.9025511 0.8909841 0.8625798 0.8465387 0.8322285 0.811194 0.8360884 0.872524 0.8741734 0.8797612 0.8447219 0.8966554 0.8918932 0.8941607 0.8986213 0.91178 0.9412061 0.9265313 0.9386584 0.9784437 0.9774354 0.9655661 1.007534 1.062533 1.114663 1.117773 1.134848 1.223195 1.225402 1.191504 1.18953 1.228023 1.267915 1.274552 1.257237 1.257571 1.259078 1.277617 1.366683 1.354092 1.343537 1.324911 1.433984 1.363778 1.442601 1.466814 1.46572 1.476141 1.47131 1.492338 1.514591 1.506174 1.46582 1.525017 1.518492 1.583347 1.560922 1.568848 1.569102 1.568454 1.530345 1.478059 1.473111 1.455363 1.450452 1.438756 0 0.02223358 0.02801551 0.04391506 0.04203961 0.04342465 0.04955619 0.04686719 0.03960902 0.04089437 0.0396348 0.05179814 0.05772472 0.05846844 0.0578238 0.06115004 0.06957071 0.08065987 0.07541096 0.07571964 0.08629285 0.08996275 0.08569559 0.08148316 0.08542127 0.0674616 0.0745235 0.07240348 0.08187346 0.09639191 0.08993256 0.1061462 0.1043632 0.09821422 0.09507585 0.08710037 0.07916582 0.07338918 0.08096912 0.07246528 0.07461105 0.09808469 0.1059774 0.1172029 0.1154028 0.1071889 0.09861189 0.1033126 0.1074502 0.09889175 0.09916873 0.08563091 0.0861673 0.0965981 0.09391682 0.1038947 0.1051894 0.1350933 0.1155415 0.1215001 0.1340228 0.1501131 0.1401395 0.1380828 0.1419548 0.1403795 0.1361769 0.1269263 0.1301755 0.1108714 0.106323 0.09280831 0.113608 0.1130564 0.1217293 0.107138 0.1057774 0.1004649 0.09647191 0.1056364 0.106555 0 1.2482 -1.14357 -0.8486688 -0.8677975 -1.759939 -1.380822 -2.374737 -3.859859 -3.243632 -3.819695 -3.179618 -2.334087 -2.244418 -1.830308 -1.593603 -1.56698 -1.703699 -2.035 -2.215693 -2.187968 -1.821994 -1.487545 -1.544204 -1.407597 -2.301725 -1.386738 -1.493116 -1.292719 -1.051734 -0.9809568 -0.5538956 -0.703971 -0.6245698 -0.2267272 -0.2590639 -0.4349593 0.1026572 0.7723013 1.58232 1.578488 1.374815 2.10606 1.923175 1.659436 1.768188 2.312333 2.59325 2.555157 2.601201 2.597301 3.025515 3.221832 3.795963 3.770268 3.30659 3.088819 3.212476 3.148457 3.642804 3.483096 3.102459 3.397617 3.413244 3.46827 3.665716 3.717034 3.670007 4.033149 4.676516 5.486554 6.043874 5.007111 5.033793 4.669818 4.950114 4.519482 4.709219 4.720164 4.264176 4.117644 1 1.029134 0.9672596 0.9621308 0.9628883 0.9215275 0.9297723 0.885304 0.8421038 0.862763 0.8431396 0.8295331 0.8603018 0.8635951 0.8895027 0.8979272 0.8859789 0.8568264 0.8397943 0.8246426 0.8031615 0.8285132 0.8652574 0.8664264 0.8717562 0.8347612 0.8877194 0.8823051 0.8845644 0.8893315 0.9022138 0.9326827 0.9171684 0.9288213 0.9689105 0.9670693 0.9542353 0.9964139 1.052554 1.105093 1.107817 1.125637 1.21608 1.21837 1.182953 1.179952 1.218582 1.259116 1.26541 1.247004 1.24675 1.247444 1.265922 1.357129 1.34331 1.332199 1.312687 1.425431 1.351965 1.432364 1.457244 1.455827 1.465676 1.459878 1.481029 1.502749 1.493475 1.451236 1.511319 1.50298 1.568525 1.54445 1.553247 1.552628 1.551497 1.511063 1.457142 1.450749 1.431672 1.425586 1.413089 0 0.02308995 0.02903209 0.04553591 0.04365238 0.04503788 0.05139968 0.04853119 0.04092221 0.04234469 0.0409074 0.05344868 0.05959268 0.06023535 0.05963903 0.06306624 0.0717303 0.08298918 0.07765778 0.0780295 0.08885321 0.09242916 0.08813341 0.08372457 0.08779042 0.0693552 0.07696646 0.07468882 0.08470468 0.09959443 0.0928352 0.1097832 0.1077886 0.1015537 0.09862282 0.09026649 0.08192155 0.07587453 0.08407311 0.07575597 0.0779166 0.1019545 0.1104392 0.1221615 0.1200667 0.1115745 0.1026761 0.1076945 0.1117154 0.1028299 0.1030607 0.08914148 0.08956417 0.1003556 0.09695858 0.1068448 0.1089667 0.1400546 0.1191673 0.1250924 0.1381832 0.1552419 0.1451863 0.143365 0.1473124 0.1455531 0.1415429 0.13257 0.1360643 0.1161622 0.1114132 0.09756225 0.1187702 0.1178477 0.1272284 0.1123312 0.1102312 0.1035908 0.09920093 0.1081137 0.1091987 0 1.261775 -1.127731 -0.8316327 -0.8501635 -1.742368 -1.366306 -2.363347 -3.858446 -3.240949 -3.834523 -3.189357 -2.344217 -2.264533 -1.852768 -1.618502 -1.58958 -1.725209 -2.06297 -2.247322 -2.215322 -1.855333 -1.528849 -1.595393 -1.460795 -2.382501 -1.458825 -1.575803 -1.362801 -1.111191 -1.053331 -0.6131844 -0.7684635 -0.7008975 -0.3152359 -0.364817 -0.5586402 -0.04726331 0.6251017 1.387251 1.383751 1.23228 1.956552 1.787548 1.523763 1.612842 2.128851 2.406029 2.375768 2.402058 2.394217 2.775856 2.969071 3.558636 3.54079 3.109172 2.869561 3.03761 2.953535 3.456358 3.308973 2.936236 3.207438 3.20774 3.265364 3.454056 3.486399 3.403754 3.757919 4.32998 5.102851 5.580543 4.658125 4.689336 4.334703 4.549607 4.147118 4.351244 4.351494 3.936465 3.782909 1 1.041582 1.049257 1.068807 1.087005 1.092945 1.144275 1.106527 1.124977 1.170189 1.21935 1.227416 1.222794 1.26363 1.285085 1.37752 1.417646 1.399042 1.388551 1.475356 1.510932 1.600477 1.625143 1.69851 1.77162 1.798826 1.832609 1.860515 2.046169 2.115694 2.143097 2.243425 2.406939 2.468712 2.500089 2.500453 2.641016 2.770598 2.841609 2.973108 3.150383 3.138186 3.292521 3.414217 3.61976 3.961141 3.980151 4.394443 4.565011 4.758886 4.995895 5.2939 5.322189 5.706472 5.688008 6.122258 6.43007 6.771548 7.010166 7.047461 7.402433 7.795033 7.994221 8.382159 8.796132 8.862627 8.928729 9.128481 9.703639 9.362423 9.433551 9.762469 10.17523 10.3966 10.51306 10.54712 11.08545 11.25075 12.27373 11.96842 12.8677 0 0.0178872 0.02371761 0.03232049 0.03466935 0.05080127 0.05757086 0.05270153 0.0553868 0.05012568 0.0540401 0.07916092 0.09005547 0.1062644 0.1196511 0.1319764 0.1580403 0.1516408 0.1366363 0.1343701 0.1373954 0.162745 0.1760101 0.1829071 0.1907082 0.1999597 0.2305694 0.2677174 0.314417 0.3319166 0.3150618 0.3527718 0.3421872 0.3348315 0.3269802 0.3144516 0.3257147 0.3625348 0.3899482 0.4265118 0.4694797 0.4836427 0.5083232 0.579737 0.6267429 0.6760881 0.6479884 0.7646981 0.7913596 0.8764637 0.932599 1.025437 1.076416 1.179921 1.16189 1.416138 1.537613 1.53226 1.612194 1.654422 1.818479 1.948856 2.100822 2.201647 2.341286 2.337915 2.382142 2.457634 2.750514 2.613639 2.770815 2.847181 3.012635 3.093132 3.145485 3.08245 3.370879 3.330225 3.786804 3.539464 3.849007 0 2.324692 2.076824 2.128882 2.50956 1.829579 2.50604 2.021329 2.256445 3.395236 4.059028 2.872837 2.473964 2.480885 2.382635 2.860513 2.642657 2.631497 2.843689 3.537664 3.718696 3.68968 3.551745 3.818935 4.046078 3.994935 3.611101 3.214267 3.327329 3.361369 3.628168 3.52473 4.111606 4.386421 4.587705 4.771649 5.038201 4.883938 4.722701 4.62615 4.580354 4.421003 4.509968 4.164332 4.179959 4.379816 4.59908 4.438932 4.50492 4.288695 4.284687 4.187385 4.015352 3.988802 4.034812 3.617061 3.531494 3.76669 3.727942 3.655331 3.520763 3.486677 3.329278 3.353016 3.32985 3.363094 3.328403 3.307442 3.164369 3.199532 3.043707 3.077595 3.045583 3.037892 3.024354 3.09725 2.991935 3.078096 2.977109 3.098893 3.083314
              .,(`j
                 .((`border;0;)
                   (`l;"";)
                   (`ax
                    .((`Return
                       `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap"
                       )
                      (`Statistic
                       `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score"
                       )
                      (`Year
                       `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029" `"2009" `"2010" `"2010" `"2010" `"2010" `"2011" `"2011" `"2011" `"2011" `"2012" `"2012" `"2012" `"2012" `"2013" `"2013" `"2013" `"2013" `"2014" `"2014" `"2014" `"2014" `"2015" `"2015" `"2015" `"2015" `"2016" `"2016" `"2016" `"2016" `"2017" `"2017" `"2017" `"2017" `"2018" `"2018" `"2018" `"2018" `"2019" `"2019" `"2019" `"2019" `"2020" `"2020" `"2020" `"2020" `"2021" `"2021" `"2021" `"2021" `"2022" `"2022" `"2022" `"2022" `"2023" `"2023" `"2023" `"2023" `"2024" `"2024" `"2024" `"2024" `"2025" `"2025" `"2025" `"2025" `"2026" `"2026" `"2026" `"2026" `"2027" `"2027" `"2027" `"2027" `"2028" `"2028" `"2028" `"2028" `"2029" `"2029" `"2029" `"2029"
                       )
                      (`Period
                       `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4 `Q1 `Q2 `Q3 `Q4
                       ))
                    )
                   (`axo
                    .((`Return
                       `"Treasury AU f1" `"Treasury CH f168" `"Treasury CH f179" `"Common Stock US Large Cap"
                       )
                      (`Statistic
                       `Mean `"Standard Deviation" `"Z Score"
                       )
                      (`Year
                       `"2009" `"2010" `"2011" `"2012" `"2013" `"2014" `"2015" `"2016" `"2017" `"2018" `"2019" `"2020" `"2021" `"2022" `"2023" `"2024" `"2025" `"2026" `"2027" `"2028" `"2029"
                       )
                      (`Period
                       `Q1 `Q2 `Q3 `Q4
                       ))
                    )
                   (`a
                    (`Year `Period
                     `Return `Statistic)
                    )
                   (`c;`Pivot_;)
                   (`sg;`w;)
                   (`f;21.0;)
                   (`e;0;))
                 ))
             (`tb
              .((`Flip
                 {.[`;(-2 _ .j.v),(~`mw),`j`a;|:]}
                 .,(`j
                    .((`image;"Flip_32.png";)
                      (`help;"Flip Axes";)
                      (`l;"";)
                      (`c;`button;))
                    ))
                (`Cols
                 {.[`;(-2 _ .j.v),(~`mw),`j`a;{(0#`;,/x)}]}
                 .,(`j
                    .((`image;"Columns_32.png";)
                      (`help;"Columns";)
                      (`l;"";)
                      (`c;`button;))
                    ))
                (`Rows
                 {.[`;(-2 _ .j.v),(~`mw),`j`a;{(,/x;0#`)}]}
                 .,(`j
                    .((`image;"Rows_32.png";)
                      (`help;"Rows";)
                      (`l;"";)
                      (`c;`button;))
                    )))
              .,(`j
                 .((`c;`toolbar;)
                   (`panel;0;)
                   (`wy;0.0;)
                   (`border;0;)
                   (`l;"";))
                 )))
           .((`a
              `ts `mw `tb
              )
             (`c;`panel;)
             (`border;0;)
             (`label;"";)))
          ))
       )
      (`A
       .((`Return
          `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap"
          )
         (`Statistic
          `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score"
          )
         (`Period
          `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
          )
         (`ax
          .((`Return
             `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury AU f1" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f168" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Treasury CH f179" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap" `"Common Stock US Large Cap"
             )
            (`Statistic
             `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `Mean `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Standard Deviation" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score" `"Z Score"
             )
            (`Period
             `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4" `"2009Q4" `"2010Q1" `"2010Q2" `"2010Q3" `"2010Q4" `"2011Q1" `"2011Q2" `"2011Q3" `"2011Q4" `"2012Q1" `"2012Q2" `"2012Q3" `"2012Q4" `"2013Q1" `"2013Q2" `"2013Q3" `"2013Q4" `"2014Q1" `"2014Q2" `"2014Q3" `"2014Q4" `"2015Q1" `"2015Q2" `"2015Q3" `"2015Q4" `"2016Q1" `"2016Q2" `"2016Q3" `"2016Q4" `"2017Q1" `"2017Q2" `"2017Q3" `"2017Q4" `"2018Q1" `"2018Q2" `"2018Q3" `"2018Q4" `"2019Q1" `"2019Q2" `"2019Q3" `"2019Q4" `"2020Q1" `"2020Q2" `"2020Q3" `"2020Q4" `"2021Q1" `"2021Q2" `"2021Q3" `"2021Q4" `"2022Q1" `"2022Q2" `"2022Q3" `"2022Q4" `"2023Q1" `"2023Q2" `"2023Q3" `"2023Q4" `"2024Q1" `"2024Q2" `"2024Q3" `"2024Q4" `"2025Q1" `"2025Q2" `"2025Q3" `"2025Q4" `"2026Q1" `"2026Q2" `"2026Q3" `"2026Q4" `"2027Q1" `"2027Q2" `"2027Q3" `"2027Q4" `"2028Q1" `"2028Q2" `"2028Q3" `"2028Q4" `"2029Q1" `"2029Q2" `"2029Q3" `"2029Q4"
             ))
          )
         (`a
          (,`Period
           `Return `Statistic)
          )
         (`title;"Martingale Test Variables\nData by Period";))
       )
      (`D
       1 1.009338 1.018968 1.02899 1.037964 1.046653 1.055963 1.065779 1.077184 1.089186 1.101002 1.113785 1.127689 1.14256 1.157199 1.17273 1.187705 1.203076 1.220498 1.239348 1.256527 1.273488 1.290064 1.306593 1.32323 1.339572 1.35713 1.374158 1.391352 1.408218 1.425671 1.443767 1.463096 1.483878 1.504646 1.526132 1.548629 1.572233 1.596337 1.619432 1.6425 1.666276 1.691523 1.717058 1.741586 1.767071 1.792645 1.818953 1.846286 1.876909 1.908279 1.941551 1.974988 2.007696 2.040539 2.07556 2.112937 2.149852 2.183905 2.218644 2.253184 2.288383 2.325217 2.361139 2.397339 2.435089 2.472987 2.511266 2.551572 2.592391 2.633653 2.67283 2.712913 2.753205 2.793774 2.834855 2.876063 2.921707 2.967281 3.014814 3.062769 0 7.021667e-017 0.0006710079 0.001327318 0.002015764 0.002823836 0.003549245 0.004389865 0.005320381 0.006733402 0.007923891 0.00931764 0.01080535 0.01233212 0.01403265 0.01517313 0.01595814 0.01653354 0.01768175 0.01869234 0.01982815 0.0208271 0.02176377 0.02301191 0.02431597 0.02572604 0.02715683 0.02846723 0.02959809 0.03072434 0.03174326 0.03267918 0.03338708 0.03422427 0.03508797 0.03540561 0.03532029 0.03520517 0.03517113 0.03534886 0.03572772 0.03628143 0.03711371 0.03843912 0.03941317 0.04028934 0.04129466 0.04245056 0.0440718 0.04577734 0.04711515 0.04891178 0.05052231 0.05180891 0.05327359 0.05480694 0.05673754 0.05850946 0.06075664 0.06255652 0.06424433 0.06588367 0.06848147 0.07033683 0.0723573 0.07470729 0.07733508 0.07969292 0.08233913 0.08547492 0.08789508 0.09063484 0.09335136 0.09652337 0.09960374 0.1022639 0.104835 0.1072653 0.109708 0.1121807 0.1142461 0 1.329812014 28.26759 21.84117 18.83333 16.52098 15.76754 14.98417 14.50719 13.24525 12.74653 12.21179 11.81724 11.56007 11.20238 11.38393 11.76236 12.28265 12.47036 12.80461 12.93754 13.13138 13.32782 13.32322 13.29291 13.19956 13.15064 13.14345 13.22222 13.28647 13.40982 13.57951 13.87052 14.13846 14.3823 14.86012 15.53297 16.25425 16.95529 17.5234 17.98324 18.3641 18.63254 18.65439 18.8157 19.03904 19.19484 19.29193 19.20244 19.15595 19.27786 19.24999 19.29817 19.45025 19.53199 19.62453 19.61553 19.65242 19.48602 19.48068 19.50653 19.55542 19.35147 19.35172 19.31166 19.20949 19.04681 18.96362 18.84368 18.62992 18.5864 18.45681 18.3491 18.16353 18.0091 17.94235 17.89539 17.91545 17.93197 17.96044 18.05549 1 1.027752 0.9679623 0.9627307 0.9635181 0.9235753 0.9315717 0.8887028 0.8471148 0.8673537 0.8486072 0.8353017 0.8652655 0.8687724 0.8941647 0.9025511 0.8909841 0.8625798 0.8465387 0.8322285 0.811194 0.8360884 0.872524 0.8741734 0.8797612 0.8447219 0.8966554 0.8918932 0.8941607 0.8986213 0.91178 0.9412061 0.9265313 0.9386584 0.9784437 0.9774354 0.9655661 1.007534 1.062533 1.114663 1.117773 1.134848 1.223195 1.225402 1.191504 1.18953 1.228023 1.267915 1.274552 1.257237 1.257571 1.259078 1.277617 1.366683 1.354092 1.343537 1.324911 1.433984 1.363778 1.442601 1.466814 1.46572 1.476141 1.47131 1.492338 1.514591 1.506174 1.46582 1.525017 1.518492 1.583347 1.560922 1.568848 1.569102 1.568454 1.530345 1.478059 1.473111 1.455363 1.450452 1.438756 0 0.02223358 0.02801551 0.04391506 0.04203961 0.04342465 0.04955619 0.04686719 0.03960902 0.04089437 0.0396348 0.05179814 0.05772472 0.05846844 0.0578238 0.06115004 0.06957071 0.08065987 0.07541096 0.07571964 0.08629285 0.08996275 0.08569559 0.08148316 0.08542127 0.0674616 0.0745235 0.07240348 0.08187346 0.09639191 0.08993256 0.1061462 0.1043632 0.09821422 0.09507585 0.08710037 0.07916582 0.07338918 0.08096912 0.07246528 0.07461105 0.09808469 0.1059774 0.1172029 0.1154028 0.1071889 0.09861189 0.1033126 0.1074502 0.09889175 0.09916873 0.08563091 0.0861673 0.0965981 0.09391682 0.1038947 0.1051894 0.1350933 0.1155415 0.1215001 0.1340228 0.1501131 0.1401395 0.1380828 0.1419548 0.1403795 0.1361769 0.1269263 0.1301755 0.1108714 0.106323 0.09280831 0.113608 0.1130564 0.1217293 0.107138 0.1057774 0.1004649 0.09647191 0.1056364 0.106555 0 1.2482 -1.14357 -0.8486688 -0.8677975 -1.759939 -1.380822 -2.374737 -3.859859 -3.243632 -3.819695 -3.179618 -2.334087 -2.244418 -1.830308 -1.593603 -1.56698 -1.703699 -2.035 -2.215693 -2.187968 -1.821994 -1.487545 -1.544204 -1.407597 -2.301725 -1.386738 -1.493116 -1.292719 -1.051734 -0.9809568 -0.5538956 -0.703971 -0.6245698 -0.2267272 -0.2590639 -0.4349593 0.1026572 0.7723013 1.58232 1.578488 1.374815 2.10606 1.923175 1.659436 1.768188 2.312333 2.59325 2.555157 2.601201 2.597301 3.025515 3.221832 3.795963 3.770268 3.30659 3.088819 3.212476 3.148457 3.642804 3.483096 3.102459 3.397617 3.413244 3.46827 3.665716 3.717034 3.670007 4.033149 4.676516 5.486554 6.043874 5.007111 5.033793 4.669818 4.950114 4.519482 4.709219 4.720164 4.264176 4.117644 1 1.029134 0.9672596 0.9621308 0.9628883 0.9215275 0.9297723 0.885304 0.8421038 0.862763 0.8431396 0.8295331 0.8603018 0.8635951 0.8895027 0.8979272 0.8859789 0.8568264 0.8397943 0.8246426 0.8031615 0.8285132 0.8652574 0.8664264 0.8717562 0.8347612 0.8877194 0.8823051 0.8845644 0.8893315 0.9022138 0.9326827 0.9171684 0.9288213 0.9689105 0.9670693 0.9542353 0.9964139 1.052554 1.105093 1.107817 1.125637 1.21608 1.21837 1.182953 1.179952 1.218582 1.259116 1.26541 1.247004 1.24675 1.247444 1.265922 1.357129 1.34331 1.332199 1.312687 1.425431 1.351965 1.432364 1.457244 1.455827 1.465676 1.459878 1.481029 1.502749 1.493475 1.451236 1.511319 1.50298 1.568525 1.54445 1.553247 1.552628 1.551497 1.511063 1.457142 1.450749 1.431672 1.425586 1.413089 0 0.02308995 0.02903209 0.04553591 0.04365238 0.04503788 0.05139968 0.04853119 0.04092221 0.04234469 0.0409074 0.05344868 0.05959268 0.06023535 0.05963903 0.06306624 0.0717303 0.08298918 0.07765778 0.0780295 0.08885321 0.09242916 0.08813341 0.08372457 0.08779042 0.0693552 0.07696646 0.07468882 0.08470468 0.09959443 0.0928352 0.1097832 0.1077886 0.1015537 0.09862282 0.09026649 0.08192155 0.07587453 0.08407311 0.07575597 0.0779166 0.1019545 0.1104392 0.1221615 0.1200667 0.1115745 0.1026761 0.1076945 0.1117154 0.1028299 0.1030607 0.08914148 0.08956417 0.1003556 0.09695858 0.1068448 0.1089667 0.1400546 0.1191673 0.1250924 0.1381832 0.1552419 0.1451863 0.143365 0.1473124 0.1455531 0.1415429 0.13257 0.1360643 0.1161622 0.1114132 0.09756225 0.1187702 0.1178477 0.1272284 0.1123312 0.1102312 0.1035908 0.09920093 0.1081137 0.1091987 0 1.261775 -1.127731 -0.8316327 -0.8501635 -1.742368 -1.366306 -2.363347 -3.858446 -3.240949 -3.834523 -3.189357 -2.344217 -2.264533 -1.852768 -1.618502 -1.58958 -1.725209 -2.06297 -2.247322 -2.215322 -1.855333 -1.528849 -1.595393 -1.460795 -2.382501 -1.458825 -1.575803 -1.362801 -1.111191 -1.053331 -0.6131844 -0.7684635 -0.7008975 -0.3152359 -0.364817 -0.5586402 -0.04726331 0.6251017 1.387251 1.383751 1.23228 1.956552 1.787548 1.523763 1.612842 2.128851 2.406029 2.375768 2.402058 2.394217 2.775856 2.969071 3.558636 3.54079 3.109172 2.869561 3.03761 2.953535 3.456358 3.308973 2.936236 3.207438 3.20774 3.265364 3.454056 3.486399 3.403754 3.757919 4.32998 5.102851 5.580543 4.658125 4.689336 4.334703 4.549607 4.147118 4.351244 4.351494 3.936465 3.782909 1 1.041582 1.049257 1.068807 1.087005 1.092945 1.144275 1.106527 1.124977 1.170189 1.21935 1.227416 1.222794 1.26363 1.285085 1.37752 1.417646 1.399042 1.388551 1.475356 1.510932 1.600477 1.625143 1.69851 1.77162 1.798826 1.832609 1.860515 2.046169 2.115694 2.143097 2.243425 2.406939 2.468712 2.500089 2.500453 2.641016 2.770598 2.841609 2.973108 3.150383 3.138186 3.292521 3.414217 3.61976 3.961141 3.980151 4.394443 4.565011 4.758886 4.995895 5.2939 5.322189 5.706472 5.688008 6.122258 6.43007 6.771548 7.010166 7.047461 7.402433 7.795033 7.994221 8.382159 8.796132 8.862627 8.928729 9.128481 9.703639 9.362423 9.433551 9.762469 10.17523 10.3966 10.51306 10.54712 11.08545 11.25075 12.27373 11.96842 12.8677 0 0.0178872 0.02371761 0.03232049 0.03466935 0.05080127 0.05757086 0.05270153 0.0553868 0.05012568 0.0540401 0.07916092 0.09005547 0.1062644 0.1196511 0.1319764 0.1580403 0.1516408 0.1366363 0.1343701 0.1373954 0.162745 0.1760101 0.1829071 0.1907082 0.1999597 0.2305694 0.2677174 0.314417 0.3319166 0.3150618 0.3527718 0.3421872 0.3348315 0.3269802 0.3144516 0.3257147 0.3625348 0.3899482 0.4265118 0.4694797 0.4836427 0.5083232 0.579737 0.6267429 0.6760881 0.6479884 0.7646981 0.7913596 0.8764637 0.932599 1.025437 1.076416 1.179921 1.16189 1.416138 1.537613 1.53226 1.612194 1.654422 1.818479 1.948856 2.100822 2.201647 2.341286 2.337915 2.382142 2.457634 2.750514 2.613639 2.770815 2.847181 3.012635 3.093132 3.145485 3.08245 3.370879 3.330225 3.786804 3.539464 3.849007 0 2.324692 2.076824 2.128882 2.50956 1.829579 2.50604 2.021329 2.256445 3.395236 4.059028 2.872837 2.473964 2.480885 2.382635 2.860513 2.642657 2.631497 2.843689 3.537664 3.718696 3.68968 3.551745 3.818935 4.046078 3.994935 3.611101 3.214267 3.327329 3.361369 3.628168 3.52473 4.111606 4.386421 4.587705 4.771649 5.038201 4.883938 4.722701 4.62615 4.580354 4.421003 4.509968 4.164332 4.179959 4.379816 4.59908 4.438932 4.50492 4.288695 4.284687 4.187385 4.015352 3.988802 4.034812 3.617061 3.531494 3.76669 3.727942 3.655331 3.520763 3.486677 3.329278 3.353016 3.32985 3.363094 3.328403 3.307442 3.164369 3.199532 3.043707 3.077595 3.045583 3.037892 3.024354 3.09725 2.991935 3.078096 2.977109 3.098893 3.083314
       )
      (`V;`Pivot;))))
 .((`j
    .((`loc
       797 258
       .())
      (`l
       (`Report;"Report8-1";" (";`Martingale_Test;"[0]";"; Pivot";") - ";"C:\\Users\\s2shno\\Documents\\Gem_Test_All_Assets_Noah.dfs")
       )
      (`menu
       .((`File
          .((`Open_;{
 if[~_n~a:.j.Open`.k.DFR
  d:.f.read File::a
  m:apply_where[d[1;2];oget`o]
  oset[`o;m]
  apply[]
  status("Report opened: &0",File)]
};)
            (`Save;{:[#File;save_ File;save_as_[]]};)
            (`Save_As_;{if[~_n~f:.j.Save`.k.DFR;save_ f]};)
            (`s0;" ";)
            (`Export_to_XLSX_;{[x;y]
 chooser_or_filename: :[x~`launch;.u.tempName[@[.a`a;0;{*.u.uc x}],"Workbook";`xltx];`.k.XLSX]	/ XLSX global is defined in main/v/xlsx.k
 file:export_general[chooser_or_filename;export_report_as_xlsx]
 if[x~`launch;if[~file~_n;.w.exec["new";file;_n;_n;`normal;_n]]]
}[`nolaunch];)
            (`Excel_Workbook;{[x;y]
 chooser_or_filename: :[x~`launch;.u.tempName[@[.a`a;0;{*.u.uc x}],"Workbook";`xltx];`.k.XLSX]	/ XLSX global is defined in main/v/xlsx.k
 file:export_general[chooser_or_filename;export_report_as_xlsx]
 if[x~`launch;if[~file~_n;.w.exec["new";file;_n;_n;`normal;_n]]]
}[`launch];)
            (`s05;" ";)
            (`Print_;{.j.p[`_.k.r;1]};)
            (`Page_Setup_;{.j.pf`_.k.r};)
            (`Acrobat_Report;{.u.exec[Pdf.run;_n]};)
            (`Acrobat_Page_Setup_;{.u.exec[Pdf.get;_n]};)
            (`s1;" ";)
            (`Exit;{sexit 0};))
          )
         (`Display
          .,(`Text_Size
             (`Medium
              `Huge `Large `Medium `Small `Tiny)
             )
          )
         (`Window
          .((`Options;{:[Detached;option_b[];option_a[]];.j.flush[];refresh[]};)
            (`s0;" ";)
            (`Hide;{r..j.v::0;if[Detached;hide_option[]]};)
            (`s1;" ";)
            (`Pivot;{Simple[_n;_n]};)
            (`Close_Pivots;{Pivots[].m.S\:(`exit;);};)
            (`Hide_Pivots;{Pivots[].m.S\:(`hide;)};)
            (`Show_Pivots;{Pivots[].m.S\:(`show;)};)
            (`s2;" ";)
            (`Clone;{.m.S[Client;(`clone;(I;.b.get oget`o))]};))
          )
         (`View
          (`Pivot
           `Pivot `Statistics `Martingale)
          )
         (`Help
          .((`ADVISE_Help;{[topic]
 .m.S[(`localhost;.p`App);(`help.d;,topic)]
};)
            (`About_ADVISE;{.j.ok.i("\n&0\256 &1

\251 2012 by Conning, Inc.

All rights reserved.

This software is subject to the &0\256 software agreement.
";.a`A;.v.C)
};))
          ))
       .,(`j
          .((`nl
             ((`View `Pivot
               `View `Statistics
               `View `Martingale)
              ("Pivot"
               "Statistics"
               "Martingale"))
             )
            (`ne
             ((`File `Acrobat_Report
               `File `Acrobat_Page_Setup_
               `Window `Hide
               `Window `Pivot
               `Window `Close_Pivots
               `Window `Hide_Pivots
               `Window `Show_Pivots
               `Window `Cascade_Pivots
               `Window `Clone)
              1 1 1 1 1 1 1 1 1)
             )
            (`async;2;)
            (`acc
             ((`File `Save
               `File `Print_
               `File `Exit)
              `s `p `e)
             )
            (`mnem
             ((,`File
               `File `Save
               `File `Save_As_
               `File `Open_
               `File `Page_Setup_
               `File `Print_
               `File `Acrobat_Report
               `File `Acrobat_Page_Setup_
               `File `Exit
               ,`Window
               `Window `Options
               `Window `Hide
               `Window `Pivot
               `Window `Show_Pivots
               `Window `Hide_Pivots
               `Window `Close_Pivots
               `Window `Clone
               ,`Display
               `Display `Text_Size
               ,`View
               ,`Help
               `Help `ADVISE_Help
               `Help `About_ADVISE)
              `f `s `a `o `g `p `r `t `e `w `o `h `p `s `i `c `o `d `t `v `h `h `a)
             ))
          ))
      (`v;1;)
      (`a
       `t `r `o
       )
      (`c;`panel;)
      (`close;{sexit 0};)
      (`xy
       1015 850
       .())
      (`ok;`ok;)
      (`wy;0.9;))
    .,(`t;".j.k[];.j.flush[];";))
   (`t;".j.k[];.j.flush[];";)))

panel:rpt[0]
panel.:rpt[1]


.j.Java {
  .j.c`panel
}
panel..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
