import { registerRootComponent } from 'expo';

import App from './App';

if (process.env.NODE_ENV !== 'production' && process.env.EXPO_OS === 'web') {
  require('@expo/log-box/lib').setupLogBox();
}

registerRootComponent(App);
