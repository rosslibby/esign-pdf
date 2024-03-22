import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import FirebaseProvider from './firebase/context';
import DocumentProvider from './document';
import ZoneProvider from './zone';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <FirebaseProvider>
      <DocumentProvider>
        <ZoneProvider>
          <App />
        </ZoneProvider>
      </DocumentProvider>
    </FirebaseProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
