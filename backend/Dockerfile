# Stage 1: Build Phase
FROM node:20-alpine AS compiler
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci 
COPY app.js .

# Stage 2: Minimal Runtime Phase
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=compiler /usr/src/app/node_modules ./node_modules
COPY --from=compiler /usr/src/app/app.js .
EXPOSE 5000
CMD ["node", "app.js"]