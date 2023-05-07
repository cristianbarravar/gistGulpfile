// Importación de los módulos necesarios
const { src, dest, watch, series, parallel } = require('gulp');

// CSS Y SASS 
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');


// Creación de una tarea llamada "css"
function css( done ) {

    // Seleccionamos el archivo que queremos compilar
    src('src/scss/app.scss') 

        // Compilamos el archivo .scss a .css
        .pipe( sass() )

        // Agregamos prefijos de proveedor CSS a las reglas CSS utilizando el paquete "autoprefixer".
        .pipe( postcss([ autoprefixer() ]))

        // Guardamos el archivo .css resultante en una carpeta de destino
        .pipe( dest('build/css') )

    // Indicamos a Gulp que la tarea ha finalizado
    done();
}



function imagenes() {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest ('build/img') )
}


function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg,jpeg}')
        .pipe( webp( opciones ))
        .pipe( dest('build/img'))
}

function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg,jpeg}')
        .pipe( avif( opciones ))
        .pipe( dest('build/img'))
}

// Creación de una tarea llamada "dev"
function dev() {
    // Vigilamos el archivo "src/scss/app.scss" en busca de cambios
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
}



// Exportamos la tarea para que pueda ser utilizada desde la línea de comandos
exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp, versionAvif, css, dev );


//series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente
//parallel -  Todas inician al mismo tiempo