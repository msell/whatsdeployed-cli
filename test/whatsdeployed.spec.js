import {whatsOn} from '../lib/core.js';
import chai from 'chai';
const should = chai.should();
chai.use(require('chai-as-promised'));
const sinon = require('sinon');

describe('bamboo integration', () => {
	it('should find build plans', () => {

		// let ajaxStub = sinon.stub();
		// ajaxStub.onCall(1).returns(require('./json/page1.json'));
		// ajaxStub.onCall(2).returns(require('./json/page2.json'));
		// ajaxStub.onCall(3).returns(require('./json/page3.json'));

		const result = whatsOn('corpdev13');

		return result.should.eventually.have.length(41);
	});

});