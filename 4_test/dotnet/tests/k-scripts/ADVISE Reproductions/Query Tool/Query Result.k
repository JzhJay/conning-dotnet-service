/ Copyright (c) 2005-2012 Conning Services (Ireland) Limited
/ Noah Shipley

\l main\j\j

resultWindow:    (.((`Pivot
    .((`toolbar
       .((`Flip
          {P.Pivot[`pivot.;`j;`a]|:;invalidate[];refresh[]}
          .,(`j
             .((`image;"Flip_32.png";)
               (`help;"Flip Rows and Columns";)
               (`l;"<html>Flip<br>Axes</html>";)
               (`hpos;`r;)
               (`vpos;`c;)
               (`e;1;))
             ))
         (`Rows
          {y;P.Pivot[`pivot.;`j;`a]:x(,/P.Pivot[`pivot.;`j;`a];0#`);invalidate[];refresh[]}[::]
          .,(`j
             .((`image;"Rows_32.png";)
               (`help;"Axis Values Down Rows";)
               (`l;"<html>Rows</html>";)
               (`hpos;`r;)
               (`vpos;`c;)
               (`e;1;))
             ))
         (`Cols
          {y;P.Pivot[`pivot.;`j;`a]:x(,/P.Pivot[`pivot.;`j;`a];0#`);invalidate[];refresh[]}[|:]
          .,(`j
             .((`image;"Columns_32.png";)
               (`help;"Axis Values Across Columns";)
               (`l;"<html>Columns</html>";)
               (`hpos;`r;)
               (`vpos;`c;)
               (`e;1;))
             ))
         (`Slice
          {L.T::L.S;L..j.v::1}
          .,(`j
             .((`image;"Slice_Axes.png";)
               (`help;"Slice Axis Values";)
               (`l;"<html>Slice<br>Axes</html>";)
               (`hpos;`r;)
               (`vpos;`c;)
               (`e;1;))
             ))
         (`Drill
          {
 i:&P.Pivot[`pivot.;`j;`bg]=.j.True				/ indices within P.Pivot of True (chosen) cells
 if[~#i;:.j.ok.E"Nothing chosen"]
 if[~#!Object[0;`x];:.j.ok.E"No axes have statistics"]
 d:@[P.Pivot[`pivot.;`j;`ax];_n;@[;i]]				/ dictionary where keys are axes, values are axis values of chosen cell
 q:Object							/ prepare the query object for the new view
 q[;`x]:.()							/ eliminate the statistics
 j:(!d)_dvl`Time`Path,!Object[0;`x]				/ non-fixed axes which don't have statistics, excluding Time and Path
 j:j@&1=#:'d[j]							/ only include axes for which a single value was chosen
 if[`Simulation _in j
  q@:&q[;`A;`Simulation]=*d`Simulation				/ conditionally restrict simulations
  j:j _dv `Simulation
 ]
 q[;`A;j]:(#q)#,*:'d[j]
 if[(`Path _in!d)&~`Path _in!Object[0;`x];q[;`p]:(#q)#,{x@<x}@?d[`Path]]
 if[(`Time _in!d)&~`Time _in!Object[0;`x];q[;`t]:(#q)#,{x@<x}@q[0;`T]?/:?d[`Time]]
 if[#cax:{x _dv/x _dv/y}[!q[0;`a];(!d)_dvl`Time`Path]		/ common axes
  vi:&&/{x[z]_lin y[z]}[q[0;`a];d]'cax				/ index within q[0;`v`f`s`scale] of chosen variable
  q[;`v`f`s`scale]:(#q)#,q[0;`v`f`s`scale;vi]
  q[;`a;]:(#q)#,q[0;`a;;vi] ]
 nfq0a:(!q[0;`a])@&1<#:'?:'q[0;`a][]				/ non-fixed axes of q[0;`a]
 q[;`r]:(#q)#,(nfq0a;?((!Object[0;`x])_dvl nfq0a),`Time`Path@&1<#:'q[0;`t`p]) / set the display of the new pivot
 .m.S[Client;(Function;.b.Get(q;))]				/ would it be better to replace Function with `Query ?
}
          .,(`j
             .((`async;2;)
               (`image;"Drill_32.png";)
               (`help;"Drill Down to Data Behind Statistics";)
               (`l;"<html>Drill<br>Down</html>";)
               (`hpos;`r;)
               (`vpos;`c;)
               (`e;0;))
             ))
         (`Axes

          .,(`j
             .,(`e;1;)
             )))
       .,(`j
          .((`border;0;)
            (`fill;`n;)
            (`anchor;`w;)
            (`a
             `Flip `Rows `Cols ` `Slice `Drill
             ))
          ))
      (`pivot
       0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002 0.0002004258 0.0001998305 0.0002002336 0.0002002872 0.0001999329 0.0002000804 0.0001995897 0.0001997188 0.0002003862 0.0001995866 0.0002004089 0.0001994965 0.0002001617 0.000200531 0.000199102 0.0002004685 0.0001993853 0.0002001366 0.0002002296 0.0001990717 0.0002002672 0.000199717 0.0002002467 0.0002001441 0.0001991964 0.0001997904 0.0001993001 0.00019964 0.0002007266 0.0001995221 0.0001994238 0.0001995063 0.0001995486 0.0002010675 0.0001993274 0.0001995704 0.0002000814 0.0001994343 0.0002011613 0.0001984686 0.0001990738 0.0002005452 0.0001999908 0.0002015754 0.0001982025 0.0001991422 0.0001997498 0.0002001665 0.0002017676 0.0001980386 0.0001984828 0.0001994376 0.0001997863 0.000201913 0.0001976372 0.0001984043 0.000199363 0.0001992683 0.0002021524 0.0001970722 0.0001985396 0.0001996379 0.0001986419 0.0002015718 0.0001967719 0.0001984246 0.000199319 0.0001991252 0.0002017647 0.0001971787 0.0001983872 0.000199129 0.0001989717 0.0002025709 0.0001965369 0.0001979909 0.00019975 0.0001981596 0.0002030465 0.0001966508 0.0001977752 0.0001994864 0.0001974809 0.0002030407 0.0001965258 0.0001974716 0.0001992419 0.0001976577 0.0002029486 0.0001971002 0.0001969319 0.0001991635 0.0001977122 0.0002032338 0.0001977569 0.0001966396 0.0001990103 0.0001977958 0.0002029784 0.0001980561 0.0001970882 0.0001993553 0.0001987815 0.0002029899 0.0001981396 0.0001974566 0.0001988138 0.0001985206 0.0002025433 0.0001979341 0.0001968774 0.00019913 0.0001976549 0.000203072 0.0001986032 0.0001969778 0.0001995549 0.0001977307 0.0002034571 0.0001978704 0.0001971288 0.0001998406 0.0001977012 0.0002035017 0.0001979288 0.0001964526 0.0001997089 0.000196902 0.0002031396 0.0001976854 0.0001964749 0.0001997631 0.0001967095 0.0002033108 0.0001974979 0.0001962844 0.0002001197 0.0001971716 0.0002029092 0.0001973811 0.0001962099 0.0002001439 0.0001972209 0.0002024465 0.0001968223 0.0001964215 0.0002003607 0.0001971349 0.0002026414 0.0001971248 0.0001963549 0.0001998266 0.0001971035 0.0002024829 0.0001966863 0.0001971232 0.0002002984 0.0001973147 0.0002032501 0.000196626 0.000196742 0.0002006352 0.0001967538 0.0002031976 0.0001960995 0.0001963699 0.0002006739 0.0001971858 0.0002032755 0.0001961781 0.000196049 0.0002008476 0.0001970628 0.0002023457 0.000196377 0.0001956215 0.0001999841 0.0001971661 0.0002024088 0.0001958163
       .((`j
          .((`ax
             .((`Subperiod
                `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3 `sp1 `sp1 `sp1 `sp1 `sp1 `sp2 `sp2 `sp2 `sp2 `sp2 `sp3 `sp3 `sp3 `sp3 `sp3
                )
               (`Time
                `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q1" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q2" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q3" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2001Q4" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q1" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q2" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q3" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2002Q4" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q1" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q2" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q3" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2003Q4" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q1" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q2" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q3" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2004Q4" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q1" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q2" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q3" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2005Q4" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q1" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q2" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q3" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4" `"2006Q4"
                )
               (`Path
                0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4
                ))
             )
            (`f
             9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6 9.6
             )
            (`scale
             1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1.0
             )
            (`l;"Module=GEMS, SubModule=Bonds, Economy=US, BondModule=Zero_Curve, Field=Intensity, Class=Libor, Frequency=Monthly, Simulation=AdviseSniffTestPC";)
            (`All;0;)
            (`Set;{S::.j.i;if[~`New~.j.f;invalidate[]]};)
            (`c;`Pivot_;)
            (`e;0;)
            (`ebg;`e;)
            (`rclfont;`"Dialog 0 12";)
            (`aebg;`e;)
            (`cebg;`e;)
            (`rebg;`e;)
            (`acg;`e;)
            (`rcg;`e;)
            (`ccg;`e;)
            (`cg;`e;)
            (`a
             (,`Path
              `Subperiod `Time)
             .,(`j
                .,(`t;{
 P[~Q.List;`j;`c]:`null
 P[~Q.List;`j;`wy]:0.
 P[ Q.List]:_n
 / v is bitmap of which view types are valid
 / Q.List does not include Pivot, does include the view types from main/a/q/q.k
 / Note that the validation functions are not run if the data includes any non-numerics.
 c:current[]
 numeric:{:[|/-1 -2=t:4:x;1;~t=0;0;&/(?4::'x)_lin 1 2]}@*c
 v: :[numeric;~Q[Q.List;`v].\:c,,.j.pivot c;&#Q.List]
 a:1<#*P.Pivot[`pivot.;`j;`a]
 b:P..j.menu[`Tool;`Join]
 menus:*P..j.menu..j.ne
 P..j.menu..j.ne[1;menus?`Window `Hide]:~Mode
 P..j.menu..j.ne[1;menus?/:(,`Tool;,`Select;`View `Pivot)]:1
 P..j.menu..j.ne[1;menus?/:`View,/:Q.List]:v
 P..j.menu..j.ne[1;menus?/:`Select,/:`All`None`Only`Except`With`Without`In`Up`Down`Copy_Selection`Paste_Selection`Copy_Location]:0
 P..j.menu..j.ne[1;menus?`Tool `Join]:a|b
 P..j.menu..j.ne[1;menus?/:`Tool,/:`Slice`All`Compress`Axes`Flip`Rows`Cols]:~b
 P..j.menu..j.ne[1;menus?`Tool `Filter]:numeric&1=#*P.Pivot[`pivot.;`j;`a]
 P.Pivot.toolbar[~`Axes`Flip`Rows`Cols;`j;`e]:~b
};)
                ))
            (`alkk;{
 a:`. p:.u.attr[.j.v],`j`a
 if[(4=4:i:.j.i)&0=4:a
   .[`;p;:;:[i _in a[0];(a[0]_dv i;a[1],i)
             i _in a[1];(a[0],i;a[1]_dv i)
                        a] ]
   invalidate[]
   refresh[] ]
};)
            (`popup
             .((`All;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`All;v;of[c;`all_;,v])]};)
               (`None;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`None;v;())]};)
               (`s0;" ";)
               (`Only;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Only;v;of[c;`selected_;,v])]};)
               (`Except;{[x]c:cl v:ad -2_.j.v;of[c;`set_;(`Except;v;of[cl v;`all_;,v]_dvl of[c;`selected_;,v])]};)
               (`s1;" ";)
               (`With;{[x]C.Data_.With_v[x;ad -2_.j.v]};)
               (`Without;{[x]C.Data_.Without_v[x;ad -2_.j.v]};)
               (`In;{[x]c:cl v:ad -2_.j.v;s:of[c;`get_;,v];of[c;`set_;(`In;v;s@&s _lin of[c;`selected_;,v])]};)
               (`s2;" ";)
               (`Up;{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;<:)]};)
               (`Down;{[x]c:cl v:ad -2_.j.v;of[c;`sort_;(c;v;>:)]};)
               (`s3;" ";)
               (`Copy_Selection;{[x]c:cl v:ad -2_.j.v;of[c;`copy_;(c;v)]};)
               (`Paste_Selection;{[x]c:cl v:ad -2_.j.v;of[c;`paste_;(c;v)]};)
               (`s99;" ";)
               (`Copy;{[f;junk]c:name.c v:f .j.v;if[(1~the[c;`alwaysSel])|~empty s:att[v;`s];of[c;`copy;(v;s)]]}[{@[x;-1+#x,:();~:]}-2_];)
               (`Copy_All;{[f;junk]c:name.c v:f .j.v;of[c;`copy_all;(v;)]}[{@[x;-1+#x,:();~:]}-2_];)
               (`Flip;{[w;junk].[`;w,`a;|:];fire_t w,`a}[`k `P `Pivot `pivot. `j];)
               (`Rows;{[w;junk]C.Axes.Swap_[w;::]}[`k `P `Pivot `pivot. `j];)
               (`Cols;{[w;junk]C.Axes.Swap_[w;|:]}[`k `P `Pivot `pivot. `j];)
               (`Copy_Location;{
 r:get_location[]
 .w.cbwrite[,`DFA_;,.,(`Query;+r`vars`stats`times`paths`views)]
 };)
               (`Trace_Variable;{ / call_trace_variable
  v:get_loc[]
  if[1<c:#v.vars
    hide_[]
    .j.e"Only one variable may be traced at a time.  \nYou have selected ",($c),".  "
    :_n]
  v:@[v;_n;*:] / only one selection allowed
  if[1<|/c:#:'v.vars@d:!v.stats
    .j.e"More than one variable contributes to statistics  \non axes ",(2_,/", ",/:$d@&c>1),".  "
    :_n]
  if[1<|/#:'v.vars[]
    .j.e"Unknown state error accessing variable.  "
    :_n]
  v.vars:@[v.vars;_n;*:] / only one element allowed each axis
/  vja:`. {(1+*-1#&x=`j)#x}[.j.v] / Variable j attrib - .k.P.Pivot.pivot..j
/  server[1;"main/vtt/main";"trace";(filename;axes)]
  / filename should NOT come from label, should reflect simulation selection
  TRACE_COUNT+:1
  wind_name:{`Trace,1_(-3_ x),(", ";"Trace";"[";($TRACE_COUNT);"";"]"),-3#x}@.k.P..j.l
  r:.h.Get[_n;_n;"main/vtt/main";"trace";0;(*Server;*-1#.k.P..j.l;wind_name;{:[x _in!y;y _di x;y]}[`Simulation;v.vars];*v.times)] / in common/k/h.k
  if[r 2
    TRACE_COUNT-:1
    hide_[]
    .j.e"Variable tracing process failed to start.  "
    :_n]
  r};))
             .,(`j
                .,(`ne
                   ((,`All
                     ,`None
                     ,`s0
                     ,`Only
                     ,`Except
                     ,`s1
                     ,`With
                     ,`Without
                     ,`In
                     ,`s2
                     ,`Up
                     ,`Down
                     ,`s3
                     ,`Copy_Selection
                     ,`Paste_Selection
                     ,`Copy
                     ,`Copy_All
                     ,`s99
                     ,`Flip
                     ,`Rows
                     ,`Cols
                     ,`Copy_Location
                     ,`Trace_Variable)
                    0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0)
                   )
                ))
            (`s

             .,(`t;".k.selectable[]";))
            (`sr

             .,(`t;".k.selectable[]";))
            (`sc

             .,(`t;".k.selectable[]";))
            (`S;;)
            (`SR;;)
            (`SC;;)
            (`SRC;;)
            (`kk;{c:cl .j.v;the[c]'[`With_v`Without_v][|/,//of[c;`true;,.j.v]=`. jd[.j.v],`bg,.j.i][_n;.j.v]};)
            (`krd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
            (`Set_;{[f;v;s]
 b:of[cl v;;,v]'`false`true`null
 s::[~0~att[v;`All];s;(#s)~#`. v;!0;s]
 s::[~0~att[v;`None];s;~#s;!#`. v;s]
 w:jd v;d:`. v;if[_n~bg:`. w,`bg;bg:(#d)#*b];i:&~bg _lin b
 :[1~att[v;`Check]
  do[1;.[`;v;:;@[(#d)#*b;s;:;b 1]];fire_t v]
  do[1;.[`;w,`bg;:;@[@[@[(#d)#*b;s;:;b 1];&d~'_n;:;b 2];i;:;bg i]];fire_t w,`bg]]
 .[`;w,,`s`sr`sc;:;_n]
 bg:*b
 ax:`. w,`ax
 bx:?:'ax[]
 j:=:'bx?/:'ax[]
 cx:bx@'&:'&/''j _lin\:\:s
 n:{:[4:x;x=nil x;x _lin (_n;0N;0n;" ";`;;;)@?4::'x]}'bx
 t:(2*n)+(~n)*bx[]_lin'cx
 bg:.+(!ax;b t)
 .[`;w,`rclbg;:;bg]
 fire_t w,`rclbg
 user[`Set;f;v;s]
};)
            (`Get_;{[v]&of[cl v;`bool_;,v]};)
            (`bg
             `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w
             .,(`t;".k.drillable[]";))
            (`rclbg
             .((`Subperiod
                `w `w `w
                )
               (`Time
                `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w `w
                )
               (`Path
                `w `w `w `w `w
                ))
             .())
            (`rclkk;{c:cl .j.v;the[c]'[`With_v`Without_v][|/,//of[c;`true;,.j.v]=`. jd[.j.v],`bg,.j.i][_n;.j.v]};)
            (`rclkrd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
            (`alkrd;{
 C.Data.Sel[]
 c:cl v:.j.v
 n:`. jd[v],`popup.`j`ne
 n[1;(,/*n)?/:!*of[c;`operations_;,v]]:1
 m:`$($,/*n),\:"__"
 f:.+(m;the[c]'m);f:f _di(!f)@&~7=4::'f[]
 n[1;m?/:!f]:f[]@\:v
 .[`;jd[v],`popup.`j`ne;:;n]
};)
            (`albg;{:[(`a;*.j.i)~att[v;`S];0]};)
            (`alfg;{:[(`a;*.j.i)~att[v;`S];`n]};)
            (`kd;{.[`;jd[.j.v],`S;:;_n];{.[`;jd[.j.v],x;::]}'`alfg`albg;{.[`;jd[.j.v],x;:;()]}'`sr`sc;};)
            (`alkd;{.[`;jd[.j.v],`S;:;(`a;*.j.i)];{.[`;jd[.j.v],x;::]}'`alfg`albg;{.[`;jd[.j.v],x;:;()]}'`sr`sc`s;};)
            (`rclkd;{.[`;jd[.j.v],`S;:;(`rc;*.j.i)];{.[`;jd[.j.v],x;::]}'`alfg`albg;.[`;jd[.j.v],`s;:;()]};))
          )
         (`pw;;))))
    .,(`j
       .((`c;`panel;)
         (`border;0;)
         (`a
          `pivot `toolbar
          )
         (`v;0;)
         (`wy;1.0;))
       ))
   (`Statistics

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Correlation

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`info
    .((`s
       ," "
       .,(`j
          .((`border;0;)
            (`c;`label;)
            (`fill;`h;)
            (`wx;0.99;)
            (`halign;`l;))
          ))
      (`p
       0
       .,(`j
          .((`v;0;)
            (`border;0;)
            (`c;`progress;)
            (`min;0;)
            (`max;100;)
            (`indeterminate;0;)
            (`l;"";)
            (`wx;1e-010;))
          ))
      (`f
       ," "
       .,(`j
          .((`border;0;)
            (`c;`label;)
            (`fill;`h;)
            (`wx;0.01;))
          )))
    .,(`j
       .((`wy;1e-010;)
         (`c;`panel;)
         (`l;"";)
         (`fill;`h;)
         (`a
          ,`p `f `s
          )
         (`anchor;`c;))
       ))
   (`toolbar
    .((`Print
       {.j.p[`_.k.P;1]}
       .,(`j
          .((`image;"Print.png";)
            (`help;"Print Screen Image";)
            (`l;"";)
            (`e;1;))
          ))
      (`Acrobat_Report
       {.u.exec[Pdf.run;_n]}
       .,(`j
          .((`async;2;)
            (`image;"Acrobat2.png";)
            (`help;"Create Acrobat File";)
            (`l;"<html>Acrobat<br>File</html>";)
            (`hpos;`r;)
            (`vpos;`c;)
            (`e;1;))
          ))
      (`Excel_Workbook
       {[x;y]
 chooser_or_filename: :[x~`launch;.u.tempName[@[.a`a;0;{*.u.uc x}],"Workbook";`xltx];`.k.XLSX]
 file:export_general[chooser_or_filename;export_view_as_xlsx]
 if[x~`launch;if[~file~_n;.w.exec["new";file;_n;_n;`normal;_n]]]
}[`launch]
       .,(`j
          .((`async;2;)
            (`image;"Excel_Chart_32.png";)
            (`help;"Create Excel Workbook";)
            (`l;"<html>Excel<br>Workbook</html>";)
            (`hpos;`r;)
            (`vpos;`c;)
            (`e;1;))
          ))
      (`Copy
       {.w.cbwrite[`Csv`text;csv_image[]];status"Copied to clipboard"}
       .,(`j
          .((`image;"Copy_32.png";)
            (`help;"Copy to Clipboard";)
            (`l;"<html>Copy</html>";)
            (`hpos;`r;)
            (`vpos;`c;)
            (`e;1;))
          ))
      (`Copy_as_List
       {.w.cbwrite[`Csv`text;csv_table[]];status"Copied to clipboard for use in spreadsheet pivot table"}
       .,(`j
          .((`image;"Copy_as_List_32.png";)
            (`help;"Copy to Clipboard as a List for use in Spreadsheet Pivot Table";)
            (`l;"<html>Copy<br>as&nbsp;List</html>";)
            (`hpos;`r;)
            (`vpos;`c;)
            (`e;1;))
          )))
    .,(`j
       .((`border;0;)
         (`fill;`n;)
         (`anchor;`w;)
         (`a
          `Print `Acrobat_Report `Excel_Workbook `Copy `Copy_as_List
          ))
       ))
   (`diffToolbar
    .((`first
       { /findFirst: scroll the pivot table to the first difference
  P[`Pivot;`pivot.;`j;`s]: DiffTable[0]
  P[`diffToolbar;~`first`back;`j;`e]: 0
  P[`diffToolbar;~`last`forward;`j;`e]: 1<DiffTableWidth
  if[DiffTableWidth=1; P[`diffToolbar;~`first;`j;`e]: 1] /special case for when there's only one difference, leave Find First available so user can always find first when they're scrolling around the data
}
       .,(`j
          .((`e;1;)
            (`image;"toolbarButtonGraphics/media/Rewind16.gif";)
            (`help;"First difference";)
            (`l;"";))
          ))
      (`back
       {[dir;unused] /findDiff: dir is + for forward move, - for backward move.  Returns the pivot selection indices of the next difference in direction dir
/Note: it is assumed that the diff buttons are only enabled in permissible directions e.g. the user can't click backward when there are no differences in that direction
  current: *P[`Pivot;`pivot.;`j;`s]
  if[current~_n; current: 0] /if a selection hasn't been made yet, start at 0
  /i will be
  /  the index of the current difference if the current selection is on a difference,
  /  0 if the user is on or before the first difference
  /  the index of the next difference if not past the last difference
  /  DiffTableWidth if the current selection is after the last difference
  i: DiffTable _bin current
  if[i=DiffTableWidth; i: DiffTableWidth-1] /if after the last difference, use the last difference
  /Determine the next column index into DiffTable depending on the direction we want to move
  next: :[current=DiffTable[i] /If the currently selected cell is a difference, then the next difference is the adjacent DiffTable entry in the direction dir
            dir[i;1]
          (i=0) | (~[dir;+]) /else if i is 0 or if going in the forward direction, then i is the next difference
            i
          i-1] /else we're going in the backward direction and i-1 is the next difference
  if[~next<DiffTableWidth; next: DiffTableWidth-1] /make sure next isn't after the last difference
  if[next<0; next: 0] /make sure next isn't before the first difference
  P[`Pivot;`pivot.;`j;`s]: DiffTable[next]
  /Enable/Disable buttons based on the selection we've just made
  P[`diffToolbar;~`first`back;`j;`e]: ~next=0
  P[`diffToolbar;~`last`forward;`j;`e]: ~next=DiffTableWidth-1
  }[-]
       .,(`j
          .((`e;1;)
            (`image;"toolbarButtonGraphics/media/StepBack16.gif";)
            (`help;"Previous difference";)
            (`l;"";))
          ))
      (`forward
       {[dir;unused] /findDiff: dir is + for forward move, - for backward move.  Returns the pivot selection indices of the next difference in direction dir
/Note: it is assumed that the diff buttons are only enabled in permissible directions e.g. the user can't click backward when there are no differences in that direction
  current: *P[`Pivot;`pivot.;`j;`s]
  if[current~_n; current: 0] /if a selection hasn't been made yet, start at 0
  /i will be
  /  the index of the current difference if the current selection is on a difference,
  /  0 if the user is on or before the first difference
  /  the index of the next difference if not past the last difference
  /  DiffTableWidth if the current selection is after the last difference
  i: DiffTable _bin current
  if[i=DiffTableWidth; i: DiffTableWidth-1] /if after the last difference, use the last difference
  /Determine the next column index into DiffTable depending on the direction we want to move
  next: :[current=DiffTable[i] /If the currently selected cell is a difference, then the next difference is the adjacent DiffTable entry in the direction dir
            dir[i;1]
          (i=0) | (~[dir;+]) /else if i is 0 or if going in the forward direction, then i is the next difference
            i
          i-1] /else we're going in the backward direction and i-1 is the next difference
  if[~next<DiffTableWidth; next: DiffTableWidth-1] /make sure next isn't after the last difference
  if[next<0; next: 0] /make sure next isn't before the first difference
  P[`Pivot;`pivot.;`j;`s]: DiffTable[next]
  /Enable/Disable buttons based on the selection we've just made
  P[`diffToolbar;~`first`back;`j;`e]: ~next=0
  P[`diffToolbar;~`last`forward;`j;`e]: ~next=DiffTableWidth-1
  }[+]
       .,(`j
          .((`e;1;)
            (`image;"toolbarButtonGraphics/media/StepForward16.gif";)
            (`help;"Next difference";)
            (`l;"";))
          ))
      (`last
       { /findLast: scroll the pivot table to the last difference
  P[`Pivot;`pivot.;`j;`s]: *-1#DiffTable
  P[`diffToolbar;~`first`back;`j;`e]: 1<DiffTableWidth
  P[`diffToolbar;~`last`forward;`j;`e]: 0
}
       .,(`j
          .((`e;1;)
            (`image;"toolbarButtonGraphics/media/FastForward16.gif";)
            (`help;"Last difference";)
            (`l;"";))
          )))
    .,(`j
       .((`border;0;)
         (`fill;`n;)
         (`anchor;`w;)
         (`a
          `first `back `forward `last
          )
         (`v;0;)
         (`c;`toolbar;))
       ))
   (`Bar

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Bootstrap

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Box

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Box_BV

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`CDF

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`CDF_BV

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Histogram

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Histogram_BV

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Line

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Line2

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Means

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Means_BV

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`PDF

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`PDF_BV

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Scatter_BV

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Sensitivity

    .,(`j
       .((`c;`null;)
         (`v;0;)
         (`wy;0.0;))
       ))
   (`Table
    .,(`g
       .((`mw
          .((`Path
             0 1 2 3 4
             )
            (`C_sp1_2001Q1
             0 0 0 0 0.0
             )
            (`C_sp1_2001Q2
             0 0 0 0 0.0
             )
            (`C_sp1_2001Q3
             0 0 0 0 0.0
             )
            (`C_sp1_2001Q4
             0 0 0 0 0.0
             )
            (`C_sp1_2002Q1
             0 0 0 0 0.0
             )
            (`C_sp1_2002Q2
             0 0 0 0 0.0
             )
            (`C_sp1_2002Q3
             0 0 0 0 0.0
             )
            (`C_sp1_2002Q4
             0 0 0 0 0.0
             )
            (`C_sp1_2003Q1
             0 0 0 0 0.0
             )
            (`C_sp1_2003Q2
             0 0 0 0 0.0
             )
            (`C_sp1_2003Q3
             0 0 0 0 0.0
             )
            (`C_sp1_2003Q4
             0.0002 0.0002 0.0002 0.0002 0.0002
             )
            (`C_sp1_2004Q1
             0.0002004258 0.0001998305 0.0002002336 0.0002002872 0.0001999329
             )
            (`C_sp1_2004Q2
             0.0002004685 0.0001993853 0.0002001366 0.0002002296 0.0001990717
             )
            (`C_sp1_2004Q3
             0.0001994238 0.0001995063 0.0001995486 0.0002010675 0.0001993274
             )
            (`C_sp1_2004Q4
             0.0001991422 0.0001997498 0.0002001665 0.0002017676 0.0001980386
             )
            (`C_sp1_2005Q1
             0.0001985396 0.0001996379 0.0001986419 0.0002015718 0.0001967719
             )
            (`C_sp1_2005Q2
             0.0001979909 0.00019975 0.0001981596 0.0002030465 0.0001966508
             )
            (`C_sp1_2005Q3
             0.0001969319 0.0001991635 0.0001977122 0.0002032338 0.0001977569
             )
            (`C_sp1_2005Q4
             0.0001974566 0.0001988138 0.0001985206 0.0002025433 0.0001979341
             )
            (`C_sp1_2006Q1
             0.0001971288 0.0001998406 0.0001977012 0.0002035017 0.0001979288
             )
            (`C_sp1_2006Q2
             0.0001962844 0.0002001197 0.0001971716 0.0002029092 0.0001973811
             )
            (`C_sp1_2006Q3
             0.0001963549 0.0001998266 0.0001971035 0.0002024829 0.0001966863
             )
            (`C_sp1_2006Q4
             0.0001963699 0.0002006739 0.0001971858 0.0002032755 0.0001961781
             )
            (`C_sp2_2001Q1
             0 0 0 0 0.0
             )
            (`C_sp2_2001Q2
             0 0 0 0 0.0
             )
            (`C_sp2_2001Q3
             0 0 0 0 0.0
             )
            (`C_sp2_2001Q4
             0 0 0 0 0.0
             )
            (`C_sp2_2002Q1
             0 0 0 0 0.0
             )
            (`C_sp2_2002Q2
             0 0 0 0 0.0
             )
            (`C_sp2_2002Q3
             0 0 0 0 0.0
             )
            (`C_sp2_2002Q4
             0 0 0 0 0.0
             )
            (`C_sp2_2003Q1
             0 0 0 0 0.0
             )
            (`C_sp2_2003Q2
             0 0 0 0 0.0
             )
            (`C_sp2_2003Q3
             0 0 0 0 0.0
             )
            (`C_sp2_2003Q4
             0.0002 0.0002 0.0002 0.0002 0.0002
             )
            (`C_sp2_2004Q1
             0.0002000804 0.0001995897 0.0001997188 0.0002003862 0.0001995866
             )
            (`C_sp2_2004Q2
             0.0002002672 0.000199717 0.0002002467 0.0002001441 0.0001991964
             )
            (`C_sp2_2004Q3
             0.0001995704 0.0002000814 0.0001994343 0.0002011613 0.0001984686
             )
            (`C_sp2_2004Q4
             0.0001984828 0.0001994376 0.0001997863 0.000201913 0.0001976372
             )
            (`C_sp2_2005Q1
             0.0001984246 0.000199319 0.0001991252 0.0002017647 0.0001971787
             )
            (`C_sp2_2005Q2
             0.0001977752 0.0001994864 0.0001974809 0.0002030407 0.0001965258
             )
            (`C_sp2_2005Q3
             0.0001966396 0.0001990103 0.0001977958 0.0002029784 0.0001980561
             )
            (`C_sp2_2005Q4
             0.0001968774 0.00019913 0.0001976549 0.000203072 0.0001986032
             )
            (`C_sp2_2006Q1
             0.0001964526 0.0001997089 0.000196902 0.0002031396 0.0001976854
             )
            (`C_sp2_2006Q2
             0.0001962099 0.0002001439 0.0001972209 0.0002024465 0.0001968223
             )
            (`C_sp2_2006Q3
             0.0001971232 0.0002002984 0.0001973147 0.0002032501 0.000196626
             )
            (`C_sp2_2006Q4
             0.000196049 0.0002008476 0.0001970628 0.0002023457 0.000196377
             )
            (`C_sp3_2001Q1
             0 0 0 0 0.0
             )
            (`C_sp3_2001Q2
             0 0 0 0 0.0
             )
            (`C_sp3_2001Q3
             0 0 0 0 0.0
             )
            (`C_sp3_2001Q4
             0 0 0 0 0.0
             )
            (`C_sp3_2002Q1
             0 0 0 0 0.0
             )
            (`C_sp3_2002Q2
             0 0 0 0 0.0
             )
            (`C_sp3_2002Q3
             0 0 0 0 0.0
             )
            (`C_sp3_2002Q4
             0 0 0 0 0.0
             )
            (`C_sp3_2003Q1
             0 0 0 0 0.0
             )
            (`C_sp3_2003Q2
             0 0 0 0 0.0
             )
            (`C_sp3_2003Q3
             0 0 0 0 0.0
             )
            (`C_sp3_2003Q4
             0.0002 0.0002 0.0002 0.0002 0.0002
             )
            (`C_sp3_2004Q1
             0.0002004089 0.0001994965 0.0002001617 0.000200531 0.000199102
             )
            (`C_sp3_2004Q2
             0.0001997904 0.0001993001 0.00019964 0.0002007266 0.0001995221
             )
            (`C_sp3_2004Q3
             0.0001990738 0.0002005452 0.0001999908 0.0002015754 0.0001982025
             )
            (`C_sp3_2004Q4
             0.0001984043 0.000199363 0.0001992683 0.0002021524 0.0001970722
             )
            (`C_sp3_2005Q1
             0.0001983872 0.000199129 0.0001989717 0.0002025709 0.0001965369
             )
            (`C_sp3_2005Q2
             0.0001974716 0.0001992419 0.0001976577 0.0002029486 0.0001971002
             )
            (`C_sp3_2005Q3
             0.0001970882 0.0001993553 0.0001987815 0.0002029899 0.0001981396
             )
            (`C_sp3_2005Q4
             0.0001969778 0.0001995549 0.0001977307 0.0002034571 0.0001978704
             )
            (`C_sp3_2006Q1
             0.0001964749 0.0001997631 0.0001967095 0.0002033108 0.0001974979
             )
            (`C_sp3_2006Q2
             0.0001964215 0.0002003607 0.0001971349 0.0002026414 0.0001971248
             )
            (`C_sp3_2006Q3
             0.000196742 0.0002006352 0.0001967538 0.0002031976 0.0001960995
             )
            (`C_sp3_2006Q4
             0.0001956215 0.0001999841 0.0001971661 0.0002024088 0.0001958163
             ))
          .,(`j
             .((`border;0;)
               (`l;"";)
               (`c;`table;)
               (`e;0;)
               (`cl
                .((`Path;"Path";)
                  (`C_sp1_2001Q1;"sp1\n2001Q1";)
                  (`C_sp1_2001Q2;"sp1\n2001Q2";)
                  (`C_sp1_2001Q3;"sp1\n2001Q3";)
                  (`C_sp1_2001Q4;"sp1\n2001Q4";)
                  (`C_sp1_2002Q1;"sp1\n2002Q1";)
                  (`C_sp1_2002Q2;"sp1\n2002Q2";)
                  (`C_sp1_2002Q3;"sp1\n2002Q3";)
                  (`C_sp1_2002Q4;"sp1\n2002Q4";)
                  (`C_sp1_2003Q1;"sp1\n2003Q1";)
                  (`C_sp1_2003Q2;"sp1\n2003Q2";)
                  (`C_sp1_2003Q3;"sp1\n2003Q3";)
                  (`C_sp1_2003Q4;"sp1\n2003Q4";)
                  (`C_sp1_2004Q1;"sp1\n2004Q1";)
                  (`C_sp1_2004Q2;"sp1\n2004Q2";)
                  (`C_sp1_2004Q3;"sp1\n2004Q3";)
                  (`C_sp1_2004Q4;"sp1\n2004Q4";)
                  (`C_sp1_2005Q1;"sp1\n2005Q1";)
                  (`C_sp1_2005Q2;"sp1\n2005Q2";)
                  (`C_sp1_2005Q3;"sp1\n2005Q3";)
                  (`C_sp1_2005Q4;"sp1\n2005Q4";)
                  (`C_sp1_2006Q1;"sp1\n2006Q1";)
                  (`C_sp1_2006Q2;"sp1\n2006Q2";)
                  (`C_sp1_2006Q3;"sp1\n2006Q3";)
                  (`C_sp1_2006Q4;"sp1\n2006Q4";)
                  (`C_sp2_2001Q1;"sp2\n2001Q1";)
                  (`C_sp2_2001Q2;"sp2\n2001Q2";)
                  (`C_sp2_2001Q3;"sp2\n2001Q3";)
                  (`C_sp2_2001Q4;"sp2\n2001Q4";)
                  (`C_sp2_2002Q1;"sp2\n2002Q1";)
                  (`C_sp2_2002Q2;"sp2\n2002Q2";)
                  (`C_sp2_2002Q3;"sp2\n2002Q3";)
                  (`C_sp2_2002Q4;"sp2\n2002Q4";)
                  (`C_sp2_2003Q1;"sp2\n2003Q1";)
                  (`C_sp2_2003Q2;"sp2\n2003Q2";)
                  (`C_sp2_2003Q3;"sp2\n2003Q3";)
                  (`C_sp2_2003Q4;"sp2\n2003Q4";)
                  (`C_sp2_2004Q1;"sp2\n2004Q1";)
                  (`C_sp2_2004Q2;"sp2\n2004Q2";)
                  (`C_sp2_2004Q3;"sp2\n2004Q3";)
                  (`C_sp2_2004Q4;"sp2\n2004Q4";)
                  (`C_sp2_2005Q1;"sp2\n2005Q1";)
                  (`C_sp2_2005Q2;"sp2\n2005Q2";)
                  (`C_sp2_2005Q3;"sp2\n2005Q3";)
                  (`C_sp2_2005Q4;"sp2\n2005Q4";)
                  (`C_sp2_2006Q1;"sp2\n2006Q1";)
                  (`C_sp2_2006Q2;"sp2\n2006Q2";)
                  (`C_sp2_2006Q3;"sp2\n2006Q3";)
                  (`C_sp2_2006Q4;"sp2\n2006Q4";)
                  (`C_sp3_2001Q1;"sp3\n2001Q1";)
                  (`C_sp3_2001Q2;"sp3\n2001Q2";)
                  (`C_sp3_2001Q3;"sp3\n2001Q3";)
                  (`C_sp3_2001Q4;"sp3\n2001Q4";)
                  (`C_sp3_2002Q1;"sp3\n2002Q1";)
                  (`C_sp3_2002Q2;"sp3\n2002Q2";)
                  (`C_sp3_2002Q3;"sp3\n2002Q3";)
                  (`C_sp3_2002Q4;"sp3\n2002Q4";)
                  (`C_sp3_2003Q1;"sp3\n2003Q1";)
                  (`C_sp3_2003Q2;"sp3\n2003Q2";)
                  (`C_sp3_2003Q3;"sp3\n2003Q3";)
                  (`C_sp3_2003Q4;"sp3\n2003Q4";)
                  (`C_sp3_2004Q1;"sp3\n2004Q1";)
                  (`C_sp3_2004Q2;"sp3\n2004Q2";)
                  (`C_sp3_2004Q3;"sp3\n2004Q3";)
                  (`C_sp3_2004Q4;"sp3\n2004Q4";)
                  (`C_sp3_2005Q1;"sp3\n2005Q1";)
                  (`C_sp3_2005Q2;"sp3\n2005Q2";)
                  (`C_sp3_2005Q3;"sp3\n2005Q3";)
                  (`C_sp3_2005Q4;"sp3\n2005Q4";)
                  (`C_sp3_2006Q1;"sp3\n2006Q1";)
                  (`C_sp3_2006Q2;"sp3\n2006Q2";)
                  (`C_sp3_2006Q3;"sp3\n2006Q3";)
                  (`C_sp3_2006Q4;"sp3\n2006Q4";))
                )
               (`fixed;1;)
               (`bg
                .,(`Path;224224224;)
                )
               (`clku;{
        jp:(-1_ .j.v),(~-1#.j.v),`j
        if[(*.j.i) _in a:(`. jp,`fixed)#(`. jp,`a)
          d:@[;{x@<y x}/[_n;`. .j.v,,|a]]
          .[`;.j.v,_n;d]
          .[`;jp,`f,_n;d] ]
        };)
               (`f
                .((`C_sp1_2001Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2001Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2001Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2001Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2002Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2002Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2002Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2002Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2003Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2003Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2003Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2003Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2004Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2004Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2004Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2004Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2005Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2005Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2005Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2005Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2006Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2006Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2006Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp1_2006Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2001Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2001Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2001Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2001Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2002Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2002Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2002Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2002Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2003Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2003Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2003Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2003Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2004Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2004Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2004Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2004Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2005Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2005Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2005Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2005Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2006Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2006Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2006Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp2_2006Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2001Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2001Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2001Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2001Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2002Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2002Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2002Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2002Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2003Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2003Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2003Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2003Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2004Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2004Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2004Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2004Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2005Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2005Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2005Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2005Q4
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2006Q1
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2006Q2
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2006Q3
                   9.6 9.6 9.6 9.6 9.6
                   )
                  (`C_sp3_2006Q4
                   9.6 9.6 9.6 9.6 9.6
                   ))
                )
               (`s;();.()))
             ))
         (`tb

          .,(`j
             .((`c;`toolbar;)
               (`panel;0;)
               (`wy;0.0;)
               (`border;0;)
               (`l;"";))
             )))
       .,(`j
          .((`a
             `mw `tb
             )
            (`c;`panel;)
            (`border;0;)
            (`label;"";))
          ))
    .,(`j
       .((`c;`panel;)
         (`l;"Module=GEMS, SubModule=Bonds, Economy=US, BondModule=Zero_Curve, Field=Intensity, Class=Libor, Frequency=Monthly, Simulation=AdviseSniffTestPC";)
         (`v;1;)
         (`wy;1.0;))
       )))
 .((`j
    .((`menu
       .((`File
          .((`Export_;{export_general[`.k.EXP ;export_image]};)
            (`Export_Special_;{.j.c`.k.Export};)
            (`Export_to_XLSX_;{[x;y]
 chooser_or_filename: :[x~`launch;.u.tempName[@[.a`a;0;{*.u.uc x}],"Workbook";`xltx];`.k.XLSX]
 file:export_general[chooser_or_filename;export_view_as_xlsx]
 if[x~`launch;if[~file~_n;.w.exec["new";file;_n;_n;`normal;_n]]]
}[`nolaunch];)
            (`Excel_Workbook;{[x;y]
 chooser_or_filename: :[x~`launch;.u.tempName[@[.a`a;0;{*.u.uc x}],"Workbook";`xltx];`.k.XLSX]
 file:export_general[chooser_or_filename;export_view_as_xlsx]
 if[x~`launch;if[~file~_n;.w.exec["new";file;_n;_n;`normal;_n]]]
}[`launch];)
            (`s1;" ";)
            (`Print_;{.j.p[`_.k.P;1]};)
            (`Page_Format_;{.j.pf`_.k.P};)
            (`Acrobat_Report;{.u.exec[Pdf.run;_n]};)
            (`Acrobat_Page_Setup_;{.u.exec[Pdf.get;_n]};)
            (`s2;" ";)
            (`Clone;{
 pdi:{:[y _in !x;x _di y;x]} / permissive delete index
 / remove triggers so that IPC will work in binary mode
 .[_d;`P`Pivot`pivot.`j`bg.;pdi;`t]
 .[_d;`P`Pivot`pivot.`j`s. ;pdi;`t]
 .[_d;`P`Pivot`pivot.`j`sr.;pdi;`t]
 .[_d;`P`Pivot`pivot.`j`sc.;pdi;`t]
 .m.S[Client;(Function;.b.Get(Object;(P.Pivot`pivot`pivot.;State)))]
 P.Pivot[`pivot.;`j;`bg.;`t]:".k.drillable[]" / restore trigger on the pivot's bg
 P.Pivot[`pivot.;`j;~`s`sr`sc;`t]:3#,".k.selectable[]" / restore triggers on the pivot's selections
};)
            (`s3;" ";)
            (`Exit;{sexit 0};))
          )
         (`Edit
          .((`Copy;{.w.cbwrite[`Csv`text;csv_image[]];status"Copied to clipboard"};)
            (`Copy_as_List;{.w.cbwrite[`Csv`text;csv_table[]];status"Copied to clipboard for use in spreadsheet pivot table"};))
          )
         (`Select
          .((`All;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`None;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`s0;" ";)
            (`Only;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`Except;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`s1;" ";)
            (`With;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`Without;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`In;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`s2;" ";)
            (`Up;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`Down;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`s3;" ";)
            (`Copy_Selection;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`Paste_Selection;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};)
            (`Copy_Location;{v:.j.v:.j.undot`.k.P.Pivot.pivot..j.popup;i:.j.i:,*|.j.i;P.Pivot[`pivot.;`j;`popup;*|.j.i][];.j.v:v;.j.i:i};))
          )
         (`Display
          .,(`Text_Size
             (`Medium
              `Huge `Large `Medium `Small `Tiny)
             )
          )
         (`Window
          .,(`Hide;{P..j.v::0};)
          )
         (`Tool
          .((`Slice_Axes;{L.T::L.S;L..j.v::1};)
            (`All;{
 P.Pivot[`pivot.;`j;`c]:`null
 P.Pivot[`pivot`pivot.]:State
 L.S[]:(!#:)'L.S[]
 L.window[.;`j;`bg;]:True
 L.window[.;`j;`c]:`vector
 L.window[.;`j;`f]:{.l.sv[x]'}'!L.window	/ each one is a projection
 L.window[.;`j;`l]:.l.sa'!L.window
 S::!0
 P..j.menu[`View;0]:`Pivot
 P..j.menu[`Tool;`Compress]:0
 P..j.menu[`Tool;`Join]:0
 view`Pivot
 invalidate[]
};)
            (`s0;" ";)
            (`Compress;0;)
            (`Join;0;)
            (`s1;" ";)
            (`Axes;{
 unjoin[]
 P.Pivot[`pivot.;`j;`a]:_n
 P.Pivot[`pivot.;`j;`a]:.j.arrangement`.k.P.Pivot.pivot
 compress P..j.menu[`Tool;`Compress]
 join P..j.menu[`Tool;`Join]
 invalidate[]
 refresh[]
};)
            (`Flip;{P.Pivot[`pivot.;`j;`a]|:;invalidate[];refresh[]};)
            (`Rows;{y;P.Pivot[`pivot.;`j;`a]:x(,/P.Pivot[`pivot.;`j;`a];0#`);invalidate[];refresh[]}[::];)
            (`Cols;{y;P.Pivot[`pivot.;`j;`a]:x(,/P.Pivot[`pivot.;`j;`a];0#`);invalidate[];refresh[]}[|:];)
            (`Drill_Down;{
 i:&P.Pivot[`pivot.;`j;`bg]=.j.True				/ indices within P.Pivot of True (chosen) cells
 if[~#i;:.j.ok.E"Nothing chosen"]
 if[~#!Object[0;`x];:.j.ok.E"No axes have statistics"]
 d:@[P.Pivot[`pivot.;`j;`ax];_n;@[;i]]				/ dictionary where keys are axes, values are axis values of chosen cell
 q:Object							/ prepare the query object for the new view
 q[;`x]:.()							/ eliminate the statistics
 j:(!d)_dvl`Time`Path,!Object[0;`x]				/ non-fixed axes which don't have statistics, excluding Time and Path
 j:j@&1=#:'d[j]							/ only include axes for which a single value was chosen
 if[`Simulation _in j
  q@:&q[;`A;`Simulation]=*d`Simulation				/ conditionally restrict simulations
  j:j _dv `Simulation
 ]
 q[;`A;j]:(#q)#,*:'d[j]
 if[(`Path _in!d)&~`Path _in!Object[0;`x];q[;`p]:(#q)#,{x@<x}@?d[`Path]]
 if[(`Time _in!d)&~`Time _in!Object[0;`x];q[;`t]:(#q)#,{x@<x}@q[0;`T]?/:?d[`Time]]
 if[#cax:{x _dv/x _dv/y}[!q[0;`a];(!d)_dvl`Time`Path]		/ common axes
  vi:&&/{x[z]_lin y[z]}[q[0;`a];d]'cax				/ index within q[0;`v`f`s`scale] of chosen variable
  q[;`v`f`s`scale]:(#q)#,q[0;`v`f`s`scale;vi]
  q[;`a;]:(#q)#,q[0;`a;;vi] ]
 nfq0a:(!q[0;`a])@&1<#:'?:'q[0;`a][]				/ non-fixed axes of q[0;`a]
 q[;`r]:(#q)#,(nfq0a;?((!Object[0;`x])_dvl nfq0a),`Time`Path@&1<#:'q[0;`t`p]) / set the display of the new pivot
 .m.S[Client;(Function;.b.Get(q;))]				/ would it be better to replace Function with `Query ?
};)
            (`Filter;`create_filter;))
          )
         (`View
          (`Table
           `Pivot `Bar `Bootstrap `Box `Box_BV `CDF `CDF_BV `Correlation `Histogram `Histogram_BV `Line `Line2 `Means `Means_BV `PDF `PDF_BV `Scatter_BV `Sensitivity `Statistics `Table)
          )
         (`Help
          .((`ADVISE_Help;{[topic]
 .m.S[(`localhost;.p`App);(`help.d;,topic)]
};)
            (`Query_Result_Help;{help.o `QueryTool_QueryResultWindow.html};)
            (`About_ADVISE;{.j.ok.i("\n&0\256 &1

\251 2012 by Conning, Inc.

All rights reserved.

This software is subject to the &0\256 software agreement.
";.a`A;.v.C)
};))
          ))
       .,(`j
          .((`ne
             ((`Window `Hide
               ,`Tool
               ,`Select
               `View `Pivot
               `View `Bar
               `View `Bootstrap
               `View `Box
               `View `Box_BV
               `View `CDF
               `View `CDF_BV
               `View `Correlation
               `View `Histogram
               `View `Histogram_BV
               `View `Line
               `View `Line2
               `View `Means
               `View `Means_BV
               `View `PDF
               `View `PDF_BV
               `View `Scatter_BV
               `View `Sensitivity
               `View `Statistics
               `View `Table
               `Select `All
               `Select `None
               `Select `Only
               `Select `Except
               `Select `With
               `Select `Without
               `Select `In
               `Select `Up
               `Select `Down
               `Select `Copy_Selection
               `Select `Paste_Selection
               `Select `Copy_Location
               `Tool `Join
               `Tool `Slice
               `Tool `All
               `Tool `Compress
               `Tool `Axes
               `Tool `Flip
               `Tool `Rows
               `Tool `Cols
               `Tool `Drill_Down
               `Tool `Filter)
              1 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 0 1)
             )
            (`async;2;)
            (`acc
             ((`File `Print_
               `Edit `Copy
               `Edit `Copy_as_List)
              `p `k `l)
             )
            (`mnem
             ((,`File
               `File `Export_
               `File `Export_Special_
               `File `Export_to_XLSX_
               `File `Excel_Workbook
               `File `Print_
               `File `Page_Format_
               `File `Acrobat_Report
               `File `Acrobat_Page_Setup_
               `File `Clone
               `File `Exit
               ,`Edit
               `Edit `Copy
               `Edit `Copy_as_List
               ,`Select
               `Select `All
               `Select `None
               `Select `Only
               `Select `Except
               `Select `With
               `Select `Without
               `Select `In
               `Select `Up
               `Select `Down
               `Select `Copy_Selection
               `Select `Paste_Selection
               `Select `Copy_Location
               ,`Window
               `Window `Hide
               ,`Tool
               `Tool `Slice_Axes
               `Tool `All
               `Tool `Axes
               `Tool `Flip
               `Tool `Rows
               `Tool `Cols
               `Tool `Drill_Down
               `Tool `Filter
               ,`View
               ,`Display
               `Display `Text_Size
               ,`Help
               `Help `ADVISE_Help
               `Help `About_ADVISE)
              `f `e `s `l `w `p `f `r `t `o `x `e `c `l `s `a `n `o `e `w `t `i `u `d `c `p `l `w `h `t `s `a `x `f `r `c `d `t `v `d `t `h `o `a)
             ))
          ))
      (`loc
       260 127
       .())
      (`l
     "foobar" / (`Query;"Query14";"*";" (";"Table";"[0]";")";" - ";"C:\\Users\\s2shno\\Documents\\AdviseSniffTestPC.dfs")
       )
      (`v;;)
      (`c;`panel;)
      (`a
       `toolbar `diffToolbar `Pivot `Bar `Bootstrap `Box `Box_BV `CDF `CDF_BV `Correlation `Histogram `Histogram_BV `Line `Line2 `Means `Means_BV `PDF `PDF_BV `Scatter_BV `Sensitivity `Statistics `Table `info
       )
      (`close;{sexit 0};)
      (`xy
       1152 851
       .,(`j
          .,(`t;{if[~_n~f:Q[viewed[];`r];f .`..j.v]};)
          ))
      (`f1;{help.o `QueryTool_QueryResultWindow.html};))
    .,(`t;".j.k[];.j.flush[];";))
   (`t;".j.k[];.j.flush[];";)))

  p: .()
p..j.c: `panel
p..j.l: "Query Tool / Vector Test"
p..j.xy: (700;600)
p..j.loc: (200;50)

p.P: resultWindow[0]
p.P.: resultWindow[1]

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
