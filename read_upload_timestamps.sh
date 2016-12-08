#!/bin/bash

# Usage: 
# ./read_upload_timestamps path/to/screenshots/directory/ path/to/rtt_file
# must have forward slash at end of screenshots directory name
# 
# dependencies:
# brew install imagemagick
# brew install tesseract --with-all-languages
# brew install node


INPUT_DIR_="$1"
RTT_PATH="$2"

# Convert jpg to tif and read timestamp with tesseract
for JPG_FILE in $INPUT_DIR_*.jpg; do
	echo "read timestamp from JPG_FILE: $JPG_FILE"
	TIF_FILE="${JPG_FILE//.jpg/.tif}"
	# echo "TIF_FILE:$TIF_FILE"
	convert $JPG_FILE -type Grayscale $TIF_FILE
	# Read timestamps from tif files. Suppress output
	tesseract -l eng "$TIF_FILE" "${TIF_FILE//.tif/}" digits > /dev/null 2>&1
	# rm $TIF_FILE
	# rm $JPG_FILE
done

all_timestamps_filename="all_timestamps.txt"
all_timestamps_path="$INPUT_DIR_$all_timestamps_filename"

for TIMESTAMP in $INPUT_DIR_*.txt; do
	cat $TIMESTAMP >> $all_timestamps_path # upload timestamp
	echo "@@@" >> $all_timestamps_path # upload-download delimiter
	echo "$TIMESTAMP" >> $all_timestamps_path # download timestamp
	echo "==========" >> $all_timestamps_path
	# rm $TIMESTAMP
done

node parse_upload_timestamps.js $all_timestamps_path $RTT_PATH