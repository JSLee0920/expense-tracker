FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build for production
RUN npm run build

# Install Vite for serving the app
RUN npm install -g vite

EXPOSE 3000

# Use Vite to serve the built app
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "3000"]