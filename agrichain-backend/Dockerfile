FROM node:22-alpine3.21
ENV TZ America/Toronto

WORKDIR /agrichain-backend
COPY package*.json /agrichain-backend/

RUN npm install
ADD . /agrichain-backend/

CMD ["/bin/sh", "entrypoint.sh"]
EXPOSE 5000