const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent:  "#0099ff",
        bull:    "#00e676",
        bear:    "#ff3d57",
        gold:    "#ffd700",
      },
      animation: {
        marquee:     "marquee 30s linear infinite",
        "pulse-slow":"pulse-slow 3s ease infinite",
        blink:       "blink 1.4s ease infinite",
      },
      keyframes: {
        marquee:      { from:{transform:"translateX(0)"}, to:{transform:"translateX(-50%)"} },
        "pulse-slow": { "0%,100%":{opacity:"1"}, "50%":{opacity:"0.5"} },
        blink:        { "0%,100%":{opacity:"1"}, "50%":{opacity:"0.2"} },
      },
    },
  },
  plugins: [],
};
export default config;
