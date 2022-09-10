import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Pessoa from './pages/cadastro/Pessoa';
import Item from './pages/cadastro/Item';
import Home from './pages/Home';
import PedidoVenda from './pages/venda/Pedido';
import './style/index.scss';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <React.StrictMode>
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro/pessoa" element={<Pessoa />} />
          <Route path="/cadastro/item" element={<Item />} />
          <Route path="/venda/pedido" element={<PedidoVenda />} />
        </Routes>
      </App>
    </Router>

  </React.StrictMode>
);