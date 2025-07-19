FROM node:22-alpine3.21
ENV TZ America/Toronto

RUN mkdir /agrichain-smartcontract
WORKDIR /agrichain-smartcontract

ADD . /agrichain-smartcontract/

CMD ["/bin/sh", "entrypoint.sh"]

EXPOSE 8545