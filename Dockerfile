# Use a minimal Node.js image
FROM node:22.14.0-alpine

# Install curl (and any other dependencies you may need)
RUN apk update && apk add --no-cache curl

# Set the working directory
WORKDIR /app

# Copy only package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy server.js to the container
COPY server.js ./

# Create a data directory for JSON files (linked to PVC)
RUN mkdir -p /app/data

# Expose the port
EXPOSE 31010

# Start the Node.js app
CMD ["node", "server.js"]
