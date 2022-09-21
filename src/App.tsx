import { AppstoreOutlined, CalendarOutlined, HomeOutlined, TagOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "antd/dist/antd.min.css"
import { Content } from "antd/lib/layout/layout";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './style/App.scss';
import './style/vars.scss';

function App(props: any) {
  const navigate = useNavigate();

  const menus = [
    { label: 'Home', key: 'mn-home', icon: <HomeOutlined />, onClick: () => navigate('/') }, // remember to pass the key prop
    {
      label: 'Cadastro',
      key: 'mn-cadastro',
      icon: <AppstoreOutlined />,
      children: [
        { label: 'Pessoa', key: 'mn-person', onClick: () => navigate('/cadastro/pessoa'), icon: < UserOutlined /> },
        { label: 'Funcionário', key: 'mn-employee', onClick: () => navigate('/cadastro/funcionario'), icon: < TeamOutlined /> },
        { label: 'Itens e Serviços', key: 'mn-items', onClick: () => navigate('/cadastro/item'), icon: < TagOutlined /> }
      ],
    },
    { label: 'Agenda', key: 'mn-agenda', icon: <CalendarOutlined />, onClick: () => navigate('/agenda') }, // remember to pass the key prop
  ];

  return (
    <>
      <Menu items={menus} mode="horizontal" theme="dark" defaultSelectedKeys={['mn-home']} />
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
