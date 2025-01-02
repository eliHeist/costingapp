// import daisyui from "daisyui"

module.exports = {
    content: ['../templates/*.html', '../../**/templates/**/*.html'],
    darkMode: 'media', // or 'class'
    theme: {
        extend: {
            colors: {
                white: "hsl(var(--white) / <alpha-value>)",
                lighter: "hsl(var(--lighter) / <alpha-value>)",
                light: "hsl(var(--light) / <alpha-value>)",
                primary: "hsl(var(--primary) / <alpha-value>)",
                accent: "hsl(var(--accent) / <alpha-value>)",
                black: "hsl(var(--black) / <alpha-value>)",
                grey: "hsl(var(--grey) / <alpha-value>)",
                muted: "hsl(var(--muted) / <alpha-value>)",
            },
            screens: {
                sm: '500px',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/container-queries'),
    ],
    darkMode: 'media',
};
