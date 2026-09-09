"""
SNABTASH Database Backup Script
Exports all database tables, products, categories, settings, partners, banners, and orders
into backend/fixtures/backup_data.json (UTF-8).
Can be run anytime: python backup_database.py
"""
import os
import sys
import subprocess

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def run_backup():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    fixtures_dir = os.path.join(backend_dir, 'fixtures')
    os.makedirs(fixtures_dir, exist_ok=True)
    backup_file = os.path.join(fixtures_dir, 'backup_data.json')

    print("=" * 60)
    print("[BACKUP] SNABTASH: Barcha ma'lumotlar bazasini zaxiraga olish")
    print("=" * 60)

    cmd = [
        sys.executable,
        "-Xutf8",
        os.path.join(backend_dir, "manage.py"),
        "dumpdata",
        "--indent", "2",
        "--exclude", "auth.permission",
        "--exclude", "contenttypes",
        "-o", backup_file,
    ]

    try:
        subprocess.run(cmd, cwd=backend_dir, check=True)
        if os.path.exists(backup_file):
            size_kb = os.path.getsize(backup_file) / 1024
            print(f"\n[OK] Zaxira muvaffaqiyatli saqlandi: backend/fixtures/backup_data.json ({size_kb:.1f} KB)")
            print("[INFO] Ushbu fayl orqali istalgan yangi serverda ma'lumotlarni 1 ta buyruq bilan tiklash mumkin.")
        else:
            print("[XATO] Fayl topilmadi.")
    except subprocess.CalledProcessError as e:
        print(f"[XATO] Xatolik yuz berdi: {e}")

if __name__ == '__main__':
    run_backup()
