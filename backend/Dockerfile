# Use Node.js LTS version
FROM node:18-alpine

# Create and set the working directory
WORKDIR /app

# Install dependencies (bcrypt requires build tools)
# Install Python & build tools required for bcrypt compilation
# RUN apk add --no-cache python3 make g++ \
#     && python3 -m ensurepip \
#     && pip3 install --upgrade pip

# Copy package.json and lock file first for better caching
COPY package*.json ./

# Install Node.js dependencies (including bcrypt)
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the backend port (e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
