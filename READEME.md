# Prerequites

Ensure that you've already install these following packages:
* python 3
* pip3
* virtualenv
* MySql

# Install requirement.txt

First, remember to activate your virtual environment. Then, we will start install all the dependencies inside requirement.txt:

```
$ virtualenv -p python3 venv
$ source /venv/bin/activate
$ pip3 install -r requirement.txt
```

# Database Setup

We'll create the MySQL database. and then log in as the root user:

```
$ mysql -u root

mysql> CREATE USER 'online_games'@'localhost' IDENTIFIED BY 'Flask#123';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE DATABASE online_games_db;
Query OK, 1 row affected (0.00 sec)

mysql> GRANT ALL PRIVILEGES ON online_games_db . * TO 'online_games'@'localhost';
Query OK, 0 rows affected (0.00 sec)
```

# Run Project

First, you need to initialize the database:

```
$ make init_db
$ make update_db
```

Then you just simply run this command:

```
$ make run
```

# Reference

Sample project get from [this article](https://medium.freecodecamp.org/structuring-a-flask-restplus-web-service-for-production-builds-c2ec676de563), [github link](https://github.com/cosmic-byte/flask-restplus-boilerplate)