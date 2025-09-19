"use strict";
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
var PrismaClient = require('@prisma/client').PrismaClient;
var prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hobDiscord, hobDndBeyond, hobRoll20, hobWorldAnvil, adminUser, testUser1, testUser2, discordUser, defaultCampaign, campaignDiscord, mondaySession, fridaySession, partyDnDBeyond1, partyDnDBeyond2, partyDnDBeyond3, partyDnDBeyond4, partyRoll201, partyRoll202, partyRoll203, discordDataMap, parties, _i, parties_1, party, character;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Start seeding...');
                    return [4 /*yield*/, prisma.userDiscord.upsert({
                            where: { id: '451207409915002882' },
                            update: {},
                            create: {
                                id: '451207409915002882',
                                name: 'hobdaytrain',
                                displayName: 'Hob Daytrain',
                                username: 'hobdaytrain',
                                avatar: 'abc123',
                                discriminator: '0001',
                                global_name: 'Hob Daytrain',
                            },
                        })];
                case 1:
                    hobDiscord = _a.sent();
                    console.log("Created discord user with id: ".concat(hobDiscord.id));
                    return [4 /*yield*/, prisma.userDndBeyond.upsert({
                            where: { id: 'dndbeyond-hob' },
                            update: {},
                            create: {
                                id: 'dndbeyond-hob',
                                name: 'CritFumbleGaming',
                            },
                        })];
                case 2:
                    hobDndBeyond = _a.sent();
                    console.log("Created DnD Beyond user with id: ".concat(hobDndBeyond.id));
                    return [4 /*yield*/, prisma.userRoll20.upsert({
                            where: { id: '6244861' },
                            update: {},
                            create: {
                                id: '6244861',
                                name: 'Crit-Fumble Gaming',
                                slug: 'crit-fumble-gaming',
                            },
                        })];
                case 3:
                    hobRoll20 = _a.sent();
                    console.log("Created Roll20 user with id: ".concat(hobRoll20.id));
                    return [4 /*yield*/, prisma.userWorldAnvil.upsert({
                            where: { id: '0816a407-350d-4866-bb91-4edde5a85d2f' },
                            update: {},
                            create: {
                                id: '0816a407-350d-4866-bb91-4edde5a85d2f',
                                name: 'Hob Daytrain',
                                slug: 'hobdaytrain',
                            },
                        })];
                case 4:
                    hobWorldAnvil = _a.sent();
                    console.log("Created World Anvil user with id: ".concat(hobWorldAnvil.id));
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { id: '0' },
                            update: {},
                            create: {
                                id: '0',
                                name: 'Hob Daytrain',
                                slug: 'hobdaytrain',
                                email: 'admin@crit-fumble.com',
                                admin: true,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                discord: hobDiscord.id,
                                dd_beyond: hobDndBeyond.id,
                                roll20: hobRoll20.id,
                                world_anvil: hobWorldAnvil.id,
                            },
                        })];
                case 5:
                    adminUser = _a.sent();
                    console.log("Created admin user with id: ".concat(adminUser.id));
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'player1@crit-fumble.com' },
                            update: {},
                            create: {
                                id: '1',
                                name: 'Test Player 1',
                                slug: 'player1',
                                email: 'player1@crit-fumble.com',
                                admin: false,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 6:
                    testUser1 = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'player2@crit-fumble.com' },
                            update: {},
                            create: {
                                id: '2',
                                name: 'Test Player 2',
                                slug: 'player2',
                                email: 'player2@crit-fumble.com',
                                admin: false,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 7:
                    testUser2 = _a.sent();
                    console.log("Created test users with ids: ".concat(testUser1.id, ", ").concat(testUser2.id));
                    return [4 /*yield*/, prisma.userDiscord.upsert({
                            where: { id: 'discord1' },
                            update: {},
                            create: {
                                id: 'discord1',
                                name: 'Discord User',
                                displayName: 'DiscordPlayer',
                                username: 'discord_player',
                                avatar: 'abc123',
                                discriminator: '0001',
                                global_name: 'Discord Player',
                            },
                        })];
                case 8:
                    discordUser = _a.sent();
                    console.log("Created discord user with id: ".concat(discordUser.id));
                    return [4 /*yield*/, prisma.campaign.upsert({
                            where: { id: '0' },
                            update: {},
                            create: {
                                id: '0',
                                name: 'Default Campaign',
                                slug: 'default-campaign',
                                system: '5',
                                gms: ['0', '2'],
                                active: true,
                            },
                        })];
                case 9:
                    defaultCampaign = _a.sent();
                    console.log("Created default campaign with id: ".concat(defaultCampaign.id));
                    return [4 /*yield*/, prisma.campaignDiscord.upsert({
                            where: { id: 'discord-campaign-0' },
                            update: {},
                            create: {
                                id: 'discord-campaign-0',
                                fumbleBotId: 'bot123',
                                playerRoles: ['role1', 'role2'],
                                gmRoles: ['gmrole1'],
                                botRoles: ['botrole1'],
                                forumChannelId: 'forum123',
                                playByPostChannelId: 'pbp123',
                                voiceChannelId: 'voice123',
                            },
                        })];
                case 10:
                    campaignDiscord = _a.sent();
                    return [4 /*yield*/, prisma.campaign.update({
                            where: { id: '0' },
                            data: {
                                discord: campaignDiscord.id,
                            },
                        })];
                case 11:
                    _a.sent();
                    console.log("Updated campaign with discord: ".concat(campaignDiscord.id));
                    return [4 /*yield*/, prisma.gameSession.upsert({
                            where: { id: 'monday_evening' },
                            update: {},
                            create: {
                                id: 'monday_evening',
                                day: 'Monday',
                                times: ['6:00 PM', '10:00 PM'],
                            },
                        })];
                case 12:
                    mondaySession = _a.sent();
                    return [4 /*yield*/, prisma.gameSession.upsert({
                            where: { id: 'friday_evening' },
                            update: {},
                            create: {
                                id: 'friday_evening',
                                day: 'Friday',
                                times: ['6:00 PM', '10:00 PM'],
                            },
                        })];
                case 13:
                    fridaySession = _a.sent();
                    console.log("Created game sessions");
                    return [4 /*yield*/, prisma.partyDndBeyond.upsert({
                            where: { id: 'dndbeyond_bom' },
                            update: {},
                            create: {
                                id: 'dndbeyond_bom',
                                join: 'https://dndbeyond.com/campaigns/join/1234567890abcdef1234567890abcdef',
                            },
                        })];
                case 14:
                    partyDnDBeyond1 = _a.sent();
                    return [4 /*yield*/, prisma.partyDndBeyond.upsert({
                            where: { id: 'dndbeyond_tpks' },
                            update: {},
                            create: {
                                id: 'dndbeyond_tpks',
                                join: 'https://dndbeyond.com/campaigns/join/0987654321fedcba0987654321fedcba',
                            },
                        })];
                case 15:
                    partyDnDBeyond2 = _a.sent();
                    return [4 /*yield*/, prisma.partyDndBeyond.upsert({
                            where: { id: 'dndbeyond_thllc' },
                            update: {},
                            create: {
                                id: 'dndbeyond_thllc',
                                join: 'https://dndbeyond.com/campaigns/join/abcdef1234567890abcdef1234567890',
                            },
                        })];
                case 16:
                    partyDnDBeyond3 = _a.sent();
                    return [4 /*yield*/, prisma.partyDndBeyond.upsert({
                            where: { id: 'dndbeyond_lfcda' },
                            update: {},
                            create: {
                                id: 'dndbeyond_lfcda',
                                join: 'https://dndbeyond.com/campaigns/join/76543210fedcba9876543210fedcba98',
                            },
                        })];
                case 17:
                    partyDnDBeyond4 = _a.sent();
                    console.log("Created DnD Beyond party data");
                    return [4 /*yield*/, prisma.partyRoll20.upsert({
                            where: { id: 'roll20_bom' },
                            update: {},
                            create: {
                                id: 'roll20_bom',
                                join: 'https://app.roll20.net/join/1234567/abcdefg',
                            },
                        })];
                case 18:
                    partyRoll201 = _a.sent();
                    return [4 /*yield*/, prisma.partyRoll20.upsert({
                            where: { id: 'roll20_tpks' },
                            update: {},
                            create: {
                                id: 'roll20_tpks',
                                join: 'https://app.roll20.net/join/7654321/gfedcba',
                            },
                        })];
                case 19:
                    partyRoll202 = _a.sent();
                    return [4 /*yield*/, prisma.partyRoll20.upsert({
                            where: { id: 'roll20_thllc' },
                            update: {},
                            create: {
                                id: 'roll20_thllc',
                                join: 'https://app.roll20.net/join/1357924/abcxyz',
                            },
                        })];
                case 20:
                    partyRoll203 = _a.sent();
                    console.log("Created Roll20 party data");
                    discordDataMap = {
                        'discord_bom': {
                            roleId: '1270594737211965551',
                            voiceChannelId: '1175910585020448768',
                            sideChatThreadId: '1305939321186025513',
                            questLogThreadId: '1296206616525406409',
                            gameplayThreadId: '1306016948651429999',
                        },
                        'discord_tpks': {
                            roleId: '1175901224785162391',
                            voiceChannelId: '1175910585020448768',
                            sideChatThreadId: '1305940098822570004',
                            questLogThreadId: '1296206495784112128',
                            gameplayThreadId: '1306016293811523686',
                        },
                        'discord_bla': {
                            sideChatThreadId: '1208506710206193664',
                        },
                        'discord_ar': {
                            sideChatThreadId: '1208880481668440124',
                        },
                        'discord_daps': {
                            sideChatThreadId: '1208444082054111302',
                        },
                        'discord_lfcda': {
                            sideChatThreadId: '1208507508532969482',
                        },
                        'discord_uvi': {
                            sideChatThreadId: '1220862831025590353',
                        },
                        'discord_cc': {
                            roleId: '1223108951005073418',
                            sideChatThreadId: '1305940098822570004',
                            questLogThreadId: '1296206495784112128',
                            gameplayThreadId: '1306016293811523686',
                        },
                        'discord_thllc': {
                            sideChatThreadId: '1208143325735948351',
                        },
                        'discord_party': {
                            sideChatThreadId: '1089044977008521307',
                        },
                        'discord_mom': {
                            sideChatThreadId: '1208501417933930527',
                        },
                    };
                    parties = [
                        {
                            id: '3',
                            campaign: '0',
                            gm: '0',
                            name: 'Barrel of Mayhem',
                            active: true,
                            session: 'monday_evening',
                            dd_beyond: partyDnDBeyond1.id,
                            roll20: partyRoll201.id,
                            discord: 'discord_bom',
                        },
                        {
                            id: '4',
                            campaign: '0',
                            gm: '0',
                            name: 'The Total Party Knockouts',
                            active: true,
                            session: 'friday_evening',
                            dd_beyond: partyDnDBeyond2.id,
                            roll20: partyRoll202.id,
                            discord: 'discord_tpks',
                        },
                        {
                            id: '5',
                            campaign: '0',
                            gm: '0',
                            name: 'Balathar\'s Landing Adventures',
                            slug: 'bla',
                            active: false,
                            discord: 'discord_bla',
                        },
                        {
                            id: '6',
                            campaign: '0',
                            gm: '0',
                            name: 'Astral Rift',
                            slug: 'ar',
                            active: false,
                            discord: 'discord_ar',
                            parentParty: '3', // child of Barrel of Mayhem
                        },
                        {
                            id: '7',
                            campaign: '0',
                            gm: '0',
                            name: 'Deserts, Ashes, and Pirate Ships',
                            slug: 'daps',
                            active: false,
                            discord: 'discord_daps',
                            parentParty: '3', // child of Barrel of Mayhem
                        },
                        {
                            id: '8',
                            campaign: '0',
                            gm: '0',
                            name: 'Looking for Crystals During the Apocalypse',
                            slug: 'lfcda',
                            active: false,
                            dd_beyond: partyDnDBeyond4.id,
                            discord: 'discord_lfcda',
                            parentParty: '3', // child of Barrel of Mayhem
                        },
                        {
                            id: '9',
                            campaign: '0',
                            gm: '0',
                            name: 'Using Vecna Incorrectly',
                            slug: 'uvi',
                            active: false,
                            discord: 'discord_uvi',
                            parentParty: '4', // child of Total Party Knockouts
                        },
                        {
                            id: '10',
                            campaign: '0',
                            gm: '0',
                            name: 'Copper Crucible',
                            slug: 'cc',
                            active: false,
                            dd_beyond: partyDnDBeyond3.id,
                            discord: 'discord_cc',
                        },
                        {
                            id: '11',
                            campaign: '0',
                            gm: '0',
                            name: 'Thoreau Holdings, LLC',
                            slug: 'th-llc',
                            dd_beyond: partyDnDBeyond3.id,
                            discord: 'discord_thllc',
                        },
                        {
                            id: '12',
                            campaign: '0',
                            gm: '0',
                            name: 'The Multiversal Dungeon Society',
                            slug: 'mds',
                            roll20: partyRoll203.id,
                        },
                        {
                            id: '69420',
                            campaign: '0',
                            gm: '0',
                            name: 'Party Party',
                            slug: 'party',
                            discord: 'discord_party',
                        },
                        {
                            id: '69421',
                            campaign: '0',
                            gm: '0',
                            name: 'Moms On Mission',
                            slug: 'mom',
                            discord: 'discord_mom',
                        },
                    ];
                    _i = 0, parties_1 = parties;
                    _a.label = 21;
                case 21:
                    if (!(_i < parties_1.length)) return [3 /*break*/, 24];
                    party = parties_1[_i];
                    return [4 /*yield*/, prisma.party.upsert({
                            where: { id: party.id },
                            update: {},
                            create: party,
                        })];
                case 22:
                    _a.sent();
                    _a.label = 23;
                case 23:
                    _i++;
                    return [3 /*break*/, 21];
                case 24:
                    console.log("Created parties");
                    return [4 /*yield*/, prisma.character.upsert({
                            where: { id: 'character-1' },
                            update: {},
                            create: {
                                id: 'character-1',
                                name: 'Thorne Ironheart',
                                slug: 'thorne-ironheart',
                                player: '2', // Eric
                                campaign_id: '0',
                                party_id: '4', // The Total Party Knockouts
                                dnd_beyond_id: '121937317', // Direct field instead of relation
                            },
                        })];
                case 25:
                    character = _a.sent();
                    console.log("Created character with id: ".concat(character.id));
                    console.log('Seeding completed.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=seed.js.map