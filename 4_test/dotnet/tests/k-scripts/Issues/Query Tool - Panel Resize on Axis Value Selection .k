p: .()
p..j.c: `panel
p..j.xy: (280;265)
p..j.l:`"Tab Test"

p.tab.Tab1:.()
p.tab.Tab2:.()
p.tab.Tab1..j.l: `"Label on Tab1"
p.tab.Tab2..j.l: `"Label on Tab2"
p.tab.Tab1: "Tab1 content"
p.tab.Tab2: "Tab2 content"

/tab test Button
p.ttb..j.l: `"Tab Test Button"
p.ttb..j.c: `button
p.ttb: {p[`tab.;`j;`tab]: :[p[`tab.;`j;`tab]~`Tab1; `Tab2; `Tab1]}

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
