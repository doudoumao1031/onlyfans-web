import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
      colors: {
        red: "var(--red)",
        pink: "var(--red)",
        orange: "var(--orange)",
        green: "var(--green)",
        // black: "var(--black)",
        theme: "var(--theme)",
        gray: {
          primary: "var(--gray-primary)",
          secondary: "var(--gray-secondary)",
          tertiary: "var(--gray-tertiary)",
          quaternary: "var(--gray-quaternary)"
        },
        foreground: {
          DEFAULT: "var(--white)"
        },
        background: {
        //   DEFAULT: "var(--background-primary)",
		  DEFAULT: "hsl(var(--background))",
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
		  pink: "var(--background-pink)",
		  blue: "var(--background-blue)",
		  theme: "var(--background-theme)"
        },
        "white-80": "var(--white-80)",
        "white-20": "var(--white-20)",
        text: {
          title: "var(--text-title)",        // 标题文字颜色
          subtitle: "var(--text-subtitle)",   // 副标题文字颜色
          desc: "var(--text-desc)",          // 次要说明文字颜色
          disabled: "var(--text-disabled)",   // 文本禁用色、输入框默认文字色
          link: "var(--text-link)",          // 链接文本、提示弹窗按钮颜色
          light: "var(--text-light)",        // 深色背景下文字标题色
          "light-secondary": "var(--text-light-secondary)", // 深色背景下次要文本颜色
		  pink: "var(--text-pink)",
		  blue: "var(--text-blue)",
		  theme: "var(--text-theme)"
        },
        border: {
		  DEFAULT: "var(--border)",
		  pink: "var(--border-pink)",
		  blue: "var(--border-blue)"
        }
      },
  	  borderRadius: {
  		lg: "var(--radius)",
  		md: "calc(var(--radius) - 2px)",
  		sm: "calc(var(--radius) - 4px)"
	  }
      // colors: {
  		// 	background: "hsl(var(--background))",
  		// 	foreground: "hsl(var(--foreground))",
  		// 	"main-pink": "#FF8492",
      // "main-orange": "#F7B500",
  		// 	card: {
  		// 		DEFAULT: "hsl(var(--card))",
  		// 		foreground: "hsl(var(--card-foreground))"
  		// 	},
  		// 	popover: {
  		// 		DEFAULT: "hsl(var(--popover))",
  		// 		foreground: "hsl(var(--popover-foreground))"
  		// 	},
  		// 	primary: {
  		// 		DEFAULT: "hsl(var(--primary))",
  		// 		foreground: "hsl(var(--primary-foreground))"
  		// 	},
  		// 	secondary: {
  		// 		DEFAULT: "hsl(var(--secondary))",
  		// 		foreground: "hsl(var(--secondary-foreground))"
  		// 	},
  		// 	muted: {
  		// 		DEFAULT: "hsl(var(--muted))",
  		// 		foreground: "hsl(var(--muted-foreground))"
  		// 	},
  		// 	accent: {
  		// 		DEFAULT: "hsl(var(--accent))",
  		// 		foreground: "hsl(var(--accent-foreground))"
  		// 	},
  		// 	destructive: {
  		// 		DEFAULT: "hsl(var(--destructive))",
  		// 		foreground: "hsl(var(--destructive-foreground))"
  		// 	},
  		// 	border: "hsl(var(--border))",
  		// 	input: "hsl(var(--input))",
  		// 	ring: "hsl(var(--ring))",
  		// 	chart: {
  		// 		"1": "hsl(var(--chart-1))",
  		// 		"2": "hsl(var(--chart-2))",
  		// 		"3": "hsl(var(--chart-3))",
  		// 		"4": "hsl(var(--chart-4))",
  		// 		"5": "hsl(var(--chart-5))"
  		// 	}
  		// },
  		// borderRadius: {
  		// 	lg: 'var(--radius)',
  		// 	md: 'calc(var(--radius) - 2px)',
  		// 	sm: 'calc(var(--radius) - 4px)'
  		// }
  	}
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")]
} satisfies Config
