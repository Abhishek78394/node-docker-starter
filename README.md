# Node.js Docker Application

A simple Node.js Express application containerized with Docker, featuring development hot-reloading and production-ready deployment.

## 🚀 Features

- **Express.js** REST API
- **Docker** containerization with multi-stage builds
- **Hot-reloading** in development with nodemon
- **Production-ready** deployment configuration
- **Health check** endpoint
- **AWS EC2** deployment guide

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- [Node.js](https://nodejs.org/) (for local development without Docker)
- [Git](https://git-scm.com/) for version control

## 🛠️ Project Structure

```
your-app/
├── app.js                    # Main application file
├── package.json              # Node.js dependencies and scripts
├── Dockerfile               # Multi-stage Docker configuration
├── docker-compose.yml       # Development environment
├── docker-compose.prod.yml  # Production environment
├── nodemon.json             # Nodemon configuration for hot-reloading
├── .dockerignore           # Files to ignore in Docker builds
├── deploy.sh               # Deployment script
└── README.md               # This file
```

## 🏃‍♂️ Quick Start

### Clone the Repository
```bash
git clone <your-repository-url>
cd your-app
```

### Development Environment
```bash
# Start development server with hot-reloading
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f
```

Your application will be available at:
- **Main API**: http://localhost:3000
- **Test endpoint**: http://localhost:3000/test
- **Health check**: http://localhost:3000/health

## 🔧 Development

### Local Development (with Docker)

The development environment includes:
- **Hot-reloading** with nodemon
- **Volume mounting** for real-time code changes
- **Development dependencies** installed

```bash
# Start development environment
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild after dependency changes
docker-compose up --build --force-recreate
```

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

### Making Changes

1. Edit any file in the project
2. Changes are automatically detected by nodemon
3. Server restarts automatically
4. Refresh your browser to see changes

### Adding New API Endpoints

Add new routes in `app.js`:

```javascript
app.get('/new-endpoint', (req, res) => {
  res.json({
    message: 'New endpoint created!',
    timestamp: new Date().toISOString()
  });
});
```

Save the file and the server will automatically restart.

## 📦 Production Deployment

### Local Production Testing

Test production build locally:

```bash
# Build and run production version
docker-compose -f docker-compose.prod.yml up --build

# Or in background
docker-compose -f docker-compose.prod.yml up -d --build
```

### AWS EC2 Deployment

#### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose **Ubuntu Server 22.04 LTS** (Free Tier eligible)
3. Select **t2.micro** (Free Tier) or **t3.small** for better performance
4. Create or select a Key Pair
5. Configure Security Group:
   ```
   SSH (22) - Your IP address
   HTTP (80) - 0.0.0.0/0
   HTTPS (443) - 0.0.0.0/0
   Custom TCP (3000) - 0.0.0.0/0
   ```
6. Launch Instance

#### Step 2: Connect to EC2

```bash
# Connect via SSH (replace with your key and IP)
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip

# Make key secure if needed
chmod 400 your-key.pem
```

#### Step 3: Install Docker on EC2

```bash
# Update system
sudo apt update

# Install Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
sudo apt install docker-ce -y

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Verify installations
docker --version
docker-compose --version
```

#### Step 4: Deploy Your Application

```bash
# Clone your repository
git clone <your-repository-url>
cd your-app

# Deploy in production mode
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Step 5: Set Up Nginx (Optional but Recommended)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/your-app
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com your-ec2-public-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### Step 6: Set Up SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Certbot will automatically set up renewal
```

## 📖 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message with timestamp |
| GET | `/test` | Test endpoint |
| GET | `/health` | Health check with uptime |

### Example Responses

**GET /** 
```json
{
  "message": "Hello from Node.js Docker App!",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "environment": "development"
}
```

**GET /health**
```json
{
  "status": "OK",
  "uptime": 123.456,
  "environment": "production"
}
```

## 🔧 Configuration Files

### package.json
```json
{
  "name": "simple-node-app",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

### nodemon.json (Development Hot-reloading)
```json
{
  "watch": ["./"],
  "ext": "js,json",
  "ignore": ["node_modules/", "*.log"],
  "legacyWatch": true,
  "delay": "500"
}
```

### docker-compose.yml (Development)
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      target: development
    ports:
      - "3000:3000"
    volumes:
      - ./:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    stdin_open: true
    tty: true
```

### docker-compose.prod.yml (Production)
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 🚀 Deployment Script

Create `deploy.sh` for easy redeployment:

```bash
#!/bin/bash
echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Rebuild and restart containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

echo "✅ Deployment completed!"

# Show running containers
docker-compose -f docker-compose.prod.yml ps
```

Make it executable and use:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 3000
sudo lsof -i :3000
sudo kill -9 <PID>
```

**Docker permission denied:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

**Container won't start:**
```bash
# Check logs
docker-compose logs app

# Rebuild containers
docker-compose down
docker-compose up --build --force-recreate
```

**Hot-reloading not working:**
```bash
# Ensure nodemon flags are set in Dockerfile
CMD ["nodemon", "--legacy-watch", "--polling-interval", "1000", "app.js"]
```

### Monitoring Commands

```bash
# Check application status
curl http://localhost:3000/health

# Monitor logs
docker-compose logs -f app

# Check container stats
docker stats

# Restart services
docker-compose restart
```

## 🔒 Security Best Practices

1. **Environment Variables**: Use `.env` files for sensitive data
2. **Security Groups**: Restrict EC2 access to necessary ports
3. **SSL/TLS**: Use HTTPS in production
4. **Regular Updates**: Keep dependencies and system updated
5. **Monitoring**: Set up log monitoring and alerts

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Express.js Documentation](https://expressjs.com/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information
4. Include logs and error messages when possible

---

**Happy coding! 🎉**