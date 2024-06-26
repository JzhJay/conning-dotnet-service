p: .()
p..j.c:`panel

p.btnYesNo: { p.lblResult:: $(.j.yesno "Clicking X should result in `No") }
p.btnYesNoCancel: { p.lblResult:: $(.j.yesnocancel "Clicking X should result in `Cancel") }
p.btnMultilineInfo: { p.lblResult::"OK";.j.ok.i "Your licenses expire as follows:\n\n     all\t1/31/2012" }

p.btnYesNo..j.async:2
p.btnYesNoCancel..j.async:2


p.lbl: "Last Result:"
p.lbl..j.c:`label
p.lblResult: "None"
p.lblResult..j.c:`label

p..j.a: (`btnYesNo`btnYesNo
	`btnYesNoCancel`btnYesNoCancel
	`btnMultilineInfo`btnMultilineInfo
	`lbl `lblResult)

.j.c`p


