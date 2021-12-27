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
node ../publish_release.js
ping www.pixcel.ml -n 3 > nul
echo Progress: [#######################----------]: 71%
ping www.pixcel.ml -n 3 > nul
echo Published %release_name% %version% successfully! Progress: [######################################] 100%.
ping www.pixcel.ml -n 3 > nul 
set /a prog = 0
set /a progress_s = ....................
:a
echo Completing workflow: 

IF %prog% == 10 set /a progress_s =  ##..................
IF %prog% == 20 set /a progress_s =  ####................
IF %prog% == 30 set /a progress_s =  ######..............
IF %prog% == 40 set /a progress_s =  ########............
IF %prog% == 50 set /a progress_s =  ##########..........
IF %prog% == 60 set /a progress_s =  ############........
IF %prog% == 70 set /a progress_s =  ##############......
IF %prog% == 80 set /a progress_s =  ################....
IF %prog% == 90 set /a progress_s =  ##################..
IF %prog% == 100 set /a progress_s = ####################

echo Progress: [%progress_s%]: %prog% %
ping 127.0.0.1 -n 1 > nul
set /a prog = %prog% + 5
cls
goto a

ENDLOCAL
