FROM node:18-alpine
WORKDIR /app
COPY package.json ./
COPY server/package.json ./server/
RUN npm install --prefix server --ignore-scripts
COPY . .
RUN npm run build --prefix server
RUN npm prune --prefix server --production
EXPOSE 80
ENV NODE_ENV=production
ENV PORT=80
CMD ["node", "server/dist/main"]
