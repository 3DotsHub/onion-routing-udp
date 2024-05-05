# onion-routing-udp

Research and Development: Peer discovery, Onion routing, Hidden service, Rondevu points over UDP

# Description

### Application Env

```
KEYS=VALUES
```

## Docker Environment

### Build image

```bash
docker build --tag xxx:0.0.1 .
docker build --tag xxx:0.0.1 --no-cache .
```

### Create attachable swarm overlay network

```bash
docker network create --driver overlay --attachable --subnet=172.18.0.0/16 onion-routing-udp
```

### Develop application inside the container

if you have docker desktop running, you can develop locally inside the container.

```bash
# rsync local to master swarm node
rsync -azP --delete . <user>@<host>:~/vol/onion-routing-udp/_data

# goto app
cd <to app directory>

# run app with docker run from current app directory
docker run -dit --rm --mount type=bind,source="$(pwd)",target=/data node bash -c "cd /data && npm run start:dev"
docker run -it --rm --mount type=bind,source="$(pwd)",target=/data node bash -c "cd /data && npm run start:dev"

# with network and static ip ??? breaks ???
docker run -it --rm --mount type=bind,source="$(pwd)",target=/data --net onion-routing-udp --ip 172.18.0.2 node bash -c "cd /data && npm run start:dev"

docker service create --mount type=bind,source="$(pwd)",target=/data node bash -c "cd /data && npm run start:dev"
```

## Installation

```bash
$ npm install
$ npm run build
```

## Protobuf

```bash
npx protoc --ts_out protos --proto_path protos protos/xxx.proto
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
