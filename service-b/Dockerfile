# Use an official Node.js runtime as a parent image
FROM node:23.3

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files (server.ts, tsconfig.json, etc.)
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the TypeScript file directly
CMD ["npm", "run", "dev"]
