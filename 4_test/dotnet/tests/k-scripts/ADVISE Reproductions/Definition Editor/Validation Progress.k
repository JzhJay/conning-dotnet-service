\l main/i/shown

// Vertical autosize, but leave horizontal fixed.
PROGRESS..j.autosize:0 1

// Make backup copy of progress panel.
orig_PROGRESS:PROGRESS
orig_PROGRESSj:PROGRESS..j

// Read in data.
home:-5 _ .f.splitPath _v
progress:2:.f.makePath_ (-1_ home),("K Scripts";"ADVISE Reproductions";"Definition Editor";"Validation Progress")

// Controller panel.
panel..j.l:"Progress controller"
panel.counter:1
panel.counter..t:"`.k\"display[]\""
panel.label:" of ",($#progress)
panel.Previous:{previous[]}
panel.Next:{next[]}
panel.Reset:{panel[`counter]::1}
panel.Start:{.t..t:"`.k\"panel.Next[]\"";."\\t 0.05"}
panel.Stop:{."\\t 0"}
panel..j.a:(`counter`label;`Previous`Previous;`Next`Next;`Reset`Reset;`Start`Start;`Stop`Stop)
panel..j.xy:(400;183)

// Go to next message in progress panel.
next:{
  panel[`counter]+:1
}
previous:{
  panel[`counter]-:1
}
old_counter:-1
display:{
  counter:-1+panel`counter
  if[~counter<#progress
    counter:-1+panel[`counter]::1]
  if[~counter>old_counter
    reset[]]
  while[old_counter<counter
    old_counter+:1
    item:progress old_counter
    item[0] . item[1]]
}

// Reset progress panel to original state.
reset:{
    hideProgress[]
    PROGRESS::orig_PROGRESS
    PROGRESS..j[!orig_PROGRESSj]::orig_PROGRESSj[]
    old_counter::-1
}

.j.c`panel
panel[`counter]::1
