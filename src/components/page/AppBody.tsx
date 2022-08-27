import { useEffect } from "react"
import "../../style/App.scss"

interface IProps {
    setMenuSelected: string
}

const AppBody = (props: IProps) => {
    return (
        <>
            {console.log(props.setMenuSelected)}
        </>
    )
}

export default AppBody;