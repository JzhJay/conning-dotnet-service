asd:((0.2182786 0.1906449 0.1660792 0.127983 0.1056137 0.06715263 0.04972076 0.0351697 0.02800271 0.02567805
  0.3198553 0.2949391 0.271097 0.23299 0.2097328 0.1671136 0.1446886 0.1205022 0.09696535 0.07460765
  0.03712867 0n 0n 0n 0n 0n 0n 0n 0n 0n
  0.1130713 0n 0n 0n 0n 0n 0n 0n 0n 0n)
 .((`j
    .((`c;`gcrossscatter;)
      (`l;"Efficient Frontier Chart";)
      (`wy;1.0;)
      (`vars
       (0 1
        2 3)
       )
      (`voi
       .((`drawline
          1 0
          )
         (`thickline;0;))
       )
      (`oi
       .,(`drawlegend;0;)
       )
      (`axis
       .((`label
          .((`x;"Risk = std";)
            (`y;"Reward = avg";))
          )
         (`min
          .((`x;0.0;)
            (`y;0.0;))
          )
         (`max
          .((`x;0.2619343;)
            (`y;0.3358481;))
          ))
       )
      (`aoi
       .,(`drawgrid
          .((`x;1;)
            (`y;1;))
          )
       )
      (`acoi
       .,(`gridcolor
          .((`x;210210210;)
            (`y;210210210;))
          )
       )
      (`afi
       .((`axislabelfont
          (`x `"Helvetica 1 12"
           `y `"Helvetica 1 12")
          )
         (`ticklabelfont
          (`x `"Helvetica 0 12"
           `y `"Helvetica 0 12")
          ))
       )
      (`multiselect;{[]
      d:(-1_ .j.v),~*|.j.v
      if[.j.i[0;0] _in  r:`. d,`annotation_rows
        .[`;d,`annotation_on,.j.i[1;0];~:]
        c:&` . d,`annotation_on
        .[`;d,`j`anno;:;(,/r,/:\:c;,/(#r)#,` . d,`annotation,,c)] ]
      };)
      (`mousemode
       ,`leftclick `select
       )
      (`anno
       (();())
       )
      (`vcoi
       .((`pointcolor
          255 0
          )
         (`pointbackgroundcolor
          255 0
          ))
       ))
    )
   (`annotation_rows
    ,0
    )
   (`annotation_on
    0 0 0 0 0 0 0 0 0 0
    )
   (`annotation
    (,"A"
     ,"B"
     ,"C"
     ,"D"
     ,"E"
     ,"F"
     ,"G"
     ,"H"
     ,"I"
     ,"J")
    )))

p:asd[0]
p.:asd[1]

p..j.l:"EFA Efficient Frontier Chart Completed Optimization"


.j.Java{
  .j.c `p
}

p..j.close:{_exit 0}
p..j.z: {
  if[1~.k[`autoExit];_exit 0]
  }