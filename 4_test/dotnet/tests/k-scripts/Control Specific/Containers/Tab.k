\l main\j\j

p: .()
p..j.c: `panel
p..j.xy: 400 500
p..j.sloc: 200 200
p..j.close:{_exit 0}

p.tab.Tab1:.()
p.tab.Tab2:.()
p.tab.Tab2..j.l: `"Label on Tab2"
p.tab.Tab3:.()
p.tab.Tab1.Data11: "111 Subtab1 - Tab1" /Subtab 1 of Tab1
p.tab.Tab1.Data21: "222 Subtab2 - Tab1" /Subtab 2 of Tab1
p.tab.Tab1.Data31: "333 Subtab3 - Tab1" /Subtab 3 of Tab1
p.tab.Tab2: "Tab2 has a label"
p.tab.Tab3: "Tab3 doesn't have a label"
p.tab.Tab4: "Has two ampersands"
p.tab.Tab4..j.l: "foo&&bar"
p.tab.Tab5: "Has ampersand"
p.tab.Tab5..j.l: "foo&bar"
.j.Java {
  .j.c`p
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

