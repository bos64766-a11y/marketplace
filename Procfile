web: (test -d backend && cd backend || true) && python manage.py migrate && gunicorn snabtash_core.wsgi:application --bind 0.0.0.0:$PORT
