# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar Angular CLI
RUN npm install -g @angular/cli

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación para producción
RUN npm run build --prod

# Etapa 2: Producción
FROM node:18-alpine

# Instalar serve
RUN npm install -g serve

# Copiar los archivos compilados desde la etapa de construcción
COPY --from=builder /usr/src/app/dist /usr/src/app/dist

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Exponer el puerto que usará el contenedor
EXPOSE 80

# Comando por defecto para servir la aplicación
CMD ["serve", "-s", "dist/resizable_sidenav/browser", "-l", "80"]