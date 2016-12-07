#!/bin/bash

# usage ./compileMP$withTimestamp.sh /Users/ericmanzi/Desktop/6.829/project/dash-proxy/dash-md

cd $1
pwd
for v in *init.m4v *0.m4v; \
	do ffmpeg -i "${v}" -vf "drawtext=fontfile=/Users/ericmanzi/Desktop/6.829/project/Verdana.ttf: text='$(stat -f %Sa $v | cut -d ' ' -f4 | sed s/:/\\\\:/g)':fontsize=40:fontcolor=white:box=1:boxcolor=black:x=w-text_w-(w/20):y=H-H/6" -y "${v//.m4v/t.m4v}"; \
done

for vt in *initt.m4v *0t.m4v; \
	do ffmpeg -i "${vt}" -i "${vt//t.m4v/.m4a}" -acodec copy -vcodec copy -pix_fmt yuv420p -profile:v baseline "${vt//t.m4v/.mp4}"; \
done