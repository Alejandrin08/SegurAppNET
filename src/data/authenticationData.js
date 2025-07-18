import jwtImg from "../assets/jwt.png";
import authImg from "../assets/auth.png";

export const authenticationData = {
  securityMechanismTitle: "Autenticación",
  definition:
    "La autenticación es el proceso de verificar la identidad del usuario comparando las credenciales proporcionadas con las almacenadas en una base de datos, aplicación o sistema. Las implementaciones modernas suelen utilizar la autenticación basada en reclamaciones, que proporciona información adicional sobre el usuario (nombre, correo electrónico, funciones) a través de tokens estandarizados.",
  interestingFacts: [
    {
      description:
        "Los JSON web tokens (JWT) son el estándar moderno de autenticación. Cuando los usuarios se autentican correctamente, el servidor genera un token firmado que contiene sus reclamaciones y que se utiliza para las solicitudes posteriores.",
      image: jwtImg,
    },
    {
      description:
        "Las reclamaciones proporcionan una forma de representar la identidad del usuario más allá del nombre de usuario/contraseña, permitiendo añadir más información detallada de un usuario.",
      image: authImg,
    },
  ],
  implementationDescription:
    "Configura los servicios de autenticación en el archivo Program.cs usando AddAuthentication y AddCookie (u otro esquema según el tipo de autenticación). Luego, protege las rutas con el atributo [Authorize] y gestiona los inicios de sesión y cierre de sesión con endpoints que usen SignInAsync y SignOutAsync.",
  implementationCode: `[HttpPost]
public async Task<ResponseViewModel> Index(AutenticacionViewModel autenticacion)
{

}`,
  goodPractices: [
    {
      title: "Políticas de roles directamente",
      description: "Proporciona un marco sólido para gestionar usuarios...",
      threats: ["Acceso no autorizado", "Escalada de privilegios"],
      modalContent: {
        title: "Implementación de políticas de roles",
        practices: [
          {
            title: "Configuración básica",
            description: "Primero, configura los roles en tu aplicación...",
            code: `[HttpPost]
public async Task<IActionResult> ConfigureRoles() {
  // Código de configuración
}`,
          },
          {
            title: "Asignación de roles",
            description: "Proceso para asignar roles a los usuarios...",
            code: `public async Task AssignRole(string userId, string role) {
  // Código de asignación
}`,
            postCodeText:
              "Asegúrate de validar los permisos antes de asignar roles.",
          },
        ],
        rubric: {
          dynamicCells: [
            'Se utiliza el atributo [Authorize(Roles = "...")] en todas las acciones',
            "Solo algunas acciones clave usan el atributo de roles",
            "No se usa el atributo de roles",
            "Los roles coinciden con funciones específicas del sistema",
            "Se aplican roles donde no son necesarios",
            "Los roles se aplican de forma arbitraria",
            "Impide el acceso no autorizado a funciones críticas",
            "Algunas acciones están protegidas",
            "Todas las acciones están accesibles",
          ],
        },
      },
    },
    {
      title: "Políticas de roles directamente",
      description: "Proporciona un marco sólido para gestionar usuarios...",
      threats: ["Acceso no autorizado", "Escalada de privilegios"],
      modalContent: {
        title: "Implementación dedsadasda políticas de roles",
        practices: [
          {
            title: "Configuración básica",
            description: "Primero, configura los roles en tu aplicación...",
            code: `[HttpPost]
public async Task<IActionResult> ConfigureRoles() {
  // Código de configuración
}`,
            postCodeText:
              "Este código inicializa los roles básicos del sistema.",
          },
          {
            title: "Asignación de roles",
            description: "Proceso para asignar roles a los usuarios...",
            code: `public async Task AssignRole(string userId, string role) {
  // Código de asignación
}`,
            postCodeText:
              "Asegúrate de validar los permisos antes de asignar roles.",
          },
        ],
        rubric: {
          dynamicCells: [
            'Se utiliza el atributo [Authorize(Roles = "...")] en todas las acciones',
            "Solo algunas acciones clave usan el atributo de roles",
            "No se usa el atributo de roles",
            "Los roles coinciden con funciones específicas del sistema",
            "Se aplican roles donde no son necesarios",
            "Los roles se aplican de forma arbitraria",
            "Impide el acceso no autorizado a funciones críticas",
            "Algunas acciones están protegidas",
            "Todas las acciones están accesibles",
          ],
        },
      },
    },
    {
      title: "Políticas de roles directamente",
      description: "Proporciona un marco sólido para gestionar usuarios...",
      threats: ["Acceso no autorizado", "Escalada de privilegios"],
      modalContent: {
        title: "Implementación de políticas de roles",
        practices: [
          {
            title: "Configuración básica",
            description: "Primero, configura los roles en tu aplicación...",
            code: `[HttpPost]
public async Task<IActionResult> ConfigureRoles() {
  // Código de configuración
}`,
            postCodeText:
              "Este código inicializa los roles básicos del sistema.",
          },
          {
            title: "Asignación de roles",
            description: "Proceso para asignar roles a los usuarios...",
            code: `public async Task AssignRole(string userId, string role) {
  // Código de asignación
}`,
            postCodeText:
              "Asegúrate de validar los permisos antes de asignar roles.",
          },
        ],
        rubric: {
          dynamicCells: [
            'Se utiliza el atributo [Authorize(Roles = "...")] en todas las acciones',
            "Solo algunas acciones clave usan el atributo de roles",
            "No se usa el atributo de roles",
            "Los roles coinciden con funciones específicas del sistema",
            "Se aplican roles donde no son necesarios",
            "Los roles se aplican de forma arbitraria",
            "Impide el acceso no autorizado a funciones críticas",
            "Algunas acciones están protegidas",
            "Todas las acciones están accesibles",
          ],
        },
      },
    },
    {
      title: "Políticas de roles directamente",
      description: "Proporciona un marco sólido para gestionar usuarios...",
      threats: ["Acceso no autorizado", "Escalada de privilegios"],
      modalContent: {
        title: "Implementación de políticas de roles",
        practices: [
          {
            title: "Configuración básica",
            description: "Primero, configura los roles en tu aplicación...",
            code: `[HttpPost]
public async Task<IActionResult> ConfigureRoles() {
  // Código de configuración
}`,
            postCodeText:
              "Este código inicializa los roles básicos del sistema.",
          },
          {
            title: "Asignación de roles",
            description: "Proceso para asignar roles a los usuarios...",
            code: `public async Task AssignRole(string userId, string role) {
  // Código de asignación
}`,
            postCodeText:
              "Asegúrate de validar los permisos antes de asignar roles.",
          },
        ],
        rubric: {
          dynamicCells: [
            'Se utiliza el atributo [Authorize(Roles = "...")] en todas las acciones',
            "Solo algunas acciones clave usan el atributo de roles",
            "No se usa el atributo de roles",
            "Los roles coinciden con funciones específicas del sistema",
            "Se aplican roles donde no son necesarios",
            "Los roles se aplican de forma arbitraria",
            "Impide el acceso no autorizado a funciones críticas",
            "Algunas acciones están protegidas",
            "Todas las acciones están accesibles",
          ],
        },
      },
    },
    {
      title: "Políticas de roles directamente",
      description: "Proporciona un marco sólido para gestionar usuarios...",
      threats: ["Acceso no autorizado", "Escalada de privilegios"],
      modalContent: {
        title: "Implementación de políticas de roles",
        practices: [
          {
            title: "Configuración básica",
            description: "Primero, configura los roles en tu aplicación...",
            code: `[HttpPost]
public async Task<IActionResult> ConfigureRoles() {
  // Código de configuración
}`,
            postCodeText:
              "Este código inicializa los roles básicos del sistema.",
          },
          {
            title: "Asignación de roles",
            description: "Proceso para asignar roles a los usuarios...",
            code: `public async Task AssignRole(string userId, string role) {
  // Código de asignación
}`,
            postCodeText:
              "Asegúrate de validar los permisos antes de asignar roles.",
          },
        ],
        rubric: {
          dynamicCells: [
            'Se utiliza el atributo [Authorize(Roles = "...")] en todas las acciones',
            "Solo algunas acciones clave usan el atributo de roles",
            "No se usa el atributo de roles",
            "Los roles coinciden con funciones específicas del sistema",
            "Se aplican roles donde no son necesarios",
            "Los roles se aplican de forma arbitraria",
            "Impide el acceso no autorizado a funciones críticas",
            "Algunas acciones están protegidas",
            "Todas las acciones están accesibles",
          ],
        },
      },
    },
    {
      title: "Políticas de roles directamente",
      description: "Proporciona un marco sólido para gestionar usuarios...",
      threats: ["Acceso no autorizado", "Escalada de privilegios"],
      modalContent: {
        title: "Implementación de políticas de roles",
        practices: [
          {
            title: "Configuración básica",
            description: "Primero, configura los roles en tu aplicación...",
            code: `[HttpPost]
public async Task<IActionResult> ConfigureRoles() {
  // Código de configuración
}`,
            postCodeText:
              "Este código inicializa los roles básicos del sistema.",
          },
          {
            title: "Asignación de roles",
            description: "Proceso para asignar roles a los usuarios...",
            code: `public async Task AssignRole(string userId, string role) {
  // Código de asignación
}`,
            postCodeText:
              "Asegúrate de validar los permisos antes de asignar roles.",
          },
        ],
        rubric: {
          dynamicCells: [
            'Se utiliza el atributo [Authorize(Roles = "...")] en todas las acciones',
            "Solo algunas acciones clave usan el atributo de roles",
            "No se usa el atributo de roles",
            "Los roles coinciden con funciones específicas del sistema",
            "Se aplican roles donde no son necesarios",
            "Los roles se aplican de forma arbitraria",
            "Impide el acceso no autorizado a funciones críticas",
            "Algunas acciones están protegidas",
            "Todas las acciones están accesibles",
          ],
        },
      },
    },
    {
      title: "Políticas de roles directamente",
      description: "Proporciona un marco sólido para gestionar usuarios...",
      threats: ["Acceso no autorizado", "Escalada de privilegios"],
      modalContent: {
        title: "Implementación de políticas de roles",
        practices: [
          {
            title: "Configuración básica",
            description: "Primero, configura los roles en tu aplicación...",
            code: `[HttpPost]
public async Task<IActionResult> ConfigureRoles() {
  // Código de configuración
}`,
            postCodeText:
              "Este código inicializa los roles básicos del sistema.",
          },
          {
            title: "Asignación de roles",
            description: "Proceso para asignar roles a los usuarios...",
            code: `public async Task AssignRole(string userId, string role) {
  // Código de asignación
}`,
            postCodeText:
              "Asegúrate de validar los permisos antes de asignar roles.",
          },
        ],
        rubric: {
          dynamicCells: [
            'Se utiliza el atributo [Authorize(Roles = "...")] en todas las acciones',
            "Solo algunas acciones clave usan el atributo de roles",
            "No se usa el atributo de roles",
            "Los roles coinciden con funciones específicas del sistema",
            "Se aplican roles donde no son necesarios",
            "Los roles se aplican de forma arbitraria",
            "Impide el acceso no autorizado a funciones críticas",
            "Algunas acciones están protegidas",
            "Todas las acciones están accesibles",
          ],
        },
      },
    },
  ],
  threats: [
    {
      title: "Acceso no autorizado",
      description:
        "Usuarios malintencionados pueden intentar acceder a datos confidenciales o realizar acciones para las que no están autorizados, además, el acceso no autorizado a los datos puede dar lugar a violaciones de datos (Data breaches), lo que resulta en una exposición de información confidencial",
      recommendations: [
        "Autenticación de dos factores",
        "Revisión de permisos",
      ],
    },
    {
      title: "Inyección de código",
      description:
        "Los atacantes pueden inyectar comandos maliciosos a través de entradas inseguras, comprometiendo la integridad del sistema.",
      recommendations: ["Validación de entradas", "Uso de ORM seguros"],
    },
    {
      title: "Falta de control de sesiones",
      description:
        "Las sesiones pueden ser secuestradas o robadas si no se gestionan adecuadamente.",
      recommendations: [
        "Expiración automática de sesión",
        "Regeneración de token",
      ],
    },
    {
      title: "Exposición de datos sensibles",
      description:
        "Datos como contraseñas o tarjetas pueden ser expuestos sin cifrado adecuado.",
      recommendations: [
        "Cifrado en tránsito y reposo",
        "Hashing de contraseñas",
      ],
    },
  ],
};
