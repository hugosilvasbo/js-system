import { Input } from "antd";

// criar a classe...
// fazer as requisicoes lá dentro...
// fazer os esquemas aki...

interface IProps {
    placeHolder: string,
    tipo: "cliente",
    onCallBack: any
}

const InputSearch = (props: IProps) => {
    const { Search } = Input;

    const onSearch = (value: string) => {
        switch (props.tipo) {
            case "cliente":
                props.onCallBack("batata")
                break;
        }
    };

    return <>
        <Search placeholder={props.placeHolder} onSearch={onSearch} />
    </>
}

export default InputSearch;