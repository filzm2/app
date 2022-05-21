FROM nexus3.int.netintel.ru/repository/docker-group/nginx:latest
COPY ./dist/psb-bi/ /usr/share/nginx/psb-bi/
COPY front.conf /etc/nginx/conf.d/front.conf
EXPOSE 8080