import axios from 'axios';
import { Button } from 'primereact/button';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TableBootstrap from '../../components/TableBootstrap';
import constantes from '../../storage/jsConstantes.json';
import '../../style/pessoa.scss';

export default class Pessoa extends React.Component {
    state = {
        data: {}
    }

    TabConsulta = () => {
        const onConsultar = async () => {
            try {
                let resp = await axios.get(constantes.url_api_barber + 'person');
                this.setState({ data: resp.data });
            } catch (error) {
                console.log(error)
            }
        }

        return (
            <>
                <Button icon="pi pi-search" className="p-button-sm" onClick={() => onConsultar()} />
                <TableBootstrap
                    title={["#", "Nome", "E-Mail", "Celular"]}
                    data={this.state.data}
                    column={["_id", "name", "email", "cellphone"]}
                />
            </>
        )
    }

    TabDigitacao = () => {
        return (
            <>
                Cadastro
            </>
        )
    }

    render() {
        return (
            <>
                <Tabs>
                    <TabList>
                        <Tab>Consulta</Tab>
                        <Tab>Digitação</Tab>
                    </TabList>
                    <TabPanel >
                        <this.TabConsulta />
                    </TabPanel>
                    <TabPanel>
                        <this.TabDigitacao />
                    </TabPanel>
                </Tabs>
            </>
        )
    }
}