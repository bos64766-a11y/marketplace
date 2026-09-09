"""
SNABTASH Auto Backup Daemon (Every 12 Hours)
Runs database backup and pushes to Git repository automatically every 12 hours.

Usage:
    python auto_backup_daemon.py
    python auto_backup_daemon.py --hours 12
    python auto_backup_daemon.py --now
"""
import os
import sys
import time
import argparse
from datetime import datetime, timedelta

# Import backup_and_push from current directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from backup_and_push import backup_and_push, log

# Console encoding fix
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def main():
    parser = argparse.ArgumentParser(description="SNABTASH 12-hour Auto Backup Daemon")
    parser.add_argument("--hours", type=float, default=12.0, help="Backup interval in hours (default: 12)")
    parser.add_argument("--now", action="store_true", default=True, help="Run backup immediately upon start")
    args = parser.parse_args()

    interval_seconds = int(args.hours * 3600)
    logs_dir = os.path.join(backend_dir, 'logs')
    os.makedirs(logs_dir, exist_ok=True)
    log_file = os.path.join(logs_dir, 'backup.log')

    print("=" * 60)
    print(f"🚀 SNABTASH: Avtomatik zaxira xizmati ishga tushdi!")
    print(f"⏱️  Har {args.hours} soatda ({interval_seconds} sekund) bazani yangilab GitHub'ga push qiladi.")
    print(f"📝 Jurnallar: {log_file}")
    print(f"To'xtatish uchun: Ctrl+C")
    print("=" * 60)

    log(f"[DAEMON] Avtomatik zaxiralash xizmati faollashtirildi (Interval: {args.hours} soat)", log_file)

    if args.now:
        try:
            backup_and_push()
        except Exception as e:
            log(f"[XATO] Boshlang'ich zaxirada xatolik: {e}", log_file)

    while True:
        next_run = datetime.now() + timedelta(seconds=interval_seconds)
        next_run_str = next_run.strftime('%Y-%m-%d %H:%M:%S')
        log(f"[KUTILMOQDA] Keyingi zaxiralash vaqti: {next_run_str}", log_file)

        # Sleep in short increments of 10s for responsive exit on Ctrl+C / SIGINT
        remaining = interval_seconds
        while remaining > 0:
            sleep_chunk = min(remaining, 10)
            time.sleep(sleep_chunk)
            remaining -= sleep_chunk

        try:
            backup_and_push()
        except KeyboardInterrupt:
            raise
        except Exception as e:
            log(f"[XATO] Tsikldagi zaxira xatosi: {e}", log_file)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Avtomatik zaxira xizmati to'xtatildi.")
