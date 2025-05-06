#!/usr/bin/env node

/**
 * Nova Proxy - Based on Interstellar
 * A web proxy with GitHub Codespaces compatibility and game emulation
 */

// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const createBareServer = require('@tomphttp/bare-server-node').createBareServer;
const serveStatic = require('serve-static');
const compression = require('compression');
const chalk = require('chalk');

// Create Express application
const app = express();

// Port configuration
const PORT = process.env.PORT || process.env.CODESPACE_PORT || 8080;
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
const RUNNING_IN_CODESPACE = process.env.CODESPACES === 'true';

// Create Bare Server
const bareServer = createBareServer('/bare/', {
  logErrors: true,
  localAddress: undefined
});

// Create HTTP server
const httpServer = http.createServer();

// Configure Express app
app.use(compression());
app.use(serveStatic(path.join(__dirname, 'static')));

// Configure game emulation support if enabled
if (process.env.ENABLE_GAME_EMULATION === 'true') {
  console.log(chalk.green('[Game Emulation] ') + 'Game emulation support is enabled');
  app.use('/games', require('./src/games'));
}

// Setup Codespace specific configurations
if (RUNNING_IN_CODESPACE) {
  console.log(chalk.blue('[Codespace] ') + 'Running in GitHub Codespace environment');
  
  // Add Codespace specific middleware
  app.use((req, res, next) => {
    // Set headers to allow running in Codespace
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  });
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/games', (req, res) => {
  if (process.env.ENABLE_GAME_EMULATION === 'true') {
    res.sendFile(path.join(__dirname, 'static', 'games.html'));
  } else {
    res.redirect('/');
  }
});

// Handle static files route for proxy apps
app.get('/apps/*', (req, res, next) => {
  const filePath = path.join(__dirname, 'static', req.path);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next();
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'static', '404.html'));
});

// Request handler
httpServer.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

// Upgrade handler (for WebSockets)
httpServer.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

// Close handler
httpServer.on('close', () => {
  bareServer.close();
});

// Start the server
httpServer.listen({
  port: PORT,
  hostname: HOSTNAME,
}, () => {
  const serverType = RUNNING_IN_CODESPACE ? 'Codespace' : 'Local';
  const serverAddress = `http://${HOSTNAME === '0.0.0.0' ? 'localhost' : HOSTNAME}:${PORT}`;
  
  console.log(`${chalk.green('[Nova Proxy]')} Server running on ${serverAddress}`);
  console.log(`${chalk.blue('[Server]')} Running in ${serverType} environment`);
  
  if (RUNNING_IN_CODESPACE) {
    console.log(`${chalk.yellow('[Codespace Info]')} Make sure port ${PORT} is forwarded to the public`);
    console.log(`${chalk.yellow('[Codespace Info]')} Visit the "PORTS" tab to manage port visibility`);
  }
});
