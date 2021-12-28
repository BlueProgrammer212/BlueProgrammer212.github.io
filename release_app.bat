@echo off
SETLOCAL 
set /p release_name=App title: 
set /p description=Description:
set /p version=Version:
set /p allowLogs=Enable publish logs (Y/N): 
IF not exist publish_logs mkdir publish_logs
IF %allowLogs%==Y cd publish_logs && @echo Release date: %DATE% Release Name: %release_name% > publish_log_record.log
echo Release date: %DATE%
echo Publishing %release_name%, version %version%; 
ping www.pixcel.ml -n 3 > nul
git add --all
git commit -m "Added new release, %DATE% %release_name% %version%"
set /p pullNewCommits=Pull new commits? (Y/N):
IF %pullNewCommits%==Y git pull -v
echo Progress: [---------------------------------]: 0%
git push -u origin main
ping www.pixcel.ml -n 3 > nul
echo Progress: [################-----------------]: 23%
ping www.pixcel.ml -n 3 > nul
echo Progress: [#######################----------]: 71%
node ../publish_release.js %release_name% %description% %version% 
ping www.pixcel.ml -n 3 > nul
echo Published %release_name% %version% successfully! Progress: [######################################] 100%.
ping www.pixcel.ml -n 3 > nul 
ENDLOCAL
