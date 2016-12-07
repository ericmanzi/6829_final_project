# Script to convert images, as recorded by the chrome remote debugging interface,
# into jpgs. Input:
# -timeline file with snapshots output by record_latency.
# -output dir for jpgs.
import json
import base64
import sys
import os 

infile = sys.argv[1]
outdir = sys.argv[2]
f = open(infile)
data = json.load(f)
f.close()

delta = 0
for i in xrange(len(data)):
    d = data[i]
    imgbytes = d["args"]["snapshot"]
    ts = long(d["ts"])
    utc = long(d["utc"])
    actual_utc = utc
    if delta == 0:
        delta = utc * 1000 - ts
    else:
        actual_utc = (ts + delta)/1000
    out = open(os.path.join(outdir, '%s_%d.jpg' % (actual_utc, i)), 'w')
    img = base64.standard_b64decode(imgbytes)
    out.write(img)
    out.flush()
    out.close()

