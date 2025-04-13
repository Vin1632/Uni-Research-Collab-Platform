#!/bin/bash

echo "[INFO]:: Installing Dependecies ......... "
cd frontend/
npm install
cd ../server
npm install
cd ../
npm install
echo "[DONE]: Dependecies installed .... "