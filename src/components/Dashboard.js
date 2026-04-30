import { useNavigate } from "react-router-dom";


export default function Dashboard() {
    const navigate = useNavigate();

    function criarPosto() {
        navigate("/postos")
    }

    return (

        <div>
            <button onClick={criarPosto}> Criar Posto</button>
        </div>
    )
};