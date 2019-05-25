# iCT Gaming Zone

## 1. Prerequites

- python3
- pip3
- docker
- docker-compose

## 2. Start server in development

- In the first time running or when you want to re-create the database, please set `RECREATE_DB` to `true` in `docker-compose.yml`. After running the docker-compose, change it to the default value (false).

~~~
sudo docker-compose up
~~~

- Backend and frontend will be up at port 80.

## 3. Build and up in production

~~~
sudo docker-compose -f docker-compose-prod.yml build --nocache
sudo docker-compose -f docker-compose-prod.yml up
~~~

## 4. API document
[Battleship API](https://hackmd.io/s/B1ch__boV)

See ```OnlineGames.postman_collection.json``` for ```Postman``` API examples.

## 5. Reference

Sample project get from [this article](https://medium.freecodecamp.org/structuring-a-flask-restplus-web-service-for-production-builds-c2ec676de563), [github link](https://github.com/cosmic-byte/flask-restplus-boilerplate)