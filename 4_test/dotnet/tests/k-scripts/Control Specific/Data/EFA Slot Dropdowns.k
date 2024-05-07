/PRN 8724
p:.()
p..j.c:`panel
p..j.xy:530 640

p.Model_Choices:.((`NI_Cashflows;`User_Value;)
  (`NI_EconValue;`Economic_Accounting_Module;)
  (`Stat_LifeReserves;`User_Value;)
  (`Starting_MV;`Investments_Module;)
  (`Starting_BV;`Direct_Input;)
  (`Tax_Model;`Tax_Module;)
  (`NI_TaxableIncome;`Statutory_Accounting_Module;)
  (`Starting_TB;`Statutory_Accounting_Module;)
  (`OIRate;0.35;)
  (`CGRate;0.35;))

p.Model_Choices..j:.((`c;`slot;)
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
   .((`NI_Cashflows;-40;)
     (`NI_EconValue;-40;)
     (`Stat_LifeReserves;-40;)
     (`Starting_MV;-40;)
     (`Tax_Model;-40;)
     (`OIRate;7.4;)
     (`CGRate;7.4;))
   )
  (`g
   .((`OIRate;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};)
     (`CGRate;{:[(r:G.number x) _in 0n,0i,-0i; 0n; 0.|1.&r]};))
   )
  (`u
   .((`OIRate;{:[~y _in (0n;0N);        ("";y)
                   y~0n;                ("Input should be numeric";x)
                   y~0N;                ("Input should be integer-valued";x)]};)
     (`CGRate;{:[~y _in (0n;0N);        ("";y)
                   y~0n;                ("Input should be numeric";x)
                   y~0N;                ("Input should be integer-valued";x)]};))
   )
  (`s
   ,`Stat_LifeReserves
   .()))

  .j.Java {
.j.c`p
}

 if[1~.k[`autoExit]; _exit 0]
}
p..j.close:{_exit 0}
