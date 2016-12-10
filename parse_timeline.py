# Script to convert images, as recorded by the chrome remote debugging interface,
# into jpgs. Input:
# -timeline file with snapshots output by record_latency.
# -output dir for jpgs.
import json
import base64
import sys
import os
import time

infile = sys.argv[1]
outdir = sys.argv[2]
f = open(infile)
data = json.load(f)
f.close()

time_since_boot = 0
cur_time = time.time()
with open('/proc/uptime', 'r') as f:
    time_since_boot = float(f.readline().split()[0])
print time_since_boot
if not os.path.exists(outdir):
    os.makedirs(outdir)

delta = 0
for i in xrange(len(data)):
    d = data[i]
    imgbytes = d["args"]["snapshot"]
    ts = float(d["ts"])/1000000
    actual_utc = int(1000*(ts + cur_time - time_since_boot))
    out = open(os.path.join(outdir, '%d_%d.jpg' % (actual_utc, i)), 'w')
    img = base64.standard_b64decode(imgbytes)
    out.write(img)
    out.flush()
    out.close()

