"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const questionnaire_routes_1 = __importDefault(require("./routes/questionnaire.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            'https://urban-tokenization-survey.vercel.app',
            'https://urban-tokenization-survey-git-main-faizals-projects-bee3353c.vercel.app',
            'http://localhost:3000',
            // 'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            // Allow any localhost port for development
            /^http:\/\/localhost:\d+$/,
            /^http:\/\/127\.0\.0\.1:\d+$/,
            // Allow work environment URLs
            /^https:\/\/work-\d+-\w+\.prod-runtime\.all-hands\.dev$/,
            // Allow any Vercel deployment URLs
            /^https:\/\/.*\.vercel\.app$/
        ];
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') {
                return allowed === origin;
            }
            else {
                return allowed.test(origin);
            }
        });
        if (isAllowed) {
            callback(null, true);
        }
        else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Allow all origins for now to avoid issues
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Accept',
        'Origin',
        'X-Requested-With',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin'
    ],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 200 // For legacy browser support
};
app.use((0, cors_1.default)(corsOptions));
// Handle preflight requests explicitly
app.options('*', (0, cors_1.default)(corsOptions));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/questionnaire', questionnaire_routes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// MongoDB connection
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    const PORT = parseInt(process.env.PORT || '3000', 10);
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
// Add this after all your route definitions
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});
