#!/bin/sh
echo "Waiting for database..."

while ! nc -z database 3306; do
  sleep 0.1
  echo "Waiting for DB"
done


while ! nc -z redis 6379; do
  sleep 0.1
  echo "Waiting for Redis"
done

echo "Database started"

python manage.py recreate_db
python manage.py seed_db
gunicorn -b 0.0.0.0:5000 manage:app
