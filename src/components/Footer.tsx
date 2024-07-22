import logo from '../images/white.png'
import '../sass/footer.sass'
//@ts-ignore
import { HashLink } from 'react-router-hash-link';

export const Footer = () => {
  return (
    <div className='footer_ctn' >
        <div className="footer_content">
            <img src={logo} alt="logo" />
            <div className="footer_item">
                <h6>NO REP</h6>
                <HashLink to="/#NOREP" ><p>Contacto</p></HashLink>
                <HashLink to="/#NOREP" ><p>Sobre nosotros</p></HashLink>
                <a href="https://www.instagram.com/team.norep" target="blank" ><p>Instagram</p></a>
            </div>
            <div className="footer_item">
                <h6>EVENTOS</h6>
                <HashLink to="/eventos/#eventos" ><p>Eventos recientes</p></HashLink>
                <HashLink to="/#Calendar" ><p>Calendario</p></HashLink>
            </div>
            {/* <div className="footer_item">
                <h6>TABLAS</h6>
                <p>Como funciona</p>
                <p>Última actualizacion</p>
            </div> */}
        </div>
        <div className="footer_description">
            <p>El trabajo de un juez en una competencia, es simplemente crear una capa de neutralidad para cada uno de los atletas,resguardar el orden, garantizar un ambiente de respeto entre todos, llevar el conteo de repeticiones, y verificar que el atleta cumpla con el estándar del movimiento.</p>
        </div>
        <p className="copyright" >No Rep Jueces Deportivos - Todos los derechos reservados</p>
    </div>
  )
}
