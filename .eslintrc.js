module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    // allows imports
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  // extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    'arrow-body-style': ['warn', 'as-needed'],
    // curly braces for if, else etc.
    'curly': ['error', 'multi-line'],
    // replace `switch-default`
    'default-case': ['error'],
    // replace `triple-equals`
    'eqeqeq': ['error', 'smart'],
    // will normally include properties in prototype chain, require if
    'guard-for-in': ['error'],
    // 2 spaces
    'indent': ['error', 2],
    // I don't think we even use labels
    'no-extra-label': ['error'],
    // not sure about this, but replaces tslint's `no-arg` rule
    'no-caller': ['error'],
    // transfered from tslint's `no-conditional-assignment` rule
    'no-cond-assign': ['error'],
    'no-debugger': ['error'],
    // similar to tslint's `no-construct` rule
    'no-new-wrappers': ['error'],
    // replacement for `no-string-throw`
    'no-throw-literal': ['error'],
    'no-unused-expressions': ['error'],
    'no-var': ['error'],
    // this isn't a tslint thing, but have copied over
    'new-parens': ['error'],
    // replacement for `object-literal-shorthand`
    'object-shorthand': ['error'],
    'prefer-arrow-callback': ['error'],
    'prefer-const': ['error'],
    // instead of `semicolon`
    'semi': ['error', 'never'],
    'use-isnan': ['error'],
    '@typescript-eslint/array-type': ['error', 'array-simple'],
    '@typescript-eslint/ban-types': [
      'error', {
        'types': {
          'Object': 'Use {} instead.',
          'String': "Use 'string' instead.",
          'Number': "Use 'number' instead.",
          'Boolean': "Use 'boolean' instead.",
        }
      }
    ],
    // PascalCase for classes
    '@typescript-eslint/class-name-casing': ['error'],
    // don't prefix interface names with 'I'
    '@typescript-eslint/interface-name-prefix': ['error', 'never'],
    // don't conflict <Types> and JSX
    '@typescript-eslint/no-angle-bracket-type-assertion': ['error'],
    // lose out on typing benefits with any
    '@typescript-eslint/no-explicit-any': ['error'],
    '@typescript-eslint/no-inferrable-types': ['error'],
    // namespaces and modules are outdated, use ES6 style
    '@typescript-eslint/no-namespace': ['error'],
    // use ES6-style imports instead
    '@typescript-eslint/no-triple-slash-reference': ['error'],
    
  }
}
