FROM ubuntu:18.04
RUN apt-get update
RUN apt-get -y dist-upgrade
RUN apt-get install -y npm nodejs git
RUN cd && git clone https://github.com/enorrmann/brewery-control && cd brewery-control && npm install
RUN mkdir /root/.config
RUN mkdir /root/.config/brewery-control
RUN touch /root/.config/brewery-control/defaults.prop
WORKDIR /root/brewery-control
CMD node app.js
