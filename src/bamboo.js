import request from 'superagent';
const url = "http://vmdevpro-06.onetech.local:8085/rest/api/latest/";
export const pageSize = 25;

export let plans = function plans() {
	return new Promise(function (resolve, reject) {

		getPlans(1).then(function (data) {
			const totalPages = (data.totalPlans + pageSize - 1) / pageSize;
			if (totalPages > 1) {
				let additionalPages = [];
				for (let i = 2; i < totalPages; i++) {
					additionalPages.push(getPlans(i));
				}

				var results = data.plans;
				Promise.all(additionalPages).then(function(additionalResults){

					for(let x of additionalResults){
						results = results.concat(x.plans);
					}
					const filteredPlans = results.filter((p)=>{return p.key.startsWith('BAM-')});
					resolve(filteredPlans);
				})
			}
		})
	});

}

function getPlans(page = 1) {
	let startIndex = pageSize * page - pageSize;

	return new Promise(function (resolve, reject) {
		request.get(`${url}plan.json?start-index=${startIndex}`)
			.end(function (err, res) {
				if (err) reject(err.message);

				if (!err && res.statusCode == 200) {
					const plans = res.body.plans.plan;
					const totalPlans = res.body.plans.size;
					resolve({ plans, totalPlans });
				}
			})
	})
}

