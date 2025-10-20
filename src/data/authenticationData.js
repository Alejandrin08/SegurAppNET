import MFA from "../assets/MFA.png";
import Cookies from "../assets/Cookies.png";

export const authenticationData = {
  securityMechanismTitle: "Autenticación",
  definition:
    "La autenticación es el proceso de verificar la identidad de un usuario o sistema. En las aplicaciones web, esto garantiza que solo las entidades autorizadas puedan acceder a recursos protegidos, típicamente mediante credenciales como un nombre de usuario y una contraseña.",
  interestingFacts: [
    {
      description:
        "La Autenticación de Múltiples Factores (MFA) aumenta la seguridad al requerir dos o más métodos de verificación, como algo que sabes (contraseña), algo que tienes (teléfono) y algo que eres (huella digital).",
      image: MFA,
    },
    {
      description:
        "Los ataques de 'Credential Stuffing' son una de las amenazas más comunes. Los atacantes usan listas de credenciales robadas de otras brechas para intentar iniciar sesión en múltiples sistemas, aprovechando la reutilización de contraseñas por parte de los usuarios.",
      image: Cookies,
    },
  ],

  goodPractices: [
    {
      title: "Autenticación de Dos Factores (2FA)",
      description:
        "Implementar un segundo paso de verificación (generalmente un código de un solo uso basado en tiempo, TOTP) después del login con contraseña. Esto protege las cuentas incluso si la contraseña es comprometida.",
      threats: ["Elevación de Privilegios", "Acceso No Autorizado"],

      recommendation:
        "Esencial para: Cualquier aplicación (MVC, Razor Pages, Web API, Blazor) que maneje cuentas de usuario y datos sensibles. Es un estándar de la industria para la seguridad de cuentas.",
      warning:
        "Es crucial implementar un mecanismo de recuperación de cuentas (códigos de respaldo) para evitar que los usuarios queden permanentemente bloqueados si pierden su dispositivo de autenticación.",

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
              "Crear un servicio para manejar la lógica de 2FA (generar QR, validar códigos) e inyectarlo en el controlador de cuentas. Modificar el controlador para añadir los métodos GET y POST para 'EnableTwoFactor' y 'LoginWith2FA', y ajustar el flujo de Login para que redirija a la configuración o validación de 2FA según corresponda.",
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
              title: "Implementación correcta (50%)",
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
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Verificación de Base de Datos (15%)",
                  achieved:
                    "El campo 'TwoFactorEnabled' en la tabla de usuarios se actualiza a 'true' tras una activación exitosa.",
                  notAchieved:
                    "'TwoFactorEnabled' no se actualiza o los datos no persisten.",
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
      title: "Validación de Entradas (Data Annotations)",
      description:
        "Validar todos los datos que provienen del cliente en el lado del servidor para asegurar su integridad, formato y longitud. Las 'Data Annotations' en los modelos son la primera línea de defensa contra datos maliciosos o malformados.",
      threats: ["Inyección de Datos"],

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
    {
      title: "Razor Page: Uso de AuthorizeView",
      description:
        "Utilizar el componente <AuthorizeView> en aplicaciones Blazor y Razor para mostrar u ocultar elementos de la interfaz de usuario de forma declarativa, basándose en el estado de autenticación del usuario.",
      threats: ["Acceso No Autorizado"],

      recommendation:
        "Específico para: Aplicaciones Blazor (Server y WebAssembly) y cualquier proyecto que utilice Razor Components. Es el método idiomático para la UI condicional en estos frameworks.",
      warning:
        "Este componente solo oculta elementos en la UI. No protege los endpoints de la API que esos elementos puedan llamar. La protección de los datos y la lógica de negocio debe hacerse en el backend con el atributo [Authorize].",

      modalContent: {
        title: "Uso de AuthorizeView para UI Dinámica",
        practices: [
          {
            title: "1. Modificar Vistas con <AuthorizeView>",
            description:
              "Envolver la lógica de la interfaz de usuario que depende del estado de autenticación dentro de las etiquetas <Authorized> y <NotAuthorized>.",
            code: `<AuthorizeView>
    <Authorized>
        <span class="me-3">Hola, @context.User.Identity?.Name!</span>
        <form method="post" action="/Account/Logout">
            <button type="submit" class="btn btn-link">Log out</button>
        </form>
    </Authorized>
    <NotAuthorized>
        <NavLink class="btn btn-link" href="/Account/Register">Register</NavLink>
        <NavLink class="btn btn-link" href="/Account/Login">Login</NavLink>
    </NotAuthorized>
</AuthorizeView>`,
          },
          {
            title: "2. Configurar App.razor",
            description:
              "Envolver el componente <Routes /> con <CascadingAuthenticationState> para propagar el estado de autenticación a todos los componentes descendientes.",
            code: `<body>
    <CascadingAuthenticationState>
        <Routes />
    </CascadingAuthenticationState>
    <script src="_framework/blazor.web.js"></script>
</body>`,
          },
          {
            title: "3. Añadir using en _Imports.razor",
            description:
              "Importar el namespace de autorización para que los componentes relacionados con la autenticación estén disponibles en todas las vistas.",
            code: `@using Microsoft.AspNetCore.Components.Authorization`,
          },
          {
            title: "4. Registrar Servicios en Program.cs",
            description:
              "Añadir los servicios necesarios para el núcleo de autorización y el estado de autenticación en cascada en la configuración de la aplicación.",
            code: `builder.Services.AddAuthorizationCore();
builder.Services.AddCascadingAuthenticationState();`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Uso de etiquetas <AuthorizeView> (15%)",
                  achieved:
                    "Se usa correctamente <AuthorizeView> con sus secciones <Authorized> y <NotAuthorized>, y se eliminó lógica de autenticación manual anterior si existía.",
                  notAchieved:
                    "Se omite la etiqueta <AuthorizeView>, está incompleta, o la lógica de autenticación anterior no fue eliminada.",
                },
                {
                  description: "Configuración de App.razor (20%)",
                  achieved:
                    "Se agregó <CascadingAuthenticationState> envolviendo correctamente a <Routes />.",
                  notAchieved:
                    "Se omitió <CascadingAuthenticationState> o está mal posicionado.",
                },
                {
                  description:
                    "Configuración de _Imports.razor y Program.cs (15%)",
                  achieved:
                    "Se agregó la directiva @using en _Imports.razor y se registraron los servicios AddAuthorizationCore() y AddCascadingAuthenticationState() en Program.cs.",
                  notAchieved:
                    "Se omitió la directiva de importación o los servicios no fueron registrados correctamente.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Verificación de Sesión Autenticada (25%)",
                  achieved:
                    "Al iniciar sesión, el usuario es reconocido como autenticado y no se puede acceder a datos protegidos sin una sesión válida.",
                  notAchieved:
                    "El usuario no es reconocido como autenticado tras iniciar sesión o se puede acceder a datos protegidos sin autenticación.",
                },
                {
                  description:
                    "Cambio Dinámico de Menú según Autenticación (25%)",
                  achieved:
                    "La interfaz cambia correctamente para mostrar opciones de usuario autenticado o no autenticado de forma inmediata.",
                  notAchieved:
                    "El menú no cambia al autenticarse o desautenticarse, mostrando opciones contradictorias.",
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
        "Utilizar JSON Web Tokens (JWT) para la autenticación sin estado en APIs, donde el cliente envía un token firmado en cada solicitud para verificar su identidad y permisos.",
      threats: [
        "Manipulación de Token",
        "Elevación de Privilegios",
        "Acceso No Autorizado",
      ],

      recommendation:
        "Estándar para: Web API que necesitan autenticación sin estado, especialmente si son consumidas por SPAs (React, Angular, Vue) o aplicaciones móviles.",
      warning:
        "Almacenar JWTs en el `localStorage` del navegador puede exponerlos a ataques XSS. Considere usar cookies `HttpOnly` para almacenar los tokens de forma más segura o implementar medidas de mitigación de XSS robustas.",

      modalContent: {
        title: "Implementación Segura de JSON Web Tokens (JWT)",
        practices: [
          {
            title: "1. Configurar Autenticación JWT",
            description:
              "En `appsettings.json`, definir una clave secreta segura, emisor y audiencia. Luego, en `Program.cs`, registrar el servicio de autenticación JWT, configurando los parámetros de validación del token.",
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
          },
          {
            title: "2. Generar y Firmar Token en el Login",
            description:
              "En el endpoint de login, tras verificar las credenciales, generar un token con los 'claims' necesarios (como ID de usuario y roles) y firmarlo con la clave secreta.",
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
              "Proteger los controladores o acciones de la API con el atributo [Authorize]. Finalmente, activar el middleware de autenticación y autorización en `Program.cs`.",
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
              title: "Implementación correcta (50%)",
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
                    "El cliente (frontend) incluye el encabezado 'Authorization: Bearer <token>' en las llamadas a endpoints protegidos.",
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
              title: "Prevención de vulnerabilidades (50%)",
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
        "Utilizar el framework integrado de ASP.NET Core para manejar la autenticación y gestión de usuarios, incluyendo registro, login, roles y almacenamiento seguro de contraseñas.",
      threats: ["Elevación de Privilegios", "Acceso No Autorizado"],

      recommendation:
        "La base para: La mayoría de las aplicaciones ASP.NET Core (MVC, Razor Pages, Blazor Server) que requieren un sistema de cuentas de usuario. Proporciona una solución completa y segura lista para usar.",
      warning:
        "La configuración por defecto es segura, pero debe ser revisada. Ajuste las políticas de complejidad de contraseñas y los parámetros de bloqueo de cuentas (`Lockout`) según los requisitos de seguridad de su aplicación.",

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
              "Crear una clase `ApplicationDbContext` que herede de `IdentityDbContext` para que Entity Framework pueda gestionar las tablas de Identity.",
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
              "Inyectar `SignInManager` y `UserManager` en el controlador de cuentas y usarlos para implementar la lógica de registro, inicio y cierre de sesión.",
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
              title: "Implementación correcta (50%)",
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
              title: "Prevención de vulnerabilidades (50%)",
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
        "Restringir la cantidad de solicitudes que un cliente puede realizar a un endpoint en un período de tiempo determinado, previniendo abusos y ataques de fuerza bruta o denegación de servicio.",
      threats: ["Acceso No Autorizado"],

      recommendation:
        "Muy recomendado para: Endpoints públicos y sensibles de una Web API, como el de login, registro o cualquier otro que sea computacionalmente costoso.",
      warning:
        "Una política de limitación demasiado estricta puede impactar negativamente la experiencia de usuario o bloquear a clientes legítimos. Monitoree y ajuste los límites según el tráfico real de su aplicación.",

      modalContent: {
        title: "Implementación de Rate Limiting",
        practices: [
          {
            title: "1. Configurar Políticas en Program.cs",
            description:
              "Registrar el servicio de Rate Limiter y definir políticas, como una limitación global o una política específica por dirección IP.",
            code: `builder.Services.AddRateLimiter(options =>
{
    // Política que limita a 10 peticiones por minuto por IP
    options.AddFixedWindowLimiter(policyName: "PerIP", options =>
    {
        options.PermitLimit = 10;
        options.Window = TimeSpan.FromMinutes(1);
        options.QueueLimit = 0;
    });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});`,
          },
          {
            title: "2. Aplicar Políticas en Endpoints y Middleware",
            description:
              "Activar el middleware de Rate Limiter en el pipeline y aplicar las políticas definidas a endpoints específicos usando `.RequireRateLimiting()`.",
            code: `// Activar el middleware
app.UseRateLimiter();

// Aplicar política a un endpoint específico
app.MapGet("/api/data", () => "Some data")
   .RequireRateLimiting("PerIP");`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Configuración de políticas (25%)",
                  achieved:
                    "Se implementa una política de limitación (global o por IP) correctamente en Program.cs.",
                  notAchieved:
                    "No existe limitación o la configuración es incompleta.",
                },
                {
                  description: "Aplicación en endpoints (25%)",
                  achieved:
                    "Los endpoints sensibles están protegidos con `.RequireRateLimiting()` o una política global.",
                  notAchieved:
                    "Endpoints no están protegidos o no responden correctamente tras superar el límite.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
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
        "Establecer un tamaño máximo para las solicitudes entrantes y sus cuerpos (payloads) para prevenir ataques de denegación de servicio por agotamiento de recursos del servidor.",
      threats: ["Acceso No Autorizado"],

      recommendation:
        "Esencial para: Cualquier tipo de aplicación (MVC, Web API) que exponga endpoints que permitan la subida de archivos o la recepción de cuerpos de solicitud de gran tamaño.",
      warning:
        "Un límite global demasiado bajo puede romper funcionalidades legítimas de la aplicación. Es preferible establecer un límite global conservador y usar el atributo `[RequestSizeLimit]` para aumentar el límite solo en los endpoints que específicamente lo necesiten.",

      modalContent: {
        title: "Configuración de Límites de Tamaño de Solicitud",
        practices: [
          {
            title: "1. Configuración Global",
            description:
              "Establecer límites para el tamaño de los cuerpos de formularios y multipartes de forma global para toda la aplicación en `Program.cs`.",
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
              "Utilizar el atributo `[RequestSizeLimit]` directamente en una acción de controlador para anular la configuración global y establecer un límite específico.",
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
              title: "Implementación correcta (50%)",
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
              title: "Prevención de vulnerabilidades (50%)",
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
        "Razor Page: Uso de AuthorizeView",
        "Implementación y Protección de JWT",
        "Limitación de Tasa de Solicitudes (Rate Limiting)",
        "Límite de Tamaño de Solicitud",
      ],
    },
    {
      title: "Inyección de Datos",
      description:
        "Clase de ataque donde se introducen datos maliciosos en un sistema, que pueden llevar a la ejecución de comandos no autorizados o al acceso a datos no permitidos. La validación de entradas es la defensa principal.",
      recommendations: ["Validación de Entradas (Data Annotations)"],
    },
    {
      title: "Manipulación de Token",
      description:
        "Un atacante intercepta y modifica el contenido (payload) de un token de autenticación para escalar privilegios o suplantar la identidad de otro usuario. Se previene con firmas digitales robustas.",
      recommendations: ["Implementación y Protección de JWT"],
    },
  ],
};
