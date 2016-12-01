#!/bin/bash

# Usage: ./read_timestamps $INPUT_FILE $FPS
# dependencies:
# brew install imagemagick
# brew install tesseract --with-all-languages
# brew install node


INPUT_FILE="$1"
FPS="$2" # images/frames per second

# Convert video to image sequence
OUTPUT_DIR="img_seq_$INPUT_FILE"
rm $OUTPUT_DIR
mkdir $OUTPUT_DIR
# mkdir "timestamp_$OUTPUT_DIR"
# echo $OUTPUT_DIR
# For some reason ffmpeg's tif output is corrupt, so output to png then converting to tif
ffmpeg -i $INPUT_FILE -r $FPS "$OUTPUT_DIR/out_%04d.png"


# Convert png to tif. 
for PNG_FILE in $OUTPUT_DIR/*.png; do
	echo $PNG_FILE
	# Convert png to tif
	convert $PNG_FILE -resize 200% -type Grayscale "$PNG_FILE.tif"
	# Read timestamps from tif files
	echo "$PNG_FILE.tif"
	tesseract -l eng "$PNG_FILE.tif" "$PNG_FILE"
	# echo $PNG_FILE
	rm $PNG_FILE
	rm "$PNG_FILE.tif"
done

touch "timestamps_$INPUT_FILE.txt"
# cd "$OUTPUT_DIR"
for TIMESTAMP in $OUTPUT_DIR/*.txt; do
	cat $TIMESTAMP >> "timestamps_$INPUT_FILE.txt"
	echo "---" >>  "timestamps_$INPUT_FILE.txt"
	rm $TIMESTAMP
done

node parse_timestamps.js "timestamps_$INPUT_FILE.txt"

