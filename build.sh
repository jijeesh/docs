docker build -f Dockerfile.build -t jijeesh/docs:build .
docker build -f Dockerfile.prod -t jijeesh/docs:prod .


# Write your commands here
docker run --name jijeeshdocs --rm -d jijeesh/docs:prod

docker cp jijeeshdocs:/usr/share/nginx/html/docs ./docs
docker stop jijeeshdocs