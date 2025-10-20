import SecretsManagement from "../assets/secretsManagement.png";
import Secrets from "../assets/Secrets.png";

export const secretsManagementData = {
  securityMechanismTitle: "Manejo de secretos",
  definition:
    "El manejo de secretos es la práctica de gestionar de forma segura las credenciales digitales, como claves de API, contraseñas y certificados. El objetivo principal es separar estos secretos del código fuente y cargarlos desde un lugar seguro que varía según el entorno (desarrollo, producción), minimizando el riesgo de exposición.",
  interestingFacts: [
    {
      description:
        "Uno de los errores de seguridad más frecuentes es confirmar accidentalmente secretos (como claves de API o contraseñas) en repositorios de código como Git. Herramientas como el Secret Manager y almacenes externos previenen esto al mantener la información sensible completamente fuera del proyecto.",
      image: SecretsManagement,
    },
    {
      description:
        "Las políticas de rotación de secretos son una práctica de seguridad crucial. Cambiar las claves y contraseñas periódicamente limita el tiempo de vida de una credencial comprometida, reduciendo la ventana de oportunidad para un atacante.",
      image: Secrets,
    },
  ],

  goodPractices: [
    {
      title: "Secretos fuera del código (Secret Manager y Key Vault)",
      description:
        "Separar los secretos de la aplicación (claves de API, contraseñas, cadenas de conexión) del código fuente y cargarlos desde una fuente segura dependiendo del entorno (desarrollo o producción).",
      threats: ["Manipulación de Datos", "Acceso no autorizado"],

      recommendation:
        "Esencial para: Todas las aplicaciones (MVC, Web API, Blazor, etc.). Es una práctica de seguridad fundamental que nunca debe omitirse. El Secret Manager es para desarrollo local, mientras que Azure Key Vault (o un servicio similar) es el estándar para producción.",
      warning:
        "¡Crítico! El Secret Manager solo protege los secretos en la máquina local de desarrollo y no debe usarse nunca en producción. Asegúrese de que el acceso al almacén de secretos de producción (como Key Vault) esté restringido mediante políticas de acceso estrictas (Managed Identities).",

      modalContent: {
        title: "Uso del Secret Manager y Azure Key Vault",
        practices: [
          {
            title: "1. Desarrollo: Uso del Secret Manager",
            description:
              "Para el entorno de desarrollo, inicializar el Secret Manager y almacenar los secretos localmente fuera del control de código fuente.",
            code: `dotnet user-secrets init
dotnet user-secrets set "ExampleName:SecretName" "VALOR_DEL_SECRETO"`,
          },
          {
            title: "2. Crear un Modelo (POCO) para los Secretos",
            description:
              "Definir una clase simple que represente la estructura de los secretos para habilitar el enlace de configuración fuertemente tipado.",
            code: `public class ExampleClassName
{
    public string ExampleApiKey { get; set; }
    public string ExampleAddress { get; set; }
}`,
          },
          {
            title: "3. Configurar el Patrón IOptions",
            description:
              "En `Program.cs`, usar `builder.Services.Configure<T>` para vincular la sección de configuración correspondiente a la clase del modelo POCO.",
            code: `builder.Services.Configure<ExampleClassName>(builder.Configuration.GetSection("ExampleName"));`,
          },
          {
            title: "4. Inyectar y Usar Secretos en un Servicio",
            description:
              "Inyectar `IOptions<ExampleClassName>` en un servicio para acceder a los secretos de forma segura y fuertemente tipada.",
            code: `public class ExampleService : IExampleService
{
    private readonly ExampleClassName _secrets;

    public ExampleService(Microsoft.Extensions.Options.IOptions<ExampleClassName> secrets)
    {
        _secrets = secrets.Value;
    }
    // ...
}`,
          },
          {
            title: "5. Producción: Integrar con un Almacén Externo",
            description:
              "Para producción, añadir un proveedor de configuración como Azure Key Vault en `Program.cs` para cargar los secretos desde un servicio centralizado y seguro.",
            code: `if (builder.Environment.IsProduction())
{
    var keyVaultUrl = builder.Configuration["KeyVaultUrl"];
    builder.Configuration.AddAzureKeyVault(
        new Uri(keyVaultUrl), new DefaultAzureCredential());
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Separación de Secretos por Entorno (30%)",
                  achieved:
                    "Se usa el Secret Manager para desarrollo y se configura un proveedor de almacén externo (como Azure Key Vault) para producción.",
                  notAchieved:
                    "Se almacenan secretos en appsettings.json o se hardcodean en el código.",
                },
                {
                  description: "Consumo de Secretos mediante Inyección (20%)",
                  achieved:
                    "Los secretos se acceden a través de un modelo POCO y se inyectan en los servicios utilizando el patrón IOptions<T>.",
                  notAchieved:
                    "Los secretos se leen directamente desde IConfiguration en varios lugares, sin un modelo fuertemente tipado.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Ausencia de Secretos en código (30%)",
                  achieved:
                    "No hay credenciales, claves de API o contraseñas en texto plano en el código fuente ni en los archivos de configuración versionados.",
                  notAchieved:
                    "El código o los archivos de configuración contienen secretos en texto plano.",
                },
                {
                  description: "Recuperación de secretos (20%)",
                  achieved:
                    "La aplicación se ejecuta correctamente en ambos entornos (desarrollo y producción), cargando los secretos desde la fuente apropiada para cada caso.",
                  notAchieved:
                    "La aplicación falla porque no puede cargar los secretos desde el Secret Manager o el almacén externo.",
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
      title: "Manipulación de Datos",
      description:
        "Ataque en el que los datos transmitidos entre el cliente y la API pueden ser interceptados y modificados.",
      recommendations: [
        "Secretos fuera del código (Secret Manager y Key Vault)",
      ],
    },
    {
      title: "Acceso no autorizado",
      description:
        "Usuarios malintencionados pueden intentar acceder a datos confidenciales o realizar acciones para las que no están autorizados, además, el acceso no autorizado a los datos puede dar lugar a violaciones de datos (Data breaches), lo que resulta en una exposición de información confidencial.",
      recommendations: [
        "Secretos fuera del código (Secret Manager y Key Vault)",
      ],
    },
  ],
};
