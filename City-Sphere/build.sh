#!/bin/bash

# Set up build directory
BUILD_DIR="dist"
mkdir -p $BUILD_DIR

# Copy HTML files
cp -r src/html/* $BUILD_DIR/
cp -r src/images $BUILD_DIR/
cp -r src/css $BUILD_DIR/
cp -r src/js $BUILD_DIR/

# Minify CSS (requires clean-css-cli)
for css_file in $BUILD_DIR/css/*.css; do
    cleancss -o "${css_file%.css}.min.css" "$css_file"
done

# Minify JavaScript (requires terser)
for js_file in $BUILD_DIR/js/*.js; do
    terser "$js_file" -o "${js_file%.js}.min.js"
done

# Optimize images (requires imagemin-cli)
imagemin $BUILD_DIR/images/* --out-dir=$BUILD_DIR/images

echo "Build complete. Output in $BUILD_DIR"
