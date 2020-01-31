FROM node:8.10.0-alpine
RUN apk update
RUN apk add git python build-base linux-headers
RUN cd && git clone https://github.com/enorrmann/brewery-control && cd brewery-control && npm install
RUN apk del build-base linux-headers
RUN mkdir /root/.config/brewery-control
RUN touch /root/.config/brewery-control/defaults.prop
WORKDIR /root/brewery-control
CMD node app.js
