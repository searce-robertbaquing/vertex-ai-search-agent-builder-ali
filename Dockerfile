# Use a base image with Node.js and Python installed
FROM nikolaik/python-nodejs:python3.12-nodejs22

# Set the base working directory
WORKDIR /app

# --- Frontend Setup ---
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY frontend/ ./frontend/
# Set the environment variable for the build command
RUN cd frontend && npm run build

# --- Backend Setup ---
COPY backend/ ./backend/
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# Create the 'static' directory and copy the built frontend into it
RUN mkdir ./static
RUN cp -r /app/frontend/build/* ./static/

# Expose the port your app will run on
EXPOSE 8000

# Final CMD instruction to run the server
CMD [ "sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}" ]