import { CloseOutlined } from "@ant-design/icons";
import { Button, Calendar, Card, CardProps, Col, Form, Input, Modal, Row, Table, Tooltip } from "antd";
import local from 'antd/es/date-picker/locale/pt_BR';
import { ColumnsType } from "antd/lib/table";
import axios from "axios";
import _, { filter, mapValues, result } from "lodash";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import AgendamentoModal from '../../classes/Agendamento';
import DateUtils from "../../classes/utils/DateUtils";
import InputSearch from "../../components/antdesign/InputSearch";
import WrapperButtons, { enBotoes } from "../../components/mine/WrapperButtons";
import './Agenda.scss';

interface IPropsContent {
    calendarMode: boolean
}

interface IModalItem {
    openModal: boolean,
    onCancel: any,
    schedule: any
}

interface IPropsContentCalendar extends IPropsContent {
    onPanelChange: any,
    scheduleInMonth: {},
    onSelectedDate: any
}

interface IPropsContentTable extends IPropsContent {
    scheduleDay: {}
}

interface TypeTableMode {
    key: string;
    schedule_time: string,
    client: string,
    situation: {
        description: string,
        color: string
    }
}

export default class Agenda extends React.Component {
    state = {
        hideSidebar: false,
        calendarMode: true,
        scheduleMonth: {},
        scheduleDay: {} as any,
        scheduleSelected: {},
        openModal: false
    }

    componentDidMount(): void {
        console.log("Component did mount Agenda")
    }

    async fetchMonthData(value: Moment) {
        const _urlPadrao = `http://localhost:3000/schedule`;

        function getFilter(firstData: boolean) {
            let _clone = value.clone();
            return (firstData ? _clone.startOf('month') : _clone.endOf('month')).format("YYYY-MM-DD");
        }

        let res = await axios.get(_urlPadrao, {
            params: {
                date: getFilter(true),
                date_end: getFilter(false)
            }
        });

        let groupByDate = _.groupBy(res.data, (r: any) => moment(r.date).format("YYYY-MM-DD"));

        return groupByDate;
    }

    getScheduleInDay = (date: Moment) => {
        let _keyFormat = date.format("YYYY-MM-DD");
        return _.pick(this.state.scheduleMonth, _keyFormat);;
    }

    WrapperSidebar = (props: any) => {
        const _styleCard: CardProps = {
            size: "small",
            type: "inner",
            className: "wrapper-sidebar-selection"
        }

        const _extraCard = (
            <Tooltip placement='bottom' title={'Fechar o painel'}>
                <CloseOutlined onClick={() => this.setState({ ...this.state, hideSidebar: true })} />
            </Tooltip>
        );

        return <>
            <Col span={this.state.hideSidebar ? 0 : 4}>
                <Card
                    title="Detalhamento"
                    style={_styleCard}
                    extra={_extraCard}
                >
                    {props.children}
                </Card>
            </Col>
        </>
    }

    ItemsSidebar = () => {
        const Content = (props: any) => {
            const _schedule = props.schedule;
            const _style = { borderLeft: `4px solid ${_schedule.situation?.color ?? "#bbbbbb"}` };

            const _content = <>
                <Row justify="space-around">
                    <Col>
                        {moment(_schedule.date).format("HH:mm")} à {moment(_schedule.date_end).format("HH:mm")}
                    </Col>
                </Row>
                <Row justify="center">
                    <Col>
                        {_schedule.person?.name}
                    </Col>
                </Row>
            </>;

            const _onClickItem = () => {
                this.setState({
                    ...this.state,
                    openModal: "edit",
                    scheduleSelected: _schedule
                });
            }

            return <Tooltip title="Clique para alterar">
                <Row className="item-sidebar"
                    style={_style}
                    onClick={() => _onClickItem()}>
                    <Col span={24}>
                        {_content}
                    </Col>
                </Row>
            </Tooltip>
        }

        return <>{_.map(this.state.scheduleDay, (schedules: any) => _.map(schedules, (schedule: any) => <Content schedule={schedule} />))}</>
    }

    WrapperContent = () => {
        useEffect(() => {
            console.log("Wrapper content use effect.")
        }, []);

        const _onPanelChange = async (data: Moment) => {
            let _scheduleInMonth = await this.fetchMonthData(data);

            this.setState({ ...this.state, scheduleMonth: _scheduleInMonth });
        }

        const _onSelectedDate = (date: Moment) => {
            let _schedulesInDay = this.getScheduleInDay(date);

            this.setState({
                ...this.state,
                scheduleDay: _schedulesInDay,
                hideSidebar: false
            });
        }

        return <>
            <Col span={this.state.hideSidebar ? 24 : 20} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <ModoCalendario
                    calendarMode={this.state.calendarMode}
                    onPanelChange={_onPanelChange}
                    scheduleInMonth={this.state.scheduleMonth}
                    onSelectedDate={_onSelectedDate}
                />
                <ModoTabela
                    calendarMode={this.state.calendarMode}
                    scheduleDay={this.state.scheduleDay}
                />
            </Col>
        </>
    }

