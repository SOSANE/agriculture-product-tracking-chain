FROM node:22-alpine3.21
ENV TZ America/Toronto

RUN mkdir /agrichain-backend
WORKDIR /agrichain-backend

ADD . /agrichain-backend/

CMD ["/bin/sh", "entrypoint.sh"]

EXPOSE 5000