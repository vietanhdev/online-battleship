.PHONY: clean system-packages python-packages install tests run all

clean:
	find . -type f -name '*.pyc' -delete
	find . -type f -name '*.log' -delete

system-packages:
	sudo apt install python-pip -y

python-packages:
	pip3 install -r requirements.txt

install: system-packages python-packages

init_db:
	python3 manage.py db init

update_db:
	python3 manage.py db migrate --message 'update database migration'
	python3 manage.py db upgrade

tests:
	python3 manage.py test

run:
	python3 manage.py run

all: clean install tests run