#!/bin/sh

echo "Waiting for database..."

while ! nc -z database 3306; do
  sleep 0.1
  echo "Waiting for DB"
done

echo "Database started"

python manage.py run
