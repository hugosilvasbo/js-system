import axios from 'axios';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast, ToastContainer } from 'react-toastify';
import constantes from '../../assets/jsConstantes.json';
import ConfirmDialogPrime from '../../components/ConfirmDialogPrime';
import FrameCadButtons from '../../components/FrameCadButtons';
import InputTextPrime from '../../components/InputTextPrime';
import TableBootstrap from '../../components/TableBootstrap';
import '../../style/vars.scss';
import InputPasswordPrime from './../../components/InputPasswordPrime';

const Pessoa = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors }
    } = useForm()

    const URL_PERSON = constantes.url_api_barber + 'person/';

    const [data, setData] = useState({});
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [deletePerson, setDeletePerson] = useState(false);

    useEffect(() => {
        if (!deletePerson) return;

        axios.delete(URL_PERSON + getValues('_id'))
            .then((res: any) => {
                toast.success(res.data.message);
            })
            .catch((e: any) => {
                toast.error('' + e)
            })
            .finally(() => {
                setDeletePerson(false);
                setOpenDialogDelete(false);
            })
    }, [deletePerson])

    const onClickNew = () => {
        reset({ password_reseted: true });
    }

    const onClickSearch = async () => {
        try {
            let res = await axios.get(URL_PERSON);
            setData(res.data)
        } catch (error) {
            toast.error('Falha na consulta!');
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
        setOpenDialogDelete(true);
    }

    const TabConsulta = () => {
        return <>
            <TableBootstrap
                column={["name", "email", "cellphone"]}
                data={data}
                onItemClick={(obj: any) => _.mapValues(obj, (o: any, key: string) => { setValue(key, o) })}
                title={["Nome", "E-Mail", "Celular"]}
            />
        </>
    }

    const TabDigitacao = () => {
        return <>
            <form id='formdigitacao' onSubmit={handleSubmit(onSubmit)}>
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
            <Container fluid>
                <Row>
                    <Col>
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
                    </Col>
                    <Col md="auto">
                        <FrameCadButtons
                            onClickNew={() => onClickNew()}
                            onClickEdit={() => console.log('Desenvolver...')}
                            onClickSave={{ onClick: () => console.log('Save clicked'), formControl: 'formdigitacao' }}
                            onClickDelete={() => onClickDelete()}
                            onClickCancel={() => console.log('Desenvolver...')}
                            onClickSearch={() => onClickSearch()}
                        />
                    </Col>
                </Row>
            </Container>
            <ConfirmDialogPrime
                visible={openDialogDelete}
                yes={() => setDeletePerson(true)}
                no={() => setOpenDialogDelete(false)}
                message={'Excluir pessoa ?'}
                header={'Excluir pessoa'}
                hide={openDialogDelete}  arrumar isso aqui...
            />
        </>
    )
}

export default Pessoa;