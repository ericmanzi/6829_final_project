#!/bin/bash

RES_DELIM="x"
# RES_W=640
# RES_H=480
RES_W=480
RES_H=360
RES="$RES_W$RES_DELIM$RES_H"
FONTSIZE=$(((3*RES_W)/10))

BITRATE_MAX=4000k
BITRATE_TARGET=500k
# If running in a MahiMahi link shell, should be ingress. Otherwise, eth0.
INTF_NAME=ingress

function cleanup {
    kill -9 $pid
    ethtool -K $INTF_NAME tso on gso on
}

#ethtool -K $INTF_NAME tso off gso off
#rmmod tcp_probe
# Start TCP Probe and write data to tmp file.
#modprobe tcp_probe full=1
#cat /proc/net/tcpprobe > tmp_tcpprobe_data.out &
#pid=$!

#trap cleanup INT

#iperf -c 128.30.79.156 -i 1 -t 100

# ffmpeg -re -i $1 -c:a aac -b:a 128k -pix_fmt yuv420p -profile:v baseline -s $RES -bufsize 6000k -vb $BITRATE_TARGET -maxrate $BITRATE_MAX -deinterlace -vcodec libx264 -preset veryfast -g 30 -r 30 -f flv "$2"

# Stream with timestamp
ffmpeg -re -i $1 -c:a aac -b:a 128k -pix_fmt yuv420p -profile:v baseline -s $RES -tune zerolatency \
-bufsize 6000k -vb $BITRATE_TARGET -maxrate $BITRATE_MAX -deinterlace -vcodec libx264 -preset ultrafast \
-vf "drawbox=y=0:x=0:color=black@0.7:w=iw:h=ih:t=max,drawtext=fontfile=Verdana.ttf:text='%{localtime\:%s}':fontsize=$FONTSIZE:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
-g 30 -r 30 -y -f flv "$2"

#cleanup
