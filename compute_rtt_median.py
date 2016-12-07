# Computes stats for RTTs recorded by record_latency.js
# Input: rtt trace file output by record_latency.js.
import sys.

infile = sys.argv[1]

for line in open(infile).splitlines():
    parts = line.split(',');

