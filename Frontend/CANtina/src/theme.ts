export interface Theme {
  background: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
}

export const darkTheme: Theme = {
  background: "#121212",
  surface: "#1E1E1E",
  border: "#2C2C2C",
  textPrimary: "#E0E0E0",
  textSecondary: "#B3B3B3",
  primary: "#00727F",
  secondary: "#00727F",
  accent: "#00727F",
  success: "#00FF00",
};

export const lightTheme: Theme = {
  background: "#F5F5F5",
  surface: "#FFFFFF",
  border: "#E0E0E0",
  textPrimary: "#121212",
  textSecondary: "#4F4F4F",
  primary: "#6200EA",
  secondary: "#3700B3",
  accent: "#BB86FC",
  success: "#00AA00",
};
