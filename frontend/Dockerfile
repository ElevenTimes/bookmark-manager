# frontend/Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
