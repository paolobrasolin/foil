# NOTE: 12.16 seems to have a problem with node-pre-gyp
FROM node:12.13.1-slim
WORKDIR /foil
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /data
# NOTE: to get a shell prompt, use `docker run -it --entrypoint sh foil`
ENTRYPOINT [ "node", "/foil/src/index.js" ]
CMD [ "--help" ]