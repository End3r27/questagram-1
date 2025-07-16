// frontend/config/app.ts
export const APP_CONFIG = {
  // Update this based on your environment
  API_BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api'  // Development
    : 'https://your-production-api.com/api', // Production
  
  // Other app configurations
  APP_NAME: 'Questagram',
  VERSION: '1.0.0',
  
  // Class configurations
  CLASSES: {
    warrior: {
      name: 'Warrior',
      description: 'Sports & Fitness enthusiast',
      color: '#ff4444',
    },
    mage: {
      name: 'Mage', 
      description: 'Art & Education creator',
      color: '#4444ff',
    },
    rogue: {
      name: 'Rogue',
      description: 'Memes & Trends setter',
      color: '#44ff44',
    },
    cleric: {
      name: 'Cleric',
      description: 'Support & Community builder',
      color: '#ffff44',
    },
  },
};