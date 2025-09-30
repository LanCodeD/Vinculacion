Este proyecto fue creado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) y utiliza App Router con autenticación mediante NextAuth.

## Ramas del repositorio

### `main`
- **Contenido donde se actualiza de las ramas**: En esta rama se va actualizando conforme vaya cambiando de las demas ramas hijas, en esa rama es donde se despliega.

### `alan/convenios`
- **Rama De Convenios**: Se crea todo el proceso de Relacionado a convenios

### `jesus/bolsaTrabajo`
- **Rama De Convenios**: Se crea todo el proceso de Relacionado a bolsa de trabajo

> **Nota**: Todos los despliegues deben realizarse desde la rama `main`.

---

### Paso 1: Instalación de dependencias

Instala todos los paquetes necesarios para correr el proyecto localmente.

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

## Paso 2: Configuración de variables de entorno

Crea un archivo .env en la raíz del proyecto y define las variables necesarias:

```bash
DATABASE_URL=mysql://usuario:contraseña@localhost:0000/mi_base_de_datos
NEXTAUTH_SECRET=tu_clave_secreta
NEXTAUTH_URL=URL

## Coloca las credenciales a tu configuración de proyecto
```

## Paso 3: Ejecutar comando prisma para generar la migración de modelos

Una vez ejecutado los paquetes de dependencia y haber configurado el .env, toca ejecutar el siguiente comando para traer los modelos a la base de datos

```bash
npx prisma migrate dev

## Generará el modelo.
```


### Paso 4. Ejecutar en modo desarrollo

```bash
npm run dev
```
### Paso 5. Generar build de producción (opcional)

```bash
npm run build
npm start

## (Esto es para optimizar y correr en modo producción.)
```
