import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ProductList from './Components/ProductList';

const App = () => {
  return (
    <Provider store={store}>
     
       
        <div >
          <ProductList />
      
      </div>
    </Provider>
  );
};

export default App;
