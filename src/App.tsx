import { AppstoreOutlined, CalendarOutlined, HomeOutlined, TagOutlined, TeamOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { Content, Header } from "antd/lib/layout/layout";
import Menu from 'antd/lib/menu';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './style/App.scss';
import './style/vars.scss';

function App(props: any) {
  const navigate = useNavigate();

  return (
    <>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['mnhome']}>
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
        <Menu.Item key="mnagenda" onClick={() => navigate('/agenda')} icon={<CalendarOutlined />}>
          Agenda
        </Menu.Item>
      </Menu>
      <Layout style={{
        minHeight: "100vh",
        padding: '0.6rem',
      }}>
        <Content style={{
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: '0.6rem'
        }} className='bx_10'>
          {props.children}
        </Content>
      </Layout>
    </>
  );
}

export default App;
