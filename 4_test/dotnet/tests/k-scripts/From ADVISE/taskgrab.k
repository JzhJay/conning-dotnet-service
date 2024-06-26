\l common/java/j
\l common/c/win
\l common/winnt/winnt

winlist:()
ecp:{[w;u] / EnumWindowsProc
  .c.GetWindowText[w;t:100#"";100]
  winlist,:,(w;(t?"\0")#t)
  1}
ecf:.c.create_callback[ecp;2;0]
ecw:{[w]
  winlist::()
  .c.EnumChildWindows[w;ecf;0]
  wl:winlist
  winlist::()
  wl}

timer:{
  pw:.c.FindWindow[_n;".k.panel"]
  if[0~pw;:_n]
  ."\\t 0"
  
  if[~win:.c.FindWindow[_n;"Windows Task Manager"]
    .w.exec[`open;_getenv[`SystemRoot],"\\SYSTEM32\\TASKMGR.EXE";_n;_n;`minimize;`task_mgr]]
  t:.t
  while[(~win)&(.t<t+20)
    win:.c.FindWindow[_n;"Windows Task Manager"]]
  if[~win
    '"No Task Manager"]
  
  .c.SetParent[win;pw]
  .c.ShowWindow[win;.c.SW_SHOWNORMAL]
  .c.SetWindowPos[win;.c.HWND_TOP;1;1;0;0;.c.SWP_NOSIZE]
}

panel:_n
panel..j.xy:450 580
.j.c`panel
.t..t:".k.timer[]"
\t 1

