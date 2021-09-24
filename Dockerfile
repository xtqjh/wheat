##################
### production ###
##################

# base image
FROM nginx:1.13.9-alpine

ENV API_IP=49.235.24.149:9000

ADD nginx.conf /etc/nginx/nginx.conf.template

ADD docker-entrypoint.sh /
RUN  mkdir -p /usr/share/nginx/html && \
     chmod 777 /docker-entrypoint.sh

COPY ./dist /usr/share/nginx/html

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]


#FILES=wheat
# NAMES=172.16.111.21:5000/wheat
# docker build -f Dockerfile -t xtqjh/wheat .
# docker stop $FILES
# docker rm -f $FILES
# docker rmi $NAMES
# docker pull $NAMES
# docker run -d --env API_IP=172.16.111.11:8087 --restart=always --name $FILES -p 42000:80 --rm $NAMES
# docker run -d -e API_IP=172.16.111.11:8087 --restart=always --name=wheat -p 31001:80 --rm 172.16.111.21:5000/wheat:tag
# docker run -d -e API_IP=111.0.99.143:9000 --restart=always --name=wheat -p 31001:80 xtqjh/wheat
# docker run -d -e API_IP=49.235.24.149:9000 --restart=always --name=wheat -p 31001:80 xtqjh/wheat
# docker ps -a --filter name=$FILES

# server {
#      listen 8087;
#      server_name localhost;
#      location / {
#           proxy_pass http://localhost:31001/;
#      }
# }