import React from 'react';
import './global.css';
import {Provider} from 'react-redux';
import {store} from './services/store';
import i18n from './services/translationService';
import RootLayout from './screens/intial/layout';
import Navigation from './screens/Modes/navigation';

const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
