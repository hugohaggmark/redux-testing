module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  modulePathIgnorePatterns: ["<rootDir>/build/"]
};
