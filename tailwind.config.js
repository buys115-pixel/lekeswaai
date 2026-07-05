/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // LekeSwaai palette — grounded in the SA course, not a generic "sport app" theme
        fairway: {
          DEFAULT: '#1F4D3D', // deep bottle-green, overcast fairway
          light: '#2E6B54',
          dark: '#123529',
        },
        bushveld: {
          DEFAULT: '#C1622D', // termite-mound clay / bushveld soil
          light: '#D97F4E',
          dark: '#93481F',
        },
        highveld: {
          DEFAULT: '#4A7FA6', // muted highveld sky blue
          light: '#6FA0C4',
          dark: '#345C7A',
        },
        sand: {
          DEFAULT: '#EDE6D6', // bunker sand background
          dark: '#DED2B4',
        },
        ink: '#201C16', // charcoal text
        gold: '#D4A93A', // trophy gold — premium accent only
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Public Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