    WrapperMainButtons = () => {
        useEffect(() => {
            console.log("Use effect wrapper main buttons")
        }, []);

        const _callback = (clique: enBotoes) => {
            switch (clique) {
                case enBotoes.eProcurar: {
                    this.setState({ ...this.state, calendarMode: !this.state.calendarMode })
                    break;
                }
                case enBotoes.eNovo: {
                    this.setState({
                        ...this.state,
                        scheduleSelected: {},
                        openModal: true
                    });
                    break;
                }
            }
        }

        return <>
            <Row justify='end'>
                <WrapperButtons
                    inEdition={false}
                    callbackClick={_callback}
                    orientation={'horizontal'}
                    invisible={[enBotoes.eAlterar, enBotoes.eExcluir, enBotoes.eGravar, enBotoes.eCancelar]}
                    tooltipCaption={[{ button: enBotoes.eProcurar, caption: "Mudar modo de visualização" }]}
                />
            </Row>
        </>
    }

    _onCloseModalManutencao = () => {
        this.setState({
            ...this.state,
            openModal: ""
        })
    }

    render() {
        return <>
            <Row justify="end">
                <this.WrapperMainButtons />
            </Row>
            <Row>
                <this.WrapperSidebar>
                    <this.ItemsSidebar />
                </this.WrapperSidebar>
                <this.WrapperContent />
            </Row>
            <ToastContainer />
            <ModalManutencao
                openModal={this.state.openModal}
                onCancel={this._onCloseModalManutencao}
                schedule={this.state.scheduleSelected}
            />
        </>
    }
}

class ModoCalendario extends React.Component<IPropsContentCalendar, {}> {
    onDateCellRender = (value: Moment) => {
        const ScheduleItem = (props: any) => {
            return (
                <Tooltip placement='leftBottom' title='Clique para mais detalhes'>
                    <li key={`cal-item-${props._id}`}
                        className='list-items'
                        style={{ backgroundColor: props.background ?? '#fff' }}>
                        {props.children}
                    </li>
                </Tooltip >
            )
        }

        let _schedulesInDay = _.pick(this.props.scheduleInMonth, value.format("YYYY-MM-DD"));

        return (
            _.map(_schedulesInDay, (schedule: any) => {
                return <>{
                    <div className='wrapper-cedule'> {
                        _.map(schedule, (value: any) =>
                            <ScheduleItem _id={value._id} background={value.situation?.color}>
                                {value.person?.name}
                            </ScheduleItem>)
                    }</div>
                }</>
            })
        );
    }

    render() {
        return <div hidden={!this.props.calendarMode}>
            <Calendar
                locale={local}
                onPanelChange={date => this.props.onPanelChange(date)}
                dateCellRender={this.onDateCellRender}
                onSelect={(date: Moment) => this.props.onSelectedDate(date)}
            />
        </div>
    }
}

class ModoTabela extends React.Component<IPropsContentTable, {}> {
    _columns: ColumnsType<TypeTableMode> = [
        {
            title: 'Horário',
            dataIndex: 'schedule_time',
            key: 'schedule_time',
            width: "5%",
            render(text, record) {
                return <span style={{ color: record.situation?.color }}>{text}</span>;
            }
        },
        {
            title: 'Cliente',
            dataIndex: 'client',
            key: 'client',
            width: "75%",
            render(text, record) {
                return <span style={{ color: record.situation?.color }}>{text}</span>;
            }
        },
        {
            title: 'Situação',
            dataIndex: ['situation', 'description'],
            key: 'situation',
            width: "20%",
            render(text, record) {
                return <span style={{ color: record.situation?.color }}>{text}</span>;
            }
        }
    ];

