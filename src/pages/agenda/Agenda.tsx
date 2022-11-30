import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { Button, Calendar, CardProps, Col, DatePicker, Divider, Drawer, Form, Input, Row, Segmented, Space, Statistic, Table, Tag, Tooltip } from "antd";
import local from 'antd/es/date-picker/locale/pt_BR';
import { SegmentedValue } from "antd/lib/segmented";
import { ColumnsType } from "antd/lib/table";
import axios from "axios";
import _ from "lodash";
import moment, { Moment } from "moment";
import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import AgendamentoAdapter from "../../adapters/AgendaAdapter";
import AgendamentoModal from '../../classes/Agendamento';
import SearchInput, { EnTipo } from "../../components/antdesign/SearchInput";
import WrapperButtons, { enBotoes } from "../../components/mine/WrapperButtons";
import './Agenda.scss';

type typeCalendar = "calendar-mode" | "table-mode";

interface IPropsContent {
    calendarMode: typeCalendar
}

interface IDrawerMaintence {
    open: boolean,
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
    scheduleSituation: {
        description: string,
        color: string
    }
}

const CRON_TIME_SEC = '0,3 * * * * *';

export default class Agenda extends React.Component {
    state = {
        openSidebar: false,
        calendarMode: "calendar-mode" as typeCalendar,
        scheduleMonth: {},
        scheduleDay: {} as any,
        scheduleSelected: {},
        calendarDateSelected: moment(new Date()),
        openMaintence: false
    }

    componentDidMount(): void {
        /*schedule.scheduleJob(CRON_TIME_SEC, async () => {
            await this.fetchMonthData(this.state.calendarDateSelected);
        })*/
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

        this.setState({
            ...this.state,
            scheduleMonth: groupByDate
        });
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

        return <>
            <Drawer
                open={this.state.openSidebar}
                onClose={() => this.setState({ ...this.state, openSidebar: false })}
                title="Detalhamento"
                style={_styleCard}>
                {props.children}
            </Drawer>
        </>
    }

    ItemsSidebar = () => {
        const Content = (props: any) => {
            const getDate = (value: any) => moment(value).format("HH:mm");

            const _schedule = props.schedule;

            const _content = <>
                <Row justify="space-around">
                    <Col>{`${getDate(_schedule.date)} à ${getDate(_schedule.date_end)}`}</Col>
                </Row>
                <Row justify="center">
                    <Col>{_schedule.person?.name}</Col>
                </Row>
            </>;

            return <>
                <Tooltip title="Clique para alterar">
                    <Row className="item-sidebar"
                        style={{ borderLeft: `4px solid ${_schedule.scheduleSituation?.color ?? "#bbbbbb"}` }}
                        onClick={() => {
                            this.setState({
                                ...this.state,
                                openMaintence: true,
                                scheduleSelected: _schedule
                            });
                        }}>
                        <Col span={24}>{_content}</Col>
                    </Row>
                </Tooltip>
            </>
        }

        return <>{
            _.map(this.state.scheduleDay, (schedules: any) =>
                _.map(schedules, (schedule: any) => <Content schedule={schedule} />))}</>
    }

    WrapperContent = () => {
        useEffect(() => {
            console.log("Wrapper content use effect.")
        }, []);

        const _onPanelChange = async (data: Moment) => {
            this.setState({ ...this.state, calendarDateSelected: data });
            await this.fetchMonthData(data);
        }

        const _onSelectedDate = (date: Moment) => {
            let _schedulesInDay = this.getScheduleInDay(date);

            this.setState({
                ...this.state,
                scheduleDay: _schedulesInDay,
                calendarDateSelected: date,
                openSidebar: true
            });
        }

        return <>
            <Col span={24} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
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
            <MaintainceDetail
                open={this.state.openMaintence}
                onCancel={() => this.setState({ ...this.state, openMaintence: false })}
                schedule={this.state.scheduleSelected}
            />
        </>
    }

    WrapperMainButtons = () => {
        useEffect(() => {
            console.log("Use effect wrapper main buttons")
        }, []);

        const _callback = (clique: enBotoes) => {
            switch (clique) {
                case enBotoes.eProcurar: {
                    //nao uso mais
                    //this.setState({ ...this.state, calendarMode: !this.state.calendarMode });
                    break;
                }
                case enBotoes.eNovo: {
                    this.setState({
                        ...this.state,
                        scheduleSelected: {},
                        openMaintence: true
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

    WrapperCalendarMode = () => {
        useEffect(() => {
            console.log("Use Effect Calendar Mode");
        }, []);

        const handleCalendarMode = (value: SegmentedValue) => {
            console.log(value);
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
    }

    render() {
        return <>
            <Row justify="space-between">
                <Col>
                    <this.WrapperMainButtons />
                </Col>
                <Col>
                    <this.WrapperCalendarMode />
                </Col>
            </Row>
            <Row>
                <this.WrapperSidebar>
                    <this.ItemsSidebar />
                </this.WrapperSidebar>
                <this.WrapperContent />
            </Row>
            <ToastContainer />
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
                        style={{ borderTop: `2px solid ${props.color}`, background: "#fff" }}>
                        {props.children}
                    </li>
                </Tooltip >
            )
        }

        let _schedulesInDay = _.pick(this.props.scheduleInMonth, value.format("YYYY-MM-DD"));

        return (
            _.map(_schedulesInDay, (schedule: any) => {
                return <>{
                    <Row>
                        <Col span={24}>
                            {
                                _.map(schedule, (value: any) =>
                                    <ScheduleItem
                                        _id={value._id}
                                        color={value.scheduleSituation?.color} >
                                        {`${moment(value.date).format("HH:mm")} - ${value.person?.name}`}
                                    </ScheduleItem>)
                            }
                        </Col>
                    </Row>
                }</>
            })
        );
    }

    _onSelectDate = (date: Moment) => {
        this.props.onSelectedDate(date);
    }

    render() {
        return <>
            <Calendar
                locale={local}
                onPanelChange={date => this.props.onPanelChange(date)}
                dateCellRender={this.onDateCellRender}
                onSelect={this._onSelectDate}
            />
        </>
    }
}

class ModoTabela extends React.Component<IPropsContentTable, {}> {
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
            width: "5%",
            render(text, record) {
                return <Tag color={record.scheduleSituation?.color}>{text}</Tag>
            }
        },
        {
            title: 'Cliente',
            dataIndex: 'client',
            key: 'client',
            width: "90%"
        }
    ];

    dataSource() {
        if (this.props.calendarMode === "calendar-mode")
            return;

        return AgendamentoModal.getSetupDaySchedules(this.props.scheduleDay);
    }

    componentDidMount(): void {
        console.log("did mount do modo tabela")
    }

    render() {
        return <>
            <>
                <Table columns={this._columns} dataSource={this.dataSource()} pagination={false} />
            </>
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
        useEffect(() => {
            console.log("Use Effect Totalization...");
        }, []);

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