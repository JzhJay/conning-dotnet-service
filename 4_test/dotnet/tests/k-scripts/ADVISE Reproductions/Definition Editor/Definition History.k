serialized: (.((`table
    .((`date
       20120829 20120829 20120829 20120828 20120828 20120529 20120529 20120529 20120529 20120529 20120529 20120529 20120529 20120529 20120529 20120112 20120112 20120112 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20111011 20111011 20111011 20111010 20111010
       )
      (`time
       125815 100222 100131 135312 135230 92546 92512 92459 92450 92042 92030 91553 91542 91518 91339 74100 74052 73855 65601 65551 65333 65242 64532 64443 64431 64409 63918 63908 63837 43648 43510 70514 70502 70442 83952 83921
       )
      (`user
       `"Noah Shipley" `"Noah Shipley" `"Noah Shipley" `"Noah Shipley" `"Noah Shipley" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik"
       )
      (`machine
       `haw7d0021.internal.cnngad.com `haw7d0021.internal.cnngad.com `haw7d0021.internal.cnngad.com `haw7d0021.internal.cnngad.com `haw7d0021.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com
       )
      (`action
       `Open `Save `Open `Save `Open `Save `"Module Selection" `"Modify Data" `"Module Selection" `Save `"Modify Data" `Save `"Paste Data" `"Batch Import" `Open `Save `"Modify Data" `Open `Save `"Modify Data" `"Batch Import" `Open `Save `"Batch Import" `"Modify Data" `Open `Save `"Modify Data" `Open `Save `Open `Save `"Batch Import" `Open `Save `Open
       )
      (`location
       `Root `Root `Root `Root `Root `Root `Root `"\\External Inputs\\Economic Variables and Financial Markets\\Global\\Martingale Test Switch" `Root `Root `"\\Company Inputs\\Economic Variables and Financial Markets\\Global\\Capital Markets\\Risk Neutral Deflator" `Root `Root `Root `Root `Root `"\\External Inputs\\Economic Variables and Financial Markets\\Germany (DE)\\Derivatives\\On\\Option Pricing" `Root `Root `"\\Company Inputs\\Investments\\Existing and New Issues\\Equity Derivatives\\Existing Issues and Holdings\\Option Strike\\.." `Root `Root `Root `Root `"\\Execution Properties\\Paths and Computer Resources\\Allocation of Computer Resources\\Compiler Memory (GB)" `Root `Root `"\\External Inputs\\Random\\Hashes for Axis Elements\\Common Stock Index\\DE Large Cap" `Root `Root `Root `Root `Root `Root `Root `Root
       )
      (`source
       35 34 33 32 31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 0
       ))
    .,(`j
       .((`c;`table;)
         (`f
             .((`date;.r.date.f;)
            (`time;{1_,/":",/:(-1 2)#_ssr[6$x;" ";"0"]};))
          )
         (`e;0;)
         (`border;0;)
         (`cl
          .((`date;`Date;)
            (`time;`Time;)
            (`user;`User;)
            (`machine;`Machine;)
            (`action;`Action;)
            (`location;`Location;))
          )
         (`a
          `date `time `user `machine `action `location
          )
         (`rsel;`s;)
         (`selmode;`r;)
         (`popup
          .((`Add_Filter;{[x]
 selected:*.k.Definition_History[`table.;`j;`s]
 table:.k.Definition_History[`table]
 filter:@[.k.Definition_History[`filter];*selected;:;value:table . selected]
 table:@[table;_n;@[;&table[*selected]=value]]
 ./[`;(`k`Definition_History),/:`table`filter;:;(table;filter)]
 };)
            (`Remove_Filter;{[x]
 filter:.k.Definition_History[`filter] _di *selected:*.k.Definition_History[`table.;`j;`s]
 history_reset[filter]
 };)
            (`Sort_Up;{[x]
 selected:**.k.Definition_History[`table.;`j;`s]
 table:.k.Definition_History[`table]
 table:@[table;_n;@[;<table@selected]]
 .[`;`k`Definition_History`table;:;table]
 };)
            (`Sort_Down;{[x]
 selected:**.k.Definition_History[`table.;`j;`s]
 table:.k.Definition_History[`table]
 table:@[table;_n;@[;>table@selected]]
 .[`;`k`Definition_History`table;:;table]
 };)
            (`Go_to_Location;{[x]
 selected:*|*.k.Definition_History[`table.;`j;`s]
 location:{x[x[;0]?`location;1]}@.X@.k.Definition_History[`table;`source;selected]
 if[6=4:get_s add location; .j.ok.i .l.ss"Location is no longer valid"; :_n]
 location:sub {(-(|get_s'(attr'1_(1+!#x)#\:x),\:`P)?1)_ x}[add location]
 goto location
 };)
            (`Verify;{[x]
 selected:*|*.k.Definition_History[`table.;`j;`s]
 data:.X@.k.Definition_History[`table;`source;selected]
 if[~data[data[;0]?`action;1] _in `open`batch_import`get_template`roll_forward
   .j.ok.i .l.ss"This action does not have a file to verify"
   :_n]
 f:{x[x[;0]?`file`source@*&`file`source _lin x[;0];1]}@data
 data:. data
 r:.l.ss@:[exists:.f.isFile f; "Source file exists. "; "Source file no longer exists"]
 if[exists
   message:{"\n",.l.ss@z,:[x~y; " verified. "; " is different. "]}
   r,:message[_ .f.size f;data`size;"Size"]
   r,:message[_gtime _ .f.lastModified f;data`saved;"Saved date"]
   r,:message[{:[~.f.isFile x;32#"0";*r:.[.f.getMD5;,x;:];32#"0";r 1]}[f];data`md5hash;"MD5 hash"]
   ]
 .j.ok.i r
 };))
          .,(`j
             .((`h;24;)
               (`font;`"Courier 0 22";)
               (`lfont;`"Dialog 0 16";)
               (`nlfont;`"Helvetica 0 16";))
             ))
         (`s
          ,(`user;21)
          .,(`j
             .,(`t;{[x]
 row:.k.Definition_History[`table.;`j;`s;0;1]
 t:.k.Definition_History`table
 source:.X@t[`source;row]
 .[`;`k`Definition_History`details;:;history_details[t[`action;row];source]]
 };)
             ))
         (`async;2;)
         (`h;24;)
         (`font;`"Courier 0 22";)
         (`lfont;`"Dialog 0 16";)
         (`clfont;`"Helvetica 0 16";))
       ))
   (`details
    "File: C:\\Users\\s1boal\\Documents\\RN2011Q4\\Ann_DE2011Q4_RN_Y.dfa\nLast saved on 1/10/2012 at 13:52:42\nFile Size: 130137\nMD5 Hash: FEF187124AE356EA9C623F8DC319F2E6\nVersion: 5.4.3.0 (40120)\nUpdates:"
    .,(`j
       .((`c;`text;)
         (`l;`Details;)
         (`async;2;)
         (`h;24;)
         (`font;`"Courier 0 22";)
         (`lfont;`"Dialog 0 16";)
         (`cursor;193;.()))
       ))
   (`controls
    .,(`OK
       {.j.d`.k.Definition_History;.j.go'.j.w[]}
       .,(`j
          .((`image;"OK.png";)
            (`l;"";)
            (`fill;`h;)
            (`h;24;)
            (`font;`"Courier 0 22";)
            (`lfont;`"Dialog 0 16";))
          ))
    .,(`j
       .((`c;`panel;)
         (`a
          ,`OK
          )
         (`border;0;)
         (`wy;1e-010;)
         (`async;2;)
         (`h;24;)
         (`font;`"Courier 0 22";)
         (`lfont;`"Dialog 0 16";))
       ))
   (`filter
    .()
    .,(`j
       .,(`async;2;)
       ))
   (`hidden
    (20111010 20111010 20111011 20111011 20111011 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120110 20120112 20120112 20120112 20120529 20120529 20120529 20120529 20120529 20120529 20120529 20120529 20120529 20120529 20120828 20120828 20120829 20120829 20120829
     83921 83952 70442 70502 70514 43510 43648 63837 63908 63918 64409 64431 64443 64532 65242 65333 65551 65601 73855 74052 74100 91339 91518 91542 91553 92030 92042 92450 92459 92512 92546 135230 135312 100131 100222 125815
     `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Alexey Botvinnik" `"Noah Shipley" `"Noah Shipley" `"Noah Shipley" `"Noah Shipley" `"Noah Shipley"
     `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `cow7l0006.internal.cnngad.com `haw7d0021.internal.cnngad.com `haw7d0021.internal.cnngad.com `haw7d0021.internal.cnngad.com `haw7d0021.internal.cnngad.com `haw7d0021.internal.cnngad.com
     `Open `Save `Open `"Batch Import" `Save `Open `Save `Open `"Modify Data" `Save `Open `"Modify Data" `"Batch Import" `Save `Open `"Batch Import" `"Modify Data" `Save `Open `"Modify Data" `Save `Open `"Batch Import" `"Paste Data" `Save `"Modify Data" `Save `"Module Selection" `"Modify Data" `"Module Selection" `Save `Open `Save `Open `Save `Open
     `Root `Root `Root `Root `Root `Root `Root `Root `"\\External Inputs\\Random\\Hashes for Axis Elements\\Common Stock Index\\DE Large Cap" `Root `Root `"\\Execution Properties\\Paths and Computer Resources\\Allocation of Computer Resources\\Compiler Memory (GB)" `Root `Root `Root `Root `"\\Company Inputs\\Investments\\Existing and New Issues\\Equity Derivatives\\Existing Issues and Holdings\\Option Strike\\.." `Root `Root `"\\External Inputs\\Economic Variables and Financial Markets\\Germany (DE)\\Derivatives\\On\\Option Pricing" `Root `Root `Root `Root `Root `"\\Company Inputs\\Economic Variables and Financial Markets\\Global\\Capital Markets\\Risk Neutral Deflator" `Root `Root `"\\External Inputs\\Economic Variables and Financial Markets\\Global\\Martingale Test Switch" `Root `Root `Root `Root `Root `Root `Root)
    ))
 .((`j
    .((`a
       `table `details `controls
       )
      (`c;`panel;)
      (`close;{.j.d`.k.Definition_History;.j.go'.j.w[]};)
      (`l;`"Definition History";)
      (`f1;{help.o `DefinitionEditor_DefinitionHistory.html};)
      (`loc
       381 191
       .())
      (`xy
       657 321
       .())
      (`h;24;)
      (`font;`"Courier 0 22";)
      (`lfont;`"Dialog 0 16";))
    .,(`t;".j.k[];.j.flush[];";))
   (`t;".j.k[];.j.flush[];";)))

panel: serialized[0]
panel.: serialized[1]
panel..j.close:{_exit 0}
panel..j.c:`window

panel..j.xy:(600;400)
.j.Java {
  .j.c `panel
}

 p..j.z: {
 if[1~.k[`panel]; _exit 0]
 }