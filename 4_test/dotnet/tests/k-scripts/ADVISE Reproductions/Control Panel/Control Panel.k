controlPanel: (.((`userTB
    .((`exit
       {askExit.[`j;`loc]:  _(((.j.XY 0)-(askExit.[`j;`xy;0]))%2;((.j.XY 1)-(askExit.[`j;`xy;1]))%2); .j.c`askExit}
       .,(`j
          .((`l;`Exit;)
            (`c;`button;)
            (`image;"Exit_48.png";)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`new
       1
       .,(`j
          .((`popup
             .((`newft;{[a]:[_n~a:tmpl a;exit[];server[0;"main/e/e";"new";(0;*a;)]]};)
               (`newfs;{[a]:[_n~a:simdef a;exit[];server[0;"main/e/e";"new";(0;{.+(`source`target;(x,"\\dfa";(.p`DFA_Drive),("\\"),(-4_ .f.getName@*a),".dfa"))}@*a;)]]};)
               (`blank;{server[0;"main/e/e";"new";(0;"";)]};))
             .,(`j
                .((`async;2;)
                  (`nl
                   ((,`newft
                     ,`newfs
                     ,`blank)
                    `"Definition from Template ..." `"Definition from Simulation ..." `"Blank Definition ...")
                   ))
                ))
            (`l;`New;)
            (`c;`togglebutton;)
            (`image;"New_48.png";)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`edit
       {[a]:[_n~a:def a;exit[];server[0;"main/e/e";"edit";(0;*a;)]]}
       .,(`j
          .((`l;`Edit;)
            (`image;"Edit_48.png";)
            (`c;`button;)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`run
       {[d;a]
 / d is debug flag (boolean)
 / a is _n when called from the toolbar
 / a is (,filename) when called from Run contextual menu item of Windows Explorer
 if[~_n~a;b:,a 0;c:*1_ a]
 if[_n~b:*def b;:exit[]]
 if[~_n~a:checkdef b
  if[*r:.[.grid.ask.nodeHostsAvailable;,_n;:];:.j.e"Cannot connect to grid."]
  if[~#h:r 1;:.j.e"No nodes for this version found on the grid."]
  if[`localhost _in .grid.ask.managersAvailable[];h:,`localhost]
  if[~a.G.server _in h;:nodeerr[".dfs";$a.G.server]]            / Test .dfs node is on grid
  if[~a.G.compiler _in `,h;:nodeerr["Compiler";$a.G.compiler]]  / Test compiler node is on grid
  // Hack around DFS defaulting to "most recent file" when prompting for simulation output directory.
  // Really, this entire function should be in a different process, not inside the main advise app process.
  dv:DFS..j.value
  DFS..j.value::.s.w[{[def;server;dummy](def;server)}[b;a.G.server]]
  c:dfs c
  DFS..j.value::dv
  if[_n~c;:exit[]]
  // End hack.
  if[(~`localhost~a.G.server)|~.p`Standalone_Uses_Network_Disk
    if[~.w.hostmatch[.f.getHost c;a.G.server];:.j.e"Selected DFS folder is not on node ",($a.G.server),"."]
    if[(~`localhost~a.G.server)&_n~.f.getShare c;:.j.e"Selected DFS folder is not on a network filesystem."]]
  server[-1;"main/x/client";"x-client";(c;a;1;0;d;0;0N)]]}[0]
       .,(`j
          .((`l;`Simulate;)
            (`image;"Simulate_48.png";)
            (`c;`button;)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`query
       {
        p[~`tab;`j;`tab]::`Grid_Jobs
        row:++(,`$"Job_",*$1 _draw 0I;0;`Query;`$"Simulation_",*$1 _draw 0I;`Running;0N;`;`;0N;0N;0N;0N;`;`)
        .j.ins.row[`.k.p.tab.Grid_Jobs.table;0;row]
       }
       .,(`j
          .((`nl;"Query";)
            (`l;`Query;)
            (`image;"Query_48.png";)
            (`c;`button;)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`report
       {:[_n~a:sims[_n;-1];exit[];server[1;"main/r/r";"report";(0;"";a)]]}
       .,(`j
          .((`nl;"Report";)
            (`l;`Report;)
            (`image;"Report_48.png";)
            (`c;`button;)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`view
       1
       .,(`j
          .((`popup
             .((`grid;{if[0>.m.O_(`localhost;.p`Grid_Monitor);*server_[.p`Grid_Monitor;1;"main/m/m";"grid";()]]};)
               (`S0;" ";)
               (`log;{[a]:[_n~a:sim[a;-1];exit[];server[1;"main/x/log";"x-log";a]]};)
               (`rview;{[a]:[_n~a:dfr@*a;exit[];server[1;"main/r/v";"rv";,a]]};))
             .,(`j
                .((`async;2;)
                  (`nl
                   ((,`grid
                     ,`log
                     ,`rview)
                    `"Grid Monitor" `"Simulation Log ..." `"Report ...")
                   ))
                ))
            (`l;`View;)
            (`c;`togglebutton;)
            (`image;"View_48.png";)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`batch
       0
       .,(`j
          .((`popup
             .((`brun;{:[_n~a:dfsd[];exit[];_n~b:dfas[];exit[];server[1;"main/b/x";"execute(b)";(0;a;b)]]};)
               (`breport;{:[_n~a:sims[_n;3];exit[];_n~b:dfrs[];exit[];server[1;"main/b/r";"report(b)";(0;a;b)]]};)
               (`bquery;{:[_n~a:sims[_n;3];exit[];_n~b:dfqs[];exit[];server[1;"main/b/q";"query(b)";(0;a;b)]]};)
               (`bqueryx;{:[_n~a:sims[_n;3];exit[];_n~b:dfqs[];exit[];server[1;"main/b/qx";"queryx(b)";(0;a;b)]]};)
               (`S0;" ";)
               (`import;{:[_n~a:csv[];exit[];_n~b:def[];exit[];_n~c:sdef[];exit[];server[1;"main/e/i";"import";(0;*a;*b;*c)]]};))
             .,(`j
                .((`async;2;)
                  (`nl
                   ((,`brun
                     ,`breport
                     ,`bquery
                     ,`bqueryx
                     ,`import)
                    `"Run Simulations ..." `"Report Analytics ..." `"Query Simulations ..." `"Query each Simulation ..." `"Batch Import to Definition ...")
                   ))
                ))
            (`l;`Batch;)
            (`c;`togglebutton;)
            (`image;"Batch_48.png";)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`tools
       0
       .,(`j
          .((`popup
             .((`cdef;{
 if[_n~a:defpm[];:exit[]]
 if[2<#a;.j.ok.i"Select at most two definition files";:exit[]]
 if[1=#a; a:*a; if[_n~b:*defp[];:exit[]]]
 if[2=#a; b:a 1; a:a 0]
 if[a~b;:.j.ok.i"Definitions are identical"]
 cpar[a;b]
 };)
               (`ngexport;{:[_n~a:sim[_n;`unused];exit[];_n~b:csv[];exit[];server[1;"main/q/f";"export";(*a;*b)]]};)
               (`tpt;{:[`No~.j.yesno"Use existing parameterization file?";server[1;"main/opt/tpt_client";"tpt_client";,""]
  _n~a:tpt[];exit[];server[1;"main/opt/tpt_client";"tpt_client";,*a]]};)
               (`prw;{:[`No~.j.yesno"Use existing reweighting file?";server[1;"main/opt/prw_client";"prw_client";,""]
  _n~a:prw[];exit[];server[1;"main/opt/prw_client";"prw_client";,*a]]};)
               (`efa;{:[`No~.j.yesno"Use existing parameterization file?";server[1;"main/opt/efa_client";"efa_client";,""]
  _n~a:efa[];exit[];server[1;"main/opt/efa_client";"efa_client";,*a]]};)
               (`S0;" ";)
               (`relocate;{:[_n~a:*sim[_n;`unused];exit[];server[1;"main/h/relocate";"relocate";,a]]};)
               (`copy;{:[_n~a:*sim[_n;3];exit[];_n~b:*ssim[];exit[];_n~b:vsim b;exit[];server[1;"main/h/c";"copy";(a;b)]]};)
               (`delete;{:[_n~a:sims[_n;-1];exit[];server[1;"main/h/d";"delete";(a;1)]]};)
               (`deletedata;{:[_n~a:sims[_n;-1];exit[];server[1;"main/h/d";"delete";(a;0)]]};)
               (`finish;{:[_n~a:sim[_n;2];exit[];server[-1;"main/x/client";"x-client";(*a;;1;-1;0;0;0N)]]};)
               (`runblock;{:[_n~a:sim[_n;2];exit[];server[-1;"main/x/client";"x-client";(*a;;1;-1;0;0;`runblock)]]};)
               (`S1;" ";)
               (`odbc;{:[_n~a:sim[_n;3];exit[];server[1;"main/odbc/server";"o-server";,a]]};)
               (`S2;" ";)
               (`v4;{:[_n~a:sims[_n;-1];exit[];server[1;"main/h/convert";"convert4";(4;a)]]};)
               (`v3;{:[_n~a:sims[_n;-1];exit[];server[1;"main/h/convert";"convert3";(3;a)]]};))
             .,(`j
                .((`async;2;)
                  (`nl
                   ((,`cdef
                     ,`ngexport
                     ,`tpt
                     ,`prw
                     ,`efa
                     ,`relocate
                     ,`copy
                     ,`delete
                     ,`deletedata
                     ,`finish
                     ,`runblock

                     ,`odbc
                     ,`v4
                     ,`v3)
                    (`"Compare Definitions ...";`"Export Simulation Data ...";`"Target Parameterization ...";`"Path Reweighting ...";`"Efficient Frontier Analysis ...";`"Relocate Simulation Output Blocks ...";`"Copy Simulation ...";`"Delete Simulations ...";`"Delete Simulation Data ...";`"Finish Simulation ...";`"Run Simulation Block ...";;`"Query Simulation via ODBC ...";`"Convert Simulation from V3 to V4 ...";`"Revert Simulation from V4 to V3 ..."))
                   ))
                ))
            (`l;`Tools;)
            (`c;`togglebutton;)
            (`image;"Tools_48.png";)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`settings
       1
       .,(`j
          .((`popup
             .((`profile;{server[1;"main/p/p";"preferences";()]};)
               (`license;{ / panel.userTB.license
  :[(0~#lep)|(_n~lep:.m.G_[`localhost,.a`S;(`PT;,`license)])
    server[1;"main/l/panel";"license settings";()]
    .m.G_[`localhost,*|lep;(`to_top;)]];};))
             .,(`j
                .((`async;2;)
                  (`nl
                   ((,`profile
                     ,`license)
                    `Preferences `"License Settings")
                   ))
                ))
            (`l;`Settings;)
            (`c;`togglebutton;)
            (`image;"Settings_48.png";)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`help
       0
       .,(`j
          .((`popup
             .((`adviseVersion;{_n};)
               (`S0;" ";)
               (`help;{help.d x;exit[]};)
               (`about;{help.a[];exit[]};))
             .,(`j
                .((`async;2;)
                  (`nl
                   ((,`adviseVersion
                     ,`help
                     ,`about)
                    `"ADVISE 5.5.99.99 (41034)" `"ADVISE Help" `"About ADVISE")
                   ))
                ))
            (`l;`Help;)
            (`c;`togglebutton;)
            (`image;"Help_48.png";)
            (`async;2;)
            (`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`msg
       {[d;u;h;p].u.beep[];if[#r:.j.Input["";d;("&0: &1 at &2 &3";.a`A;u;h;p)];.m.S[(h;p);(`msg;(r;_u;_h;_p))]]}
       .,(`j
          .((`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          ))
      (`dfl
       {[file] / import_license
  / Determine license file name.
  :[_n~file;file:.j.Open`.k.DFL;file:*file]

  / If the license settings panel is running (and we are not executing this
  / code inside of it), pass the message on.  The user may have changed the
  / license server setting, and if we're in the control panel process we
  / wouldn't know about it.
  if[~(0~#lep)|(_n~lep:.m.G_[`localhost,.a`S;(`PT;,`"license settings")])
    if[~_p _in lep
      :.m.S[`localhost,*|lep;(`import_license;,,file)]]]

  / Otherwise, process it locally.
  if[~_n~file
    cust:license.list_customers[]
    license.import_dfl file
    if[`Customer _in !.k[`panel;`License;`Features]  / Does the license panel exist?
      / Force a clean panel (all check boxes checked).
      new_cust:license.list_customers[] _dvl cust
      curr_cust:.k[`panel;`License;`Features;`Customer;`combo]
      if[#new_cust;curr_cust:*new_cust]
      lserver:.k[`panel;`License;`Management;`License_Manager;`hostname]
      worker:.k[`panel;`License;`Management;`Node_Type;`choices;`Grid]
      gp[.+(`cust`lserver`worker;(curr_cust;lserver;worker))]]]
}
       .,(`j
          .((`lfg;56087146;)
            (`hpos;`c;)
            (`vpos;`b;))
          )))
    .,(`j
       .((`v;1;)
         (`image;"Tray_Dev_16.png";)
         (`l
          ("&0 Toolbar";`ADVISE)
          )
         (`labelFormat;`prepend;)
         (`async;2;)
         (`dir;`h;)
         (`floatable;1;)
         (`border;0;)
         (`resize;0;)
         (`anchor;`w;)
         (`fill;`n;)
         (`c;`toolbar;)
         (`a
          `new `edit `run `query `report `view `batch `tools `settings `help `exit
          ))
       ))
   (`tab
    .((`My_Simulation_Jobs
       .,(`table
          .((`jobID;();)
            (`Simulation;();)
            (`Status;();)
            (`Phase;();)
            (`Progress;();)
            (`Started;();)
            (`Elapsed;();)
            (`Time_Remaining;();)
            (`Disk_Used;();)
            (`Disk_Needed;();)
            (`Folder;();))
          .,(`j
             .((`c;`table;)
               (`e;0;)
               (`sg;`w;)
               (`font;`"Helvetica 0 12";)
               (`hgrid;0;)
               (`vgrid;0;)
               (`border;0;)
               (`selmode;`r;)
               (`align
                .((`Simulation;`l;)
                  (`Status;`c;)
                  (`Phase;`c;)
                  (`Progress;`c;)
                  (`Started;`l;)
                  (`Elapsed;`l;)
                  (`Time_Remaining;`l;)
                  (`Disk_Used;`l;)
                  (`Disk_Needed;`l;)
                  (`Folder;`l;))
                )
               (`a
                `Simulation `Status `Phase `Progress `Started `Elapsed `Time_Remaining `Disk_Used `Disk_Needed `Folder
                )
               (`f
                .((`Progress;{:[x~0N;"";($x),"%"]};)
                  (`Started;{if[x~0N;:""];d:_ltime x;.r.date.f[*d]," ",formatTime d 1};)
                  (`Elapsed;{if[x _in 0N 0I;:""];1_,/":",/:($_ x%3600;-2#"0",$_ (x%60)!60;-2#"0",$x!60)};)
                  (`Time_Remaining;{if[x _in 0N 0I;:""];1_,/":",/:($_ x%3600;-2#"0",$_ (x%60)!60;-2#"0",$x!60)};)
                  (`Disk_Used;{if[x~0n;:""];($_.5+x%1024*1024)," MB"};)
                  (`Disk_Needed;{if[x~0n;:""];($_.5+x%1024*1024)," MB"};))
                )
               (`kk;{showSimMonitor .[.j.dot .j.v;`jobID,1_.j.i]};))
             ))
       .,(`j
          .,(`c;`panel;)
          ))
      (`Grid_Jobs
       .,(`table
          .((`jobID
             `Control_Panel_S2SHNO_HAW7D0021_0_2011_08_17_16_22_03 `Control_Panel_S2SHNO_HAW7D0021_0_2011_08_17_16_19_47
             )
            (`subscribed
             1 0
             )
            (`Job_Type
             `Control `Control
             )
            (`Simulation
             ` `
             )
            (`Status
             `Running `Failed
             )
            (`Progress
             0N 0N
             )
            (`Submitted_By
             `S2SHNO `S2SHNO
             )
            (`Version
             `"5.5.99.99a" `"5.5.99.99a"
             )
            (`Started
             -737606276 -737606412
             )
            (`Elapsed
             623 144
             )
            (`Time_Remaining
             0I 0
             )
            (`Priority
             0N 0N
             )
            (`Currently_Running_On
             `haw7d0021 `
             )
            (`Folder
             ` `
             ))
          .,(`j
             .((`c;`table;)
               (`e;0;)
               (`sg;`w;)
               (`font;`"Helvetica 0 12";)
               (`hgrid;0;)
               (`vgrid;0;)
               (`border;0;)
               (`selmode;`r;)
               (`popup
                .((`Cancel;{cancelJob[]};)
                  (`Pause;{pauseResumeJob[1]};)
                  (`Resume;{pauseResumeJob[0]};))
                .,(`j
                   .,(`async;2;)
                   ))
               (`align
                .((`Job_Type;`c;)
                  (`Simulation;`l;)
                  (`Status;`c;)
                  (`Progress;`c;)
                  (`Submitted_By;`l;)
                  (`Version;`l;)
                  (`Started;`l;)
                  (`Elapsed;`l;)
                  (`Time_Remaining;`l;)
                  (`Priority;`c;)
                  (`Currently_Running_On;`l;)
                  (`Folder;`l;))
                )
               (`a
                `Job_Type `Simulation `Status `Submitted_By `Version `Started `Elapsed `Time_Remaining `Currently_Running_On `Folder
                )
               (`f
                .((`Progress;{:[x~0N;"";($x),"%"]};)
                  (`Started;{if[x~0N;:""];d:_ltime x;.r.date.f[*d]," ",formatTime d 1};)
                  (`Elapsed;{if[x _in 0N 0I;:""];1_,/":",/:($_ x%3600;-2#"0",$_ (x%60)!60;-2#"0",$x!60)};)
                  (`Time_Remaining;{if[x _in 0N 0I;:""];1_,/":",/:($_ x%3600;-2#"0",$_ (x%60)!60;-2#"0",$x!60)};))
                )
               (`s;();.()))
             ))
       .,(`j
          .,(`c;`panel;)
          ))
      (`Grid_Node_Status
       .((`table
          .((`busyUnits
             ,0
             )
            (`Computer_Name
             ,`haw7d0021.internal.cnngad.com
             )
            (`Resource_Units
             ,4
             )
            (`Unit_Status
             ,`"----"
             )
            (`Zero_Unit_Tasks
             ,1
             )
            (`Total_RAM
             ,1.281705e010
             )
            (`Available_Disk
             ,8.755448e011
             )
            (`Excludes
             ,`
             )
            (`Available_Versions
             ,`"5.5.99.99a"
             )
            (`Current_Users
             ,`S2SHNO
             ))
          .,(`j
             .((`c;`table;)
               (`e
                .((`Computer_Name;0;)
                  (`Unit_Status;0;)
                  (`Zero_Unit_Tasks;0;)
                  (`Total_RAM;0;)
                  (`Available_Disk;0;)
                  (`Excludes;0;)
                  (`Available_Versions;0;)
                  (`Current_Users;0;))
                )
               (`sg;`w;)
               (`font
                .((`Computer_Name;`"Helvetica 0 12";)
                  (`Resource_Units;`"Helvetica 0 12";)
                  (`Zero_Unit_Tasks;`"Helvetica 0 12";)
                  (`Total_RAM;`"Helvetica 0 12";)
                  (`Available_Disk;`"Helvetica 0 12";)
                  (`Excludes;`"Helvetica 0 12";)
                  (`Available_Versions;`"Helvetica 0 12";)
                  (`Current_Users;`"Helvetica 0 12";))
                )
               (`hgrid;0;)
               (`vgrid;0;)
               (`border;0;)
               (`selmode;`r;)
               (`popup
                .,(`Remove_Offline_Host;{removeOfflineHosts[]};)
                .,(`j
                   .,(`async;2;)
                   ))
               (`align
                .((`Computer_Name;`l;)
                  (`Resource_Units;`c;)
                  (`Unit_Status;`l;)
                  (`Zero_Unit_Tasks;`c;)
                  (`Total_RAM;`l;)
                  (`Available_Disk;`l;)
                  (`Excludes;`l;)
                  (`Available_Versions;`l;)
                  (`Current_Users;`l;))
                )
               (`a
                `Computer_Name `Resource_Units `Unit_Status `Zero_Unit_Tasks `Total_RAM `Available_Disk `Available_Versions `Current_Users
                )
               (`f
                .((`Computer_Name;{:[x~.w.fixhost .p`Manager_Host;($x)," (Grid Manager)";$x]};)
                  (`Total_RAM;{if[x~0n;:""];($_.5+x%1024*1024)," MB"};)
                  (`Available_Disk;{if[x~0n;:""];(0.2$x%1024*1024*1024)," GB"};))
                )
               (`u;{[old;units]:[(units<0)|(units>32);old;units]};)
               (`t;{[units]
  hostname:panel.tab.Grid_Node_Status.table[`Computer_Name;.j.i 1]
  .[.grid.tell.hostTotalResourceUnits;(hostname;units);:]
  new:.[.grid.ask.hostTotalResourceUnits;,hostname;:]
  if[~*new
    new:new 1
    if[~new~units
      panel.tab.Grid_Node_Status.table[`Resource_Units;.j.i 1]:new]]
};))
             ))
         (`disk
          "Total disk space available: 815.41 GB"
          .,(`j
             .((`c;`label;)
               (`wy;0.0;)
               (`fill;`n;)
               (`anchor;`e;))
             ))
         (`time
          ""
          .,(`j
             .((`c;`label;)
               (`wy;0.0;)
               (`fill;`n;)
               (`anchor;`e;))
             ))
         (`progress
          0
          .,(`j
             .((`l;"Current Grid Utilization (Offline Nodes and Zero Unit Tasks not included)";)
               (`wy;0.0;))
             )))
       .,(`j
          .,(`c;`panel;)
          ))
      (`Alerts
       .,(`table
          .((`alertID;();)
            (`title;();)
            (`message;();)
            (`Severity;();)
            (`Title;();)
            (`Message;();))
          .,(`j
             .((`c;`table;)
               (`e;0;)
               (`sg;`w;)
               (`font;`"Helvetica 0 12";)
               (`hgrid;0;)
               (`vgrid;0;)
               (`border;0;)
               (`selmode;`r;)
               (`align
                .((`Severity;`c;)
                  (`Title;`l;)
                  (`Message;`l;))
                )
               (`a
                `Severity `Title `Message
                )
               (`f
                .((`Title;{:[0N~x;"";removeHTML panel.tab[`Alerts;`table;`title;panel.tab[`Alerts;`table;`alertID]?x]]};)
                  (`Message;{:[0N~x;"";removeHTML panel.tab[`Alerts;`table;`message;panel.tab[`Alerts;`table;`alertID]?x]]};))
                )
               (`kk;{showAlertPane .[.j.dot .j.v;`alertID,1_.j.i]};))
             ))
       .,(`j
          .((`c;`panel;)
            (`v;0;))
          )))
    .,(`j
       .((`v;1;)
         (`tab;`My_Simulation_Jobs;))
       ))
   (`blank

    .,(`j
       .((`v;0;)
         (`c;`panel;)
         (`wy;1.0;)
         (`border;0;))
       )))
 .((`j
    .((`xy
       728 459
       .())
      (`menu
       .((`File
          .,(`Exit;{panel.userTB.exit[]};)
          )
         (`Definitions
          .((`New_Definition_from_Template_;{panel.userTB.new..j.popup[`newft][]};)
            (`New_Definition_from_Simulation_;{panel.userTB.new..j.popup[`newfs][]};)
            (`New_Blank_Definition_;{panel.userTB.new..j.popup[`blank][]};)
            (`Edit_;{panel.userTB.edit[]};)
            (`Simulate_;{panel.userTB.run[]};))
          )
         (`Simulations
          .((`Query_;{panel.userTB.query[]};)
            (`Report_;{panel.userTB.report[]};))
          )
         (`View
          .((`Grid_Monitor;{panel.userTB.view..j.popup[`grid][]};)
            (`S0;" ";)
            (`Simulation_Log_;{panel.userTB.view..j.popup[`log][]};)
            (`Report_;{panel.userTB.view..j.popup[`rview][]};))
          )
         (`Batch
          .((`Run_Simulations_;{panel.userTB.batch..j.popup[`brun][]};)
            (`Report_Analytics_;{panel.userTB.batch..j.popup[`breport][]};)
            (`Query_Simulations_;{panel.userTB.batch..j.popup[`bquery][]};)
            (`Query_each_Simulation_;{panel.userTB.batch..j.popup[`bqueryx][]};)
            (`S0;" ";)
            (`Batch_Import_to_Definition_;{panel.userTB.batch..j.popup[`import][]};))
          )
         (`Tools
          .((`Compare_Definitions_;{panel.userTB.tools..j.popup[`cdef][]};)
            (`Export_Simulation_Data_;{panel.userTB.tools..j.popup[`ngexport][]};)
            (`Target_Parameterization_;{panel.userTB.tools..j.popup[`tpt][]};)
            (`Path_Reweighting_;{panel.userTB.tools..j.popup[`prw][]};)
            (`Efficient_Frontier_Analysis_;{panel.userTB.tools..j.popup[`efa][]};)
            (`S0;" ";)
            (`Relocate_Simulation_Output_Blocks_;{panel.userTB.tools..j.popup[`relocate][]};)
            (`Copy_Simulation_;{panel.userTB.tools..j.popup[`copy][]};)
            (`Delete_Simulations_;{panel.userTB.tools..j.popup[`delete][]};)
            (`Delete_Simulation_Data_;{panel.userTB.tools..j.popup[`deletedata][]};)
            (`Finish_Simulation_;{panel.userTB.tools..j.popup[`finish][]};)
            (`Run_Simulation_Block_;{panel.userTB.tools..j.popup[`runblock][]};)
            (`S1;" ";)
            (`Query_Simulation_via_ODBC_;{panel.userTB.tools..j.popup[`odbc][]};)
            (`S2;" ";)
            (`Convert_Simulation_from_V3_to_V4_;{panel.userTB.tools..j.popup[`v4][]};)
            (`Revert_Simulation_from_V4_to_V3_;{panel.userTB.tools..j.popup[`v3][]};))
          )
         (`Display
          .((`Toolbar;1;)
            (`Tabs;1;))
          )
         (`Settings
          .((`Preferences;{panel.userTB.settings..j.popup[`profile][]};)
            (`License;{panel.userTB.settings..j.popup[`license][]};))
          )
         (`Help
          .((`adviseVersion;{_n};)
            (`S0;" ";)
            (`ADVISE_Help;{panel.userTB.help..j.popup[`help][]};)
            (`About_ADVISE;{panel.userTB.help..j.popup[`about][]};))
          )
         (`Developer_Functions
          .((`Performance_Analysis_;{:[_n~a:sim[_n;3];exit[];server[1;"main/k/k";"performance";a]]};)
            (`Browse_Simulation_;{:[_n~a:sim[_n;3];exit[];server[1;"main/o/o";"browse";a]]};)
            (`Analyze_Variables_;{:[_n~a:sim[_n;1];exit[];server[1;"main/w/w";"variables";a]]};)
            (`Console_;{:[_n~a:sim[_n;3];exit[];server[1;"main/y/y";"console";(*a;1)]]};)
            (`S0;" ";)
            (`Run_Simulation_with_Debug_;{[d;a]
 / d is debug flag (boolean)
 / a is _n when called from the toolbar
 / a is (,filename) when called from Run contextual menu item of Windows Explorer
 if[~_n~a;b:,a 0;c:*1_ a]
 if[_n~b:*def b;:exit[]]
 if[~_n~a:checkdef b
  if[*r:.[.grid.ask.nodeHostsAvailable;,_n;:];:.j.e"Cannot connect to grid."]
  if[~#h:r 1;:.j.e"No nodes for this version found on the grid."]
  if[`localhost _in .grid.ask.managersAvailable[];h:,`localhost]
  if[~a.G.server _in h;:nodeerr[".dfs";$a.G.server]]            / Test .dfs node is on grid
  if[~a.G.compiler _in `,h;:nodeerr["Compiler";$a.G.compiler]]  / Test compiler node is on grid
  // Hack around DFS defaulting to "most recent file" when prompting for simulation output directory.
  // Really, this entire function should be in a different process, not inside the main advise app process.
  dv:DFS..j.value
  DFS..j.value::.s.w[{[def;server;dummy](def;server)}[b;a.G.server]]
  c:dfs c
  DFS..j.value::dv
  if[_n~c;:exit[]]
  // End hack.
  if[(~`localhost~a.G.server)|~.p`Standalone_Uses_Network_Disk
    if[~.w.hostmatch[.f.getHost c;a.G.server];:.j.e"Selected DFS folder is not on node ",($a.G.server),"."]
    if[(~`localhost~a.G.server)&_n~.f.getShare c;:.j.e"Selected DFS folder is not on a network filesystem."]]
  server[-1;"main/x/client";"x-client";(c;a;1;0;d;0;0N)]]}[1];)
            (`Rerun_Simulation_with_Debug_;{:[_n~a:sim[_n;2];exit[];server[-1;"main/x/client";"x-client";(*a;;1;1;1;0;0N)]]};)
            (`Finish_Simulation_with_Debug_;{:[_n~a:sim[_n;2];exit[];server[-1;"main/x/client";"x-client";(*a;;1;-1;1;0;0N)]]};)
            (`Rerun_Simulation_;{:[_n~a:sim[_n;2];exit[];server[-1;"main/x/client";"x-client";(*a;;1;1;0;0;0N)]]};)
            (`S1;" ";)
            (`Edit_Module_Combination_File_;{:[.p`Grid;grid_err[];_n~a:modules[];exit[];server[1;"main/t/e";"t-editor";a]]};)
            (`Test_Simulations_or_Reports_with_Data_;{:[.p`Grid;grid_err[];_n~a:test[];exit[];server[1;"main/t/c";"t-client (m)";`Rm,a]]};)
            (`Test_Simulations_or_Reports_with_Logic_;{:[.p`Grid;grid_err[];_n~a:test[];exit[];server[1;"main/t/c";"t-client (n)";`Rn,a]]};)
            (`Test_Simulations_or_Reports_with_View_;{:[.p`Grid;grid_err[];_n~a:test[];exit[];server[1;"main/t/c";"t-client (o)";`Ro,a]]};)
            (`S2;" ";)
            (`Compare_Runtime_Definitions_;{:[_n~a:def[];exit[];_n~b:def[];exit[];do[1;if[a~b;:.j.e"Definitions must be distinct"];server[1;"main/c/a";"ca-client";(*a;*b)]]]};)
            (`Compare_Reports_;{:[.p`Grid;grid_err[];_n~a:dfto`Old;exit[];_n~b:dfto`New;exit[];:[a~b;.j.e"Simulations must be distinct";server[1;"main/c/cr";"cr-client";(a;b)]]]};)
            (`S3;" ";)
            (`Generate_Reports_with_Data_;{:[.p`Grid;grid_err[];_n~a:a:sim[_n;3];exit[];_n~b:dfts`Save;exit[];server[-1;"main/c/gr";"gr-client (m)";(`m;a;b)]]};)
            (`Generate_Reports_with_Logic_;{:[.p`Grid;grid_err[];_n~a:a:sim[_n;3];exit[];_n~b:dfts`Save;exit[];server[-1;"main/c/gr";"gr-client (n)";(`n;a;b)]]};)
            (`Generate_Reports_with_View_;{:[.p`Grid;grid_err[];_n~a:a:sim[_n;3];exit[];_n~b:dfts`Save;exit[];server[-1;"main/c/gr";"gr-client (o)";(`o;a;b)]]};)
            (`S4;" ";)
            (`Unit_test_with_Debug_;{:[_n~a:.j.Open`.k.UNIT;exit[];".l"_in!a;server[1;"main/f/f";"unit";,a];.j.e"Unit test directory is empty or malformed"]};)
            (`View_System_Documentation;{server[1;"main/d/v";"vdoc";,""]};)
            (`Edit_System_Documentation;{server[1;"main/d/e";"edoc";,""]};))
          ))
       .,(`j
          .((`nl
             (,`Help `adviseVersion
              ,`"ADVISE 5.5.99.99 (41034)")
             )
            (`t;{
 :[`Display`Toolbar~2#.j.i ;panel.userTB..j.v::`..j.v,.j.i
   `Display`Tabs~2#.j.i    ;panel.blank..j.v::~panel.tab..j.v::`..j.v,.j.i]
 if[~panel.tab..j.v;panel..j.xy[1]:28+86*panel.userTB..j.v]
 if[panel.tab..j.v&290>panel..j.xy 1;panel..j.xy[1]:500-86*~panel.userTB..j.v]
};)
            (`async;2;)
            (`ne;;)
            (`a;;))
          ))
      (`loc
       1159 69
       .())
      (`ontop;0;)
      (`close;{
.s.Run[`saveWinInfo;(`ControlPanel;.h`I;panel.[`j;`loc];panel.[`j;`xy])] / save the location and size of the control panel window
  /close the toolbar and display message to user if they haven't turned off message display
  .k.panel.[`j;`v]: 0 /make it invisible
  if[.p.ControlPanelClosedMsg; userSTIcon.[`j;`traymsg]: (.l.ss("&0 Control Panel closed.";.a`A);.l.ss("Double click here to restore the &0 Control Panel\n(turn off this message in Settings-Preferences-Display).";.a`A);`i)]
  };)
      (`l;`"Control Panel";)
      (`v;1;))
    .,(`t;".j.k[];.j.flush[];";))
   (`t;".j.k[];.j.flush[];";)))

formatTime:{1_,/":",/:2 2 2{(-x)#"0000",y}'$,/0 100 100 _vs/:x}

p: controlPanel[0]
p.: controlPanel[1]
p..j.c: `panel
p..j.close:{_exit 0}
.j.Java{
  .j.c `p
};
p..j.z: {
  if[1~.k[`autoExit];_exit 0]
  }