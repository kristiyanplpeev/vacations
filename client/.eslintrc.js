module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        "alwaysTryTypes": true,
      },
    }
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended'
  ],
  rules: {
    'react/prop-types': ['off'],
    'sonarjs/cognitive-complexity': ['error', 5],
    'max-lines-per-function': ['error', 40],
    '@typescript-eslint/no-empty-function': 0,
    'import/no-cycle': ['error', { maxDepth: Infinity }],
    '@typescript-eslint/no-empty-interface': 0,
    "import/no-unresolved": "error",
    "import/named": "off",
    "import/namespace": "off",
    // TODO: try again after upgrading libraries
    // "import/default": "error",
    "import/export": "error",
    "@typescript-eslint/interface-name-prefix": "off",
    // TODO: no-restricted imports is a workaround for no-relative imports
    // as there is an issue with typescript resolution
    // 'import/no-relative-parent-imports': 'error',
    "no-restricted-imports": [ "error", { patterns: [ "../*" ] } ],
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal"],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
  },
};
