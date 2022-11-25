FROM node:16-alpine

ENV NODE_ENV=production

RUN npm i -g @nestjs/cli

WORKDIR /opt/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY ./ ./

RUN npx prisma generate
RUN yarn build

CMD ["node", "dist/src/main.js"]
