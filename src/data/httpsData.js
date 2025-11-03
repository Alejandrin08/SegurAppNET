import HSTS from "../assets/HSTS.png";
import HTTPS from "../assets/HTTPS.png";

export const httpsData = {
  securityMechanismTitle: "Forzar el uso de HTTPS",
  definition:
    "El forzar el uso de HTTPS es otro mecanismo de seguridad, se asegura que toda comunicación entre el cliente y el servidor esté cifrada, esto ya que se hace uso del protocolo SSL/TLS.",
  interestingFacts: [
    {
      description:
        "El encabezado HSTS (HTTP Strict Transport Security) le dice a los navegadores que solo deben interactuar con un sitio web usando HTTPS. Una vez que un navegador recibe este encabezado, se negará a conectarse a través de HTTP por el tiempo especificado (MaxAge), previniendo ataques de SSL Stripping.",
      image: HSTS,
    },
    {
      description:
        "El middleware 'UseHttpsRedirection' en ASP.NET Core redirige las solicitudes HTTP al puerto HTTPS correspondiente antes de que lleguen a la lógica de la aplicación, asegurando que toda la comunicación posterior esté cifrada desde el principio.",
      image: HTTPS,
    },
  ],
  goodPractices: [
    {
      title: "Uso de HSTS (HTTP Strict Transport Security)",
      description:
        "Usar HSTS para reforzar la comunicación segura al usar siempre conexiones seguras como HTTPS.",
      threats: ["Ataques Man-in-the-Middle", "Manipulación de Datos"],

      warning:
        "Nunca use un MaxAge largo (ej. 365 días) en un entorno de desarrollo (localhost). El navegador aplicará la política a todo localhost, lo que puede romper otros proyectos locales que no usen HTTPS. Use siempre valores muy cortos (ej. 60 segundos) para pruebas.",

      modalContent: {
        title: "Implementación de HSTS en ASP.NET Core",
        practices: [
          {
            title: "1. Habilitar HTTPS en el Proyecto",
            description:
              "Asegurarse de que el proyecto ASP.NET Core esté configurado para usar HTTPS desde su creación, ya sea marcando la casilla en Visual Studio o usando el flag --use-https en la CLI.",
            code: `dotnet new mvc --name MiProyectoWeb --use-https`,
          },
          {
            title: "2. Configurar HSTS en Program.cs",
            description:
              "Registrar el servicio HSTS, especificando un MaxAge (tiempo que el navegador recordará la política). Para desarrollo, se usa un valor corto para evitar conflictos con otros proyectos en localhost.",
            code: `builder.Services.AddHsts(options =>
{
    // Para desarrollo, usar un valor corto. Para producción, usar 365 días.
    options.MaxAge = TimeSpan.FromSeconds(60); 
    options.IncludeSubDomains = false; // Cambiar a true en producción si aplica
    options.Preload = false; 
});`,
          },
          {
            title: "3. Añadir Middleware de HSTS y Redirección",
            description:
              "En el pipeline de la aplicación, añadir app.UseHsts() y app.UseHttpsRedirection(). La redirección fuerza la primera visita a ser HTTPS, y HSTS se encarga de las visitas subsecuentes.",
            code: `// En Program.cs
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// HSTS debe ir después de la redirección y antes de la autorización/endpoints
app.UseHsts();

app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Configuración de HSTS (25%)",
                  achieved:
                    "Se agregó AddHsts() en Program.cs con un MaxAge de corta duración, adecuado para el entorno de desarrollo.",
                  notAchieved:
                    "No se configuró AddHsts() o se utilizó un MaxAge muy largo en un entorno de desarrollo.",
                },
                {
                  description: "Redirección HTTPS (25%)",
                  achieved:
                    "Se agregó app.UseHttpsRedirection() en el pipeline y las páginas solicitadas por HTTP redirigen automáticamente a HTTPS.",
                  notAchieved:
                    "No se agregó UseHttpsRedirection() o las redirecciones automáticas no funcionan.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Header presente en HTTPS (25%)",
                  achieved:
                    "Al acceder a la página a través de HTTPS, la respuesta del servidor incluye el encabezado Strict-Transport-Security con el max-age configurado.",
                  notAchieved:
                    "El encabezado Strict-Transport-Security no aparece en las respuestas HTTPS o tiene un valor incorrecto.",
                },
                {
                  description: "Protección contra ataques (25%)",
                  achieved:
                    "Después de una visita exitosa por HTTPS, si se intenta acceder por HTTP dentro del tiempo de MaxAge, el navegador bloquea la solicitud HTTP y la convierte a HTTPS automáticamente.",
                  notAchieved:
                    "El navegador no bloquea las solicitudes HTTP subsecuentes, permitiendo posibles ataques.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Encabezados de Respuesta HTTP Seguros",
      description:
        "Proporcionan una capa adicional de seguridad controlando comportamientos específicos del navegador reduciendo el riesgo de ataques del lado del cliente.",
      threats: ["Clickjacking", "Cross-Site Scripting (XSS)"],

      recommendation:
        "Para una protección más avanzada, considere usar la práctica Content Security Policy (CSP) del mecanismo HTML Encoder.",

      modalContent: {
        title: "Implementación de Encabezados de Seguridad",
        practices: [
          {
            title: "1. Crear un Middleware Personalizado",
            description:
              "En Program.cs, usar app.Use() para crear un middleware que intercepte todas las respuestas y añada los encabezados de seguridad necesarios antes de enviarlas al cliente.",
            code: `app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    
    await next();
});`,
          },
          {
            title: "2. Detalle de Encabezados Clave",
            description:
              "Comprender el propósito de cada encabezado: X-Content-Type-Options: nosniff previene el MIME-sniffing. X-Frame-Options: SAMEORIGIN previene que tu sitio sea cargado en un <iframe> de otro dominio. Referrer-Policy controla cuánta información de la URL de origen se envía al navegar a otros sitios.",
            code: `// X-Content-Type-Options: Previene que un archivo .txt con código JS sea ejecutado por el navegador.
// X-Frame-Options: Evita que un sitio malicioso muestre tu web en un iframe para engañar al usuario y que haga clic en botones invisibles.
// Referrer-Policy: Previene que URLs con información sensible (ej. tokens de reseteo de contraseña) se filtren a sitios externos.`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Configuración en Program.cs (50%)",
                  achieved:
                    "Se añade un middleware en Program.cs que establece correctamente los encabezados X-Content-Type-Options, y X-Frame-Options.",
                  notAchieved:
                    "Faltan encabezados de seguridad críticos o el middleware no fue añadido correctamente.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Verificación de encabezados (50%)",
                  achieved:
                    "Al inspeccionar una respuesta del servidor en las herramientas de desarrollador del navegador, todos los encabezados configurados están presentes con sus valores correctos.",
                  notAchieved:
                    "Faltan encabezados en la respuesta del servidor, o sus valores son inseguros o incorrectos.",
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
      title: "Ataques Man-in-the-Middle (MitM)",
      description:
        "Un atacante intercepta la comunicación entre el usuario y el navegador inyectando código malicioso.",
      recommendations: ["Uso de HSTS (HTTP Strict Transport Security)"],
    },
    {
      title: "Clickjacking",
      description:
        "Es un ataque en el que un sitio web malicioso incrusta una aplicación legítima dentro de un iframe invisible o disfrazado, engañando a los usuarios para que interactúen con el contenido oculto, como hacer clic en un botón.",
      recommendations: ["Encabezados de Respuesta HTTP Seguros"],
    },
    {
      title:
        "Secuencia de comandos en sitios cruzados (Cross-site Scripting O XSS)",
      description:
        "Ataque en el que un atacante inyecta scripts maliciosos en un sitio web de confianza, lo que puede provocar el robo de datos y el secuestro de la sesión.",
      recommendations: ["Encabezados de Respuesta HTTP Seguros"],
    },
    {
      title: "Manipulación de Datos",
      description:
        "Ataque en el que los datos transmitidos entre el cliente y la API pueden ser interceptados y modificados.",
      recommendations: ["Uso de HSTS (HTTP Strict Transport Security)"],
    },
  ],
};
