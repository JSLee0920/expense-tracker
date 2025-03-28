# Base image - using Node 23.6
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Expose port (replace 5000 with your backend port)
EXPOSE 8000

# Start the app
CMD ["npm", "start"]