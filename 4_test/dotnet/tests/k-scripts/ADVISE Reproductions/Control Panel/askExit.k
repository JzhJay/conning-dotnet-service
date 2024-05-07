/ Copyright (c) 2000-2012 Conning Services (Ireland) Limited
/ Josef Sachs, Keith Mason

\l common/k/env

panel.userTB..j.c:`toolbar
panel.userTB.exit:{.j.c`askExit}
panel.userTB.exit..j.l: `Exit
panel.userTB.exit..j.c: `button
panel.userTB.exit..j.image: "Exit_48.png"

/Exit dialog
askExit.Shutdown:{}
askExit.Shutdown..j.image:"Shutdown_64.png"
askExit.Restart:{}
askExit.Restart..j.image:"Restart_64.png"
askExit.Cancel:{.j.d`askExit;}
askExit.Cancel..j.image:"Cancel_64.png"
askExit[.;`j;`c]: `button
askExit[.;`j;`async]: 2
askExit[.;`j;`fill]: `b
askExit[.;`j;`lfg]: 56087146
askExit[.;`j;`halign]: `c
askExit[.;`j;`valign]: `c
askExit..j.a:,`Shutdown`Restart`Cancel
askExit..j.xy:226 102 /size is required even the resize is 0, auto-resize of toolbar isn't supported for modal toolbars
askExit..j.border:0
askExit..j.c: `toolbar
askExit..j.modal: 1
askExit..j.resize: 1
askExit..j.l:`"Exit <appName>"
askExit..j.labelFormat: `"<appName>"
askExit..j.close: askExit.Cancel


ID:-1
spawnDummyJK:{.h.Get[_n;_n;"dummy";"dummy";0;,ID+:1];}

displayGUI: { /displayGUI: display the GUI components as appropriate after java has completely initialized
  .j.c`panel
  t:_T
  spawnDummyJK[]
  `0:,5:86400*_T - t
}

.j.Java{displayGUI[];};
