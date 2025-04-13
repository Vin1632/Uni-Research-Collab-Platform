#!/bin/bash

echo "[INFO]:: Installing Dependecies ......... "
cd fronend/
npm install
cd ../server
npm install
cd ../
npm install
echo "[DONE]: Dependecies installed .... "