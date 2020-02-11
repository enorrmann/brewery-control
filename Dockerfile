FROM node:8.10.0
RUN apt-get update
RUN apt-get install git python build-essential linux-headers
WORKDIR /root
RUN git clone https://github.com/enorrmann/brewery-control
WORKDIR /root/brewery-control
RUN npm install
RUN mkdir /root/.config/brewery-control
RUN touch /root/.config/brewery-control/defaults.prop
WORKDIR /root/brewery-control
CMD node app.js
