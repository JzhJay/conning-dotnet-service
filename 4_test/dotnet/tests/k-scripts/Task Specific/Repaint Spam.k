n:100

panel.p..j[`c`l]:(`panel;"Length of Vector:")


panel.p.slider:n
panel.p.slider..j[`border`min`max]: (0;10;1000)
panel.p.slider..j.t:{panel.p.string::$panel.p.slider}
panel.p.string:$n
panel.p.string..j[`e`border]:(0;0)

panel.v:!n
panel..j.border: 0

panel.btnSpam:{n:panel.p.slider;panel.v::n#0;{panel.v[x]:*1 _draw n}'!n}
panel.btnSpam..j[`c`l`fill`anchor]: (`button;"Spam me!";`n;`c)

panel.p[~`slider`string;`j;`insets]:2#,5 5 5 5

panel.p..j.wy:0.0

panel..j.l: "Repaint Test"
panel..j.insets: 5 5 5 5
panel..j.a:	(`p`btnSpam
 		 `v`v)

panel..j.xy:400;600
.j.Java {
  .j.c`panel
}
panel..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
