docker service rm onion-routing
docker service create --mount type=bind,source="$(pwd)",target=/data --replicas 5 --name onion-routing node bash -c "cd /data && npm run start"
docker service logs -f onion-routing