import axios from 'axios';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TableBootstrap from '../../components/TableBootstrap';
import constantes from '../../storage/jsConstantes.json';
import '../../style/pessoa.scss';
import { Button } from 'primereact/button';

export default class Pessoa extends React.Component {
    state = {
        data: {}
    }

    Consulta = () => {
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
                    dataDescription={["_id", "name", "email", "cellphone"]}
                />
            </>
        )
    }

    Digitacao = () => {
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
                        <this.Consulta />
                    </TabPanel>
                    <TabPanel>
                        <this.Digitacao />
                    </TabPanel>
                </Tabs>
            </>
        )
    }
}