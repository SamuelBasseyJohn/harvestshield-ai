module.exports = {
  rules: {
    // Render props (React Navigation's tabBar, header, etc.) are legitimately
    // components defined inline; they must stay elements, not bare references.
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
  root: true,
  extends: '@react-native',
};
