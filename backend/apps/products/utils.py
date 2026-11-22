import base64
import re
import uuid
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


def save_base64_to_storage(data_url, prefix='products', name_hint=None):
    """
    If data_url starts with data:image/, decodes base64 payload,
    saves to default_storage (local MEDIA or S3/R2), and returns the media URL.
    If data_url is already a regular URL/path, returns it unchanged.
    """
    if not data_url or not isinstance(data_url, str):
        return data_url

    trimmed = data_url.strip()
    if not trimmed.startswith('data:image/'):
        return trimmed

    match = re.match(r'^data:image/([a-zA-Z0-9\+\-\.]+);base64,(.+)$', trimmed, re.DOTALL)
    if not match:
        return trimmed

    mime_sub = match.group(1).lower()
    b64_data = match.group(2)

    ext = '.webp'
    if 'png' in mime_sub:
        ext = '.png'
    elif 'jpeg' in mime_sub or 'jpg' in mime_sub:
        ext = '.jpg'
    elif 'svg' in mime_sub:
        ext = '.svg'
    elif 'gif' in mime_sub:
        ext = '.gif'

    try:
        file_bytes = base64.b64decode(b64_data)
    except Exception:
        return trimmed

    safe_id = re.sub(r'[^a-zA-Z0-9_\-]', '', str(name_hint or ''))[:40] if name_hint else ''
    filename = f"{safe_id}_{uuid.uuid4().hex[:8]}{ext}" if safe_id else f"img_{uuid.uuid4().hex[:12]}{ext}"
    storage_path = f"{prefix}/{filename}"

    saved_name = default_storage.save(storage_path, ContentFile(file_bytes))
    return default_storage.url(saved_name)
