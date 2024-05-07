p: .()
p..j.c: `panel
p..j.l: "Layout Fill - control can fill"
p..j.xy: (850;950)

p..j.a: ((`top_1`top_2`top_3`top_4)
		 (`bottom_1`bottom_2`bottom_3`bottom_4)
		 (`default_)
		 (`top1`top2`top3`top4)
		 (`bottom1`bottom2`bottom3`bottom4)
		 (`default))


/ `button, `text, `string, `panel, `progress all behave the same
/ So do `combo, `table can all fill in Java, but not currently in .net

p.top_1..j.c: `panel
p.top_1..j.l: "Fill, 0 0"
p.top_1.control: !2
p.top_1.control..j.c: `vector
p.top_1.control..j.border: 1
p.top_1.control..j.wx: 0.0
p.top_1.control..j.wy: 0.0
p.top_1.control..j.fill: `b

p.top_2..j.c: `panel
p.top_2..j.l: "Fill, NoExtraSpace 0"
p.top_2.control: !2
p.top_2.control..j.c: `vector
p.top_2.control..j.border: 1
p.top_2.control..j.wx: .j.NoExtraSpace
p.top_2.control..j.wy: 0.0
p.top_2.control..j.fill: `b

p.top_3..j.c: `panel
p.top_3..j.l: "Fill, 0 NoExtraSpace"
p.top_3.control: !2
p.top_3.control..j.c: `vector
p.top_3.control..j.border: 1
p.top_3.control..j.wx: 0.0
p.top_3.control..j.wy: .j.NoExtraSpace
p.top_3.control..j.fill: `b

p.top_4..j.c: `panel
p.top_4..j.l: "Fill, 1 1"
p.top_4.control: !2
p.top_4.control..j.c: `vector
p.top_4.control..j.border: 1
p.top_4.control..j.wx: 1.0
p.top_4.control..j.wy: 1.0
p.top_4.control..j.fill: `b


p.bottom_1..j.c: `panel
p.bottom_1..j.l: "No fill, 0 0"
p.bottom_1.control: !2
p.bottom_1.control..j.c: `vector
p.bottom_1.control..j.border: 1
p.bottom_1.control..j.wx: 0.0
p.bottom_1.control..j.wy: 0.0
p.bottom_1.control..j.fill: `n

p.bottom_2..j.c: `panel
p.bottom_2..j.l: "No fill, NoExtraSpace 0"
p.bottom_2.control: !2
p.bottom_2.control..j.c: `vector
p.bottom_2.control..j.border: 1
p.bottom_2.control..j.wx: .j.NoExtraSpace
p.bottom_2.control..j.wy: 0.0
p.bottom_2.control..j.fill: `n

p.bottom_3..j.c: `panel
p.bottom_3..j.l: "No fill, 0 NoExtraSpace"
p.bottom_3.control: !2
p.bottom_3.control..j.c: `vector
p.bottom_3.control..j.border: 1
p.bottom_3.control..j.wx: 0.0
p.bottom_3.control..j.wy: .j.NoExtraSpace
p.bottom_3.control..j.fill: `n

p.bottom_4..j.c: `panel
p.bottom_4..j.l: "No fill, 1 1"
p.bottom_4.control: !2
p.bottom_4.control..j.c: `vector
p.bottom_4.control..j.border: 1
p.bottom_4.control..j.wx: 1.0
p.bottom_4.control..j.wy: 1.0
p.bottom_4.control..j.fill: `n


p.default_..j.c: `panel
p.default_..j.l: "Default with border"

/p.default_.control: {_n}
/p.default_.control..j.c: `button

/p.default_.control: "text"
/p.default_.control..j.c: `text

/p.default_.control..j.c: `panel

/p.default_.control: "string"
/p.default_.control..j.c: `string

/p.default_.control: 0
/p.default_.control..j.c: `combo
/p.default_.control..j.o: (0;1;2;3)
/p.default_.control..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)

p.default_.control: !2
p.default_.control..j.c: `vector
p.default_.control..j.border: 1




p.top1..j.c: `panel
p.top1..j.l: "Fill, 0 0"
p.top1.control: !2
p.top1.control..j.c: `vector
p.top1.control..j.border: 0
p.top1.control..j.wx: 0.0
p.top1.control..j.wy: 0.0
p.top1.control..j.fill: `b

p.top2..j.c: `panel
p.top2..j.l: "Fill, NoExtraSpace 0"
p.top2.control: !2
p.top2.control..j.c: `vector
p.top2.control..j.border: 0
p.top2.control..j.wx: .j.NoExtraSpace
p.top2.control..j.wy: 0.0
p.top2.control..j.fill: `b

p.top3..j.c: `panel
p.top3..j.l: "Fill, 0 NoExtraSpace"
p.top3.control: !2
p.top3.control..j.c: `vector
p.top3.control..j.border: 0
p.top3.control..j.wx: 0.0
p.top3.control..j.wy: .j.NoExtraSpace
p.top3.control..j.fill: `b

p.top4..j.c: `panel
p.top4..j.l: "Fill, 1 1"
p.top4.control: !2
p.top4.control..j.c: `vector
p.top4.control..j.border: 0
p.top4.control..j.wx: 1.0
p.top4.control..j.wy: 1.0
p.top4.control..j.fill: `b


p.bottom1..j.c: `panel
p.bottom1..j.l: "No fill, 0 0"
p.bottom1.control: !2
p.bottom1.control..j.c: `vector
p.bottom1.control..j.border: 0
p.bottom1.control..j.wx: 0.0
p.bottom1.control..j.wy: 0.0
p.bottom1.control..j.fill: `n

p.bottom2..j.c: `panel
p.bottom2..j.l: "No fill, NoExtraSpace 0"
p.bottom2.control: !2
p.bottom2.control..j.c: `vector
p.bottom2.control..j.border: 0
p.bottom2.control..j.wx: .j.NoExtraSpace
p.bottom2.control..j.wy: 0.0
p.bottom2.control..j.fill: `n

p.bottom3..j.c: `panel
p.bottom3..j.l: "No fill, 0 NoExtraSpace"
p.bottom3.control: !2
p.bottom3.control..j.c: `vector
p.bottom3.control..j.border: 0
p.bottom3.control..j.wx: 0.0
p.bottom3.control..j.wy: .j.NoExtraSpace
p.bottom3.control..j.fill: `n

p.bottom4..j.c: `panel
p.bottom4..j.l: "No fill, 1 1"
p.bottom4.control: !2
p.bottom4.control..j.c: `vector
p.bottom4.control..j.border: 0
p.bottom4.control..j.wx: 1.0
p.bottom4.control..j.wy: 1.0
p.bottom4.control..j.fill: `n


p.default..j.c: `panel
p.default..j.l: "Default without border"

/p.default.control: {_n}
/p.default.control..j.c: `button

/p.default.control: "text"
/p.default.control..j.c: `text

/p.default.control..j.c: `panel

/p.default.control: "string"
/p.default.control..j.c: `string

/p.default.control: 0
/p.default.control..j.c: `combo
/p.default.control..j.o: (0;1;2;3)
/p.default.control..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)

p.default.control: !2
p.default.control..j.c: `vector
p.default.control..j.border: 0


.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
