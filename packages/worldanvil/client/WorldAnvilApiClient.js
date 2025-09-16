/**
 * World Anvil API Client
 * Server-side client for interacting with World Anvil API
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { getWorldAnvilConfig } from '../models/WorldAnvilConfig';
var WorldAnvilApiClient = /** @class */ (function () {
    /**
     * Creates a new WorldAnvilApiClient instance
     *
     * @param config Optional explicit config (overrides global config)
     * @param customHttpClient Optional HTTP client for testing
     */
    function WorldAnvilApiClient(config, customHttpClient) {
        var _this = this;
        // Get configuration from global config if not explicitly provided
        var effectiveConfig;
        try {
            // Try to get global config first
            var globalConfig = getWorldAnvilConfig();
            // Override with explicitly provided config if any
            effectiveConfig = __assign({ apiUrl: globalConfig.apiUrl, apiKey: globalConfig.apiKey, accessToken: globalConfig.accessToken }, config);
        }
        catch (e) {
            // Fallback to provided config or empty if global config not available
            effectiveConfig = config || {};
        }
        this.apiKey = effectiveConfig.apiKey;
        this.accessToken = effectiveConfig.accessToken;
        this.baseUrl = effectiveConfig.apiUrl || 'https://www.worldanvil.com/api/v1';
        // Use custom HTTP client for testing if provided, otherwise create axios instance
        if (customHttpClient) {
            this.client = customHttpClient;
        }
        else {
            var axiosInstance_1 = axios.create({
                baseURL: this.baseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            // Add request interceptor to add auth headers
            axiosInstance_1.interceptors.request.use(function (request) {
                if (_this.apiKey) {
                    request.headers['x-application-key'] = _this.apiKey;
                }
                if (_this.accessToken) {
                    request.headers['Authorization'] = "Bearer ".concat(_this.accessToken);
                }
                return request;
            });
            // Create adapter to match IWorldAnvilHttpClient interface
            this.client = {
                get: function (url, config) { return axiosInstance_1.get(url, config).then(function (res) { return res.data; }); },
                post: function (url, data, config) { return axiosInstance_1.post(url, data, config).then(function (res) { return res.data; }); },
                put: function (url, data, config) { return axiosInstance_1.put(url, data, config).then(function (res) { return res.data; }); },
                patch: function (url, data, config) { return axiosInstance_1.patch(url, data, config).then(function (res) { return res.data; }); },
                delete: function (url, config) { return axiosInstance_1.delete(url, config).then(function (res) { return res.data; }); }
            };
        }
    }
    /**
     * Set the API key
     */
    WorldAnvilApiClient.prototype.setApiKey = function (apiKey) {
        this.apiKey = apiKey;
    };
    /**
     * Set the access token
     */
    WorldAnvilApiClient.prototype.setAccessToken = function (accessToken) {
        this.accessToken = accessToken;
    };
    /**
     * Make a generic GET request to the World Anvil API
     */
    WorldAnvilApiClient.prototype.get = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.get(url, config)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        this.handleApiError(error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a generic POST request to the World Anvil API
     */
    WorldAnvilApiClient.prototype.post = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.post(url, data, config)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        this.handleApiError(error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a generic PUT request to the World Anvil API
     */
    WorldAnvilApiClient.prototype.put = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.put(url, data, config)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        this.handleApiError(error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a generic PATCH request to the World Anvil API
     */
    WorldAnvilApiClient.prototype.patch = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.patch(url, data, config)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        this.handleApiError(error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a generic DELETE request to the World Anvil API
     */
    WorldAnvilApiClient.prototype.delete = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.delete(url, config)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        this.handleApiError(error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle API errors
     */
    WorldAnvilApiClient.prototype.handleApiError = function (error) {
        var _a, _b;
        // Handle Axios errors
        if (axios.isAxiosError(error)) {
            var statusCode = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
            var responseData = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data;
            // Handle specific error codes
            if (statusCode === 401) {
                console.error('Authentication failed. Please check your API key and access token.');
            }
            else if (statusCode === 403) {
                console.error('You do not have permission to access this resource.');
            }
            else if (statusCode === 429) {
                console.error('Rate limit exceeded. Please try again later.');
            }
            else {
                console.error("API Error (".concat(statusCode, "):"), responseData);
            }
        }
        else {
            // Handle non-Axios errors
            console.error('World Anvil API Error:', (error === null || error === void 0 ? void 0 : error.message) || error);
        }
    };
    /**
     * Get the current user profile
     */
    WorldAnvilApiClient.prototype.getCurrentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get('/user')];
            });
        });
    };
    /**
     * Get a list of worlds for the current user
     */
    WorldAnvilApiClient.prototype.getMyWorlds = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get('/user/worlds')];
            });
        });
    };
    /**
     * Get a world by ID
     */
    WorldAnvilApiClient.prototype.getWorldById = function (worldId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get("/world/".concat(worldId))];
            });
        });
    };
    return WorldAnvilApiClient;
}());
export { WorldAnvilApiClient };
//# sourceMappingURL=WorldAnvilApiClient.js.map