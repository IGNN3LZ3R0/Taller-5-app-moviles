import axios, { AxiosError } from "axios";

/**
 * Configuración base de Axios
 * - Define la URL base de la API
 * - Configura timeout para evitar peticiones colgadas
 * - Establece headers por defecto
 */
export const apiClient = axios.create({
  baseURL: "https://dragonball-api.com/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor para logging de peticiones
 * Útil para debugging en desarrollo
 */
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Petición: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Error en interceptor de petición:", error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejo de respuestas y errores
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta exitosa de: ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // Mejor manejo de errores
    let errorMessage = "Error de conexión";
    
    if (error.response) {
      // El servidor respondió con un código de error
      errorMessage = `Error del servidor: ${error.response.status}`;
      console.error(`❌ Error ${error.response.status} en: ${error.config?.url}`);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      errorMessage = "No se pudo conectar al servidor. Verifica tu conexión a internet.";
      console.error(`❌ Sin respuesta de: ${error.config?.url}`);
      console.error("Detalles del error:", {
        message: error.message,
        code: error.code,
      });
    } else {
      // Error al configurar la petición
      errorMessage = error.message;
      console.error(`❌ Error de configuración: ${error.message}`);
    }

    // Agregar el mensaje al error para que sea más fácil de usar
    const enhancedError = error as AxiosError & { friendlyMessage?: string };
    enhancedError.friendlyMessage = errorMessage;
    
    return Promise.reject(enhancedError);
  }
);