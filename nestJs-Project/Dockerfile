# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /src/main

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the JSON data file into the container
COPY sample.json /src/sample.json

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start:prod"]
