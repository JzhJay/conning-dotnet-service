serNotesPanel: (.((`text
    "3/16/2012 15:52:20 (Noah Shipley):\n"
    .,(`j
       .((`border;0;)
         (`save;1;)
         (`echo;0;)
         (`c;`text;)
         (`e;1;)
         (`cursor;0;.())
         (`s;;.()))
       ))
   (`link
    .((`table
       .((`Source
          ,`http
          )
         (`Location
          ,`
          ))
       .,(`j
          .((`c;`table;)
            (`cell
             .,(`Source
                .((`c;`combo;)
                  (`o
                   `http `self `none
                   )
                  (`ol
                   (`http `self `none
                    `"http://" `"self://" `"(none)")
                   ))
                )
             )
            (`border;0;))
          ))
      (`ok
       {
  start:&/s:.k.Notes.text..j`s; end:1+|/s
  source:{:[y~`none; ""; $x[1;x[0]?y]]}[.k.Notes.link.table..j.cell.Source.ol;*.k.Notes.link.table.Source]
  location:$*.k.Notes.link.table.Location
  link:source,location
  .k.Notes.text:(start#text),"<a href=\"",link,"\">",(text@start+!end-start),"</a>",end _ text:.k.Notes.text
  .k.Notes.text..j[`s]+:(#link)+11
  .k.Notes..j.a:(`text;`OK`Link`Preview`Time_Stamp`Cancel)
  }
       .,(`j
          .((`c;`button;)
            (`fill;`h;)
            (`image;"OK.png";)
            (`l;"";))
          )))
    .,(`j
       .((`c;`panel;)
         (`border;0;))
       ))
   (`OK
    {pop_n[]; set_n[add selected[];Notes]; n_set[Notes]; cancel_n[]; goto selected[]}
    .,(`j
       .((`help;`"Save changes and exit";)
         (`l
          ,""
          )
         (`image;"OK.png";)
         (`c;`button;)
         (`fill;`h;))
       ))
   (`Preview
    {push_n[];
        .k.Notes..j.a:(`text;`OK`Link_off`Edit`Time_Stamp_off`Cancel)
        .k.Notes.text..j[`c`e]:(`html;0)
        .k.Notes.text..j[`link.;`j;`t]:link_from_note
        .k.Notes.text:n_html .k.Notes.text
        .k.Notes..j.l:_ssr[.k.Notes..j.l;" (Edit)";" (Preview)"]
        }
    .,(`j
       .((`help;`"Display preview of notes in html format";)
         (`l
          ,""
          )
         (`image;"Preview.png";)
         (`c;`button;)
         (`fill;`h;))
       ))
   (`Edit
    {.k.Notes..j.a:(`text;`OK`Link`Preview`Time_Stamp`Cancel)
        .k.Notes.text..j[`c`e]:(`text;1)
        .k.Notes..j.l:_ssr[.k.Notes..j.l;" (Preview)";" (Edit)"]
        pop_n[]
        }
    .,(`j
       .((`help;`"Return to edit mode";)
         (`l
          ,""
          )
         (`image;"Edit.png";)
         (`c;`button;)
         (`fill;`h;))
       ))
   (`Link
    {if[empty:6=4:s:.k.Notes.text..j`s; .j.ok.i["No text selected for link"]]
        if[~empty; .k.Notes..j.a:,`link ]
        }
    .,(`j
       .((`help;`"Add hyperlink in text";)
         (`l
          ,""
          )
         (`image;"Link_24.png";)
         (`c;`button;)
         (`fill;`h;))
       ))
   (`Link_off
    {}
    .,(`j
       .((`help;`"Use Edit to enable adding hyperlinks";)
         (`l
          ,""
          )
         (`image;"Link_24_off.png";)
         (`c;`button;)
         (`fill;`h;))
       ))
   (`Time_Stamp
    {Notes.text::Notes.text,"\n",n_time[]}
    .,(`j
       .((`help;`"Append time stamp to notes";)
         (`l
          ,""
          )
         (`image;"Timestamp.png";)
         (`c;`button;)
         (`fill;`h;))
       ))
   (`Time_Stamp_off
    {}
    .,(`j
       .((`help;`"Use Edit to enable adding time stamps";)
         (`l
          ,""
          )
         (`image;"Timestamp_off.png";)
         (`c;`button;)
         (`fill;`h;))
       ))
   (`Cancel
    {.j.d`.k.Notes;Notes.text::"";Notes..u..j.l::`}
    .,(`j
       .((`help;`"Exit Notes Editor without changes";)
         (`l
          ,""
          )
         (`image;"Cancel.png";)
         (`c;`button;)
         (`fill;`h;))
       )))
 .((`j
    .((`l;"Notes: \\ (Edit)";)
      (`a
       (`text
        `OK `Link `Preview `Time_Stamp `Cancel)
       )
      (`c;`panel;)
      (`close;{ _exit 0})
      (`modal;1;)
      (`on;`.k.Main;)
      (`xy
       500 200
       )
      (`loc
       705 496
       .()))
    .,(`t;".j.k[];.j.flush[];";))
   (`backup
    .((`node;;)
      (`text;;))
    )
   (`u

    .,(`j
       .,(`l;;)
       ))
   (`t;".j.k[];.j.flush[];";)))

   NotesPanel: serNotesPanel[0]
   NotesPanel.: serNotesPanel[1]

.j.Java {
  .j.c `NotesPanel
}

 p..j.z: {
 if[1~.k[`NotesPanel]; _exit 0]