/Exit dialog from ADVISE
exit: {_exit 0}
.j.Java {
  .j.c`askExit
}


askExit.Shutdown: {}
askExit.Shutdown..j.image:"Shutdown_64.png"
askExit.Restart: {}
askExit.Restart..j.image:"Restart_64.png"
askExit.Cancel: exit
askExit.Cancel..j.image:"Cancel_64.png"
askExit[.;`j;`c]: `button
askExit[.;`j;`async]: 2
askExit[.;`j;`fill]: `b
askExit[.;`j;`lfg]: 56087146
askExit[.;`j;`halign]: `c
askExit[.;`j;`valign]: `c
askExit..j.a:,`Shutdown`Restart`Cancel
/askExit..j.xy:226 102 /size is required even the resize is 0, auto-resize of toolbar isn't supported for modal toolbars
askExit..j.xy:326 150
askExit..j.border:0
askExit..j.c: `toolbar
askExit..j.modal: 1
askExit..j.resize: 0
askExit..j.l:`"Exit <appName>"
askExit..j.labelFormat: `"<appName>"
askExit..j.close: exit

askExit..j.z: {if[1~.k[`autoExit]; exit[]]}

