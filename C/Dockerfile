FROM gcc:latest

WORKDIR /app

COPY src/hello.c .

RUN gcc hello.c -o halu

CMD ["./halu"]
