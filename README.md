# Nova Proxy

A web proxy forked from Interstellar with enhanced capabilities for GitHub Codespaces compatibility and game emulation support.

## Features

- 🚀 Fast and reliable proxy service (based on Interstellar)
- 💻 GitHub Codespaces compatibility
- 🎮 Game emulation capabilities
- 🔒 HTTPS support for secure browsing
- 🌐 Access to blocked websites
- 🧩 Modern UI with Interstellar's sleek design
- 📱 Mobile-friendly design

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Game Emulation](#game-emulation)
- [GitHub Codespaces Setup](#github-codespaces-setup)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [Git](https://git-scm.com/) (for version control)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nova-proxy.git
cd nova-proxy
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the `.env.example`:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Access the proxy at `http://localhost:8080` (or the port specified in your .env file)

## Deployment

### Standard Deployment

1. Build the production version:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### GitHub Codespaces Deployment

See [GitHub Codespaces Setup](#github-codespaces-setup) section below.

## Configuration

Edit the `.env` file to customize your proxy:

```env
# Server configuration
PORT=8080
SSL=false
SSL_KEY_PATH=./ssl/key.pem
SSL_CERT_PATH=./ssl/cert.pem

# Proxy configuration
PROXY_PREFIX=/proxy/
BARE_PREFIX=/bare/

# Game emulation settings
ENABLE_GAME_EMULATION=true
GAME_ASSETS_PATH=./public/games

# Additional settings
ANALYTICS=false
THEME=dark
```

## Game Emulation

Nova Proxy includes support for game emulation with the following features:

- Built-in emulators for NES, SNES, Game Boy, Game Boy Advance, and more
- ROM loading functionality
- Save states
- Gamepad support

To add custom ROMs:

1. Place ROM files in the `public/games/roms` directory
2. Update the game library configuration in `src/config/games.js`

## GitHub Codespaces Setup

Nova Proxy is fully compatible with GitHub Codespaces, allowing you to develop and run the proxy entirely in the cloud.

### Automatic Setup

1. Click on the "Code" button in your GitHub repository
2. Select "Open with Codespaces"
3. The `.devcontainer` configuration will automatically set up the development environment

### Manual Configuration

If you need to manually configure your Codespace:

1. Create a new Codespace from your repository
2. Open a terminal and run:
```bash
npm install
npm run dev:codespace
```

3. When the server starts, click on the "Ports" tab
4. Find the forwarded port (default 8080) and click "Open in Browser"

## Project Structure

```
nova-proxy/
├── .devcontainer/          # GitHub Codespaces configuration
├── .github/                # GitHub workflows and templates
├── public/                 # Static assets
│   ├── css/                # Stylesheets
│   ├── games/              # Game emulation assets
│   ├── img/                # Images
│   └── js/                 # Client-side JavaScript
├── src/                    # Server-side code
│   ├── bare/               # Bare server implementation
│   ├── config/             # Configuration files
│   ├── emulation/          # Game emulation modules
│   ├── middleware/         # Express middleware
│   ├── proxy/              # Proxy implementation
│   ├── routes/             # Express routes
│   ├── utils/              # Utility functions
│   ├── app.js              # Express application
│   └── index.js            # Entry point
├── views/                  # EJS templates
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore file
├── LICENSE                 # License file
├── package.json            # Node.js package configuration
└── README.md               # Project documentation
```

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
