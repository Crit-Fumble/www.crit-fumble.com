/**
 * Jest setup file
 * Configure the testing environment here
 */
// Set a longer timeout for tests if needed
jest.setTimeout(10000);
// Reset all mocks after each test
afterEach(function () {
    jest.resetAllMocks();
});
export {};
//# sourceMappingURL=setup.js.map