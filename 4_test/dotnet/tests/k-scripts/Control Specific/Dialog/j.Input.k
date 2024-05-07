\l main\j\j

p..j.c: `panel
p..j.l: "Input Dialog Test"
p..j.xy: (300;345)
p..j.close:{_exit 0}
p.label: "Initial Startup"

NUMPCS:: 0

setNumPcs: {
  num: .j.Input[NUMPCS;"Enter a number.\nNumber must be > 0";"Input Dialog Test"]
  if[(1=4:num)&num>0;NUMPCS::num]

  .k.p.label: "Input set to ", $num
}

.j.Java {
  .j.c`p
  setNumPcs[]
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
