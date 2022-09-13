import 'primeicons/primeicons.css';
import { Menubar } from 'primereact/menubar';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-accent/theme.css';
import { useNavigate } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import './style/App.scss';

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

  const styleMenu = {
    backgroundColor: "rgb(235 235 235)",
    fontSize: "12px",
    height: "44px"
  }

  return (
    <div className='main'>
      <Menubar style={styleMenu} model={menuitems} />
      <div className='content'>
        {props.children}
      </div>
      <div className='box'>
        JS System - 2022 - Todos os direitos autorais reservados
      </div>
    </div>
  );

}

export default App;
