panel: .()
panel..j.c: `panel
panel..j.l: "Create/Destroy Behavior"

childPanel: .()
childPanel..j.c: `panel
childPanel..j.l: "Panel"
childPanel.label: "A label"

panel.createButton:{.j.c`childPanel}
panel.createButton..j.l: "Create Panel"
/panel.createButton..j.wy: 0.0
panel.destroyButton:{.j.d`childPanel}
panel.destroyButton..j.l: "Destroy Panel"
/panel.destroyButton..j.wy: 0.0

.j.Java {
  .j.c`panel
}
panel..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
