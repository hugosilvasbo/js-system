import axios from 'axios';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Prev } from 'react-bootstrap/esm/PageItem';
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
        currentData: {} as any,
        validation: {
            name: '',
            email: '',
            tel: '',
            cel: '',
            user: '',
            password: ''
        }
    }

    URL_PERSON = constantes.url_api_barber + 'person';

    onClickSearch = async () => {
        try {
            let resp = await axios.get(this.URL_PERSON);
            this.setState({ data: resp.data });
        } catch (error) {
            console.log(error)
        }
    }

    onClickSave = async () => {
        try {
            console.log({ dataPost: this.state.currentData })
            let resp = undefined;

            if (this.state.currentData._id)
                resp = await axios.patch(this.URL_PERSON + '/', this.state.currentData)
            else
                resp = await axios.post(this.URL_PERSON + '/', this.state.currentData)

            console.log(resp)
        } catch (error) {
            console.log(error)
        }
    }

    onClickDelete = () => {

    }

    TabConsulta = () => {
        return (
            <>
                <button onClick={() => console.log(this.state.currentData)}>Testando</button>
                <TableBootstrap
                    title={["Nome", "E-Mail", "Celular"]}
                    data={this.state.data}
                    column={["name", "email", "cellphone"]}
                    onItemClick={(e: any) => this.setState({ currentData: e })}
                />
            </>
        )
    }

    TabDigitacao = () => {
        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col>
                            <InputTextPrime
                                id={'Name'}
                                title={'Nome'}
                                defaultValue={this.state.currentData.name}
                                error={this.state.validation.name}
                                onChange={(e: string) => { this.setState(prevState => ({ currentData: { ...prevState, name: e } })) }}
                            />
                        </Col>
                        <Col>
                            <InputTextPrime
                                id={'Email'}
                                title={'E-Mail'}
                                defaultValue={this.state.currentData.email}
                                error={this.state.validation.email}
                                onChange={(e: string) => { this.setState(prevCurrentData => ({ currentData: { ...prevCurrentData, email: e } })) }}
                            />
                        </Col>
                        <Col>
                            <InputTextPrime
                                id={'Tel'}
                                title={'Telefone'}
                                defaultValue={this.state.currentData.telephone}
                                onChange={(e: string) => { this.setState(prevCurrentData => ({ currentData: { ...prevCurrentData, telephone: e } })) }}
                                error={this.state.validation.tel}
                            />
                        </Col>
                        <Col>
                            <InputTextPrime
                                id={'Cel'}
                                title={'Celular'}
                                defaultValue={this.state.currentData.cellphone}
                                error={this.state.validation.cel}
                                onChange={(e: string) => { this.setState(prevCurrentData => ({ currentData: { ...prevCurrentData, cellphone: e } })) }}
                            />
                        </Col>
                        <Col>
                            <InputTextPrime
                                id={'User'}
                                title={'Usuario'}
                                defaultValue={this.state.currentData.cellphone}
                                error={this.state.validation.user}
                                onChange={(e: string) => { this.setState(prevCurrentData => ({ currentData: { ...prevCurrentData, user: e } })) }}
                            />
                        </Col>
                        <Col>
                            <InputPasswordPrime
                                id='Password'
                                title='Senha'
                                value={this.state.currentData.password}
                                onChange={(e: string) => { this.setState(prevCurrentData => ({ currentData: { ...prevCurrentData, password: e } })) }}
                            />
                        </Col>
                        <Col>
                            <CheckBoxPrime
                                caption='Resetar senha'
                                checked={true}
                                onChange={(e: boolean) => { this.setState(prevCurrentData => ({ currentData: { ...prevCurrentData, passwordReseted: e } })) }}
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
                <FrameCadButtons
                    onClickNew={() => console.log('Desenvolver...')}
                    onClickEdit={() => console.log('Desenvolver...')}
                    onClickSave={() => this.onClickSave()}
                    onClickDelete={() => this.onClickDelete()}
                    onClickCancel={() => console.log('Desenvolver...')}
                    onSearch={() => this.onClickSearch()}
                />
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




ARRUMAR O SETSTATE DO USUARIO...