let mix = require('laravel-mix');

mix.js('resources/js/main.js', 'src/js').vue();
mix.sass('resources/scss/main.scss', 'src/css');