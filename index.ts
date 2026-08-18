import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent llama a AppRegistry.registerComponent('main', () => App)
// y garantiza que el entorno funcione igual en Expo Go y en una build nativa.
registerRootComponent(App);
