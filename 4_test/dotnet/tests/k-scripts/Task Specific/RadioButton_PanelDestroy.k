\l common/java/net
\l common/os/winnt

.j.TRACE:()

p: .()
p..j.c: `panel
p..j.xy: (300;500)
p..j.loc: (0;100)

p.radioPanel..j.c: `panel
p.radioPanel..j.l: "Radio Buttons"

p.radioPanel.rb1:0
p.radioPanel.rb1..j.c: `radiobutton
p.radioPanel.rb1..j.group: `group1
p.radioPanel.rb1..j.l: "Panel A"

p.radioPanel.rb2:1
p.radioPanel.rb2..j.c: `radiobutton
p.radioPanel.rb2..j.group: `group1
p.radioPanel.rb2..j.l: "Panel B"

radioHandler: {
  if[`. .j.v
    p.resultpanel..j.c::`null
    p.resultpanel.label::$*|.j.v
    p.resultpanel..j.c::`panel
]
}

p.radioPanel.rb1..j.t: radioHandler
p.radioPanel.rb2..j.t: radioHandler

p.resultpanel..j.b: 1
p.resultpanel..j.c:`panel

p.resultpanel.label:"Radio 1"
p.resultpanel.label..j.c:`label

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
