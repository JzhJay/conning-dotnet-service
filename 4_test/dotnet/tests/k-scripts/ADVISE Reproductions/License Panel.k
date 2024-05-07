lm: (.((`License
    .((`Fingerprint
       .((`code
          "06838-3e334-0adaf-1f00a-846d8"
          .,(`j
             .((`c;`text;)
               (`e;0;)
               (`border;0;)
               (`cursor;25;.())
               (`s;;.()))
             ))
         (`web
          { / web_license
  un:$username
  dn:$.w.get_domainname[]
  fp:license.make_fingerprint[]
  / Give the user a chance to back out.
  if[`Yes~.j.yesno[,/("You are about to send data to the DFA website via your configured web browser.\n"
                      "The following information will be transmitted:\n\n"
                      "     User name: ",un,"\n"
                      "     Domain name: ",dn,"\n"
                      "     Fingerprint: ",fp,"\n\n"
                      "Do you want to continue?")]
    url:"http://www.dfa.com/license.php?un=",un,"&dn=",dn,"&fp=",fp
    .w.exec[`open;url;_n;_n;`shownormal;`web_license]]
}
          .,(`j
             .((`c;`button;)
               (`l;`Send_via_Web;)
               (`async;2;))
             ))
         (`email
          { / email_license
  un:$username
  dn:$.w.get_domainname[]
  fp:license.make_fingerprint[]
  url:"mailto:license@conning.com?Subject=Fingerprint data&body=",un,"%0a",dn,"%0a",fp
  .w.exec[`open;url;_n;_n;`shownormal;`email_license]
}
          .,(`j
             .((`c;`button;)
               (`l;`Send_via_Email;)
               (`async;2;))
             )))
       .,(`j
          .((`c;`panel;)
            (`a
             ,`code `email
             )
            (`wy;0.0;)
            (`fill;`h;)
            (`anchor;`n;))
          ))
      (`Management
       .((`Node_Type
          .((`label;"Node Type:  ";.())
            (`choices
             .((`Client
                1
                .,(`j
                   .((`c;`radiobutton;)
                     (`l;"Client or Client/Grid hybrid";)
                     (`t;{if[`. .j.v;gp[.+(`cust`lserver`worker;pg[]`cust`lserver`worker)]]};)
                     (`group;`nodetype;)
                     (`insets
                      0 0 0 30
                      ))
                   ))
               (`Grid
                0
                .,(`j
                   .((`c;`radiobutton;)
                     (`l;"Grid Node or Management Console only";)
                     (`t;{if[`. .j.v;gp[.+(`cust`lserver`worker;pg[]`cust`lserver`worker)]]};)
                     (`group;`nodetype;)
                     (`insets
                      0 0 0 30
                      ))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`a
                   `Client `Grid
                   )
                  (`fill;`n;)
                  (`anchor;`w;)
                  (`border;0;)
                  (`insets
                   0 70 0 0
                   ))
                )))
          .,(`j
             .((`c;`panel;)
               (`wy;0.0;)
               (`fill;`h;)
               (`anchor;`n;)
               (`border;0;)
               (`insets
                0 0 10 0
                ))
             ))
         (`License_Manager
          .((`label;"License Manager:  ";.())
            (`hostname
             `
             .,(`j
                .((`c;`scalar;)
                  (`f;50;)
                  (`u;{[o;n]server_name_update[o;n]};)
                  (`t;{refresh[]};)
                  (`async;2;)
                  (`anchor;`w;)
                  (`border;0;)
                  (`insets
                   0 70 0 0
                   ))
                ))
            (`warning
             ""
             .,(`j
                .((`c;`label;)
                  (`insets
                   0 70 0 0
                   ))
                )))
          .,(`j
             .((`c;`panel;)
               (`wy;0.0;)
               (`fill;`h;)
               (`anchor;`n;)
               (`border;0;)
               (`insets
                0 0 10 0
                ))
             )))
       .,(`j
          .((`c;`panel;)
            (`a
             `Node_Type `License_Manager
             )
            (`wy;0.0;)
            (`fill;`h;)
            (`anchor;`n;))
          ))
      (`Features
       .((`Customer
          .((`label;"Customer:  ";.())
            (`combo
             `All
             .,(`j
                .((`o
                   `All `BuiltIn `None
                   )
                  (`t;{gp[.+(`cust`set`lserver`worker;(`. .j.v),pg[]`set`lserver`worker)]};)
                  (`border;0;)
                  (`insets
                   0 70 0 70
                   )
                  (`ol
                   (`All `BuiltIn `None
                    `All `BuiltIn `None)
                   ))
                )))
          .,(`j
             .((`c;`panel;)
               (`v;1;)
               (`wy;0.0;)
               (`fill;`h;)
               (`anchor;`n;)
               (`border;0;)
               (`insets
                0 0 10 0
                ))
             ))
         (`Set
          .((`label;"Feature Set:  ";.())
            (`combo
             `all
             .,(`j
                .((`o
                   ,`all
                   )
                  (`t;{p:pg[];gp[.+(`cust`set`lserver`worker;p[`cust],(`. .j.v),p`lserver`worker)]};)
                  (`border;0;)
                  (`insets
                   0 70 0 70
                   )
                  (`ol
                   (,`all
                    ,`all)
                   ))
                )))
          .,(`j
             .((`c;`panel;)
               (`v;0;)
               (`wy;0.0;)
               (`fill;`h;)
               (`anchor;`n;)
               (`border;0;)
               (`insets
                0 0 10 0
                ))
             ))
         (`Economies
          .((`label;"Economies:  ";.())
            (`choices
             .((`US
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`DE
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`GB
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`CH
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`AU
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`CA
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`JP
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`DK
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`NO
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`SE
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`a
                   (`US `DE `GB `CH `AU `CA `JP `DK
                    `NO `SE ` ` ` ` ` `)
                   )
                  (`fill;`n;)
                  (`anchor;`w;)
                  (`border;0;)
                  (`insets
                   0 70 0 0
                   ))
                )))
          .,(`j
             .((`c;`panel;)
               (`wy;0.0;)
               (`fill;`h;)
               (`anchor;`n;)
               (`border;0;)
               (`insets
                0 0 10 0
                ))
             ))
         (`Modules
          .((`label;"Modules:  ";.())
            (`choices
             .((`Property_Casualty
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Life_Insurance
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Supplemental_Models
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`GEMS
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Investments
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Financing
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Accounting
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Tax
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Regulatory
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`a
                   (`Property_Casualty `GEMS `Accounting
                    `Life_Insurance `Investments `Tax
                    `Supplemental_Models `Financing `Regulatory)
                   )
                  (`fill;`n;)
                  (`anchor;`w;)
                  (`border;0;)
                  (`insets
                   0 70 0 0
                   ))
                )))
          .,(`j
             .((`c;`panel;)
               (`wy;0.0;)
               (`fill;`h;)
               (`anchor;`n;)
               (`border;0;)
               (`insets
                0 0 10 0
                ))
             ))
         (`Options
          .((`label;"Options:  ";.())
            (`choices
             .((`LPI_Swaps
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Derivatives
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Recalibration
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Libor_Swap_Rates
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Auxiliary_Term_Structure
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Market_Index_Customization
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Optimization_Analysis_Report
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Weighted_Paths
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Target_Parameterization
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Efficient_Frontier_Analysis
                0
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;0;)
                     (`lfg;;)
                     (`lbg;;))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`a
                   (`LPI_Swaps `Auxiliary_Term_Structure
                    `Derivatives `Market_Index_Customization
                    `Recalibration `Optimization_Analysis_Report
                    `Libor_Swap_Rates `Weighted_Paths
                    `Target_Parameterization `Efficient_Frontier_Analysis)
                   )
                  (`fill;`n;)
                  (`anchor;`w;)
                  (`border;0;)
                  (`insets
                   0 70 0 0
                   ))
                )))
          .,(`j
             .((`c;`panel;)
               (`wy;0.0;)
               (`fill;`h;)
               (`anchor;`n;)
               (`border;0;)
               (`insets
                0 0 10 0
                ))
             ))
         (`Calibration_Measure
          .((`label;"Calibration Measure:  ";.())
            (`choices
             .((`Real_World
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Risk_Neutral
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`a
                   ,`Real_World `Risk_Neutral
                   )
                  (`fill;`n;)
                  (`anchor;`w;)
                  (`border;0;)
                  (`insets
                   0 70 0 0
                   ))
                )))
          .,(`j
             .((`c;`panel;)
               (`wy;0.0;)
               (`fill;`h;)
               (`anchor;`n;)
               (`border;0;)
               (`insets
                0 0 10 0
                ))
             ))
         (`Custom
          .((`label;"Customizations:  ";.())
            (`choices
             .((`custom_choice
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      ))
                   ))
               (`Developer
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Cardano
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Clarendon
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Gerling
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Bond_Issuer_ID
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Inner_Loop_Projections
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Export_Simulation_Data
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`JLT_Bond_Model
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   ))
               (`Credit_Model_Customizability
                1
                .,(`j
                   .((`c;`check;)
                     (`u;{[o;n]:[`All~pg[]`cust;n;o]};)
                     (`anchor;`w;)
                     (`insets
                      0 0 0 30
                      )
                     (`e;1;)
                     (`lfg;;)
                     (`lbg;;))
                   )))
             .,(`j
                .((`c;`panel;)
                  (`a
                   (`Developer `Cardano `Clarendon
                    `Gerling `Bond_Issuer_ID `Inner_Loop_Projections
                    `Export_Simulation_Data `JLT_Bond_Model `Credit_Model_Customizability)
                   )
                  (`fill;`n;)
                  (`anchor;`w;)
                  (`border;0;)
                  (`insets
                   0 70 0 0
                   ))
                )))
          .,(`j
             .((`c;`panel;)
               (`wy;0.0;)
               (`fill;`h;)
               (`anchor;`n;)
               (`border;0;)
               (`insets
                0 0 10 0
                )
               (`v;1;))
             ))
         (`Filler
          .,(`label;"Notes: Unlicensed options are dimmed out.  Expired options are highlighted in red.";.())
          .,(`j
             .((`c;`panel;)
               (`border;0;))
             )))
       .,(`j
          .((`c;`panel;)
            (`a
             `Customer `Set `Economies `Modules `Options `Calibration_Measure `Custom `Filler
             ))
          ))
      (`Offline_License
       .((`label
          "Duration (in days):  "
          .,(`j
             .,(`wx;0.0;)
             ))
         (`combo
          30
          .,(`j
             .((`o
                1 5 10 15 20 25 30
                )
               (`border;0;))
             ))
         (`out
          {offline_checkout[`.(-1_.j.v),`combo]}
          .,(`j
             .((`c;`button;)
               (`l;`Check_Out;)
               (`async;2;)
               (`e;1;))
             ))
         (`in
          {offline_checkin[]}
          .,(`j
             .((`c;`button;)
               (`l;`Check_In;)
               (`async;2;)
               (`e;0;))
             )))
       .,(`j
          .((`c;`panel;)
            (`a
             ,`label `combo `out `in
             )
            (`v;0;)
            (`wy;0.0;)
            (`fill;`h;)
            (`anchor;`s;))
          )))
    .,(`j
       .((`c;`panel;)
         (`a
          `Fingerprint `Management `Features `Offline_License
          )
         (`border;0;))
       ))
   (`toolbar
    .((`ShowDates
       { / show_expiration
  / Get the customer name.
  cust:pg[]`cust
  / Get all of the customer sets.
  set_list:!set_data:license.get_customer_sets[_n;cust;0]
  version:.a[`A],`$$*.v.i .v.c
  set_list@:&version _in/:set_data[]
  set_list:set_list[<set_list]

  / Get the list of expiration dates for each feature.
  exp:license.get_customer_set_expiration[_n;cust]'set_list

  / Make string containing info.
  exp:{:[x;short_date_format x;"unknown"]}'exp
  str:{[s;e]($s),"\t",e}'[set_list;exp]
  str:"Your licenses expire as follows:\n",/"\n     ",/:str

  / Display it.
  .j.ok.I str
}
       .,(`j
          .((`async;2;)
            (`help;"Show License Expiration Dates";)
            (`image;"Calendar_32.png";)
            (`l;"";))
          ))
      (`Save
       { / save
  if[~pg[]`worker
    if[~license.licenses_available[_n]|~`~pg[]`lserver
      .j.ok.E[,/("You don't have a license file, and the License manager cannot be found.\n"
                 "Install a license file, specify a License manager, or set Grid Mode to Yes.\n"
                 "You will not be able to save license configuration until you have done so.")]
      :_n]
    if[selections_dimmed[]
      if[`No~.j.yesno[,/("Some of your selections are no longer licensed.\n"
                         "Saving now will removing these items from your selection.\n"
                         "Continue with save?")]
        :_n]]
    deselect_dimmed[]
    if[(#conf)&0<&/#:'conf:list_conflicts[]
      if[`Yes~.j.yesno[,/("Some of your selections conflict with each other.\n"
                          "Can't save!\nView list of conflicting items?")]
        build_conflict_panel[conf]]
      :_n]
    if[selections_expired[]
      if[`No~.j.yesno"Some of your selections have expired.\nContinue with save?";:_n]]]

  .s.Set[`License;pg[]]
  .s.Save[]
  saved::1
  setSave 0
}
       .,(`j
          .((`async;2;)
            (`help;"Save License Settings";)
            (`image;"Save_32.png";)
            (`l;"";)
            (`e;0;))
          )))
    .,(`j
       .((`fill;`n;)
         (`anchor;`w;)
         (`border;0;)
         (`wy;0.0;))
       )))
 .((`j
    .((`iconify;;)
      (`menu
       .((`File
          .((`Refresh;{gp[pg[]]};)
            (`Import_License_File;{.j.busy[`panel;1];import_license[];.j.busy[`panel;0]};)
            (`Save;{save[]};)
            (`s0;" ";)
            (`Exit;{exit[]};))
          )
         (`Display
          .((`Text_Size
             (`Medium
              `Huge `Large `Medium `Small `Tiny)
             )
            (`s0;" ";)
            (`Expiration_Dates;{ / show_expiration
  / Get the customer name.
  cust:pg[]`cust
  / Get all of the customer sets.
  set_list:!set_data:license.get_customer_sets[_n;cust;0]
  version:.a[`A],`$$*.v.i .v.c
  set_list@:&version _in/:set_data[]
  set_list:set_list[<set_list]

  / Get the list of expiration dates for each feature.
  exp:license.get_customer_set_expiration[_n;cust]'set_list

  / Make string containing info.
  exp:{:[x;short_date_format x;"unknown"]}'exp
  str:{[s;e]($s),"\t",e}'[set_list;exp]
  str:"Your licenses expire as follows:\n",/"\n     ",/:str

  / Display it.
  .j.ok.I str
};)
            (`Offline_License;0;))
          )
         (`Help
          .((`ADVISE_Help;{[topic]
 .m.S[(`localhost;.p`App);(`help.d;,topic)]
};)
            (`About_ADVISE;{.j.ok.i("\n&0\256 &1

\251 2011 by Conning Services (Ireland) Limited

All rights reserved.

This software is subject to the &0\256 software agreement.
";.a`A;.v.C)
};))
          ))
       .,(`j
          .((`acc
             ((`File `Refresh
               `File `Import_License_File
               `File `Show_Expiration_Dates
               `File `Save
               `File `Exit)
              `r `i `d `s `e)
             )
            (`mnem
             ((,`File
               `File `Refesh
               `File `Import_License_File
               `File `Show_Expiration_Dates
               `File `Save
               `File `Exit
               ,`Display
               `Display `Text_Size
               `Display `Set_Default_Window_Size
               `Display `Set_Default_Window_Location
               ,`Help
               `Help `ADVISE_Help
               `Help `About_ADVISE)
              `f `r `i `d `s `e `d `t `w `l `h `h `a)
             )
            (`ne
             ((,`File
               `File `Refesh
               `File `Import_License_File
               `File `Show_Expiration_Dates
               `File `Save
               `File `Exit
               ,`Display
               `Display `Text_Size
               `Display `Set_Default_Window_Size
               `Display `Set_Default_Window_Location
               ,`Help
               `Help `ADVISE_Help
               `Help `About_ADVISE)
              1 1 1 1 0 1 1 1 1 1 1 1 1)
             )
            (`async;2;)
            (`t;{
 :[`Display`Text_Size~2#.j.i;.j.Font:`..j.v,.j.i]
 display_offline_section `..j.v,.j.i
};))
          ))
      (`c;`panel;)
      (`a
       `toolbar `License
       )
      (`l;`"License Settings";)
      (`loc
       1125 96
       .())
      (`xy
       665 850
       .())
      (`close;{exit[]};))
    .,(`t;".j.k[];.j.flush[];";))
   (`t;".j.k[];.j.flush[];";)))



p: .()
p..j.c: `panel
p..j.l: "License Manager (MOCK)"
p..j.xy: (700;850)
p..j.loc: (200;50)

p.A: lm[0]
p.A.: lm[1]
p.A..j.border:0

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
