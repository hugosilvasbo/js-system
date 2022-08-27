import { useEffect } from "react"
import "../../style/App.scss"

interface IProps {
    menuSelected: string
}

const AppBody = (props: IProps) => {
    return (
        <>
            {console.log(props.menuSelected)}
        </>
    )
}

export default AppBody;