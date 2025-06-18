module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: {
            colors: {
                // Primary
                primary: "var(--color-primary-main)",
                "primary-light": "var(--color-primary-light)",
                "primary-dark": "var(--color-primary-dark)",

                // Secondary
                secondary: "var(--color-secondary-main)",
                "secondary-light": "var(--color-secondary-light)",
                "secondary-dark": "var(--color-secondary-dark)",

                // Success
                success: "var(--color-success-main)",
                "success-light": "var(--color-success-light)",
                "success-dark": "var(--color-success-dark)",

                // Error
                error: "var(--color-error-main)",
                "error-light": "var(--color-error-light)",
                "error-dark": "var(--color-error-dark)",

                // Warning
                warning: "var(--color-warning-main)",
                "warning-light": "var(--color-warning-light)",
                "warning-dark": "var(--color-warning-dark)",

                // Info
                info: "var(--color-info-main)",
                "info-light": "var(--color-info-light)",
                "info-dark": "var(--color-info-dark)",

                // Background
                background: "var(--color-background-default)",
                surface: "var(--color-background-paper)",

                // Text
                "text-primary": "var(--color-text-primary)",
                "text-secondary": "var(--color-text-secondary)",

                // Grey scale
                grey: {
                    50: "var(--color-grey-50)",
                    100: "var(--color-grey-100)",
                    200: "var(--color-grey-200)",
                    300: "var(--color-grey-300)",
                    400: "var(--color-grey-400)",
                    500: "var(--color-grey-500)",
                    600: "var(--color-grey-600)",
                    700: "var(--color-grey-700)",
                    800: "var(--color-grey-800)",
                    900: "var(--color-grey-900)",
                },
            },
            fontFamily: {
                sans: "var(--font-family)",
            },
            fontSize: {
                h1: ["var(--h1-font-size)", {lineHeight: "var(--h1-line-height)"}],
                h2: ["var(--h2-font-size)", {lineHeight: "var(--h2-line-height)"}],
                h3: ["var(--h3-font-size)", {lineHeight: "var(--h3-line-height)"}],
                body1: ["var(--body1-font-size)", {lineHeight: "var(--body1-line-height)"}],
                body2: ["var(--body2-font-size)", {lineHeight: "var(--body2-line-height)"}],
            },
            fontWeight: {
                h1: "var(--h1-font-weight)",
                h2: "var(--h2-font-weight)",
                h3: "var(--h3-font-weight)",
                body1: "var(--body1-font-weight)",
                body2: "var(--body2-font-weight)",
            },
            borderRadius: {
                DEFAULT: "var(--border-radius)",
            },
        },
    },
    plugins: [],
};
