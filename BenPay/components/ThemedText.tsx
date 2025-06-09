import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'sectionTitle' | 'statValue' | 'statLabel' | 'buttonLabel';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'sectionTitle' ? styles.sectionTitle : undefined,
        type === 'statValue' ? styles.statValue : undefined,
        type === 'statLabel' ? styles.statLabel : undefined,
        type === 'buttonLabel' ? styles.buttonLabel : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Inter-SemiBold',
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
  },
  statValue: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0a7ea4',
  },
});