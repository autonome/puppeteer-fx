#! /usr/bin/env node

const { readFileSync, writeFileSync } = require('fs');


const path = require.resolve('foxdriver/build/config/profile/prefs'),
    config = JSON.parse( readFileSync( process.argv[2] ) );

var file = readFileSync( path ) + '';


function setConfig(file, key, value) {

    value = `user_pref('${key}', ${JSON.stringify( value )})`;

    if (file.includes( key ))
        file.replace(
            new RegExp(`user_pref\\(['"]${key}['"],.+?\\)`, 'i'),  value
        );
    else
        file += `\n${value};`;

    return file;
}


for (let key in config)  file = setConfig(file, key, config[key]);


writeFileSync(path, file);

console.info( file );
