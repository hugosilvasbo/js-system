import axios from 'axios';
import { Button } from 'primereact/button';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TableBootstrap from '../../components/TableBootstrap';
import constantes from '../../storage/jsConstantes.json';
import '../../style/pessoa.scss';
import { InputText } from 'primereact/inputtext';
import InputTextPrime from '../../components/InputTextPrime';
import { Container, Row, Col } from 'react-bootstrap';
import InputPasswordPrime from '../../components/InputPasswordPrime';

export default class Pessoa extends React.Component {
    state = {
        data: {},
        validation: {
            name: '',
            email: '',
            tel: '',
            cel: '',
            user: '',
            password: ''
        }
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
                <Container fluid>
                    <Row>
                        <Col><InputTextPrime id={'Name'} title={'Nome'} error={this.state.validation.name} /></Col>
                        <Col><InputTextPrime id={'Email'} title={'E-Mail'} error={this.state.validation.email} /></Col>
                        <Col><InputTextPrime id={'Tel'} title={'Telefone'} error={this.state.validation.tel} /></Col>
                        <Col><InputTextPrime id={'Cel'} title={'Celular'} error={this.state.validation.cel} /></Col>
                        <Col><InputTextPrime id={'User'} title={'Usuario'} error={this.state.validation.user} /></Col>
                        <Col>
                            <InputPasswordPrime
                                id='Password'
                                title='Senha'
                                value={'Senha teste'}
                                onChange={} -->>> terminar de passar as properties
                            />
                        </Col>
                    </Row>
                </Container>
                {/**<button onClick={() => this.setState({ validation: { name: 'Teste de validação' } })}>Testando</button>**/}
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