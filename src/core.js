import request from 'superagent';
import {find} from 'lodash';
import {red, green, underline} from 'chalk';

const url = "http://whatsdeployed.herokuapp.com";

export function whatsOn(server) {  
  return new Promise(function (resolve, reject) {
		  getServers()
      .then(function(servers){
        const match = find(servers, {'name':server});
        if(!match){          
          reject(underline(server) + " was not found");
        }
        resolve(getApplications(match.id));        
      })
	});
};

export function diff (server1, server2) {
  return new Promise(function (resolve, reject) {
		  getServers()
      .then(function(servers){
        const match1 = find(servers, {'name':server1});
        const match2 = find(servers, {'name':server2});
        if(!match1){          
          reject(underline(server1) + " was not found");
        }
        if(!match2){          
          reject(underline(server2) + " was not found");
        }
        
        console.log('unimplemented');
        server1Apps = getApplications(match1.id);
        server2Apps = getApplications(match2.id);
        
        resolve({server1Apps, server2Apps});        
      })
	});
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
				if (err) reject(`Something bad happened trying to get the applications: ${err.message}`); //todo: why isnt this err bubbling up?

				if (!err && res.statusCode == 200) {         
					resolve(res.body); 
				}
			})
	})
}