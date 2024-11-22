FROM node:16

# Set working directory
WORKDIR /docker/node

# Copy package.json and package-lock.json from the root directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the backend and public directories into the container
COPY ./backend ./backend
COPY ./public ./public

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["node", "./backend/server.js"]
