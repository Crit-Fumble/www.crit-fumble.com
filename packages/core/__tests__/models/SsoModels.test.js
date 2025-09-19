/**
 * SsoModels Unit Tests
 * Tests for SSO authentication models and types
 */
import { SsoProvider, } from '../../models/auth/SsoModels';
describe('SsoModels', function () {
    describe('SsoProvider Enum', function () {
        it('should have correct provider values', function () {
            expect(SsoProvider.DISCORD).toBe('discord');
            expect(SsoProvider.WORLDANVIL).toBe('worldanvil');
        });
        it('should have all expected providers', function () {
            var providers = Object.values(SsoProvider);
            expect(providers).toContain('discord');
            expect(providers).toContain('worldanvil');
            expect(providers).toHaveLength(2);
        });
    });
    describe('SsoProviderConfig Interface', function () {
        it('should validate basic provider configuration', function () {
            var config = {
                clientId: 'test-client-id',
                clientSecret: 'test-client-secret',
                redirectUri: 'http://localhost:3000/auth/callback',
                scopes: ['identify', 'email'],
            };
            expect(config.clientId).toBe('test-client-id');
            expect(config.clientSecret).toBe('test-client-secret');
            expect(config.redirectUri).toBe('http://localhost:3000/auth/callback');
            expect(config.scopes).toEqual(['identify', 'email']);
        });
    });
    describe('DiscordSsoConfig Interface', function () {
        it('should extend SsoProviderConfig with Discord-specific options', function () {
            var config = {
                clientId: 'discord-client-id',
                clientSecret: 'discord-client-secret',
                redirectUri: 'http://localhost:3000/auth/discord/callback',
                scopes: ['identify', 'email', 'guilds'],
                guildId: 'test-guild-id',
            };
            expect(config.clientId).toBe('discord-client-id');
            expect(config.guildId).toBe('test-guild-id');
            expect(config.scopes).toContain('guilds');
        });
        it('should work without optional guildId', function () {
            var config = {
                clientId: 'discord-client-id',
                clientSecret: 'discord-client-secret',
                redirectUri: 'http://localhost:3000/auth/discord/callback',
                scopes: ['identify', 'email'],
            };
            expect(config.guildId).toBeUndefined();
            expect(config.clientId).toBe('discord-client-id');
        });
    });
    describe('WorldAnvilSsoConfig Interface', function () {
        it('should extend SsoProviderConfig for WorldAnvil', function () {
            var config = {
                clientId: 'worldanvil-client-id',
                clientSecret: 'worldanvil-client-secret',
                redirectUri: 'http://localhost:3000/auth/worldanvil/callback',
                scopes: ['read:user', 'read:worlds'],
            };
            expect(config.clientId).toBe('worldanvil-client-id');
            expect(config.scopes).toEqual(['read:user', 'read:worlds']);
        });
    });
    describe('SsoConfig Interface', function () {
        it('should combine multiple provider configurations', function () {
            var _a, _b, _c;
            var config = {
                discord: {
                    clientId: 'discord-client-id',
                    clientSecret: 'discord-client-secret',
                    redirectUri: 'http://localhost:3000/auth/discord/callback',
                    scopes: ['identify', 'email'],
                    guildId: 'test-guild-id',
                },
                worldanvil: {
                    clientId: 'worldanvil-client-id',
                    clientSecret: 'worldanvil-client-secret',
                    redirectUri: 'http://localhost:3000/auth/worldanvil/callback',
                    scopes: ['read:user'],
                },
            };
            expect((_a = config.discord) === null || _a === void 0 ? void 0 : _a.clientId).toBe('discord-client-id');
            expect((_b = config.worldanvil) === null || _b === void 0 ? void 0 : _b.clientId).toBe('worldanvil-client-id');
            expect((_c = config.discord) === null || _c === void 0 ? void 0 : _c.guildId).toBe('test-guild-id');
        });
        it('should work with only one provider configured', function () {
            var discordOnlyConfig = {
                discord: {
                    clientId: 'discord-client-id',
                    clientSecret: 'discord-client-secret',
                    redirectUri: 'http://localhost:3000/auth/discord/callback',
                    scopes: ['identify', 'email'],
                },
            };
            expect(discordOnlyConfig.discord).toBeDefined();
            expect(discordOnlyConfig.worldanvil).toBeUndefined();
        });
    });
    describe('AuthUrlParams Interface', function () {
        it('should validate authorization URL parameters', function () {
            var params = {
                clientId: 'test-client-id',
                redirectUri: 'http://localhost:3000/auth/callback',
                scopes: ['identify', 'email'],
                state: 'random-state-string',
                responseType: 'code',
            };
            expect(params.clientId).toBe('test-client-id');
            expect(params.redirectUri).toBe('http://localhost:3000/auth/callback');
            expect(params.scopes).toEqual(['identify', 'email']);
            expect(params.state).toBe('random-state-string');
            expect(params.responseType).toBe('code');
        });
        it('should work with optional parameters', function () {
            var params = {
                clientId: 'test-client-id',
                redirectUri: 'http://localhost:3000/auth/callback',
                scopes: ['identify'],
            };
            expect(params.state).toBeUndefined();
            expect(params.responseType).toBeUndefined();
        });
    });
    describe('TokenExchangeParams Interface', function () {
        it('should validate token exchange parameters', function () {
            var params = {
                code: 'authorization-code',
                clientId: 'test-client-id',
                clientSecret: 'test-client-secret',
                redirectUri: 'http://localhost:3000/auth/callback',
                grantType: 'authorization_code',
            };
            expect(params.code).toBe('authorization-code');
            expect(params.clientId).toBe('test-client-id');
            expect(params.clientSecret).toBe('test-client-secret');
            expect(params.redirectUri).toBe('http://localhost:3000/auth/callback');
            expect(params.grantType).toBe('authorization_code');
        });
        it('should work without optional grantType', function () {
            var params = {
                code: 'authorization-code',
                clientId: 'test-client-id',
                clientSecret: 'test-client-secret',
                redirectUri: 'http://localhost:3000/auth/callback',
            };
            expect(params.grantType).toBeUndefined();
        });
    });
    describe('TokenResponse Interface', function () {
        it('should validate OAuth2 token response', function () {
            var response = {
                access_token: 'access-token-123',
                token_type: 'Bearer',
                expires_in: 3600,
                refresh_token: 'refresh-token-123',
                scope: 'identify email',
            };
            expect(response.access_token).toBe('access-token-123');
            expect(response.token_type).toBe('Bearer');
            expect(response.expires_in).toBe(3600);
            expect(response.refresh_token).toBe('refresh-token-123');
            expect(response.scope).toBe('identify email');
        });
        it('should work without optional refresh_token', function () {
            var response = {
                access_token: 'access-token-123',
                token_type: 'Bearer',
                expires_in: 3600,
                scope: 'identify',
            };
            expect(response.refresh_token).toBeUndefined();
            expect(response.access_token).toBe('access-token-123');
        });
    });
    describe('SsoUserProfile Interface', function () {
        it('should validate complete user profile', function () {
            var _a;
            var profile = {
                id: 'user-123',
                username: 'testuser',
                email: 'test@example.com',
                displayName: 'Test User',
                avatar: 'https://example.com/avatar.png',
                provider: SsoProvider.DISCORD,
                providerData: {
                    guilds: ['guild-1', 'guild-2'],
                    verified: true,
                },
            };
            expect(profile.id).toBe('user-123');
            expect(profile.username).toBe('testuser');
            expect(profile.email).toBe('test@example.com');
            expect(profile.displayName).toBe('Test User');
            expect(profile.avatar).toBe('https://example.com/avatar.png');
            expect(profile.provider).toBe(SsoProvider.DISCORD);
            expect((_a = profile.providerData) === null || _a === void 0 ? void 0 : _a.guilds).toEqual(['guild-1', 'guild-2']);
        });
        it('should work with minimal required fields', function () {
            var profile = {
                id: 'user-123',
                username: 'testuser',
                provider: SsoProvider.WORLDANVIL,
            };
            expect(profile.id).toBe('user-123');
            expect(profile.username).toBe('testuser');
            expect(profile.provider).toBe(SsoProvider.WORLDANVIL);
            expect(profile.email).toBeUndefined();
            expect(profile.displayName).toBeUndefined();
            expect(profile.avatar).toBeUndefined();
            expect(profile.providerData).toBeUndefined();
        });
        it('should support different providers', function () {
            var discordProfile = {
                id: 'discord-123',
                username: 'discorduser',
                provider: SsoProvider.DISCORD,
            };
            var worldanvilProfile = {
                id: 'wa-456',
                username: 'worldanviluser',
                provider: SsoProvider.WORLDANVIL,
            };
            expect(discordProfile.provider).toBe(SsoProvider.DISCORD);
            expect(worldanvilProfile.provider).toBe(SsoProvider.WORLDANVIL);
        });
    });
    describe('SsoAuthResult Interface', function () {
        it('should validate successful authentication result', function () {
            var _a, _b;
            var result = {
                success: true,
                user: {
                    id: 'user-123',
                    username: 'testuser',
                    email: 'test@example.com',
                    provider: SsoProvider.DISCORD,
                },
                tokens: {
                    access_token: 'access-token-123',
                    token_type: 'Bearer',
                    expires_in: 3600,
                    scope: 'identify email',
                },
            };
            expect(result.success).toBe(true);
            expect((_a = result.user) === null || _a === void 0 ? void 0 : _a.id).toBe('user-123');
            expect((_b = result.tokens) === null || _b === void 0 ? void 0 : _b.access_token).toBe('access-token-123');
            expect(result.error).toBeUndefined();
        });
        it('should validate failed authentication result', function () {
            var result = {
                success: false,
                error: 'Invalid authorization code',
            };
            expect(result.success).toBe(false);
            expect(result.error).toBe('Invalid authorization code');
            expect(result.user).toBeUndefined();
            expect(result.tokens).toBeUndefined();
        });
        it('should validate partial success result', function () {
            var _a;
            var result = {
                success: true,
                user: {
                    id: 'user-123',
                    username: 'testuser',
                    provider: SsoProvider.DISCORD,
                },
                // No tokens provided
            };
            expect(result.success).toBe(true);
            expect((_a = result.user) === null || _a === void 0 ? void 0 : _a.id).toBe('user-123');
            expect(result.tokens).toBeUndefined();
            expect(result.error).toBeUndefined();
        });
    });
});
//# sourceMappingURL=SsoModels.test.js.map