import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContexProvider from './context/auth-context';


ReactDOM.render(<AuthContexProvider>
    <App />
</AuthContexProvider>, document.getElementById('root'));
