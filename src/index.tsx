import "antd/dist/antd.css";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Agenda from './pages/agenda/Agenda';
import Item from './pages/cadastro/Item';
import Pessoa from './pages/cadastro/Pessoa';
import PedidoVenda from './pages/gerencial/Pedido';
import Home from './pages/Home';
import './style/index.scss';

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
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/gerencial/pedido" element={<PedidoVenda />} />
        </Routes>
      </App>
    </Router>
  </React.StrictMode>
);