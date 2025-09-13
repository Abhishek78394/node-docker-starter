FROM node:18-alpine as base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base as development
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
CMD ["nodemon", "app.js"]

# Production stage
FROM base as production
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
