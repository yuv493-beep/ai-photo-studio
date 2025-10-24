# Use an official Node.js runtime as the base image
FROM node:20

# Create app directory
WORKDIR /app/backend

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of your backend source
COPY . .

# Build the TypeScript source to dist/
RUN npm run build

# Expose port (Cloud Run expects 8080)
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
