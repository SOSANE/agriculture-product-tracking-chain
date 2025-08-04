FROM node:22-alpine3.21
ENV TZ America/Toronto

WORKDIR /smartcontract
COPY package*.json /smartcontract/

RUN npm install
ADD . /smartcontract/

RUN npx hardhat compile
CMD ["npx", "hardhat", "node"]

EXPOSE 8545