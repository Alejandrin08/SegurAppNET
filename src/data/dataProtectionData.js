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
      threats: ["Manipulación de Datos", "Acceso No Autorizado"],

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
      title: "Cifrado de Archivos de Configuración",
      description:
        "Proteger secretos y datos sensibles (como cadenas de conexión) en los archivos `appsettings.json` cifrándolos en el entorno de producción para que no estén expuestos en texto plano.",
      threats: ["Acceso No Autorizado"],

      recommendation:
        "Esencial para: Entornos de producción o cualquier entorno donde los archivos `appsettings.json` puedan ser accesibles por personal no autorizado. Complementa, pero no reemplaza, el uso de un gestor de secretos como Azure Key Vault.",
      warning:
        "¡Crítico! La carpeta donde se persisten las claves de `DataProtection` debe tener una copia de seguridad y permisos de acceso restringidos. Si se pierden estas claves, todos los datos cifrados con ellas serán irrecuperables.",

      modalContent: {
        title: "Uso de Data Protection para Cifrar appsettings.json",
        practices: [
          {
            title: "1. Configurar Data Protection Compartido",
            description:
              "Crear un proyecto de consola separado. En ambos proyectos (consola y app web), configurar el servicio de Data Protection para que persista las claves de cifrado en una carpeta compartida y usen el mismo nombre de aplicación.",
            code: `// Esta configuración debe ser idéntica en ambos proyectos
services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(@"C:\\Ruta\\Compartida\\Keys"))
    .SetApplicationName("NombreDeAplicacionCompartido");`,
          },
          {
            title: "2. Crear Herramienta de Cifrado",
            description:
              "En el proyecto de consola, crear la lógica para leer el `appsettings.json`, obtener un 'protector' del servicio de Data Protection, cifrar el valor sensible y sobreescribir el archivo.",
            code: `// En el proyecto de consola
var protector = provider.GetDataProtector("Configuration.Protector");
var configJson = JObject.Parse(File.ReadAllText("appsettings.json"));
var secretValue = configJson["ConnectionStrings"]["DefaultConnection"].Value<string>();

// Cifrar y reemplazar el valor
configJson["ConnectionStrings"]["DefaultConnection"] = protector.Protect(secretValue);
File.WriteAllText("appsettings.json", configJson.ToString());`,
          },
          {
            title: "3. Descifrar Configuración al Iniciar la App",
            description:
              "En el `Program.cs` de la aplicación web, obtener una instancia del 'protector' (usando la misma configuración compartida) y descifrar el valor del `appsettings.json` en memoria antes de que la aplicación termine de construirse.",
            code: `// En Program.cs de la app web
var protector = app.Services.GetDataProtector("Configuration.Protector");
var encryptedConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Descifrar y reemplazar en la configuración en memoria
builder.Configuration["ConnectionStrings:DefaultConnection"] = protector.Unprotect(encryptedConnectionString);`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Configuración de DataProtection (25%)",
                  achieved:
                    "Ambos proyectos (consola y app web) usan una configuración de DataProtection idéntica, apuntando a una carpeta de claves compartida y con un nombre de aplicación definido.",
                  notAchieved:
                    "La configuración de DataProtection es inconsistente, falta, o no se persiste en un lugar compartido.",
                },
                {
                  description: "Proceso de Cifrado y Descifrado (25%)",
                  achieved:
                    "Existe un proyecto de consola funcional que cifra el archivo appsettings.json, y la app web contiene la lógica para descifrar la configuración al iniciar.",
                  notAchieved:
                    "No existe un proyecto para cifrar, o la lógica de descifrado en la app web está ausente o es incorrecta.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Verificación del Archivo (25%)",
                  achieved:
                    "Una inspección del appsettings.json en el servidor de destino muestra que los valores sensibles están en formato cifrado e ilegible.",
                  notAchieved:
                    "El archivo appsettings.json en el servidor contiene secretos en texto plano.",
                },
                {
                  description: "Funcionalidad Operativa (25%)",
                  achieved:
                    "La aplicación se inicia y opera correctamente, demostrando que puede descifrar y utilizar los secretos del archivo de configuración.",
                  notAchieved:
                    "La aplicación falla al iniciarse o al intentar usar un secreto, debido a un error en el proceso de descifrado.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Validación de Entradas (Data Annotations)",
      description:
        "Validar todos los datos que provienen del cliente en el lado del servidor para asegurar su integridad, formato y longitud. Las 'Data Annotations' en los modelos son la primera línea de defensa contra datos maliciosos o malformados.",
      threats: [
        "Inyección de Datos",
        "Cross-Site Scripting (XSS)",
        "Manipulación de Datos",
      ],
      recommendation:
        "Fundamental para: Todas las aplicaciones ASP.NET Core que reciben datos del usuario (MVC, Razor Pages, Web API, Blazor). Es una práctica no negociable.",
      warning:
        "La validación del lado del cliente es una mejora de UX, no una medida de seguridad. La validación del lado del servidor con Data Annotations es la única que garantiza la seguridad, ya que no puede ser eludida.",

      modalContent: {
        title: "Uso de DataAnnotations para Validación de Modelos",
        practices: [
          {
            title: "1. Añadir Anotaciones a las Propiedades del Modelo",
            description:
              "Utilizar atributos de validación del namespace 'System.ComponentModel.DataAnnotations' para decorar las propiedades de los modelos. Esto permite definir reglas como obligatoriedad, tipo de dato, longitud y formato.",
            code: `// Ejemplo en un ViewModel de Login
using System.ComponentModel.DataAnnotations;

public class LoginViewModel
{
    [Required(ErrorMessage = "El correo electrónico es obligatorio")]
    [EmailAddress(ErrorMessage = "Formato de correo electrónico inválido")]
    [MaxLength(100, ErrorMessage = "El email no puede exceder 100 caracteres")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [DataType(DataType.Password)]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
    public string Password { get; set; } = null!;
}`,
          },
          {
            title: "2. Habilitar Validación en las Vistas",
            description:
              "Añadir la sección de scripts con el archivo parcial '_ValidationScriptsPartial' en las vistas que contienen formularios. Esto habilita la validación del lado del cliente de forma no intrusiva, mejorando la experiencia de usuario.",
            code: `@* En una vista de Razor (ej: Login.cshtml) *@
@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Importación de dependencia (10%)",
                  achieved:
                    "La declaración 'using System.ComponentModel.DataAnnotations;' está presente en los archivos de modelo.",
                  notAchieved: "Falta la declaración 'using' o es incorrecta.",
                },
                {
                  description: "Validaciones completas en propiedades (30%)",
                  achieved:
                    "Todas las propiedades incluyen validaciones apropiadas ([Required], tipo, longitud, etc.) con mensajes de error descriptivos.",
                  notAchieved:
                    "Faltan validaciones, están mal implementadas o los mensajes de error son genéricos.",
                },
                {
                  description: "Scripts de validación (10%)",
                  achieved:
                    "Se añade la sección '@section Scripts' con el partial '_ValidationScriptsPartial' en todas las vistas con formularios.",
                  notAchieved:
                    "Falta la sección Scripts, el partial está mal referenciado o ausente en una o más vistas.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Funcionamiento de validaciones (50%)",
                  achieved:
                    "Los formularios muestran mensajes de error claros con datos inválidos y no permiten el envío hasta que todos los datos son correctos.",
                  notAchieved:
                    "Formularios permiten envío con datos inválidos o los mensajes de error no se muestran.",
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
        "Validación de Entradas (Data Annotations)",
      ],
    },
    {
      title:
        "Secuencia de comandos en sitios cruzados (Cross-site Scripting O XSS)",
      description:
        "Ataque en el que un atacante inyecta scripts maliciosos en un sitio web de confianza, lo que puede provocar el robo de datos y el secuestro de la sesión.",
      recommendations: ["Validación de Entradas (Data Annotations)"],
    },
    {
      title: "Inyección de Datos",
      description:
        "Los atacantes inyectan contenido no fiable como JavaScript malicioso, estilos o imágenes.",
      recommendations: ["Validación de Entradas (Data Annotations)"],
    },
    {
      title: "Acceso No Autorizado",
      description:
        "Usuarios malintencionados pueden intentar acceder a datos confidenciales o realizar acciones para las que no están autorizados, además, el acceso no autorizado a los datos puede dar lugar a violaciones de datos (Data breaches), lo que resulta en una exposición de información confidencial. ",
      recommendations: [
        "Encriptación de datos con la Data protection API",
        "Cifrado de Archivos de Configuración",
      ],
    },
  ],
};
