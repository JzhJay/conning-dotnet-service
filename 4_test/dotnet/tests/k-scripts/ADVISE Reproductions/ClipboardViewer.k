exit:{_exit 0}
cbrr:{{:[*x;"";_n~x 1;"";x 1]}@[.w.cbreadraw;x;:]}

main..j.c:`panel
main..j.l:"Clipboard Viewer"
main..j.xy:700 600
main..j.loc:1000 100
main..j.close:exit
main..j.menu.File.Exit:exit
main..j.menu..j.mnem:+(
                       (,`File     ;`f)
                       (`File`Exit ;`x)
                      )_dv _n

main.split..j.div:300
/main.split..j.c:`panel

main.split.left:.+(`Format`Size;(0#`;0#0))
main.split.left..j.c:`table
main.split.left..j.l:`
main.split.left..j.e[`Format`Size]:0
main.split.left..j.rsel:`s
main.split.left..j.selmode:`r
main.split.left..j.s..j.t:{
 s:main.split.left..j.s
 .u.log "main.split.left..j.s..j.t: ",5:s
 if[0=#s
  main.split.right::""
  :_n
  ]
 i:s[0;1]
 main.split.right::cbrr main.split.left.Format i
}

main.split.right:""
main.split.right..j.c:`text
main.split.right..j.l:`

main.label:""
main.label..j.c:`label
main.label..j.wy:.j.NoExtraSpace
main..j.z: {
 if[1~.k[`autoExit]; exit[]]
}

display_main:{
 update_table[]
 .j.cf `main
 /.u.setTimerEvent[1;`.k.update_table]
}

update_table:{
 s:main.split.left..j.s
 selected: :[s~();_n;s~_n;_n;main.split.left.Format s[0;1]]
 formats:.w.cbformats[]
 sizes:{r:@[.w.cbreadraw;x;:];:[*r;0N;_n~r 1;0I;#r 1]}'formats
 nogood:&sizes=0I
 new:_di[;nogood]'(formats;sizes)
 if[~new~main.split.left[`Format`Size]
  main.label::.u.fmttime _T
  ]
 selected_still_exists:selected _in *new
 main.split.left[`Format`Size]:new
 main.split.right:: :[selected_still_exists;cbrr selected;""]
 main.split.left..j.s:: :[selected_still_exists;,(`Format;new[0]?selected);()]
}

.j.Java display_main;
