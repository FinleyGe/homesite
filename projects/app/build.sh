#!/bin/bash

pnpm run build
docker build -t home.f1nley.xyz:5000/homesite-app:latest .
docker push home.f1nley.xyz:5000/homesite-app:latest
