/**
 * Game Emulation Module for Nova Proxy
 * Provides routes and functionality for game emulation
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Game systems configuration
const SUPPORTED_SYSTEMS = {
  nes: {
    name: 'Nintendo Entertainment System',
    emulator: 'jsnes',
    extensions: ['.nes'],
    folderPath: '/games/roms/nes'
  },
  gb: {
    name: 'Game Boy',
    emulator: 'javascript-gameboy',
    extensions: ['.gb', '.gbc'],
    folderPath: '/games/roms/gb'
  },
  snes: {
    name: 'Super Nintendo',
    emulator: 'snes9x-js',
    extensions: ['.smc', '.sfc'],
    folderPath: '/games/roms/snes'
  }
};

// Main games page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/games.html'));
});

// System specific page
router.get('/system/:system', (req, res) => {
  const system = req.params.system;
  
  if (!SUPPORTED_SYSTEMS[system]) {
    return res.redirect('/games');
  }
  
  res.sendFile(path.join(__dirname, '../static/system.html'));
});

// Game specific emulator page
router.get('/play/:system/:game', (req, res) => {
  const { system, game } = req.params;
  
  if (!SUPPORTED_SYSTEMS[system]) {
    return res.redirect('/games');
  }
  
  res.sendFile(path.join(__dirname, '../static/play.html'));
});

// API endpoint to get all available systems
router.get('/api/systems', (req, res) => {
  res.json({
    success: true,
    systems: Object.keys(SUPPORTED_SYSTEMS).map(key => ({
      id: key,
      name: SUPPORTED_SYSTEMS[key].name
    }))
  });
});

// API endpoint to get games for a specific system
router.get('/api/games/:system', (req, res) => {
  const system = req.params.system;
  
  if (!SUPPORTED_SYSTEMS[system]) {
    return res.status(404).json({
      success: false,
      error: 'System not found'
    });
  }
  
  const romPath = path.join(__dirname, '../static', SUPPORTED_SYSTEMS[system].folderPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(romPath)) {
    fs.mkdirSync(romPath, { recursive: true });
  }
  
  try {
    const files = fs.readdirSync(romPath);
    const games = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_SYSTEMS[system].extensions.includes(ext);
      })
      .map(file => ({
        id: file,
        title: path.basename(file, path.extname(file))
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase()),
        file: file,
        path: `${SUPPORTED_SYSTEMS[system].folderPath}/${file}`
      }));
    
    res.json({
      success: true,
      system: {
        id: system,
        name: SUPPORTED_SYSTEMS[system].name
      },
      games: games
    });
  } catch (err) {
    console.error('Error reading game directory:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to read games directory'
    });
  }
});

// API endpoint to get game details
router.get('/api/game/:system/:game', (req, res) => {
  const { system, game } = req.params;
  
  if (!SUPPORTED_SYSTEMS[system]) {
    return res.status(404).json({
      success: false,
      error: 'System not found'
    });
  }
  
  const romPath = path.join(
    __dirname, 
    '../static', 
    SUPPORTED_SYSTEMS[system].folderPath, 
    game
  );
  
  if (!fs.existsSync(romPath)) {
    return res.status(404).json({
      success: false,
      error: 'Game not found'
    });
  }
  
  const stats = fs.statSync(romPath);
  
  res.json({
    success: true,
    game: {
      id: game,
      title: path.basename(game, path.extname(game))
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()),
      system: {
        id: system,
        name: SUPPORTED_SYSTEMS[system].name
      },
      file: game,
      path: `${SUPPORTED_SYSTEMS[system].folderPath}/${game}`,
      size: stats.size,
      emulator: SUPPORTED_SYSTEMS[system].emulator
    }
  });
});

module.exports = router;
