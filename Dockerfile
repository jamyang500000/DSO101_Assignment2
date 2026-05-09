# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
