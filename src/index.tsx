import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Item from './pages/cadastro/Item';
import Pessoa from './pages/cadastro/Pessoa';
import Home from './pages/Home';
import PedidoVenda from './pages/venda/Pedido';
import './style/index.scss';
import "antd/dist/antd.css";

const container = document.getElementById('root');
const root = createRoot(container!);

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