import _ from 'lodash';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../../style/pessoa.scss'

export default class Pessoa extends React.Component {
    render() {
        return (
            <>
                <Tabs>
                    <TabList>
                        <Tab>Consulta</Tab>
                        <Tab>Digitação</Tab>
                    </TabList>
                    <TabPanel >
                        <TabConsulta />
                    </TabPanel>
                    <TabPanel>
                        <TabCadastro />
                    </TabPanel>
                </Tabs>
            </>
        )
    }
}

const TabConsulta = () => {
    return (
        <>
            <div id="filtro">
                FIltragem
            </div>
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