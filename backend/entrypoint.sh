#!/bin/sh

set -e
echo "Running database migrations..."
python manage.py migrate

echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:8000 backend.wsgi:application
