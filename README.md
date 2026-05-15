# ApiCenter - Plataforma de Monitoreo de APIs

ApiCenter es una solución integral diseñada para el monitoreo constante de servicios y endpoints de API. Este proyecto ha sido desarrollado como parte de mi portfolio profesional para demostrar habilidades en el desarrollo Full Stack, abarcando desde la arquitectura de servicios backend hasta interfaces de usuario modernas y seguras.

## Descripcion del Proyecto

La plataforma permite a los usuarios registrar sus endpoints, configurar metodos HTTP y recibir reportes de latencia y disponibilidad en tiempo real. Cuenta con un sistema de tareas programadas que verifica automaticamente el estado de cada servicio registrado cada 30 minutos, almacenando un historial detallado de logs para su analisis posterior.

## Tecnologias Utilizadas

### Backend
- Node.js y Express con TypeScript.
- Prisma ORM para la gestion de la base de datos PostgreSQL.
- Autenticacion segura mediante JSON Web Tokens (JWT) y encriptacion de claves con Bcrypt.
- Validacion de datos con Zod.
- Tareas programadas con Node-cron.
- Documentacion automatizada con Swagger.

### Frontend
- React con TypeScript.
- Vite como herramienta de construccion.
- Tailwind CSS para el diseño de interfaces.
- Lucide React para la iconografia.
- Recharts para la visualizacion de datos y graficos de latencia.
- Axios para el consumo de servicios API.

## Caracteristicas Principales

- Sistema de autenticacion completo (Registro e Inicio de sesion).
- Dashboard interactivo con visualizacion de estados y busqueda de nodos.
- Gestion completa de objetivos (CRUD) con limite de 9 proyectos por cuenta.
- Graficos de latencia historica para cada endpoint.
- Historial de actividad paginado con detalles de codigos de estado y tiempos de respuesta.
- Monitoreo automatico en segundo plano mediante procesos programados.
- Diseño minimalista con tematica oscura y enfasis en la legibilidad de datos.

## Instalacion y Configuracion

### Backend
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar el archivo .env en la raiz:
   ```env
   DATABASE_URL="tu_url_de_postgresql"
   JWT_SECRET="tu_secreto"
   PORT=8080
   ```
3. Sincronizar la base de datos:
   ```bash
   npx prisma migrate dev
   ```
4. Iniciar servidor:
   ```bash
   npm run dev
   ```

### Frontend
1. Ingresar al directorio frontend:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar el archivo .env:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```
4. Iniciar aplicacion:
   ```bash
   npm run dev
   ```

## Notas de Desarrollo

Durante el desarrollo de este proyecto, se priorizo la seguridad y la robustez de los datos. Se implementaron validaciones tanto en el cliente como en el servidor, y se aseguro que cada usuario solo tenga acceso a sus propios datos mediante middlewares de verificacion de tokens. La restriccion de 9 proyectos por usuario asegura una gestion eficiente de los recursos del sistema de monitoreo.

Este proyecto refleja mi enfoque en la creacion de herramientas funcionales, con codigo limpio y una arquitectura escalable.
