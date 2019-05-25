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

python -u manage.py run
