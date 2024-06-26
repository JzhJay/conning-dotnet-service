
\l main\j\j
\l main/i/shown
.k.PROGRESS..j.killpids:_n

p: .()
p..j.c: `panel
p..j.close:{_exit 0}
p..j.l: "progress bar busy - prn 8679"
p.btnShowProgress:{showProgress[]}

p.btnSetBusy: {.j.busy[`.k.PROGRESS;1] } /the progress bar cursor should be busy
p.btnSetBusy..j.class:`button
p.btnSetBusy..j.l: ".j.busy[`.k.PROGRESS;1]"
p.btnUnsetBusy: {.j.busy[`.k.PROGRESS;0] } /the progress bar cursor should now not be busy
p.btnUnsetBusy..j.class:`button
p.btnUnsetBusy..j.l: ".j.busy[`.k.PROGRESS;0]"

.j.Java {
  .j.c`p
}
