i:1
panel.outerTabGroup..j[`c`l`border]: (`tab;`"Outer Tab Group"; 1)
panel.outerTabGroup.innerTabGroup..j[`c`l]: (`tab;`"Inner Tab Group")
panel.outerTabGroup.innerTabGroup.vectorTab0: ,0
panel.outerTabGroup.innerTabGroup.vectorTab0..j.l: `"Vector in a Tab 0"
panel.outerTabGroup.panel: _n
panel.outerTabGroup.panel..j.l: `"Panel in a Tab"

panel.button: {
  I:`$"vectorTab",$i
  panel.outerTabGroup.innerTabGroup[I]:!1+i!5
  panel.outerTabGroup.innerTabGroup[~I;`j;`l]:`$"Vector in a Tab ",$i
  panel.outerTabGroup.innerTabGroup..j.tab::I
  i+:1
}

panel.button..j.async: 2
panel.button..j.l: `"Add a Vector Tab"

.j.Java {
  .j.c`panel
}
panel..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
