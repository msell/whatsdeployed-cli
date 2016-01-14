#!/usr/bin/env node

import {red, green, underline} from 'chalk';
import {argv} from 'yargs';
import prompt from 'cli-prompt';
import * as process from 'process';
import {whatsOn, diff} from './core.js';

if (process.argv.length < 3) {
  console.log(red("off to see the wizard..."));
} else {
  const server = process.argv[2].toLowerCase();
  whatsOn(server).then(function (apps) {    
    for (let app of apps) {
      console.log(green(app.package));
    }
  })
  .catch(function(err){
    console.log(red(err));
  });

}

