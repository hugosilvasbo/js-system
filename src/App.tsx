import 'primeicons/primeicons.css';
import { Menubar } from 'primereact/menubar';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-accent/theme.css';
import { useNavigate } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import './style/App.scss';
import './style/vars.scss'
import "antd/dist/antd.css";

function App(props: any) {
  const navigate = useNavigate();

  const menuitems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Cadastro',
      icon: 'pi pi-user-edit',
      command: () => navigate('/cadastro/pessoa')
    },
    {
      label: 'Item',
      icon: 'pi pi-book',
      command: () => navigate('/cadastro/item')
    },
    {
      label: 'Venda',
      icon: 'pi pi-dollar',
      command: () => navigate("/venda/pedido")
    }
  ]

  return (
    <div id='main_index'>
      <Menubar
        style={{
          backgroundColor: "#f1f1f1",
          fontSize: "12px",
          height: "44px"
        }}
        model={menuitems}
      />
      <div className='content'>{props.children}</div>
      <footer>
        JS System - 2022 - Todos os direitos autorais reservados
      </footer>
    </div>
  );

}

export default App;
