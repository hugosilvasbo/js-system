import { Button, Calendar, Card, Checkbox, Col, DatePicker, Divider, Drawer, Form, Input, Row, Space, Statistic, Table, Tag, Tooltip } from "antd";
import local from 'antd/es/date-picker/locale/pt_BR';
import { ColumnsType } from "antd/lib/table";
import _ from "lodash";
import moment, { Moment } from "moment";
import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import AgendamentoModal from '../../classes/Agendamento';
import SearchInput, { EnTipo } from "../../components/antdesign/SearchInput";
import AgendamentoAdapter from './../../adapters/AgendaAdapter';
import './Agenda.scss';

interface IDrawerMaintence {
    open: boolean,
    onCancel: any,
    schedule: any
}

interface IPropsContentCalendar {
    onPanelChange: any,
    scheduleInMonth: {},
    onSelectedDate: any
}

interface IPropsContentTable {
    scheduleDay: {}
}

interface TypeTableMode {
    key: string;
    schedule_time: string,
    client: string,
    scheduleSituation: {
        description: string,
        color: string
    }
}

const toolstipsMessages = {
    newButton: "Incluir um novo"
}

const CRON_TIME_SEC = '0,3 * * * * *';

export default class Agenda extends React.Component {
    state = {
        scheduleMonth: {},
        scheduleDay: {} as any,
        scheduleSelected: {},
        calendarDateSelected: moment(new Date()),
        openMaintence: false
    }

    async fetchMonthData(value: Moment) {
        let res = new AgendamentoAdapter({}, "");
        let schedules = await res.getSchedulesInMonth(value);
        this.setState({ ...this.state, scheduleMonth: schedules });
    }

    getScheduleInDay = (date: Moment) => {
        let _keyFormat = date.format("YYYY-MM-DD");
        return _.pick(this.state.scheduleMonth, _keyFormat);;
    }

    WrapperContent = () => {
        const _onPanelChange = async (data: Moment) => {
            this.setState({ ...this.state, calendarDateSelected: data });
            await this.fetchMonthData(data);
        }

        const _onSelectedDate = (date: Moment) => {
            let _schedulesInDay = this.getScheduleInDay(date);

            this.setState({
                ...this.state,
                scheduleDay: _schedulesInDay,
                calendarDateSelected: date
            });
        }

        const _cardStyle = {
            bordered: true,
            style: { width: "100%" },
            headStyle: { borderTop: "2px solid #f3f3f3" },
        }

        const WrapperFilter = () => {
            return <>
                <Checkbox>Pendentes</Checkbox>
            </>
        }

        return <>
            <Row gutter={20} wrap>
                <Col md={6}>
                    <Space direction="vertical" size={"large"}>
                        <Card size="small" {..._cardStyle}>
                            <ModoCalendario
                                onPanelChange={_onPanelChange}
                                scheduleInMonth={this.state.scheduleMonth}
                                onSelectedDate={_onSelectedDate}
                            />
                        </Card>
                        <Card size={"small"} {..._cardStyle} title={"Filtros"}>
                            <WrapperFilter />
                        </Card>
                    </Space>
                </Col>
                <Col md={18}>
                    <ModoTabela scheduleDay={this.state.scheduleDay} />
                </Col>
            </Row>
            <MaintainceDetail
                open={this.state.openMaintence}
                onCancel={() => this.setState({ ...this.state, openMaintence: false })}
                schedule={this.state.scheduleSelected}
            />
        </>
    }

    WrapperMainButtons = () => {
        const handleNew = () => {
            this.setState({
                ...this.state,
                scheduleSelected: {},
                openMaintence: true
            });
        }

        return <>
            <Tooltip title={toolstipsMessages.newButton}>
                <Button type="primary" onClick={handleNew} >
                    Novo
                </Button>
            </Tooltip>
        </>
    }

