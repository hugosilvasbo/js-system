import { Table } from 'antd';
import axios from 'axios';
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
import FrameCadButtons from '../../components/mine/FrameCadButtons';
import ConfirmDialogPrime from '../../components/primereact/ConfirmDialogPrime';
import '../../style/vars.scss';

const Pessoa = () => {
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        reset,
        control,
        formState: { errors }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            person: {
                _id: "",
                name: "",
                email: "",
                telephone: "",
                cellphone: "",
                user: "",
                password: "",
                password_reseted: false
            }
        }
    })

    const URL_PERSON = constantes.url_api_barber + 'person/';

    const [dataSource, setDataSource] = useState([]);
    const [dialogDelete, setDialogDelete] = useState(false);
    const [deletePerson, setDeletePerson] = useState(false);
    const [inEdition, setInEdition] = useState(false)

    const tableColumns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'E-Mail',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Celular',
            dataIndex: 'cellphone',
            key: 'cellphone',
        },

    ]

    useEffect(() => {
        if (deletePerson) {
            axios.delete(URL_PERSON + getValues('person._id'))
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

    const onSubmit = async (data: any) => {
        try {
            let res = null;

            if (data.person._id)
                res = await axios.patch(URL_PERSON + data.person._id, data.person)
            else
                res = await axios.post(URL_PERSON, data.person)

            toast.success(res.data.message)
        } catch (error) {
            toast.error('' + error);
        } finally {
            setInEdition(false)
        }
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
                                <Table
                                    dataSource={dataSource}
                                    columns={tableColumns}
                                    onRow={(record) => { return { onClick: () => { setValue("person", record) } }; }}
                                />
                            </TabPanel>
                            <TabPanel>
                                <form id='formdigitacao' onSubmit={handleSubmit(onSubmit)}>
                                    <Container fluid>
                                        <Row>
                                            <Col>
                                                <InputText
                                                    caption='ID'
                                                    hookFormControl={control}
                                                    hookFormErrors={errors}
                                                    hookFormControlName={'person._id'}
                                                    hookFormRegister={{ ...register('person._id') }}
                                                    disabled={true}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <InputText
                                                    caption='Nome'
                                                    hookFormControl={control}
                                                    hookFormErrors={errors}
                                                    hookFormControlName={'person.name'}
                                                    hookFormRegister={{ ...register('person.name', { required: 'Nome é obrigatório!' }) }}
                                                    disabled={!inEdition}
                                                />
                                            </Col>
                                            <Col>
                                                <InputText
                                                    caption='E-Mail'
                                                    hookFormControl={control}
                                                    hookFormErrors={errors}
                                                    hookFormControlName={'person.email'}
                                                    hookFormRegister={{ ...register('person.email') }}
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
                                                    hookFormControlName={'person.telephone'}
                                                    hookFormRegister={{ ...register('person.telephone') }}
                                                    disabled={!inEdition}
                                                />
                                            </Col>
                                            <Col>
                                                <InputText
                                                    caption='Celular'
                                                    hookFormControl={control}
                                                    hookFormErrors={errors}
                                                    hookFormControlName={'person.cellphone'}
                                                    hookFormRegister={{ ...register('person.cellphone') }}
                                                    disabled={!inEdition}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <InputText
                                                    caption='Usuário'
                                                    hookFormControl={control}
                                                    hookFormErrors={errors}
                                                    hookFormControlName={'person.user'}
                                                    disabled={!inEdition}
                                                    hookFormRegister={{ ...register('person.user', { required: 'Usuário é obrigatório!' }) }}
                                                />
                                            </Col>
                                            <Col>
                                                <InputPassword
                                                    caption='Senha'
                                                    disabled={!inEdition}
                                                    hookFormControl={control}
                                                    hookFormErrors={errors}
                                                    hookFormControlName={'person.password'}
                                                    hookFormRegister={{ ...register('person.password', { required: 'Senha é obrigatória!' }) }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <CheckBoxAntd
                                                    caption='Restaurar acesso'
                                                    hookFormControl={control}
                                                    hookFormControlName={'person.password_reseted'}
                                                    disabled={!inEdition}
                                                    hookFormRegister={{ ...register('person.password_reseted') }}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </form >
                            </TabPanel>
                            <ToastContainer />
                        </Tabs >
                    </Col>
                    <Col md="auto">
                        <FrameCadButtons
                            onClickNew={() => {
                                setInEdition(true)
                                reset();
                            }}
                            onClickEdit={() => {
                                setInEdition(true)
                            }}
                            onClickSave={{
                                onClick: () =>
                                    console.log('Event submit'), formControl: 'formdigitacao'
                            }}
                            onClickDelete={() => {
                                setDialogDelete(true);
                            }}
                            onClickCancel={() => {
                                setInEdition(false)
                            }}
                            onClickSearch={async () => {
                                try {
                                    let res = await axios.get(URL_PERSON);
                                    setDataSource(res.data)
                                } catch (error) {
                                    toast.error('Falha na consulta!');
                                }
                            }}
                            inEdition={inEdition}
                        />
                    </Col>
                </Row>
            </Container>
            <ConfirmDialogPrime
                visible={dialogDelete}
                yes={() => setDeletePerson(true)}
                no={() => setDialogDelete(false)}
                message={'Deseja confirmar a exclusão?'}
                header={'Excluir pessoa'}
                hide={() => setDialogDelete(false)}
            />
        </>
    )
}

export default Pessoa;