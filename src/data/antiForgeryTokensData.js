import CookieTheft from "../assets/CookieTheft.png";
import CSRF from "../assets/CSRF.png";

export const antiForgeryTokensData = {
  securityMechanismTitle: "Tokens antifalsificación",
  definition:
    "Los tokens anti-falsificación son un mecanismo de seguridad que provee ASP.NET Core para prevenir los ataques de Cross-Site Request Forgery (CSRF).  Se trata de un token único que se asigna a cada sesión de usuario y se incluyen en un campo oculto en los formularios HTML secretamente. Cuando se envían los datos del formulario al servidor, el token se válida para asegurar que la fuente de la solicitud sea de un cliente legítimo, si el token no está incluido o no coincide con los valores almacenados, el servidor rechazara la solicitud maliciosa.",
  interestingFacts: [
    {
      description:
        "El token antifalsificación funciona porque prueba que la solicitud se originó en tu propia aplicación. Un sitio malicioso puede forzar a tu navegador a enviar una petición, pero no puede leer la cookie de seguridad para incluir el token correspondiente en el formulario. Sin esa coincidencia, el servidor rechaza la solicitud.",
      image: CookieTheft,
    },
    {
      description:
        "El atributo [AutoValidateAntiforgeryToken] automatiza la protección, aplicando la validación del token a todas las acciones que no usan métodos HTTP seguros (GET, HEAD, OPTIONS, TRACE) asegurando una protección global por defecto para todas las acciones que modifican datos.",
      image: CSRF,
    },
  ],

  goodPractices: [
    {
      title: "Uso de [AutoValidateAntiforgeryToken] en Vistas de Servidor",
      description:
        "El usar AutoValidateAntiforgeryToken para escenarios no API, asegura que las acciones POST estén protegidas por defecto. La alternativa es aplicar ValidateAntiForgeryToken a cada método, sin embargo, esto puede causar que se deje desprotegido por error un método.",
      threats: ["CSRF"],

      recommendation:
        "Ideal para: Aplicaciones ASP.NET Core MVC y Razor Pages tradicionales, donde el HTML se genera y renderiza completamente en el servidor.",
      warning:
        "Este enfoque no es adecuado para SPAs (Single-Page Applications como React, Angular) o clientes que consumen la API de forma desacoplada, ya que estos dependen de JavaScript para manejar los tokens.",

      githubUrl: "https://github.com/SegurAppNet/SegurApp-labs/tree/main/AntiforgeryTokens/AntiforgeryTokensMVC",

      modalContent: {
        title: "Implementación en Vistas Renderizadas por Servidor",
        introduction: "En el modelo tradicional MVC, el servidor genera el HTML. Esto facilita la inyección del token.  Aquí configuramos una defensa global para no olvidar proteger ningún formulario POST. Los nombres de cookies y headers pueden personalizarse, pero los valores por defecto suelen ser seguros para la mayoría de los casos.",
        practices: [
          {
            title: "1. Configurar Validación Automática",
            description:
              "En Program.cs, añadir el filtro AutoValidateAntiforgeryTokenAttribute a los servicios de controladores. Esto asegura que todas las peticiones POST, PUT, DELETE y PATCH sean validadas.",
            code: `builder.Services.AddControllersWithViews(options =>
{
    // Aplica la validación a TODOS los controladores automáticamente.
    // Es más seguro que ir controlador por controlador (lista blanca).
    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
});`,
          },
          {
            title: "2. Configurar Opciones de Antiforgery",
            description:
              "Añadir la configuración del servicio de antiforgery para definir el nombre del encabezado y asegurar que la cookie asociada sea segura, aplicando políticas de HttpOnly y SameSite.",
            code: `builder.Services.AddAntiforgery(options =>
{
    // Puedes cambiar estos nombres, pero deben ser consistentes en tu aplicación
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "__RequestVerificationToken";
    
    options.Cookie.HttpOnly = true; // Previene acceso desde JS del cliente (XSS)
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.Strict; // Recomendado para apps internas/mismo dominio
});`,
          },
          {
            title: "3. Incluir el Token en Formularios Razor",
            description:
              'En cada formulario de las vistas Razor, incluir el tag helper @Html.AntiForgeryToken(). Esto renderizará un campo <input type="hidden"> con el token que será enviado automáticamente.',
            code: `<form asp-action="Login" method="post">
    @Html.AntiForgeryToken()
    
    <div>
        <label>Email</label>
        <input type="email" name="Email" required />
    </div>
    <div>
        <label>Password</label>
        <input type="password" name="Password" required />
    </div>
    <button type="submit">Iniciar sesión</button>
</form>`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Configuración en Program.cs (30%)",
                  achieved:
                    "Se añadió AutoValidateAntiforgeryToken en filtros globales y se configuró AddAntiforgery con header y cookie seguras.",
                  notAchieved:
                    "No se añadió la validación automática o las cookies son inseguras (sin HttpOnly/SameSite).",
                },
                {
                  description: "Inclusión en formularios (10%)",
                  achieved:
                    "Los formularios contienen @Html.AntiForgeryToken() en vistas Razor, generando un campo oculto y una cookie asociada.",
                  notAchieved:
                    "Los formularios no incluyen el token o se envían sin él.",
                },
                {
                  description: "Validación en backend (10%)",
                  achieved:
                    "Las peticiones POST/PUT/DELETE requieren un token válido; de lo contrario, el servidor devuelve un error 400.",
                  notAchieved:
                    "El backend no valida el token o permite peticiones sin él.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Protección contra CSRF (50%)",
                  achieved:
                    "Al enviar una petición desde un cliente sin el token válido o manipulando la cookie, el servidor rechaza la petición con un error 400.",
                  notAchieved:
                    "El servidor acepta peticiones sin token o con tokens manipulados.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Tokens Antifalsificación en APIs (Patrón Cookie)",
      description:
        "Para SPAs (Single-Page Applications) que se autentican con cookies, el token CSRF debe ser generado por un endpoint, enviado al cliente (en el cuerpo de la respuesta) y luego incluido por el cliente en los encabezados de las peticiones que modifican datos.",
      threats: ["CSRF"],
      recommendation:
        "Este patrón se usa para Web APIs que (por razones específicas) utilizan autenticación basada en cookies. Es importante notar que el estándar moderno para APIs (especialmente con SPAs) es usar Tokens JWT, los cuales no requieren esta protección CSRF porque el token no se envía automáticamente.",
      warning:
        "¡Atención! Este patrón es para clientes tipo SPA (React, Angular, etc.) que deben consumir un endpoint. Si tu cliente es una aplicación ASP.NET Core MVC o Razor, no necesitas este endpoint, ya que el framework lo maneja automáticamente usando el helper (@Html.AntiForgeryToken()) en tus formularios.",

      githubUrl: "https://github.com/SegurAppNet/SegurApp-labs/tree/main/AntiforgeryTokens/AntiforgeryTokensAPI",

      modalContent: {
        title: "Implementación para Consumidores de API (SPAs)",
        introduction: "Cuando el cliente es una SPA (Single Page Application), el servidor no renderiza el formulario HTML, por lo que no puede inyectar el token oculto automáticamente.  Debemos crear un mecanismo para entregar el token al cliente primero (generalmente al iniciar la app), para que este lo reenvíe manualmente en sus cabeceras HTTP. Los nombres de los headers aquí son convenciones, asegúrate de que tu Frontend y Backend usen exactamente los mismos strings.",
        practices: [
          {
            title: "1. Configurar Antiforgery para APIs",
            description:
              "En Program.cs, configura el servicio antiforgery. Debes definir el nombre del encabezado (HeaderName) que tu cliente JavaScript enviará y el nombre de la cookie que el servidor usará para validar.",
            code: `builder.Services.AddAntiforgery(options =>
{
    // IMPORTANTE: Este string debe coincidir con lo que envíes desde el frontend
    options.HeaderName = "X-CSRF-TOKEN"; 
    
    // Nombre de la cookie de seguridad (puede ser cualquiera, pero hazlo único)
    options.Cookie.Name = "XSRF-TOKEN-COOKIE"; 
    
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    
    // Lax permite navegación segura entre el mismo sitio. 
    // Si tu API y Front están en dominios diferentes (CORS), revisa SameSiteMode.None
    options.Cookie.SameSite = SameSiteMode.Lax; 
});`,
            postCodeText:
              "Si configuras SameSite como None (para dominios cruzados), recuerda que requerirás una conexión segura (HTTPS) y configuración CORS adecuada.",
          },
          {
            title: "2. Crear un Endpoint para Exponer el Token",
            description:
              "Crea un endpoint GET (usualmente después del login) que el cliente pueda llamar para obtener el token. Este endpoint usa IAntiforgery para generar la cookie y obtener el token de petición (RequestToken).",
            code: `// En un controlador de API
private readonly IAntiforgery _antiforgery;
public TuControlador(IAntiforgery antiforgery)
{
    _antiforgery = antiforgery;
}

[HttpGet("csrf-token")]
public IActionResult GetCsrfToken()
{
    // Genera el par de tokens (la cookie y el token de petición) basado en el contexto actual
    var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
    
    // Devuelve solo el token que el cliente debe leer y enviar manualmente
    return Ok(new { token = tokens.RequestToken });
}`,
          },
          {
            title: "3. Validar el Token en Endpoints Sensibles",
            description:
              "En lugar de validar manualmente, simplemente en tus endpoints (POST, PUT, DELETE) agrega el atributo ValidateAntiForgeryToken. El framework buscará automáticamente el token en el encabezado que definiste en el paso 1.",
            code: `// En un endpoint que modifica datos
[HttpPost("actualizar-perfil")]
[ValidateAntiForgeryToken] 
public IActionResult UpdateProfile([FromBody] ProfileModel model)
{
    // Si el código llega aquí, el token en el Header coincidió con la Cookie.
    return Ok(new { message = "Perfil actualizado" });
}`,
          },
          {
            title: "4. Consumo desde el Frontend (SPA)",
            description:
              "El cliente (tu SPA) primero debe hacer una llamada GET al endpoint del token. Luego, en cada petición POST/PUT/DELETE, debe incluir el token recibido en el encabezado exacto que definiste en el backend.",
            code: `// Ejemplo conceptual en JavaScript
async function getCsrfToken() {
    // 1. Obtener el token CSRF desde tu endpoint
    const csrfResponse = await fetch('/api/csrf-token');
    const csrfData = await csrfResponse.json();
    return csrfData.token;
}

async function updateUserProfile(profileData, csrfToken) {
    // 2. Realizar la petición POST
    const updateResponse = await fetch('/api/actualizar-perfil', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // ¡OJO! Este nombre debe ser IGUAL al options.HeaderName del backend
            'X-CSRF-TOKEN': csrfToken 
        },
        body: JSON.stringify(profileData)
    });
    // ... manejar la respuesta ...
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Configuración en API (15%)",
                  achieved:
                    "AddAntiforgery está configurado con HeaderName y cookies seguras (HttpOnly, SameSite=Lax).",
                  notAchieved: "Antiforgery no está configurado correctamente.",
                },
                {
                  description: "Exposición del token (15%)",
                  achieved:
                    "Un endpoint GET devuelve el RequestToken (en formato JSON) y establece la cookie asociada.",
                  notAchieved:
                    "No existe el endpoint de obtención de token o no funciona correctamente.",
                },
                {
                  description: "Validación en API (10%)",
                  achieved:
                    "Endpoints sensibles (POST, PUT, etc.) están decorados con el atributo (ValidateAntiForgeryToken).",
                  notAchieved:
                    "La API no usa el atributo (ValidateAntiForgeryToken) o permite llamadas sin él.",
                },
                {
                  description: "Consumo desde frontend (10%)",
                  achieved:
                    "El frontend obtiene el token de la API y lo envía en el encabezado configurado al hacer peticiones que modifican datos.",
                  notAchieved:
                    "El frontend no obtiene el token o no lo envía en el encabezado.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Protección contra CSRF (50%)",
                  achieved:
                    "Las peticiones sin token o con un token modificado son rechazadas por el servidor (usualmente con un error 400).",
                  notAchieved:
                    "La API acepta peticiones sin token o con tokens manipulados.",
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
        "Uso de [AutoValidateAntiforgeryToken] en Vistas de Servidor",
        "Tokens Antifalsificación en APIs (Patrón Cookie)",
      ],
    },
  ],
};