    /*WrapperCalendarMode = () => {
        const handleCalendarMode = (value: SegmentedValue) => {
            this.setState({ ...this.state, calendarMode: value });
        }

        return <>
            <Segmented
                onChange={handleCalendarMode}
                options={[
                    {
                        label: 'Calendário',
                        value: 'calendar-mode',
                        icon: <AppstoreOutlined />
                    },
                    {
                        label: 'Tabela',
                        value: 'table-mode',
                        icon: <BarsOutlined />
                    }
                ]}
            />
        </>
    }*/

    render() {
        return <>
            <Row justify="space-between">
                <Col>
                    <this.WrapperMainButtons />
                </Col>
            </Row>
            <Divider />
            <Row>
                <this.WrapperContent />
            </Row>
            <ToastContainer />
        </>
    }
}

class ModoCalendario extends React.Component<IPropsContentCalendar, {}> {
    /*onDateCellRender = (value: Moment) => {
        const ScheduleItem = (props: any) => {
            const _style = {
                borderTop: `2px solid ${props.color}`, background: "#fff"
            }

            return (
                <Tooltip title={toolstipsMessages.clickCalendar}>
                    <li key={`cal-item-${props._id}`}
                        className='list-items'
                        style={_style}>
                        {props.children}
                    </li>
                </Tooltip >
            )
        }

        let _schedulesInDay = _.pick(this.props.scheduleInMonth, value.format("YYYY-MM-DD"));

        return (
            _.map(
                _schedulesInDay, (schedule: any) => {
                    return <>{
                        <Row>
                            <Col span={24}>
                                {
                                    _.map(schedule, (value: any) =>
                                        <ScheduleItem _id={value._id} color={value.scheduleSituation?.color} >
                                            {`${moment(value.date).format("HH:mm")} - ${value.person?.name}`}
                                        </ScheduleItem>)
                                }
                            </Col>
                        </Row>
                    }</>
                })
        );
    }*/

    render() {
        return <>
            <Calendar
                fullscreen={false}
                locale={local}
                onPanelChange={date => this.props.onPanelChange(date)}
                //dateCellRender={this.onDateCellRender}
                onSelect={this.props.onSelectedDate}
            />
        </>
    }
}

class ModoTabela extends React.Component<IPropsContentTable, {}> {

    state = {
        filter: {
            pendingSituation: true
        },
        scheduleDay: {}
    }

    componentDidMount(): void {
        console.log("Riiii")
    }

    _columns: ColumnsType<TypeTableMode> = [
        {
            title: 'Horário',
            dataIndex: 'schedule_time',
            key: 'schedule_time',
            width: "5%"
        },
        {
            title: 'Situação',
            dataIndex: ['scheduleSituation', 'description'],
            key: 'scheduleSituation',
            width: "15%",
            render(text, record) {
                return <Tag color={record.scheduleSituation?.color}>{text}</Tag>
            }
        },
        {
            title: 'Cliente',
            dataIndex: 'client',
            key: 'client',
            width: "80%"
        }
    ];

    dataSource() {
        return AgendamentoModal.getSetupDaySchedules(this.props.scheduleDay);
    }

    render() {
        return <>
            <Row gutter={[20, 20]}>
                <Col md={24}>
                    <Card title={"Detalhes"} size={"small"}>
                        <Table
                            columns={this._columns}
                            dataSource={this.dataSource()}
                            pagination={false}
                            size={"small"}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    }
}

class MaintainceDetail extends React.Component<IDrawerMaintence, {}> {

    state = {
        submit: false
    }

    dataSource = () => {
        return [
            {
                description: "Batata",
                dataIndex: "description",
                value: 50
            },
            {
                description: "Batata",
                dataIndex: "description",
                value: 50
            },
            {
                description: "Batata",
                dataIndex: "description",
                value: 50
            },
            {
                description: "Batata",
                dataIndex: "description",
                value: 50
            },
            {
                description: "Batata",
                dataIndex: "description",
                value: 50
            },
            {
                description: "Batata",
                dataIndex: "description",
                value: 50
            },
            {
                description: "Batata",
                dataIndex: "description",
                value: 50
            },
            {
                description: "Batata",
                dataIndex: "description",
                value: 50
            },
            {
                description: "Batata",
                dataIndex: "description",
                value: 50
            },
        ]
    }

