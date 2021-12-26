@echo off
SETLOCAL 
set /p release_name=App title: 
set /p description=Description:
set /p version=Version:
set /p allowLogs=Enable publish logs (Y/N): 
IF not exist publish_logs mkdir publish_logs
IF %allowLogs%==Y cd publish_logs && @echo Release date: %DATE% Release Name: %release_name% > publish_log_record.log
echo Release date: %DATE%
echo Publishing %release_name%, version %version%
ENDLOCAL

