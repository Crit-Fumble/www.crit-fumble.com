/**
 * AuthService Unit Tests
 * Comprehensive tests for SSO authentication service
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { AuthService } from '../../server/services/AuthService';
import { SsoProvider } from '../../models/auth';
import jwt from 'jsonwebtoken';
// Mock Prisma Client
var mockPrismaClient = {
    user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
    },
};
// Mock Discord SSO Provider
var mockDiscordProvider = {
    provider: SsoProvider.DISCORD,
    getAuthorizationUrl: jest.fn().mockReturnValue('https://discord.com/api/oauth2/authorize?test'),
    exchangeCodeForToken: jest.fn(),
    getUserProfile: jest.fn(),
    refreshToken: jest.fn(),
    revokeToken: jest.fn(),
};
// Mock Auth Config
var mockAuthConfig = {
    jwtSecret: 'test-secret-key-for-jwt-tokens',
    tokenExpiration: '24h',
    sso: {
        discord: {
            clientId: 'test-discord-client-id',
            clientSecret: 'test-discord-client-secret',
            redirectUri: 'http://localhost:3000/auth/discord/callback',
            scopes: ['identify', 'email'],
            guildId: 'test-guild-id',
        },
    },
};
describe('AuthService', function () {
    var authService;
    beforeEach(function () {
        jest.clearAllMocks();
        authService = new AuthService(mockPrismaClient, mockAuthConfig);
    });
    describe('Constructor', function () {
        it('should initialize with Prisma client and auth config', function () {
            expect(authService).toBeInstanceOf(AuthService);
        });
        it('should have Discord provider available', function () {
            var providers = authService.getAvailableProviders();
            expect(providers).toContain(SsoProvider.DISCORD);
        });
    });
    describe('Provider Management', function () {
        it('should add external providers', function () {
            var mockProvider = {
                provider: SsoProvider.WORLDANVIL,
                getAuthorizationUrl: jest.fn(),
                exchangeCodeForToken: jest.fn(),
                getUserProfile: jest.fn(),
                refreshToken: jest.fn(),
                revokeToken: jest.fn(),
            };
            authService.addProvider(SsoProvider.WORLDANVIL, mockProvider);
            var providers = authService.getAvailableProviders();
            expect(providers).toContain(SsoProvider.WORLDANVIL);
        });
        it('should remove providers', function () {
            var result = authService.removeProvider(SsoProvider.DISCORD);
            expect(result).toBe(true);
            var providers = authService.getAvailableProviders();
            expect(providers).not.toContain(SsoProvider.DISCORD);
        });
        it('should return false when removing non-existent provider', function () {
            var result = authService.removeProvider(SsoProvider.WORLDANVIL);
            expect(result).toBe(false);
        });
    });
    describe('Authorization URL Generation', function () {
        it('should generate SSO authorization URL', function () {
            var url = authService.getSsoAuthorizationUrl(SsoProvider.DISCORD, 'test-state');
            expect(url).toContain('https://discord.com/api/oauth2/authorize');
        });
        it('should throw error for unavailable provider', function () {
            expect(function () {
                authService.getSsoAuthorizationUrl(SsoProvider.WORLDANVIL);
            }).toThrow('SSO provider WORLDANVIL not available');
        });
    });
    describe('SSO Callback Handling', function () {
        beforeEach(function () {
            authService.addProvider(SsoProvider.DISCORD, mockDiscordProvider);
        });
        it('should handle successful SSO callback for new user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUserProfile, mockUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUserProfile = {
                            provider: SsoProvider.DISCORD,
                            id: 'discord-123',
                            username: 'testuser',
                            email: 'test@example.com',
                            displayName: 'Test User',
                            avatar: 'https://example.com/avatar.png',
                        };
                        mockDiscordProvider.exchangeCodeForToken.mockResolvedValue({
                            access_token: 'access-token',
                            refresh_token: 'refresh-token',
                            expires_in: 3600,
                        });
                        mockDiscordProvider.getUserProfile.mockResolvedValue(mockUserProfile);
                        mockPrismaClient.user.findFirst.mockResolvedValue(null);
                        mockUser = {
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            emailVerified: null,
                            image: 'https://example.com/avatar.png',
                            discord_id: 'discord-123',
                            worldanvil_id: null,
                            slug: 'test-user',
                            admin: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            data: null,
                        };
                        mockPrismaClient.user.create.mockResolvedValue(mockUser);
                        return [4 /*yield*/, authService.handleSsoCallback(SsoProvider.DISCORD, 'auth-code', 'test-state')];
                    case 1:
                        result = _a.sent();
                        expect(result.success).toBe(true);
                        expect(result.user).toBeDefined();
                        expect(mockPrismaClient.user.create).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle successful SSO callback for existing user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUserProfile, existingUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUserProfile = {
                            provider: SsoProvider.DISCORD,
                            id: 'discord-123',
                            username: 'testuser',
                            email: 'test@example.com',
                            displayName: 'Test User',
                            avatar: 'https://example.com/avatar.png',
                        };
                        mockDiscordProvider.exchangeCodeForToken.mockResolvedValue({
                            access_token: 'access-token',
                            refresh_token: 'refresh-token',
                            expires_in: 3600,
                        });
                        mockDiscordProvider.getUserProfile.mockResolvedValue(mockUserProfile);
                        existingUser = {
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            emailVerified: null,
                            image: 'https://example.com/avatar.png',
                            discord_id: 'discord-123',
                            worldanvil_id: null,
                            slug: 'test-user',
                            admin: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            data: null,
                        };
                        mockPrismaClient.user.findFirst.mockResolvedValue(existingUser);
                        return [4 /*yield*/, authService.handleSsoCallback(SsoProvider.DISCORD, 'auth-code', 'test-state')];
                    case 1:
                        result = _a.sent();
                        expect(result.success).toBe(true);
                        expect(result.user).toBeDefined();
                        expect(mockPrismaClient.user.create).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle SSO callback errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDiscordProvider.exchangeCodeForToken.mockRejectedValue(new Error('Token exchange failed'));
                        return [4 /*yield*/, authService.handleSsoCallback(SsoProvider.DISCORD, 'invalid-code', 'test-state')];
                    case 1:
                        result = _a.sent();
                        expect(result.success).toBe(false);
                        expect(result.error).toContain('Token exchange failed');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Token Verification', function () {
        it('should verify valid JWT token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, token, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mockUser = {
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            emailVerified: null,
                            image: null,
                            discord_id: 'discord-123',
                            worldanvil_id: null,
                            slug: 'test-user',
                            admin: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            data: null,
                        };
                        mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
                        token = jwt.sign({ userId: 'user-123', providers: { discord: 'discord-123' } }, mockAuthConfig.jwtSecret, { expiresIn: '24h' });
                        return [4 /*yield*/, authService.verifyToken(token)];
                    case 1:
                        result = _b.sent();
                        expect(result.success).toBe(true);
                        expect(result.user).toBeDefined();
                        expect((_a = result.user) === null || _a === void 0 ? void 0 : _a.id).toBe('user-123');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reject invalid JWT token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authService.verifyToken('invalid-token')];
                    case 1:
                        result = _a.sent();
                        expect(result.success).toBe(false);
                        expect(result.error).toBe('Invalid or expired token');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reject token for non-existent user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.user.findUnique.mockResolvedValue(null);
                        token = jwt.sign({ userId: 'non-existent-user', providers: { discord: 'discord-123' } }, mockAuthConfig.jwtSecret, { expiresIn: '24h' });
                        return [4 /*yield*/, authService.verifyToken(token)];
                    case 1:
                        result = _a.sent();
                        expect(result.success).toBe(false);
                        expect(result.error).toBe('User not found');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('User Link Status', function () {
        it('should return user link status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            emailVerified: null,
                            image: null,
                            discord_id: 'discord-123',
                            worldanvil_id: null,
                            slug: 'test-user',
                            admin: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            data: null,
                        };
                        mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
                        return [4 /*yield*/, authService.getUserLinkStatus('user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result.success).toBe(true);
                        expect(result.linkedProviders).toContain(SsoProvider.DISCORD);
                        expect(result.linkedProviders).not.toContain(SsoProvider.WORLDANVIL);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle non-existent user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.user.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, authService.getUserLinkStatus('non-existent-user')];
                    case 1:
                        result = _a.sent();
                        expect(result.success).toBe(false);
                        expect(result.error).toBe('User not found');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Legacy Discord Methods', function () {
        it('should generate Discord authorization URL', function () {
            var url = authService.getAuthorizationUrl('http://localhost:3000/callback', 'test-state');
            expect(url).toContain('discord.com/api/oauth2/authorize');
            expect(url).toContain('client_id=test-discord-client-id');
            expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback');
            expect(url).toContain('state=test-state');
        });
        it('should handle Discord callback', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authService.addProvider(SsoProvider.DISCORD, mockDiscordProvider);
                        mockDiscordProvider.exchangeCodeForToken.mockResolvedValue({
                            access_token: 'access-token',
                            refresh_token: 'refresh-token',
                            expires_in: 3600,
                        });
                        mockDiscordProvider.getUserProfile.mockResolvedValue({
                            provider: SsoProvider.DISCORD,
                            id: 'discord-123',
                            username: 'testuser',
                            email: 'test@example.com',
                            displayName: 'Test User',
                            avatar: 'https://example.com/avatar.png',
                        });
                        mockPrismaClient.user.findFirst.mockResolvedValue(null);
                        mockPrismaClient.user.create.mockResolvedValue({
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            emailVerified: null,
                            image: 'https://example.com/avatar.png',
                            discord_id: 'discord-123',
                            worldanvil_id: null,
                            slug: 'test-user',
                            admin: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            data: null,
                        });
                        return [4 /*yield*/, authService.handleCallback('auth-code', 'redirect-uri')];
                    case 1:
                        result = _a.sent();
                        expect(result.success).toBe(true);
                        expect(result.token).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=AuthService.test.js.map