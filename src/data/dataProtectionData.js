import DataProtection from "../assets/DataProtection.png";
import DataEncrypt from "../assets/DataEncrypt.png";

export const dataProtectionData = {
  securityMechanismTitle: "Protección de datos",
  definition:
    "La protección de datos consiste en implementar mecanismos para asegurar la confidencialidad e integridad de la información sensible que maneja una aplicación. Esto incluye el cifrado de datos tanto en tránsito (usando HTTPS) como en reposo (en bases de datos o archivos), asegurando que solo usuarios autorizados puedan acceder a ellos en un formato legible.",
  interestingFacts: [
    {
      description:
        "La API de Protección de Datos de ASP.NET Core está diseñada para ser el sistema principal de criptografía de la plataforma. Se utiliza internamente para proteger cookies de autenticación, tokens anti-falsificación y cualquier otro dato sensible que necesite ser resguardado.",
      image: DataProtection,
    },
    {
      description:
        "La API de Protección de Datos no solo cifra, sino que también firma el contenido. Esto significa que no solo protege los datos para que no puedan ser leídos (confidencialidad), sino que también garantiza que no han sido manipulados por un tercero (integridad). Si el dato cifrado es alterado, el descifrado fallará.",
      image: DataEncrypt,
    },
  ],
  goodPractices: [
    {
      title: "Encriptación de datos con la Data Protection API",
      description:
        "Utilizar el sistema de protección de datos integrado de ASP.NET Core para cifrar y descifrar información sensible de forma segura, como datos personales de usuarios o secretos de la aplicación que se necesiten almacenar.",
      threats: ["Manipulación de Datos"],

      recommendation:
        "Recomendado para: Cualquier tipo de aplicación (MVC, Web API, etc.) que necesite almacenar datos sensibles específicos en una base de datos, como números de identificación personal o información médica, sin cifrar la base de datos completa.",
      warning:
        "¡Crítico! La gestión de claves es fundamental. En producción, las claves de Data Protection deben persistir en una ubicación centralizada y segura (como Azure Blob Storage o Redis) para que el cifrado funcione entre múltiples instancias del servidor y para evitar la pérdida de datos si el servidor se reinicia o se reemplaza.",

      modalContent: {
        title: "Uso de la Data Protection API para Cifrado",
        practices: [
          {
            title: "1. Registrar el Servicio de Data Protection",
            description:
              "En `Program.cs`, registrar el servicio principal de la Data Protection API en el contenedor de dependencias.",
            code: `// En Program.cs
builder.Services.AddDataProtection();`,
          },
          {
            title: "2. Crear un Servicio de Cifrado",
            description:
              "Crear una clase de servicio que encapsule la lógica de cifrado. Inyectar `IDataProtectionProvider` y crear un 'protector' con una cadena de propósito única para aislar los datos cifrados.",
            code: `public class EncryptionService
{
    private readonly IDataProtector _protector;

    public EncryptionService(IDataProtectionProvider provider)
    {
        // La cadena de propósito aísla criptográficamente los datos.
        _protector = provider.CreateProtector("MiApp.Proposito.Unico");
    }
    // ... métodos de cifrado y descifrado
}`,
          },
          {
            title: "3. Implementar Métodos de Cifrado y Descifrado",
            description:
              "Dentro del servicio, crear métodos que usen `_protector.Protect()` para cifrar y `_protector.Unprotect()` para descifrar. Es crucial manejar la `CryptographicException` en el descifrado para gestionar casos de datos corruptos o manipulados.",
            code: `public string Encrypt(string plainText)
{
    return _protector.Protect(plainText);
}

public string? Decrypt(string cipherText)
{
    try
    {
        return _protector.Unprotect(cipherText);
    }
    catch (System.Security.Cryptography.CryptographicException)
    {
        // Manejar el error: loggear, devolver null, etc.
        return null;
    }
}`,
          },
          {
            title: "4. Registrar y Usar el Servicio",
            description:
              "Registrar el `EncryptionService` como un singleton en `Program.cs` para que pueda ser inyectado en controladores u otros servicios donde se necesite proteger o acceder a datos sensibles.",
            code: `// Registrar el servicio en Program.cs
builder.Services.AddSingleton<EncryptionService>();

// Inyectar y usar en un controlador
public class MyController : ControllerBase
{
    private readonly EncryptionService _encryptionService;

    public MyController(EncryptionService encryptionService)
    {
        _encryptionService = encryptionService;
    }
    // ...
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Uso de ASP.NET Core Data Protection (30%)",
                  achieved:
                    "La solución utiliza `IDataProtector` del framework `Microsoft.AspNetCore.DataProtection`. Los servicios están registrados correctamente en Program.cs.",
                  notAchieved:
                    "No se utiliza el sistema de protección de datos integrado o los servicios no están registrados.",
                },
                {
                  description: "Implementación de Servicio (20%)",
                  achieved:
                    "La lógica de cifrado está correctamente aislada en un servicio inyectable y reutilizable.",
                  notAchieved:
                    "La lógica de cifrado está mezclada directamente en los controladores, dificultando su mantenimiento y reutilización.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Integridad del Cifrado/Descifrado (30%)",
                  achieved:
                    "Un dato que es cifrado por el servicio puede ser descifrado exitosamente para obtener el valor original. El texto cifrado no revela información del texto plano.",
                  notAchieved:
                    "El proceso de descifrado falla al intentar revertir un texto cifrado válido, o el texto cifrado es trivial (ej. Base64 sin cifrado real).",
                },
                {
                  description: "Manejo de Datos Corruptos (20%)",
                  achieved:
                    "Al intentar descifrar datos inválidos o manipulados, la aplicación maneja la `CryptographicException` de forma controlada, sin crashear.",
                  notAchieved:
                    "La aplicación se bloquea o devuelve un error no controlado al intentar descifrar datos corruptos.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Manejo de Secretos (Secret Manager y Key Vault)",
      description:
        "Separar los secretos de la aplicación (claves de API, contraseñas, cadenas de conexión) del código fuente y cargarlos desde una fuente segura dependiendo del entorno (desarrollo o producción).",
      threats: ["Manipulación de Datos"],

      recommendation:
        "Esencial para: Todas las aplicaciones. Es una práctica de seguridad fundamental que nunca debe omitirse. El Secret Manager es para desarrollo local, mientras que Azure Key Vault (o un servicio similar) es el estándar para producción.",
      warning:
        "El Secret Manager solo protege los secretos en la máquina local de desarrollo. Nunca debe usarse como una solución para producción. Asegúrese de que el acceso al almacén de secretos de producción (como Key Vault) esté restringido mediante políticas de acceso estrictas.",

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
        "Encriptación de datos con la Data protection API",
        "Manejo de Secretos (Secret Manager y Key Vault)",
      ],
    },
  ],
};
