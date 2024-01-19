# facefocuser3000

Interactive visuals for a neorave

## Useful commands

```sh
# split into segments
ffmpeg -i input.webm -an -f segment -vcodec copy -reset_timestamps 1 output.%d.webm
# combine segments
ffmpeg -f concat -safe 0 -i playlist.txt -c copy output.webm
```
