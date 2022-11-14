import { AppstoreOutlined, CalendarOutlined, HomeOutlined, TagOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "./style/antd.customize.scss";
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
        { label: 'Cliente', key: 'mn-person', onClick: () => navigate('/cadastro/pessoa'), icon: < UserOutlined /> },
        { label: 'Funcionário', key: 'mn-employee', onClick: () => navigate('/cadastro/funcionario'), icon: < TeamOutlined /> },
        { label: 'Item e Serviço', key: 'mn-items', onClick: () => navigate('/cadastro/item'), icon: < TagOutlined /> }
      ],
    },
    { label: 'Agenda', key: 'mn-agenda', icon: <CalendarOutlined />, onClick: () => navigate('/agenda') }, // remember to pass the key prop
    { label: 'Agenda 2', key: 'mn-agenda2', icon: <CalendarOutlined />, onClick: () => navigate('/agendamento') }, // remember to pass the key prop
  ];

  return (
    <>
      <Menu items={menus} mode="horizontal" theme="dark" defaultSelectedKeys={['mn-home']} />
      <Layout style={{
        minHeight: "100vh",
        padding: '0.4rem',
      }}>
        <Content style={{
          backgroundColor: '#fff',
          padding: '0.6rem',
          borderRadius: '0.6rem'
        }} className='bx_10'>
          {props.children}
        </Content>
      </Layout>
    </>
  );
}

export default App;
