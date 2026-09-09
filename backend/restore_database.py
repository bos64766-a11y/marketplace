"""
SNABTASH Database Restore Script
Restores all database tables, products, categories, settings, banners, and users
from backend/fixtures/backup_data.json.
Can be run on any new server, Docker, Railway, Render or local machine:
python restore_database.py
"""
import os
import sys
import subprocess

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def run_restore():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    backup_file = os.path.join(backend_dir, 'fixtures', 'backup_data.json')

    print("=" * 60)
    print("[RESTORE] SNABTASH: Ma'lumotlar bazasini tiklash")
    print("=" * 60)

    if not os.path.exists(backup_file):
        print(f"[XATO] Zaxira fayli topilmadi: {backup_file}")
        sys.exit(1)

    # 1. Migrate first
    print("\n1. Baza jadvallarini yaratish / yangilash (migrate)...")
    try:
        subprocess.run(
            [sys.executable, os.path.join(backend_dir, "manage.py"), "migrate"],
            cwd=backend_dir,
            check=True
        )
        print("[OK] Jadvallar muvaffaqiyatli tayyorlandi.")
    except subprocess.CalledProcessError as e:
        print(f"[XATO] Migratsiyada xatolik: {e}")
        sys.exit(1)

    # 2. Loaddata
    print("\n2. Zaxiradagi barcha ma'lumotlarni yuklash (loaddata)...")
    try:
        subprocess.run(
            [sys.executable, "-Xutf8", os.path.join(backend_dir, "manage.py"), "loaddata", backup_file],
            cwd=backend_dir,
            check=True
        )
        print("\n[MUVAFFAQIN] Barcha ma'lumotlar muvaffaqiyatli tiklandi!")
        print("[INFO] Mahsulotlar, toifalar, bannerlar, sayt sozlamalari va admin akkaunti faol holatga keltirildi.")
    except subprocess.CalledProcessError as e:
        print(f"[XATO] Ma'lumotlarni yuklashda xatolik: {e}")
        sys.exit(1)

if __name__ == '__main__':
    run_restore()
