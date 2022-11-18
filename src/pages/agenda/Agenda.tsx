import { CloseOutlined } from "@ant-design/icons";
import { Calendar, Card, CardProps, Col, Row, Table, Tooltip } from "antd";
import local from 'antd/es/date-picker/locale/pt_BR';
import { ColumnsType } from "antd/lib/table";
import axios from "axios";
import _ from "lodash";
import moment, { Moment } from "moment";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import WrapperButtons, { enBotoes } from "../../components/mine/WrapperButtons";
import './Agenda.scss';

interface IPropsContent {
    calendarMode: boolean
}

interface IPropsContentCalendar extends IPropsContent {
    onPanelChange: any,
    scheduleInMonth: {},
    onSelectedDate: any
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
        scheduleDay: {},
        onSelectedDate: moment(new Date()),
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
        let _schedulesInDay = _.pick(this.state.scheduleMonth, _keyFormat);
        return _schedulesInDay;
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
                    size="small"
                    type="inner"
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
            const _style = {
                borderLeft: `4px solid ${props.schedule.situation?.color ?? "#bbbbbb"}`,
            };

            const _content = <>
                <Col>
                    {moment(props.schedule.date).format("HH:ss")}
                </Col>
                <Col>
                    {props.schedule.person?.name}
                </Col>
            </>

            return <Tooltip title="Clique para alterar">
                <Row justify="space-evenly" className="item-sidebar" style={_style}>{_content}</Row>
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
            <Col span={this.state.hideSidebar ? 24 : 20} style={{paddingLeft: '10px', paddingRight: '10px'}}>
                <ModoCalendario
                    calendarMode={this.state.calendarMode}
                    onPanelChange={_onPanelChange}
                    scheduleInMonth={this.state.scheduleMonth}
                    onSelectedDate={_onSelectedDate}
                />
                <ModoTabela calendarMode={this.state.calendarMode} />
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
    componentDidMount(): void {
        console.log("component did mount do Modocalendario")
    }

    onDateCellRender = (value: Moment) => {
        const ScheduleItem = (props: any) => {
            return (
                <Tooltip placement='leftBottom' title='Clique para mais detalhes'>
                    <li className='list-items' style={{ backgroundColor: props.background ?? '#fff' }}>
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
                            <ScheduleItem background={value.situation?.color}>
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

class ModoTabela extends React.Component<IPropsContent, {}> {
    _columns: ColumnsType<TypeTableMode> = [
        {
            title: 'Horário',
            dataIndex: 'schedule_time',
            key: 'schedule_time',
            width: "5%",
            //render(text, record) {
            ///  return <span style={{ color: record.situation?.color }}>{record.schedule_time}</span>;
            //}
        },
        {
            title: 'Cliente',
            dataIndex: 'client',
            key: 'client',
            width: "75%",
            //          render(text, record) {
            //            return <span style={{ color: record.situation?.color }}>{record.client}</span>;
            //      }
        },
        {
            title: 'Situação',
            dataIndex: ['situation', 'description'],
            key: 'situation',
            width: "20%",
            //   render(text, record) {
            //     return <span style={{ color: record.situation?.color }}>{record.situation?.description}</span>;
            //}
        }
    ];

    componentDidMount(): void {
        console.log("did mount do modo tabela")
    }

    render() {
        return <>
            <div hidden={this.props.calendarMode}>
                <Table
                    columns={this._columns}
                />
            </div>
        </>
    }
}