import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**'],
  },
  {
    // Vendored shadcn/ui + figma boilerplate: not authored here and not all used.
    // The new React-19 react-hooks rules flag idiomatic patterns in these files.
    files: ['src/components/ui/**', 'src/components/figma/**'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
