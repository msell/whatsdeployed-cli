#!/usr/bin/env node

import {red, green, underline} from 'chalk';
import {argv} from 'yargs';
import prompt from 'cli-prompt';
import * as process from 'process';
import {whatsOn, diff} from './core.js';
import { sortBy } from 'lodash';

if (process.argv.length < 3) {
  console.log(red("off to see the wizard..."));
}
else if (process.argv[2].toLowerCase() === 'diff'){
  if(process.argv.length < 5){
    console.log(red("you must supply at least 2 servers for diff operation"));
  }
  else{
    // can we use spread operator to clean this up?
    const server1 = process.argv[3];
    const server2 = process.argv[4];
    diff(server1, server2)
      .then(function(results){
        console.log(results);
      });
  }
}
else {
  const server = process.argv[2].toLowerCase();
  whatsOn(server).then(function (apps) {

    for (let app of sortBy(apps, 'package')) {
      console.log(green(app.package));
    }
  })
    .catch(function (err) {
      console.log(red(err));
    });

}

