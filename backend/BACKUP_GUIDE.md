# 📦 SNABTASH Database & Media Auto-Backup Guide

Bu tizim ma'lumotlar bazasi (`fixtures/backup_data.json`) va yuklangan media fayllarni (`media/`) muntazam ravishda zaxiralab, avtomatik tarzda GitHub repozitoriyasiga push qilib boradi.

---

## ⚡ 1. Har 12 soatda avtomatik backup qilish (Daemon)

### Windows'da ishga tushirish:
Loyihaning ildiz (root) papkasidagi **`run_auto_backup.bat`** faylini ikki marta bosing yoki terminalda quyidagini tering:
```bash
python backend/auto_backup_daemon.py --hours 12
```

### Linux / VPS serverda ishga tushirish (Background / Systemd):

**Variant A (Nohup orqali orqa fonda):**
```bash
nohup python backend/auto_backup_daemon.py --hours 12 > backend/logs/daemon.log 2>&1 &
```

**Variant B (Linux Crontab orqali har 12 soatda):**
`crontab -e` buyrug'ini tering va quyidagi qatorni qo'shing:
```bash
0 */12 * * * cd /path/to/snabtash && python backend/backup_and_push.py >> backend/logs/backup.log 2>&1
```

---

## 🔄 2. Bir martalik zaxira olish va push qilish:
Istalgan payt qo'lda zaxirani yangilash va Git'ga jo'natish:
```bash
python backend/backup_and_push.py
```

---

## 📥 3. Yangi serverda barcha ma'lumotlarni tiklash (Restore):
Yangi serverda bazani 1 ta buyruq bilan to'liq tiklash:
```bash
python backend/restore_database.py
```
*Bu buyruq `migrate` qilib jadvallarni yaratadi va `backup_data.json` dagi barcha mahsulotlar, toifalar, bannerlar va admin foydalanuvchisini bazaga yuklaydi.*
