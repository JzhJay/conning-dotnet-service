p: .()
p..j.c: `panel
p..j.l: "Layout - Fill `h with tiny tiny large"
p..j.xy: (850;450)

/ Fill `h and wy settings based on Definition tab in Preferences pane.

p..j.a: ,(`top1`top2`top3)

p.top1..j.c: `panel
p.top1..j.l: "Panel with fill `h, wy 0.01 0.01 100.0"
p.top1.control1: 0
p.top1.control1..j.c: `combo
p.top1.control1..j.o: (0;1;2;3)
p.top1.control1..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.top1.control1..j.wx: 1.0
p.top1.control1..j.wy: 0.01
p.top1.control1..j.fill: `h
p.top1.control2: 0
p.top1.control2..j.c: `combo
p.top1.control2..j.o: (0;1;2;3)
p.top1.control2..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.top1.control2..j.wx: 1.0
p.top1.control2..j.wy: 0.01
p.top1.control2..j.fill: `h
p.top1.control3: 0
p.top1.control3..j.c: `combo
p.top1.control3..j.o: (0;1;2;3)
p.top1.control3..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.top1.control3..j.wx: 1.0
p.top1.control3..j.wy: 100.0
p.top1.control3..j.fill: `h

p.top2..j.c: `panel
p.top2..j.l: "Tab with fill `h, wy 0.01 0.01 100.0"
p.top2.tab.p..j.c:`panel
p.top2.tab.p..j.l: "not me"
p.top2.tab.panel..j.l: "me"
p.top2.tab.panel.control1: 0
p.top2.tab.panel.control1..j.c: `combo
p.top2.tab.panel.control1..j.o: (0;1;2;3)
p.top2.tab.panel.control1..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.top2.tab.panel.control1..j.wx: 1.0
p.top2.tab.panel.control1..j.wy: 0.01
p.top2.tab.panel.control1..j.fill: `h
p.top2.tab.panel.control2: 0
p.top2.tab.panel.control2..j.c: `combo
p.top2.tab.panel.control2..j.o: (0;1;2;3)
p.top2.tab.panel.control2..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.top2.tab.panel.control2..j.wx: 1.0
p.top2.tab.panel.control2..j.wy: 0.01
p.top2.tab.panel.control2..j.fill: `h
p.top2.tab.panel.control3: 0
p.top2.tab.panel.control3..j.c: `combo
p.top2.tab.panel.control3..j.o: (0;1;2;3)
p.top2.tab.panel.control3..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.top2.tab.panel.control3..j.wx: 1.0
p.top2.tab.panel.control3..j.wy: 100.0
p.top2.tab.panel.control3..j.fill: `h

p.top3..j.c: `panel
p.top3..j.l: "Split with fill`h, wy 0.01 0.01 100.0"
p.top3.split..j.c: `split
p.top3.split..j.dir: `v
p.top3.split.left..j.c: `panel
p.top3.split.left.control1: 0
p.top3.split.left.control1..j.c: `combo
p.top3.split.left.control1..j.o: (0;1;2;3)
p.top3.split.left.control1..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.top3.split.left.control1..j.wx: 1.0
p.top3.split.left.control1..j.wy: 0.01
p.top3.split.left.control1..j.fill: `h
p.top3.split.left.control2: 0
p.top3.split.left.control2..j.c: `combo
p.top3.split.left.control2..j.o: (0;1;2;3)
p.top3.split.left.control2..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.top3.split.left.control2..j.wx: 1.0
p.top3.split.left.control2..j.wy: 0.01
p.top3.split.left.control2..j.fill: `h
p.top3.split.left.control3: 0
p.top3.split.left.control3..j.c: `combo
p.top3.split.left.control3..j.o: (0;1;2;3)
p.top3.split.left.control3..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.top3.split.left.control3..j.wx: 1.0
p.top3.split.left.control3..j.wy: 100.0
p.top3.split.left.control3..j.fill: `h
p.top3.split.right.text: "textbox"
p.top3.split.right..j.c: `panel

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
