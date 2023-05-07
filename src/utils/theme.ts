const supportedThemes = {
  light: 'light',
  dark: 'dark',
};

type Themes = keyof typeof supportedThemes;

const StorageKey = 'features-color-theme';

const getTheme = (): Themes => {
  let theme = localStorage.getItem(StorageKey);

  if (!theme) {
    theme = 'light';
  }

  return theme as Themes;
};

const saveTheme = (theme: Themes) => {
  localStorage.setItem(StorageKey, theme);
};

export type { Themes };
export { StorageKey, getTheme, saveTheme };
