export type FontStyle = 'modern' | 'serif' | 'tropical' | 'alpine';

export interface VacationTheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  bg_color: string;
  text_on_primary: string;
  gradient_from: string;
  gradient_to: string;
  card_bg: string;
  font_style: FontStyle;
}
