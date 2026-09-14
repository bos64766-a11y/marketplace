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

    # 2. Check if database already has products - NEVER OVERWRITE EXISTING USER DATA!
    try:
        check_cmd = [
            sys.executable,
            os.path.join(backend_dir, "manage.py"),
            "shell",
            "-c",
            "from apps.products.models import Product; import sys; sys.exit(0 if Product.objects.count() == 0 else 42)"
        ]
        res = subprocess.run(check_cmd, cwd=backend_dir)
        if res.returncode == 42:
            print("\n[HIMOYA] Baza bo'sh emas (mahsulotlar allaqachon mavjud).")
            print("[HIMOYA] Yangi kiritilgan mahsulotlar o'chib ketmasligi uchun zaxiradan qayta yuklanmadi.")
            return
    except Exception as e:
        print(f"[OGOHLANTIRISH] Baza tekshirishda ogohlantirish: {e}")

    # 3. Loaddata only if database is completely empty
    print("\n2. Yangi bazaga dastlabki ma'lumotlarni yuklash (loaddata)...")
    try:
        subprocess.run(
            [sys.executable, "-Xutf8", os.path.join(backend_dir, "manage.py"), "loaddata", backup_file],
            cwd=backend_dir,
            check=True
        )
        print("\n[MUVAFFAQIN] Dastlabki ma'lumotlar muvaffaqiyatli yuklandi!")
    except subprocess.CalledProcessError as e:
        print(f"[XATO] Ma'lumotlarni yuklashda xatolik: {e}")
        sys.exit(1)

if __name__ == '__main__':
    run_restore()
