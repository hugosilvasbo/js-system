import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
<<<<<<< HEAD
import '../../style/pessoa.scss'
=======
import TableBootstrap from './../../components/TableBootstrap';
>>>>>>> 0daaa1b4c4c3d6ad7357fae153548b8c781689d3

export default class Pessoa extends React.Component {
    render() {
        return (
            <>
                <Tabs>
                    <TabList>
                        <Tab>Consulta</Tab>
                        <Tab>Digitação</Tab>
                    </TabList>
                    <TabPanel >
                        <TabConsulta />
                    </TabPanel>
                    <TabPanel>
                        <TabCadastro />
                    </TabPanel>
                </Tabs>
            </>
        )
    }
}

const TabConsulta = () => {
    // apenas para teste!
    const title = ["#", "Nome", "Celular", "Telefone"];
    const data = [
        ["1", "Hugo", "(19) 9 8961-5184", "(19) 3454-0484"],
        ["2", "Gabi", "(19) 9 8961-5184", "(19) 3454-0484"],
        ["3", "Maria", "(19) 9 8961-5184", "(19) 3454-0484"],
        ["4", "André", "(19) 9 8961-5184", "(19) 3454-0484"],
        ["5", "José", "(19) 9 8961-5184", "(19) 3454-0484"],
        ["6", "Francisco", "(19) 9 8961-5184", "(19) 3454-0484"],
        ["7", "Antônio", "(19) 9 8961-5184", "(19) 3454-0484"],
        ["8", "Marcia", "(19) 9 8961-5184", "(19) 3454-0484"],
        ["9", "Daniel", "(19) 9 8961-5184", "(19) 3454-0484"]
    ]

    return (
        <>
<<<<<<< HEAD
            <div id="filtro">
                FIltragem
            </div>
            Consulta
=======
            <div>
                Inclusão dos filtros.
            </div>

            <TableBootstrap title={title} data={data} />
>>>>>>> 0daaa1b4c4c3d6ad7357fae153548b8c781689d3
        </>
    )
}

const TabCadastro = () => {
    return (
        <>
            Cadastro
        </>
    )
}