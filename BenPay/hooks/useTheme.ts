import { useThemeColor } from './useThemeColor';

export function useTheme() {
  return {
    colors: {
      background: useThemeColor({}, 'background'),
      primary: useThemeColor({}, 'tint'),
      secondary: useThemeColor({}, 'icon'),
      success: '#27ae60',
      warning: '#f39c12',
    },
  };
}