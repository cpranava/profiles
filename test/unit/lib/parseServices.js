const chai = require('chai');
const parseServices = require('../../../app/lib/parseServices');

const expect = chai.expect;

describe('parseServices', () => {
  const selfRefService = { gpReferralRequired: false, title: 'self ref service' };
  const gpRefService = { gpReferralRequired: true, title: 'gp ref service' };

  it('should return undefined for undefined', () => {
    const results = parseServices(undefined);

    // eslint-disable-next-line no-unused-expressions
    expect(results).to.be.undefined;
  });

  it('should return undefined for empty object', () => {
    const results = parseServices({});

    // eslint-disable-next-line no-unused-expressions
    expect(results).to.be.undefined;
  });

  it('should return undefined when no entries', () => {
    const results = parseServices({ entries: [] });

    // eslint-disable-next-line no-unused-expressions
    expect(results).to.be.undefined;
  });

  it('should return an array of services where referrals are required', () => {
    const results = parseServices({ entries: [gpRefService] });

    // eslint-disable-next-line no-unused-expressions
    expect(results).to.not.be.undefined;
    const gpRefs = results.gpReferrals;
    // eslint-disable-next-line no-unused-expressions
    expect(gpRefs).to.not.be.undefined;
    expect(gpRefs.length).to.equal(1);
    expect(gpRefs[0]).to.equal(gpRefService.title);
  });

  it('should return an array of services where referrals are not required', () => {
    const results = parseServices({ entries: [selfRefService] });

    // eslint-disable-next-line no-unused-expressions
    expect(results).to.not.be.undefined;
    const selfRefs = results.selfReferrals;
    // eslint-disable-next-line no-unused-expressions
    expect(selfRefs).to.not.be.undefined;
    expect(selfRefs.length).to.equal(1);
    expect(selfRefs[0]).to.equal(selfRefService.title);
  });
});