import RBAC from "../assets/RBAC.png";
import Authorization from "../assets/Authorization.png";

export const authorizationData = {
  securityMechanismTitle: "Autorización",
  definition:
    "La autorización es el proceso que determina si un usuario autenticado tiene permiso para acceder a un recurso específico o realizar una acción determinada. A diferencia de la autenticación (que verifica quién es el usuario), la autorización define qué puede hacer ese usuario.",
  interestingFacts: [
    {
      description:
        "El Control de Acceso Basado en Roles (RBAC) es uno de los modelos de autorización más comunes. Asigna permisos a roles en lugar de a usuarios individuales, simplificando la gestión en sistemas con muchos usuarios.",
      image: RBAC,
    },
    {
      description:
        "Un principio fundamental de la autorización es el 'mínimo privilegio'. Esto significa que un usuario solo debe tener acceso a la información y a las acciones que son estrictamente necesarias para realizar su función. Negar el acceso por defecto y conceder permisos explícitamente es una de las prácticas más seguras en el diseño de software.",
      image: Authorization,
    },
  ],

  goodPractices: [
    {
      title: "Control de Acceso Basado en Roles (RBAC)",
      description:
        "Implementar un sistema donde los permisos se asignan a roles predefinidos (como 'Administrador', 'Usuario') y los usuarios heredan los permisos de los roles que se les asignan. Esto centraliza y simplifica la gestión de permisos.",
      threats: [
        "Elevación de Privilegios",
        "Acceso no Autorizado",
        "Manipulación de URL",
        "Referencia Directa a Objetos Insegura (IDOR)",
      ],

      recommendation:
        "Fundamental para: Casi todas las aplicaciones (MVC, Razor Pages, Web API) que necesitan diferenciar entre tipos de usuarios, como administradores, moderadores y usuarios estándar.",
      warning:
        "La lógica de autorización en las vistas (ej. `@if (User.IsInRole(...))`) puede volverse difícil de mantener si las reglas son complejas. Considere usar Políticas para una lógica más limpia en el backend.",

      modalContent: {
        title: "Implementación de RBAC con ASP.NET Core Identity",
        practices: [
          {
            title: "1. Definir Roles en la Aplicación",
            description:
              "Crear una clase estática para definir los roles como constantes. Esto evita errores de tipeo y centraliza la gestión de los nombres de los roles.",
            code: `// En una carpeta /Services o /Constants
public static class UserRoles
{
    public const string Admin = "Administrador";
    public const string User = "Usuario";
    public const string Manager = "Gerente";

    public static string[] GetAllRoles()
    {
        return new[] { Admin, User, Manager };
    }
}`,
          },
          {
            title: "2. Actualizar Modelo y Vista de Registro",
            description:
              "Añadir una propiedad 'Role' al ViewModel de registro y un campo de selección (`<select>`) en el formulario para permitir que se elija un rol durante la creación del usuario.",
            code: `// Añadir al RegisterViewModel.cs
[Required]
public string Role { get; set; } = null!;

// Añadir al Register.cshtml
<div class="form-group">
    <label asp-for="Role"></label>
    <select asp-for="Role" class="form-control">
        <option value="">Selecciona un rol</option>
        @foreach (var role in UserRoles.GetAllRoles())
        {
            <option value="@role">@role</option>
        }
    </select>
    <span asp-validation-for="Role" class="text-danger"></span>
</div>`,
          },
          {
            title: "3. Modificar Controlador para Asignar Roles",
            description:
              "Inyectar `RoleManager` en el controlador de cuentas. En el método de registro, después de crear el usuario, usar `userManager.AddToRoleAsync()` para asignarle el rol seleccionado.",
            code: `// Inyectar RoleManager y modificar el registro
private readonly UserManager<IdentityUser> _userManager;
private readonly RoleManager<IdentityRole> _roleManager;

// ... en el constructor ...

[HttpPost]
public async Task<IActionResult> Register(RegisterViewModel model)
{
    // ...
    var result = await _userManager.CreateAsync(user, model.Password);
    if (result.Succeeded)
    {
        // Asignar el rol después de crear el usuario
        await _userManager.AddToRoleAsync(user, model.Role);
        // ...
    }
    // ...
}`,
          },
          {
            title: "4. Asegurar la Creación de Roles en la BD",
            description:
              "Crear un método que verifique si los roles definidos existen en la base de datos y los cree si no es así. Invocar este método en un punto de entrada de la aplicación, como el método GET del Login.",
            code: `private async Task EnsureRolesExist()
{
    foreach (var roleName in UserRoles.GetAllRoles())
    {
        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            await _roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}

// Invocar en el método GET del Login
public async Task<IActionResult> Login()
{
    await EnsureRolesExist();
    return View();
}`,
          },
          {
            title: "5. Proteger Endpoints y Vistas",
            description:
              'Usar el atributo `[Authorize(Roles = "...")]` en las acciones de los controladores para restringir el acceso por rol. En las vistas de Razor, usar `User.IsInRole("...")` para mostrar u ocultar elementos de la interfaz.',
            code: `// En un controlador
[Authorize(Roles = UserRoles.Admin)]
public IActionResult ControlPanel()
{
    return View();
}

// En una vista (_Layout.cshtml)
@if (User.IsInRole(UserRoles.Admin))
{
    <li class="nav-item">
        <a class="nav-link" asp-action="ControlPanel">Panel de Control</a>
    </li>
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Configuración de roles (10%)",
                  achieved:
                    "La clase UserRoles está creada correctamente con constantes y un método para obtener todos los roles.",
                  notAchieved:
                    "Clase inexistente, mal ubicada o el método no retorna los roles correctamente.",
                },
                {
                  description: "Modelo de datos e Interfaz de usuario (10%)",
                  achieved:
                    "La propiedad 'Role' fue añadida al modelo de registro y el formulario incluye un <select> que se llena dinámicamente.",
                  notAchieved:
                    "Propiedad faltante en el modelo, o el <select> es inexistente o tiene roles hardcodeados.",
                },
                {
                  description: "Inyección de dependencias (5%)",
                  achieved:
                    "RoleManager está correctamente inyectado en el constructor del controlador.",
                  notAchieved:
                    "La dependencia de RoleManager falta o está mal configurada.",
                },
                {
                  description: "Registro con roles (10%)",
                  achieved:
                    "El método de registro crea el usuario y le asigna el rol seleccionado, manejando un rollback si la asignación del rol falla.",
                  notAchieved:
                    "El rol no se asigna al usuario durante el registro o falta el manejo de errores.",
                },
                {
                  description: "Gestión automática de roles (5%)",
                  achieved:
                    "Un método verifica y crea los roles en la base de datos si no existen, y es invocado al inicio de la aplicación.",
                  notAchieved:
                    "Los roles no se crean automáticamente o el método de creación no se ejecuta.",
                },
                {
                  description: "Autorización en vistas (10%)",
                  achieved:
                    'Se aplican atributos [Authorize(Roles = "...")] en las acciones y se usa User.IsInRole() en las vistas para controlar la visibilidad.',
                  notAchieved:
                    "Faltan atributos de autorización o la interfaz no oculta elementos según el rol del usuario.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Persistencia de roles (10%)",
                  achieved:
                    "Los roles y su relación con los usuarios se registran y persisten correctamente en las tablas AspNetRoles y AspNetUserRoles.",
                  notAchieved:
                    "La tabla de roles está vacía o no se registran correctamente las relaciones entre usuarios y roles.",
                },
                {
                  description: "Validación contra acceso no autorizado (20%)",
                  achieved:
                    "Un usuario sin el rol requerido es redirigido a la página de 'Acceso Denegado' al intentar acceder a una URL protegida.",
                  notAchieved:
                    "Un usuario puede acceder directamente a vistas restringidas para las que no tiene el rol adecuado.",
                },
                {
                  description: "Validación de interfaz por roles (20%)",
                  achieved:
                    "La interfaz de usuario oculta dinámicamente las opciones y enlaces a los que el usuario autenticado no tiene acceso por su rol.",
                  notAchieved:
                    "El usuario puede ver opciones del menú o enlaces a funciones para las que no tiene permisos.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      title: "Autorización Basada en Políticas (Claims)",
      description:
        "Definir políticas de autorización personalizadas que verifican la presencia de 'claims' específicos en la identidad de un usuario. Esto permite un control de acceso más granular que los roles.",
      threats: [
        "Elevación de Privilegios",
        "Acceso No Autorizado",
        "Manipulación de URL",
        "Referencia Directa a Objetos Insegura (IDOR)",
      ],

      recommendation:
        "Ideal para: Escenarios que requieren un control de acceso más granular que los roles. Por ejemplo, 'solo los managers del departamento de TI pueden acceder' o 'solo los usuarios mayores de 18 años'.",
      warning:
        "Asegúrese de que los claims se añadan a la identidad del usuario de forma consistente durante el login o registro. Un claim faltante resultará en un fallo de autorización silencioso (acceso denegado).",

      modalContent: {
        title: "Implementación de Autorización con Políticas",
        practices: [
          {
            title: "1. Definir Atributos para Claims",
            description:
              "Crear una clase estática para definir los posibles valores de un 'claim' (como un área de trabajo). Esto, al igual que con los roles, centraliza la gestión y evita errores.",
            code: `// En una carpeta /Services o /Constants
public static class WorkAreas
{
    public const string HumanResources = "Recursos Humanos";
    public const string Technology = "Tecnología";

    public static string[] GetAllAreas()
    {
        return new[] { HumanResources, Technology };
    }
}`,
          },
          {
            title: "2. Actualizar UI y Modelo de Registro",
            description:
              "Añadir la propiedad para el claim (ej. 'WorkArea') al ViewModel y un campo de selección al formulario de registro, que se muestre condicionalmente (ej. solo para el rol 'Manager').",
            code: `// Añadir a RegisterViewModel.cs
public string? WorkArea { get; set; }

// Script en Register.cshtml para mostrar/ocultar el campo
document.getElementById("roleSelect").addEventListener("change", function () {
    if (this.value === "Manager") {
        document.getElementById("workAreaContainer").style.display = "block";
    } else {
        document.getElementById("workAreaContainer").style.display = "none";
    }
});`,
          },
          {
            title: "3. Asignar Claims durante el Registro",
            description:
              "En el controlador, después de crear el usuario y asignarle un rol, verificar si se debe añadir un 'claim' y usar `userManager.AddClaimAsync()` para asociarlo al usuario.",
            code: `// En el método Register del AccountController
if (model.Role == UserRoles.Manager)
{
    if (string.IsNullOrEmpty(model.WorkArea)) { /* Manejar error */ }
    
    var claim = new System.Security.Claims.Claim("WorkArea", model.WorkArea);
    await _userManager.AddClaimAsync(user, claim);
}`,
          },
          {
            title: "4. Crear Políticas de Autorización",
            description:
              "En `Program.cs`, registrar las políticas de autorización. Cada política define uno o más requisitos, como requerir un rol y un 'claim' con un valor específico.",
            code: `builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("TechnologyManagerOnly", policy =>
        policy.RequireRole("Manager")
              .RequireClaim("WorkArea", "Tecnología"));

    options.AddPolicy("HumanResourcesManagerOnly", policy =>
        policy.RequireRole("Manager")
              .RequireClaim("WorkArea", "Recursos Humanos"));
});`,
          },
          {
            title: "5. Aplicar Políticas a Endpoints",
            description:
              "Proteger las acciones de los controladores utilizando el atributo `[Authorize]` y especificando el nombre de la política a aplicar.",
            code: `// En un controlador
[Authorize(Policy = "TechnologyManagerOnly")]
public IActionResult ManagementTI()
{
    return View();
}`,
          },
        ],
        rubric: {
          rubricData: [
            {
              title: "Implementación correcta (50%)",
              criteria: [
                {
                  description: "Configuración de claims (workAreas) (10%)",
                  achieved:
                    "La clase para los valores de los claims (ej. WorkAreas) está creada correctamente con constantes y un método para obtener todos los valores.",
                  notAchieved:
                    "Clase inexistente, mal ubicada o el método no retorna los valores correctamente.",
                },
                {
                  description: "Modelo de datos e Interfaz de usuario (10%)",
                  achieved:
                    "La propiedad para el claim (ej. WorkArea) fue añadida al modelo de registro y el formulario incluye un <select> que se muestra condicionalmente.",
                  notAchieved:
                    "Propiedad faltante, o el <select> no es condicional o está mal configurado.",
                },
                {
                  description: "Registro con claims (10%)",
                  achieved:
                    "El método de registro asigna el 'claim' al usuario si cumple la condición (ej. es 'Manager') y valida que el valor no sea nulo.",
                  notAchieved:
                    "El 'claim' no se registra o falta el manejo de errores y validaciones.",
                },
                {
                  description: "Definición de Políticas (10%)",
                  achieved:
                    "Las políticas de autorización están correctamente definidas en Program.cs usando `AddPolicy` con los requisitos de rol y claim.",
                  notAchieved:
                    "Las políticas no están definidas, están incompletas o tienen una lógica incorrecta.",
                },
                {
                  description: "Autorización en vistas (10%)",
                  achieved:
                    'Se aplican atributos [Authorize(Policy = "...")] correctamente en las acciones del controlador.',
                  notAchieved:
                    "Faltan atributos de autorización, están mal configurados o usan roles en lugar de políticas.",
                },
              ],
            },
            {
              title: "Prevención de vulnerabilidades (50%)",
              criteria: [
                {
                  description: "Persistencia de claims (25%)",
                  achieved:
                    "Los 'claims' se registran y persisten correctamente en la tabla AspNetUserClaims para los usuarios correspondientes.",
                  notAchieved:
                    "La tabla AspNetUserClaims está vacía o no contiene los datos esperados para los usuarios.",
                },
                {
                  description: "Validación contra acceso no autorizado (25%)",
                  achieved:
                    "Un usuario que no cumple con todos los requisitos de una política (ej. un Manager de RRHH intentando acceder a una vista de TI) es redirigido a 'Acceso Denegado'.",
                  notAchieved:
                    "El usuario tiene acceso directo a vistas restringidas sin cumplir con todos los requisitos de la política.",
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
      title: "ASP.NET Core Identity",
      description:
        "Utilizar el framework integrado de ASP.NET Core para manejar la autenticación y gestión de usuarios, incluyendo registro, login, roles y almacenamiento seguro de contraseñas.",
      threats: [
        "Elevación de Privilegios",
        "Acceso No Autorizado",
        "Manipulación de URL",
        "Referencia Directa a Objetos Insegura (IDOR)",
      ],

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
  ],

  threats: [
    {
      title: "Elevación de Privilegios",
      description:
        "Amenaza en la que por algún medio se logra cambiar los privilegios asignados a un usuario para que sea capaz de obtener los privilegios más altos en la aplicación, como los de un administrador.",
      recommendations: [
        "Control de Acceso Basado en Roles (RBAC)",
        "Autorización Basada en Políticas (Claims)",
        "ASP.NET Core Identity",
      ],
    },
    {
      title: "Acceso no Autorizado",
      description:
        "Usuarios malintencionados pueden intentar acceder a datos confidenciales o realizar acciones para las que no están autorizados, además, el acceso no autorizado a los datos puede dar lugar a violaciones de datos (Data breaches), lo que resulta en una exposición de información confidencial.",
      recommendations: [
        "Control de Acceso Basado en Roles (RBAC)",
        "Autorización Basada en Políticas (Claims)",
        "ASP.NET Core Identity",
        "Cifrado de Archivos de Configuración",
      ],
    },
    {
      title: "Manipulación de URL",
      description:
        "Ataque en el que se accede a recursos, información o acciones restringidas sobre los datos eludiendo el mecanismo de control de acceso de la aplicación mediante la manipulación de la URL de las aplicaciones.",
      recommendations: [
        "Control de Acceso Basado en Roles (RBAC)",
        "Autorización Basada en Políticas (Claims)",
        "ASP.NET Core Identity",
      ],
    },
    {
      title: "Referencia Directa a Objetos Insegura (IDOR)",
      description:
        "Es una vulnerabilidad que se produce cuando una aplicación expone directamente referencias a objetos internos (como rutas de archivos o claves) a los usuarios sin validar los derechos de acceso adecuados, causando que un atacante pueda manipular estas referencias para acceder a recursos no autorizados.",
      recommendations: [
        "Control de Acceso Basado en Roles (RBAC)",
        "Autorización Basada en Políticas (Claims)",
        "ASP.NET Core Identity",
      ],
    },
  ],
};
