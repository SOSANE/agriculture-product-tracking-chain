FROM node:22-alpine3.21
ENV TZ America/Toronto

WORKDIR /agrichain-backend
ADD . /agrichain-backend/

RUN npm install

CMD ["/bin/sh", "entrypoint.sh"]
EXPOSE 5000