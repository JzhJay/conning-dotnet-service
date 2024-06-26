/ document the java class structure

\l common/java/j

D:"source/copyright/doc/java"

sub:{.,(`object;{:[#s:(!`.j.class)@&x _in'(),/:`.j.class[;`super];.+(s;_f's@:<s)]}`object)}
sup:{.+(b;{:[~`~*s:(),`.j.class[x;`super];.+(s;_f's@:<s)]}'b@:<b:(!`.j.class)_dvl?,/`.j.class[;`super])}

