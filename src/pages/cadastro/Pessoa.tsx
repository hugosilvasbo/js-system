import axios from 'axios';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast, ToastContainer } from 'react-toastify';
import constantes from '../../assets/jsConstantes.json';
import CheckBoxAntd from '../../components/antdesign/CheckBoxAntd';
import InputPassword from '../../components/antdesign/InputPasswordAntd';
import InputText from '../../components/antdesign/InputTextAntd';
import ConfirmDialogPrime from '../../components/primereact/ConfirmDialogPrime';
import FrameCadButtons from '../../components/mine/FrameCadButtons';
import TableBootstrap from '../../components/bootstrap/TableBootstrap';
import '../../style/vars.scss';

const Pessoa = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        control,
        formState: { errors }
    } = useForm()

    const URL_PERSON = constantes.url_api_barber + 'person/';

    const [data, setData] = useState({});
    const [dialogDelete, setDialogDelete] = useState(false);
    const [deletePerson, setDeletePerson] = useState(false);
    const [inEdition, setInEdition] = useState(false)

    useEffect(() => {
        if (deletePerson) {
            axios.delete(URL_PERSON + getValues('_id'))
                .then((res: any) => {
                    toast.success(res.data.message);
                })
                .catch((e: any) => {
                    toast.error('' + e)
                })
                .finally(() => {
                    setDeletePerson(false);
                })
        }
    }, [deletePerson])

    const onClickNew = () => {
        setInEdition(true)
        reset();
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
        } finally {
            setInEdition(false)
        }
    }

    const onClickDelete = () => {
        setDialogDelete(true);
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
                            <InputText
                                caption='Nome'
                                hookFormControl={control}
                                hookFormErrors={errors}
                                hookFormRegister={{ ...register('name', { required: 'Nome é obrigatório!' }) }}
                                id={'name'}
                                disabled={!inEdition}
                            />
                        </Col>
                        <Col>
                            <InputText
                                caption='E-Mail'
                                hookFormControl={control}
                                hookFormErrors={errors}
                                hookFormRegister={{ ...register('email') }}
                                id={'email'}
                                disabled={!inEdition}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputText
                                caption='Telefone'
                                hookFormControl={control}
                                hookFormErrors={errors}
                                hookFormRegister={{ ...register('telephone') }}
                                id={'telephone'}
                                disabled={!inEdition}
                            />
                        </Col>
                        <Col>
                            <InputText
                                caption='Celular'
                                id={'cellphone'}
                                hookFormControl={control}
                                hookFormErrors={errors}
                                hookFormRegister={{ ...register('cellphone') }}
                                disabled={!inEdition}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputText
                                caption='Usuário'
                                id={'user'}
                                hookFormControl={control}
                                hookFormErrors={errors}
                                disabled={!inEdition}
                                hookFormRegister={{ ...register('user', { required: 'Usuário é obrigatório!' }) }}
                            />
                        </Col>
                        <Col>
                            <InputPassword
                                caption='Senha'
                                id={'password'}
                                disabled={!inEdition}
                                hookFormControl={control}
                                hookFormErrors={errors}
                                hookFormRegister={{ ...register('password', { required: 'Senha é obrigatória!' }) }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <CheckBoxAntd
                                caption='Restaurar acesso'
                                id={'password_reseted'}
                                hookFormControl={control}
                                disabled={!inEdition}
                                hookFormRegister={{ ...register('password_reseted') }}
                            />
                        </Col>
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
                            onClickEdit={() => setInEdition(true)}
                            onClickSave={{ onClick: () => console.log('Event submit'), formControl: 'formdigitacao' }}
                            onClickDelete={() => onClickDelete()}
                            onClickCancel={() => setInEdition(false)}
                            onClickSearch={() => onClickSearch()}
                            inEdition={inEdition}
                        />
                    </Col>
                </Row>
            </Container>
            <ConfirmDialogPrime
                visible={dialogDelete}
                yes={() => setDeletePerson(true)}
                no={() => setDialogDelete(false)}
                message={'Excluir pessoa ?'}
                header={'Excluir pessoa'}
                hide={() => setDialogDelete(false)}
            />
        </>
    )
}

export default Pessoa;