# Delilah Resto API

[Delilah Resto API](https://ezeholz.github.io/Acamica/tercerProyecto/docs) se compone de endpoints preparados para una aplicación de pedidos, donde le permitiría a los usuarios registrarse, hacer su pedido de acuerdo a productos existentes, y enviarlo.
También se brindarán endpoints para administradores, que podrán ver los pedidos, actualizarlos, así como actualizar los productos, agregar nuevos, o eliminarlos

Fecha de inicio del trabajo: 08/04/20\
Fecha de entrega del trabajo: 17/04/20

## Instalación

### Instalar

1. Instala [Node.js v12.14.1](https://nodejs.org/download/release/v12.14.1/) 
2. [Descargá la última versión](https://github.com/ezeholz/Acamica/releases/tag/3.1.1.6) y usá `npm install` en su carpeta principal.
3. Se puede utilizar los [Docs](https://ezeholz.github.io/Acamica/tercerProyecto/docs) de forma remota para interactuar con la API, aunque está preparada solo para utilizarse de forma local

### Online
De forma alternativa, se puede probar online. Solamente hace falta utilizar los Docs, y poner el servidor hacia https://delilah-ezeholz.glitch.me

## Uso

#### `npm start`
Con este comando, podrás iniciar el servidor. Luego todo se hace utilizando la dirección que necesites. Para más información sobre endpoints, visita los [Docs](https://ezeholz.github.io/Acamica/tercerProyecto/docs)

### Usuario Administrador
El servidor cuenta por defecto con un usuario administrador, el cual tanto el usuario como la contraseña es admin admin.

### Bearer Token
El servidor utiliza la forma de autentificación Bearer para loguearse como usuario.

## To Do
- [ ] Agregar más endpoints
- [ ] Mejorar el código
- [ ] Utilizar más comentarios
- [ ] Generar claves aleatorias con cada inicio
- [x] Mejorar la funcionalidad del Docs
- [x] Mejorar la visibilidad del Docs

## Infografía

Para mi, como en los otros trabajos presentados, es importante anotar infografía que haya servido para realizarlo. A modo de resúmen, sirve también para que a futuro se pueda consultar.

### Referencias
* [SQLite Tutorial](https://www.sqlitetutorial.net/sqlite-nodejs/)
* [Express 4.x](https://expressjs.com/es/4x/api.html)
* [Swagger](https://swagger.io/specification/)
* [MDN](https://developer.mozilla.org)

### Artículos
* [But what the hell is package-lock.json?](https://dev.to/saurabhdaware/but-what-the-hell-is-package-lock-json-b04)
* [Sqlite syntax error near "?"](https://stackoverflow.com/questions/32197634/sqlite-syntax-error-near)
* [Built-in way in JavaScript to check if a string is a valid number](https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number)
* [Counting array elements and sort descending by count](https://stackoverflow.com/questions/18007214/counting-array-elements-and-sort-descending-by-count)
* [Converts Swagger YAML to a static HTML document](https://gist.github.com/oseiskar/dbd51a3727fc96dcf5ed189fca491fb3)
* [Swagger CDN](https://cdnjs.com/libraries/swagger-ui)
* [SQLite on Node.js Async/Await](https://www.scriptol.com/sql/sqlite-async-await.php)

## Licencia

Este programa se hizo y se presentó a la tutoría de [Acámica](https://www.acamica.com), el fin de este proyecto fue demostrar el conocimiento aprendido en la carrera Fullstack que tuve el honor de cursar.

>Copyright 2020 Ezequiel G. Holzweissig
>
>Licensed under the Apache License, Version 2.0 (the "License");
>you may not use this file except in compliance with the License.
>You may obtain a copy of the License at
>
>   http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software
>distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
>See the License for the specific language governing permissions and
>limitations under the License.
