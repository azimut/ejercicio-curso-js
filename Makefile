BACK  := hsl(24,10%,5%)
FRONT := hsl(24,100%,98%)

public/favicon.ico public/apple-touch-icon.png public/header.bmp:
	convert -size 1024x1024 \
		-undercolor none xc:'$(BACK)' \
		-strokewidth 45 \
		-stroke '$(FRONT)' \
		-fill '$(BACK)' \
		-draw "path 'M 1024,0 L    0,1024' \
		       path 'M    0,0 L 1024,1024' \
		       fill $(FRONT) \
		       path 'M 512,512 L 1024,0 L 1024,1024 L 512,512 Z'" \
		\( -clone 0 -resize 128x128 -write public/header.bmp \) \
		\( -clone 0 -resize 180x180 -write public/apple-touch-icon.png \) \
		\( -clone 0 -define icon:auto-resize=64,48,32,16 -write public/favicon.ico \) \
		null:

public/header.svg: public/header.bmp
	potrace $< --svg -o $@

.PHONY: clean
clean:; rm -vf public/favicon.ico public/apple-touch-icon.png public/header.bmp
