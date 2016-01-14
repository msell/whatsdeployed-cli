import request from 'superagent';
import {find} from 'lodash';
import {red, green, underline} from 'chalk';

const url = "http://whatsdeployed.herokuapp.com";

export function whatsOn(server) {  
  return new Promise(function (resolve, reject) {
		  getServers().then(function(servers){
        const match = find(servers, {'name':server});
        if(!match){          
          reject(underline(server) + " was not found");
        }
        // if exists make call to get applications
      })
	});
};

export function diff (server1, server2) {

};


function getServers() {
	return new Promise(function (resolve, reject) {
		request.get(`${url}/servers.json`)
			.end(function (err, res) {
				if (err) reject(err.message);

				if (!err && res.statusCode == 200) {
					resolve(res.body);
				}
			})
	})
}

function getApplications(serverId) {
	return new Promise(function (resolve, reject) {
		request.get(`${url}/servers/${serverId}/deployed_apps.json`)
			.end(function (err, res) {
				if (err) reject(err.message);

				if (!err && res.statusCode == 200) {
					resolve(res.body);
				}
			})
	})
}