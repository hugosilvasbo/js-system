import { Col, Modal, Row, Table, Tabs } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import constantes from '../../assets/jsConstantes.json';
import CheckBoxAntd from '../../components/antdesign/CheckBoxAntd';
import InputPassword from '../../components/antdesign/InputPasswordAntd';
import InputText from '../../components/antdesign/InputTextAntd';
import FrameCadButtons from '../../components/mine/FrameCadButtons';
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
    const [openDialog, setOpenDialog] = useState(false);
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

    const FrameConsulta = () => {
        return <>
            <Content>
                <Table
                    dataSource={dataSource}
                    columns={tableColumns}
                    onRow={(record) => { return { onClick: () => { setValue("person", record) } }; }}
                />
            </Content>
        </>
    }

    const FrameDigitacao = () => {
        return <>
            <form id='formdigitacao' onSubmit={handleSubmit(onSubmit)}>

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
            </form >
        </>
    }

    const tabs = [
        { label: 'Consulta', key: 'tab-consulta', children: <FrameConsulta /> },
        { label: 'Digitação', key: 'tab-digitacao', children: <FrameDigitacao /> },
    ];

    useEffect(() => {
        if (deletePerson) {
            axios.delete(URL_PERSON + getValues('person._id'))
                .then((res: any) => {
                    toast.success(res.data.message);
                })
                .catch((e: any) => {
                    toast.error('' + e)
                });
        }
    }, [deletePerson])

    const onSubmit = async (data: any) => {
        console.log('onSubmit...')
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
            setInEdition(false);
            console.log({ inEditionSubmit: inEdition })
        }
    }

    return (
        <>
            <Row>
                <Col flex="auto">
                    <Tabs type="card" items={tabs} />
                </Col>
                <Col style={{marginLeft: '10px'}}>
                    <FrameCadButtons
                        onClickNew={() => {
                            setInEdition(true)
                            reset();
                        }}
                        onClickEdit={() => {
                            setInEdition(true)
                        }}
                        onClickDelete={() => {
                            setOpenDialog(true);
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
                        onClickSave={
                            { form: 'formdigitacao', onClick: () => console.log('Submit') }
                        }
                        inEdition={inEdition}
                    />
                </Col>
            </Row>
            <Modal
                title="Exclusão"
                open={openDialog}
                onOk={function () {
                    setOpenDialog(false);
                    setDeletePerson(true);
                }}
                onCancel={() => setOpenDialog(false)}
                okText="Sim"
                cancelText="Não"
            >
                <p>Deseja excluir o cadastro da pessoa?</p>
            </Modal>
            <ToastContainer />
        </>
    )
}

export default Pessoa;