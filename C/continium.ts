mkfifo continium.raw
ffmpeg -f rawvideo -pix_fmt rgba -s 1920x1080 -i continium.raw \
       -f mpegts continium.ts
