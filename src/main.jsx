import React from 'react' //reactın kendisi
import ReactDOM from 'react-dom/client' //react element ağacı yapsıs için
import App from './App.jsx' //app import ediyoruz 

//app i render ediyoruz

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)