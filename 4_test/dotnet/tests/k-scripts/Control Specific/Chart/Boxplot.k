gboxplot: (-0.000445949 0.0240792 0.03590683 0.0464444 0.06418546 0.03478888
 -0.003393122 0.02790075 0.04066303 0.05039449 0.07608893 0.03958107
 -0.01465543 0.03183719 0.04411354 0.05706042 0.07705831 0.04371946
 0.08651324 0.3520465 0.5548005 0.8099508 1 0.5727825
 0.06911589 0.3215875 0.5226563 0.7768257 1 0.545031
 0.05210036 0.2944833 0.4910091 0.7523646 1 0.5219243)

gboxplot..j:.((`border;0;)
  (`l;"";)
  (`vpi
   .,(`label
      `"2010" `"2011" `"2012"
      )
   )
  (`pi
   .,(`maxlegenditems;3;)
   )
  (`oi
   .((`drawlegend;1;)
     (`horizontal;1;)
     (`autocalc;0;))
   )
  (`colnames
   `Yield ` ` `Price ` `
   )
  (`axis
   .((`label
      .((`x;"";)
        (`y;"";))
      )
     (`min
      .((`y;-0.1;)
        (`x;0.0;))
      )
     (`max
      .((`y;1.0;)
        (`x;6.0;))
      ))
   )
  (`api
   .((`ticklabelprec
      .,(`y;2;)
      )
     (`ticklabelrotation
      .((`x;30;)
        (`y;0;))
      ))
   )
  (`acoi
   .,(`thresholdcolor
      .,(`y;0;)
      )
   )
  (`c;`gboxplot;)
  (`fi
   .((`legendfont;`"Helvetica 0 12";)
     (`titlefont;`"Helvetica 1 20";)
     (`subtitlefont;`"Helvetica 0 12";)
     (`footnotefont;`"Helvetica 1 10";))
   )
  (`ibi
   .,(`legend
      .,(`iboi
         .((`drawbackground;0;)
           (`drawborder;1;)
           (`threedimout;0;)
           (`threedim;0;))
         )
      )
   )
  (`aibi
   .,(`axislabel
      .,(`ibpi
         .,(`textmargin
            .((`x;10;)
              (`y;30;))
            )
         )
      )
   )
  (`afi
   .((`axislabelfont
      .((`x;`"Helvetica 1 12";)
        (`y;`"Helvetica 1 12";))
      )
     (`ticklabelfont
      .((`x;`"Helvetica 0 12";)
        (`y;`"Helvetica 0 12";))
      ))
   )
  (`aoi
   .((`zeropadticklabel
      .((`x;1;)
        (`y;1;))
      )
     (`intersectmin
      .((`x;1;)
        (`y;1;))
      )
     (`ticklabelcomma
      .((`x;1;)
        (`y;1;))
      )
     (`forceticklabels
      .((`x;1;)
        (`y;0;))
      )
     (`drawticks
      .((`x;0;)
        (`y;1;))
      ))
   )
  (`vcoi
   .((`areacolor
      255 255000 255000000 255 255000 255000000
      )
     (`pointbackgroundcolor
      255 255000 255000000 255 255000 255000000
      )
     (`pointcolor;0;))
   )
  (`voi
   .,(`drawpoint;0;)
   )
  (`range
   0 100 0 100.0
   .()))

gboxplot..j.l: `gboxplot
.j.c`gboxplot