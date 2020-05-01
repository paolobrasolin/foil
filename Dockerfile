# NOTE: 12.16 seems to have a problem with node-pre-gyp
FROM node:12.13.1-alpine
# NOTE: this avoids "Error: Error loading shared library ld-linux-x86-64.so.2: No such file or directory (needed by /foil/node_modules/@pdftron/pdfnet-node/lib/libPDFNetC.so"
RUN apk add --no-cache libc6-compat && ln -s /lib64/ld-linux-x86-64.so.2 /lib/ld-linux-x86-64.so.2
WORKDIR /foil
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /data
# NOTE: to get a shell prompt, use `docker run -it --entrypoint sh foil`
ENTRYPOINT [ "node", "/foil/src/index.js" ]
CMD [ "--help" ]