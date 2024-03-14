# Use a Node.js base image
FROM node:21 AS frontend

# Set the working directory
WORKDIR /frontend

# Copy frontend files
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install


# Copy the rest of the frontend files
COPY frontend ./

# Build frontend
RUN npm run build

# Use a Python base image
FROM python:3.11 AS backend

# Set the working directory
WORKDIR /backend

# Copy backend files
COPY backend/requirements.txt ./
RUN pip install -r requirements.txt

# Copy the rest of the backend files
COPY backend ./

# Expose port 3000 for the frontend and 666 for the backend
EXPOSE 3000
EXPOSE 666

# Start both frontend and backend
CMD bash -c "cd /frontend && serve -s build & cd /backend && python3 app/manager.py"

