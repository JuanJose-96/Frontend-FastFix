# FastFix — Frontend

> Interfaz web de FastFix: la plataforma que conecta a clientes con técnicos especializados en electricidad, carpintería y otros trabajos de mantenimiento.

## Tabla de contenidos

- [Sobre este repositorio](#sobre-este-repositorio)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación local para desarrollo](#instalación-local-para-desarrollo)
- [Variables de entorno](#variables-de-entorno)
- [Construcción para producción](#construcción-para-producción)
- [Ejecución con Docker](#ejecución-con-docker)
- [Recomendación de uso](#recomendación-de-uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Solución de problemas](#solución-de-problemas)
- [Contacto](#contacto)

## Sobre este repositorio

Este repositorio contiene la **interfaz web** de FastFix. Su responsabilidad es mostrar la experiencia de usuario (búsqueda de técnicos por sector, reseñas, contacto vía WhatsApp) y comunicarse con el backend mediante peticiones HTTP.

Forma parte de una arquitectura hexagonal y puede ejecutarse de dos maneras:

- **De forma independiente**, para desarrollo o revisión técnica de la interfaz (lo que documenta este README).
- **Integrado en el launcher**, para arrancar la aplicación completa (frontend + backend) con un solo comando. Esta es la forma recomendada para probar FastFix completo.

## Tecnologías

- **React 19.2.4** — biblioteca para la interfaz de usuario.
- **Vite 8.0.5** — entorno de desarrollo y empaquetado.
- **Axios 1.14.0** — cliente HTTP para comunicarse con el backend.

## Requisitos previos

Para trabajar con este proyecto de forma independiente necesitas:

- **Node.js** 20 LTS o superior.
- **npm** 10 o superior (se instala junto con Node.js).

Si solo quieres levantar la aplicación completa, no necesitas instalar Node.js: usa el **launcher** con Docker Desktop.

Este repositorio incluye también un `Dockerfile` para su construcción en contenedor y un `.env.example` con la variable que el frontend necesita para conocer la URL base del backend.

## Instalación local para desarrollo

Abre una terminal en la raíz del proyecto e instala las dependencias:

```bash
npm install
```

> Para una instalación reproducible a partir de `package-lock.json`, puedes usar `npm ci` en lugar de `npm install`.

Arranca el servidor de desarrollo de Vite:

```bash
npm run dev
```

El frontend quedará disponible en el puerto que indique Vite por consola, habitualmente:

```
http://localhost:5173
```

## Variables de entorno

El frontend usa la variable `VITE_API_BASE_URL` para saber a qué URL del backend dirigir las peticiones. En este repositorio existe un archivo `.env.example` con la estructura esperada.

Copia la plantilla y crea tu propio archivo `.env`:

```bash
cp .env.example .env
```

Para **desarrollo local**, `VITE_API_BASE_URL` no es un valor sensible: simplemente apunta al backend que tengas levantado. Si ejecutas el backend en local, normalmente será:

```
VITE_API_BASE_URL=http://localhost:8080
```

> **Importante — las variables `VITE_` se incrustan en tiempo de compilación.** Vite reemplaza las referencias a `import.meta.env.VITE_*` por sus valores durante `npm run dev` y `npm run build`. Esto significa que el valor se "congela" al compilar: no puede cambiarse después en tiempo de ejecución sin volver a construir la aplicación. Tenlo en cuenta especialmente al usar Docker (ver más abajo).

## Construcción para producción

Para generar la versión optimizada del frontend:

```bash
npm run build
```

Esto genera la carpeta `dist`, con los archivos listos para desplegar. Puedes previsualizar localmente ese build de producción con:

```bash
npm run preview
```

La carpeta `dist` se puede borrar y regenerar sin problema repitiendo el comando de build.

## Ejecución con Docker

Este repositorio puede construirse en Docker de forma independiente.

```bash
docker build -t fastfix-frontend .
```

```bash
docker run --rm -p 5173:80 fastfix-frontend
```

La aplicación quedará accesible en `http://localhost:5173`.

> **Sobre la URL del backend en Docker:** como `VITE_API_BASE_URL` se incrusta al compilar, el valor que use la imagen es el que esté disponible **durante `docker build`**, no durante `docker run`. Si tu `Dockerfile` declara esa variable como argumento de build (`ARG`), puedes pasarla así:
>
> ```bash
> docker build --build-arg VITE_API_BASE_URL=<URL_DEL_BACKEND> -t fastfix-frontend .
> ```
>
> Comprueba cómo está definido el `Dockerfile` de este repositorio para saber el mecanismo exacto. Si no se proporciona la variable al construir, el frontend no sabrá a qué backend conectarse.

Esta opción es útil para validar que el frontend compila y se sirve correctamente dentro de un contenedor.

## Recomendación de uso

Si lo que buscas es probar **FastFix completo**, no arranques este repositorio aislado: usa el **launcher**, que ya coordina frontend, backend y variables de entorno en un único flujo de ejecución.

Este repositorio tiene más sentido como módulo independiente para desarrollo, mantenimiento o revisión técnica de la interfaz.

## Estructura del proyecto

```
## Estructura del proyecto


fastfix-frontend/
├── public/              # Recursos estáticos 
├── src/                 # Código fuente de la interfaz
│   ├── api/             # Llamadas a la API del backend
│   ├── assets/          # Imágenes y recursos de los componentes
│   ├── components/      # Componentes reutilizables de React
│   ├── pages/           # Vistas o páginas de la aplicación
│   ├── services/        # Lógica de comunicación y servicios
│   ├── styles/          # Hojas de estilo
│   ├── utils/           # Funciones auxiliares
│   ├── App.jsx          # Componente raíz
│   └── main.jsx         # Punto de entrada de la aplicación React
├── index.html           # Plantilla HTML base de Vite
├── package.json         # Dependencias y scripts
├── package-lock.json    # Versiones exactas de las dependencias
├── eslint.config.js     # Configuración de ESLint
├── Dockerfile           # Construcción de la imagen del frontend
├── .dockerignore       # Archivos excluidos del contexto de build
├── .env.example         # Plantilla de variables de entorno
└── README.md

```

## Solución de problemas

| Problema | Posible causa y solución |
|----------|--------------------------|
| `npm install` falla | Versión de Node.js incompatible. Comprueba que tienes Node.js 20 o superior. |
| El frontend carga pero no recibe datos | `VITE_API_BASE_URL` apunta a un backend que no está levantado o a una URL incorrecta. |
| Cambié el `.env` pero la app sigue usando el valor antiguo | Las variables `VITE_` se incrustan al compilar. Reinicia `npm run dev` o vuelve a ejecutar `npm run build`. |
| El contenedor Docker no se conecta al backend | La URL del backend no se pasó durante `docker build`. Revisa la sección [Ejecución con Docker](#ejecución-con-docker). |
| Puerto 5173 ya en uso | Otra aplicación lo está ocupando. Ciérrala o deja que Vite use otro puerto. |

## Contacto

Para solicitar credenciales reales para una prueba o revisión, o para cualquier consulta:

- **Autor:** Juan José Soto Alcaraz
- **Correo:** <jjsavixxxiii@gmail.com>
