/ Copyright (c) 2012 Conning Services (Ireland) Limited
/ Josef Sachs

/ unix color utility

\l main/j/j
\l common/java/k/color

color:.j.COLOR
panel.colortable:.(
             (`name;!color)
             (`example;(#color[])#`"example text")
            ) _dv _n
panel.colortable[`r`g`b]:1000 _vs color[]
panel.colortable..j.fg.example:color[]
panel.colortable..j.bg.example:`w
panel.colortable..j.a:`name`r`g`b`example
panel.colortable..j.border:0
panel.colortable..j.e:0
panel.colortable..j.sel:`s
panel.colortable..j.selmode:`r
panel.colortable..j.popup.Set_Background:{
 i:.k[`panel;`colortable.;`j;`s;0;1]
 .k[`panel;`colortable.;`j;`bg;`example]:color[]@i
 .k[`panel;`colortable.;`j;`fg;`example]:color[]
 .k[`panel;`background]:"bg is ",$.k[`panel;`colortable;`name;i]
 .k[`panel;`foreground]:"fg is variable"
}
panel.colortable..j.popup.Set_Foreground:{
 i:.k[`panel;`colortable.;`j;`s;0;1]
 .k[`panel;`colortable.;`j;`fg;`example]:color[]@i
 .k[`panel;`colortable.;`j;`bg;`example]:color[]
 .k[`panel;`background]:"bg is variable"
 .k[`panel;`foreground]:"fg is ",$.k[`panel;`colortable;`name;i]
}
panel.background:"bg is white"
panel.foreground:"fg is something"
panel.background..j.c:`label
panel.foreground..j.c:`label
panel.example_text_label:"Example text"
panel.example_text_label..j.c:`label
panel.example_text_label..j.wx:.j.NoExtraSpace
panel.example_text:"example text"
panel.example_text..j.c:`text
panel.example_text..j.border:0
panel.example_text..j.t:{.k[`panel;`colortable;`example;]:`$.k[`panel;`example_text]}
panel..j.xy:900 1000
panel..j.a:(`example_text_label`example_text;`background;`foreground;`colortable)
panel..j.close:{_exit 0}
.j.c`panel;
