"""
SNABTASH Automated Database & Media Backup to Git Repository
1. Dumps all database models to backend/fixtures/backup_data.json
2. Stages backup_data.json and backend/media/
3. Commits and pushes to GitHub repository if changes are detected
"""
import os
import sys
import subprocess
from datetime import datetime

# Windows console encoding fix
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def log(msg, log_file=None):
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    formatted = f"[{now}] {msg}"
    print(formatted)
    if log_file:
        try:
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(formatted + '\n')
        except Exception:
            pass

def backup_and_push():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(backend_dir)
    fixtures_dir = os.path.join(backend_dir, 'fixtures')
    os.makedirs(fixtures_dir, exist_ok=True)
    
    logs_dir = os.path.join(backend_dir, 'logs')
    os.makedirs(logs_dir, exist_ok=True)
    log_file = os.path.join(logs_dir, 'backup.log')

    log("=" * 60, log_file)
    log("[BACKUP] Zaxira jarayoni boshlandi...", log_file)

    backup_file = os.path.join(fixtures_dir, 'backup_data.json')

    # 0. Fetch live cloud database from Railway (live_backup.json)
    try:
        export_script = os.path.join(backend_dir, "export_live_backup.py")
        subprocess.run([sys.executable, export_script], cwd=backend_dir, check=True)
        log("[OK] Jonli serverdan (Railway) yangi zaxira olindi (live_backup.json)", log_file)
    except Exception as e:
        log(f"[OGOHLANTIRISH] Jonli serverdan zaxira olishda ogohlantirish: {e}", log_file)

    # 1. Dump database to fixture
    dump_cmd = [
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
        subprocess.run(dump_cmd, cwd=backend_dir, check=True)
        size_kb = os.path.getsize(backup_file) / 1024
        log(f"[OK] Baza muvaffaqiyatli eksport qilindi ({size_kb:.1f} KB)", log_file)
    except subprocess.CalledProcessError as e:
        log(f"[XATO] Bazani eksport qilishda xatolik: {e}", log_file)
        return False

    # 2. Stage backup files and media
    try:
        subprocess.run(
            [
                "git", "add",
                "backend/fixtures/backup_data.json",
                "backend/fixtures/live_backup.json",
                "backend/media/"
            ],
            cwd=repo_root,
            check=True
        )
    except subprocess.CalledProcessError as e:
        log(f"[XATO] Git add bajarilmadi: {e}", log_file)
        return False

    # 3. Check if there are staged changes
    diff_check = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        cwd=repo_root
    )

    if diff_check.returncode == 0:
        log("[INFO] Hech qanday yangi o'zgarish yo'q. Git commit o'tkazib yuborildi.", log_file)
        log("=" * 60, log_file)
        return True

    # 4. Commit changes
    now_str = datetime.now().strftime('%Y-%m-%d %H:%M')
    commit_msg = f"chore(backup): auto-backup live database and media [{now_str}]"
    try:
        subprocess.run(
            ["git", "commit", "-m", commit_msg],
            cwd=repo_root,
            check=True
        )
        log(f"[OK] Git commit qilindi: {commit_msg}", log_file)
    except subprocess.CalledProcessError as e:
        log(f"[XATO] Git commit bajarilmadi: {e}", log_file)
        return False

    # 5. Push to remote(s)
    try:
        branch_res = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=repo_root,
            capture_output=True,
            text=True,
            check=True
        )
        branch = branch_res.stdout.strip() or "main"

        pushed_any = False
        for remote in ["origin", "upstream"]:
            try:
                subprocess.run(
                    ["git", "push", remote, branch],
                    cwd=repo_root,
                    capture_output=True,
                    text=True,
                    check=True
                )
                log(f"[OK] {remote} repozitoriyga muvaffaqiyatli push qilindi (branch: {branch})", log_file)
                pushed_any = True
            except Exception as push_err:
                log(f"[OGOHLANTIRISH] {remote} ga push xatoligi (balki mavjud emas): {push_err}", log_file)

        log("=" * 60, log_file)
        return pushed_any
    except Exception as e:
        log(f"[XATO] Git push bajarilmadi: {e}", log_file)
        log("=" * 60, log_file)
        return False

if __name__ == '__main__':
    backup_and_push()
