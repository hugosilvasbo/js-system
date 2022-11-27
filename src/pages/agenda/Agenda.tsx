import { CloseOutlined } from "@ant-design/icons";
import { Calendar, Card, CardProps, Col, DatePicker, Drawer, Form, Input, Row, Table, Tag, Tooltip } from "antd";
import local from 'antd/es/date-picker/locale/pt_BR';
import { ColumnsType } from "antd/lib/table";
import axios from "axios";
import _ from "lodash";
import moment, { Moment } from "moment";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import AgendamentoModal from '../../classes/Agendamento';
import SearchInput, { EnTipo } from "../../components/antdesign/SearchInput";
import WrapperButtons, { enBotoes } from "../../components/mine/WrapperButtons";
import './Agenda.scss';

interface IPropsContent {
    calendarMode: boolean
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
    situation: {
        description: string,
        color: string
    }
}

const CRON_TIME_SEC = '0,3 * * * * *';

export default class Agenda extends React.Component {
    state = {
        hideSidebar: true,
        calendarMode: true,
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
                        style={{ borderLeft: `4px solid ${_schedule.situation?.color ?? "#bbbbbb"}` }}
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
                hideSidebar: false,
                calendarDateSelected: date
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
                    this.setState({ ...this.state, calendarMode: !this.state.calendarMode })
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
                    <div className='wrapper-cedule'> {
                        _.map(schedule, (value: any) =>
                            <ScheduleItem _id={value._id} color={value.situation?.color}>
                                {`${moment(value.date).format("HH:mm")} - ${value.person?.name}`}
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
            width: "5%"
        },
        {
            title: 'Situação',
            dataIndex: ['situation', 'description'],
            key: 'situation',
            width: "5%",
            render(text, record) {
                return <Tag color={record.situation?.color}>{text}</Tag>
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
        if (this.props.calendarMode === true)
            return;

        return AgendamentoModal.getSetupDaySchedules(this.props.scheduleDay);
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

class MaintainceDetail extends React.Component<IDrawerMaintence, {}> {

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

    FormEdition = () => {
        const [fcontrol] = Form.useForm();

        const _properties = {
            formDate: {
                getValueFromEvent: (onChange: any) => moment(onChange ? onChange : undefined),
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

        useEffect(() => {
            this.props.schedule._id ?
                fcontrol.setFieldsValue(this.props.schedule) :
                fcontrol.resetFields();
        }, [this.props.open]);

        const { Item } = Form;

        return <>
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
                        <Item label='Final' name='date_end'  {..._properties.formDate} >
                            <DatePicker {..._properties.datePicker} showTime />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item name={['employee', '_id']} hidden={true}>
                            <Input />
                        </Item>
                        <Item label={"Situação"} name={['situation', 'description']}>
                            <SearchInput
                                formController={fcontrol}
                                type={EnTipo.tSituacaoAgendamento}
                                formKeyName={['employee', '_id']}
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
                    <Col span={8}>
                        <h4>Tempo total: </h4>
                    </Col>
                    <Col span={8} offset={8}>
                        <h4>Valor total: </h4>
                    </Col>
                </Row>
            </Form>
        </>
    }

    render() {
        return <>
            <Drawer
                title={"Detalhes"}
                open={this.props.open}
                onClose={this.props.onCancel}
                width={720}>
                <this.FormEdition />
            </Drawer>
        </>
    }
}