serialized: (.((`m
    `Bonds
    .((`C;`model;)
      (`L;0;)
      (`j
       .((`fill;`h;)
         (`c;`combo;)
         (`o
          `Bonds `Mortgages `Market_Indices `Property `Interest_Rate_Derivatives `Index_Derivatives `Investments_in_Affiliates `Aggregate `Usage
          )
         (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
         (`l;`Model;)
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
          (`Bonds `Mortgages `Market_Indices `Property `Interest_Rate_Derivatives `Index_Derivatives `Investments_in_Affiliates `Aggregate `Usage
           `Bonds `Mortgages `Market_Indices `Property `Interest_Rate_Derivatives `Index_Derivatives `Investments_in_Affiliates `Aggregate `Usage)
          ))
       )
      (`M;();)
      (`P;;)))
   (`Bonds
    .((`Categorical
       .((`Rating
          .((`m
             `selected
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   .()))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Treasury
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Treasury;)
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
                      .()))
                   ))
               (`AAA
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AAA;)
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
                      .()))
                   ))
               (`AA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AA;)
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
                      .()))
                   ))
               (`A
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`A;)
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
                      .()))
                   ))
               (`BBB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`BBB;)
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
                      .()))
                   ))
               (`High_Yield
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`High_Yield;)
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
                      .()))
                   ))
               (`Default
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Default;)
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
                      .()))
                   ))
               (`Muni_Insured
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Insured;)
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
                      .()))
                   ))
               (`Pfandbriefe
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Pfandbriefe;)
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
                      .()))
                   ))
               (`Schuldschein_Pools
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Schuldschein_Pools;)
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
                      .()))
                   ))
               (`Muni_AA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_AA;)
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
                      .()))
                   ))
               (`Muni_BBB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_BBB;)
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
                      .()))
                   ))
               (`Muni_Rev_Low_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Rev_Low_Risk;)
                     (`v;0;)
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
                      .()))
                   ))
               (`Muni_Rev_High_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Rev_High_Risk;)
                     (`v;0;)
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
                      .()))
                   ))
               (`Muni_GO_Low_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_GO_Low_Risk;)
                     (`v;0;)
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
                      .()))
                   ))
               (`Muni_GO_High_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_GO_High_Risk;)
                     (`v;0;)
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
                      .()))
                   ))
               (`Muni_Default
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Default;)
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
                      .()))
                   ))
               (`Inflation_Linked
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Inflation_Linked;)
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
                      .()))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Bond Rating";)
               (`a
                `m `selected
                ))
             )
            (`P;1;)))
         (`Lagged_Rating
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   .()))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Treasury
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Treasury;)
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
                      ))
                   ))
               (`AAA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AAA;)
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
                      ))
                   ))
               (`AA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AA;)
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
                      ))
                   ))
               (`A
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`A;)
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
                      ))
                   ))
               (`BBB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`BBB;)
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
                      ))
                   ))
               (`High_Yield
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`High_Yield;)
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
                      ))
                   ))
               (`Default
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Default;)
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
                      ))
                   ))
               (`Muni_Insured
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Insured;)
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
                      ))
                   ))
               (`Pfandbriefe
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Pfandbriefe;)
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
                      ))
                   ))
               (`Schuldschein_Pools
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Schuldschein_Pools;)
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
                      ))
                   ))
               (`Muni_AA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_AA;)
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
                      ))
                   ))
               (`Muni_BBB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_BBB;)
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
                      ))
                   ))
               (`Muni_Rev_Low_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Rev_Low_Risk;)
                     (`v;0;)
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
                      ))
                   ))
               (`Muni_Rev_High_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Rev_High_Risk;)
                     (`v;0;)
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
                      ))
                   ))
               (`Muni_GO_Low_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_GO_Low_Risk;)
                     (`v;0;)
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
                      ))
                   ))
               (`Muni_GO_High_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_GO_High_Risk;)
                     (`v;0;)
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
                      ))
                   ))
               (`Muni_Default
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Default;)
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
                      ))
                   ))
               (`Inflation_Linked
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Inflation_Linked;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Lagged Rating";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Original_Rating
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   .()))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Treasury
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Treasury;)
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
                      ))
                   ))
               (`AAA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AAA;)
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
                      ))
                   ))
               (`AA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AA;)
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
                      ))
                   ))
               (`A
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`A;)
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
                      ))
                   ))
               (`BBB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`BBB;)
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
                      ))
                   ))
               (`High_Yield
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`High_Yield;)
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
                      ))
                   ))
               (`Default
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Default;)
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
                      ))
                   ))
               (`Muni_Insured
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Insured;)
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
                      ))
                   ))
               (`Pfandbriefe
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Pfandbriefe;)
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
                      ))
                   ))
               (`Schuldschein_Pools
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Schuldschein_Pools;)
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
                      ))
                   ))
               (`Muni_AA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_AA;)
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
                      ))
                   ))
               (`Muni_BBB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_BBB;)
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
                      ))
                   ))
               (`Muni_Rev_Low_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Rev_Low_Risk;)
                     (`v;0;)
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
                      ))
                   ))
               (`Muni_Rev_High_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Rev_High_Risk;)
                     (`v;0;)
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
                      ))
                   ))
               (`Muni_GO_Low_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_GO_Low_Risk;)
                     (`v;0;)
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
                      ))
                   ))
               (`Muni_GO_High_Risk
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_GO_High_Risk;)
                     (`v;0;)
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
                      ))
                   ))
               (`Muni_Default
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Muni_Default;)
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
                      ))
                   ))
               (`Inflation_Linked
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Inflation_Linked;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Original Rating";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Special_Category
          .((`m
             `selected
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   .()))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`None
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`None;)
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
                      .()))
                   ))
               (`Unquoted
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Unquoted;)
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
                      .()))
                   ))
               (`Alternative_Asset
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Alternative_Asset;)
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
                      .()))
                   ))
               (`Pref_70_pct_drd
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Pref_70_pct_drd;)
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
                      .()))
                   ))
               (`Pref_80_pct_drd
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Pref_80_pct_drd;)
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
                      .()))
                   ))
               (`Pref_100_pct_drd
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Pref_100_pct_drd;)
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
                      .()))
                   ))
               (`Pref_0_pct_drd
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Pref_0_pct_drd;)
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
                      .()))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Special Category";)
               (`a
                `m `selected
                ))
             )
            (`P;1;)))
         (`Coupon_Type
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   .()))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Fixed
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Fixed;)
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
                      ))
                   ))
               (`Inflation_Linked
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Inflation_Linked;)
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
                      ))
                   ))
               (`FRN
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`FRN;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Coupon Type";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Economy
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   .()))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`US
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`US;)
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
                      ))
                   ))
               (`DE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DE;)
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
                      ))
                   ))
               (`GB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GB;)
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
                      ))
                   ))
               (`CH
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CH;)
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
                      ))
                   ))
               (`AU
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AU;)
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
                      ))
                   ))
               (`CA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CA;)
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
                      ))
                   ))
               (`JP
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`JP;)
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
                      ))
                   ))
               (`DK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DK;)
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
                      ))
                   ))
               (`NO
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NO;)
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
                      ))
                   ))
               (`SE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SE;)
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
                      ))
                   ))
               (`BR
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`BR;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`Economy;)
               (`a
                `m `all
                ))
             )
            (`P;1;))))
       .((`j
          .((`l;`"Categorical Selections";)
            (`c;`panel;)
            (`border;1;)
            (`a
             ,`Rating `Lagged_Rating `Original_Rating `Special_Category `Coupon_Type `Economy
             ))
          )
         (`P;1;)))
      (`Continuous
       .((`item;();.())
         (`relation;();.())
         (`add;0#0.0;.())
         (`mult;0#0.0;.())
         (`user
          ()
          .,(`V;{[axis;extras;p;x]
  :[(axis~`Inner_Loop)&(~`Inner_Loop_Projections _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the Inner Loop Projections module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    (axis~`User_Value)&(~`User_Values _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the User Values module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    #a:&~((),x) _lin extras,.L.U.active_axis@axis
      ,(1;"A chosen input is deselected or Unspecified"),:[@x;();,,a]
    (axis~`User_Value)&#a:&#:'get_spanned_axes'(),x / this belongs in a generic insertion point validation
        ,(1;"Spanned user value not allowed here"),:[@x;();,,a]]}[`User_Value;`Zero `One `Period];)))
       .((`j
          .((`c;`Table;)
            (`l;`"Continuous Selections";)
            (`cell
             .((`user
                .((`c;`combo;)
                  (`o
                   `Unspecified_ `New_User_Value_ `Zero `One `Period `UST `USTP `Normal `Uniform `Previous `PC_Insurance_0 `Financing_0 `Investments_0 `Accounting_0 `Combined_0 `Yields `Returns `FX `Combined_1 `PC_Insurance_2 `Financing_2 `Investments_2 `Accounting_2 `Combined_2 `Financing_4 `Investments_4 `Accounting_4 `Combined_4 `Counterparty_2_collectibility `Counterparty_3_collectibility `Reinsurance_Entity_collectibility `fixed_1 `fixed_2 `fixed_3 `fixed_4 `fixed_5 `function `transform `stransform `inline `ispline `multifiltered `reference_vectors `prior_arguments `combination `byProduct `byTreaty `sum_random `Portfolio_Return `Path_Number
                   ))
                )
               (`relation
                .((`c;`combo;)
                  (`o
                   `GT `GE `EQ `LE `LT `NE
                   )
                  (`ol
                   (`GT `GE `EQ `LE `LT `NE
                    `">" `">=" `"=" `"<=" `"<" `"<>")
                   ))
                )
               (`item
                .((`c;`combo;)
                  (`o
                   `Maturity `Coupon `Coupon_Frequency `YTM_At_Issue `Trade_Cost `Price `Duration_Fisher_Weil `Duration_Modified `Convexity_Fisher_Weil `Convexity_Modified `Redemption `YTM `SA_Yield `Intensity `ID
                   ))
                ))
             )
            (`editor
             .((`user;1;)
               (`relation;1;)
               (`item;1;))
             )
            (`p
             .((`user;`Zero;)
               (`relation;`GT;)
               (`item;`Maturity;)
               (`add;0.0;)
               (`mult;1.0;))
             )
            (`cl
             .((`item;`Item;)
               (`relation;`Relation;)
               (`add;`"Fixed Value";)
               (`mult;`"Multiple of\nUser Value";)
               (`user;`"User Value";))
             )
            (`f
             .((`add;9.6;)
               (`mult;9.6;))
             )
            (`g
             .((`add;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`mult;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
             )
            (`u
             .((`add;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`mult;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`user;{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};))
             )
            (`reorder;0;)
            (`popup
             .((`Insert;{if[#s:of[c:name.c v;`Rows;,v:ad -2_.j.v];of[c;`ins`row;(v;*s;#s)];fire_f[`Insert;`t;v;()]]};)
               (`Append;{of[c;`app`row;(v;1|#of[c:name.c v;`Rows;,v:ad -2_.j.v])];fire_f[`Append;`t;v;()];};)
               (`Delete;{if[#s:of[c:name.c v;`Rows;,v:ad -2_.j.v];of[c;`del`row;(v;s)];fire_f[`Delete;`t;v;()]]};)
               (`s;" ";)
               (`Cut;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`cut;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
               (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
               (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
               (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
               (`Paste_Transpose;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste_transpose;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
               (`s99;" ";)
               (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
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
                     ,`Paste_Transpose
                     ,`s99
                     ,`Copy_Location)
                    0 1 0 0 0 0 1 0 0 0 0)
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
          )
         (`U;`User_Value;)
         (`J
          .((`C;{[c;x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(`Unspecified_,(`$("New_"),($a),"_")),(z#y),x}[u];+2#,#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
 			e:.[e;(`j;`u;x);:[;c]]
			(d;e)}[{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};,`user;,`Zero `One `Period];)
            (`D;{  [x;d;e;a;u]	x:x@&x _lin !d; d:.[d;(x;);{:[y _in x;`Unspecified_;y]}[u]];(d;e)}[,`user];)
            (`R;{  [x;d;e;a;u]	d:.[d;(x;);{:[y _in !x;x@y;y]}[u]];(d;e)}[,`user];)
            (`A;{    [d;e;a;u]	(d;e)};)
            (`L;{[x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(z#y),x}[u];+2#,2+#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
			(d;e)}[,`user;,`Zero `One `Period];)
            (`F
             ,`user
             ))
          )
         (`P;1;)))
      (`Securities
       .((`m
          `all
          .((`C;`model;)
            (`j
             .((`l;`"Selection Criterion";)
               (`ol
                (`all `selected
                 `All `Selected)
                )
               (`fill;`h;)
               (`c;`combo;)
               (`o
                `all `selected
                )
               (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                .()))
             )
            (`M;();)
            (`P;;)))
         (`all

          .((`j
             .((`c;`panel;)
               (`border;0;)
               (`l;`"All Securities Selected";))
             )
            (`M
             ,`all
             )))
         (`included
          ,`"*"
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Included Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             )
            (`V;{[p;x]:[~#x;,(0;"An empty list of Included Securities will be interpretted as including all securities.");_n]};)))
         (`excluded
          0#`
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Excluded Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"X*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             ))))
       .((`j
          .((`l;`"Security IDs";)
            (`c;`panel;)
            (`aa
             (`m
              `all `included `excluded)
             )
            (`border;1;)
            (`a
             `m `all
             ))
          )
         (`P;1;))))
    .((`j
       .((`l;`"Bond Investment Class";)
         (`c;`panel;)
         (`a
          (`Categorical
           `Continuous `Securities)
          ))
       )
      (`P;1;)
      (`L;0;)
      (`M
       ,`Bonds
       )))
   (`Mortgages
    .((`Categorical
       .((`Rating
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`GNMA_Passthru
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GNMA_Passthru;)
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
                      ))
                   ))
               (`German_Style_Mortgage
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`German_Style_Mortgage;)
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
                      ))
                   ))
               (`CMO
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`CMO;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Mortgage Type";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Class
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`None
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`None;)
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
                      ))
                   ))
               (`Sequential
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Sequential;)
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
                      ))
                   ))
               (`VADM
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`VADM;)
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
                      ))
                   ))
               (`Scheduled
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Scheduled;)
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
                      ))
                   ))
               (`SoftZ
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SoftZ;)
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
                      ))
                   ))
               (`HardZ
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`HardZ;)
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
                      ))
                   ))
               (`PAC
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`PAC;)
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
                      ))
                   ))
               (`Support
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Support;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"CMO Tranche";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Economy
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`US
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`US;)
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
                      ))
                   ))
               (`DE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DE;)
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
                      ))
                   ))
               (`GB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GB;)
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
                      ))
                   ))
               (`CH
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CH;)
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
                      ))
                   ))
               (`AU
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AU;)
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
                      ))
                   ))
               (`CA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CA;)
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
                      ))
                   ))
               (`JP
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`JP;)
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
                      ))
                   ))
               (`DK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DK;)
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
                      ))
                   ))
               (`NO
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NO;)
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
                      ))
                   ))
               (`SE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SE;)
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
                      ))
                   ))
               (`BR
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`BR;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`Economy;)
               (`a
                `m `all
                ))
             )
            (`P;1;))))
       .((`j
          .((`l;`"Categorical Selections";)
            (`c;`panel;)
            (`border;1;)
            (`a
             ,`Rating `Class `Economy
             ))
          )
         (`P;1;)))
      (`Continuous
       .((`item;();.())
         (`relation;();.())
         (`add;0#0.0;.())
         (`mult;0#0.0;.())
         (`user
          ()
          .,(`V;{[axis;extras;p;x]
  :[(axis~`Inner_Loop)&(~`Inner_Loop_Projections _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the Inner Loop Projections module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    (axis~`User_Value)&(~`User_Values _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the User Values module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    #a:&~((),x) _lin extras,.L.U.active_axis@axis
      ,(1;"A chosen input is deselected or Unspecified"),:[@x;();,,a]
    (axis~`User_Value)&#a:&#:'get_spanned_axes'(),x / this belongs in a generic insertion point validation
        ,(1;"Spanned user value not allowed here"),:[@x;();,,a]]}[`User_Value;`Zero `One `Period];)))
       .((`j
          .((`c;`Table;)
            (`l;`"Continuous Selections";)
            (`cell
             .((`user
                .((`c;`combo;)
                  (`o
                   `Unspecified_ `New_User_Value_ `Zero `One `Period `UST `USTP `Normal `Uniform `Previous `PC_Insurance_0 `Financing_0 `Investments_0 `Accounting_0 `Combined_0 `Yields `Returns `FX `Combined_1 `PC_Insurance_2 `Financing_2 `Investments_2 `Accounting_2 `Combined_2 `Financing_4 `Investments_4 `Accounting_4 `Combined_4 `Counterparty_2_collectibility `Counterparty_3_collectibility `Reinsurance_Entity_collectibility `fixed_1 `fixed_2 `fixed_3 `fixed_4 `fixed_5 `function `transform `stransform `inline `ispline `multifiltered `reference_vectors `prior_arguments `combination `byProduct `byTreaty `sum_random `Portfolio_Return `Path_Number
                   ))
                )
               (`relation
                .((`c;`combo;)
                  (`o
                   `GT `GE `EQ `LE `LT `NE
                   )
                  (`ol
                   (`GT `GE `EQ `LE `LT `NE
                    `">" `">=" `"=" `"<=" `"<" `"<>")
                   ))
                )
               (`item
                .((`c;`combo;)
                  (`o
                   `Maturity `Coupon `Trade_Cost `Price `Payment_Frequency `Interest_Payment `Principal_Payment `Duration_Fisher_Weil `Duration_Modified `Convexity_Fisher_Weil `Convexity_Modified `SA_Yield `ID
                   ))
                ))
             )
            (`editor
             .((`user;1;)
               (`relation;1;)
               (`item;1;))
             )
            (`p
             .((`user;`Zero;)
               (`relation;`GT;)
               (`item;`Maturity;)
               (`add;0.0;)
               (`mult;1.0;))
             )
            (`cl
             .((`item;`Item;)
               (`relation;`Relation;)
               (`add;`"Fixed Value";)
               (`mult;`"Multiple of\nUser Value";)
               (`user;`"User Value";))
             )
            (`f
             .((`add;9.6;)
               (`mult;9.6;))
             )
            (`g
             .((`add;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`mult;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
             )
            (`u
             .((`add;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`mult;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`user;{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};))
             )
            (`reorder;0;)
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
             ))
          )
         (`U;`User_Value;)
         (`J
          .((`C;{[c;x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(`Unspecified_,(`$("New_"),($a),"_")),(z#y),x}[u];+2#,#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
 			e:.[e;(`j;`u;x);:[;c]]
			(d;e)}[{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};,`user;,`Zero `One `Period];)
            (`D;{  [x;d;e;a;u]	x:x@&x _lin !d; d:.[d;(x;);{:[y _in x;`Unspecified_;y]}[u]];(d;e)}[,`user];)
            (`R;{  [x;d;e;a;u]	d:.[d;(x;);{:[y _in !x;x@y;y]}[u]];(d;e)}[,`user];)
            (`A;{    [d;e;a;u]	(d;e)};)
            (`L;{[x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(z#y),x}[u];+2#,2+#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
			(d;e)}[,`user;,`Zero `One `Period];)
            (`F
             ,`user
             ))
          )
         (`P;1;)))
      (`Securities
       .((`m
          `all
          .((`C;`model;)
            (`j
             .((`l;`"Selection Criterion";)
               (`ol
                (`all `selected
                 `All `Selected)
                )
               (`fill;`h;)
               (`c;`combo;)
               (`o
                `all `selected
                )
               (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                ))
             )
            (`M;();)
            (`P;;)))
         (`all

          .((`j
             .((`c;`panel;)
               (`border;0;)
               (`l;`"All Securities Selected";))
             )
            (`M
             ,`all
             )))
         (`included
          ,`"*"
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Included Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             )
            (`V;{[p;x]:[~#x;,(0;"An empty list of Included Securities will be interpretted as including all securities.");_n]};)))
         (`excluded
          0#`
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Excluded Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"X*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             ))))
       .((`j
          .((`l;`"Security IDs";)
            (`c;`panel;)
            (`aa
             (`m
              `all `included `excluded)
             )
            (`border;1;)
            (`a
             `m `all
             ))
          )
         (`P;1;))))
    .((`j
       .((`l;`"Mortgage Investment Class";)
         (`c;`panel;)
         (`a
          (`Categorical
           `Continuous `Securities)
          ))
       )
      (`P;1;)
      (`L;0;)
      (`M
       ,`Mortgages
       )))
   (`Market_Indices
    .((`Categorical
       .((`Accounting_Treatment
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Common_Stock
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Common_Stock;)
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
                      ))
                   ))
               (`Fixed_Income
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Fixed_Income;)
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
                      ))
                   ))
               (`Property
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Property;)
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
                      ))
                   ))
               (`Alternative_Asset
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Alternative_Asset;)
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
                      ))
                   ))
               (`Preferred_Stock_100p_DRD
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Preferred_Stock_100p_DRD;)
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
                      ))
                   ))
               (`Preferred_Stock_80p_DRD
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Preferred_Stock_80p_DRD;)
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
                      ))
                   ))
               (`Preferred_Stock_70p_DRD
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Preferred_Stock_70p_DRD;)
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
                      ))
                   ))
               (`Preferred_Stock_no_DRD
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Preferred_Stock_no_DRD;)
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
                      ))
                   ))
               (`Non_Tradeable
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Non_Tradeable;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Accounting Treatment";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Common_Stock_Index
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Large_Cap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Large_Cap;)
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
                      ))
                   ))
               (`Mid_Cap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Mid_Cap;)
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
                      ))
                   ))
               (`Broad_Cap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Broad_Cap;)
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
                      ))
                   ))
               (`Small_Cap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Small_Cap;)
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
                      ))
                   ))
               (`Other_Sector
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Other_Sector;)
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
                      ))
                   ))
               (`None
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`None;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Common Stock Indices";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Economy
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`US
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`US;)
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
                      ))
                   ))
               (`DE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DE;)
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
                      ))
                   ))
               (`GB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GB;)
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
                      ))
                   ))
               (`CH
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CH;)
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
                      ))
                   ))
               (`AU
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AU;)
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
                      ))
                   ))
               (`CA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CA;)
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
                      ))
                   ))
               (`JP
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`JP;)
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
                      ))
                   ))
               (`DK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DK;)
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
                      ))
                   ))
               (`NO
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NO;)
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
                      ))
                   ))
               (`SE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SE;)
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
                      ))
                   ))
               (`BR
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`BR;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`Economy;)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Market_Index
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Barra_Value
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
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
                      ))
                   ))
               (`US_Large_Cap
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
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
                      ))
                   ))
               (`DE_Large_Cap
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
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
                      ))
                   ))
               (`GB_Large_Cap
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
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
                      ))
                   ))
               (`CH_Large_Cap
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`U;`Market_Index;)
               (`J
                .((`C;{[d;e;a;u]d:.+(u;*d[];*d[~!d]);entity_radiobuttons_attr[d;e]};)
                  (`D;{[d;e;a;u]entity_radiobuttons_attr[d _di u@&u _lin!d;e]};)
                  (`R;{[d;e;a;u]entity_radiobuttons_attr[.+(u[];d[!u];d[~!u]);e]};)
                  (`A;{[d;e;a;u]d[u]:0;d[~u]:d[~*!d];entity_radiobuttons_attr[d;e]};)
                  (`L;{[d;e;a;u]entity_radiobuttons_attr[.+(u;d[u];d[~u]);e]};))
                )
               (`H;{[d;e]
 d[.;`j]:.(`c`check;`anchor`nw;(`wy;.j.NoExtraSpace))
 if[#!d; d[~*|!d;`j;`wy]:1.]
 (d;e)};)
               (`H_;{[d;v;g;c](d;v;())};)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Market Indices (by Name)";)
               (`a
                `m `all
                ))
             )
            (`P;1;))))
       .((`j
          .((`l;`"Categorical Selections";)
            (`c;`panel;)
            (`border;1;)
            (`a
             ,`Accounting_Treatment `Common_Stock_Index `Economy `Market_Index
             ))
          )
         (`P;1;)))
      (`Continuous
       .((`item;();.())
         (`relation;();.())
         (`add;0#0.0;.())
         (`mult;0#0.0;.())
         (`user
          ()
          .,(`V;{[axis;extras;p;x]
  :[(axis~`Inner_Loop)&(~`Inner_Loop_Projections _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the Inner Loop Projections module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    (axis~`User_Value)&(~`User_Values _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the User Values module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    #a:&~((),x) _lin extras,.L.U.active_axis@axis
      ,(1;"A chosen input is deselected or Unspecified"),:[@x;();,,a]
    (axis~`User_Value)&#a:&#:'get_spanned_axes'(),x / this belongs in a generic insertion point validation
        ,(1;"Spanned user value not allowed here"),:[@x;();,,a]]}[`User_Value;`Zero `One `Period];)))
       .((`j
          .((`c;`Table;)
            (`l;`"Continuous Selections";)
            (`cell
             .((`user
                .((`c;`combo;)
                  (`o
                   `Unspecified_ `New_User_Value_ `Zero `One `Period `UST `USTP `Normal `Uniform `Previous `PC_Insurance_0 `Financing_0 `Investments_0 `Accounting_0 `Combined_0 `Yields `Returns `FX `Combined_1 `PC_Insurance_2 `Financing_2 `Investments_2 `Accounting_2 `Combined_2 `Financing_4 `Investments_4 `Accounting_4 `Combined_4 `Counterparty_2_collectibility `Counterparty_3_collectibility `Reinsurance_Entity_collectibility `fixed_1 `fixed_2 `fixed_3 `fixed_4 `fixed_5 `function `transform `stransform `inline `ispline `multifiltered `reference_vectors `prior_arguments `combination `byProduct `byTreaty `sum_random `Portfolio_Return `Path_Number
                   ))
                )
               (`relation
                .((`c;`combo;)
                  (`o
                   `GT `GE `EQ `LE `LT `NE
                   )
                  (`ol
                   (`GT `GE `EQ `LE `LT `NE
                    `">" `">=" `"=" `"<=" `"<" `"<>")
                   ))
                )
               (`item
                .((`c;`combo;)
                  (`o
                   `Price `Dividend_Yield `Annual_Growth_Rate `Trade_Cost `Duration `Convexity
                   ))
                ))
             )
            (`editor
             .((`user;1;)
               (`relation;1;)
               (`item;1;))
             )
            (`p
             .((`user;`Zero;)
               (`relation;`GT;)
               (`item;`Price;)
               (`add;0.0;)
               (`mult;1.0;))
             )
            (`cl
             .((`item;`Item;)
               (`relation;`Relation;)
               (`add;`"Fixed Value";)
               (`mult;`"Multiple of\nUser Value";)
               (`user;`"User Value";))
             )
            (`f
             .((`add;9.6;)
               (`mult;9.6;))
             )
            (`g
             .((`add;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`mult;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
             )
            (`u
             .((`add;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`mult;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`user;{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};))
             )
            (`reorder;0;)
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
             ))
          )
         (`U;`User_Value;)
         (`J
          .((`C;{[c;x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(`Unspecified_,(`$("New_"),($a),"_")),(z#y),x}[u];+2#,#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
 			e:.[e;(`j;`u;x);:[;c]]
			(d;e)}[{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};,`user;,`Zero `One `Period];)
            (`D;{  [x;d;e;a;u]	x:x@&x _lin !d; d:.[d;(x;);{:[y _in x;`Unspecified_;y]}[u]];(d;e)}[,`user];)
            (`R;{  [x;d;e;a;u]	d:.[d;(x;);{:[y _in !x;x@y;y]}[u]];(d;e)}[,`user];)
            (`A;{    [d;e;a;u]	(d;e)};)
            (`L;{[x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(z#y),x}[u];+2#,2+#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
			(d;e)}[,`user;,`Zero `One `Period];)
            (`F
             ,`user
             ))
          )
         (`P;1;)))
      (`Securities
       .((`m
          `all
          .((`C;`model;)
            (`j
             .((`l;`"Selection Criterion";)
               (`ol
                (`all `selected
                 `All `Selected)
                )
               (`fill;`h;)
               (`c;`combo;)
               (`o
                `all `selected
                )
               (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                ))
             )
            (`M;();)
            (`P;;)))
         (`all

          .((`j
             .((`c;`panel;)
               (`border;0;)
               (`l;`"All Securities Selected";))
             )
            (`M
             ,`all
             )))
         (`included
          ,`"*"
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Included Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             )
            (`V;{[p;x]:[~#x;,(0;"An empty list of Included Securities will be interpretted as including all securities.");_n]};)))
         (`excluded
          0#`
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Excluded Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"X*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             ))))
       .((`j
          .((`l;`"Security IDs";)
            (`c;`panel;)
            (`aa
             (`m
              `all `included `excluded)
             )
            (`border;1;)
            (`a
             `m `all
             ))
          )
         (`P;1;))))
    .((`j
       .((`l;`"Market Indices Investment Class";)
         (`c;`panel;)
         (`a
          (`Categorical
           `Continuous `Securities)
          ))
       )
      (`P;1;)
      (`L;0;)
      (`M
       ,`Market_Indices
       )))
   (`Property
    .((`Categorical
       .((`Use
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Office
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Office;)
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
                      ))
                   ))
               (`Retail
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Retail;)
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
                      ))
                   ))
               (`Residential
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Residential;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Property Use";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Lease_Type
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Regulated
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Regulated;)
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
                      ))
                   ))
               (`CPI
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CPI;)
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
                      ))
                   ))
               (`Stepped
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Stepped;)
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
                      ))
                   ))
               (`Fixed
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Fixed;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Lease Type";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Economy
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`US
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`US;)
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
                      ))
                   ))
               (`DE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DE;)
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
                      ))
                   ))
               (`GB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GB;)
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
                      ))
                   ))
               (`CH
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CH;)
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
                      ))
                   ))
               (`AU
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AU;)
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
                      ))
                   ))
               (`CA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CA;)
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
                      ))
                   ))
               (`JP
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`JP;)
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
                      ))
                   ))
               (`DK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DK;)
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
                      ))
                   ))
               (`NO
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NO;)
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
                      ))
                   ))
               (`SE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SE;)
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
                      ))
                   ))
               (`BR
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`BR;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`Economy;)
               (`a
                `m `all
                ))
             )
            (`P;1;))))
       .((`j
          .((`l;`"Categorical Selections";)
            (`c;`panel;)
            (`border;1;)
            (`a
             ,`Use `Lease_Type `Economy
             ))
          )
         (`P;1;)))
      (`Continuous
       .((`item;();.())
         (`relation;();.())
         (`add;0#0.0;.())
         (`mult;0#0.0;.())
         (`user
          ()
          .,(`V;{[axis;extras;p;x]
  :[(axis~`Inner_Loop)&(~`Inner_Loop_Projections _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the Inner Loop Projections module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    (axis~`User_Value)&(~`User_Values _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the User Values module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    #a:&~((),x) _lin extras,.L.U.active_axis@axis
      ,(1;"A chosen input is deselected or Unspecified"),:[@x;();,,a]
    (axis~`User_Value)&#a:&#:'get_spanned_axes'(),x / this belongs in a generic insertion point validation
        ,(1;"Spanned user value not allowed here"),:[@x;();,,a]]}[`User_Value;`Zero `One `Period];)))
       .((`j
          .((`c;`Table;)
            (`l;`"Continuous Selections";)
            (`cell
             .((`user
                .((`c;`combo;)
                  (`o
                   `Unspecified_ `New_User_Value_ `Zero `One `Period `UST `USTP `Normal `Uniform `Previous `PC_Insurance_0 `Financing_0 `Investments_0 `Accounting_0 `Combined_0 `Yields `Returns `FX `Combined_1 `PC_Insurance_2 `Financing_2 `Investments_2 `Accounting_2 `Combined_2 `Financing_4 `Investments_4 `Accounting_4 `Combined_4 `Counterparty_2_collectibility `Counterparty_3_collectibility `Reinsurance_Entity_collectibility `fixed_1 `fixed_2 `fixed_3 `fixed_4 `fixed_5 `function `transform `stransform `inline `ispline `multifiltered `reference_vectors `prior_arguments `combination `byProduct `byTreaty `sum_random `Portfolio_Return `Path_Number
                   ))
                )
               (`relation
                .((`c;`combo;)
                  (`o
                   `GT `GE `EQ `LE `LT `NE
                   )
                  (`ol
                   (`GT `GE `EQ `LE `LT `NE
                    `">" `">=" `"=" `"<=" `"<" `"<>")
                   ))
                )
               (`item
                .((`c;`combo;)
                  (`o
                   `Price_Index `Rent_Index `Yield `Price `Lease_Age `Lease_Length `ID
                   ))
                ))
             )
            (`editor
             .((`user;1;)
               (`relation;1;)
               (`item;1;))
             )
            (`p
             .((`user;`Zero;)
               (`relation;`GT;)
               (`item;`Price_Index;)
               (`add;0.0;)
               (`mult;1.0;))
             )
            (`cl
             .((`item;`Item;)
               (`relation;`Relation;)
               (`add;`"Fixed Value";)
               (`mult;`"Multiple of\nUser Value";)
               (`user;`"User Value";))
             )
            (`f
             .((`add;9.6;)
               (`mult;9.6;))
             )
            (`g
             .((`add;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`mult;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
             )
            (`u
             .((`add;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`mult;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`user;{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};))
             )
            (`reorder;0;)
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
             ))
          )
         (`U;`User_Value;)
         (`J
          .((`C;{[c;x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(`Unspecified_,(`$("New_"),($a),"_")),(z#y),x}[u];+2#,#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
 			e:.[e;(`j;`u;x);:[;c]]
			(d;e)}[{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};,`user;,`Zero `One `Period];)
            (`D;{  [x;d;e;a;u]	x:x@&x _lin !d; d:.[d;(x;);{:[y _in x;`Unspecified_;y]}[u]];(d;e)}[,`user];)
            (`R;{  [x;d;e;a;u]	d:.[d;(x;);{:[y _in !x;x@y;y]}[u]];(d;e)}[,`user];)
            (`A;{    [d;e;a;u]	(d;e)};)
            (`L;{[x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(z#y),x}[u];+2#,2+#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
			(d;e)}[,`user;,`Zero `One `Period];)
            (`F
             ,`user
             ))
          )
         (`P;1;)))
      (`Securities
       .((`m
          `all
          .((`C;`model;)
            (`j
             .((`l;`"Selection Criterion";)
               (`ol
                (`all `selected
                 `All `Selected)
                )
               (`fill;`h;)
               (`c;`combo;)
               (`o
                `all `selected
                )
               (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                ))
             )
            (`M;();)
            (`P;;)))
         (`all

          .((`j
             .((`c;`panel;)
               (`border;0;)
               (`l;`"All Securities Selected";))
             )
            (`M
             ,`all
             )))
         (`included
          ,`"*"
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Included Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             )
            (`V;{[p;x]:[~#x;,(0;"An empty list of Included Securities will be interpretted as including all securities.");_n]};)))
         (`excluded
          0#`
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Excluded Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"X*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             ))))
       .((`j
          .((`l;`"Security IDs";)
            (`c;`panel;)
            (`aa
             (`m
              `all `included `excluded)
             )
            (`border;1;)
            (`a
             `m `all
             ))
          )
         (`P;1;))))
    .((`j
       .((`l;`"Property Investment Class";)
         (`c;`panel;)
         (`a
          (`Categorical
           `Continuous `Securities)
          ))
       )
      (`P;1;)
      (`L;0;)
      (`M
       ,`Property
       )))
   (`Interest_Rate_Derivatives
    .((`Categorical
       .((`Option_Type
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`None
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`None;)
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
                      ))
                   ))
               (`Put
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Put;)
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
                      ))
                   ))
               (`Call
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Call;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Option Type";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Forward_Object
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`FRN
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`FRN;)
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
                      ))
                   ))
               (`RFRN
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`RFRN;)
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
                      ))
                   ))
               (`cRFRN
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`cRFRN;)
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
                      ))
                   ))
               (`FRNnC
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`FRNnC;)
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
                      ))
                   ))
               (`Swap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Swap;)
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
                      ))
                   ))
               (`Cap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Cap;)
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
                      ))
                   ))
               (`Floor
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Floor;)
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
                      ))
                   ))
               (`Bond
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Bond;)
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
                      ))
                   ))
               (`Annuity
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Annuity;)
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
                      ))
                   ))
               (`ZCIISwap
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`ZCIISwap;)
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
                      ))
                   ))
               (`YYIISwap
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`YYIISwap;)
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
                      ))
                   ))
               (`LPISwap
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`LPISwap;)
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
                      ))
                   ))
               (`IICap
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`IICap;)
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
                      ))
                   ))
               (`IIFloor
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`IIFloor;)
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
                      ))
                   ))
               (`ZCIIBond
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`ZCIIBond;)
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
                      ))
                   ))
               (`IIBond
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`IIBond;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Forward Object";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Special_Category
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`None
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`None;)
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
                      ))
                   ))
               (`G_Strategy
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`G_Strategy;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Special Category";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Economy
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`US
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`US;)
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
                      ))
                   ))
               (`DE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DE;)
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
                      ))
                   ))
               (`GB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GB;)
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
                      ))
                   ))
               (`CH
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CH;)
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
                      ))
                   ))
               (`AU
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AU;)
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
                      ))
                   ))
               (`CA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CA;)
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
                      ))
                   ))
               (`JP
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`JP;)
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
                      ))
                   ))
               (`DK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DK;)
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
                      ))
                   ))
               (`NO
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NO;)
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
                      ))
                   ))
               (`SE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SE;)
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
                      ))
                   ))
               (`BR
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`BR;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`Economy;)
               (`a
                `m `all
                ))
             )
            (`P;1;))))
       .((`j
          .((`l;`"Categorical Selections";)
            (`c;`panel;)
            (`border;1;)
            (`a
             ,`Option_Type `Forward_Object `Special_Category `Economy
             ))
          )
         (`P;1;)))
      (`Continuous
       .((`item;();.())
         (`relation;();.())
         (`add;0#0.0;.())
         (`mult;0#0.0;.())
         (`user
          ()
          .,(`V;{[axis;extras;p;x]
  :[(axis~`Inner_Loop)&(~`Inner_Loop_Projections _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the Inner Loop Projections module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    (axis~`User_Value)&(~`User_Values _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the User Values module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    #a:&~((),x) _lin extras,.L.U.active_axis@axis
      ,(1;"A chosen input is deselected or Unspecified"),:[@x;();,,a]
    (axis~`User_Value)&#a:&#:'get_spanned_axes'(),x / this belongs in a generic insertion point validation
        ,(1;"Spanned user value not allowed here"),:[@x;();,,a]]}[`User_Value;`Zero `One `Period];)))
       .((`j
          .((`c;`Table;)
            (`l;`"Continuous Selections";)
            (`cell
             .((`user
                .((`c;`combo;)
                  (`o
                   `Unspecified_ `New_User_Value_ `Zero `One `Period `UST `USTP `Normal `Uniform `Previous `PC_Insurance_0 `Financing_0 `Investments_0 `Accounting_0 `Combined_0 `Yields `Returns `FX `Combined_1 `PC_Insurance_2 `Financing_2 `Investments_2 `Accounting_2 `Combined_2 `Financing_4 `Investments_4 `Accounting_4 `Combined_4 `Counterparty_2_collectibility `Counterparty_3_collectibility `Reinsurance_Entity_collectibility `fixed_1 `fixed_2 `fixed_3 `fixed_4 `fixed_5 `function `transform `stransform `inline `ispline `multifiltered `reference_vectors `prior_arguments `combination `byProduct `byTreaty `sum_random `Portfolio_Return `Path_Number
                   ))
                )
               (`relation
                .((`c;`combo;)
                  (`o
                   `GT `GE `EQ `LE `LT `NE
                   )
                  (`ol
                   (`GT `GE `EQ `LE `LT `NE
                    `">" `">=" `"=" `"<=" `"<" `"<>")
                   ))
                )
               (`item
                .((`c;`combo;)
                  (`o
                   `Maturity `Price `Option_Expiry `Option_Strike `Notional_Value `Forward_Expiry `Trade_Cost `Stochastic_Duration `Coupon_Spread `Tau `Delta `Theta_f `Theta_v `Gamma `Intensity `Redemption `Cash_Flow `ID
                   ))
                ))
             )
            (`editor
             .((`user;1;)
               (`relation;1;)
               (`item;1;))
             )
            (`p
             .((`user;`Zero;)
               (`relation;`GT;)
               (`item;`Maturity;)
               (`add;0.0;)
               (`mult;1.0;))
             )
            (`cl
             .((`item;`Item;)
               (`relation;`Relation;)
               (`add;`"Fixed Value";)
               (`mult;`"Multiple of\nUser Value";)
               (`user;`"User Value";))
             )
            (`f
             .((`add;9.6;)
               (`mult;9.6;))
             )
            (`g
             .((`add;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`mult;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
             )
            (`u
             .((`add;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`mult;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`user;{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};))
             )
            (`reorder;0;)
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
             ))
          )
         (`U;`User_Value;)
         (`J
          .((`C;{[c;x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(`Unspecified_,(`$("New_"),($a),"_")),(z#y),x}[u];+2#,#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
 			e:.[e;(`j;`u;x);:[;c]]
			(d;e)}[{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};,`user;,`Zero `One `Period];)
            (`D;{  [x;d;e;a;u]	x:x@&x _lin !d; d:.[d;(x;);{:[y _in x;`Unspecified_;y]}[u]];(d;e)}[,`user];)
            (`R;{  [x;d;e;a;u]	d:.[d;(x;);{:[y _in !x;x@y;y]}[u]];(d;e)}[,`user];)
            (`A;{    [d;e;a;u]	(d;e)};)
            (`L;{[x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(z#y),x}[u];+2#,2+#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
			(d;e)}[,`user;,`Zero `One `Period];)
            (`F
             ,`user
             ))
          )
         (`P;1;)))
      (`Securities
       .((`m
          `all
          .((`C;`model;)
            (`j
             .((`l;`"Selection Criterion";)
               (`ol
                (`all `selected
                 `All `Selected)
                )
               (`fill;`h;)
               (`c;`combo;)
               (`o
                `all `selected
                )
               (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                ))
             )
            (`M;();)
            (`P;;)))
         (`all

          .((`j
             .((`c;`panel;)
               (`border;0;)
               (`l;`"All Securities Selected";))
             )
            (`M
             ,`all
             )))
         (`included
          ,`"*"
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Included Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             )
            (`V;{[p;x]:[~#x;,(0;"An empty list of Included Securities will be interpretted as including all securities.");_n]};)))
         (`excluded
          0#`
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Excluded Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"X*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             ))))
       .((`j
          .((`l;`"Security IDs";)
            (`c;`panel;)
            (`aa
             (`m
              `all `included `excluded)
             )
            (`border;1;)
            (`a
             `m `all
             ))
          )
         (`P;1;))))
    .((`j
       .((`l;`"Interest Rate Derivative Investment Class";)
         (`c;`panel;)
         (`a
          (`Categorical
           `Continuous `Securities)
          ))
       )
      (`P;1;)
      (`L;0;)
      (`M
       ,`Interest_Rate_Derivatives
       )))
   (`Index_Derivatives
    .((`Categorical
       .((`Derivative_Type
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Equity
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Equity;)
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
                      ))
                   ))
               (`Foreign_Exchange
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Foreign_Exchange;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Derivative Type";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Option_Type
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`None
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`None;)
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
                      ))
                   ))
               (`Put
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Put;)
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
                      ))
                   ))
               (`Call
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Call;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Option Type";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Forward_Object
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`NA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NA;)
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
                      ))
                   ))
               (`Large_Cap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Large_Cap;)
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
                      ))
                   ))
               (`Mid_Cap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Mid_Cap;)
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
                      ))
                   ))
               (`Broad_Cap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Broad_Cap;)
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
                      ))
                   ))
               (`Small_Cap
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Small_Cap;)
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
                      ))
                   ))
               (`Other_Sector
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Other_Sector;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Forward Object";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Economy
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`US
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`US;)
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
                      ))
                   ))
               (`DE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DE;)
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
                      ))
                   ))
               (`GB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GB;)
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
                      ))
                   ))
               (`CH
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CH;)
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
                      ))
                   ))
               (`AU
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AU;)
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
                      ))
                   ))
               (`CA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CA;)
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
                      ))
                   ))
               (`JP
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`JP;)
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
                      ))
                   ))
               (`DK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DK;)
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
                      ))
                   ))
               (`NO
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NO;)
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
                      ))
                   ))
               (`SE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SE;)
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
                      ))
                   ))
               (`BR
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`BR;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`Economy;)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Numerator_Currency
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`NA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NA;)
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
                      ))
                   ))
               (`USD
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`USD;)
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
                      ))
                   ))
               (`EUR
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`EUR;)
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
                      ))
                   ))
               (`GBP
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GBP;)
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
                      ))
                   ))
               (`CHF
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CHF;)
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
                      ))
                   ))
               (`AUD
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AUD;)
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
                      ))
                   ))
               (`CAD
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CAD;)
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
                      ))
                   ))
               (`JPY
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`JPY;)
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
                      ))
                   ))
               (`DKK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DKK;)
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
                      ))
                   ))
               (`NOK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NOK;)
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
                      ))
                   ))
               (`SEK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SEK;)
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
                      ))
                   ))
               (`BRL
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`BRL;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Numerator Currency";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Denominator_Currency
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`NA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NA;)
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
                      ))
                   ))
               (`USD
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`USD;)
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
                      ))
                   ))
               (`EUR
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`EUR;)
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
                      ))
                   ))
               (`GBP
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GBP;)
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
                      ))
                   ))
               (`CHF
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CHF;)
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
                      ))
                   ))
               (`AUD
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AUD;)
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
                      ))
                   ))
               (`CAD
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CAD;)
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
                      ))
                   ))
               (`JPY
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`JPY;)
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
                      ))
                   ))
               (`DKK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DKK;)
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
                      ))
                   ))
               (`NOK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NOK;)
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
                      ))
                   ))
               (`SEK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SEK;)
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
                      ))
                   ))
               (`BRL
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`BRL;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Denominator Currency";)
               (`a
                `m `all
                ))
             )
            (`P;1;))))
       .((`j
          .((`l;`"Categorical Selections";)
            (`c;`panel;)
            (`border;1;)
            (`a
             ,`Derivative_Type `Option_Type `Forward_Object `Economy `Numerator_Currency `Denominator_Currency
             ))
          )
         (`P;1;)))
      (`Continuous
       .((`item;();.())
         (`relation;();.())
         (`add;0#0.0;.())
         (`mult;0#0.0;.())
         (`user
          ()
          .,(`V;{[axis;extras;p;x]
  :[(axis~`Inner_Loop)&(~`Inner_Loop_Projections _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the Inner Loop Projections module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    (axis~`User_Value)&(~`User_Values _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the User Values module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    #a:&~((),x) _lin extras,.L.U.active_axis@axis
      ,(1;"A chosen input is deselected or Unspecified"),:[@x;();,,a]
    (axis~`User_Value)&#a:&#:'get_spanned_axes'(),x / this belongs in a generic insertion point validation
        ,(1;"Spanned user value not allowed here"),:[@x;();,,a]]}[`User_Value;`Zero `One `Period];)))
       .((`j
          .((`c;`Table;)
            (`l;`"Continuous Selections";)
            (`cell
             .((`user
                .((`c;`combo;)
                  (`o
                   `Unspecified_ `New_User_Value_ `Zero `One `Period `UST `USTP `Normal `Uniform `Previous `PC_Insurance_0 `Financing_0 `Investments_0 `Accounting_0 `Combined_0 `Yields `Returns `FX `Combined_1 `PC_Insurance_2 `Financing_2 `Investments_2 `Accounting_2 `Combined_2 `Financing_4 `Investments_4 `Accounting_4 `Combined_4 `Counterparty_2_collectibility `Counterparty_3_collectibility `Reinsurance_Entity_collectibility `fixed_1 `fixed_2 `fixed_3 `fixed_4 `fixed_5 `function `transform `stransform `inline `ispline `multifiltered `reference_vectors `prior_arguments `combination `byProduct `byTreaty `sum_random `Portfolio_Return `Path_Number
                   ))
                )
               (`relation
                .((`c;`combo;)
                  (`o
                   `GT `GE `EQ `LE `LT `NE
                   )
                  (`ol
                   (`GT `GE `EQ `LE `LT `NE
                    `">" `">=" `"=" `"<=" `"<" `"<>")
                   ))
                )
               (`item
                .((`c;`combo;)
                  (`o
                   `Maturity `Option_Expiry `Option_Strike `Forward_Expiry `Trade_Cost `Cash_Flow `Price `Notional_Value `ID
                   ))
                ))
             )
            (`editor
             .((`user;1;)
               (`relation;1;)
               (`item;1;))
             )
            (`p
             .((`user;`Zero;)
               (`relation;`GT;)
               (`item;`Maturity;)
               (`add;0.0;)
               (`mult;1.0;))
             )
            (`cl
             .((`item;`Item;)
               (`relation;`Relation;)
               (`add;`"Fixed Value";)
               (`mult;`"Multiple of\nUser Value";)
               (`user;`"User Value";))
             )
            (`f
             .((`add;9.6;)
               (`mult;9.6;))
             )
            (`g
             .((`add;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`mult;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
             )
            (`u
             .((`add;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`mult;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`user;{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};))
             )
            (`reorder;0;)
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
             ))
          )
         (`U;`User_Value;)
         (`J
          .((`C;{[c;x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(`Unspecified_,(`$("New_"),($a),"_")),(z#y),x}[u];+2#,#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
 			e:.[e;(`j;`u;x);:[;c]]
			(d;e)}[{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};,`user;,`Zero `One `Period];)
            (`D;{  [x;d;e;a;u]	x:x@&x _lin !d; d:.[d;(x;);{:[y _in x;`Unspecified_;y]}[u]];(d;e)}[,`user];)
            (`R;{  [x;d;e;a;u]	d:.[d;(x;);{:[y _in !x;x@y;y]}[u]];(d;e)}[,`user];)
            (`A;{    [d;e;a;u]	(d;e)};)
            (`L;{[x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(z#y),x}[u];+2#,2+#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
			(d;e)}[,`user;,`Zero `One `Period];)
            (`F
             ,`user
             ))
          )
         (`P;1;)))
      (`Securities
       .((`m
          `all
          .((`C;`model;)
            (`j
             .((`l;`"Selection Criterion";)
               (`ol
                (`all `selected
                 `All `Selected)
                )
               (`fill;`h;)
               (`c;`combo;)
               (`o
                `all `selected
                )
               (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                ))
             )
            (`M;();)
            (`P;;)))
         (`all

          .((`j
             .((`c;`panel;)
               (`border;0;)
               (`l;`"All Securities Selected";))
             )
            (`M
             ,`all
             )))
         (`included
          ,`"*"
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Included Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             )
            (`V;{[p;x]:[~#x;,(0;"An empty list of Included Securities will be interpretted as including all securities.");_n]};)))
         (`excluded
          0#`
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Excluded Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"X*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             ))))
       .((`j
          .((`l;`"Security IDs";)
            (`c;`panel;)
            (`aa
             (`m
              `all `included `excluded)
             )
            (`border;1;)
            (`a
             `m `all
             ))
          )
         (`P;1;))))
    .((`j
       .((`l;`"Index Derivative Investment Class";)
         (`c;`panel;)
         (`a
          (`Categorical
           `Continuous `Securities)
          ))
       )
      (`P;1;)
      (`L;0;)
      (`M
       ,`Index_Derivatives
       )))
   (`Investments_in_Affiliates
    .((`Categorical
       .((`Rating
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Treasury
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Treasury;)
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
                      ))
                   ))
               (`AAA
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AAA;)
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
                      ))
                   ))
               (`AA
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AA;)
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
                      ))
                   ))
               (`A
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`A;)
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
                      ))
                   ))
               (`BBB
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`BBB;)
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
                      ))
                   ))
               (`High_Yield
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`High_Yield;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Affiliate Rating";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Class
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Common_Stock
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Common_Stock;)
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
                      ))
                   ))
               (`Preferred_Stock
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`Preferred_Stock;)
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
                      ))
                   ))
               (`Debt
                1
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`Debt;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`"Investment Type";)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Entity
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Primary_Entity
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
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
                      ))
                   ))
               (`Reinsurance_Entity
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`J
                .((`C;{[d;e;a;u]d:.+(u;*d[];*d[~!d]);entity_radiobuttons_attr[d;e]};)
                  (`D;{[d;e;a;u]entity_radiobuttons_attr[d _di u@&u _lin!d;e]};)
                  (`R;{[d;e;a;u]entity_radiobuttons_attr[.+(u[];d[!u];d[~!u]);e]};)
                  (`A;{[d;e;a;u]d[u]:1;d[~u]:d[~*!d];entity_radiobuttons_attr[d;e]};)
                  (`L;{[d;e;a;u]entity_radiobuttons_attr[.+(u;d[u];d[~u]);e]};))
                )
               (`H;{[d;e]
 d[.;`j]:.(`c`check;`anchor`nw;(`wy;.j.NoExtraSpace))
 if[#!d; d[~*|!d;`j;`wy]:1.]
 (d;e)};)
               (`H_;{[d;v;g;c](d;v;())};)
               (`U;`Entity;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`Entities;)
               (`a
                `m `all
                ))
             )
            (`P;1;)))
         (`Financing_Instrument
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`Common_Stock
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
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
                      ))
                   ))
               (`Common_Stock_re
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`J
                .((`C;{[d;e;a;u]d:.+(u;*d[];*d[~!d]);entity_radiobuttons_attr[d;e]};)
                  (`D;{[d;e;a;u]entity_radiobuttons_attr[d _di u@&u _lin!d;e]};)
                  (`R;{[d;e;a;u]entity_radiobuttons_attr[.+(u[];d[!u];d[~!u]);e]};)
                  (`A;{[d;e;a;u]d[u]:1;d[~u]:d[~*!d];entity_radiobuttons_attr[d;e]};)
                  (`L;{[d;e;a;u]entity_radiobuttons_attr[.+(u;d[u];d[~u]);e]};))
                )
               (`H;{[d;e]
 d[.;`j]:.(`c`check;`anchor`nw;(`wy;.j.NoExtraSpace))
 if[#!d; d[~*|!d;`j;`wy]:1.]
 (d;e)};)
               (`U;`Financing_Instrument;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`Instruments;)
               (`a
                `m `all
                ))
             )
            (`P;1;)
            (`H_;{[d;v;g;c](d;v;())};)))
         (`Economy
          .((`m
             `all
             .((`C;`model;)
               (`j
                .((`l;`"Selection Criterion";)
                  (`ol
                   (`all `selected
                    `All `Selected)
                   )
                  (`fill;`h;)
                  (`c;`combo;)
                  (`o
                   `all `selected
                   )
                  (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                   ))
                )
               (`M;();)
               (`P;;)))
            (`all

             .((`j
                .((`c;`panel;)
                  (`border;0;)
                  (`l;`"All Items Selected";))
                )
               (`M
                ,`all
                )))
            (`selected
             .((`US
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`US;)
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
                      ))
                   ))
               (`DE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DE;)
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
                      ))
                   ))
               (`GB
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`GB;)
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
                      ))
                   ))
               (`CH
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CH;)
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
                      ))
                   ))
               (`AU
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`AU;)
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
                      ))
                   ))
               (`CA
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`CA;)
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
                      ))
                   ))
               (`JP
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`JP;)
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
                      ))
                   ))
               (`DK
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`DK;)
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
                      ))
                   ))
               (`NO
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`NO;)
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
                      ))
                   ))
               (`SE
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1e-010;)
                     (`l;`SE;)
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
                      ))
                   ))
               (`BR
                0
                .,(`j
                   .((`c;`check;)
                     (`anchor;`nw;)
                     (`wy;1.0;)
                     (`l;`BR;)
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
                      ))
                   )))
             .((`j
                .((`c;`window;)
                  (`l;`"Checked Items Selected";))
                )
               (`V;{[x;p;y]:[~|/y[];(0;x," class will be empty because no categories are selected.")]}["Asset"];)
               (`Y;`checkpanel;)
               (`P;;)
               (`M
                ,`selected
                ))))
          .((`j
             .((`c;`panel;)
               (`l;`Economy;)
               (`a
                `m `all
                ))
             )
            (`P;1;))))
       .((`j
          .((`l;`"Categorical Selections";)
            (`c;`panel;)
            (`border;1;)
            (`a
             ,`Rating `Class `Entity `Financing_Instrument `Economy
             ))
          )
         (`P;1;)))
      (`Continuous
       .((`item;();.())
         (`relation;();.())
         (`add;0#0.0;.())
         (`mult;0#0.0;.())
         (`user
          ()
          .,(`V;{[axis;extras;p;x]
  :[(axis~`Inner_Loop)&(~`Inner_Loop_Projections _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the Inner Loop Projections module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    (axis~`User_Value)&(~`User_Values _in .G`submodules)&#a:&~((),x) _lin extras
      ,(1;("Without the User Values module selected, the only valid values are &0";2_,/", ",/:$:'extras)),:[@x;();,,a]
    #a:&~((),x) _lin extras,.L.U.active_axis@axis
      ,(1;"A chosen input is deselected or Unspecified"),:[@x;();,,a]
    (axis~`User_Value)&#a:&#:'get_spanned_axes'(),x / this belongs in a generic insertion point validation
        ,(1;"Spanned user value not allowed here"),:[@x;();,,a]]}[`User_Value;`Zero `One `Period];)))
       .((`j
          .((`c;`Table;)
            (`l;`"Continuous Selections";)
            (`cell
             .((`user
                .((`c;`combo;)
                  (`o
                   `Unspecified_ `New_User_Value_ `Zero `One `Period `UST `USTP `Normal `Uniform `Previous `PC_Insurance_0 `Financing_0 `Investments_0 `Accounting_0 `Combined_0 `Yields `Returns `FX `Combined_1 `PC_Insurance_2 `Financing_2 `Investments_2 `Accounting_2 `Combined_2 `Financing_4 `Investments_4 `Accounting_4 `Combined_4 `Counterparty_2_collectibility `Counterparty_3_collectibility `Reinsurance_Entity_collectibility `fixed_1 `fixed_2 `fixed_3 `fixed_4 `fixed_5 `function `transform `stransform `inline `ispline `multifiltered `reference_vectors `prior_arguments `combination `byProduct `byTreaty `sum_random `Portfolio_Return `Path_Number
                   ))
                )
               (`relation
                .((`c;`combo;)
                  (`o
                   `GT `GE `EQ `LE `LT `NE
                   )
                  (`ol
                   (`GT `GE `EQ `LE `LT `NE
                    `">" `">=" `"=" `"<=" `"<" `"<>")
                   ))
                )
               (`item
                .((`c;`combo;)
                  (`o
                   `Maturity `Age `Dividend `Interest `YTM `Price `Notional_Amount `Duration_Fisher_Weil `Duration_Modified `Convexity_Fisher_Weil `Convexity_Modified `ID
                   ))
                ))
             )
            (`editor
             .((`user;1;)
               (`relation;1;)
               (`item;1;))
             )
            (`p
             .((`user;`Zero;)
               (`relation;`GT;)
               (`item;`Maturity;)
               (`add;0.0;)
               (`mult;1.0;))
             )
            (`cl
             .((`item;`Item;)
               (`relation;`Relation;)
               (`add;`"Fixed Value";)
               (`mult;`"Multiple of\nUser Value";)
               (`user;`"User Value";))
             )
            (`f
             .((`add;9.6;)
               (`mult;9.6;))
             )
            (`g
             .((`add;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
               (`mult;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};))
             )
            (`u
             .((`add;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`mult;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
               (`user;{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};))
             )
            (`reorder;0;)
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
             ))
          )
         (`U;`User_Value;)
         (`J
          .((`C;{[c;x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(`Unspecified_,(`$("New_"),($a),"_")),(z#y),x}[u];+2#,#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
 			e:.[e;(`j;`u;x);:[;c]]
			(d;e)}[{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};,`user;,`Zero `One `Period];)
            (`D;{  [x;d;e;a;u]	x:x@&x _lin !d; d:.[d;(x;);{:[y _in x;`Unspecified_;y]}[u]];(d;e)}[,`user];)
            (`R;{  [x;d;e;a;u]	d:.[d;(x;);{:[y _in !x;x@y;y]}[u]];(d;e)}[,`user];)
            (`A;{    [d;e;a;u]	(d;e)};)
            (`L;{[x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(z#y),x}[u];+2#,2+#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
			(d;e)}[,`user;,`Zero `One `Period];)
            (`F
             ,`user
             ))
          )
         (`P;1;)))
      (`Securities
       .((`m
          `all
          .((`C;`model;)
            (`j
             .((`l;`"Selection Criterion";)
               (`ol
                (`all `selected
                 `All `Selected)
                )
               (`fill;`h;)
               (`c;`combo;)
               (`o
                `all `selected
                )
               (`t;{ /Model change control trigger function.  Only called when the user changes a model choice in the model change control (usually a combo)
  result: j:*|i:get_II[];set_m_[p:i,:[j _in v;1+v?j;4]_ v;-1_ v:.j.v] /process model change in model drop down menu
  /Process expert items in the new model that was just chosen. processE must be called here as function activate is not called on a model choice change
  DO_E:: 1 /after java completes processing, process the active panel for expert items that may have changed with the change of model
  result};)
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
                ))
             )
            (`M;();)
            (`P;;)))
         (`all

          .((`j
             .((`c;`panel;)
               (`border;0;)
               (`l;`"All Securities Selected";))
             )
            (`M
             ,`all
             )))
         (`included
          ,`"*"
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Included Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             )
            (`V;{[p;x]:[~#x;,(0;"An empty list of Included Securities will be interpretted as including all securities.");_n]};)))
         (`excluded
          0#`
          .((`j
             .((`c;`Vector;)
               (`l;`"List of Excluded Securities";)
               (`popup
                .((`Append;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti::[rows; 1|#i; 1]
 .j.app.row[`$,/".",'$v;rti]
 .[`;v;:;label,get_unique_labels[rti;label;0#`;`$($l),"_"]]
}[`Security]];)
                  (`Insert;{[f;junk] / change3[]
 nul:{(x~_n)|~#x}                               / null or empty?
 dot:`${($x),".",$y}/`,                         / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                    / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]      / default to first selectable if null
 r:f[w:`. d,v;b:`. d,a;d,v;i]                   / run
 if[2=#r                                        / if there is a result
  if[r~(w;b)    ;:_n]                           / if it is identical, no op
  c:r[1;`j;`c]                                  / save class
  r[1;`j;`c]:`null                              / set class to null
  .[`;d,a,`j`c;:;`null]                         / set screen object class to null
  .[`;d,,v,a;:;r]                               / reset object
  .[`;d,a,`j`c;:;c]]                            / reset screen object class to c
}[{[l;d;e;v;i]
 rows:#d; label:. `$,/".",'$v
 rti:#ixs::[rows; i; ,0]
 .j.ins.row[`$,/".",'$v;&/ixs;rti]
 .[`;v,,ixs;:;new:get_unique_labels[rti;label;0#`;`$($l),"_"]]
 d:{(i#y),((#x)#z),(i:&/x)_ y}[ixs;d;e.j.p]
 d:@[d;ixs;:;new]
 (d;e)}[`Security]];)
                  (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
                )
               (`p;`"X*";)
               (`u;{:[4=4:y;		("";y);	("Cannot put non-symbols into symbol-valued field";x)]};)
               (`f;{:[-4=4:x; {_ssr[$x;"_";" "]}'x; _ssr[$x;"_";" "]]};)
               (`g;{`$_ssr[x;" ";"_"]};))
             )
            (`M
             ,`selected
             ))))
       .((`j
          .((`l;`"Security IDs";)
            (`c;`panel;)
            (`aa
             (`m
              `all `included `excluded)
             )
            (`border;1;)
            (`a
             `m `all
             ))
          )
         (`P;1;))))
    .((`j
       .((`l;`"Affiliates Investment Class";)
         (`c;`panel;)
         (`a
          (`Categorical
           `Continuous `Securities)
          ))
       )
      (`P;1;)
      (`L;0;)
      (`M
       ,`Investments_in_Affiliates
       )))
   (`Aggregate
    .((`Class
       ()
       .,(`V;{[p;x]r::[6=4:r:.L.V.flexible_axis_item_selected[`Asset_Class;0#`;p;x];();r]
                    bad_curr:(.C`Currencies) _dvl .C[`Economy_Currency;{(!x)@&x[]}@.k.get_s (0;`A;`User;`GEMS_User_Inputs;`Economies_to_Run)]
                    if[#i:bad_curr@&bad_curr _lin x
                      r,:,(1;{:[1=#x;("Currency &0 is not active";$*x);("Currencies &0 are not active";2_,/", ",/:$x)]}[i])]
                    :[#r;r;_n]};))
      (`Weight
       0#0.0
       .,(`V;{[p;x]:[0=+/x;(1;"Inputs cannot sum to zero")]};)))
    .((`j
       .((`l;`"Aggregate Investment Class";)
         (`c;`Table;)
         (`cell
          .,(`Class
             .((`c;`combo;)
               (`o
                `Unspecified_ `New_Asset_Class_ `AAA_Corporate_Bonds_Summary `AA_Corporate_Bonds_Summary `A_Corporate_Bonds_Summary `A_plus_Corporate_Bonds_Summary `BBB_Corporate_Bonds_Summary `High_Yield_Corporate_Bonds_Summary `Default_Corporate_Bonds_Summary `Class_1_Preferred_Stock_Summary `BBB_Preferred_Stock_Summary `High_Yield_Preferred_Stock_Summary `Default_Preferred_Stock_Summary `Treasury_Bonds_Summary `State_GO_Bonds_Summary `Pfandbriefe_Summary `Schuldschein_Pools_Summary `Alternative_Assets_Bond_Model_Class_Summary `Unquoted_Summary `Mortgage_Securities_Summary `German_Style_Mortgage_Summary `Common_Stock_Market_Indices_Summary `Property_Market_Indices_Summary `Fixed_Income_Market_Indices_Summary `Alternative_Asset_Market_Indices_Summary `Preferred_Stock_Market_Indices_Summary `Property_Model_Summary `FRN_Instruments_Summary `Interest_Rate_Derivatives_Summary `Equity_Derivatives_Summary `Common_Stock_Affiliates_Summary `Preferred_Stock_Affiliates_Summary `Debt_Affiliates_Summary `Class_0_Bonds_Summary `Class_1_Bonds_Summary `Corporate_Bonds_Summary `Preferred_Stock_Summary `Preferred_Stock_Model_Summary `Bonds_Model_Class_Summary `Mortgages_Summary `Common_Stock_Summary `Stock_Summary `HGB_Stock_Summary `Property_Summary `Taxable_Bonds_Summary `Tax_Exempt_Bonds_Summary `Bonds_Summary `HGB_Bonds_Summary `Fixed_Income_Summary `Derivatives_Summary `HGB_Other_Summary `Investments_in_Affiliates_Summary `Alternative_Assets_Summary `All_Investments_Summary `Common_Stock_except_Affiliates_Summary `Bonds_except_Affiliates_Summary `Taxable_Bonds_except_Affiliates_Summary `Preferred_Stock_except_Affiliates_Summary `Stock_except_Affiliates_Summary `Stock_in_Affiliates_Summary `Decision_Class_1_Decision `Bonds_Decision `Preferred_Stock_Decision `Alternative_Assets_Decision `Treasury_Bonds_Decision `Corporate_Bonds_Decision `Investment_Grade_Bonds_Decision `Investment_Grade_Corporate_Bonds_Decision `Taxable_Bonds_Decision `Tax_Exempt_Bonds_Decision `Risk_Free_Bonds_Decision `AAA_Rated_Bonds_Decision `AA_Rated_Bonds_Decision `A_Rated_Bonds_Decision `BBB_Rated_Bonds_Decision `High_Yield_Bonds_Decision `Bonds_Rated_AAA_or_Lower_Decision `Bonds_Rated_AA_or_Lower_Decision `Bonds_Rated_A_or_Lower_Decision `Bonds_Rated_BBB_or_Lower_Decision `Bonds_Rated_High_Yield_or_Lower_Decision `Bonds_Maturing_Within_1_Year_Decision `Bonds_Maturing_Within_2_Years_Decision `Bonds_Maturing_Within_3_Years_Decision `Bonds_Maturing_Within_5_Years_Decision `Bonds_Maturing_Within_7_Years_Decision `Bonds_Maturing_Within_10_Years_Decision `Bonds_Maturing_Within_15_Years_Decision `Pfandbriefe_Decision `Schuldschein_Pools_Decision `Mortgages_Decision `Mortgage_Backed_Securities_Decision `German_Style_Mortgages_Decision `CMOs_Decision `Sequential_CMO_Tranches_Decision `VADM_CMO_Tranches_Decision `PAC_CMO_Tranches_Decision `Scheduled_CMO_Tranches_Decision `Support_CMO_Tranches_Decision `SoftZ_CMO_Tranches_Decision `HardZ_CMO_Tranches_Decision `Common_Stock_Decision `Common_Stock_Large_Cap_Decision `Property_Decision `Residential_Property_Decision `Office_Property_Decision `Retail_Property_Decision `Interest_Rate_Derivatives_Decision `Caps_Decision `Floors_Decision `Swaps_Decision `FRNs_Decision `RFRNs_Decision `FRNnCs_Decision `cRFRNs_Decision `Floating_Coupon_Decision `Bond_Options_Decision `Receiver_Swaptions_Decision `Annuity_Settlement_Swaptions_Decision `RFRN_Options_Decision `Equity_Derivatives_Decision `Equity_Put_Options_Decision `Equity_Call_Options_Decision `Large_Cap_Options_Decision `Mid_Cap_Options_Decision `Small_Cap_Options_Decision `Broad_Cap_Options_Decision `Other_Sector_Options_Decision `Large_Cap_Puts_Decision `Large_Cap_Calls_Decision `Mid_Cap_Puts_Decision `Mid_Cap_Calls_Decision `Small_Cap_Puts_Decision `Small_Cap_Calls_Decision `Broad_Cap_Puts_Decision `Broad_Cap_Calls_Decision `Other_Sector_Puts_Decision `Other_Sector_Calls_Decision `Annuity_Settlements_Decision `Alternative_Asset_Market_Indices_Decision `Alternative_Assets_Bond_Model_Class_Decision `Preferred_Stock_Market_Indices_Decision `Preferred_Stock_Model_Decision `Property_Market_Indices_Decision `Property_Model_Decision `Fixed_Income_Market_Indices_Decision `Common_Stock_Broad_Cap_Decision `Common_Stock_Mid_Cap_Decision `Common_Stock_Small_Cap_Decision `Common_Stock_Other_Sector_Decision `A_plus_Corporate_Bonds_Summary_Maturity_from_0_to_1 `A_plus_Corporate_Bonds_Summary_Maturity_from_1_to_5 `A_plus_Corporate_Bonds_Summary_Maturity_from_5_to_10 `A_plus_Corporate_Bonds_Summary_Maturity_from_10_to_20 `A_plus_Corporate_Bonds_Summary_Maturity_from_20_up `BBB_Corporate_Bonds_Summary_Maturity_from_0_to_1 `BBB_Corporate_Bonds_Summary_Maturity_from_1_to_5 `BBB_Corporate_Bonds_Summary_Maturity_from_5_to_10 `BBB_Corporate_Bonds_Summary_Maturity_from_10_to_20 `BBB_Corporate_Bonds_Summary_Maturity_from_20_up `High_Yield_Corporate_Bonds_Summary_Maturity_from_0_to_1 `High_Yield_Corporate_Bonds_Summary_Maturity_from_1_to_5 `High_Yield_Corporate_Bonds_Summary_Maturity_from_5_to_10 `High_Yield_Corporate_Bonds_Summary_Maturity_from_10_to_20 `High_Yield_Corporate_Bonds_Summary_Maturity_from_20_up `AAA_Corporate_Bonds_Summary_Maturity_from_0_to_1 `AAA_Corporate_Bonds_Summary_Maturity_from_1_to_5 `AAA_Corporate_Bonds_Summary_Maturity_from_5_to_10 `AAA_Corporate_Bonds_Summary_Maturity_from_10_to_20 `AAA_Corporate_Bonds_Summary_Maturity_from_20_up `AA_Corporate_Bonds_Summary_Maturity_from_0_to_1 `AA_Corporate_Bonds_Summary_Maturity_from_1_to_5 `AA_Corporate_Bonds_Summary_Maturity_from_5_to_10 `AA_Corporate_Bonds_Summary_Maturity_from_10_to_20 `AA_Corporate_Bonds_Summary_Maturity_from_20_up `A_Corporate_Bonds_Summary_Maturity_from_0_to_1 `A_Corporate_Bonds_Summary_Maturity_from_1_to_5 `A_Corporate_Bonds_Summary_Maturity_from_5_to_10 `A_Corporate_Bonds_Summary_Maturity_from_10_to_20 `A_Corporate_Bonds_Summary_Maturity_from_20_up `A_plus_Corporate_Bonds_Summary_Maturity_from_1_to_2 `A_plus_Corporate_Bonds_Summary_Maturity_from_2_to_5 `A_plus_Corporate_Bonds_Summary_Maturity_from_10_up `BBB_Corporate_Bonds_Summary_Maturity_from_1_to_2 `BBB_Corporate_Bonds_Summary_Maturity_from_2_to_5 `BBB_Corporate_Bonds_Summary_Maturity_from_10_up `High_Yield_Corporate_Bonds_Summary_Maturity_from_1_to_2 `High_Yield_Corporate_Bonds_Summary_Maturity_from_2_to_5 `High_Yield_Corporate_Bonds_Summary_Maturity_from_10_up `All_Investments `All_Investments_ex_Affiliates `Alternative `Alternative_Bonds `Alternative_HGB `Alternative_Indices `Bonds_Affiliate `Bonds_Corp `Bonds_Corp_A `Bonds_Corp_AA `Bonds_Corp_AAA `Bonds_Corp_AAA_00_01 `Bonds_Corp_AAA_01_02 `Bonds_Corp_AAA_02_05 `Bonds_Corp_AAA_05_10 `Bonds_Corp_AAA_10_20 `Bonds_Corp_AAA_20_up `Bonds_Corp_AA_00_01 `Bonds_Corp_AA_01_02 `Bonds_Corp_AA_02_05 `Bonds_Corp_AA_05_10 `Bonds_Corp_AA_10_20 `Bonds_Corp_AA_20_up `Bonds_Corp_A_00_01 `Bonds_Corp_A_01_02 `Bonds_Corp_A_02_05 `Bonds_Corp_A_05_10 `Bonds_Corp_A_10_20 `Bonds_Corp_A_20_up `Bonds_Corp_A_plus `Bonds_Corp_BBB `Bonds_Corp_BBB_00_01 `Bonds_Corp_BBB_01_02 `Bonds_Corp_BBB_02_05 `Bonds_Corp_BBB_05_10 `Bonds_Corp_BBB_10_20 `Bonds_Corp_BBB_20_up `Bonds_Corp_Default `Bonds_Corp_High_Yield `Bonds_Corp_High_Yield_00_01 `Bonds_Corp_High_Yield_01_02 `Bonds_Corp_High_Yield_02_05 `Bonds_Corp_High_Yield_05_10 `Bonds_Corp_High_Yield_10_20 `Bonds_Corp_High_Yield_20_up `Bonds_FRN `Bonds_Indices `Bonds_Inflation `Bonds_Model `Bonds_Pfandbriefe `Bonds_Risk_Free `Bonds_Schuldschein `Bonds_State_GO `Bonds_State_GO_and_Corp_A_plus `Bonds_Treasury `Common_Stock `Common_Stock_Affiliate `Common_Stock_Indices `Common_Stock_Unaffiliated `Derivatives `Derivatives_Equity `Derivatives_Interest `Fixed_Income `Fixed_Income_HGB `Fixed_Income_Tax_Exempt `Fixed_Income_Taxable `Investments_in_Affiliates `Mortgages `Mortgages_Direct `Mortgages_Securitized `Preferred `Preferred_A `Preferred_AA `Preferred_AAA `Preferred_Affiliate `Preferred_BBB `Preferred_Default `Preferred_High_Yield `Preferred_Indices `Preferred_Model `Preferred_Unaffiliated `Property `Property_Indices `Property_Model `Stock `Stock_Affiliated `Stock_Unaffiliated
                ))
             )
          )
         (`editor
          .,(`Class;1;)
          )
         (`p
          .((`Class;`AAA_Corporate_Bonds_Summary;)
            (`Weight;1.0;))
          )
         (`cl
          .,(`Class;`"Asset Class";)
          )
         (`f
          .,(`Weight;9.6;)
          )
         (`g
          .,(`Weight;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
          )
         (`u
          .((`Weight;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
            (`Class;{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};))
          )
         (`reorder;0;)
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
          ))
       )
      (`U;`Asset_Class;)
      (`J
       .((`C;{[c;x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(`Unspecified_,(`$("New_"),($a),"_")),(z#y),x}[u];+2#,#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
 			e:.[e;(`j;`u;x);:[;c]]
			(d;e)}[{[x;y]
		 if[{("New_"~4#x)&"_"~*|x}@$y
		   e:`. .k.attr jv:.j.v; ji:.j.i
		   u:`$4_ -1_ $y
		   p::[e.j.c _in`combo`Combo; ,,`j
		       e.j.c _in`Slot`slot`Table`table`Cross`cross; `j`cell,/:combos@&y _in/:e.j.cell[combos:(!e.j.cell)@&e.j.cell[;`c]=`combo;`o]
		       e.j.c _in`vector`Vector; ,`j`cell]
		   y:.k.new_u_[$!.G[`axes;u];(.k.get_s .V..Hash_Location,u)[];($u),"_"]
		   list:((u;`A;,y);(u;`L;(!.G[`axes;u]),y))
		   .k.xeq_u_[();list;.,(u;(.G[`axes;u;],1;(!.G[`axes;u]),y));1]
		   .k.set_s[.V..Hash_Location,u,y;.u.symbol_hash16@y]
		   e:./[e;p;{y:@[y;`o;,;x];:[`ol _in!y;.[y;(`ol;);,[;x]];y]}[y]]
		   .[`;.k.attr jv;:;e]
		   .[`;jv,ji;:;y]
		   ]
		 ("";y)};,`Class;,0#`];)
         (`D;{  [x;d;e;a;u]	x:x@&x _lin !d; if[#i:?,//&:'d[x] _lin\:u; d:@[d;_n;_di[;i]]];(d;e)}[,`Class];)
         (`R;{  [x;d;e;a;u]	d:.[d;(x;);{:[y _in !x;x@y;y]}[u]];(d;e)}[,`Class];)
         (`A;{    [d;e;a;u]	(d;e)};)
         (`L;{[x;y;d;e;a;u]	e:.[e;(`j;`cell;x;`o);:;(`Unspecified_,(`$("New_"),($a),"_")),/:y,\:u]
			if[`ol _in ,/!:'e.j.cell[x]
			  e:.[e;(`j;`cell;x;`ol;);{(z#y),x}[u];+2#,2+#:'y]]
			e:.[e;(`j;`p;x);{:[~x _in y;*2_ y;x]};e[`j;`cell;x;`o]]
			(d;e)}[,`Class;,0#`];)
         (`F
          ,`Class
          ))
       )
      (`P;1;)
      (`L;0;)
      (`M
       ,`Aggregate
       )))
   (`Basis
    `USD
    .((`j
       .((`c;`combo;)
         (`o
          `Default `USD `EUR `GBP `CHF `AUD `CAD `JPY `DKK `NOK `SEK `BRL
          )
         (`fill;`h;)
         (`l;`"Currency Basis for Historical Returns";)
         (`help;`"<html>Returns in other currencies will be adjusted from this base</html>";)
         (`wx;0.5;)
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
          (`Default `USD `EUR `GBP `CHF `AUD `CAD `JPY `DKK `NOK `SEK `BRL
           `Default `USD `EUR `GBP `CHF `AUD `CAD `JPY `DKK `NOK `SEK `BRL)
          ))
       )
      (`P;1;)
      (`V;{[p;x]
  e2c:.C`Economy_Currency
  c2r:`All`Default,e2c[(),{(!x)@&x[]}@.k.get_s (0;`A;`User;`GEMS_User_Inputs;`Economies_to_Run)]
  :[~x _in c2r;(0;("Currency &0 is not in the list of currencies to run for this simulation. Currency will be changed to first active currency in the simulation.";$x))]};)
      (`E;1;)
      (`L;0;)
      (`M
       `Bonds `Mortgages `Market_Indices `Property `Interest_Rate_Derivatives `Index_Derivatives `Investments_in_Affiliates `Aggregate `Usage
       )))
   (`Usage
    .((`Returns
       1
       .,(`j
          .((`c;`check;)
            (`anchor;`nw;)
            (`wy;0.0;)
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
             .()))
          ))
      (`Investments
       0
       .((`j
          .((`c;`check;)
            (`anchor;`nw;)
            (`wy;0.0;)
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
             .()))
          )
         (`B;`Investments;)))
      (`Cashflows_and_IRRs
       0
       .((`j
          .((`c;`check;)
            (`anchor;`nw;)
            (`wy;0.0;)
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
             .()))
          )
         (`B;`Investments;)))
      (`Economic
       0
       .((`j
          .((`c;`check;)
            (`anchor;`nw;)
            (`wy;0.0;)
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
             .()))
          )
         (`B;`Economic;)))
      (`US_GAAP
       0
       .((`j
          .((`c;`check;)
            (`anchor;`nw;)
            (`wy;0.0;)
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
             .()))
          )
         (`B;`US_GAAP;)))
      (`IFRS
       0
       .((`j
          .((`c;`check;)
            (`anchor;`nw;)
            (`wy;0.0;)
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
             .()))
          )
         (`B;`IFRS;)))
      (`US_Statutory
       0
       .((`j
          .((`c;`check;)
            (`anchor;`nw;)
            (`wy;0.0;)
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
             .()))
          )
         (`B
          `US_Statutory `US_Statutory_Life
          )))
      (`HGB
       0
       .((`j
          .((`c;`check;)
            (`anchor;`nw;)
            (`wy;1.0;)
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
             .()))
          )
         (`B
          `HGB `HGB_Life
          ))))
    .((`P;1;)
      (`j
       .,(`c;`panel;)
       )
      (`Y;`checkpanel;)
      (`E;1;)
      (`L;0;)
      (`M
       `Bonds `Mortgages `Market_Indices `Property `Interest_Rate_Derivatives `Index_Derivatives `Investments_in_Affiliates `Aggregate `Usage
       )))
   (`History
    .((`Period
       ,`"2003M12"
       .())
      (`Income
       ,0.0
       .())
      (`Price
       ,0.0
       .())
      (`IndexP
       ,1.0
       .,(`V;{[p;x]:[#a:&~x>0;(1;"Must be positive numbers";,,a)]};))
      (`IndexT
       ,1.0
       .,(`V;{[p;x]:[#a:&~x>0;(1;"Must be positive numbers";,,a)]};)))
    .((`j
       .((`l;`"Historical Returns and Index Values";)
         (`c;`table;)
         (`p
          .((`Period;`;)
            (`Income;0.0;)
            (`Price;0.0;)
            (`IndexP;1.0;)
            (`IndexT;1.0;))
          )
         (`e
          .,(`Period;0;)
          )
         (`bg
          .,(`Period;`e;)
          )
         (`fixed;1;)
         (`b
          .,(`Period;`n;)
          )
         (`popup
          .((`Prepend_Number_of_Rows_Selected;{[f;junk] / change[]
 nul:{(x~_n)|~#x}                            / null or empty?
 dot:`${($x),".",$y}/`,                      / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                 / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]   / default to first selectable if null
 if[~nul i 0                                 / if there is a selection
   r:f[w:`. d,v;b:`. d,a;d,v;i]              / run
   if[2=#r                                   / if there is a result
    if[r~(w;b)  ;:_n]                        / if it is identical, no op
    c:r[1;`j;`c]                             / save class
    r[1;`j;`c]:`null                         / set class to null
    .[`;d,a,`j`c;:;`null]                    / set screen object class to null
    .[`;d,,v,a;:;r]                          / reset object
    .[`;d,a,`j`c;:;c]]]                      / reset screen object class to c
}[{[n;d;e;v;i]
 .j.ins.row[`$,/".",'$v;0;rti::[n>0.;_ 12*n;#?i[;1]]]
 .[`;v,`Period;:;`$mtime@|-!rti+#d`Period]
}[0]];)
            (`Prepend_Month;{[f;junk] / change[]
 nul:{(x~_n)|~#x}                            / null or empty?
 dot:`${($x),".",$y}/`,                      / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                 / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]   / default to first selectable if null
 if[~nul i 0                                 / if there is a selection
   r:f[w:`. d,v;b:`. d,a;d,v;i]              / run
   if[2=#r                                   / if there is a result
    if[r~(w;b)  ;:_n]                        / if it is identical, no op
    c:r[1;`j;`c]                             / save class
    r[1;`j;`c]:`null                         / set class to null
    .[`;d,a,`j`c;:;`null]                    / set screen object class to null
    .[`;d,,v,a;:;r]                          / reset object
    .[`;d,a,`j`c;:;c]]]                      / reset screen object class to c
}[{[n;d;e;v;i]
 .j.ins.row[`$,/".",'$v;0;rti::[n>0.;_ 12*n;#?i[;1]]]
 .[`;v,`Period;:;`$mtime@|-!rti+#d`Period]
}[0.08333333]];)
            (`Prepend_Year;{[f;junk] / change[]
 nul:{(x~_n)|~#x}                            / null or empty?
 dot:`${($x),".",$y}/`,                      / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                 / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]   / default to first selectable if null
 if[~nul i 0                                 / if there is a selection
   r:f[w:`. d,v;b:`. d,a;d,v;i]              / run
   if[2=#r                                   / if there is a result
    if[r~(w;b)  ;:_n]                        / if it is identical, no op
    c:r[1;`j;`c]                             / save class
    r[1;`j;`c]:`null                         / set class to null
    .[`;d,a,`j`c;:;`null]                    / set screen object class to null
    .[`;d,,v,a;:;r]                          / reset object
    .[`;d,a,`j`c;:;c]]]                      / reset screen object class to c
}[{[n;d;e;v;i]
 .j.ins.row[`$,/".",'$v;0;rti::[n>0.;_ 12*n;#?i[;1]]]
 .[`;v,`Period;:;`$mtime@|-!rti+#d`Period]
}[1]];)
            (`Prepend_Years
             .((`Two;{[f;junk] / change[]
 nul:{(x~_n)|~#x}                            / null or empty?
 dot:`${($x),".",$y}/`,                      / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                 / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]   / default to first selectable if null
 if[~nul i 0                                 / if there is a selection
   r:f[w:`. d,v;b:`. d,a;d,v;i]              / run
   if[2=#r                                   / if there is a result
    if[r~(w;b)  ;:_n]                        / if it is identical, no op
    c:r[1;`j;`c]                             / save class
    r[1;`j;`c]:`null                         / set class to null
    .[`;d,a,`j`c;:;`null]                    / set screen object class to null
    .[`;d,,v,a;:;r]                          / reset object
    .[`;d,a,`j`c;:;c]]]                      / reset screen object class to c
}[{[n;d;e;v;i]
 .j.ins.row[`$,/".",'$v;0;rti::[n>0.;_ 12*n;#?i[;1]]]
 .[`;v,`Period;:;`$mtime@|-!rti+#d`Period]
}[2]];)
               (`Three;{[f;junk] / change[]
 nul:{(x~_n)|~#x}                            / null or empty?
 dot:`${($x),".",$y}/`,                      / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                 / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]   / default to first selectable if null
 if[~nul i 0                                 / if there is a selection
   r:f[w:`. d,v;b:`. d,a;d,v;i]              / run
   if[2=#r                                   / if there is a result
    if[r~(w;b)  ;:_n]                        / if it is identical, no op
    c:r[1;`j;`c]                             / save class
    r[1;`j;`c]:`null                         / set class to null
    .[`;d,a,`j`c;:;`null]                    / set screen object class to null
    .[`;d,,v,a;:;r]                          / reset object
    .[`;d,a,`j`c;:;c]]]                      / reset screen object class to c
}[{[n;d;e;v;i]
 .j.ins.row[`$,/".",'$v;0;rti::[n>0.;_ 12*n;#?i[;1]]]
 .[`;v,`Period;:;`$mtime@|-!rti+#d`Period]
}[3]];)
               (`Four;{[f;junk] / change[]
 nul:{(x~_n)|~#x}                            / null or empty?
 dot:`${($x),".",$y}/`,                      / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                 / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]   / default to first selectable if null
 if[~nul i 0                                 / if there is a selection
   r:f[w:`. d,v;b:`. d,a;d,v;i]              / run
   if[2=#r                                   / if there is a result
    if[r~(w;b)  ;:_n]                        / if it is identical, no op
    c:r[1;`j;`c]                             / save class
    r[1;`j;`c]:`null                         / set class to null
    .[`;d,a,`j`c;:;`null]                    / set screen object class to null
    .[`;d,,v,a;:;r]                          / reset object
    .[`;d,a,`j`c;:;c]]]                      / reset screen object class to c
}[{[n;d;e;v;i]
 .j.ins.row[`$,/".",'$v;0;rti::[n>0.;_ 12*n;#?i[;1]]]
 .[`;v,`Period;:;`$mtime@|-!rti+#d`Period]
}[4]];)
               (`Five;{[f;junk] / change[]
 nul:{(x~_n)|~#x}                            / null or empty?
 dot:`${($x),".",$y}/`,                      / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                 / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]   / default to first selectable if null
 if[~nul i 0                                 / if there is a selection
   r:f[w:`. d,v;b:`. d,a;d,v;i]              / run
   if[2=#r                                   / if there is a result
    if[r~(w;b)  ;:_n]                        / if it is identical, no op
    c:r[1;`j;`c]                             / save class
    r[1;`j;`c]:`null                         / set class to null
    .[`;d,a,`j`c;:;`null]                    / set screen object class to null
    .[`;d,,v,a;:;r]                          / reset object
    .[`;d,a,`j`c;:;c]]]                      / reset screen object class to c
}[{[n;d;e;v;i]
 .j.ins.row[`$,/".",'$v;0;rti::[n>0.;_ 12*n;#?i[;1]]]
 .[`;v,`Period;:;`$mtime@|-!rti+#d`Period]
}[5]];))
             )
            (`PreDelete_Number_of_Rows_Selected;{[f;junk] / change[]
 nul:{(x~_n)|~#x}                            / null or empty?
 dot:`${($x),".",$y}/`,                      / dotted name from vector
 j:.j.v;d:-3_ j;v:~a:*|-2_ j                 / variable, etc.
 if[nul i:`. d,a,`j`s;i:,.j.first dot d,v]   / default to first selectable if null
 if[~nul i 0                                 / if there is a selection
   r:f[w:`. d,v;b:`. d,a;d,v;i]              / run
   if[2=#r                                   / if there is a result
    if[r~(w;b)  ;:_n]                        / if it is identical, no op
    c:r[1;`j;`c]                             / save class
    r[1;`j;`c]:`null                         / set class to null
    .[`;d,a,`j`c;:;`null]                    / set screen object class to null
    .[`;d,,v,a;:;r]                          / reset object
    .[`;d,a,`j`c;:;c]]]                      / reset screen object class to c
}[{[d;e;v;i]
 if[rtd:(-1+#d`Period)&#?i[;1]
  .j.del.row[`$,/".",'$v;!rtd]
  .[`;v,`Period;:;`$mtime@|-!(-rtd)+#d`Period] ]
}];)
            (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
            (`Paste;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`paste;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
            (`Copy_Location;{[x]
 s:`. (-1_ .j.v),`s
 if[~location:~(s~_n)&~(4:`. v:attr -2_ .j.v) _in 1 2 3 4 -3; .j.ok.i"A location must be selected. No action taken."]
 if[location
   is:((`. `k`Main`split`right.`II),(5_ v)),/::[s~_n;,();s]
   iu:1_'labels'sub'is
   ia:1_'tag[.S]'is
   .w.cbwrite[`text`DFA_;(1_,/"\n",/:{,/"\\",/:$x}'iu;.+(`User_Path`S_Path`A_Path;(iu;is;ia)))]
   ]
 };))
          .())
         (`f;9.6;)
         (`g;{ / always produces float
 if[~-3=4:x;x*:]
 v:@[.r.num.g[0.0];x _dvl"()$%\"";:]
 :[(|/1 2=4:v 1)&~v 0;(((1. -1)@"(" _in x)*(1 .01)@"%" _in x)*v 1;0n]};)
         (`u;{:[~y _in (0n;0N);	("";y)
                   y~0n;("Input should be numeric";x)
                   y~0N;("Input should be integer-valued";x)]};)
         (`cl
          .((`Income;`"Income\nReturn";)
            (`Price;`"Price\nReturn";)
            (`IndexP;`"Price\nIndex";)
            (`IndexT;`"Total\nIndex";))
          )
         (`reorder;0;)
         (`s;();.()))
       )
      (`P;1;)
      (`G;{[d;e]
 d[],:(rti:_12%.G`pdy)#/:{[x;y]:[y~_n;zon x;y]}'[d[;0];e[`j;`p;!d]]
 d[f]:`$mtime@rti+|-!#d[f::[`c0 _in !d;`c0;`Period]]  / handles accounting history: Jun 7 2005 dw
 d};)
      (`Z;{[c;f;d;v;i]
	l:v,c
	b:d . l
	a:f b

	/ before comparing, insert a blank before a "+" if it was not there (was previously causing warnings).
	a:@[a; _n; {:[(($x) _ss "[^ ]+")~(!0); x; `$$(_ssr[$x; "+"; " +"])]}]
	b:@[b; _n; {:[(($x) _ss "[^ ]+")~(!0); x; `$$(_ssr[$x; "+"; " +"])]}]

	if[a~b; :_n]
	h:_ssr/[$:[_n~h:d . .u.attr[v],`j`cl,c;c;h];"\n_";" "]
	.[d;l;:;a]
	,(0
		:[1=#a
			("&0 adjusted to have the value &1";h;*a)
			("&0 adjusted to have values range from &1 to &2";h;*a;*|a)]
		`rc
	0 0 ) }[`Period;{`$.L.P.mtime@|-!#x}];)
      (`E;1;)
      (`L;0;)
      (`M
       `Bonds `Mortgages `Market_Indices `Property `Interest_Rate_Derivatives `Index_Derivatives `Investments_in_Affiliates `Aggregate `Usage
       ))))
 .((`P;1;)
   (`C;`Asset_Class;)
   (`j
    .((`c;`panel;)
      (`aa
       (,`m
        `Bonds `Mortgages `Market_Indices `Property `Index_Derivatives `Interest_Rate_Derivatives `Investments_in_Affiliates `Aggregate
        `Usage
        `History `Basis)
       )
      (`a
       (`m
        `Bonds
        `Usage
        `History `Basis)
       ))
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