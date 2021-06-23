module.exports = {
	testEnvironment: 'node',
	testMatch: ['**.test.js'],
	transformIgnorePatterns: ["/node_modules/(?!vue-awesome)"],
	modulePathIgnorePatterns: ["tests/private.test.js"]
};