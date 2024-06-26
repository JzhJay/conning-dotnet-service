p..j.c:`panel

p.disk:"label text"
p.disk..j.c:`label
p.disk..j.wy:0.0
p.disk..j.fill:`n
p.disk..j.anchor:`e
p.time:""
p.time..j.c:`label
p.time..j.wy:0.0
p.time..j.fill:`n
p.time..j.anchor:`e

p.label:{
  p.disk:: :[p.disk~"label text";"more label text";"label text"]
  p.time::""
}
p.label..j.c:`button
p.label..j.l:"Change labels"
p.label..j.fill:`n
p.label..j.anchor:`s

t:0
p.timer:{
  t::~t
  ."\\t ",$t
}
p.timer..j.c:`button
p.timer..j.l:"Start / stop timer"
p.timer..j.fill:`n

.t..t:"`.k\".k.timer[]\""
timer:{p.time::5:_ltime _t}

.j.c`p