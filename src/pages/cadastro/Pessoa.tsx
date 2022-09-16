import { ErrorMessage } from '@hookform/error-message/dist';
import axios from 'axios';
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast, ToastContainer } from 'react-toastify';
import constantes from '../../assets/jsConstantes.json';
import FrameCadButtons from '../../components/FrameCadButtons';
import InputTextPrime from '../../components/InputTextPrime';
import TableBootstrap from '../../components/TableBootstrap';
import '../../style/pessoa.scss';
import '../../style/vars.scss';
import InputPasswordPrime from './../../components/InputPasswordPrime';

const Pessoa = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

    const URL_PERSON = constantes.url_api_barber + 'person/';

    const [data, setData] = useState({});

    const onClickSearch = async () => {
        try {
            let res = await axios.get(URL_PERSON);
            setData(res.data)
        } catch (error) {
            toast.error('Falha na consulta!');
            console.log({ personFail: error })
        }
    }

    const onSubmit = async (data: any) => {
        try {
            let res = null;

            if (data._id)
                res = await axios.patch(URL_PERSON + data._id, data)
            else
                res = await axios.post(URL_PERSON, data)

            toast.success(res.data.message)
        } catch (error) {
            toast.error('' + error);
        }
    }

    const onClickDelete = async () => {
        /*try {
            const res = await axios.delete(URL_PERSON + filterData._id);
            toast.success(res.data.message);
        } catch (error) {
            toast.error('' + error)
        }*/
    }

    const TabConsulta = () => {
        return <>
            <Button icon="pi pi-search" onClick={() => onClickSearch()} />
            <TableBootstrap
                column={["name", "email", "cellphone"]}
                data={data}
                onItemClick={(state: any) => setValue('name', 'teste')}
                title={["Nome", "E-Mail", "Celular"]}
            />
        </>
    }

    const TabDigitacao = () => {
        return <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FrameCadButtons
                    onClickNew={() => { }}
                    onClickEdit={() => console.log('Desenvolver...')}
                    onClickSave={() => console.log('Save clicked')}
                    onClickDelete={() => onClickDelete()}
                    onClickCancel={() => console.log('Desenvolver...')}
                />
                <Container fluid>
                    <Row>
                        <Col>
                            <InputTextPrime
                                caption='Nome'
                                register={{ ...register('name', { required: 'Nome é obrigatório!' }) }}
                                errors={errors} 
                                id={'name'}
                            />
                        </Col>
                        <Col>
                            <InputTextPrime
                                caption='E-Mail'
                                register={{ ...register('email', { required: 'E-Mail é obrigatório!' }) }}
                                errors={errors} 
                                id={'email'}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputTextPrime
                                caption='Telefone'
                                register={{ ...register('telephone') }}
                                errors={errors} 
                                id={'telephone'}
                            />
                        </Col>
                        <Col>
                            <InputTextPrime
                                caption='Celular'
                                register={{ ...register('cellphone') }}
                                errors={errors}
                                id={'cellphone'}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputTextPrime
                                caption='Usuário'
                                register={{ ...register('user', { required: 'Usuário é obrigatório!' }) }}
                                errors={errors}
                                id={'user'} />
                        </Col>
                        <Col>
                            <InputPasswordPrime
                                caption='Senha'
                                register={{ ...register('password') }}
                                error={errors.password?.message}
                                id={'password'} />
                        </Col>
                        {/** Ainda não foram inclusos os checkbox's. */}
                    </Row>
                </Container>
            </form >
        </>
    }

    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>Consulta</Tab>
                    <Tab>Digitação</Tab>
                </TabList>
                <TabPanel>
                    <TabConsulta />
                </TabPanel>
                <TabPanel>
                    <TabDigitacao />
                </TabPanel>
                <ToastContainer />
            </Tabs >
        </>
    )
}

export default Pessoa;