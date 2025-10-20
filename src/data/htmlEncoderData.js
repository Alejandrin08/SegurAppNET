import Razor from "../assets/Razor.png";
import CSP from "../assets/CSP.png";

export const htmlEncoderData = {
  securityMechanismTitle: "Codificador HTML (HTML Encoder)",
  definition:
    "Un codificador de salida (Output Encoder) es un mecanismo de seguridad que se encarga de transformar datos antes de ser renderizados en la interfaz de usuario. Su función principal es neutralizar contenido potencialmente malicioso, como scripts, convirtiendo caracteres especiales (ej. `<` a `&lt;`) para que el navegador los interprete como texto literal y no como código ejecutable, previniendo así ataques de Cross-Site Scripting (XSS).",
  interestingFacts: [
    {
      description:
        "Frameworks modernos como Razor en ASP.NET Core codifican por defecto todas las salidas de variables. Es una de las defensas más importantes contra XSS, ya que se aplica automáticamente sin que el desarrollador tenga que recordarlo en cada ocasión.",
      image: Razor,
    },
    {
      description:
        "Una Política de Seguridad de Contenido (CSP) funciona como una lista blanca (allow-list) para los navegadores, especificando de qué dominios se permite cargar recursos como scripts, estilos e imágenes. Es una capa de defensa en profundidad contra la inyección de código.",
      image: CSP,
    },
  ],

  goodPractices: [
    {
      title: "Content Security Policy (CSP)",
      description:
        "Implementar un encabezado de respuesta HTTP que le dice al navegador de qué fuentes tiene permitido cargar contenido. CSP es una defensa crucial contra ataques de Cross-Site Scripting (XSS) y otras inyecciones de código.",
      threats: [
        "Cross-Site Scripting (XSS)",
        "Clickjacking",
        "Mixed Content Vulnerabilities",
      ],

      recommendation:
        "Esencial para: Todas las aplicaciones web modernas (MVC, Razor Pages, Web API con frontend, Blazor). Es una capa de defensa en profundidad crítica contra ataques XSS y de inyección de contenido.",
      warning:
        "¡Cuidado! Una CSP demasiado restrictiva puede romper la funcionalidad de tu sitio al bloquear scripts, estilos o fuentes legítimas (ej. de CDNs o servicios de terceros). Empieza con una política estricta (`'self'`) y añade explícitamente los orígenes necesarios. Evita a toda costa el uso de `'unsafe-inline'` y `'unsafe-eval'` en producción.",

      modalContent: {
        title: "Implementación de Content Security Policy (CSP)",
        practices: [
          {
            title: "1. Configurar Middleware CSP en Program.cs",
            description:
              "Añadir un middleware personalizado para interceptar todas las respuestas y adjuntar el encabezado 'Content-Security-Policy' con las directivas de seguridad adecuadas. Estas directivas definen las fuentes permitidas para diferentes tipos de recursos.",
            code: `app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self'; " +
        "img-src 'self' data:; " + // Permite imágenes del propio dominio y data URIs
        "font-src 'self'; " +
        "connect-src 'self'; " +
        "frame-ancestors 'none'; " + // Previene clickjacking
        "base-uri 'self';"
    );
    await next();
});`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Configuración de middleware (25%)",
                  achieved:
                    "El middleware CSP está implementado en Program.cs usando app.Use() con la sintaxis async/await, y el proyecto compila correctamente.",
                  notAchieved:
                    "El middleware tiene una sintaxis incorrecta o el proyecto no compila.",
                },
                {
                  description: "Directivas CSP implementadas (25%)",
                  achieved:
                    "Se implementan directivas clave como default-src, script-src, style-src, y frame-ancestors, ajustadas a las necesidades del proyecto.",
                  notAchieved:
                    "No se implementan directivas cruciales o la configuración bloquea recursos legítimos de la aplicación.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Presencia del Encabezado CSP (25%)",
                  achieved:
                    "Al inspeccionar las herramientas de red del navegador, el encabezado 'Content-Security-Policy' está presente en la respuesta HTTP de la página.",
                  notAchieved:
                    "No se encuentra el encabezado Content-Security-Policy en la respuesta HTTP.",
                },
                {
                  description: "Verificación contra Scripts In-line (25%)",
                  achieved:
                    "Al intentar inyectar un script simple (ej. <script>alert('xss')</script>) en un campo de entrada, el script es bloqueado y la consola del navegador reporta una violación de la CSP.",
                  notAchieved:
                    "El script se ejecuta o el sistema no reporta ninguna violación de CSP en la consola.",
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
        "Secuencia de comandos en sitios cruzados (Cross-site Scripting O XSS)",
      description:
        "Ataque en el que un atacante inyecta scripts maliciosos en un sitio web de confianza, lo que puede provocar el robo de datos y el secuestro de la sesión.",
      recommendations: ["Content Security Policy (CSP)"],
    },
    {
      title: "Secuestro de clics (Clickjacking)",
      description:
        "Es un ataque en el que un sitio web malicioso incrusta una aplicación legítima dentro de un iframe invisible o disfrazado, engañando a los usuarios para que interactúen con el contenido oculto, como hacer clic en un botón.",
      recommendations: ["Content Security Policy (CSP)"],
    },
    {
      title:
        "Vulnerabilidades de contenido mixto (Mixed content vulnerabilities)",
      description:
        "Una página HTTPS comienza a cargar recursos a través de HTTP, lo que expondrá la aplicación a un posible ataque.",
      recommendations: ["Content Security Policy (CSP)"],
    },
  ],
};
