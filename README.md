# iCT Gaming Zone

## 1. Prerequites

- python3
- pip3
- docker
- docker-compose

## 2. Install requirement.txt

First, remember to activate your virtual environment. Then, we will start install all the dependencies inside requirement.txt:

```
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

## 3. Database Setup (Using docker-compose)


- Run development mysql(mariadb) and Redis:

~~~
cd mysql_redis_dev
sudo docker-compose up
~~~

## 4. Run Server

First, you need to initialize the database:

```
$ make init_db
$ make update_db
```

Then you just simply run this command:

```
$ make run
```


## 5. Run UI

```
cd ui
yarn
yarn start
```

# API DOCUMENT
[Battleship API](https://hackmd.io/s/B1ch__boV)

See ```OnlineGames.postman_collection.json``` for ```Postman``` API examples.

# Reference

Sample project get from [this article](https://medium.freecodecamp.org/structuring-a-flask-restplus-web-service-for-production-builds-c2ec676de563), [github link](https://github.com/cosmic-byte/flask-restplus-boilerplate)

# EC2 instances

User: Ubuntu
IPs: 52.221.195.89, 52.77.226.146
Private key: sea1.pem