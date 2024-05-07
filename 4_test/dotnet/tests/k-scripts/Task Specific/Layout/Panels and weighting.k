p..j.c: `panel
p..j.l: "Panels and weighting"
p..j.xy: (1200;900)
p..j.a: ((`p2`p1`p0)
		 (`p4`p5`p6))


p.p2..j.c: `panel
p.p2..j.l: "Weighting and scrollable textboxes"
p.p2..j.wx: 0.5

p.p2.p1..j.c: `panel
p.p2.p1..j.l: "All panels should be equally sized"
p.p2.p1..j.a: ,`p1`p2`p3

p.p2.p1.p1..j.c: `panel
p.p2.p1.p1..j.l: "First panel"
p.p2.p1.p1.control: "Some text"
p.p2.p1.p1.control..j.c: `text
p.p2.p1.p1.control..j.border: 0

p.p2.p1.p2..j.c: `panel
p.p2.p1.p2..j.l: "Second panel"
p.p2.p1.p2.control: "Some more text"
p.p2.p1.p2.control..j.c: `text
p.p2.p1.p2.control..j.border: 0

p.p2.p1.p3..j.c: `panel
p.p2.p1.p3..j.border: 0
p.p2.p1.p3.control: "Some really long text that used to mess with weighting."
p.p2.p1.p3.control..j.c: `text
p.p2.p1.p3.control..j.border: 1
p.p2.p1.p3.control..j.l: "Third panel"
/p.p2.p1.p3.control..j.scrollable: 0


p.p2.p2..j.c: `panel
p.p2.p2..j.l: "Last panel should take up more room"
p.p2.p2..j.a: ,`p1`p2`p3

p.p2.p2.p1..j.c: `panel
p.p2.p2.p1..j.l: "First panel"
p.p2.p2.p1.control: "Some text"
p.p2.p2.p1.control..j.c: `text
p.p2.p2.p1.control..j.border: 0

p.p2.p2.p2..j.c: `panel
p.p2.p2.p2..j.l: "Second panel"
p.p2.p2.p2.control: "Some more text"
p.p2.p2.p2.control..j.c: `text
p.p2.p2.p2.control..j.border: 0

p.p2.p2.p3..j.c: `panel
p.p2.p2.p3..j.border: 0
p.p2.p2.p3.control: "Some really long text that used to mess with weighting."
p.p2.p2.p3.control..j.c: `text
p.p2.p2.p3.control..j.border: 1
p.p2.p2.p3.control..j.l: "Third panel"
p.p2.p2.p3.control..j.scrollable: 0


p.p1..j.c: `panel
p.p1..j.l: "All panels should be equally sized"
p.p1..j.wx: 0.5

p.p1.p1..j.c: `panel
p.p1.p1..j.l: "First panel"
p.p1.p1.l1: !2
p.p1.p1.l1..j.c: `vector
p.p1.p1.l1..j.border: 1

p.p1.p2..j.c: `panel
p.p1.p2..j.l: "Second panel"
p.p1.p2.l1: !3
p.p1.p2.l1..j.c: `vector
p.p1.p2.l1..j.border: 1

p.p1.p3..j.c: `panel
p.p1.p3..j.l: "Third panel"
p.p1.p3.l1: !10
p.p1.p3.l1..j.c: `vector
p.p1.p3.l1..j.border: 1


p.p0..j.c: `panel
p.p0..j.l: "Last panel isn't scrollable"
p.p0..j.wx: 0.5

p.p0.p1..j.c: `panel
p.p0.p1..j.l: "First panel"
p.p0.p1.l1: !2
p.p0.p1.l1..j.c: `vector
p.p0.p1.l1..j.scrollable: 0
p.p0.p1.l1..j.border: 1

p.p0.p2..j.c: `panel
p.p0.p2..j.l: "Second panel"
p.p0.p2.l1: !3
p.p0.p2.l1..j.c: `vector
p.p0.p2.l1..j.scrollable: 0
p.p0.p2.l1..j.border: 1

p.p0.p3..j.c: `panel
p.p0.p3..j.l: "Third panel"
p.p0.p3.l1: !10
p.p0.p3.l1..j.c: `vector
p.p0.p3.l1..j.scrollable: 0
p.p0.p3.l1..j.border: 1


p.p4..j.c: `panel
p.p4..j.l: "More fun with vectors"
p.p4..j.a: ,`p1`p2`p3

p.p4.p1..j.c: `panel
p.p4.p1..j.l: "Splitter + scrollable vector"
p.p4.p1.split..j.c: `split
p.p4.p1.split..j.dir: `v
p.p4.p1.split.left: !10
p.p4.p1.split.left..j.c: `vector
p.p4.p1.split.left..j.border: 1
p.p4.p1.split.right..j.c: `panel
p.p4.p1.split.right..j.l: "Empty space"

p.p4.p2..j.c: `panel
p.p4.p2..j.l: "Splitter + non-scrollable vector"
p.p4.p2.split..j.c: `split
p.p4.p2.split..j.dir: `v
p.p4.p2.split.left: !10
p.p4.p2.split.left..j.c: `vector
p.p4.p2.split.left..j.scrollable: 0
p.p4.p2.split.right..j.c: `panel
p.p4.p2.split.right..j.l: "Empty space"

p.p4.p3..j.c: `panel
p.p4.p3..j.l: "Should be equally sized"
p.p4.p3.vector..j.c: `vector
p.p4.p3.vector: !10
p.p4.p3.empty..j.c: `panel


p.p5..j.c: `panel
p.p5..j.l: "Tree"
p.p5.tree[`a`b`c`a1`a2`a3`a4`a5`a6`a7`a8`a9`a10;`d`e;`f`g`h]: 0
p.p5.tree..j.border: 0
p.p5.tree..j.scrollable: 1
p.p5.empty..j.c: `panel


p.p6..j.c: `panel
p.p6..j.l: "HTML"
p.p6.html: "<html><body>
<h1 align=\"center\">The html class</h1><hr>
<p>The html class expects HTML in the form of a character vector.</p>
<p>The Java implementation is not complete, but supports a useful
subset of HTML features.</p>
</body></html>"
p.p6.html..j.c: `html
p.p6.empty..j.c: `panel


.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
