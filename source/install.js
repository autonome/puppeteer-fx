#! /usr/bin/env node

const { readFileSync, writeFileSync } = require('fs');


const path = 'node_modules/foxdriver/build/config/profile/prefs.js',
    config = 'user_pref(\'dom.disable_open_during_load\', false)';

var file = readFileSync( path ) + '';


if ( file.includes('dom.disable_open_during_load') )
    file.replace(
        /user_pref\(['"]dom\.disable_open_during_load['"],\s*true\)/i,  config
    );
else
    file += `\n${config};`;

writeFileSync(path, file);

console.info( file );
