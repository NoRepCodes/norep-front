import Dropdown from "../../../components/Dropdown";

const Faq = () => {
  return (
    <div className="w-full min-h-[80vh] flex justify-center py-20 ">
      <div className="flex flex-col w-180 ">
        <h6 className="text-4xl mb-8 ">PREGUNTAS FRECUENTES</h6>
        {faqs.map((faq,index)=>(
        <Dropdown title={faq.title} isOpen={false} selfBehaviour key={index} >
          <p className="font-Roboto text-base" >{faq.text}</p>
        </Dropdown>
        ))}
      </div>
    </div>
  );
};

export default Faq;

const faqs = [
    {
        title:'¿Cómo puedo comunicarme con NoRep?',
        text:'Contáctanos por nuestro instagram @team.norep o https://www.instagram.com/team.norep/'
    },
    {
        title:'¿Por qué no puedo registrarme en X evento?',
        text:'Mayormente los eventos tienen cupos limitados y restricción de edad o género, verifica que tú o tu equipo cumplen con los parámetros requeridos. Si el error persiste, contáctanos para verificar tus datos o los de el evento.'
    },
    {
        title:'¿Cuánto tiempo tardará mi solicitud en ser aceptada al evento?',
        text:'Esto dependerá de los organizadores del evento, ya que son ellos quienes deberán confirmar el pago y los datos de los atletas antes de aceptar la solicitud.'
    },
    {
        title:'No estoy satisfecho con los resultados del evento',
        text:'Recomendamos mantener una honesta y respetuosa comunicación con el equipo de jueces y los organizadores del eventos al momento de realizar una queja, tanto la mesa técnica como los organizadores pueden cometer errores al momento de actualizar los resultados.'
    },
    {
        title:'¿Qué significa el porcentaje en la tabla?',
        text:'Al momento de actualizar los resultados, dos o mas atletas podrían empatar en puntaje, sin embargo, mediante medidas internas en la aplicación, se ha realizado un desempatador basado en el desempeño de todo el evento, afectando así el porcentaje final del atleta o equipo.'
    },
    {
        title:'¿Dónde puedo eliminar mi cuenta?',
        text:'Para eliminar tus cuenta y datos de usuario contáctanos enviando tu cédula de identidad, correo electrónico y nombre completo para confirmar tu identidad y proceder con la eliminación de tu cuenta.'
    },
]