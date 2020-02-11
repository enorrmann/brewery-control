# brewery-control

docker build https://github.com/enorrmann/brewery-control.git -t brewer 

docker run --privileged --restart always --name brewer -d -p 3000:3000 brewer
