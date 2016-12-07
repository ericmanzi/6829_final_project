import json
import base64
import sys

infile = sys.argv[1]
f = open(infile)
data = json.load(f)
f.close()

for i in xrange(len(data)):
    d = data[i]
    imgbytes = d["args"]["snapshot"]
    out = open('test_screenshots/screenshot_%d.jpg' % i, 'w')
    img = base64.standard_b64decode(imgbytes)
    out.write(img)
    out.flush()
    out.close()

