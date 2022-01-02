@echo off
set /p nmsg=New commit message:
git commit --amend -m "%nmsg%"