    FormEdition = ({ submit }: any) => {
        const _properties = {
            formDate: {
                getValueFromEvent: (onChange: any) => moment(onChange ? onChange : undefined).toISOString(),
                getValueProps: (i: any) => ({ value: moment(i) })
            },
            datePicker: {
                format: "DD/MM/YYYY HH:mm",
                locale: local
            },
            colsTable: [
                {
                    title: 'Descrição',
                    dataIndex: 'description',
                    key: 'item-description',
                },
                {
                    title: 'Tempo',
                    dataIndex: 'time',
                    key: 'item-time',
                },
                {
                    title: 'Valor',
                    dataIndex: 'value',
                    key: 'item-value',
                },
            ]
        }

        const [fcontrol] = Form.useForm();

        useEffect(() => {
            if (submit === false) return;

            const submitData = async () => {
                fcontrol.validateFields()
                    .then(async (value: any) => {
                        let agenda = new AgendamentoAdapter(value, value._id);
                        await agenda.send()
                            .then((res: any) => toast.success(res.data.message))
                            .catch((reason: any) => toast.error(reason.message));
                    });
            }

            submitData().catch();
        }, [submit]);

        useEffect(() => {
            this.props.schedule._id ?
                fcontrol.setFieldsValue(this.props.schedule) :
                fcontrol.resetFields();
        }, [this.props.open]);

        const { Item } = Form;

        return <>
            <this.Totalization />
            <Divider />
            <Form form={fcontrol} layout={"vertical"}>
                <Row gutter={16}>
                    <Item name={'_id'} hidden={true}>
                        <Input />
                    </Item>
                    <Col span={12} >
                        <Item name={['employee', '_id']} hidden={true}>
                            <Input />
                        </Item>
                        <Item label={"Profissional"} name={['employee', 'name']}>
                            <SearchInput
                                formController={fcontrol}
                                type={EnTipo.tFuncionario}
                                formKeyName={['employee', '_id']}
                            />
                        </Item>
                    </Col>
                    <Col span={12} >
                        <Item name={['person', '_id']} hidden={true}>
                            <Input />
                        </Item>
                        <Item label={"Cliente"} name={['person', 'name']}>
                            <SearchInput
                                formController={fcontrol}
                                type={EnTipo.tCliente}
                                formKeyName={['person', '_id']}
                            />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item label='Início' name='date'  {..._properties.formDate} >
                            <DatePicker {..._properties.datePicker} showTime />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item label='Fim' name='date_end'  {..._properties.formDate} >
                            <DatePicker {..._properties.datePicker} showTime />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item name={['scheduleSituation', '_id']} hidden={true}>
                            <Input />
                        </Item>
                        <Item label={"Situação"} name={['scheduleSituation', 'description']}>
                            <SearchInput
                                formController={fcontrol}
                                type={EnTipo.tSituacaoAgendamento}
                                formKeyName={['scheduleSituation', '_id']}
                            />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item label={"Celular"} name={['person', 'cellphone']}>
                            <Input />
                        </Item>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={_properties.colsTable}
                            size={"small"}
                            dataSource={this.dataSource()}
                        />
                    </Col>
                </Row>
            </Form>
        </>
    }

    Totalization = () => {
        return <>
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic title="Tempo total" value={0} />
                </Col>
                <Col span={12}>
                    <Statistic title="Valor total" value={0} precision={2} />
                </Col>
            </Row>
        </>
    }

    _onClose = () => {
        this.setState({ ...this.state, submit: false });
        this.props.onCancel();
    }

    render() {
        return <>
            <Drawer
                title={"Detalhes"}
                open={this.props.open}
                onClose={this._onClose}
                width={720}
                placement={"left"}
                extra={
                    <Space>
                        <Button onClick={this.props.onCancel}>Fechar</Button>
                        <Button onClick={() => this.setState({ ...this.state, submit: true })} type="primary">
                            Gravar
                        </Button>
                    </Space>
                }
            >
                <this.FormEdition submit={this.state.submit} />
            </Drawer>
        </>
    }
}