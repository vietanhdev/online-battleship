# base image
FROM python:3.7.2-slim

# install netcat
RUN apt-get update && \
    apt-get -y install netcat && \
    apt-get -y install libgtk2.0-dev && \
    apt-get clean

# set working directory
WORKDIR /usr/src/backend

# add and install requirements
COPY ./requirements.txt /usr/src/backend/requirements.txt
RUN pip install -r requirements.txt

# add entrypoint.sh
COPY ./entrypoint.sh /usr/src/backend/entrypoint.sh
RUN chmod +x /usr/src/backend/entrypoint.sh

# add app
COPY . /usr/src/backend

# run server
CMD ["bash", "/usr/src/backend/entrypoint.sh"]
