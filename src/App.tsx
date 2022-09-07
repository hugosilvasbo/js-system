import 'primeicons/primeicons.css';
import { Menubar } from 'primereact/menubar';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-accent/theme.css';
import { useNavigate } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
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
      label: 'Compra',
      icon: 'pi pi-shopping-cart',
      command: () => navigate('/compra/pedido')
    },
    {
      label: 'Venda',
      icon: 'pi pi-dollar',
      command: () => navigate("/venda/pedido")
    }
  ]

  const styleMenu = {
    backgroundColor: "#dfdfdf",
    height: "42px",
    fontSize: "12px"
  }

  return (
    <div className='main'>
      <Menubar style={styleMenu} model={menuitems} />
      <div className='content'>
        {props.children}
      </div>
    </div>
  );

}

export default App;
