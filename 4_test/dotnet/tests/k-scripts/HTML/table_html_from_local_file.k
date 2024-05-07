\l common/k/env

p:.()
p..j.l:""
p..j.xy:1200 900
p..j.c:`tab

htm:0:,/(`4:"cd"),"\\hcnotreallytable.htm"
htm:,/-1 _ ,/htm,\:"\n"
htm:_ssr[htm;"C:\\SVN\\IOplus_Global_from_Local";*`4:"cd"]
p.table:htm
p.table..j.c:`html2

.j.Java{
  .j.c `p
}

p..j.close:{_exit 0}
p..j.z: {
  if[1~.k[`autoExit];_exit 0]
  }