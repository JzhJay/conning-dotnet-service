\l main\j\j

tb:(.((`Run
    {
 .m.S[Who;(`tasker_;)]
 Main.tab.Debug.toolbar[`Run.;`j;`e]:0
 stop_off[]
}
    .,(`j
       .((`e;1;)
         (`c;`button;)
         (`async;2;)
         (`help;"Run";)
         (`image;"Simulate_32.png";)
         (`l;"";))
       ))
   (`New
    {nyi[]}
    .,(`j
       .((`c;`button;)
         (`async;2;)
         (`help;"New";)
         (`image;"New_32.png";)
         (`l;"";))
       ))
   (`Open
    {nyi[]}
    .,(`j
       .((`c;`button;)
         (`async;2;)
         (`help;"Open";)
         (`image;"Open_32.png";)
         (`l;"";))
       ))
   (`Save
    {nyi[]}
    .,(`j
       .((`c;`button;)
         (`async;2;)
         (`help;"Save";)
         (`image;"Save_32.png";)
         (`l;"";))
       ))
   (`Copy
    {if[#Stop;if[#PE;if[(#Stop)>i:Stop[;0]?PE;@[`Stop;_n;{@[x;1 2;:;Stop[i;1 2]]}]]]]}
    .,(`j
       .((`c;`button;)
         (`async;2;)
         (`help;"Copy";)
         (`image;"Copy_32.png";)
         (`l;"";))
       ))
   (`Tree
    1
    .,(`j
       .((`c;`togglebutton;)
         (`async;2;)
         (`help;"Tree";)
         (`image;"Tree_32.png";)
         (`l;"";)
         (`group;`x;)
         (`t;"Tree";))
       ))
   (`Table
    0
    .,(`j
       .((`c;`togglebutton;)
         (`async;2;)
         (`help;"Table";)
         (`image;"Table_32.png";)
         (`l;"";)
         (`group;`x;)
         (`t;"Table";))
       ))
   (`Find
    ""
    .,(`j
       .((`c;`string;)
         (`border;0;)
         (`help;"Find next result matching *?[^-]";)
         (`t;{[f]
 s::[@s:this_step[];-1;*s 1]
 p:(s+1)_.u.paths[*Main.tab.Debug.split.left.Tree;()]
 i:0;do[#p;if[_sm[1_ rfa.dot p i;f];open_tree p:0,p i;sel_node p;tree_step[];:_n];i+:1]
 .j.ok.i"No match found"
};))
       )))
 .,(`j
    .((`a
       `New `Open `Save `Run `Copy `Tree `Table `Tree `Table `Find
       )
      (`anchor;`w;)
      (`border;0;)
      (`wy;0.0;))
    ))

  p: .()
p..j.c: `panel
p..j.l: "Simulation Toolbar"
p..j.loc: (200;50)

p.A: tb[0]
p.A.: tb[1]
p.A..j.border:0
p.A..j.c:`toolbar
.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
