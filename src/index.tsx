import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Pessoa from './pages/cadastro/Pessoa';
import PedidoCompra from './pages/compra/Pedido';
import Home from './pages/Home';
import PedidoVenda from './pages/venda/Pedido';
import './style/index.scss';

ReactDOM.render(
  (
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro/pessoa" element={<Pessoa />} />
          <Route path="/compra/pedido" element={<PedidoCompra />} />
          <Route path="/venda/pedido" element={<PedidoVenda />} />
        </Routes>
      </App>
    </Router>
  ),
  document.getElementById('root')
);