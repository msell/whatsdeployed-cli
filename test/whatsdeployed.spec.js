import { diff, whatsOn } from '../lib/core.js';
import { find } from 'lodash';
import chai from 'chai';
import { expect } from 'chai';
const should = chai.should();
chai.use(require('chai-as-promised'));

describe('whats deployed on dev1', () => {
	it('should lookup server', () => {
		const result = whatsOn('dev1');
		return result.should.eventually.have.length(15);
	});
});

describe('diff between dev1 and dev5', () => {
  const result = diff('dev1', 'dev5');
  it('should return the correct number of rows', () => {
    return result.should.eventually.have.length(18);
  });
  
  it('should detect different versions deployed', () => {
          
  });
});