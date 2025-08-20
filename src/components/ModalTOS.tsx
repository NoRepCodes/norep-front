import { AnimatePresence, motion } from "framer-motion";
import { Ionicons } from "./Icons";

const ModalTOS = ({ openTOS, setOpenTOS }: any) => {
  return (
    <AnimatePresence>
      {!openTOS ? null : (
        <motion.div
          className="blackscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="blackscreenOver">
            <TOS {...{setOpenTOS}} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalTOS;

const Bold = ({ children, fs = 14 }: any) => (
  <p style={{ fontWeight: "bold", fontSize: fs }}>{children}</p>
);

const DotText = ({ children, fs }: any) => {
  return (
    <div style={{ flexDirection: "row", gap: 6 }}>
      <div
        style={{
          borderRadius: 50,
          width: 6,
          height: 6,
          backgroundColor: "black",
          position: "relative",
          top: 12,
        }}
      />
      <p style={{ fontSize: fs, marginLeft: 12 }}>{children}</p>
    </div>
  );
};

export const TOS = ({ setOpenTOS }: any) => {
  return (
    <div className="w-[320px] md:w-[640px] h-[85vh] bg-red-50 p-6 relative rounded-xl flex flex-col gap-3 overflow-y-auto">
      <div className="w-full flex flex-col gap-3">
        {setOpenTOS ? (
          <div
            className="absolute top-2 right-2 p-4 cursor-pointer"
            onClick={() => {
              setOpenTOS(false);
            }}
          >
            <Ionicons name="close" />
          </div>
        ) : null}
        <h6 className="text-dark! text-2xl">TERMINOS DE SERVICIO - NOREP</h6>

        <Bold>Última actualización: 19 de Agosto de 2025</Bold>
        {/* ACEPTACION*/}
        <Bold fs={16}>Aceptación de los Términos</Bold>
        <p style={{ marginTop: -6 }}>
          Al descargar, instalar o utilizar la aplicación NoRep, aceptas y te
          comprometes a cumplir con estos Términos de Servicio. Si no estás de
          acuerdo con estos Términos, no debes utilizar la aplicación.
        </p>
        {/* lICENCIA*/}
        <Bold fs={16}>Licencia y Uso de la Aplicación</Bold>
        <p style={{ marginTop: -6 }}>
          NoRep te concede una licencia limitada, no exclusiva y no transferible
          para usar la Aplicación con fines personales. No puedes:
        </p>
        <DotText>
          Copiar, modificar o distribuir la Aplicación sin nuestro permiso.
        </DotText>
        <DotText>Intentar extraer el código fuente de la Aplicación.</DotText>
        <DotText>
          Usar la Aplicación para cualquier fin ilegal o no autorizado.
        </DotText>
        <DotText>
          Compartir o usar información de otros usuarios de forma inapropiada o
          fuera de la plataforma de la Aplicación.
        </DotText>
        {/* CUENTAS DE USUARIO */}
        <Bold fs={16}>Cuentas de Usuario</Bold>
        <p style={{ marginTop: -6 }}>
          Si la Aplicación requiere que crees una cuenta, eres responsable de la
          confidencialidad de tu contraseña. Debes notificarnos de inmediato si
          sospechas de algún uso no autorizado de tu cuenta.
        </p>
        {/* CONTENIDO Y CONDUCTA */}
        <Bold fs={16}>Contenido y Conducta del Usuario</Bold>
        <p style={{ marginTop: -6 }}>
          Eres el único responsable del contenido (mensajes, fotos, etc.) que
          publiques a través de NoRep. No debes publicar contenido que sea:
        </p>
        <DotText>Ilegal, difamatorio, obsceno o amenazante.</DotText>
        <DotText>
          Que viole los derechos de propiedad intelectual de otros.
        </DotText>
        <DotText>Que acose, intimide o difame a otros usuarios.</DotText>
        <p>
          Nos reservamos el derecho de eliminar cualquier contenido que
          consideremos inapropiado y de suspender tu cuenta si violas estas
          reglas.
        </p>
        {/* RESPONSABILIDAD */}
        <Bold fs={16}>Descargo de Responsabilidad</Bold>
        <p style={{ marginTop: -6 }}>
          NoRep se proporciona sin garantías de ningún tipo. No garantizamos que
          la Aplicación funcione sin interrupciones o errores. El uso de la
          Aplicación es bajo tu propio riesgo.
        </p>
        {/* LIMITACION DE RESPONSABILIDAD */}
        <Bold fs={16}>Limitación de Responsabilidad</Bold>
        <p style={{ marginTop: -6 }}>
          En la medida máxima permitida por la ley, NoRep no será responsable de
          ningún daño, directo o indirecto, que surja de tu uso de la
          Aplicación.
        </p>
        {/* MODIFICACIONES DE LOS TERMINOS */}
        <Bold fs={16}>Modificaciones de los Términos</Bold>
        <p style={{ marginTop: -6 }}>
          Nos reservamos el derecho de modificar estos Términos en cualquier
          momento. Te notificaremos de los cambios significativos, y tu uso
          continuado de la Aplicación después de la modificación constituye tu
          aceptación de los nuevos Términos.
        </p>
        {/* CONTACTO */}
        <Bold fs={16}>Contacto</Bold>
        <p style={{ marginTop: -6 }}>
          Si tienes alguna pregunta sobre estos Términos, puedes contactarnos a
          norep.code@yahoo.com .
        </p>
        {/* START OF POLITICAS DE PRIVACIDAD */}
        <Bold fs={24}>Política de Privacidad de NoRep</Bold>
        <Bold>Última actualización: 19 de agosto de 2025</Bold>
        <p style={{ marginTop: -6 }}>
          Esta Política de Privacidad describe cómo NoRep recopila, utiliza y
          comparte la información en relación con tu uso de la aplicación.
        </p>
        {/* INFO QUE RECOPILAMOS */}
        <Bold fs={16}>Información que Recopilamos</Bold>
        <p style={{ marginTop: -6 }}>
          Para proporcionarte los servicios de la Aplicación, podemos recopilar
          los siguientes tipos de información:
        </p>
        <DotText>
          Información de la cuenta: Cuando creas una cuenta, recopilamos tu
          dirección de correo electrónico y una contraseña cifrada.
        </DotText>
        <DotText>
          Datos de uso de la Aplicación: Recopilamos información sobre cómo
          interactúas con la Aplicación, como las funciones que utilizas y la
          frecuencia de tu actividad.
        </DotText>
        <DotText>
          Información del dispositivo: Recopilamos datos básicos sobre tu
          dispositivo móvil, como el modelo, el sistema operativo, la versión de
          la Aplicación y un identificador de dispositivo único.
        </DotText>
        <DotText>
          Contenido generado por el usuario: Recopilamos el contenido que envías
          a través de la Aplicación (por ejemplo, reportes, mensajes o fotos).
          Ten en cuenta que, aunque la Aplicación pueda tener funciones de
          reporte anónimo, la información que proporcionas puede, en algunos
          casos, ser utilizada para identificar a una persona.
        </DotText>
        {/* COMO USAMOS LA INFO */}
        <Bold fs={16}>Cómo Usamos tu Información</Bold>
        <p style={{ marginTop: -6 }}>
          Utilizamos la información recopilada para:
        </p>
        <DotText>
          Proporcionar, mantener y mejorar la Aplicación y sus servicios.
        </DotText>
        <DotText>Personalizar tu experiencia en la Aplicación.</DotText>
        <DotText>
          Analizar el uso de la Aplicación para entender las tendencias y
          optimizar su funcionamiento.
        </DotText>
        <DotText>Cumplir con obligaciones legales y regulatorias.</DotText>
        {/* COMO COMPARTIMOS LA INFO */}
        <Bold fs={16}>Cómo Compartimos tu Información</Bold>
        <p style={{ marginTop: -6 }}>
          No vendemos ni alquilamos tu información personal a terceros. Sin
          embargo, podemos compartirla en las siguientes situaciones:
        </p>
        <DotText>
          Con terceros de confianza: Podemos compartir información con
          proveedores de servicios que nos ayudan a operar la Aplicación (por
          ejemplo, servicios de análisis o de alojamiento en la nube). Estos
          terceros están obligados contractualmente a proteger tu información.
        </DotText>
        <DotText>
          Para fines legales: Podemos divulgar tu información si creemos de
          buena fe que es necesario para: Cumplir con una citación, orden
          judicial u otra orden legal, proteger nuestros derechos, propiedad o
          seguridad, así como los de nuestros usuarios y del público.
        </DotText>
        <DotText>
          En caso de fusión o adquisición: Si participamos en una fusión,
          adquisición o venta de activos, tu información puede ser transferida
          como parte de esa transacción.
        </DotText>
        {/* DERECHOS */}
        <Bold fs={16}>Tus Derechos</Bold>
        <p style={{ marginTop: -6 }}>
          Tienes el derecho de solicitar el acceso, la corrección o la
          eliminación de tu información personal. Para ejercer estos derechos,
          contáctanos en la dirección de correo electrónico que se indica a
          continuación.
        </p>
        {/* SEGURIDAD DE LOS DATOS */}
        <Bold fs={16}>Seguridad de los Datos</Bold>
        <p style={{ marginTop: -6 }}>
          Nos esforzamos por proteger tu información personal utilizando medidas
          de seguridad técnicas y organizativas adecuadas. Sin embargo, ninguna
          transmisión de datos a través de Internet es 100% segura.
        </p>
        {/* POLITICA SOBRE MENORES */}
        <Bold fs={16}>Política sobre Menores</Bold>
        <p style={{ marginTop: -6 }}>
          Nuestra Aplicación no está dirigida a menores de 12 años. Si eres
          padre o tutor y crees que tu hijo nos ha proporcionado información
          personal, contáctanos. Si descubrimos que un menor nos ha
          proporcionado información personal sin el consentimiento de sus
          padres, la eliminaremos.
        </p>
        {/* POLITICA SOBRE MENORES */}
        <Bold fs={16}>Cambios en esta Política de Privacidad</Bold>
        <p style={{ marginTop: -6 }}>
          Podemos actualizar esta Política de Privacidad de vez en cuando. Te
          notificaremos de cualquier cambio significativo publicando la nueva
          Política en la Aplicación y actualizando la fecha de "Última
          actualización" en la parte superior.
        </p>
        {/* CONTACTO */}
        <Bold fs={16}>Contáctanos</Bold>
        <p style={{ marginTop: -6 }}>
          Si tienes alguna pregunta sobre estos Términos, puedes contactarnos a
          norep.code@yahoo.com .
        </p>
      </div>
    </div>
  );
};
