# @author McHorse

# Constants
FILE=./build/js/app.js
MAIN=./lib/main.js
HTML=./html/build.php
BUILD=./build

# Build JS application into one file
build: templates
	mkdir build/js
	browserify $(MAIN) -o $(FILE) -s McME

# Build HTML template
templates: clean
	mkdir build
	
	ln -s ../assets build/assets
	
	php $(HTML)

# Minify JS application
minify: build
	minify -o $(FILE) $(FILE)

# Install dependencies
install:
	bower install

clean:
	rm -rf build