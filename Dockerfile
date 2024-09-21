# Use an official node image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY componenteditor/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY componenteditor/ .

# Build the application for production
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]
