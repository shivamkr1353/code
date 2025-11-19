# Use Node v18 (Debian-based) as the base
FROM node:18

# ---------------------------------------------------
# 1. Install MySQL Server (MariaDB is the default for Debian)
# ---------------------------------------------------
RUN apt-get update && \
    apt-get install -y default-mysql-server && \
    rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------
# 2. Setup Node.js Application
# ---------------------------------------------------
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# ---------------------------------------------------
# 3. Configuration & Startup Script
# ---------------------------------------------------
# Set environment variables for the app to read
ENV DB_HOST=localhost
ENV DB_USER=root
ENV DB_PASS=root
ENV DB_NAME=placement

# Create a startup script on the fly
RUN echo "#!/bin/bash" > start.sh && \
    echo "echo 'Starting MySQL...'" >> start.sh && \
    echo "service mariadb start" >> start.sh && \
    echo "sleep 5" >> start.sh && \
    echo "echo 'Creating Database...'" >> start.sh && \
    echo "mysql -e \"CREATE DATABASE IF NOT EXISTS placement;\"" >> start.sh && \
    echo "echo 'Loading Schema (Before setting password)...'" >> start.sh && \
    # --- CHANGED: IMPORT SQL FIRST ---
    # Ensure the filename matches exactly what is in your folder (student.sql vs schema.sql)
    echo "mysql placement < \"Mysql Database/student.sql\"" >> start.sh && \
    echo "echo 'Setting Root Password...'" >> start.sh && \
    # --- CHANGED: SET PASSWORD SECOND ---
    echo "mysql -e \"ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('root');\"" >> start.sh && \
    echo "echo 'Starting Node.js App...'" >> start.sh && \
    echo "node index.js" >> start.sh && \
    chmod +x start.sh

# Expose the port
EXPOSE 8080

# Run the script when container starts
CMD ["./start.sh"]