import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Agenda from './pages/agenda/Agenda';
import Agenda_ from './pages/agenda/Agenda_';
import Funcionario from "./pages/cadastro/Funcionario";
import Item from './pages/cadastro/Item';
import Pessoa from './pages/cadastro/Pessoa';
import SituacaoAgenda from './pages/cadastro/SituacaoAgenda';
import PedidoVenda from './pages/gerencial/Pedido';
import Home from './pages/Home';
import './style/index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Router>
    <App>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro/pessoa" element={<Pessoa />} />
        <Route path="/cadastro/item" element={<Item />} />
        <Route path="/cadastro/funcionario" element={<Funcionario />} />
        <Route path="/cadastro/agenda_situacao" element={<SituacaoAgenda />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/gerencial/pedido" element={<PedidoVenda />} />
      </Routes>
    </App>
  </Router>
);