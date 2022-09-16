import _ from 'lodash';
import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';

interface IDefault {
    title: {};
    column: {};
    data: {},
    onItemClick: any
}

function TableBootstrap(props: IDefault) {
    function renderTitle() {
        return _.map(props.title, (value: string, key: string) => {
            return <th key={key}>{value}</th>
        })

    }

    function renderResultRows() {
        return _.map(props.data, (line: any, key: string) => {
            return <tr onClick={() => props.onItemClick(line)} key={key}>
                {
                    _.map(props.column, (d: string) => {
                        return <td key={d}>
                            {line[d]}
                        </td>
                    })
                }
            </tr>
        })
    }

    return (
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    {renderTitle()}
                </tr>
            </thead>
            <tbody>
                {renderResultRows()}
            </tbody>
        </Table>
    );
}

export default TableBootstrap;