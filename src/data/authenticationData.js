import MFA from "../assets/MFA.png";
import Cookies from "../assets/Cookies.png";

export const authenticationData = {
  securityMechanismTitle: "Autenticación",
  definition:
    "La autenticación es el proceso mediante el cual se verifica la identidad de un usuario para asegurarse de que es quien dice ser. Se realiza a partir de la comparación de credenciales que están almacenadas en una base de datos, una aplicación, recurso o sistema operativo. De igual manera, se suele emplear los llamados reclamos (claims) lo cual permite agregar información adicional a un usuario como su nombre, dirección de correo, roles y entre otros reclamos",
  interestingFacts: [
    {
      description:
        "La Autenticación de Múltiples Factores (MFA) aumenta la seguridad al requerir dos o más métodos de verificación, como algo que sabes (contraseña), algo que tienes (teléfono) y algo que eres (huella digital).",
      image: MFA,
    },
    {
      description:
        "Los atacantes pueden usan listas de credenciales robadas de otras brechas para intentar iniciar sesión en múltiples sistemas, aprovechando la reutilización de contraseñas por parte de los usuarios.",
      image: Cookies,
    },
  ],

  goodPractices: [
    {
      title: "Autenticación de Dos Factores (2FA)",
      description:
        "Añade una capa adicional de seguridad, ya que exige a los usuarios proporcionar una verificación adicional, normalmente en forma de una contraseña de un solo uso.",
      threats: ["Elevación de Privilegios", "Acceso No Autorizado"],

      recommendation:
        "Esencial para: Cualquier aplicación (MVC, Razor Pages, Web API, Blazor) que maneje cuentas de usuario y datos sensibles. Es un estándar de la industria para la seguridad de cuentas.",

      modalContent: {
        title: "Implementación de 2FA con Google Authenticator",
        practices: [
          {
            title: "1. Añadir Paquetes NuGet Requeridos",
            description:
              "Instalar las dependencias necesarias para validación del lado del cliente, y para la generación y manejo de códigos QR.",
            code: `dotnet add package jQuery.Validation
dotnet add package jQuery
dotnet add package Microsoft.jQuery.Unobtrusive.Validation
dotnet add package QRCoder
dotnet add package ZXing.Net`,
          },
          {
            title: "2. Crear los ViewModels",
            description:
              "Definir los modelos que transportarán los datos entre las vistas y los controladores para el flujo de activación y login con 2FA.",
            code: `// Modelo para la vista de activación de 2FA
public class Enable2FAViewModel
{
    public string? Code { get; set; }
    public string? SecretKey { get; set; }
    public string? QRCodeUrl { get; set; }
}

// Modelo para la vista de login con 2FA
public class LoginWith2FAViewModel
{
    [Required]
    [Display(Name = "Código de autenticador")]
    public required string TwoFactorCode { get; set; }

    [Display(Name = "Recordar este dispositivo")]
    public bool RememberMachine { get; set; }

    public bool RememberMe { get; set; }
    public string? ReturnUrl { get; set; }
}`,
          },
          {
            title: "3. Crear Servicios y Modificar Controlador",
            description:
              "Crear un servicio para manejar la lógica de 2FA (generar QR, validar códigos) e inyectarlo en el controlador de cuentas. Modificar el controlador para añadir los métodos GET y POST para EnableTwoFactor y LoginWith2FA, y ajustar el flujo de Login para que redirija a la configuración o validación de 2FA según corresponda.",
            code: `// Ejemplo de inyección en el controlador
private readonly ITwoFactorAuthenticationService _2faService;

public AccountController(ITwoFactorAuthenticationService 2faService)
{
    _2faService = 2faService;
}

// Lógica del Login modificada
[HttpPost]
public async Task<IActionResult> Login(LoginViewModel model)
{
    // ... lógica de validación de contraseña ...
    var user = await _userManager.FindByEmailAsync(model.Email);
    if (user.TwoFactorEnabled)
    {
        return RedirectToAction("LoginWith2FA");
    }
    // ... resto del flujo ...
}`,
          },
          {
            title: "4. Configurar Servicios en Program.cs",
            description:
              "Registrar el proveedor de tokens personalizado, el servicio de 2FA y habilitar el manejo de sesiones en el contenedor de dependencias de la aplicación.",
            code: `// En Program.cs
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
    options.Tokens.AuthenticatorTokenProvider = "GoogleAuthenticator";
}).AddTokenProvider<GoogleAuthenticatorTokenProvider>("GoogleAuthenticator");

builder.Services.AddScoped<ITwoFactorAuthenticationService, TwoFactorAuthenticationService>();
builder.Services.AddSession();

// ... más abajo ...
app.UseSession();`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Instalación de paquetes Nuget (5%)",
                  achieved:
                    "Todos los paquetes requeridos instalados (jQuery.Validation, jQuery, Microsoft.jQuery.Unobtrusive.Validation, QRCoder, ZXing.Net).",
                  notAchieved:
                    "Faltan paquetes o no están instalados correctamente.",
                },
                {
                  description: "Creación de Modelos (ViewModels) (8%)",
                  achieved:
                    "Enable2FAViewModel y LoginWith2FAViewModel están creados con todas sus propiedades y DataAnnotations correctas.",
                  notAchieved:
                    "Modelos creados pero incompletos, le faltan propiedades o validaciones.",
                },
                {
                  description: "Servicios de Autenticación (10%)",
                  achieved:
                    "Se implementa un servicio para 2FA con su interfaz y un proveedor de tokens personalizado para la lógica de generación de QR y validación.",
                  notAchieved:
                    "Servicios creados pero con funcionalidad incompleta o en una ubicación incorrecta.",
                },
                {
                  description: "Vistas de 2FA (8%)",
                  achieved:
                    "Se crean las vistas para mostrar el QR y para ingresar el código de 6 dígitos, ambas con validación del lado del cliente.",
                  notAchieved:
                    "Vistas creadas pero faltan campos, validaciones o no son funcionales.",
                },
                {
                  description: "Crear métodos 2FA en Controlador (10%)",
                  achieved:
                    "Existen los métodos EnableTwoFactor (GET/POST) y LoginWith2FA (GET/POST) con su lógica completa y manejo de errores.",
                  notAchieved:
                    "Faltan métodos o fueron creados con lógica incompleta o errónea. No implementa manejo de errores.",
                },
                {
                  description: "Modificación de flujo de login y registro (4%)",
                  achieved:
                    "El login verifica si 2FA está activo y redirige correctamente. El registro redirige al login.",
                  notAchieved:
                    "Redirecciones implementadas con errores en el flujo o no hay validación de 2FA en login.",
                },
                {
                  description: "Configuración Program.cs (5%)",
                  achieved:
                    "AddIdentity está configurado con el proveedor de tokens, y los servicios de sesión están registrados y en uso.",
                  notAchieved:
                    "Configuración incorrecta o incompleta en Program.cs.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Verificación de Base de Datos (15%)",
                  achieved:
                    "El campo TwoFactorEnabled en la tabla de usuarios se actualiza a true tras una activación exitosa.",
                  notAchieved:
                    "TwoFactorEnabled no se actualiza o los datos no persisten.",
                },
                {
                  description: "Flujo de Activación 2FA (15%)",
                  achieved:
                    "El flujo completo desde un nuevo usuario hasta la activación de 2FA funciona sin errores. El código QR es válido y aceptado por la app autenticadora.",
                  notAchieved:
                    "El flujo no redirige correctamente o falla la activación.",
                },
                {
                  description: "Validación de Código 2FA (10%)",
                  achieved:
                    "Un usuario con 2FA activo es forzado a ingresar un código válido para acceder. Un código incorrecto muestra un error y bloquea el acceso.",
                  notAchieved:
                    "La validación no funciona o permite el acceso sin un código válido.",
                },
                {
                  description: "Rotación de códigos (10%)",
                  achieved:
                    "Los códigos de la app autenticadora cambian periódicamente (ej. 30s) y el sistema rechaza correctamente los códigos ya expirados.",
                  notAchieved:
                    "El sistema acepta códigos expirados o no verifica su ventana de tiempo.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Implementación y Protección de JWT",
      description:
        "Utiliza algoritmos de firma fuerte (RS256 con cifrado de clave privada/pública). Son tokens de sesión de corta duración con políticas de caducidad seguras para minimizar el secuestro de sesiones.",
      threats: [
        "Manipulación de Token",
        "Elevación de Privilegios",
        "Acceso No Autorizado",
      ],

      recommendation:
        "Estándar para: Web API que necesitan autenticación sin estado, especialmente si son consumidas por SPAs (React, Angular, Vue).",
      warning:
        "Almacenar JWTs en el localStorage del navegador puede exponerlos a ataques XSS. Considere usar cookies HttpOnly para almacenar los tokens de forma más segura o implementar medidas de mitigación de XSS robustas.",

      modalContent: {
        title: "Implementación Segura de JSON Web Tokens (JWT)",
        practices: [
          {
            title: "1. Configurar Autenticación JWT",
            description:
              "En appsettings.json, definir una clave secreta segura, emisor y audiencia. Luego, en Program.cs, registrar el servicio de autenticación JWT, configurando los parámetros de validación del token.",
            code: `// En appsettings.json
"Jwt": {
  "Key": "UNA_CLAVE_SECRETA_MUY_LARGA_Y_SEGURA_DE_MAS_DE_32_BYTES",
  "Issuer": "https://tu-dominio.com",
  "Audience": "https://tu-api.com"
}

// En Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });`,
            postCodeText:
              "Recuerda instalar el paquete Microsoft.AspNetCore.Authentication.JwtBearer.",
          },
          {
            title: "2. Generar y Firmar Token en el Login",
            description:
              "En el endpoint de login, tras verificar las credenciales, generar un token con los claims necesarios (como ID de usuario y roles) y firmarlo con la clave secreta.",
            code: `// En el controlador de Autenticación
var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

var claims = new[] { new Claim(JwtRegisteredClaimNames.Sub, user.Id) };

var token = new JwtSecurityToken(
    issuer: _config["Jwt:Issuer"],
    audience: _config["Jwt:Audience"],
    claims: claims,
    expires: DateTime.Now.AddMinutes(30),
    signingCredentials: credentials);

return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });`,
          },
          {
            title: "3. Proteger Rutas y Activar Middleware",
            description:
              "Proteger los controladores o acciones de la API con el atributo [Authorize]. Finalmente, activar el middleware de autenticación y autorización en Program.cs.",
            code: `// En un controlador
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProtectedController : ControllerBase { ... }

// En Program.cs, antes de app.MapControllers();
app.UseAuthentication();
app.UseAuthorization();`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Configuración de backend (20%)",
                  achieved:
                    "Jwt:Key, Issuer, Audience presentes en la configuración; AddJwtBearer configurado con todos los TokenValidationParameters habilitados.",
                  notAchieved:
                    "Falta key/issuer/audience o las validaciones del token están desactivadas.",
                },
                {
                  description: "Emisión del token (10%)",
                  achieved:
                    'El endpoint de login devuelve una respuesta JSON con el token ( { token: "..." } ) y este contiene los claims esperados.',
                  notAchieved:
                    "La respuesta no contiene el token o su formato es incorrecto.",
                },
                {
                  description: "Envío desde frontend (10%)",
                  achieved:
                    "El cliente (frontend) incluye el encabezado Authorization: Bearer <token> en las llamadas a endpoints protegidos.",
                  notAchieved:
                    "El token no se adjunta en los encabezados de las solicitudes.",
                },
                {
                  description: "Protección de endpoints (10%)",
                  achieved:
                    "Los endpoints sensibles están protegidos con [Authorize] y responden con un código de estado 401 si no se provee un token válido.",
                  notAchieved:
                    "Las rutas no están protegidas o devuelven un código 200 sin un token válido.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Firma y validación (50%)",
                  achieved:
                    "La clave secreta (Jwt:Key) tiene 32 bytes o más. Si el payload del token se modifica externamente, la validación de la firma falla y el token es rechazado.",
                  notAchieved:
                    "La clave secreta es corta, las validaciones están desactivadas o la manipulación del token no es detectada.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "ASP.NET Core Identity",
      description:
        "Usar ASP.NET Core Identiy proporciona un marco sólido para gestionar usuarios, contraseñas, acceso basado en funciones y autorización basado en reclamaciones.",
      threats: ["Elevación de Privilegios", "Acceso No Autorizado"],

      modalContent: {
        title: "Implementación de ASP.NET Core Identity",
        practices: [
          {
            title: "1. Añadir Paquetes NuGet",
            description:
              "Agregar las referencias de paquetes de Entity Framework Core e Identity al archivo .csproj del proyecto.",
            code: `<ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="8.0.8" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.8" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.8">
        <PrivateAssets>all</PrivateAssets>
        <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
</ItemGroup>`,
          },
          {
            title: "2. Crear el Contexto de Base de Datos",
            description:
              "Crear una clase ApplicationDbContext que herede de IdentityDbContext para que Entity Framework pueda gestionar las tablas de Identity.",
            code: `using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace YourProject.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    }
}`,
          },
          {
            title: "3. Configurar Servicios en Program.cs",
            description:
              "Registrar el DbContext, configurar el servicio de Identity con políticas de contraseña y bloqueo, y configurar las cookies de autenticación.",
            code: `// Registrar DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configurar Cookies
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.AccessDeniedPath = "/Home/AccessDenied";
});`,
          },
          {
            title: "4. Implementar Lógica en el Controlador",
            description:
              "Inyectar SignInManager y UserManager en el controlador de cuentas y usarlos para implementar la lógica de registro, inicio y cierre de sesión.",
            code: `private readonly SignInManager<IdentityUser> _signInManager;
private readonly UserManager<IdentityUser> _userManager;

public AccountController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
{
    _signInManager = signInManager;
    _userManager = userManager;
}

// Ejemplo de Login
[HttpPost]
public async Task<IActionResult> Login(LoginViewModel model)
{
    if (ModelState.IsValid)
    {
        var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, true);
        if (result.Succeeded) { return RedirectToAction("Index", "Home"); }
        if (result.IsLockedOut) { /* ... */ }
        ModelState.AddModelError(string.Empty, "Credenciales inválidas");
    }
    return View(model);
}`,
          },
          {
            title: "5. Crear y Aplicar Migraciones",
            description:
              "Usar la CLI de Entity Framework para generar las migraciones que crearán el esquema de base de datos de Identity y luego aplicarlas a la base de datos.",
            code: `dotnet ef migrations add InitialCreate
dotnet ef database update`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Agregar paquetes NuGet (10%)",
                  achieved:
                    "Se agregaron correctamente los paquetes de Identity y Entity Framework Core en el archivo .csproj.",
                  notAchieved:
                    "No se agregaron los paquetes necesarios, faltan paquetes o sus versiones son incorrectas.",
                },
                {
                  description: "Configurar base de datos (10%)",
                  achieved:
                    "Se creó la clase ApplicationDbContext, hereda de IdentityDbContext y se configuró la cadena de conexión en appsettings.json.",
                  notAchieved:
                    "No se creó ApplicationDbContext, no hereda de IdentityDbContext, o la cadena de conexión es incorrecta.",
                },
                {
                  description: "Configurar servicios en Program.cs (10%)",
                  achieved:
                    "Se registró DbContext, se configuró AddIdentity con políticas y se configuraron las cookies de autenticación.",
                  notAchieved:
                    "No se registraron los servicios de Identity, falta configuración de DbContext o cookies.",
                },
                {
                  description: "Agregar lógica a controladores (10%)",
                  achieved:
                    "Se inyectaron SignInManager y UserManager y se implementó la lógica de login, registro y logout usando Identity.",
                  notAchieved:
                    "No se inyectaron las dependencias, falta lógica de autenticación o no se manejan errores.",
                },
                {
                  description: "Generar y aplicar migraciones (10%)",
                  achieved:
                    "Se ejecutaron correctamente los comandos de migraciones 'add' y 'update', creando las tablas de Identity.",
                  notAchieved:
                    "No se generaron las migraciones, fallaron los comandos, o no se crearon las tablas.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Hasheo de contraseñas (25%)",
                  achieved:
                    "Las contraseñas se almacenan hasheadas en la tabla AspNetUsers, no son visibles en texto plano.",
                  notAchieved:
                    "Las contraseñas se almacenan en texto plano o no se utiliza el sistema de hash de Identity.",
                },
                {
                  description: "Limitación de intentos (25%)",
                  achieved:
                    "Tras 5 intentos fallidos, la cuenta se bloquea por el tiempo configurado y el bloqueo persiste.",
                  notAchieved:
                    "La cuenta no se bloquea tras 5 intentos fallidos o el bloqueo no es persistente.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Limitación de Tasa de Solicitudes (Rate Limiting)",
      description:
        "Ayuda a mitigar los ataques de fuerza bruta y DoS limitando el número de peticiones desde una IP específica ",
      threats: ["Denial of service o DoS", "Ataques de Fuerza Bruta"],
      recommendation:
        "Muy recomendado para: Endpoints públicos y sensibles de una Web API, como el de login, registro o cualquier otro que sea computacionalmente costoso.",
      warning:
        "Una política de limitación demasiado estricta puede impactar negativamente la experiencia de usuario o bloquear a clientes legítimos.",
      modalContent: {
        title: "Implementación de Rate Limiting",
        practices: [
          {
            title: "1. Configurar Políticas en Program.cs",
            description:
              "Registrar el servicio AddRateLimiter y definir políticas. Existen diferentes tipos de particiones (ej. por IP) para endpoints específicos o la global para el resto de la API.",
            code: `builder.Services.AddRateLimiter(options =>
{
    // Política "PerIP": Limita a 10 peticiones por minuto POR CADA IP.
    // Usa 'RateLimitPartition.GetFixedWindowLimiter' para particionar por IP.
    options.AddPolicy("PerIP", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 2 // Pone en cola 2 peticiones antes de rechazar
            }));

    // Política "Global": Limita a 100 peticiones por minuto PARA TODA LA API.
    // Esta política se aplica a todos los endpoints que no tengan una propia.
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter("Global",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));
    
    // Opcional: Define una respuesta JSON personalizada cuando se rechaza una petición.
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsJsonAsync(
            new { error = "Límite de peticiones excedido" }, token);
    };
});`,
          },
          {
            title: "2. Activar el Middleware",
            description:
              "Activar el middleware de Rate Limiter en el pipeline (después de UseRouting y UseCors, pero antes de UseAuthentication y UseAuthorization).",
            code: `// ...
app.UseRouting();
app.UseCors(); 

app.UseRateLimiter(); 

app.UseAuthentication();
app.UseAuthorization();`,
          },
          {
            title: "3. Aplicar Políticas a Endpoints",
            description:
              "Puedes aplicar políticas a controladores usando el atributo [EnableRateLimiting] o a Minimal APIs usando .RequireRateLimiting().",
            code: `// 1. Para Controladores 
[ApiController]
public class AccountController : ControllerBase
{
    // Aplica la política "PerIP" solo a este endpoint de login
    [HttpPost("login")]
    [EnableRateLimiting("PerIP")]
    public IActionResult Login(...) { ... }
    
    // Este endpoint usará la política "Global" por defecto
    [HttpGet("perfil")]
    public IActionResult GetProfile(...) { ... }
    
    // Desactiva cualquier límite para este endpoint
    [HttpGet("salud")]
    [DisableRateLimiting]
    public IActionResult GetHealth(...) { ... }
}

// 2. Para Minimal APIs 
app.MapGet("/api/data", () => "Some data")
   .RequireRateLimiting("PerIP");`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Configuración de políticas (25%)",
                  achieved:
                    "Se implementa al menos una política de limitación (global o particionada por IP) correctamente en Program.cs.",
                  notAchieved:
                    "No existe limitación o la configuración es incompleta/incorrecta.",
                },
                {
                  description: "Aplicación en endpoints (25%)",
                  achieved:
                    "Los endpoints sensibles están protegidos con [EnableRateLimiting] o .RequireRateLimiting(). El middleware UseRateLimiter está registrado.",
                  notAchieved:
                    "Endpoints no están protegidos o el middleware UseRateLimiter falta en el pipeline.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Mitigación de abuso de solicitudes (50%)",
                  achieved:
                    "La API devuelve un código de estado 429 (Too Many Requests) cuando se excede el límite de solicitudes.",
                  notAchieved:
                    "Sin limitación, un cliente puede saturar indefinidamente el servicio.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Límite de Tamaño de Solicitud",
      description:
        "Ayuda a evitar ataques de denegación de servicio (DoS) limitando el tamaño del cuerpo de la petición.",
      threats: ["Denial of service o DoS"],

      recommendation:
        "Esencial para: Cualquier tipo de aplicación (MVC, Web API) que exponga endpoints que permitan la subida de archivos o la recepción de cuerpos de solicitud de gran tamaño.",

      modalContent: {
        title: "Configuración de Límites de Tamaño de Solicitud",
        practices: [
          {
            title: "1. Configuración Global",
            description:
              "Establecer límites para el tamaño de los cuerpos de formularios y multipartes de forma global para toda la aplicación en Program.cs.",
            code: `using Microsoft.AspNetCore.Http.Features;

builder.Services.Configure<FormOptions>(options =>
{
    // Límite para subida de archivos (ej. 10 MB)
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; 
});`,
          },
          {
            title: "2. Configuración por Endpoint",
            description:
              "Utilizar el atributo [RequestSizeLimit] directamente en una acción de controlador para anular la configuración global y establecer un límite específico.",
            code: `[HttpPost("upload-large-file")]
// Límite específico para este endpoint (ej. 100 MB)
[RequestSizeLimit(100 * 1024 * 1024)]
public IActionResult UploadLargeFile(IFormFile file)
{
    // ... Lógica para procesar el archivo ...
    return Ok();
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Configuración de políticas globales (25%)",
                  achieved:
                    "Se establece un límite global razonable para el tamaño de las solicitudes (ej. MultipartBodyLengthLimit).",
                  notAchieved:
                    "No se configuran límites, dejando el tamaño por defecto o ilimitado.",
                },
                {
                  description: "Configuración por endpoint (25%)",
                  achieved:
                    "Se usa el atributo [RequestSizeLimit] en acciones de controlador que manejan subidas de archivos.",
                  notAchieved:
                    "No se restringe el tamaño en endpoints de subida, permitiendo archivos excesivamente grandes.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Mitigación de payloads excesivos (50%)",
                  achieved:
                    "La API devuelve un código de estado 413 (Payload Too Large) al intentar subir un archivo que excede el límite configurado.",
                  notAchieved:
                    "Archivos demasiado grandes son aceptados y procesados, exponiendo al servidor a agotamiento de memoria o disco.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Integración de Proveedores Externos (OAuth 2.0 / OpenID)",
      description:
        "Aprovechar OAuth2 y OpenID para la autenticación externa, ya que estos protocolos presentan métodos seguros para la autenticación y autorización de usuarios y así se pueden integrar proveedores de inicio de sesión como Google.",
      threats: ["Acceso No Autorizado"],
      warning:
        "La URI de redirección (ejemplo, /signin-google) es extremadamente sensible. Debe estar registrada (con HTTPS en producción) en la consola del proveedor. Un error aquí permitirá que un atacante intercepte el código de autorización.",
      modalContent: {
        title: "Implementación de 'Iniciar Sesión con Google'",
        practices: [
          {
            title: "1. Registrar la Aplicación en el Proveedor Externo",
            description:
              "Antes de escribir código, debes ir a la consola del proveedor (ej. Google Cloud Console). Allí, debes crear un nuevo ID de cliente de OAuth, configurar la pantalla de consentimiento y, lo más importante, registrar tus URIs de redireccionamiento autorizados (ej. https://localhost:PUERTO/signin-google). Al final, el proveedor te dará un ID de Cliente y un Secreto de Cliente.",
            code: "/* Pasos en Google Cloud Console: \n 1. Ir a 'APIS y Servicios' -> 'Credenciales'.\n 2. 'Crear credenciales' -> 'ID de cliente de OAuth'.\n 3. Seleccionar 'Aplicación web'.\n 4. Añadir URI: https://localhost:PUERTO/signin-google \n 5. Guardar el ID de Cliente y el Secreto. */",
          },
          {
            title: "2. Almacenar Secretos de Cliente",
            description:
              "Añade el ID de Cliente y el Secreto de Cliente a tu configuración. Es altamente recomendable usar el Secret Manager (Manejador de Secretos) para esto y no ponerlos en texto plano en appsettings.json.",
            code: `// En appsettings.json o (preferiblemente) secrets.json
"Authentication": {
  "Google": {
    "ClientId": "TU_ID_DE_CLIENTE_VA_AQUI",
    "ClientSecret": "TU_SECRETO_DE_CLIENTE_VA_AQUI"
  }
}`,
          },
          {
            title: "3. Añadir Proveedor de Autenticación en Program.cs",
            description:
              "En Program.cs, encadena el servicio del proveedor (ej. AddGoogle) después de AddIdentity. Esto le enseña a ASP.NET Core Identity cómo comunicarse con Google, leyendo los secretos desde la configuración.",
            code: `// Se asume que AddIdentity ya fue llamado
builder.Services.AddAuthentication()
   .AddGoogle(googleOptions =>
   {
      googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
      googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
   });`,
          },
          {
            title: "4. Modificar la Vista de Login",
            description:
              'En tu vista Login.cshtml, añade un formulario que apunte a la acción ExternalLogin del AccountController. Cada botón debe tener name="provider" y value con el nombre del proveedor (ej. Google).',
            code: `<form asp-controller="Account" asp-action="ExternalLogin" asp-route-returnUrl="@ViewData["ReturnUrl"]" method="post" class="oauth-form">
  <div class="oauth-buttons">
    <button type="submit" name="provider" value="Google" class="btn btn-oauth btn-google w-100">
      <svg...>...</svg> Google
    </button>
  </div>
</form>`,
          },
          {
            title: "5. Implementar Lógica del Controlador",
            description:
              "Asegúrate de que tu AccountController (el que provee Identity) tenga las acciones ExternalLogin (POST) y ExternalLoginCallback (GET). ExternalLogin inicia el desafío y redirige al usuario a Google, y ExternalLoginCallback maneja la respuesta de Google.",
            code: `// En AccountController.cs
[HttpPost]
public IActionResult ExternalLogin(string provider, string returnUrl = null)
{
    // Genera la URL de redirección a la que Google debe volver
    var redirectUrl = Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl });
    var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
    // Redirige al usuario a Google
    return new ChallengeResult(provider, properties);
}

[HttpGet]
public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
{
    // Maneja la respuesta de Google
    var info = await _signInManager.GetExternalLoginInfoAsync();
    if (info == null)
    {
        // Error
        return RedirectToAction("Login");
    }

    // Intenta iniciar sesión con el proveedor externo
    var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
    
    if (result.Succeeded)
    {
        // El usuario ya existe y se logueó
        return LocalRedirect(returnUrl ?? "/");
    }
    else
    {
        // El usuario es nuevo, se debe crear la cuenta
        // ... (lógica para crear un nuevo IdentityUser sin contraseña) ...
    }
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación técnica (50%)",
              criteria: [
                {
                  description: "Configuración de vista y controlador (15%)",
                  achieved:
                    "La vista de Login contiene un formulario con método POST hacia la acción de login externo, incluyendo botones para los proveedores de autenticación configurados. El controlador tiene implementados los métodos de inicio de sesión externa (POST) y callback (GET) con los atributos de autorización apropiados.",
                  notAchieved:
                    "La vista no tiene el formulario de autenticación externa, los botones están mal configurados, o los métodos del controlador están ausentes, incompletos o sin los atributos necesarios.",
                },
                {
                  description:
                    "Configuración de autenticación en la aplicación (Program.cs) (20%)",
                  achieved:
                    "La aplicación tiene configurado correctamente el servicio de autenticación con el proveedor OAuth/OpenID seleccionado, obteniendo las credenciales desde configuración externa (no hardcodeadas). El middleware de autenticación está correctamente posicionado en el pipeline, despues de Identity.",
                  notAchieved:
                    "Falta la configuración del proveedor de autenticación, las credenciales están hardcodeadas en el código, o el orden del middleware es incorrecto causando errores de autenticación.",
                },
                {
                  description: "Configuración en consola del proveedor (15%)",
                  achieved:
                    "Se creó y configuró correctamente una aplicación en la consola del proveedor de identidad, se configuró la pantalla de consentimiento, se generaron las credenciales necesarias, se agregaron los orígenes autorizados y las URIs de redirección correctamente, y se obtuvieron las credenciales del cliente.",
                  notAchieved:
                    "La configuración en la consola del proveedor está incompleta, las URIs de redirección no coinciden con la aplicación, falta la pantalla de consentimiento, o no se generaron correctamente las credenciales.",
                },
              ],
            },
            {
              title: "Efectividad en seguridad (50%)",
              criteria: [
                {
                  description: "Protección de credenciales (25%)",
                  achieved:
                    "Registrar un nuevo usuario usando OAuth y verificar en la bd en la tabla AspNetUsers que la columna PasswordHash es NULL o esta vacía para el usuario nuevo, y existe el usuario en AspNetUserLogins.",
                  notAchieved:
                    "No aparece el nuevo usuario registrado en la bd.",
                },
                {
                  description: "Flujo de autorización seguro (25%)",
                  achieved:
                    "Iniciar sesión con OAuth, en las herramientas del navegador (Network) los endpoint de OAuth (authClient y consentAuthUser) son https e incluye en la URL el parámetro state=code, el cual cambia en cada sesión.",
                  notAchieved:
                    "Alguna parte del flujo de OAuth usa http, falta el parámetro state o es constante y no cambia.",
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
      title: "Elevación de Privilegios",
      description:
        "Amenaza en la que por algún medio se logra cambiar los privilegios asignados a un usuario para que sea capaz de obtener los privilegios más altos en la aplicación, como los de un administrador.",
      recommendations: [
        "Implementación y Protección de JWT",
        "ASP.NET Core Identity",
        "Autenticación de Dos Factores (2FA)",
      ],
    },
    {
      title: "Acceso No Autorizado",
      description:
        "Usuarios malintencionados pueden intentar acceder a datos confidenciales o realizar acciones para las que no están autorizados, además, el acceso no autorizado a los datos puede dar lugar a violaciones de datos (Data breaches), lo que resulta en una exposición de información confidencial.",
      recommendations: [
        "ASP.NET Core Identity",
        "Autenticación de Dos Factores (2FA)",
        "Implementación y Protección de JWT",
        "Integración de Proveedores Externos (OAuth 2.0 / OpenID)",
      ],
    },
    {
      title: "Denegación de servicios (Denial of service o DoS)",
      description:
        "Los atacantes pueden saturar una API enviando un gran número de solicitudes, provocando que se vuelva lento o no responda el servidor.",
      recommendations: [
        "Limitación de Tasa de Solicitudes (Rate Limiting)",
        "Límite de Tamaño de Solicitud",
      ],
    },
    {
      title: "Manipulación de Token",
      description:
        "Un atacante intercepta y modifica el contenido (payload) de un token de autenticación para escalar privilegios o suplantar la identidad de otro usuario. Se previene con firmas digitales robustas.",
      recommendations: ["Implementación y Protección de JWT"],
    },
  ],
};
