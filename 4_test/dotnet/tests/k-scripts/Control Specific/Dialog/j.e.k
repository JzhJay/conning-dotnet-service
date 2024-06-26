p: .()
/We can't put a z attribute on the .j.e messagebox, so create a panel p and measure the time it takes to create p, put up the two
/message boxes, and get p's z attribute.
.j.Java {
  .j.c`p
  .j.E "Example error message\nUsage:  .j.E \"Your Message\""

  .j.e "Initial Message - should be GONE by end"
  .j.e "Final Message - CORRECT final message"
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

