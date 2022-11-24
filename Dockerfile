FROM node:16-alpine

ARG NODE_ENV=production
ENV DATABASE_URL="postgresql://postgres:hODAI7eqUakjfzDGGkEm@containers-us-west-118.railway.app:6485/railway"
ENV NODE_ENV=${NODE_ENV}

RUN npm i -g @nestjs/cli

WORKDIR /opt/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY . .

RUN npx prisma db push
RUN yarn add source-map-support
RUN yarn build

CMD [ "yarn", "start" ]
