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
sleep 1;
git add --all
git commit -m "Added new release, %DATE% %release_name% %version%"
set /p pullNewCommits=Pull new commits? (Y/N):
IF %pullNewCommits%==Y git pull -v
echo Progress: [---------------------------------]: 0%
git push -u origin main
sleep 3;
echo Progress: [################-----------------]: 23%
node ../publish_release.js
sleep 3;
echo Progress: [#######################----------]: 71%
sleep 3;
echo Published %release_name% %version% successfully! Progress: [######################################] 100%.
ENDLOCAL
