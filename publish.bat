@echo off
set /p msg=Enter commit message: 
echo %msg%
git add --all
git commit -m %msg%
git push -u origin main