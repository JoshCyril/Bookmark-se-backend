# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install

# Copy the wait-for-it.sh script into the container
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Make the script executable
RUN chmod +x /usr/src/app/wait-for-it.sh

# Start the Node.js application
CMD ["node", "app.js"]
