import { AppstoreOutlined, CalendarOutlined, FileAddOutlined, HomeOutlined, ScheduleOutlined, TagOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
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
        {
          label: "Agenda",
          key: "mn-schedule",
          icon: <ScheduleOutlined />,
          children: [
            { label: 'Situação', key: 'mn-schedule-situation', onClick: () => navigate('/cadastro/agenda_situacao'), icon: <FileAddOutlined /> },
          ]
        },
        { label: 'Item e Serviço', key: 'mn-items', onClick: () => navigate('/cadastro/item'), icon: < TagOutlined /> },
        {
          label: "Pessoas",
          key: "mn-people",
          icon: < UserOutlined />,
          children: [
            { label: 'Cliente', key: 'mn-person', onClick: () => navigate('/cadastro/pessoa'), icon: < UserOutlined /> },
            { label: 'Funcionário', key: 'mn-employee', onClick: () => navigate('/cadastro/funcionario'), icon: < TeamOutlined /> },
          ]
        },
      ],
    },
    { label: 'Agenda', key: 'mn-agenda', icon: <CalendarOutlined />, onClick: () => navigate('/agenda') }, // remember to pass the key prop
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
