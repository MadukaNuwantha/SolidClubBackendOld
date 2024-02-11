# Build time
FROM node:20
WORKDIR /app

# Grab the package.json and npm install
COPY package.json .
RUN npm install

# Optimization to not re-run npm install if no new npm packages installed
# This double re-adding COPY package.json as it doesn't change often
COPY . ./
EXPOSE 8080

# Runtime
CMD ["node", "server.js"]