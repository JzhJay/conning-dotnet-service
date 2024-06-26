p: .()
p..j.c: `panel
p..j.l: "Spanning 3.k"
/p..j.a: ,(`p1`p2)
p..j.xy: (550;300)

p.progress..j.c:`panel
p.progress..j.l:"`progress:"
p.progress..j.a:(`min`max;`speed`speed)
/p.progress..j.a:(`min`max;`start`stop;`speed`speed)
/;`progressBar`progressBar)
/;`reset`reset;`spacer`spacer;`indeterminate`indeterminate)

p.progress.min:0
p.progress.min..j.c:`scalar

p.progress.max:0
p.progress.max..j.c:`scalar

/p.progress.start:{_n}
/p.progress.start..j.c:`button

/p.progress.stop:{."\\t 0"}
/p.progress.stop..j.c:`button

p.progress.speed..j.c:`panel
/p.progress.speed..j.a:,`slow`slider
p.progress.speed..j.fill:`h
p.progress.speed..j.wy:0.0
p.progress.speed..j.border:0

/p.progress.speed.slow:"Slower"
/p.progress.speed.slow..j.c:`label

p.progress.speed.slider:0
/p.progress.speed.slider..j.c:`check /works
p.progress.speed.slider..j.c:`scalar /fails - too wide
p.progress.speed.slider..j.border:0

/p.progress.speed.fast:"Faster"
/p.progress.speed.fast..j.c:`label

/p.progress.reset:{_n}
/p.progress.reset..j.c:`button

/p.progress.spacer..j.c:`panel
/p.progress.spacer..j.border:0

/p.progress.indeterminate: 0
/p.progress.indeterminate..j.c: `progress
/p.progress.indeterminate..j.l: "indeterminate:"
/p.progress.indeterminate..j.wy:0.0
/p.progress.indeterminate..j.border:1

/p.progress.progressBar: 0
/p.progress.progressBar..j.c: `progress
/p.progress.progressBar..j.min: 0
/p.progress.progressBar..j.max: 100
/p.progress.progressBar..j.wy:0.0
/p.progress.progressBar..j.fill:`h
/p.progress.progressBar..j.border:1

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
