#!/usr/bin/env node

import {red, bgWhite, white, green, blue, yellow, underline} from 'chalk';
import prompt from 'cli-prompt';
import * as process from 'process';
import {whatsOn, diff} from './core.js';
import { sortBy } from 'lodash';
import Table from 'cli-table';

if (process.argv.length < 3) {
  console.log(red("off to see the wizard..."));
}
else if (process.argv[2].toLowerCase() === 'diff') {
  if (process.argv.length < 5) {
    console.log(red("you must supply at least 2 servers for diff operation"));
  }
  else {
    const server1 = process.argv[3];
    const server2 = process.argv[4];

    diff(server1, server2)
      .then((results) => {
        
        const table = new Table({
          head: [blue('Application'), blue(server1), blue(server2)]
        });
               
        for (let app of sortBy(results,'project')) {
          let color = green;
          if (app.matchType === 'DIFF') {
            color = yellow;
          }         

          const project = white(app.project);
          let server1Display = red("Not Found");
          if(app.server1.branch){
            server1Display = color(`${app.server1.branch}-${app.server1.version}`);
          };
          
          let server2Display = red("Not Found");
          if(app.server2.branch){
            server2Display = color(`${app.server2.branch}-${app.server2.version}`);
          };
          
          table.push([project, server1Display, server2Display]);
        }

        console.log(table.toString());
      })
      .catch((err) => {
        console.log(red(err));
      });;
  }
}
else {
  const server = process.argv[2].toLowerCase();
  whatsOn(server).then((apps) => {

    const table = new Table({
      head: ['Server', 'Application', 'Branch', 'Version']
    });

    for (let app of sortBy(apps, 'packageName')) {
      table.push(
        [server, app.project, app.branch, app.version]
        )
    }
    console.log(table.toString());
  })
    .catch((err) => {
      console.log(red(err));
    });

}
