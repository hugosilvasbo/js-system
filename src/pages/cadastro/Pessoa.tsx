import _ from 'lodash';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const tabList = [
    { caption: 'Consulta', id: 'cns', children: () => <TabConsulta /> },
    { caption: 'Digitação', id: 'dig', children: () => <TabCadastro /> }
];

const Pessoa = () => {
    return (
        <>
            <Tabs>
                <TabList>
                    {
                        _.map(tabList, (tab: any) => {
                            return <Tab key={tab.id + '_title'}>{tab.caption}</Tab>
                        })
                    }
                </TabList>
                {
                    _.map(tabList, (tab: any) => {
                        return <TabPanel key={tab.id + '_content'}>
                            {tab.children}
                        </TabPanel>
                    })
                }
            </Tabs>
        </>
    )
}

const TabConsulta = () => {
    return (
        <>
            Consulta
        </>
    )
}

const TabCadastro = () => {
    return (
        <>
            Cadastro
        </>
    )
}

export default Pessoa;