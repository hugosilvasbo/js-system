import axios from 'axios';
import { Button } from 'primereact/button';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CheckBoxPrime from '../../components/CheckBoxPrime';
import FrameCadButtons from '../../components/FrameCadButtons';
import InputPasswordPrime from '../../components/InputPasswordPrime';
import InputTextPrime from '../../components/InputTextPrime';
import TableBootstrap from '../../components/TableBootstrap';
import constantes from '../../storage/jsConstantes.json';
import '../../style/pessoa.scss';

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
        },
        inputs: {
            password: '',
            passwordReseted: false
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
            <div>
                <FrameCadButtons
                    onClickNew={() => { }}
                    onClickEdit={() => { }}
                    onClickSave={() => { }}
                    onClickDelete={() => { }}
                    onClickCancel={() => { }}
                />
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
                                value={this.state.inputs.password}
                                onChange={(e: string) => { this.setState({ inputs: { password: e } }) }}
                            />
                        </Col>
                        <Col>
                            <CheckBoxPrime
                                caption='Resetar senha'
                                checked={this.state.inputs.passwordReseted}
                                onChange={(e: boolean) => this.setState({ inputs: { passwordReseted: e } })}
                            />
                        </Col>
                    </Row>
                </Container>
                {/**<button onClick={() => this.setState({ validation: { name: 'Teste de validação' } })}>Testando</button>**/}
            </div>
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