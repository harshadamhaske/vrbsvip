import React from 'react';
import './global.css';
import {Provider} from 'react-redux';
import {store} from './services/store';
import i18n from './services/translationService';
import MainNavigation from './main-navigation';

const App = () => {
  return (
    <Provider store={store}>
      <MainNavigation />
    </Provider>
    
  );
};

export default App;

