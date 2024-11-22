const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const postcssNested = require('postcss-nested'); // Add this line

module.exports = {
    plugins: [
        postcssNested, // Add this line before tailwindcss
        tailwindcss,
        autoprefixer,
    ],
};
