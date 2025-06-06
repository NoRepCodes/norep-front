
// export const url = "http://192.168.1.109:4000/"
// export const url = "https://testback.norep.com.ve/"
// export const url = "https://norep-back.vercel.app/"

// @ts-ignore
export const url = import.meta.env.VITE_APP_API_URL;


/// Funcion general para el catch error que se usa en TODAS las peticiones 
export const catchError = async (err:any) => {
    /// Error
    if (err.response) {
        // console.log(err.response)
        // return { data: { msg: "No se ha contactado con el servidor" } }
        return { data: err.response.data, status: err.response.status }
        /// Error de mala conexion
    } else if (err.request) {
        // console.log(err.request)
        return { data: { msg: "No se ha contactado con el servidor, revise su conexion a internet y vuelva a intentarlo" } }
        /// Error inesperado
    } else {
        // console.log("Error", err.message)
        return { data: { msg: "Ha ocurrido un error inesperado, intente nuevamente" } }
    }
}



/**
 
 */