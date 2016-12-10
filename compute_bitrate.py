import sys

# Takes in the log/rtt_0 file.
f = open(sys.argv[1])
count = 0
first_ts = 0
last_ts = 0
for line in f.read().splitlines():
    if line.startswith("Loaded"):
        parts = line.split()
        relevant = parts[1]
        nums = relevant.split(",")
        if first_ts == 0:
            first_ts = float(nums[1])
        last_ts = float(nums[1])
        count = count + long(nums[2])

print '%f bits/sec' % (count * 8 / (last_ts - first_ts))
