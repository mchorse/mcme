# @author McHorse

# Constants
FILE=./build/js/app.js
MAIN=./lib/main.js
HTML=./html/build.php

# Build JS application into one file
build: templates
	mkdir build/js
	browserify $(MAIN) -o $(FILE) -s McME

# Build HTML template
templates:
	rm -rf build
	mkdir build
	
	# Create soft links to assets 
	ln -s ../assets build/assets
	
	php $(HTML)

# Minify JS application
minify: build
	minify -o $(FILE) $(FILE)

# Install dependencies
install:
	bower install