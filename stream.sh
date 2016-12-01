#!/bin/bash

RES=1280x720
BITRATE_MAX=1500k
BITRATE_TARGET=400k
# If running in a MahiMahi link shell, should be ingress. Otherwise, eth0.
INTF_NAME=ingress

function cleanup {
    kill -9 $pid
    ethtool -K $INTF_NAME tso on gso on
}

ethtool -K $INTF_NAME tso off gso off
rmmod tcp_probe
# Start TCP Probe and write data to tmp file.
modprobe tcp_probe full=1
cat /proc/net/tcpprobe > tmp_tcpprobe_data.out &
pid=$!

trap cleanup INT

#iperf -c 128.30.79.156 -i 1 -t 100

ffmpeg -re -i $1 -c:a aac -b:a 128k -pix_fmt yuv420p -profile:v baseline -s $RES -bufsize 6000k -vb $BITRATE_TARGET -maxrate $BITRATE_MAX -deinterlace -vcodec libx264 -preset veryfast -g 30 -r 30 -f flv "$2"

cleanup
