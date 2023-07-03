#!/usr/bin/bash

# Commit all changes to the repository

git add .
git commit -m "$1"
git push -u origin main

