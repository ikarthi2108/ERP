module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: './src/.env', 
      safe: false,        
      allowUndefined: false, 
    }],
  ],
};
