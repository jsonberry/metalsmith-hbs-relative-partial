'use strict'

const { readFile: read } = require('fs');
const { resolve, format, dirname, basename, extname } = require('path');
const Handlebars = require('handlebars');
const colors = require('colors');


module.exports = (opts) => {
    const {
        dirName: dirName = 'partials'
    } = opts;

    return function(files, metalsmith, done) {
        const src = metalsmith.source();
        const arrPromises = [];
        const partials = getFiles(files, dirName);

        if (!partials) {
            console.log('Metalsmith HBS Relative Partial plugin exited: No partials found to process'.yellow.bgBlack.bold);
            done();
            return;
        }

        partials.forEach((file) => arrPromises.push(onFile(file, src, dirName)));

        Promise.all(arrPromises)
            .then((d) => d.forEach((p) => hbsRegPart(p)))
            .then((d) => done())
            .catch((e) => done(e));
    };
}

/*
*    Helpers
*/

function onFile(file, src, dirName) {
    const dir = new RegExp(`/${dirName}`);
    const directory = dirname(file).replace(dir, '');
    const id = format({
        directory: `${directory}`,
        base: `${basename(file, extname(file))}`
    });

    return new Promise((res) => {
        read(`${src}/${file}`, 'utf8', (err, contents) => {
            res({
                id: `${directory}/${id}`,
                contents: contents,
                file: file
            });
        });
    })
}

function hbsRegPart(partial) {
    const {
        id: i = false,
        contents: c = false,
        file: file = false
    } = partial;

    if (!i) { throw new Error(`Metalsmith HBS Relative Partial Error - Partial needs a valid ID in order to process: ${file}`) }
    if (!c) { throw new Error(`Metalsmith HBS Relative Partial Error - Partial needs valid contents in order to process: ${file}`) }

    Handlebars.registerPartial(i, c)
}

function getFiles(files, dirName) {
    let partials =  Object.keys(files).reduce((acc, val) => {
        if (val.split('/').includes(dirName)) {
            acc.push(val);
        }

        return acc;
    }, []);

    return (partials.length === 0 ?  false :  partials);
}
