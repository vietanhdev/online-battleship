#!/bin/sh

echo "Waiting for database..."

while ! nc -z database 3306; do
  sleep 0.1
  echo "Waiting for DB"
done

echo "Database started"

# Recreate database if needed
if [ "$RECREATE_DB" == "true" ]
then
  python manage.py recreate_db
fi

python manage.py run
