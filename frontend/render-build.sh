#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building React app..."
./node_modules/.bin/react-scripts build

echo "Build complete!"
