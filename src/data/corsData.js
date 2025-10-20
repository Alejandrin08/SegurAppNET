import CORS from "../assets/CORS.png";
import Whitelist from "../assets/Whitelist.png";

export const corsData = {
  securityMechanismTitle: "CORS (Cross-Origin Resource Sharing)",
  definition:
    "CORS es un mecanismo de seguridad del navegador que permite o restringe las solicitudes de recursos en un sitio web desde un dominio diferente al del recurso solicitado. Controla qué sitios externos tienen permiso para acceder a los recursos de tu aplicación, previniendo que scripts maliciosos en otros sitios interactúen con tu API sin autorización.",
  interestingFacts: [
    {
      description:
        "No todas las solicitudes cross-origin son iguales. Las 'solicitudes simples' (como GET o POST con ciertos tipos de contenido) no requieren una verificación previa (preflight), mientras que las 'solicitudes complejas' (como PUT, DELETE o con encabezados personalizados) sí la necesitan.",
      image: CORS,
    },
    {
      description:
        "Usar `Access-Control-Allow-Origin: *` es peligroso, especialmente si se combina con credenciales, ya que permite que cualquier sitio web del mundo realice solicitudes a tu API. La mejor práctica es siempre especificar una lista blanca (allow-list) de orígenes permitidos.",
      image: Whitelist,
    },
  ],

  goodPractices: [
    {
      title: "Uso de Políticas Nombradas con [EnableCors]",
      description:
        "Definir políticas de CORS con nombre en la configuración de la aplicación y aplicarlas selectivamente a los controladores o endpoints que necesitan ser accesibles desde otros orígenes.",
      threats: ["CSRF"],

      recommendation:
        "Esencial para: Web API que son consumidas por un frontend (como una SPA en React/Angular/Vue) alojado en un dominio o puerto diferente.",
      warning:
        '¡Peligro! Nunca uses `.AllowAnyOrigin()` en producción. Especifica siempre la lista exacta de dominios de tu frontend con `.WithOrigins("https://tu-frontend.com")`. Usar un comodín `*` es un riesgo de seguridad.',

      modalContent: {
        title: "Implementación de Políticas CORS Nombradas",
        practices: [
          {
            title: "1. Crear la Política CORS en Program.cs",
            description:
              "Usar `AddCors` y `AddPolicy` para definir una política con un nombre específico, estableciendo los orígenes, métodos y encabezados permitidos.",
            code: `builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicyName", policy =>
    {
        policy.WithOrigins("https://dominio-cliente-permitido.com") 
              .AllowAnyMethod() 
              .AllowAnyHeader(); 
    });
});`,
          },
          {
            title: "2. Registrar el Middleware CORS",
            description:
              "Añadir `app.UseCors()` al pipeline de la aplicación, antes de `UseAuthorization`, para habilitar la evaluación de las políticas CORS en las solicitudes entrantes.",
            code: `// ...
app.UseRouting();

// Habilita el middleware de CORS. Puede llevar un nombre de política por defecto.
app.UseCors("MyPolicyName");

app.UseAuthorization();
// ...`,
          },
          {
            title: "3. Aplicar la Política a Endpoints Específicos",
            description:
              'Usar el atributo `[EnableCors("NombreDeLaPolitica")]` directamente en los controladores o acciones que deban ser accesibles desde orígenes externos.',
            code: `[HttpGet("data")]
[EnableCors("MyPolicyName")] 
public IActionResult GetData()
{
    return Ok(new { message = "Este endpoint tiene CORS habilitado." });
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Configuración de política (20%)",
                  achieved:
                    "Se creó una política nombrada con `AddPolicy`, especificando orígenes con `WithOrigins` y métodos/encabezados.",
                  notAchieved:
                    "No se creó una política o se usa `AllowAnyOrigin` sin una restricción clara.",
                },
                {
                  description: "Registro de middleware (20%)",
                  achieved:
                    "Se agregó `app.UseCors()` en el orden correcto dentro del pipeline (antes de `UseAuthorization`).",
                  notAchieved:
                    "No se registró el middleware o está en un orden incorrecto.",
                },
                {
                  description: "Aplicación selectiva (10%)",
                  achieved:
                    'Se usa el atributo `[EnableCors("NombrePolicy")]` solo en los endpoints que lo requieren.',
                  notAchieved:
                    "Se aplica CORS globalmente a todos los endpoints sin necesidad, o no se usa el atributo.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Protección de acceso (50%)",
                  achieved:
                    "Al enviar una solicitud desde un origen no permitido, el servidor no incluye el encabezado `Access-Control-Allow-Origin`. Solo los orígenes configurados en `WithOrigins` lo reciben.",
                  notAchieved:
                    "El servidor responde con `Access-Control-Allow-Origin: *` o permite cualquier origen sin validación.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Manejo de Solicitudes de Verificación Previa (Preflight)",
      description:
        "Configurar CORS para manejar correctamente las solicitudes OPTIONS (preflight) que los navegadores envían antes de peticiones complejas (como PUT, DELETE o con encabezados personalizados) para verificar si la solicitud principal es segura.",
      threats: ["CSRF"],

      recommendation:
        "Requerido para: Web API que exponen métodos 'complejos' (PUT, DELETE, PATCH) o que esperan encabezados personalizados (ej. `Authorization`) desde un frontend en un origen diferente.",
      warning:
        "Olvidar incluir 'OPTIONS' en la lista de `WithMethods` es un error común que causa que las solicitudes preflight fallen, bloqueando las peticiones complejas. Siempre debe estar presente si se usa `WithMethods`.",

      modalContent: {
        title: "Configuración de Solicitudes Preflight",
        practices: [
          {
            title: "1. Configurar Métodos Permitidos Explícitamente",
            description:
              "En la política CORS, usar `WithMethods` para especificar la lista exacta de métodos HTTP permitidos. Es crucial incluir `OPTIONS` para que las solicitudes preflight sean exitosas.",
            code: `builder.Services.AddCors(options =>
{
    options.AddPolicy("PreflightPolicy", policy =>
    {
        policy.WithOrigins("https://dominio-cliente-permitido.com")
              .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
              .AllowAnyHeader();
    });
});`,
          },
          {
            title: "2. Configurar Tiempo de Caché para Preflight (Opcional)",
            description:
              "Usar `SetPreflightMaxAge` para indicarle al navegador que puede cachear el resultado de la solicitud preflight por un tiempo determinado, reduciendo el número de solicitudes OPTIONS.",
            code: `// ... dentro de la configuración de la política
.SetPreflightMaxAge(TimeSpan.FromMinutes(10));`,
          },
          {
            title: "3. Crear Endpoint que Maneje Métodos Complejos",
            description:
              "Asegurarse de que el endpoint al que se le aplica la política pueda manejar los métodos complejos definidos (ej. POST, PUT). El navegador solo enviará la solicitud principal si la preflight (OPTIONS) es exitosa.",
            code: `[HttpPost("crear")]
[EnableCors("PreflightPolicy")]
public IActionResult PostCrear([FromBody] object data)
{
    return Ok(new { message = "Creado" });
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Configuración de métodos (25%)",
                  achieved:
                    "La política CORS incluye `WithMethods` con la lista explícita de verbos HTTP, incluyendo 'OPTIONS'.",
                  notAchieved:
                    "No se configuraron los métodos permitidos o falta 'OPTIONS' en la lista.",
                },
                {
                  description: "Caché de preflight (25%)",
                  achieved:
                    "Se configuró `SetPreflightMaxAge` para establecer un tiempo de caché y optimizar las solicitudes.",
                  notAchieved:
                    "No se configuró MaxAge, causando una solicitud preflight en cada petición compleja.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Validación de Preflight (50%)",
                  achieved:
                    "Al enviar una solicitud OPTIONS (preflight) desde un origen no permitido, el servidor la rechaza. Solo orígenes válidos reciben los encabezados `Access-Control-Allow-Methods` y `Access-Control-Allow-Origin`.",
                  notAchieved:
                    "La verificación preflight permite cualquier origen o no valida correctamente, permitiendo solicitudes cross-origin maliciosas.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Configuración de Cabeceras (Headers) y Credenciales",
      description:
        "Controlar explícitamente qué encabezados HTTP pueden enviarse en las solicitudes cross-origin y si se permite el envío de credenciales (como cookies o tokens de autorización).",
      threats: ["CSRF"],

      recommendation:
        "Esencial para: Web API que manejan autenticación y son consumidas desde un frontend en otro dominio. Para mayor seguridad, complemente esta práctica con la 'Exposición y Validación de Tokens en APIs' del mecanismo 'Tokens antifalsificación'.",
      warning:
        "¡Configuración de alto riesgo! Nunca combine `.AllowCredentials()` con `.AllowAnyOrigin()`. Es una vulnerabilidad grave, y los navegadores modernos bloquearán la solicitud por seguridad. Siempre use `WithOrigins` con dominios específicos si permite credenciales.",

      modalContent: {
        title: "Manejo de Encabezados y Credenciales en CORS",
        practices: [
          {
            title: "1. Configurar Encabezados Permitidos",
            description:
              "Usar `WithHeaders` en la política CORS para especificar una lista blanca de encabezados que el cliente tiene permitido enviar, como 'Authorization' para tokens o 'Content-Type'.",
            code: `builder.Services.AddCors(options =>
{
    options.AddPolicy("HeadersPolicy", policy =>
    {
        policy.WithOrigins("https://dominio-cliente-permitido.com")
              .WithHeaders("Authorization", "Content-Type", "X-Api-Key")
              .AllowAnyMethod();
    });
});`,
          },
          {
            title: "2. Permitir Credenciales de Forma Segura",
            description:
              "Si la API necesita recibir cookies o encabezados de autenticación del cliente, se debe usar `AllowCredentials()`. **Importante:** Al usar esta opción, es obligatorio especificar los orígenes con `WithOrigins` y no se puede usar `AllowAnyOrigin()`.",
            code: `// ... dentro de la configuración de la política
.AllowCredentials();`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Configuración de headers permitidos (20%)",
                  achieved:
                    'Se usa `WithHeaders("Header1", ...)` para especificar los encabezados que el cliente puede enviar.',
                  notAchieved:
                    "No se configuraron los encabezados permitidos, bloqueando solicitudes legítimas.",
                },
                {
                  description: "Exposición de headers (20%)",
                  achieved:
                    "Se usa `WithExposedHeaders` para permitir que el cliente lea encabezados de respuesta personalizados.",
                  notAchieved:
                    "El cliente no puede acceder a encabezados personalizados enviados por el servidor.",
                },
                {
                  description: "Manejo de Credenciales (10%)",
                  achieved:
                    "Si se necesita autenticación, se configuró `AllowCredentials()` junto con una lista específica de `WithOrigins`.",
                  notAchieved:
                    "Se usa `AllowCredentials()` con `AllowAnyOrigin()`, lo cual es una configuración insegura y prohibida.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Control de Acceso (50%)",
                  achieved:
                    "Solo los orígenes y encabezados válidos son permitidos. Si se usan credenciales, la política de origen es estricta, previniendo el abuso de sesiones autenticadas desde sitios no confiables.",
                  notAchieved:
                    "El servidor permite encabezados o credenciales desde cualquier origen, permitiendo ataques CSRF.",
                },
              ],
            },
          ],
        },
      },
    },
  ],

  threats: [
    {
      title:
        "Falsificación de petición en sitios cruzados (Cross-site Request Forgery o CSRF)",
      description:
        "Es un ataque de seguridad en el que un atacante engaña a un usuario para que ejecute acciones no deseadas en una aplicación web, mientras esta autenticado.",
      recommendations: [
        "Uso de Políticas Nombradas con [EnableCors]",
        "Manejo de Solicitudes de Verificación Previa (Preflight)",
        "Configuración de Cabeceras (Headers) y Credenciales",
      ],
    },
  ],
};
