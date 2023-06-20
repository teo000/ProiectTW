const path = require('path');

module.exports = {
    entry: './public/scripts/exportingScript.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public','scripts'),
    },
};
