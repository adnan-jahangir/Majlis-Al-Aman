import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.majlis.alamantracker',
  appName: 'Majlis Al-Aman',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#020617'
    }
  }
};

export default config;
