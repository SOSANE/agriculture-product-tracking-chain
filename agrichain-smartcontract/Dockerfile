FROM node:22-alpine3.21
ENV TZ America/Toronto

WORKDIR /agrichain-smartcontract
COPY package*.json /agrichain-smartcontract/

RUN npm install
ADD . /agrichain-smartcontract/

RUN npx hardhat compile
CMD ["npx", "hardhat", "node"]

EXPOSE 8545