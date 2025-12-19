import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface IThemeProvider {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

interface IThemeValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const initialThemeProvider = {
	theme: 'system',
	setTheme: () => null,
} satisfies IThemeValue;

const ThemeContext = createContext<IThemeValue>(initialThemeProvider);

export function ThemeProvider(
	{ children,
		defaultTheme = 'system',
		storageKey = 'vite-ui-theme' }: IThemeProvider,
) {
	const [theme, setTheme] = useState(() => (
		localStorage.getItem(storageKey) as Theme || defaultTheme));

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove('light', 'dark');

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
				.matches
				? 'dark'
				: 'light';

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	} satisfies IThemeValue;

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (context === undefined) { throw new Error('useTheme must be used within a ThemeProvider'); }

	return context;
};
