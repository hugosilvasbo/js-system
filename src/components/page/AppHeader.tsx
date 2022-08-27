import _ from "lodash";
import "../../style/App.scss";

interface IProps {
    menuSelected: any;
}

const MenuItems = [
    { caption: "Cadastro", name: "menuCadastro" },
    { caption: "Pedido de Venda", name: "menuPedidoVenda" },
    { caption: "Pedido de Compra", name: "menuPedidoCompra" },
    { caption: "Configuração", name: "menuConfiguracao" }
];

const AppHeader = (props: IProps) => {
    return (
        <>
            <div id="header-main">
                {
                    _.map(MenuItems, function (value: any) {
                        return <button key={value.name} name={value.name} onClick={() => props.menuSelected(value.name)}>{value.caption}</button>;
                    })
                }
            </div>
        </>
    )
}

export default AppHeader;