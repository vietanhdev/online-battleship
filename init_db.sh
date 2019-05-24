#!/bin/bash

# create
docker-compose exec backend python manage.py recreate_db
