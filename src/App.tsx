import { AppstoreOutlined, HomeOutlined, TagOutlined, TeamOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import Menu from 'antd/lib/menu';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-accent/theme.css';
import { useNavigate } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import './style/App.scss';
import './style/vars.scss';

function App(props: any) {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'item 1', key: 'item-1' }, // remember to pass the key prop
    { label: 'item 2', key: 'item-2' }, // which is required
    {
      label: 'sub menu',
      key: 'submenu',
      children: [{ label: 'item 3', key: 'submenu-item-1' }],
    },
  ];

  return (
    <div id='main_index'>
      <Menu mode="horizontal" defaultSelectedKeys={['mnhome']}>
        <Menu.Item key="mnhome" onClick={() => navigate('/')} icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.SubMenu key="mncadastro" title="Cadastros" icon={<AppstoreOutlined />} >
          <Menu.Item key="mnperson" onClick={() => navigate('/cadastro/pessoa')} icon={<TeamOutlined />} >
            Pessoa
          </Menu.Item>
          <Menu.Item key="mnitem" onClick={() => navigate('/cadastro/item')} icon={<TagOutlined />} >
            Item
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <div className='content'>{props.children}</div>
      <footer>
        JS System - 2022 - Todos os direitos autorais reservados
      </footer>
    </div >
  );

}

export default App;
