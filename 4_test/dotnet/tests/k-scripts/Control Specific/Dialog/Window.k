p..j.c: `panel
p..j.l: "Window"
p..j.a: ,`p1`p2


p.p1..j.c: `panel
p.p1..j.l: "Buttons should be visible at bottom"
p.p1.window..j.c: `window
p.p1.window..j.border: 0
p.p1.window.b1: {_n}
p.p1.window.b2: {_n}
p.p1.window.b3: {_n}
p.p1.window.b4: {_n}
p.p1.window.b5: {_n}
p.p1.window.b6: {_n}
p.p1.window.b7: {_n}
p.p1.window.b8: {_n}
p.p1.window.b9: {_n}
p.p1.window.b10: {_n}
p.p1.window.b11: {_n}
p.p1.window.b12: {_n}
p.p1.window.b13: {_n}
p.p1.window.b14: {_n}
p.p1.window.b15: {_n}
p.p1.window.b16: {_n}
p.p1.window.b17: {_n}
p.p1.window.b18: {_n}
p.p1.window.b19: {_n}
p.p1.window.b20: {_n}

p.p1.p..j.c: `panel
p.p1.p..j.wy: .j.NoExtraSpace
p.p1.p..j.fill: `h
p.p1.p..j.border: 0
p.p1.p..j.l: "Buttons span two rows"
p.p1.p..j.a: (`btn`btn2;`btn`btn2)
p.p1.p.btn: {_n}
p.p1.p.btn..j.fill: `n
p.p1.p.btn2: {_n}
p.p1.p.btn2..j.fill: `n


p.p2..j.c: `panel
p.p2..j.l: "Panels should be split in half"
p.p2.window..j.c: `window
p.p2.window..j.border: 0
p.p2.window.b1: {_n}
p.p2.window.b2: {_n}
p.p2.window.b3: {_n}
p.p2.window.b4: {_n}
p.p2.window.b5: {_n}
p.p2.window.b6: {_n}
p.p2.window.b7: {_n}
p.p2.window.b8: {_n}
p.p2.window.b9: {_n}
p.p2.window.b10: {_n}
p.p2.window.b11: {_n}
p.p2.window.b12: {_n}
p.p2.window.b13: {_n}
p.p2.window.b14: {_n}
p.p2.window.b15: {_n}
p.p2.window.b16: {_n}
p.p2.window.b17: {_n}
p.p2.window.b18: {_n}
p.p2.window.b19: {_n}
p.p2.window.b20: {_n}


p.p2.p..j.c: `panel
p.p2.p..j.fill: `h
p.p2.p..j.border: 0
p.p2.p..j.l: "Buttons span two rows"
p.p2.p..j.a: (`btn`btn2;`btn`btn2)
p.p2.p.btn: {_n}
p.p2.p.btn..j.fill: `n
p.p2.p.btn2: {_n}
p.p2.p.btn2..j.fill: `n


.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
