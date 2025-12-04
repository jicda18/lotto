#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Astro Server..."

# Start the server
exec yarn start
