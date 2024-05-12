<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Requisitos
1. Debe tener instalado Nest CLI
```bash
# instalar Nest CLI
$ npm i -g @nestjs/cli 
```
2. Debe tener instalado <a href="https://www.postgresql.org/">PostgreSQL</a>

## Siga las siguientes instrucciones

1. Clonar el proyecto

2. Instalar las dependencias necesarias

```bash
# instalar dependencias
$ npm install
```
3. Crear una base de datos en <a href="https://www.postgresql.org/">PostgreSQL</a> para el proyecto

4. Clonar el archivo __example.env__ y renombrarlo a __.env__

5. En el archivo __.env__ configure sus variables de entorno

6. Ejecutar el proyecto
```bash
# Ejecutar proyecto
$ nest start
$ npm run start

# Ejecutar proyecto en modo Desarrollador
$ nest start --watch
$ npm run start:dev

# Ejecutar proyecto en modo Debug
$ nest start --debug --watch
$ npm run start:debug
```

## Producción
```bash
# Ejecutar proyecto en ambiente de producción
$ npm run start:prod
```