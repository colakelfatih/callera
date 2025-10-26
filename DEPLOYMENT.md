# 🚀 Callera Deployment Guide

## Node.js 24 Deployment Configuration

This project is configured for Node.js 24 and includes multiple deployment options.

### 📋 Prerequisites

- Node.js 24.x (required)
- npm 10.x or higher
- Docker (optional)

### 🔧 Configuration Files

#### 1. **package.json**
```json
{
  "engines": {
    "node": ">=24.0.0",
    "npm": ">=10.0.0"
  }
}
```

#### 2. **.nvmrc**
```
24
```

#### 3. **nixpacks.toml** (for Railway/Vercel)
```toml
[phases.setup]
nixPkgs = ["nodejs_24"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

#### 4. **railway.json** (for Railway)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 🐳 Docker Deployment

#### Local Docker Build
```bash
# Build with Node.js 24.10.0
docker build -t callera .

# Run container
docker run -p 3000:3000 callera
```

#### Production Docker Build
```bash
# Use the Railway-specific Dockerfile
docker build -f Dockerfile.railway -t callera-railway .
```

### 🌐 Platform-Specific Deployment

#### Railway
1. Connect your GitHub repository
2. Railway will automatically detect the `nixpacks.toml` configuration
3. Ensure Node.js 24 is selected in the environment variables
4. Deploy!

#### Vercel
1. Connect your GitHub repository
2. Vercel will use the `nixpacks.toml` configuration
3. Set Node.js version to 24 in project settings
4. Deploy!

#### Other Platforms
- Ensure the platform supports Node.js 24
- Use the provided `Dockerfile` for containerized deployments
- Set `NODE_VERSION=24` in environment variables

### 🔍 Troubleshooting

#### Node.js Version Issues
If you see errors like:
```
You are using Node.js 18.20.5. For Next.js, Node.js version ">=20.9.0" is required.
```

**Solutions:**
1. Update your deployment platform to use Node.js 24
2. Use the `nixpacks.toml` configuration file
3. Set environment variable: `NODE_VERSION=24`
4. Use the provided Dockerfile with explicit Node.js 24.10.0

#### Build Failures
1. Ensure `package-lock.json` is committed
2. Run `npm ci` instead of `npm install`
3. Check that all dependencies are compatible with Node.js 24

### 📊 Build Verification

The Dockerfile includes version verification:
```dockerfile
# Verify Node.js version
RUN node --version && npm --version
```

This will output:
```
v24.10.0
11.6.1
```

### 🎯 Production Checklist

- [ ] Node.js 24.x installed
- [ ] `package-lock.json` committed
- [ ] Environment variables set
- [ ] Build passes locally
- [ ] Docker build successful (if using containers)
- [ ] Health checks configured
- [ ] Monitoring set up

### 🚀 Quick Deploy Script

Use the provided `deploy.sh` script:
```bash
chmod +x deploy.sh
./deploy.sh
```

This script will:
1. Check Node.js version compatibility
2. Install dependencies
3. Build the application
4. Start the server

---

**Note:** This project requires Node.js 24.x for optimal performance and compatibility with Next.js 16.
