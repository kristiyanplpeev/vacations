module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    //  "^.+\\.tsx?$": "ts-jest",
    "^.+\\.(ts|js)x?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/setup-enzyme.js"],
};
