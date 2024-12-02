docker-compose -f web/docker-compose.yml down &&\
docker-compose -f node/docker-compose.yml down &&\
docker image rm emiss-web &&\
docker image rm emiss-api &&\
docker build -t emiss-api node/. &&\
docker build -t emiss-web web/. &&\
docker-compose -f node/docker-compose.yml up -d &&\
docker-compose -f web/docker-compose.yml up -d
