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
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RpgSessionService } from '../../server/services/RpgSessionService';
// Mock Prisma Client
var mockPrismaClient = {
    rpgSession: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
// Mock Discord Client
var mockDiscordClient = {};
// Mock WorldAnvil Client
var mockWorldAnvilClient = {};
// Mock OpenAI Client
var mockOpenAI = {};
describe('RpgSessionService', function () {
    var service;
    beforeEach(function () {
        jest.clearAllMocks();
        service = new RpgSessionService(mockPrismaClient, mockDiscordClient, mockWorldAnvilClient, mockOpenAI);
    });
    describe('getAll', function () {
        it('should return all RPG sessions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedSessions, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedSessions = [
                            {
                                id: 'session1',
                                title: 'The Beginning',
                                rpg_party_id: 'party1',
                                worldanvil_id: null,
                                data: {},
                                description: null,
                                created_at: new Date(),
                                updated_at: new Date(),
                                discord_event_id: null
                            },
                            {
                                id: 'session2',
                                title: 'The Journey Continues',
                                rpg_party_id: 'party1',
                                worldanvil_id: null,
                                data: {},
                                description: null,
                                created_at: new Date(),
                                updated_at: new Date(),
                                discord_event_id: null
                            },
                        ];
                        mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);
                        return [4 /*yield*/, service.getAll()];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.findMany).toHaveBeenCalledWith();
                        expect(result).toEqual(expectedSessions);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle empty result', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSession.findMany.mockResolvedValue([]);
                        return [4 /*yield*/, service.getAll()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getById', function () {
        it('should return a session by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, expectedSession, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        expectedSession = {
                            id: sessionId,
                            title: 'The Epic Quest',
                            description: 'An amazing adventure',
                            rpg_party_id: 'party1',
                        };
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(expectedSession);
                        return [4 /*yield*/, service.getById(sessionId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.findUnique).toHaveBeenCalledWith({
                            where: { id: sessionId },
                        });
                        expect(result).toEqual(expectedSession);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null for non-existent session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, service.getById('nonexistent')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByWorldAnvilId', function () {
        it('should return a session by WorldAnvil ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var worldAnvilId, expectedSession, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        worldAnvilId = 'wa123';
                        expectedSession = {
                            id: 'session123',
                            title: 'The Epic Quest',
                            worldanvil_id: worldAnvilId,
                        };
                        mockPrismaClient.rpgSession.findFirst.mockResolvedValue(expectedSession);
                        return [4 /*yield*/, service.getByWorldAnvilId(worldAnvilId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.findFirst).toHaveBeenCalledWith({
                            where: { worldanvil_id: worldAnvilId },
                        });
                        expect(result).toEqual(expectedSession);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByDiscordEventId', function () {
        it('should return a session by Discord event ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var discordEventId, expectedSession, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        discordEventId = 'event123';
                        expectedSession = {
                            id: 'session123',
                            title: 'The Epic Quest',
                            discord_event_id: discordEventId,
                        };
                        mockPrismaClient.rpgSession.findFirst.mockResolvedValue(expectedSession);
                        return [4 /*yield*/, service.getByDiscordEventId(discordEventId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.findFirst).toHaveBeenCalledWith({
                            where: { discord_event_id: discordEventId },
                        });
                        expect(result).toEqual(expectedSession);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByPartyId', function () {
        it('should return sessions for a party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, expectedSessions, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'party123';
                        expectedSessions = [
                            { id: 'session1', title: 'Session 1', rpg_party_id: partyId },
                            { id: 'session2', title: 'Session 2', rpg_party_id: partyId },
                        ];
                        mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);
                        return [4 /*yield*/, service.getByPartyId(partyId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.findMany).toHaveBeenCalledWith({
                            where: { rpg_party_id: partyId },
                        });
                        expect(result).toEqual(expectedSessions);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('search', function () {
        it('should search sessions by title', function () { return __awaiter(void 0, void 0, void 0, function () {
            var query, expectedSessions, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'epic';
                        expectedSessions = [
                            { id: 'session1', title: 'The Epic Quest' },
                            { id: 'session2', title: 'Epic Battle' },
                        ];
                        mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);
                        return [4 /*yield*/, service.search(query)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.findMany).toHaveBeenCalledWith({
                            where: {
                                OR: [
                                    {
                                        title: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        description: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                ],
                            },
                        });
                        expect(result).toEqual(expectedSessions);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search sessions by description', function () { return __awaiter(void 0, void 0, void 0, function () {
            var query, expectedSessions, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'adventure';
                        expectedSessions = [
                            { id: 'session1', description: 'An amazing adventure' },
                        ];
                        mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);
                        return [4 /*yield*/, service.search(query)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(expectedSessions);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUpcomingSessions', function () {
        it('should return upcoming sessions ordered by creation date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedSessions, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedSessions = [
                            { id: 'session1', title: 'Recent Session', created_at: new Date() },
                            { id: 'session2', title: 'Older Session', created_at: new Date(Date.now() - 86400000) },
                        ];
                        mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);
                        return [4 /*yield*/, service.getUpcomingSessions()];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.findMany).toHaveBeenCalledWith({
                            where: {},
                            orderBy: {
                                created_at: 'desc',
                            },
                        });
                        expect(result).toEqual(expectedSessions);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('create', function () {
        it('should create a new session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionData, expectedSession, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionData = {
                            title: 'New Session',
                            description: 'A new adventure begins',
                            rpg_party: { connect: { id: 'party123' } },
                        };
                        expectedSession = {
                            id: 'session123',
                            title: 'New Session',
                            description: 'A new adventure begins',
                            rpg_party_id: 'party123',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgSession.create.mockResolvedValue(expectedSession);
                        return [4 /*yield*/, service.create(sessionData)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.create).toHaveBeenCalledWith({
                            data: sessionData,
                        });
                        expect(result).toEqual(expectedSession);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle creation errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionData = {
                            title: 'New Session',
                            rpg_party: { connect: { id: 'invalid' } },
                        };
                        mockPrismaClient.rpgSession.create.mockRejectedValue(new Error('Party not found'));
                        return [4 /*yield*/, expect(service.create(sessionData)).rejects.toThrow('Party not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        it('should update an existing session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, updateData, expectedSession, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        updateData = {
                            title: 'Updated Session Title',
                            description: 'Updated description',
                        };
                        expectedSession = {
                            id: sessionId,
                            title: 'Updated Session Title',
                            description: 'Updated description',
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgSession.update.mockResolvedValue(expectedSession);
                        return [4 /*yield*/, service.update(sessionId, updateData)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.update).toHaveBeenCalledWith({
                            where: { id: sessionId },
                            data: updateData,
                        });
                        expect(result).toEqual(expectedSession);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle update errors for non-existent session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = {
                            title: 'Updated Title',
                        };
                        mockPrismaClient.rpgSession.update.mockRejectedValue(new Error('Session not found'));
                        return [4 /*yield*/, expect(service.update('nonexistent', updateData)).rejects.toThrow('Session not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('delete', function () {
        it('should delete a session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, deletedSession, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        deletedSession = { id: sessionId, title: 'Deleted Session' };
                        mockPrismaClient.rpgSession.delete.mockResolvedValue(deletedSession);
                        return [4 /*yield*/, service.delete(sessionId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.delete).toHaveBeenCalledWith({
                            where: { id: sessionId },
                        });
                        expect(result).toEqual(deletedSession);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle deletion errors for non-existent session', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSession.delete.mockRejectedValue(new Error('Session not found'));
                        return [4 /*yield*/, expect(service.delete('nonexistent')).rejects.toThrow('Session not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPartyForSession', function () {
        it('should return party associated with session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, expectedParty, sessionWithParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        expectedParty = { id: 'party123', title: 'The Heroes' };
                        sessionWithParty = {
                            id: sessionId,
                            title: 'Test Session',
                            rpg_party: expectedParty,
                        };
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(sessionWithParty);
                        return [4 /*yield*/, service.getPartyForSession(sessionId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.findUnique).toHaveBeenCalledWith({
                            where: { id: sessionId },
                            include: { rpg_party: true },
                        });
                        expect(result).toEqual(expectedParty);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null for session without party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, sessionWithoutParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        sessionWithoutParty = {
                            id: sessionId,
                            title: 'Test Session',
                            rpg_party: null,
                        };
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(sessionWithoutParty);
                        return [4 /*yield*/, service.getPartyForSession(sessionId)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null for non-existent session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, service.getPartyForSession('nonexistent')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setupDiscordEvent', function () {
        it('should throw error for non-existent session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, guildId, scheduledTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'nonexistent';
                        guildId = 'guild123';
                        scheduledTime = new Date();
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.setupDiscordEvent(sessionId, guildId, scheduledTime)).rejects.toThrow('Session not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set up Discord event for existing session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, guildId, scheduledTime, existingSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        guildId = 'guild123';
                        scheduledTime = new Date();
                        existingSession = { id: sessionId, title: 'Test Session' };
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(existingSession);
                        return [4 /*yield*/, expect(service.setupDiscordEvent(sessionId, guildId, scheduledTime)).resolves.not.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('syncWithWorldAnvil', function () {
        it('should sync session with WorldAnvil', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, worldAnvilId, updatedSession, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        worldAnvilId = 'wa123';
                        updatedSession = {
                            id: sessionId,
                            title: 'Synced Session',
                            worldanvil_id: worldAnvilId,
                        };
                        mockPrismaClient.rpgSession.update.mockResolvedValue(updatedSession);
                        return [4 /*yield*/, service.syncWithWorldAnvil(sessionId, worldAnvilId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSession.update).toHaveBeenCalledWith({
                            where: { id: sessionId },
                            data: {
                                worldanvil_id: worldAnvilId,
                            },
                        });
                        expect(result).toEqual(updatedSession);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('generateAIContent', function () {
        it('should generate AI content for existing session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, existingSession, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        existingSession = { id: sessionId, title: 'Test Session' };
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(existingSession);
                        return [4 /*yield*/, service.generateAIContent(sessionId, 'plot')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe('AI-generated plot for Test Session (not implemented yet)');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error for non-existent session', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.generateAIContent('nonexistent', 'npcs')).rejects.toThrow('Session not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should generate different content types', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, existingSession, plotResult, npcsResult, encountersResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        existingSession = { id: sessionId, title: 'Test Session' };
                        mockPrismaClient.rpgSession.findUnique.mockResolvedValue(existingSession);
                        return [4 /*yield*/, service.generateAIContent(sessionId, 'plot')];
                    case 1:
                        plotResult = _a.sent();
                        return [4 /*yield*/, service.generateAIContent(sessionId, 'npcs')];
                    case 2:
                        npcsResult = _a.sent();
                        return [4 /*yield*/, service.generateAIContent(sessionId, 'encounters')];
                    case 3:
                        encountersResult = _a.sent();
                        expect(plotResult).toBe('AI-generated plot for Test Session (not implemented yet)');
                        expect(npcsResult).toBe('AI-generated npcs for Test Session (not implemented yet)');
                        expect(encountersResult).toBe('AI-generated encounters for Test Session (not implemented yet)');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('error handling', function () {
        it('should handle database connection errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSession.findMany.mockRejectedValue(new Error('Connection failed'));
                        return [4 /*yield*/, expect(service.getAll()).rejects.toThrow('Connection failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle invalid data errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidSessionData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidSessionData = {};
                        mockPrismaClient.rpgSession.create.mockRejectedValue(new Error('Validation failed'));
                        return [4 /*yield*/, expect(service.create(invalidSessionData)).rejects.toThrow('Validation failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle foreign key constraint errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionData = {
                            title: 'New Session',
                            rpg_party: { connect: { id: 'invalid-party' } },
                        };
                        mockPrismaClient.rpgSession.create.mockRejectedValue(new Error('Foreign key constraint failed'));
                        return [4 /*yield*/, expect(service.create(sessionData)).rejects.toThrow('Foreign key constraint failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=RpgSessionService.test.js.map