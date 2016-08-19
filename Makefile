# @author McHorse

# Constants
FILE=./app.js
MAIN=./lib/main.js

# Build JS application into one file
build:
	browserify $(MAIN) -o $(FILE) -s McME

# Minify JS application
minify: build
	minify -o $(FILE) $(FILE)