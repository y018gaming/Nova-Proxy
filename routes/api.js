const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');

// System status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    version: require('../package.json').version,
    uptime: process.uptime()
  });
});

// Proxy configuration endpoint
router.get('/proxy/config', (req, res) => {
  res.json({
    bareServerUrl: '/bare/',
    corsProxies: [
      'corrosion',
      'ultraviolet',
      'dynamic'
    ],
    defaultProxy: 'ultraviolet'
  });
});

// Configure game emulation settings
router.get('/games/config', (req, res) => {
  res.json({
    supportedSystems: [
      {
        id: 'nes',
        name: 'Nintendo Entertainment System',
        extension: '.nes',
        emulator: 'nestopia'
      },
      {
        id: 'snes',
        name: 'Super Nintendo',
        extension: '.sfc',
        emulator: 'snes9x'
      },
      {
        id: 'gba',
        name: 'Game Boy Advance',
        extension: '.gba',
        emulator: 'mgba'
      },
      {
        id: 'genesis',
        name: 'Sega Genesis',
        extension: '.md',
        emulator: 'genesis_plus_gx'
      },
      {
        id: 'psx',
        name: 'PlayStation',
        extension: '.iso',
        emulator: 'beetle_psx'
      },
      {
        id: 'arcade',
        name: 'Arcade',
        extension: '.zip',
        emulator: 'fbalpha2012'
      }
    ],
    defaultSaves: true,
    allowMultiplayer: true
  });
});

// API documentation
router.get('/', (req, res) => {
  res.json({
    name: 'Nova Proxy API',
    version: '1.0.0',
    endpoints: [
      { path: '/api/status', method: 'GET', description: 'System status' },
      { path: '/api/proxy/config', method: 'GET', description: 'Proxy configuration' },
      { path: '/api/games/config', method: 'GET', description: 'Game emulation configuration' }
    ]
  });
});
