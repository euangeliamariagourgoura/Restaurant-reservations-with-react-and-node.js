const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

console.log('\n📁 Bootstrapping Express Application...\n');

let app;
let config;
let routes;

// Load config
try {
    config = require('./config');
    console.log('✅ Config loaded');
} catch (err) {
    console.error('❌ Failed to load config:', err);
    process.exit(1);
}

// Load routes
try {
    routes = require('./routes');
    console.log('✅ Routes loaded');
} catch (err) {
    console.error('❌ Failed to load routes:', err);
    process.exit(1);
}

// Initialise Express
try {
    app = express();

    // Trust proxy if behind reverse proxy (optional)
    app.set('trust proxy', 1);

    // Middleware stack
    app.use(express.json());
    app.use(helmet());

    const corsOptions = require('./config/cors');
    app.use(cors(corsOptions));

    if (config.app.env === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined', { stream: logger.stream }));
    }

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            environment: config.app.env,
            timestamp: new Date().toISOString()
        });
    });

    // Mount routes
    app.use('/api', routes);

    // Fallbacks
    app.use(notFoundHandler);
    app.use(errorHandler);

    console.log('✅ Express app initialised');
} catch (err) {
    console.error('❌ Failed to initialise Express app:', err);
    process.exit(1);
}

module.exports = app;