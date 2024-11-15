docs/favicon.ico docs/apple-touch-icon.png:
	convert -size 1024x1024 \
		-undercolor none xc:'hsl(24,10%,5%)' \
		-strokewidth 45 \
                -stroke 'hsl(24,100%,98%)' \
		-fill 'hsl(24,10%,5%)' \
		-draw "path 'M 1024,0 L    0,1024' \
		       path 'M    0,0 L 1024,1024' \
		       fill hsl(24,100%,98%) \
                       path 'M 512,512 L 1024,0 L 1024,1024 L 512,512 Z'" \
		\( -clone 0 -resize 180x180 -write docs/apple-touch-icon.png \) \
		\( -clone 0 -define icon:auto-resize=64,48,32,16 -write docs/favicon.ico \) \
		null:

.PHONY: clean
clean:; rm -vf docs/favicon.ico docs/apple-touch-icon.png
