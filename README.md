# ApiCenter - Backend

ApiCenter es una aplicación diseñada para el monitoreo de APIs. Este repositorio contiene el código del backend, encargado de la gestión de usuarios, autenticación y administración de los proyectos a monitorear.

## Tecnologías Utilizadas

- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- JSON Web Token (JWT) para autenticación
- Bcryptjs para encriptación de contraseñas
- Zod para validación de esquemas
- Swagger para documentación de la API
- Helmet y CORS para seguridad

## Características

- Autenticación de usuarios (Registro e Inicio de sesión).
- Gestión de proyectos (CRUD completo).
- Estructura de base de datos relacional para usuarios, proyectos y logs de estado.
- Documentación interactiva con Swagger.

## Requisitos Previos

- Node.js instalado.
- Instancia de PostgreSQL en ejecución.

## Configuración

1. Clonar el repositorio.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Configurar las variables de entorno en un archivo `.env` basado en el siguiente esquema:
   ```env
   DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/apicenter?schema=public"
   JWT_SECRET="tu_secreto_para_jwt"
   PORT=3000
   ```
4. Ejecutar las migraciones de Prisma para configurar la base de datos:
   ```bash
   npx prisma migrate dev
   ```

## Ejecución

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

## Endpoints de la API

### Autenticación
- **POST /auth/register**: Registra un nuevo usuario.
- **POST /auth/login**: Inicia sesión y devuelve un token JWT.

### Proyectos (Requiere Autenticación)
- **GET /project**: Obtiene todos los proyectos del usuario autenticado.
- **POST /project**: Crea un nuevo proyecto para monitorear.
- **PATCH /project/:id**: Actualiza la información de un proyecto existente.
- **DELETE /project/:id**: Elimina un proyecto.

## Documentación

Una vez que el servidor esté en ejecución, puedes acceder a la documentación interactiva de Swagger en:
`http://localhost:3000/api-docs` (o el puerto configurado).

Este proyecto forma parte de un portfolio profesional de desarrollo backend.
