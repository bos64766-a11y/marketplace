"""
SNABTASH Live Cloud Backup Script
Fetches all live data (Products, Orders/Requests, Categories, Sections, Banners, Settings, Partners)
from the deployed backend REST API and saves it to backend/fixtures/live_backup.json.
Can be run locally or autonomously via GitHub Actions.
"""
import os
import sys
import json
import time
import urllib.request
import urllib.error
from datetime import datetime

# Windows console encoding fix
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

BACKEND_API_BASE = os.environ.get("BACKEND_API_BASE", "https://marketplace-production-6690.up.railway.app/api")

def wake_up_server():
    """Wakes up Render free tier container if sleeping."""
    print("-> Server holati tekshirilmoqda (Ping)...")
    url = f"{BACKEND_API_BASE.rstrip('/')}/categories/"
    for attempt in range(1, 4):
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "SnabtashBackupBot/1.0", "Accept": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                if resp.status in (200, 301, 302):
                    print("   ✅ Server faol va tayyor!")
                    return True
        except Exception as e:
            print(f"   ⏳ Server uyg'onmoqda (urinish {attempt}/3, kutilmoqda...): {e}")
            time.sleep(12)
    return False

def fetch_endpoint(name, retries=2):
    url = f"{BACKEND_API_BASE.rstrip('/')}/{name.strip('/')}/"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "SnabtashBackupBot/1.0", "Accept": "application/json"}
    )
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                if resp.status == 200:
                    raw = resp.read().decode('utf-8')
                    return json.loads(raw)
                else:
                    print(f"[OGOHLANTIRISH] {name} status: {resp.status}")
        except Exception as e:
            if attempt < retries:
                time.sleep(5)
                continue
            print(f"[XATO] {name} yuklab olinmadi: {e}")
            return None
    return None

def run_export():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    fixtures_dir = os.path.join(backend_dir, 'fixtures')
    os.makedirs(fixtures_dir, exist_ok=True)

    print("=" * 60)
    print(f"🚀 SNABTASH Jonli Serverdan To'liq Zaxira Olish ({BACKEND_API_BASE})")
    print(f"Vaqt: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    wake_up_server()

    endpoints = [
        ("categories", "Kategoriyalar"),
        ("products", "Mahsulotlar"),
        ("orders", "Zayavkalar / Buyurtmalar (Zakazlar)"),
        ("showcase-sections", "Bo'limlar (Showcase)"),
        ("banners", "Bannerlar"),
        ("settings", "Sayt Sozlamalari"),
        ("partners", "Hamkorlar")
    ]

    backup_bundle = {
        "version": "1.1",
        "exported_at": datetime.now().isoformat(),
        "source": BACKEND_API_BASE,
        "summary": {},
        "data": {}
    }

    success_count = 0
    for ep, label in endpoints:
        print(f"-> {label} yuklanmoqda ({ep})...", end=" ")
        data = fetch_endpoint(ep)
        if data is not None:
            backup_bundle["data"][ep] = data
            count = len(data) if isinstance(data, list) else (1 if isinstance(data, dict) else 0)
            backup_bundle["summary"][ep] = count
            print(f"[OK] ({count} ta)")
            success_count += 1
        else:
            backup_bundle["summary"][ep] = 0
            print("[O'TKAZILDI]")

    if success_count == 0:
        print("[XATO] Serverdan hech qanday ma'lumot olib bo'lmadi! Fayl saqlanmadi.")
        return False

    # Save to live_backup.json
    output_file = os.path.join(fixtures_dir, 'live_backup.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(backup_bundle, f, ensure_ascii=False, indent=2)

    size_kb = os.path.getsize(output_file) / 1024
    print(f"\n✅ To'liq zaxira fayli yaratildi: {output_file} ({size_kb:.1f} KB)")
    print(f"📊 Xulosa: {backup_bundle['summary']}")
    print("=" * 60)
    return True

if __name__ == '__main__':
    success = run_export()
    sys.exit(0 if success else 1)
