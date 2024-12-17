# Use an official Node.js runtime as a parent image
FROM node:23 AS build

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
FROM node:23-alpine

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



# TEMP

# # Use an official Node.js runtime as a parent image
# FROM node:20 AS build

# # Set the working directory
# WORKDIR /app

# # Copy the package.json and package-lock.json
# COPY package*.json ./

# # Copy the rest of the application code
# COPY . .

# # Build the app (if you have a build process)
# RUN npm run build

# # Use a minimal Node.js runtime to serve the app
# FROM node:20-alpine

# # Set the working directory
# WORKDIR /app

# # Copy node_modules from your local machine to the Docker image
# COPY node_modules /app/node_modules

# # Copy the build output from the previous stage
# COPY --from=build /app/build /app/build

# # Install a simple web server to serve the static files
# RUN npm install -g serve

# # Expose port 5005 to the outside world
# EXPOSE 5005

# # Command to run the app
# CMD ["serve", "-s", "build", "-l", "5005"]


## TEST

# # Use an official Node.js runtime as a parent image
# FROM node:20-alpine

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json (if needed for installation or build process)
# COPY package*.json ./

# # Copy node_modules from the local machine to the Docker image
# COPY node_modules /app/node_modules

# # Copy the rest of the application code and build output
# COPY . .

# # Install a simple web server to serve static files
# RUN npm install -g serve

# # Expose port 5005 to the outside world
# EXPOSE 5005

# # Command to run the app
# CMD ["serve", "-s", "build", "-l", "5005"]

