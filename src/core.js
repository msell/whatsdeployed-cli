import request from 'superagent';
import { find } from 'lodash';
import {red, green, underline} from 'chalk';

const url = "http://whatsdeployed.herokuapp.com";
const projectReducer = (accumulator, app) => {
  if (find(accumulator, {'project': app.project})){
    return accumulator;
  }
  accumulator.push({ "project": app.project });
  return accumulator;
};

const deploymentDetails = (app) => {
  if (!app) {
    return {};
  };

  return {
    "version": app.version,
    "branch": app.branch,
    "packageName": app.packageName
  };
};

const matchResult = (item) => {
  if (!item.server1.packageName || !item.server2.packageName) {
    return "MISSING";
  }

  const versionMatch = item.server2.version === item.server1.version && item.server2.branch === item.server1.branch;
  if (versionMatch) {
    return "EQUAL";
  }

  return "DIFF";
};

const getServers = () => {
  return new Promise((resolve, reject) => {
    request.get(`${url}/servers.json`)
      .end((err, res) => {
        if (err) reject(err.message);

        if (!err && res.statusCode == 200) {
          resolve(res.body);
        }
      });
  });
};

const getApplications = (serverId, server) => {
  return new Promise((resolve, reject) => {
    request.get(`${url}/servers/${serverId}/deployed_apps.json`)
      .end((err, res) => {
        if (err) return reject(`Something bad happened trying to get the applications: ${err.message}`);

        if (!err && res.statusCode == 200) {
          const results = res.body.map((app) => {
            const segments = app.package.split('-');
            const packageName = app.package + '.zip';
            const project = segments[0];
            const version = segments[1];
            let branch = '';

            for (let i = 2; i < segments.length; i++) {
              if (i > 2) {
                branch += '-';
              }
              branch += segments[i];

            }

            return { server, project, version, branch, packageName };
          });
          resolve(results);
        }
      });
  });
};

export const whatsOn = (server) => {
  return new Promise((resolve, reject) => {
		  getServers()
      .then((servers) => {
        const match = find(servers, { 'name': server });
        if (!match) {
          return reject(underline(server) + " was not found");
        }
        resolve(getApplications(match.id));
      });
  });
};

export const diff = (server1, server2) => {
  return new Promise((resolve, reject) => {
		  getServers()
      .then((servers) => {
        const match1 = find(servers, { 'name': server1 });
        const match2 = find(servers, { 'name': server2 });
        if (!match1) {
          return reject(underline(server1) + " was not found");
        }
        if (!match2) {
          return reject(underline(server2) + " was not found");
        }

        const appPromises = [getApplications(match1.id, server1), getApplications(match2.id, server2)];

        Promise.all(appPromises)
          .then((values) => {            
            let [server1Apps, server2Apps] = values;

            let initialValue = [];
            
            let combined = [...server1Apps, ...server2Apps].reduce(projectReducer, initialValue);            
            
            const results = combined.map((final) => {
              const server1Match = find(server1Apps, { 'project': final.project });
              final.server1 = deploymentDetails(server1Match);
              final.server1.name = server1;

              const server2Match = find(server2Apps, { 'project': final.project });
              final.server2 = deploymentDetails(server2Match);
              final.server2.name = server2;

              final.matchType = matchResult(final);
              return final;
            });

            resolve(results);
          });
      });
  });
};


