# Use a minimal Node.js image
FROM node:14

# Install dependencies required for compiling native modules
RUN apk update && apk add --no-cache \
    curl \
    python3 \
    make \
    g++    # Installing additional build tools

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
