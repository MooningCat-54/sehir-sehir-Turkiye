import React from 'react' //reactın kendisi
import ReactDOM from 'react-dom/client' //react element ağacı yapsıs için
import App from './App.jsx' //app import ediyoruz 
import { AuthProvider } from './context/AuthContext'; //AuthContext içindeki verilerin export etmek için kullandığımız import
import { BrowserRouter } from 'react-router-dom';


//app i render ediyoruz

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)