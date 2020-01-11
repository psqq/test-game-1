const path = require('path');

module.exports = (env, options) => {
    const config = {
        entry: './src/main.js',
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist'),
        }
    };
    if (options && options.mode && options.mode === 'development') {
        config.devtool = 'eval-source-map';
        config.watchOptions = {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: [/node_modules/, /\.git/],
        };
    }
    return config;
};
