/ Copyright (c) 2005-2009 Conning Services (Ireland) Limited
/ Keith Mason

/ K File Server

debug:0

\m i 1999

hosts:`localhost`K1`K2`K3`K4
shares:.+(`c`Programs;("C:\\";"C:\\Program Files"))

is_localhost:{x _in`localhost,_h}
root:"kipc://"
is_root:{root~$x}
last:{`$(1+*|&"/"=$x)_$x}
notlast:{:[is_root r:(1+*|&"/"=$x)#$x;`$r;`$-1_ r]}
nodes:{`$root,/:$hosts}
is_node:{x _in nodes[]}
is_local_node:{is_localhost[get_host x]&is_node[x]}
get_host:{r:(&"/"=x)_ x:$x;`$1_ r[1]}
local_shares:{`$(root,($x),"/"),/:$!shares}
is_local_share:{:[is_localhost h:get_host x;x _in local_shares[h];0]}
path_from_share:{sl:(&"/"=x:$x)[3]
                 s:*&local_shares[get_host x]=`$sl#x
                 _ssr[_ssr[shares[][s],sl _ x;"/";"\\"];"\\\\";"\\"]}
is_local:{get_host[x]_in`localhost,_h}
is_remote:{~is_local x}
make_local:{`$_ssr[$x;"kipc://",$get_host x;"kipc://localhost"]}
send:{h:get_host[*y];:[*r:.[4:;((h;1999);(x;y));:];_n;r 1]}

canRead:{[x] / canRead
  if[debug;`0:,"canRead[",(5:x),"]"]
  :[is_root x;1
    is_node x;1
    is_local x;1
    send[`canRead;,x]]}

canWrite:{[x] / canWrite
  if[debug;`0:,"canWrite[",(5:x),"]"]
  :[is_root x;0
    is_node x;0
    is_local x;1
    send[`canWrite;,x]]}

createNewFile:{[x] / createNewFile
  0}

delete:{[x] / delete
  0}

deleteOnExit:{[x] / deleteOnExit
}

equals:{[x;y] / equals
  if[debug;`0:,"equals[",(5:x),";",(5:y),"]"]
  x~y}

exists:{[x] / exists
  if[debug;`0:,"exists[",(5:x),"]"]
  :[is_root x;1
    is_node x;1
    is_local_share x;1
    is_local x;~*.[!:;,path_from_share x;:]
    send[`exists;,x]]}

getAbsolutePath:{[x] / getAbsolutePath
  if[debug;`0:,"getAbsolutePath[",(5:x),"]"]
  x}

getCanonicalPath:{[x] / getCanonicalPath
  if[debug;`0:,"getCanonicalPath[",(5:x),"]"]
  x}

getName:{[x] / getName
  if[debug;`0:,"getName[",(5:x),"]"]
  :[is_root x;`"DFA Filer Network";last x]}

getParent:{[x] / getParent
  if[debug;`0:,"getParent[",(5:x),"]"]
  :[is_root x;_n;notlast x]}

isDirectory:{[x] / isDirectory
  if[debug;`0:,"isDirectory[",(5:x),"]"]
  :[is_root x;1
    is_node x;1
    is_local_share x;1
    is_local x;0~4:*|.[!:;,path_from_share x;:]
    send[`isDirectory;,x]]}

isFile:{[x] / isFile
  if[debug;`0:,"isFile[",(5:x),"]"]
  :[is_root x;0
    is_node x;0
    is_local_share x;0
    is_local x;6~4:*|.[!:;,path_from_share x;:]
    send[`isFile;,x]]}

isHidden:{[x] / isHidden
  0}

lastModified:{[x] / lastModified
  0}

length:{[x] / length
  0}

list_:{[x;y] / list_
  `$(x,"/"),/:!y}

list:{[x] / list
  if[debug;`0:,"list[",(5:x),"]"]
  :[is_root x;nodes[]
    is_local_node x;local_shares[get_host x]
    is_local_share x;list_[$x;shares[][*&x=local_shares[get_host x]]]
    is_local x;list_[$x;path_from_share x]
    send[`list;,x]]}

mkdir:{[x] / mkdir
!-1}

mkdirs:{[x] / mkdirs
!-1}

renameTo:{[x;y] / renameTo
!-1}

setLastModified:{[x;y] / setLastModified
!-1}

setReadOnly:{[x] / setReadOnly
!-1}

