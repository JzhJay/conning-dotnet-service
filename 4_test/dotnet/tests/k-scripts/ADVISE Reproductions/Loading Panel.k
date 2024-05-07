p..j.c: `panel
p..j.l: "Loading Panel"
p..j.xy: (400;66)

p.Status: "Initializing Definition Editor..."
p.Status..j.c: `label
p.Status..j.anchor: `c
p.Status..j.halign: `c
/p.Status..j.h: 20

p.Status2: "Last operation: 5 seconds, total time: 17 seconds"
p.Status2..j.c: `label
p.Status2..j.anchor: `c
p.Status2..j.halign: `c
/p.Status2..j.h: 20

p.progressBar: 0
p.progressBar..j.c: `progress
p.progressBar..j.indeterminate: 1
p.progressBar..j.border: 0
/p.progressBar..j.fill: `b

/p.progressBar..j.h: 20

.j.Java{
  .j.c `p
};

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
