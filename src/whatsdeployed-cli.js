#!/usr/bin/env node

import * as git from 'git-rev';
import {red, green, underline} from 'chalk';
import {argv} from 'yargs';
import {readFile, writeFile} from 'fs';
import * as path from 'path';
import * as process from 'process';
import prompt from 'cli-prompt';
import {plans} from './bamboo.js';

let branch = 'folder not under Git source control';
let settings = null;
let projectName = path.basename(process.cwd());

var getBranch = new Promise(function (resolve, reject) {
  git.branch(function (str) {
    branch = str;
    resolve(str);
  })
});


if (argv._.find(x=> x === 'diff')) {
  getBranch.then(
    function () {

      console.log('project name ' + projectName);

      console.log(`you must be tryin to kick a build on ${green.underline(branch)} but that functionality is not implemented yet.`);
    }

    )
    .catch(function (reason) {
      console.log(`damnit jim ${reason}`);
    })

}

if(argv._.find(x=> x === 'plans')){
  plans().then(function(data){
    console.log(data);
  })

}
