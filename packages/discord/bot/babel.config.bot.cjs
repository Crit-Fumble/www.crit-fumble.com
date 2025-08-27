// CommonJS version of babel config for bot tests
module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: 'commonjs' // Force CommonJS modules for Jest
    }]
  ]
};
