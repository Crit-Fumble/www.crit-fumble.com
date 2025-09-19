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
import { RpgPartyService } from '../server/services/RpgPartyService';
// Mock Prisma Client
var mockPrismaClient = {
    rpgParty: {
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
};
// Mock Discord Client
var mockDiscordClient = {};
// Mock WorldAnvil Client
var mockWorldAnvilClient = {};
// Mock OpenAI Client
var mockOpenAI = {};
describe('RpgPartyService', function () {
    var service;
    beforeEach(function () {
        jest.clearAllMocks();
        service = new RpgPartyService(mockPrismaClient, mockDiscordClient, mockWorldAnvilClient, mockOpenAI);
    });
    describe('getAll', function () {
        it('should return all RPG parties', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedParties, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedParties = [
                            { id: 'party1', title: 'The Heroes', rpg_campaign_id: 'campaign1' },
                            { id: 'party2', title: 'The Adventurers', rpg_campaign_id: 'campaign2' },
                        ];
                        mockPrismaClient.rpgParty.findMany.mockResolvedValue(expectedParties);
                        return [4 /*yield*/, service.getAll()];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.findMany).toHaveBeenCalledWith();
                        expect(result).toEqual(expectedParties);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle empty result', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgParty.findMany.mockResolvedValue([]);
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
        it('should return a party by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, expectedParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'party123';
                        expectedParty = {
                            id: partyId,
                            title: 'The Heroes',
                            description: 'A heroic party',
                            rpg_campaign_id: 'campaign1',
                        };
                        mockPrismaClient.rpgParty.findUnique.mockResolvedValue(expectedParty);
                        return [4 /*yield*/, service.getById(partyId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.findUnique).toHaveBeenCalledWith({
                            where: { id: partyId },
                        });
                        expect(result).toEqual(expectedParty);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null for non-existent party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgParty.findUnique.mockResolvedValue(null);
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
        it('should return a party by WorldAnvil ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var worldAnvilId, expectedParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        worldAnvilId = 'wa123';
                        expectedParty = {
                            id: 'party123',
                            title: 'The Heroes',
                            worldanvil_party_id: worldAnvilId,
                        };
                        mockPrismaClient.rpgParty.findUnique.mockResolvedValue(expectedParty);
                        return [4 /*yield*/, service.getByWorldAnvilId(worldAnvilId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.findUnique).toHaveBeenCalledWith({
                            where: { worldanvil_party_id: worldAnvilId },
                        });
                        expect(result).toEqual(expectedParty);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByDiscordRoleId', function () {
        it('should return a party by Discord role ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var discordRoleId, expectedParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        discordRoleId = 'role123';
                        expectedParty = {
                            id: 'party123',
                            title: 'The Heroes',
                            discord_role_id: discordRoleId,
                        };
                        mockPrismaClient.rpgParty.findUnique.mockResolvedValue(expectedParty);
                        return [4 /*yield*/, service.getByDiscordRoleId(discordRoleId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.findUnique).toHaveBeenCalledWith({
                            where: { discord_role_id: discordRoleId },
                        });
                        expect(result).toEqual(expectedParty);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByCampaignId', function () {
        it('should return parties for a campaign', function () { return __awaiter(void 0, void 0, void 0, function () {
            var campaignId, expectedParties, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        campaignId = 'campaign123';
                        expectedParties = [
                            { id: 'party1', title: 'Party A', rpg_campaign_id: campaignId },
                            { id: 'party2', title: 'Party B', rpg_campaign_id: campaignId },
                        ];
                        mockPrismaClient.rpgParty.findMany.mockResolvedValue(expectedParties);
                        return [4 /*yield*/, service.getByCampaignId(campaignId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.findMany).toHaveBeenCalledWith({
                            where: { rpg_campaign_id: campaignId },
                        });
                        expect(result).toEqual(expectedParties);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getBySessionId', function () {
        it('should return a party for a session', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId, expectedParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = 'session123';
                        expectedParty = {
                            id: 'party123',
                            title: 'The Heroes',
                            rpg_campaign_id: 'campaign1',
                        };
                        mockPrismaClient.rpgParty.findFirst.mockResolvedValue(expectedParty);
                        return [4 /*yield*/, service.getBySessionId(sessionId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.findFirst).toHaveBeenCalledWith({
                            where: { rpg_sessions: { some: { id: sessionId } } },
                        });
                        expect(result).toEqual(expectedParty);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('search', function () {
        it('should search parties by title', function () { return __awaiter(void 0, void 0, void 0, function () {
            var query, expectedParties, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'heroes';
                        expectedParties = [
                            { id: 'party1', title: 'The Heroes' },
                            { id: 'party2', title: 'Heroes United' },
                        ];
                        mockPrismaClient.rpgParty.findMany.mockResolvedValue(expectedParties);
                        return [4 /*yield*/, service.search(query)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.findMany).toHaveBeenCalledWith({
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
                        expect(result).toEqual(expectedParties);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search parties by description', function () { return __awaiter(void 0, void 0, void 0, function () {
            var query, expectedParties, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'adventure';
                        expectedParties = [
                            { id: 'party1', description: 'An adventure party' },
                        ];
                        mockPrismaClient.rpgParty.findMany.mockResolvedValue(expectedParties);
                        return [4 /*yield*/, service.search(query)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(expectedParties);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('create', function () {
        it('should create a new party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyData, expectedParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyData = {
                            title: 'New Party',
                            description: 'A new adventuring party',
                            rpg_campaign: { connect: { id: 'campaign123' } },
                        };
                        expectedParty = {
                            id: 'party123',
                            title: 'New Party',
                            description: 'A new adventuring party',
                            rpg_campaign_id: 'campaign123',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgParty.create.mockResolvedValue(expectedParty);
                        return [4 /*yield*/, service.create(partyData)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.create).toHaveBeenCalledWith({
                            data: partyData,
                        });
                        expect(result).toEqual(expectedParty);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle creation errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyData = {
                            title: 'New Party',
                            rpg_campaign: { connect: { id: 'invalid' } },
                        };
                        mockPrismaClient.rpgParty.create.mockRejectedValue(new Error('Campaign not found'));
                        return [4 /*yield*/, expect(service.create(partyData)).rejects.toThrow('Campaign not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        it('should update an existing party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, updateData, expectedParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'party123';
                        updateData = {
                            title: 'Updated Party Name',
                            description: 'Updated description',
                        };
                        expectedParty = {
                            id: partyId,
                            title: 'Updated Party Name',
                            description: 'Updated description',
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgParty.update.mockResolvedValue(expectedParty);
                        return [4 /*yield*/, service.update(partyId, updateData)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.update).toHaveBeenCalledWith({
                            where: { id: partyId },
                            data: updateData,
                        });
                        expect(result).toEqual(expectedParty);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle update errors for non-existent party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = {
                            title: 'Updated Title',
                        };
                        mockPrismaClient.rpgParty.update.mockRejectedValue(new Error('Party not found'));
                        return [4 /*yield*/, expect(service.update('nonexistent', updateData)).rejects.toThrow('Party not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('delete', function () {
        it('should delete a party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, deletedParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'party123';
                        deletedParty = { id: partyId, title: 'Deleted Party' };
                        mockPrismaClient.rpgParty.delete.mockResolvedValue(deletedParty);
                        return [4 /*yield*/, service.delete(partyId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.delete).toHaveBeenCalledWith({
                            where: { id: partyId },
                        });
                        expect(result).toEqual(deletedParty);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle deletion errors for non-existent party', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgParty.delete.mockRejectedValue(new Error('Party not found'));
                        return [4 /*yield*/, expect(service.delete('nonexistent')).rejects.toThrow('Party not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPartyMembers', function () {
        it('should return party members (character sheets)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, expectedMembers, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'party123';
                        expectedMembers = [
                            { id: 'sheet1', character_name: 'Aragorn', rpg_party_id: partyId },
                            { id: 'sheet2', character_name: 'Legolas', rpg_party_id: partyId },
                        ];
                        mockPrismaClient.rpgSheet.findMany.mockResolvedValue(expectedMembers);
                        return [4 /*yield*/, service.getPartyMembers(partyId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgSheet.findMany).toHaveBeenCalledWith({
                            where: { rpg_party_id: partyId },
                        });
                        expect(result).toEqual(expectedMembers);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return empty array for party with no members', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSheet.findMany.mockResolvedValue([]);
                        return [4 /*yield*/, service.getPartyMembers('party123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setupDiscordRole', function () {
        it('should throw error for non-existent party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, guildId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'nonexistent';
                        guildId = 'guild123';
                        mockPrismaClient.rpgParty.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.setupDiscordRole(partyId, guildId)).rejects.toThrow('Party not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set up Discord role for existing party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, guildId, existingParty;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'party123';
                        guildId = 'guild123';
                        existingParty = { id: partyId, title: 'Test Party' };
                        mockPrismaClient.rpgParty.findUnique.mockResolvedValue(existingParty);
                        return [4 /*yield*/, expect(service.setupDiscordRole(partyId, guildId)).resolves.not.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('syncWithWorldAnvil', function () {
        it('should sync party with WorldAnvil', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, worldAnvilPartyId, updatedParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'party123';
                        worldAnvilPartyId = 'wa123';
                        updatedParty = {
                            id: partyId,
                            title: 'Synced Party',
                            worldanvil_party_id: worldAnvilPartyId,
                        };
                        mockPrismaClient.rpgParty.update.mockResolvedValue(updatedParty);
                        return [4 /*yield*/, service.syncWithWorldAnvil(partyId, worldAnvilPartyId)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaClient.rpgParty.update).toHaveBeenCalledWith({
                            where: { id: partyId },
                            data: {
                                worldanvil_party_id: worldAnvilPartyId,
                            },
                        });
                        expect(result).toEqual(updatedParty);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('generateAIContent', function () {
        it('should generate AI content for existing party', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, existingParty, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'party123';
                        existingParty = { id: partyId, title: 'Test Party' };
                        mockPrismaClient.rpgParty.findUnique.mockResolvedValue(existingParty);
                        return [4 /*yield*/, service.generateAIContent(partyId, 'dynamics')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe('AI-generated dynamics for Test Party (not implemented yet)');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error for non-existent party', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgParty.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.generateAIContent('nonexistent', 'backstory')).rejects.toThrow('Party not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should generate different content types', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyId, existingParty, dynamicsResult, backstoryResult, goalsResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyId = 'party123';
                        existingParty = { id: partyId, title: 'Test Party' };
                        mockPrismaClient.rpgParty.findUnique.mockResolvedValue(existingParty);
                        return [4 /*yield*/, service.generateAIContent(partyId, 'dynamics')];
                    case 1:
                        dynamicsResult = _a.sent();
                        return [4 /*yield*/, service.generateAIContent(partyId, 'backstory')];
                    case 2:
                        backstoryResult = _a.sent();
                        return [4 /*yield*/, service.generateAIContent(partyId, 'goals')];
                    case 3:
                        goalsResult = _a.sent();
                        expect(dynamicsResult).toBe('AI-generated dynamics for Test Party (not implemented yet)');
                        expect(backstoryResult).toBe('AI-generated backstory for Test Party (not implemented yet)');
                        expect(goalsResult).toBe('AI-generated goals for Test Party (not implemented yet)');
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
                        mockPrismaClient.rpgParty.findMany.mockRejectedValue(new Error('Connection failed'));
                        return [4 /*yield*/, expect(service.getAll()).rejects.toThrow('Connection failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle invalid data errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidPartyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidPartyData = {};
                        mockPrismaClient.rpgParty.create.mockRejectedValue(new Error('Validation failed'));
                        return [4 /*yield*/, expect(service.create(invalidPartyData)).rejects.toThrow('Validation failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle foreign key constraint errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var partyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partyData = {
                            title: 'New Party',
                            rpg_campaign: { connect: { id: 'invalid-campaign' } },
                        };
                        mockPrismaClient.rpgParty.create.mockRejectedValue(new Error('Foreign key constraint failed'));
                        return [4 /*yield*/, expect(service.create(partyData)).rejects.toThrow('Foreign key constraint failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=RpgPartyService.test.js.map