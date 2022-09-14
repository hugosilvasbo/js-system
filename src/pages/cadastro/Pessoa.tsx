import axios from 'axios';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast, ToastContainer } from 'react-toastify';
import constantes from '../../assets/jsConstantes.json';
import CheckBoxPrime from '../../components/CheckBoxPrime';
import FrameCadButtons from '../../components/FrameCadButtons';
import InputPasswordPrime from '../../components/InputPasswordPrime';
import InputTextPrime from '../../components/InputTextPrime';
import TableBootstrap from '../../components/TableBootstrap';
import '../../style/pessoa.scss';
import '../../style/vars.scss';

export default class Pessoa extends React.Component {
    URL_PERSON = constantes.url_api_barber + 'person/';

    state = {
        data: {},
        currentData: {} as any,
        validation: {}
    }

    onClickSearch = async () => {
        try {
            let res = await axios.get(this.URL_PERSON);
            this.setState({ data: res.data });
        } catch (error) {
            toast.error('Falha na consulta de pessoas!');
            console.log({ personFail: error })
        }
    }

    onClickSave = async () => {
        this.setState({ validation: {} })

        if (!this.state.currentData.name) {
            this.setState((prev) => ({ validation: { ...prev, name: 'Nome é obrigatório!' } }))
        }

        console.log({ statePost: this.state.validation })

        if (!this.state.currentData.user) {
            this.setState((prev) => ({ validation: { ...prev, user: 'Usuário é obrigatório!' } }))
        }

        console.log({ statePost: this.state.validation })

        if (!this.state.currentData.password) {
            this.setState((prev) => ({ validation: { ...prev, password: 'Senha é obrigatório!' } }))
        }

        console.log({ statePost: this.state.validation })

        if (this.state.validation)
            return;

        try {
            let res = null;

            if (this.state.currentData._id !== undefined)
                res = await axios.patch(this.URL_PERSON + this.state.currentData._id, this.state.currentData)
            else
                res = await axios.post(this.URL_PERSON, this.state.currentData)

            toast.success(res.data.message)
        } catch (error) {
            toast.error('' + error);
            console.log({ errorSavePerson: error })
        }
    }

    onClickDelete = async () => {
        try {
            const res = await axios.delete(this.URL_PERSON + this.state.currentData._id);
            toast.success(res.data.message);
        } catch (error) {
            toast.error('' + error)
        }
    }

    onClickNew = () => {
        this.setState({ currentData: [{}] })
    }

    TabConsulta = () => {
        return (
            <TableBootstrap
                title={["Nome", "E-Mail", "Celular"]}
                data={this.state.data}
                column={["name", "email", "cellphone"]}
                onItemClick={(e: any) => this.setState({ currentData: e })}
            />
        )
    }

    TabDigitacao = () => {
        return (
            <div className='bx_1'>
                <Container fluid>
                    <Row>
                        <Col>
                            <InputTextPrime
                                id={'Name'}
                                title={'Nome'}
                                value={this.state.currentData.name}
                                onChange={(e: string) => this.setState((prev: any) => ({ ...prev, currentData: { ...prev.currentData, name: e } }))}
                                errorMessage={this.state.validation.name}
                            />
                        </Col>
                        <Col>
                            <InputTextPrime
                                id={'Email'}
                                title={'E-Mail'}
                                value={this.state.currentData.email}
                                onChange={(e: string) => this.setState((prev: any) => ({ ...prev, currentData: { ...prev.currentData, email: e } }))}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputTextPrime
                                id={'Tel'}
                                title={'Telefone'}
                                value={this.state.currentData.telephone}
                                onChange={(e: string) => this.setState((prev: any) => ({ ...prev, currentData: { ...prev.currentData, telephone: e } }))}
                            />
                        </Col>
                        <Col>
                            <InputTextPrime
                                id={'Cel'}
                                title={'Celular'}
                                value={this.state.currentData.cellphone}
                                onChange={(e: string) => this.setState((prev: any) => ({ ...prev, currentData: { ...prev.currentData, cellphone: e } }))}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm>
                            <InputTextPrime
                                id={'User'}
                                title={'Usuario'}
                                value={this.state.currentData.user}
                                onChange={(e: string) => this.setState((prev: any) => ({ ...prev, currentData: { ...prev.currentData, user: e } }))}
                                errorMessage={this.state.validation.user}
                            />
                        </Col>
                        <Col sm>
                            <InputPasswordPrime
                                id='Password'
                                title='Senha'
                                value={this.state.currentData.password}
                                onChange={(e: string) => this.setState((prev: any) => ({ ...prev, currentData: { ...prev.currentData, password: e } }))}
                                errorMessage={this.state.validation.password}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm>
                            <CheckBoxPrime
                                caption='Resetar senha'
                                checked={this.state.currentData.passwordReseted}
                                onChange={(e: boolean) => this.setState((prev: any) => ({ ...prev, currentData: { ...prev.currentData, passwordReseted: e } }))}
                            />
                        </Col>
                    </Row>
                </Container>

            </div >
        )
    }

    render() {
        return (
            <>
                <FrameCadButtons
                    onClickNew={() => this.onClickNew()}
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
                <ToastContainer />
            </>
        )
    }
}