// tailwind.config.js 📂

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center : true,
    },
    extend: {
      colors: {
        "brand-background": "#F8FAFC",
        "brand-surface": "#FFFFFF",
        "brand-muted": "#4B5563",
        "brand-foreground": "#1F2937",
        "brand-border": "#E5E7EB",
        "brand-border-strong": "#D2D6E1",
        "brand-accent": "#2B3547",
        "brand-accent-hover": "#1F2937",
        "brand-accent-soft": "#E6E9F2",
        "brand-gold": "#EAB308",
        "brand-orange": "#F97316",
      },
    },
  },
  plugins: [],
}
