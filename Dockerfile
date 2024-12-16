# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Use a minimal Node.js runtime to serve the app
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app/build ./build

# Install a simple web server to serve the static files
RUN npm install -g serve

# Expose port 5000 to the outside world
EXPOSE 5005

# Command to run the app
CMD ["serve", "-s", "build", "-l", "5005"]