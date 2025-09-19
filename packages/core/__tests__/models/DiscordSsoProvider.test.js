/**
 * DiscordSsoProvider Unit Tests
 * Tests for Discord SSO authentication provider
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
import { DiscordSsoProvider } from '../../models/auth/DiscordSsoProvider';
import { SsoProvider } from '../../models/auth/SsoModels';
// Mock node-fetch with proper ES module support
var mockFetch = jest.fn();
jest.mock('node-fetch', function () { return mockFetch; });
describe('DiscordSsoProvider', function () {
    var discordProvider;
    var mockConfig = {
        clientId: 'discord-client-id',
        clientSecret: 'discord-client-secret',
        redirectUri: 'http://localhost:3000/auth/discord/callback',
        scopes: ['identify', 'email'],
        guildId: 'test-guild-id',
    };
    beforeEach(function () {
        jest.clearAllMocks();
        discordProvider = new DiscordSsoProvider(mockConfig.clientId, mockConfig.clientSecret, mockConfig.redirectUri, mockConfig.scopes, mockConfig.guildId);
    });
    describe('Constructor', function () {
        it('should initialize with correct provider type', function () {
            expect(discordProvider.provider).toBe(SsoProvider.DISCORD);
        });
        it('should work without optional guildId', function () {
            var providerWithoutGuild = new DiscordSsoProvider(mockConfig.clientId, mockConfig.clientSecret, mockConfig.redirectUri, mockConfig.scopes);
            expect(providerWithoutGuild.provider).toBe(SsoProvider.DISCORD);
        });
    });
    describe('getAuthorizationUrl', function () {
        it('should generate Discord authorization URL', function () {
            var params = {
                clientId: mockConfig.clientId,
                redirectUri: mockConfig.redirectUri,
                scopes: mockConfig.scopes,
                state: 'test-state',
                responseType: 'code',
            };
            var url = discordProvider.getAuthorizationUrl(params);
            expect(url).toContain('https://discord.com/api/oauth2/authorize');
            expect(url).toContain("client_id=".concat(mockConfig.clientId));
            expect(url).toContain("redirect_uri=".concat(encodeURIComponent(mockConfig.redirectUri)));
            expect(url).toContain("scope=".concat(encodeURIComponent('identify email')));
            expect(url).toContain('state=test-state');
            expect(url).toContain('response_type=code');
        });
        it('should handle scopes array properly', function () {
            var params = {
                clientId: mockConfig.clientId,
                redirectUri: mockConfig.redirectUri,
                scopes: ['identify', 'email', 'guilds'],
            };
            var url = discordProvider.getAuthorizationUrl(params);
            expect(url).toContain("scope=".concat(encodeURIComponent('identify email guilds')));
        });
        it('should use default response_type if not provided', function () {
            var params = {
                clientId: mockConfig.clientId,
                redirectUri: mockConfig.redirectUri,
                scopes: mockConfig.scopes,
            };
            var url = discordProvider.getAuthorizationUrl(params);
            expect(url).toContain('response_type=code');
        });
    });
    describe('exchangeCodeForToken', function () {
        it('should exchange authorization code for access token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockTokenResponse, mockResponse, params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockTokenResponse = {
                            access_token: 'discord-access-token',
                            token_type: 'Bearer',
                            expires_in: 604800,
                            refresh_token: 'discord-refresh-token',
                            scope: 'identify email',
                        };
                        mockResponse = {
                            ok: true,
                            json: jest.fn().mockResolvedValue(mockTokenResponse),
                        };
                        mockFetch.mockResolvedValue(mockResponse);
                        params = {
                            code: 'authorization-code',
                            clientId: mockConfig.clientId,
                            clientSecret: mockConfig.clientSecret,
                            redirectUri: mockConfig.redirectUri,
                            grantType: 'authorization_code',
                        };
                        return [4 /*yield*/, discordProvider.exchangeCodeForToken(params)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockTokenResponse);
                        expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/oauth2/token', expect.objectContaining({
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle token exchange errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockErrorResponse, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockErrorResponse = {
                            ok: false,
                            status: 400,
                            json: jest.fn().mockResolvedValue({
                                error: 'invalid_grant',
                                error_description: 'Invalid authorization code',
                            }),
                        };
                        mockFetch.mockResolvedValue(mockErrorResponse);
                        params = {
                            code: 'invalid-code',
                            clientId: mockConfig.clientId,
                            clientSecret: mockConfig.clientSecret,
                            redirectUri: mockConfig.redirectUri,
                        };
                        return [4 /*yield*/, expect(discordProvider.exchangeCodeForToken(params)).rejects.toThrow('Failed to exchange code for token: invalid_grant - Invalid authorization code')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle network errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockRejectedValue(new Error('Network error'));
                        params = {
                            code: 'authorization-code',
                            clientId: mockConfig.clientId,
                            clientSecret: mockConfig.clientSecret,
                            redirectUri: mockConfig.redirectUri,
                        };
                        return [4 /*yield*/, expect(discordProvider.exchangeCodeForToken(params)).rejects.toThrow('Failed to exchange code for token: Network error')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUserProfile', function () {
        it('should get user profile from Discord API', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockDiscordUser, mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDiscordUser = {
                            id: '123456789',
                            username: 'testuser',
                            discriminator: '1234',
                            email: 'test@example.com',
                            verified: true,
                            avatar: 'avatar-hash',
                            public_flags: 0,
                        };
                        mockResponse = {
                            ok: true,
                            json: jest.fn().mockResolvedValue(mockDiscordUser),
                        };
                        mockFetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, discordProvider.getUserProfile('access-token')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            id: '123456789',
                            username: 'testuser#1234',
                            email: 'test@example.com',
                            displayName: 'testuser',
                            avatar: 'https://cdn.discordapp.com/avatars/123456789/avatar-hash.png',
                            provider: SsoProvider.DISCORD,
                            providerData: {
                                discriminator: '1234',
                                verified: true,
                                public_flags: 0,
                            },
                        });
                        expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/users/@me', expect.objectContaining({
                            headers: { Authorization: 'Bearer access-token' },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle user without avatar', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockDiscordUser, mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDiscordUser = {
                            id: '123456789',
                            username: 'testuser',
                            discriminator: '1234',
                            email: 'test@example.com',
                            verified: true,
                            avatar: null,
                            public_flags: 0,
                        };
                        mockResponse = {
                            ok: true,
                            json: jest.fn().mockResolvedValue(mockDiscordUser),
                        };
                        mockFetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, discordProvider.getUserProfile('access-token')];
                    case 1:
                        result = _a.sent();
                        expect(result.avatar).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle API errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockErrorResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockErrorResponse = {
                            ok: false,
                            status: 401,
                            json: jest.fn().mockResolvedValue({
                                message: 'Unauthorized',
                                code: 0,
                            }),
                        };
                        mockFetch.mockResolvedValue(mockErrorResponse);
                        return [4 /*yield*/, expect(discordProvider.getUserProfile('invalid-token')).rejects.toThrow('Failed to get Discord user profile: Unauthorized')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('refreshToken', function () {
        it('should refresh access token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockTokenResponse, mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockTokenResponse = {
                            access_token: 'new-access-token',
                            token_type: 'Bearer',
                            expires_in: 604800,
                            refresh_token: 'new-refresh-token',
                            scope: 'identify email',
                        };
                        mockResponse = {
                            ok: true,
                            json: jest.fn().mockResolvedValue(mockTokenResponse),
                        };
                        mockFetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, discordProvider.refreshToken('refresh-token')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockTokenResponse);
                        expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/oauth2/token', expect.objectContaining({
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle refresh token errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockErrorResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockErrorResponse = {
                            ok: false,
                            status: 400,
                            json: jest.fn().mockResolvedValue({
                                error: 'invalid_grant',
                                error_description: 'Invalid refresh token',
                            }),
                        };
                        mockFetch.mockResolvedValue(mockErrorResponse);
                        return [4 /*yield*/, expect(discordProvider.refreshToken('invalid-refresh-token')).rejects.toThrow('Failed to refresh Discord token: invalid_grant - Invalid refresh token')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('revokeToken', function () {
        it('should revoke access token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                        };
                        mockFetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, discordProvider.revokeToken('access-token')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(true);
                        expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/oauth2/token/revoke', expect.objectContaining({
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle revoke token errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockErrorResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockErrorResponse = {
                            ok: false,
                            status: 400,
                        };
                        mockFetch.mockResolvedValue(mockErrorResponse);
                        return [4 /*yield*/, discordProvider.revokeToken('invalid-token')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle network errors during token revocation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFetch.mockRejectedValue(new Error('Network error'));
                        return [4 /*yield*/, discordProvider.revokeToken('access-token')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('checkGuildMembership', function () {
        it('should check guild membership when guildId is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockGuilds, mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockGuilds = [
                            { id: 'test-guild-id', name: 'Test Guild' },
                            { id: 'other-guild-id', name: 'Other Guild' },
                        ];
                        mockResponse = {
                            ok: true,
                            json: jest.fn().mockResolvedValue(mockGuilds),
                        };
                        mockFetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, discordProvider.checkGuildMembership('access-token')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(true);
                        expect(mockFetch).toHaveBeenCalledWith('https://discord.com/api/users/@me/guilds', expect.objectContaining({
                            headers: { Authorization: 'Bearer access-token' },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false if user is not in required guild', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockGuilds, mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockGuilds = [
                            { id: 'other-guild-id', name: 'Other Guild' },
                        ];
                        mockResponse = {
                            ok: true,
                            json: jest.fn().mockResolvedValue(mockGuilds),
                        };
                        mockFetch.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, discordProvider.checkGuildMembership('access-token')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return true if no guildId is required', function () { return __awaiter(void 0, void 0, void 0, function () {
            var providerWithoutGuild, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providerWithoutGuild = new DiscordSsoProvider(mockConfig.clientId, mockConfig.clientSecret, mockConfig.redirectUri, mockConfig.scopes);
                        return [4 /*yield*/, providerWithoutGuild.checkGuildMembership('access-token')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(true);
                        expect(mockFetch).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle guild membership check errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockErrorResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockErrorResponse = {
                            ok: false,
                            status: 403,
                        };
                        mockFetch.mockResolvedValue(mockErrorResponse);
                        return [4 /*yield*/, discordProvider.checkGuildMembership('access-token')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=DiscordSsoProvider.test.js.map