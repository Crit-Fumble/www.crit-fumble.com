/**
 * UserController Unit Tests
 * Comprehensive tests for user controller functionality
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
import { UserController } from '../../server/controllers/UserController';
// Mock AuthService
var mockAuthService = {
    verifyToken: jest.fn(),
    handleCallback: jest.fn(),
    getSsoAuthorizationUrl: jest.fn(),
};
// Mock UserService
var mockUserService = {
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserByDiscordId: jest.fn(),
    linkDiscordAccount: jest.fn(),
};
var createMockResponse = function () {
    var json = jest.fn();
    var send = jest.fn();
    var status = jest.fn().mockReturnValue({ json: json, send: send });
    return { status: status, json: json, send: send };
};
describe('UserController', function () {
    var userController;
    beforeEach(function () {
        jest.clearAllMocks();
        userController = new UserController(mockAuthService, mockUserService);
    });
    describe('Constructor', function () {
        it('should initialize with service dependencies', function () {
            expect(userController).toBeInstanceOf(UserController);
        });
    });
    describe('initialize', function () {
        it('should initialize without errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(userController.initialize()).resolves.not.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('handleDiscordAuth', function () {
        it('should handle successful Discord authentication', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res, mockAuthResult, mockUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: {
                                code: 'discord-auth-code',
                                redirectUri: 'http://localhost:3000/callback',
                            },
                        };
                        res = createMockResponse();
                        mockAuthResult = {
                            success: true,
                            token: 'jwt-token',
                        };
                        mockUser = {
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            providers: {
                                discord: { id: 'discord-123', username: 'testuser' },
                                worldanvil: undefined,
                            },
                            image: 'https://example.com/avatar.png',
                        };
                        mockAuthService.handleCallback.mockResolvedValue(mockAuthResult);
                        mockAuthService.verifyToken.mockResolvedValue({
                            success: true,
                            user: mockUser,
                        });
                        return [4 /*yield*/, userController.handleDiscordAuth(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(200);
                        expect(res.status().json).toHaveBeenCalledWith({
                            success: true,
                            token: 'jwt-token',
                            user: {
                                id: 'user-123',
                                name: 'Test User',
                                email: 'test@example.com',
                                discordId: 'discord-123',
                                worldAnvilId: undefined,
                                image: 'https://example.com/avatar.png',
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle missing Discord code', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: {},
                        };
                        res = createMockResponse();
                        return [4 /*yield*/, userController.handleDiscordAuth(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(400);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'Discord authorization code is required',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle Discord authentication failure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res, mockAuthResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: {
                                code: 'invalid-code',
                                redirectUri: 'http://localhost:3000/callback',
                            },
                        };
                        res = createMockResponse();
                        mockAuthResult = {
                            success: false,
                            error: 'Invalid authorization code',
                        };
                        mockAuthService.handleCallback.mockResolvedValue(mockAuthResult);
                        return [4 /*yield*/, userController.handleDiscordAuth(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(401);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'Invalid authorization code',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle token verification failure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res, mockAuthResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: {
                                code: 'discord-auth-code',
                                redirectUri: 'http://localhost:3000/callback',
                            },
                        };
                        res = createMockResponse();
                        mockAuthResult = {
                            success: true,
                            token: 'jwt-token',
                        };
                        mockAuthService.handleCallback.mockResolvedValue(mockAuthResult);
                        mockAuthService.verifyToken.mockResolvedValue({
                            success: false,
                            error: 'Invalid token',
                        });
                        return [4 /*yield*/, userController.handleDiscordAuth(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'Invalid token',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('handleWorldAnvilAuth', function () {
        it('should return not implemented error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res, mockUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            body: {
                                token: 'wa-token',
                                userId: 'user-123',
                            },
                        };
                        res = createMockResponse();
                        mockUser = {
                            id: 'user-123',
                            name: 'Test User',
                        };
                        mockUserService.getUserById.mockResolvedValue(mockUser);
                        return [4 /*yield*/, userController.handleWorldAnvilAuth(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(501);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'World Anvil account linking not implemented yet',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle missing token or user ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            body: {
                                token: 'wa-token',
                                // Missing userId
                            },
                        };
                        res = createMockResponse();
                        return [4 /*yield*/, userController.handleWorldAnvilAuth(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(400);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'World Anvil token and user ID are required',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            body: {
                                token: 'wa-token',
                                userId: 'non-existent-user',
                            },
                        };
                        res = createMockResponse();
                        mockUserService.getUserById.mockResolvedValue(null);
                        return [4 /*yield*/, userController.handleWorldAnvilAuth(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(404);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'User not found',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUserIntegrationData', function () {
        it('should get user integration data with valid token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res, mockUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: { userId: 'user-123' },
                            headers: { authorization: 'Bearer jwt-token' },
                        };
                        res = createMockResponse();
                        mockUser = {
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            image: 'https://example.com/avatar.png',
                            providers: {
                                discord: { id: 'discord-123', username: 'testuser' },
                                worldanvil: { id: 'wa-123', username: 'testuser-wa' },
                            },
                        };
                        mockAuthService.verifyToken.mockResolvedValue({
                            success: true,
                            user: mockUser,
                        });
                        return [4 /*yield*/, userController.getUserIntegrationData(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(200);
                        expect(res.status().json).toHaveBeenCalledWith({
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            image: 'https://example.com/avatar.png',
                            discordId: 'discord-123',
                            worldAnvilId: 'wa-123',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get user integration data without token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res, mockUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: { userId: 'user-123' },
                            headers: {},
                        };
                        res = createMockResponse();
                        mockUser = {
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            image: 'https://example.com/avatar.png',
                            discord_id: 'discord-123',
                            worldanvil_id: 'wa-123',
                        };
                        mockUserService.getUserById.mockResolvedValue(mockUser);
                        return [4 /*yield*/, userController.getUserIntegrationData(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(200);
                        expect(res.status().json).toHaveBeenCalledWith({
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            image: 'https://example.com/avatar.png',
                            discordId: 'discord-123',
                            worldAnvilId: 'wa-123',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle missing user ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: {},
                            headers: {},
                        };
                        res = createMockResponse();
                        return [4 /*yield*/, userController.getUserIntegrationData(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(400);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'User ID is required',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle invalid token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: { userId: 'user-123' },
                            headers: { authorization: 'Bearer invalid-token' },
                        };
                        res = createMockResponse();
                        mockAuthService.verifyToken.mockResolvedValue({
                            success: false,
                            error: 'Invalid token',
                        });
                        return [4 /*yield*/, userController.getUserIntegrationData(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(401);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'Invalid token',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: { userId: 'non-existent-user' },
                            headers: {},
                        };
                        res = createMockResponse();
                        mockUserService.getUserById.mockResolvedValue(null);
                        return [4 /*yield*/, userController.getUserIntegrationData(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(404);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'User not found',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle service errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            query: { userId: 'user-123' },
                            headers: {},
                        };
                        res = createMockResponse();
                        mockUserService.getUserById.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, userController.getUserIntegrationData(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(res.status().json).toHaveBeenCalledWith({
                            error: 'Failed to fetch user data',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=UserController.test.js.map