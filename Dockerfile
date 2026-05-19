# === STAGE 1: Build the TypeScript React Frontend ===
FROM node:20-alpine AS frontend-builder
WORKDIR /app
# Copy package files from the frontend folder
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
# Copy the rest of the frontend source code
COPY frontend/ ./frontend/
# Run the Vite production build (compiles TS into static HTML/JS inside frontend/dist)
RUN cd frontend && npm run build

# === STAGE 2: Set up the Production Backend Server ===
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .

# Copy the compiled production assets from Stage 1 into the absolute backend public folder
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 5000
CMD ["npm", "start"]