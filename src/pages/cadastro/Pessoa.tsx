import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast, ToastContainer } from 'react-toastify';
import constantes from '../../assets/jsConstantes.json';
import FrameCadButtons from '../../components/FrameCadButtons';
import TableBootstrap from '../../components/TableBootstrap';
import '../../style/pessoa.scss';
import '../../style/vars.scss';

const Pessoa = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const URL_PERSON = constantes.url_api_barber + 'person/';

    const [data, setData] = useState({});
    const [currentData, setCurrentData] = useState({} as any);

    const onClickSearch = async () => {
        try {
            let res = await axios.get(URL_PERSON);
            setData(res.data)
        } catch (error) {
            toast.error('Falha na consulta de pessoas!');
            console.log({ personFail: error })
        }
    }

    const onClickSave = async () => {
        try {
            let res = null;

            if (currentData._id)
                res = await axios.patch(URL_PERSON + currentData._id, currentData)
            else
                res = await axios.post(URL_PERSON, currentData)

            toast.success(res.data.message)
        } catch (error) {
            toast.error('' + error);
            console.log({ errorSavePerson: error })
        }
    }

    const onClickDelete = async () => {
        try {
            const res = await axios.delete(URL_PERSON + currentData._id);
            toast.success(res.data.message);
        } catch (error) {
            toast.error('' + error)
        }
    }

    const onClickNew = () => {
        setCurrentData([{}])
    }

    return (
        <>
            <FrameCadButtons
                onClickNew={() => onClickNew()}
                onClickEdit={() => console.log('Desenvolver...')}
                onClickSave={() => onClickSave()}
                onClickDelete={() => onClickDelete()}
                onClickCancel={() => console.log('Desenvolver...')}
                onSearch={() => onClickSearch()}
            />
            <Tabs>
                <TabList>
                    <Tab>Consulta</Tab>
                    <Tab>Digitação</Tab>
                </TabList>
                <TabPanel >
                    <TableBootstrap
                        title={["Nome", "E-Mail", "Celular"]}
                        data={data}
                        column={["name", "email", "cellphone"]}
                        onItemClick={(e: any) => setCurrentData({ e })}
                    />
                </TabPanel>
                <TabPanel>
                    <form onSubmit={handleSubmit(data => console.log({ dataform: data }))}>
                        <Container fluid>
                            <Row>
                                <Col>
                                    <InputText
                                        id={'name'}
                                        className="p-inputtext-sm block mb-2"
                                        {...register('name', { required: 'Campo obrigatório!' })}
                                    />
                                    <span id='errorname' className='p-error block'>
                                        <>{errors.name?.message}</>
                                    </span>
                                </Col>
                            </Row>
                            <button>Teste...</button>
                        </Container>
                    </form>
                </TabPanel>
            </Tabs>
            <ToastContainer />
        </>
    )
}

export default Pessoa;