const { createPortal } = require("react-dom");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "echo-blue": "#ACADC4",
        valhalla: "#272848",
        "medium-slate-blue": "#6D71F9",
        "slate-blue": "#575AC7",
        "medium-slate-blue-16": "#6D71F916",
        "gulf-blue": "#343951",
        charcoal: "#434343",
        "light-coral": "#FF8080",
        "red-orange": "#FF3333",
        "black-85": "#00000085",
        "ghost-white": "#F8F9FD",
        "midnight-express": "#101935",
        "maya-blue": "#54C1FB",
        "dark-gray": "#ACACAC",
        paua: "#201C53",
        "waikawa-grey": "#6B7595",
        "ship-cove": "#7A89A3",
        lavender: "#EFF0F8",
        "hit-grey": "#9DABAC",
        "echo-Blue": "#ACADC4",
        "black": "#000000",
        "dark-black": "#11221C",
        "gray-6c": "#6C6C6C",
        "boysenberry": "#EFF0F8",
        "speech-blue": "#201C53",
        "liberty-blue": "#101935",
        "genteel-lavender": "#7A89A3",
        "white": "#FFFFFF",
        "alabaster": "#FAFAFA"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
