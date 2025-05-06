const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Serve the game emulation UI
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/games/index.html'));
});

// List available game ROMs for a specific system
router.get('/roms/:system', (req, res) => {
  const system = req.params.system;
  const validSystems = ['nes', 'snes', 'gba', 'genesis', 'psx', 'arcade'];
  
  if (!validSystems.includes(system)) {
    return res.status(400).json({ error: 'Invalid system specified' });
  }
  
  const romsDir = path.join(__dirname, '../public/games/roms', system);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(romsDir)) {
    fs.mkdirSync(romsDir, { recursive: true });
    return res.json({ roms: [] });
  }
  
  try {
    const roms = fs.readdirSync(romsDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        switch (system) {
          case 'nes': return ext === '.nes';
          case 'snes': return ext === '.sfc' || ext === '.smc';
          case 'gba': return ext === '.gba';
          case 'genesis': return ext === '.md' || ext === '.bin';
          case 'psx': return ext === '.bin' || ext === '.iso' || ext === '.cue';
          case 'arcade': return ext === '.zip';
          default: return false;
        }
      })
      .map(file => ({
        id: file,
        name: path.basename(file, path.extname(file)).replace(/[_-]/g, ' '),
        path: `/games/roms/${system}/${file}`
      }));
      
    res.json({ roms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error reading ROM directory' });
  }
});

// Save game progress endpoint
router.post('/save/:system/:gameId', express.json(), (req, res) => {
  const { system, gameId } = req.params;
  const { saveData, slot } = req.body;
  
  if (!saveData) {
    return res.status(400).json({ error: 'No save data provided' });
  }
  
  const savesDir = path.join(__dirname, '../public/games/saves', system);
  
  // Create saves directory if it doesn't exist
  if (!fs.existsSync(savesDir)) {
    fs.mkdirSync(savesDir, { recursive: true });
  }
  
  const saveFilename = path.join(savesDir, `${gameId}.${slot || 0}.sav`);
  
  try {
    // Base64 decode the save data and write to file
    const buffer = Buffer.from(saveData, 'base64');
    fs.writeFileSync(saveFilename, buffer);
    res.json({ success: true, message: 'Game saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Load game save endpoint
router.get('/save/:system/:gameId/:slot?', (req, res) => {
  const { system, gameId, slot = 0 } = req.params;
  const saveFilename = path.join(__dirname, '../public/games/saves', system, `${gameId}.${slot}.sav`);
  
  try {
    if (fs.existsSync(saveFilename)) {
      const saveData = fs.readFileSync(saveFilename);
      res.json({ 
        success: true, 
        saveData: saveData.toString('base64') 
      });
    } else {
      res.status(404).json({ error: 'No save file found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load save file' });
  }
});

module.exports = router;
