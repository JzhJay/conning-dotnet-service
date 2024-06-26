/ Copyright (c) 2000-2007,2010-2011 Conning Services (Ireland) Limited
/ Josef Sachs, Kim Balls

/ csv <-> k

csv.pp:{r:(-2+#$%3.)!17;."\\p ",$x;r}							/ set print precision, returns previous setting
csv.sk:{										/ string(s) from K object
 :[~t:4:x          ;_f'x								/   argument is a list, so recurse
   -3=t            ;_ssr[x;"\"";"\"\""]							/   argument is a string, so escape double-quotes
   t _in 1 2 -1 -2 ;.r.num.f'[0;x]							/   argument is numeric
                    _f@$x ]}								/   argument is symbol (what about 3, 5, 6 or 7?)
csv.qs_:{[quotables;text]								/ "quotify" only as necessary
 :[0=4:text              ; _f[quotables]'text
   |/quotables _lin text ; "\"",text,"\""
                           text ]}
csv.qs:{:[4:x;"\"",x,"\"";_f'x]}							/ "quotify" everything
csv.ks:{:[~4:x;_f'x;~&/x _lin .r.NUM[];`$x;(p:*0#x)_in(0;0.);.r.num.g[p;x];`$x]}	/ K object from string [apparently not used anywhere]
csv.sm:{p:csv.pp 0;r:.w.cbw.csv   csv.qs_["\"\n",.r`slist] csv.sk x;csv.pp p;r}		/ CSV string from matrix (used by .j.cb.w for `Csv)
csv.sm_:-1_ csv.sm@
csv.lm:{p:csv.pp 0;r:csv.ls[*.r`slist]'csv.qs_["\"\n",.r`slist] csv.sk x;csv.pp p;r}	/ array to list of strings (one per line) [apparently not used anywhere]
csv.ls:{[separator;strings] (#separator)_,/separator,/:strings}				/ line from list of strings (note absence of trailing CRNL, which is handled by .w.cbwrite)
csv.ms:{.u.cut'[*.r`slist;-1_'-1_ .u.cut["\n";x]]}                                      / csv string to text string array
csv.mst:{.u.cut'[*.r`slist;.u.cut["\n";x]]}                                             / slist and newline separated text string to text string array
csv.w:{.w.cbwrite[`Csv;,csv.sm x]}							/ os write csv [apparently not used anywhere]
csv.r: {:[_n~r:.w.cbread`Csv ;();csv.ms r]}						/ os read csv  (used by .j.cb.r for `Csv and `CSV)
csv.rt:{:[_n~r:.w.cbread`text;();csv.mst 1_,/"\n",/:r]}					/ os read text (used by .j.cb.r for `text)
csv.tk:{p:csv.pp 0;r:csv.ls["\t"]'csv.qs_["\n"]            csv.sk x;csv.pp p;r}		/ list of tab-delimited strings from K object (note absence of trailing CRNL, which is handled by .w.cbwrite) (used by .j.cb.w for `text)

/ write csv of matrix d incrementally to f
csv.smf:{[f;d]
 p:csv.pp 0
 .f.append6[f;"\r\n"]
 i:0;do[#d;r:.w.cbw.csv1 csv.sk d i;.f.append6[f;r];i+:1]
 csv.pp p
}

/ in common/java/k/java.k,
/  .j.cb.r calls csv.r  and csv.rt
/  .j.cb.w calls csv.sm and csv.tk
