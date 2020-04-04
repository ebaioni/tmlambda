#!/bin/bash

if [ -d ".git/hooks" ]; then
    rm -f .git/hooks/pre-push
    cp ./scripts/githooks/pre-push .git/hooks/
    chmod +x .git/hooks/pre-push
fi
