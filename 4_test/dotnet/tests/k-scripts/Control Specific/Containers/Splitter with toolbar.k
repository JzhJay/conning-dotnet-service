p: .()
p..j.c: `panel
p..j.l: "Layout"
p..j.xy: (850;550)

p.split..j.c: `split

p.split.panel.label:" *Notes"
p.split.panel.label..j.anchor:`w
p.split.panel.notesControl.close:{notes_off[]}
p.split.panel.notesControl.close..j.image:"X_to_Close_16.png"
p.split.panel.notesControl.Edit..j.image:"Edit_16.png"
p.split.panel.notesControl.Delete..j.image:"Delete_16.png"
p.split.panel.notesControl.OK..j.image:"save.jpg"
p.split.panel.notesControl.Cancel..j.image:"undo.jpg"
p.split.panel.notesControl.Time..j.image:"valid.jpg"
p.split.panel.notesControl.close..j.help:`"Close Notes panel"
p.split.panel.notesControl.Edit..j.help:`"Edit Note"
p.split.panel.notesControl.Delete..j.help:`"Delete Note"
p.split.panel.notesControl.OK..j.help:`"Save Note changes"
p.split.panel.notesControl.Cancel..j.help:`"Exit without changes"
p.split.panel.notesControl.Time..j.help:`"Add time stamp"
p.split.panel.notesControl[~`close`Edit`Delete`OK`Cancel`Time;`j;`c]:`button
p.split.panel.notesControl[~`close`Edit`Delete`OK`Cancel`Time;`j;`anchor]:`e
p.split.panel.notesControl[~`close`Edit`Delete`OK`Cancel`Time;`j;`l]:6#,""
p.split.panel.notesControl..j.c:`toolbar
p.split.panel.notesControl..j.wx:.j.NoExtraSpace
p.split.panel.notesControl..j.border:0
p.split.panel.notesControl..j.a:,`Edit`Delete`close

p.split.panel..j.c:`panel
p.split.panel..j.a:,`label`notesControl
p.split.panel..j.border:0
p.split.panel..j.wy:.j.NoExtraSpace

p.split.panel2: "Is there anybody out there?"
p.split.panel2..j.c: `text



.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
