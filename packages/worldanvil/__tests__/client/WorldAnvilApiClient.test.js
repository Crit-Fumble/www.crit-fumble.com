/**
 * Tests for WorldAnvilApiClient
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
import axios from 'axios';
import { WorldAnvilApiClient } from '../../client/WorldAnvilApiClient';
// Mock axios
jest.mock('axios');
var mockAxios = axios;
describe('WorldAnvilApiClient', function () {
    // Reset mocks before each test
    beforeEach(function () {
        jest.clearAllMocks();
        // Setup default mock for axios.create
        mockAxios.create.mockReturnValue({
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
            interceptors: {
                request: {
                    use: jest.fn(function (callback) {
                        // Simulate the interceptor by immediately calling the callback
                        callback({
                            headers: {}
                        });
                        return null;
                    })
                }
            }
        });
    });
    describe('constructor', function () {
        it('should initialize with default values', function () {
            var client = new WorldAnvilApiClient();
            expect(mockAxios.create).toHaveBeenCalledWith({
                baseURL: 'https://www.worldanvil.com/api/v1',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
        });
        it('should initialize with custom API URL', function () {
            var client = new WorldAnvilApiClient({
                apiUrl: 'https://custom.worldanvil.com/api/v2'
            });
            expect(mockAxios.create).toHaveBeenCalledWith(expect.objectContaining({
                baseURL: 'https://custom.worldanvil.com/api/v2'
            }));
        });
        it('should initialize with API key and access token', function () {
            var requestUseSpy = jest.fn(function (callback) {
                var request = { headers: {} };
                callback(request);
                // Verify headers were added
                expect(request.headers['x-application-key']).toBe('test-api-key');
                expect(request.headers['Authorization']).toBe('Bearer test-token');
                return null;
            });
            mockAxios.create.mockReturnValue({
                interceptors: {
                    request: {
                        use: requestUseSpy
                    }
                }
            });
            var client = new WorldAnvilApiClient({
                apiKey: 'test-api-key',
                accessToken: 'test-token'
            });
            expect(requestUseSpy).toHaveBeenCalled();
        });
    });
    describe('authentication methods', function () {
        it('should set API key', function () {
            // Setup a mock implementation for axios.create that captures the interceptor
            var capturedInterceptor = null;
            mockAxios.create.mockReturnValue({
                interceptors: {
                    request: {
                        use: function (interceptor) {
                            capturedInterceptor = interceptor;
                            return null;
                        }
                    }
                }
            });
            // Create client and set API key
            var client = new WorldAnvilApiClient();
            client.setApiKey('new-api-key');
            // Now test the interceptor directly
            var mockRequest = { headers: {} };
            capturedInterceptor(mockRequest);
            // Verify header was set
            expect(mockRequest.headers['x-application-key']).toBe('new-api-key');
        });
        it('should set access token', function () {
            // Setup a mock implementation for axios.create that captures the interceptor
            var capturedInterceptor = null;
            mockAxios.create.mockReturnValue({
                interceptors: {
                    request: {
                        use: function (interceptor) {
                            capturedInterceptor = interceptor;
                            return null;
                        }
                    }
                }
            });
            // Create client and set access token
            var client = new WorldAnvilApiClient();
            client.setAccessToken('new-access-token');
            // Now test the interceptor directly
            var mockRequest = { headers: {} };
            capturedInterceptor(mockRequest);
            // Verify header was set
            expect(mockRequest.headers['Authorization']).toBe('Bearer new-access-token');
        });
    });
    describe('HTTP methods', function () {
        var client;
        var mockGet;
        var mockPost;
        var mockPut;
        var mockDelete;
        beforeEach(function () {
            mockGet = jest.fn();
            mockPost = jest.fn();
            mockPut = jest.fn();
            mockDelete = jest.fn();
            mockAxios.create.mockReturnValue({
                get: mockGet,
                post: mockPost,
                put: mockPut,
                delete: mockDelete,
                interceptors: {
                    request: {
                        use: jest.fn()
                    }
                }
            });
            client = new WorldAnvilApiClient();
        });
        it('should make GET requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = { data: { id: '123', name: 'Test' } };
                        mockGet.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, client.get('/test', { params: { query: 'value' } })];
                    case 1:
                        result = _a.sent();
                        expect(mockGet).toHaveBeenCalledWith('/test', { params: { query: 'value' } });
                        expect(result).toEqual(mockResponse.data);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should make POST requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = { data: { id: '123', created: true } };
                        mockPost.mockResolvedValue(mockResponse);
                        payload = { name: 'Test' };
                        return [4 /*yield*/, client.post('/test', payload, { timeout: 5000 })];
                    case 1:
                        result = _a.sent();
                        expect(mockPost).toHaveBeenCalledWith('/test', payload, { timeout: 5000 });
                        expect(result).toEqual(mockResponse.data);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should make PUT requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = { data: { id: '123', updated: true } };
                        mockPut.mockResolvedValue(mockResponse);
                        payload = { name: 'Updated Test' };
                        return [4 /*yield*/, client.put('/test/123', payload)];
                    case 1:
                        result = _a.sent();
                        expect(mockPut).toHaveBeenCalledWith('/test/123', payload, undefined);
                        expect(result).toEqual(mockResponse.data);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should make DELETE requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = { data: { deleted: true } };
                        mockDelete.mockResolvedValue(mockResponse);
                        return [4 /*yield*/, client.delete('/test/123')];
                    case 1:
                        result = _a.sent();
                        expect(mockDelete).toHaveBeenCalledWith('/test/123', undefined);
                        expect(result).toEqual(mockResponse.data);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle API errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleSpy, mockError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleSpy = jest.spyOn(console, 'error').mockImplementation();
                        mockError = {
                            isAxiosError: true,
                            response: {
                                status: 401,
                                data: { error: 'Unauthorized' }
                            }
                        };
                        mockGet.mockRejectedValue(mockError);
                        mockAxios.isAxiosError.mockReturnValue(true);
                        return [4 /*yield*/, expect(client.get('/test')).rejects.toEqual(mockError)];
                    case 1:
                        _a.sent();
                        expect(consoleSpy).toHaveBeenCalledWith('Authentication failed. Please check your API key and access token.');
                        // Test different error codes
                        mockError.response.status = 403;
                        return [4 /*yield*/, expect(client.get('/test')).rejects.toEqual(mockError)];
                    case 2:
                        _a.sent();
                        expect(consoleSpy).toHaveBeenCalledWith('You do not have permission to access this resource.');
                        mockError.response.status = 429;
                        return [4 /*yield*/, expect(client.get('/test')).rejects.toEqual(mockError)];
                    case 3:
                        _a.sent();
                        expect(consoleSpy).toHaveBeenCalledWith('Rate limit exceeded. Please try again later.');
                        mockError.response.status = 500;
                        return [4 /*yield*/, expect(client.get('/test')).rejects.toEqual(mockError)];
                    case 4:
                        _a.sent();
                        expect(consoleSpy).toHaveBeenCalledWith('API Error (500):', { error: 'Unauthorized' });
                        consoleSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Domain-specific methods', function () {
        var client;
        var mockGet;
        beforeEach(function () {
            mockGet = jest.fn();
            mockAxios.create.mockReturnValue({
                get: mockGet,
                interceptors: {
                    request: {
                        use: jest.fn()
                    }
                }
            });
            client = new WorldAnvilApiClient();
        });
        it('should get current user profile', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            id: '123',
                            username: 'testuser',
                            display_name: 'Test User',
                            avatar_url: 'https://worldanvil.com/uploads/users/avatar-123.jpg'
                        };
                        mockGet.mockResolvedValue({ data: mockUser });
                        return [4 /*yield*/, client.getCurrentUser()];
                    case 1:
                        result = _a.sent();
                        expect(mockGet).toHaveBeenCalledWith('/user', undefined);
                        expect(result).toEqual(mockUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get user worlds', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockWorlds, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockWorlds = [
                            {
                                id: 'world1',
                                title: 'Test World 1',
                                slug: 'test-world-1',
                                description: 'A test world',
                                image_url: 'https://worldanvil.com/uploads/images/test-world-1.jpg'
                            },
                            {
                                id: 'world2',
                                title: 'Test World 2',
                                slug: 'test-world-2',
                                description: 'Another test world',
                                image_url: 'https://worldanvil.com/uploads/images/test-world-2.jpg'
                            }
                        ];
                        mockGet.mockResolvedValue({ data: mockWorlds });
                        return [4 /*yield*/, client.getMyWorlds()];
                    case 1:
                        result = _a.sent();
                        expect(mockGet).toHaveBeenCalledWith('/user/worlds', undefined);
                        expect(result).toEqual(mockWorlds);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get world by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockWorld, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockWorld = {
                            id: 'world1',
                            title: 'Test World 1',
                            slug: 'test-world-1',
                            description: 'A test world',
                            image_url: 'https://worldanvil.com/uploads/images/test-world-1.jpg'
                        };
                        mockGet.mockResolvedValue({ data: mockWorld });
                        return [4 /*yield*/, client.getWorldById('world1')];
                    case 1:
                        result = _a.sent();
                        expect(mockGet).toHaveBeenCalledWith('/world/world1', undefined);
                        expect(result).toEqual(mockWorld);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=WorldAnvilApiClient.test.js.map