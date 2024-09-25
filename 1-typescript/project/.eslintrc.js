module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors', // 추가
    'plugin:import/warnings', // 추가
    'plugin:prettier/recommended', // Prettier와 통합
  ],
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        useTabs: false,
        tabWidth: 2,
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: 'avoid',
        trailingComma: 'es5', // 추가
      },
    ],
    // 추가적으로 원하는 규칙을 여기에 추가할 수 있습니다.
    'no-console': 'warn', // 예: console 사용 경고
    'no-explicit-any': 'off', // any 사용 허용
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021, // 최신 ECMAScript 버전 사용
    sourceType: 'module', // 모듈 사용
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
