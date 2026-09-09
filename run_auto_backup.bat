@echo off
title SNABTASH 12-Hour Auto Backup Daemon
echo ========================================================
echo   SNABTASH Auto Backup Daemon (Every 12 Hours)
echo ========================================================
cd /d "%~dp0backend"
python auto_backup_daemon.py --hours 12
pause
