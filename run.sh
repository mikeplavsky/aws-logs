docker build -t aws-logs .

docker run -ti --name=aws-logs \
    --rm -v$(pwd):/aws-logs  \
    aws-logs bash
