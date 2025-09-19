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
import { RpgCharacterService } from '../server/services/RpgCharacterService';
// Mock Prisma Client
var mockPrismaClient = {
    rpgCharacter: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    rpgSheet: {
        findMany: jest.fn(),
    },
    user: {
        findFirst: jest.fn(),
    },
};
// Mock Discord Client
var mockDiscordClient = {};
// Mock WorldAnvil Client
var mockWorldAnvilClient = {};
// Mock OpenAI Client
var mockOpenAI = {};
describe('RpgCharacterService', function () {
    var service;
    beforeEach(function () {
        jest.clearAllMocks();
        service = new RpgCharacterService(mockPrismaClient, mockDiscordClient, mockWorldAnvilClient, mockOpenAI);
    });
    describe('getAll', function () {
        it('should return all RPG characters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedCharacters, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedCharacters = [
                            { id: 'char1', name: 'Aragorn', title: 'Ranger' },
                            { id: 'char2', name: 'Legolas', title: 'Elf Prince' },
                        ];
                        mockPrismaClient.rpgCharacter.findMany.mockResolvedValue(expectedCharacters);
                        return [4 /*yield*/, service.getAll()];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.findMany).toHaveBeenCalledWith();
                        expect(result).toEqual(expectedCharacters);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle empty result', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.findMany.mockResolvedValue([]);
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
        it('should return a character by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var characterId, expectedCharacter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        characterId = 'char123';
                        expectedCharacter = {
                            id: characterId,
                            name: 'Aragorn',
                            title: 'Ranger',
                            description: 'A skilled ranger',
                            user_id: 'user123',
                        };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(expectedCharacter);
                        return [4 /*yield*/, service.getById(characterId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.findUnique).toHaveBeenCalledWith({
                            where: { id: characterId },
                        });
                        expect(result).toEqual(expectedCharacter);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);
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
        it('should return a character by WorldAnvil ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var worldAnvilId, expectedCharacter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        worldAnvilId = 'wa123';
                        expectedCharacter = {
                            id: 'char123',
                            name: 'Aragorn',
                            worldanvil_character_id: worldAnvilId,
                        };
                        mockPrismaClient.rpgCharacter.findFirst.mockResolvedValue(expectedCharacter);
                        return [4 /*yield*/, service.getByWorldAnvilId(worldAnvilId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.findFirst).toHaveBeenCalledWith({
                            where: { worldanvil_character_id: worldAnvilId },
                        });
                        expect(result).toEqual(expectedCharacter);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByDiscordPostId', function () {
        it('should return a character by Discord post ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var discordPostId, expectedCharacter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        discordPostId = 'post123';
                        expectedCharacter = {
                            id: 'char123',
                            name: 'Aragorn',
                            discord_post_id: discordPostId,
                        };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(expectedCharacter);
                        return [4 /*yield*/, service.getByDiscordPostId(discordPostId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.findUnique).toHaveBeenCalledWith({
                            where: { discord_post_id: discordPostId },
                        });
                        expect(result).toEqual(expectedCharacter);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByDiscordThreadId', function () {
        it('should return a character by Discord thread ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var discordThreadId, expectedCharacter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        discordThreadId = 'thread123';
                        expectedCharacter = {
                            id: 'char123',
                            name: 'Aragorn',
                            discord_thread_id: discordThreadId,
                        };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(expectedCharacter);
                        return [4 /*yield*/, service.getByDiscordThreadId(discordThreadId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.findUnique).toHaveBeenCalledWith({
                            where: { discord_thread_id: discordThreadId },
                        });
                        expect(result).toEqual(expectedCharacter);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByUserId', function () {
        it('should return characters owned by a user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, expectedCharacters, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = 'user123';
                        expectedCharacters = [
                            { id: 'char1', name: 'Aragorn', user_id: userId },
                            { id: 'char2', name: 'Legolas', user_id: userId },
                        ];
                        mockPrismaClient.rpgCharacter.findMany.mockResolvedValue(expectedCharacters);
                        return [4 /*yield*/, service.getByUserId(userId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.findMany).toHaveBeenCalledWith({
                            where: { user_id: userId },
                        });
                        expect(result).toEqual(expectedCharacters);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('search', function () {
        it('should search characters by name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var query, expectedCharacters, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'aragorn';
                        expectedCharacters = [
                            { id: 'char1', name: 'Aragorn', title: 'Ranger' },
                        ];
                        mockPrismaClient.rpgCharacter.findMany.mockResolvedValue(expectedCharacters);
                        return [4 /*yield*/, service.search(query)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.findMany).toHaveBeenCalledWith({
                            where: {
                                OR: [
                                    {
                                        name: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        title: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                ],
                            },
                        });
                        expect(result).toEqual(expectedCharacters);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search characters by title', function () { return __awaiter(void 0, void 0, void 0, function () {
            var query, expectedCharacters, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'ranger';
                        expectedCharacters = [
                            { id: 'char1', name: 'Aragorn', title: 'Ranger' },
                            { id: 'char2', name: 'Strider', title: 'Dunedain Ranger' },
                        ];
                        mockPrismaClient.rpgCharacter.findMany.mockResolvedValue(expectedCharacters);
                        return [4 /*yield*/, service.search(query)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(expectedCharacters);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('create', function () {
        it('should create a new character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var characterData, expectedCharacter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        characterData = {
                            name: 'Aragorn',
                            title: 'Ranger',
                            description: 'A skilled ranger from the North',
                            user: { connect: { id: 'user123' } },
                        };
                        expectedCharacter = {
                            id: 'char123',
                            name: 'Aragorn',
                            title: 'Ranger',
                            description: 'A skilled ranger from the North',
                            user_id: 'user123',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCharacter.create.mockResolvedValue(expectedCharacter);
                        return [4 /*yield*/, service.create(characterData)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.create).toHaveBeenCalledWith({
                            data: characterData,
                        });
                        expect(result).toEqual(expectedCharacter);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle creation errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var characterData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        characterData = {
                            name: 'Aragorn',
                            user: { connect: { id: 'invalid-user' } },
                        };
                        mockPrismaClient.rpgCharacter.create.mockRejectedValue(new Error('User not found'));
                        return [4 /*yield*/, expect(service.create(characterData)).rejects.toThrow('User not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        it('should update an existing character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var characterId, updateData, expectedCharacter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        characterId = 'char123';
                        updateData = {
                            name: 'Strider',
                            description: 'Updated description',
                        };
                        expectedCharacter = {
                            id: characterId,
                            name: 'Strider',
                            description: 'Updated description',
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCharacter.update.mockResolvedValue(expectedCharacter);
                        return [4 /*yield*/, service.update(characterId, updateData)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.update).toHaveBeenCalledWith({
                            where: { id: characterId },
                            data: updateData,
                        });
                        expect(result).toEqual(expectedCharacter);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle update errors for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = {
                            name: 'Updated Name',
                        };
                        mockPrismaClient.rpgCharacter.update.mockRejectedValue(new Error('Character not found'));
                        return [4 /*yield*/, expect(service.update('nonexistent', updateData)).rejects.toThrow('Character not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('delete', function () {
        it('should delete a character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var characterId, deletedCharacter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        characterId = 'char123';
                        deletedCharacter = { id: characterId, name: 'Deleted Character' };
                        mockPrismaClient.rpgCharacter.delete.mockResolvedValue(deletedCharacter);
                        return [4 /*yield*/, service.delete(characterId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgCharacter.delete).toHaveBeenCalledWith({
                            where: { id: characterId },
                        });
                        expect(result).toEqual(deletedCharacter);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle deletion errors for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.delete.mockRejectedValue(new Error('Character not found'));
                        return [4 /*yield*/, expect(service.delete('nonexistent')).rejects.toThrow('Character not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getCharacterSheets', function () {
        it('should return character sheets for a character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var characterId, expectedSheets, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        characterId = 'char123';
                        expectedSheets = [
                            { id: 'sheet1', rpg_character_id: characterId, character_name: 'Aragorn Level 1' },
                            { id: 'sheet2', rpg_character_id: characterId, character_name: 'Aragorn Level 5' },
                        ];
                        mockPrismaClient.rpgSheet.findMany.mockResolvedValue(expectedSheets);
                        return [4 /*yield*/, service.getCharacterSheets(characterId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSheet.findMany).toHaveBeenCalledWith({
                            where: { rpg_character_id: characterId },
                        });
                        expect(result).toEqual(expectedSheets);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return empty array for character with no sheets', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSheet.findMany.mockResolvedValue([]);
                        return [4 /*yield*/, service.getCharacterSheets('char123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('verifyCharacterOwnership', function () {
        it('should return true for direct user ID match', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, characterId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = 'user123';
                        characterId = 'char123';
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue({
                            id: characterId,
                            user_id: userId,
                        });
                        return [4 /*yield*/, service.verifyCharacterOwnership(userId, characterId)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(true);
                        expect(mockPrismaClient.rpgCharacter.findUnique).toHaveBeenCalledWith({
                            where: { id: characterId },
                            select: { user_id: true },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return true for Discord ID match', function () { return __awaiter(void 0, void 0, void 0, function () {
            var discordId, userId, characterId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        discordId = 'discord123';
                        userId = 'user123';
                        characterId = 'char123';
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue({
                            id: characterId,
                            user_id: userId,
                        });
                        mockPrismaClient.user.findFirst.mockResolvedValue({
                            id: userId,
                            discord_id: discordId,
                        });
                        return [4 /*yield*/, service.verifyCharacterOwnership(discordId, characterId)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(true);
                        expect(mockPrismaClient.user.findFirst).toHaveBeenCalledWith({
                            where: { discord_id: discordId },
                            select: { id: true },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, service.verifyCharacterOwnership('user123', 'nonexistent')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false for ownership mismatch', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, characterId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = 'user123';
                        characterId = 'char123';
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue({
                            id: characterId,
                            user_id: 'different-user',
                        });
                        mockPrismaClient.user.findFirst.mockResolvedValue(null);
                        return [4 /*yield*/, service.verifyCharacterOwnership(userId, characterId)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('generateBackstory', function () {
        it('should throw error for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.generateBackstory('nonexistent')).rejects.toThrow('Character not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw not implemented error for existing character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var character;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        character = { id: 'char123', name: 'Aragorn' };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);
                        return [4 /*yield*/, expect(service.generateBackstory('char123')).rejects.toThrow('Not implemented - use OpenAI SDK directly')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('analyzePersonality', function () {
        it('should throw error for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.analyzePersonality('nonexistent')).rejects.toThrow('Character not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw not implemented error for existing character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var character;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        character = { id: 'char123', name: 'Aragorn', description: 'A noble ranger' };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);
                        return [4 /*yield*/, expect(service.analyzePersonality('char123')).rejects.toThrow('Not implemented - use OpenAI SDK directly')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('suggestCharacterDevelopment', function () {
        it('should throw error for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.suggestCharacterDevelopment('nonexistent')).rejects.toThrow('Character not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw not implemented error for existing character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var character;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        character = { id: 'char123', name: 'Aragorn', description: 'A noble ranger' };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);
                        return [4 /*yield*/, expect(service.suggestCharacterDevelopment('char123')).rejects.toThrow('Not implemented - use OpenAI SDK directly')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('syncWithWorldAnvil', function () {
        it('should return false for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, service.syncWithWorldAnvil('nonexistent')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false for character without WorldAnvil ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var character, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        character = { id: 'char123', name: 'Aragorn', worldanvil_character_id: null };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);
                        return [4 /*yield*/, service.syncWithWorldAnvil('char123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false for character with WorldAnvil ID (stubbed)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var character, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        character = { id: 'char123', name: 'Aragorn', worldanvil_character_id: 'wa123' };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);
                        return [4 /*yield*/, service.syncWithWorldAnvil('char123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false); // Currently stubbed to return false
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('notifyCharacterUpdate', function () {
        it('should return false for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, service.notifyCharacterUpdate('nonexistent', 'test message')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false for character without Discord thread ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var character, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        character = { id: 'char123', name: 'Aragorn', discord_thread_id: null };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);
                        return [4 /*yield*/, service.notifyCharacterUpdate('char123', 'test message')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw not implemented error for character with Discord thread ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var character;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        character = { id: 'char123', name: 'Aragorn', discord_thread_id: 'thread123' };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);
                        return [4 /*yield*/, expect(service.notifyCharacterUpdate('char123', 'test message')).rejects.toThrow('Not implemented - use Discord.js SDK directly')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('generatePortraitDescription', function () {
        it('should throw error for non-existent character', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.generatePortraitDescription('nonexistent')).rejects.toThrow('Character not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw not implemented error for existing character', function () { return __awaiter(void 0, void 0, void 0, function () {
            var character;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        character = { id: 'char123', name: 'Aragorn', description: 'A noble ranger' };
                        mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);
                        return [4 /*yield*/, expect(service.generatePortraitDescription('char123')).rejects.toThrow('Not implemented - use OpenAI SDK directly')];
                    case 1:
                        _a.sent();
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
                        mockPrismaClient.rpgCharacter.findMany.mockRejectedValue(new Error('Connection failed'));
                        return [4 /*yield*/, expect(service.getAll()).rejects.toThrow('Connection failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle invalid data errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidCharacterData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidCharacterData = {};
                        mockPrismaClient.rpgCharacter.create.mockRejectedValue(new Error('Validation failed'));
                        return [4 /*yield*/, expect(service.create(invalidCharacterData)).rejects.toThrow('Validation failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle foreign key constraint errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var characterData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        characterData = {
                            name: 'Test Character',
                            user: { connect: { id: 'invalid-user' } },
                        };
                        mockPrismaClient.rpgCharacter.create.mockRejectedValue(new Error('Foreign key constraint failed'));
                        return [4 /*yield*/, expect(service.create(characterData)).rejects.toThrow('Foreign key constraint failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=RpgCharacterService.test.js.map