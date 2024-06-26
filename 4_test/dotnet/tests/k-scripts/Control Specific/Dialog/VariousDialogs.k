p..j.c: `panel

p.dialogWithTab: {.j.ok.i "This\thas\t\ttab\t\t\tcharacters"}
p.dialogWithTab..j.l:`".j.e with tab characters"

DFA..j.value:.s.r
DFA..j.filter:`dfa
DFA..j.filetype:`f
DFA..j.multiple:1
DFA..j.fileimage.dfa:`dfa.jpg
DFA..j.l:`"Select Definition File:"
DFA..j.t:.s.t

DFS..j.value:.s.r
DFS..j.filetype:`f
DFS..j.ntfilter:`.dfs
DFS..j.ndfilter:`.dfw
DFS..j.filter:`dfs
DFS..j.fileimage.dfs:`dfs.jpg
DFS..j.l:`"Select Simulation:"
DFS..j.t:.s.t
DFS..j.okbuttonlabel: `"\&Select a simulation"

p.btn1: { p.output:: $(.j.Open`$($_d),".DFS")}
p.btn1..j.async: 1
p.btn1..j.l: "Open Simulation"

p.btn2: {p.output:: $(.j.Open`$($_d),".DFA")}
p.btn2..j.async: 1
p.btn2..j.l: "Open Definition"

p.btn3: {p.output:: $(.j.Save`$($_d),".DFS")}
p.btn3..j.async: 1
p.btn3..j.l: "Save Simulation"

DFZ:(.f.getCurrentRoot[];)
DFZ..j.filetype: `f
DFZ..j.multiple: 1
DFZ..j.filter: `dfz`txt
DFZ..j.filterdesc: "Shiver me timbers"
DFZ..j.fileimage.dfz: `dfzdoc.jpg
DFZ..j.l: "Play"


p.btn4: {
	.j.Open `.k.DFZ
}

p.btn4..j.async: 1
p.btn4..j.l: "Select DFZ"

DFF:(.f.getCurrentRoot[];)
DFF..j.value:.s.r
DFF..j.filetype:`f
DFF..j.ntfilter:`.dff
DFF..j.filter:`dff
DFF..j.fileimage.dfm:`dfs.jpg
DFF..j.l:`"Select DFF:"
DFF..j.t:.s.t

p.btn5: {p.output:: *$(.j.Open`$($_d),".DFF")}
p.btn5..j.async: 1
p.btn5..j.l: "Open DFF Directory"

DFF:(.f.getCurrentRoot[];)
DFF..j.value:.s.r
DFF..j.filetype:`f
DFF..j.ntfilter:`.dff
DFF..j.filter:`dff
DFF..j.fileimage.dfm:`dfs.jpg
DFF..j.l:`"Select DFF:"
DFF..j.t:.s.t
p.btn6: {p.output:: $(.j.Open`$($_d),".DFF")}
p.btn6..j.async: 1
p.btn6..j.l: "Open Multiple Files - preset"

p.btn5: {p.output:: $(.j.Open`$($_d),".DFF")}
p.btn5..j.async: 1
p.btn5..j.l: "Open DFF Directory"


p.inputButton:{p.output::.j.Input["dummy text";"Enter some text";"Input Title"]}
p.inputButton..j.async: 1
p.inputButton..j.l: "Show `input dialog"

p.btnYesNo: { p.output:: $(.j.yesno "Clicking X should result in `No") }
p.btnYesNoCancel1: { p.output:: $(.j.yesnocancel "Clicking X should result in `Cancel") }
p.btnYesNoCancel2: { p.output:: $(.j.yesnocancel "Truncated?") }
p.btnMultilineInfo: { p.output::"OK";.j.ok.i "Your licenses expire as follows:\n\n     all\t1/31/2012" }

p.btnYesNo..j.async:2
p.btnYesNoCancel1..j.async:2
p.btnYesNoCancel2..j.async:2

p.output..j.l: "Last Result:"
p.output..j.e: 0

/p.output..j.c: `text

DFSD..j.value:.s.r
DFSD..j.filetype:`d
DFSD..j.t:.s.t

/DirectoryChooser:(.f.getCurrentRoot[];)
/DirectoryChooser..j.value:.s.r
/DirectoryChooser..j.filetype:`d
/DirectoryChooser..j.type:`Select
p.btnSelectDirectory: {p.output:: $(.j.Open`$($_d),".DFSD")}
p.btnSelectDirectory..j.async: 2
p.btnSelectDirectory..j.l: "Select Directory"


p..j.a:(`dialogWithTab
				`btnSelectDirectory
				`btn1
				`btn2
				`btn3
				`btn4
				`btn5
				`inputButton
				`btnYesNo
				`btnYesNoCancel1
				`btnYesNoCancel2
				`btnMultilineInfo
				`DFF
				`output
				`output
				`output)

// Style our controls
p[~!`p;`j;`anchor`fill]:  (#!p)#,`c`b
// Something to do with searching for a given type
/(!p)@&`panel=p[~!p;`j;`c]

.j.Java {
  .j.c`p
  /.k.p.btn1[]
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
