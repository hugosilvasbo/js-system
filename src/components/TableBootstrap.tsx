import _ from 'lodash';
import Table from 'react-bootstrap/Table';

interface IDefault {
    title: {};
    column: {};
    data: {}
}

function TableBootstrap(props: IDefault) {
    return (
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    {
                        _.map(props.title, (value: string, key: string) => {
                            return <th key={key}>{value}</th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    _.map(props.data, (line: any, key: string) => {
                        return <tr key={key}>
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
            </tbody>
        </Table>
    );
}

export default TableBootstrap;