# Menggunakan image nodejs
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Salin semua file ke container
COPY . .

# Install dependencies
RUN npm install

# Expose port (sesuaikan jika perlu)
EXPOSE 8080

# Start aplikasi
CMD ["node", "src/app.js"]
