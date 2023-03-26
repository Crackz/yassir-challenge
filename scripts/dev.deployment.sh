#!/bin/bash
# COLORS
Green='\033[0;32m'
RED='\033[0;31m'
Yellow='\033[0;33m'
NC='\033[0m' # No Color

# Run Containers
echo " ${Green} Starting build development ${NC}"
docker compose -f docker-compose.dev.yml down

if ! [ "$1" = "down" ]; then
    echo " ${Green} Running All Services ${NC}"
    docker compose -f docker-compose.dev.yml up -d --build

    echo " ${Green} Logging ${NC}"
    docker logs yassir-apis -f
fi
