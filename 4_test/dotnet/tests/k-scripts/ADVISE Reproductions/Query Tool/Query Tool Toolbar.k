panel.toolbar: .((`Compare_Simulations
    {

}
    .,(`j
       .((`async;2;)
         (`image;"Compare_32.png";)
         (`help;"Compare Simulations";)
         (`l;"<html><center>Compare<br>Simulations</center></html>";)
         (`hpos;`r;)
         (`vpos;`c;)
         (`e;0;)
         (`h;20;)
         (`font;`"Courier 0 14";)
         (`lfont;`"Dialog 0 12";))
       ))
   (`New
    {

}
    .,(`j
       .((`async;2;)
         (`image;"New_32.png";)
         (`help;"New Query";)
         (`l;"";)
         (`h;20;)
         (`font;`"Courier 0 14";)
         (`lfont;`"Dialog 0 12";))
       ))
   (`Open
    {

}
    .,(`j
       .((`async;2;)
         (`image;"Open_32.png";)
         (`help;"Open Query";)
         (`l;"";)
         (`h;20;)
         (`font;`"Courier 0 14";)
         (`lfont;`"Dialog 0 12";))
       ))
   (`Save
    {}
    .,(`j
       .((`async;2;)
         (`image;"Save_32.png";)
         (`help;"Save Query";)
         (`l;"";)
         (`h;20;)
         (`font;`"Courier 0 14";)
         (`lfont;`"Dialog 0 12";))
       ))
   (`Or
    {
}
    .,(`j
       .((`async;2;)
         (`image;"Add_Or_Clause.png";)
         (`help;"Add Or Clause";)
         (`l;"<html><center>Add<br>Or</center></html>";)
         (`hpos;`r;)
         (`vpos;`c;)
         (`h;20;)
         (`font;`"Courier 0 14";)
         (`lfont;`"Dialog 0 12";))
       ))
   (`Or_
    {

}
    .,(`j
       .((`async;2;)
         (`image;"Delete_Or_Clause.png";)
         (`help;"Remove Or Clause";)
         (`l;"<html><center>Remove<br>Or</center></html>";)
         (`hpos;`r;)
         (`vpos;`c;)
         (`h;20;)
         (`font;`"Courier 0 14";)
         (`lfont;`"Dialog 0 12";))
       ))
   (`Run
    {
}
    .,(`j
       .((`async;2;)
         (`image;"Query_32.png";)
         (`help;"Execute Query";)
         (`l;"<html><center>Run<br>Query</center></html>";)
         (`hpos;`r;)
         (`vpos;`c;)
         (`e;1;)
         (`h;20;)
         (`font;`"Courier 0 14";)
         (`lfont;`"Dialog 0 12";))
       )))
 .,(`j
    .((`a
       `New `Open `Save ` `Or `Or_ ` `Compare_Simulations `Run `Acrobat
       )
      (`anchor;`w;)
      (`fill;`n;)
      (`border;0;)
      (`wy;1e-010;)
      (`h;20;)
      (`font;`"Courier 0 14";)
      (`lfont;`"Dialog 0 12";))
    )

panel.toolbar..j.border: 0
panel.toolbar..j.floatable: 1
panel.toolbar..j.wy: .j.NoExtraSpace

panel.toolbar.Acrobat: {_n}
panel.toolbar.Acrobat..j:.((`async;2;)
	  (`image;"Acrobat2.png";)
	  (`help;"Create Acrobat File";)
	  (`l;"<html>Acrobat<br>File</html>";)
	  (`hpos;`r;)
	  (`vpos;`c;)
	  (`e;1;))

.j.Java {
  .j.c`panel
}
panel..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

