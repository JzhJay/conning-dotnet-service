panel.digit:0
panel.button:{
  do[10
    .w.usleep 500
    panel.digit+:1]
}
// Enable this line if you want to see the value increment before the 'button' function returns.
// It is disabled as a test to change the way Kui processes graphical change requests.
//panel.button..j.async:1
.j.Java {
  .j.c`panel
}
panel..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
