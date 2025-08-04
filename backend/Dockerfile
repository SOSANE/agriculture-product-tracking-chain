FROM node:22-alpine3.21
ENV TZ America/Toronto

WORKDIR /backend
COPY package*.json /backend/

RUN npm install
ADD . /backend/

CMD ["/bin/sh", "entrypoint.sh"]
EXPOSE 5000