    dataSource() {
        if (this.props.calendarMode === true) return;

        //** o dia tanto faz, pois precisamos dessa variável de data apenas para trabalharmos com o horário */
        let _dateKey = moment(new Date()).format("YYYY-MM-DDT00:00:00");

        let jobTime = new Date(_dateKey);
        jobTime.setHours(8, 0, 0, 0);

        let endJobTime = new Date(_dateKey);
        endJobTime.setHours(20, 0, 0, 0);

        let _rangeTime = 30;

        let _hoursAvailable: any = [];

        while (jobTime.getTime() < endJobTime.getTime()) {
            let _NewRange = _rangeTime;

            // transformando o objeto em outra estrutura para utilizarmos aqui.
            let _schedules: any = [];
            _.forEach(this.props.scheduleDay, (_sch: any) => {
                _schedules = _.map(_sch, (value: any) => { return { ..._schedules, ...value } });
            });

            // filtra apenas aqueles que ainda não foram inclusos na tabela.
            let _onlyAvailableSchedule = _.filter(_schedules, (schedule: any) => {
                let everIncluded = _.filter(_hoursAvailable, (horario: any) => horario.key === schedule._id);
                return (new Date(schedule.date).getHours() === jobTime.getHours()) && (everIncluded.length <= 0);
            });

            if (_onlyAvailableSchedule.length > 0) {
                _.map(_onlyAvailableSchedule, (value: any) => {
                    let endTime = new Date(value.date_end);

                    _NewRange = DateUtils.obterVariacaoMinutosEntreDatas(jobTime, endTime);

                    _hoursAvailable.push({
                        schedule_time: DateUtils.dateFormatHHmm(new Date(value.date)) + ' à ' + DateUtils.dateFormatHHmm(endTime),
                        client: value.person.name,
                        situation: value.situation,
                        key: `li-table-${value._id}`,
                    });

                    jobTime.setTime(endTime.getTime())
                });
            }
            else {
                _hoursAvailable.push({
                    schedule_time: DateUtils.dateFormatHHmm(jobTime),
                    client: "",
                    situation: { description: "Disponível", color: "rgb(139 139 139)" },
                    key: new Date().getUTCMilliseconds(),
                });

                jobTime.setMinutes(jobTime.getMinutes() + _NewRange);
            }
        }

        return _hoursAvailable;
    }

    componentDidMount(): void {
        console.log("did mount do modo tabela")
    }

    render() {
        return <>
            <div hidden={this.props.calendarMode}>
                <Table
                    columns={this._columns}
                    dataSource={this.dataSource()}
                    pagination={false}
                />
            </div>
        </>
    }
}

const ModalManutencao = (props: IModalItem) => {
    const [formController] = Form.useForm();
    const [insertMode, setInsertMode] = useState(true);

    useEffect(() => {
        if (props.schedule._id) {
            setInsertMode(false);
            formController.setFieldsValue(props.schedule);
        } else {
            setInsertMode(true);
            formController.resetFields();
        }
    }, [props.openModal]);

    const _getTitle = insertMode ? "Incluir um novo agendamento" : "Alterar o agendamento";

    const _onSubmit = async () => {
        await formController.validateFields()
            .then(async (values: any) => {
                const _agendamento = new AgendamentoModal(values, values._id);
                await _agendamento.send()
                    .then((res: any) => console.log(res.data.message))
                    .catch((e: any) => console.log("" + e))
                    .finally(() => props.onCancel())

            }).catch((e) => console.log(e))
    };

    const _onCancel = () => {
        props.onCancel();
    }

    const _onDelete = async () => {
        const _agendamento = new AgendamentoModal({}, formController.getFieldValue("_id"));
        await _agendamento.delete()
            .then((res: any) => console.log(res.data?.message))
            .catch((e: any) => console.log("Falha ao excluir"));
    }

    const _footerButtons = [
        <Button key="back-modal" onClick={_onCancel}>
            Voltar
        </Button>,
        <Button danger key="delete-modal" type="primary" onClick={_onDelete} hidden={insertMode}>
            Excluir
        </Button>,
        <Button key="submit-modal" type="primary" onClick={_onSubmit}>
            Gravar
        </Button>
    ];

    return <>
        <Modal
            title={_getTitle}
            open={props.openModal}
            onCancel={() => _onCancel()}
            onOk={() => _onSubmit()}
            footer={_footerButtons}
            width="90%">
            <Form form={formController} layout={"vertical"}>
                <Row>
                    <Col span={24} >
                        <Form.Item name={'_id'} hidden={true}><Input /></Form.Item>
                        <Form.Item name={['person', '_id']} hidden={true}><Input /></Form.Item>
                        <Form.Item label={"Cliente"} name={['person', 'name']}>
                            <InputSearch tipo={"cliente"} formController={formController} formKeyName={['person', '_id']} />
                        </Form.Item>
                    </Col>
                </Row>
                <Col inputMode="tel">
                    <Form.Item label={"Celular"} name={['person', 'cellphone']}><Input /></Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label={"Data"} name={"date"}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={"Data final"} name={"date_end"}>
                        <Input />
                    </Form.Item>
                </Col>
            </Form>
        </Modal>
    </>

}