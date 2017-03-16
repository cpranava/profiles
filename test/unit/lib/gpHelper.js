const gpHelper = require('../../../app/lib/gpHelper');
const chai = require('chai');

const expect = chai.expect;

describe('gp counts helper', () => {
  describe('areGpsAvailable', () => {
    it('should return false missing gp counts', () => {
      const result = gpHelper.areGpsAvailable(undefined);
      expect(result).to.equal(false);
    });

    it('should return false for zero male and female gp counts', () => {
      const gpCounts = {
        male: 0,
        female: 0
      };
      const result = gpHelper.areGpsAvailable(gpCounts);
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.false;
    });

    it('should return true for more than one male gp counts', () => {
      const gpCounts = {
        male: 1,
        female: 0
      };
      const result = gpHelper.areGpsAvailable(gpCounts);
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.true;
    });

    it('should return true for more than one female gp counts', () => {
      const gpCounts = {
        female: 1,
        male: 0
      };
      const result = gpHelper.areGpsAvailable(gpCounts);
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.true;
    });

    it('should return false for zero unknown gp counts', () => {
      const gpCounts = {
        unknown: 0
      };
      const result = gpHelper.areGpsAvailable(gpCounts);
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.false;
    });

    it('should return true for more than one unknown gp counts', () => {
      const gpCounts = {
        unknown: 1
      };
      const result = gpHelper.areGpsAvailable(gpCounts);
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.true;
    });
  });

  describe('getGpCountMessages', () => {
    it('should return \'GPs\' for more than one male or female gp', () => {
      const gpCounts = {
        male: 3,
        female: 2
      };
      const message = gpHelper.getGpCountMessages(gpCounts);
      expect(message[0]).to.equal('2 female GPs');
      expect(message[1]).to.equal('3 male GPs');
    });

    it('should return \'GP\' for only one male or female gp', () => {
      const gpCounts = {
        male: 1,
        female: 1
      };
      const message = gpHelper.getGpCountMessages(gpCounts);
      expect(message[0]).to.equal('1 female GP');
      expect(message[1]).to.equal('1 male GP');
    });

    it('should return \'GPs\' for more than one unknown or female gp', () => {
      const gpCounts = {
        unknown: 2
      };
      const message = gpHelper.getGpCountMessages(gpCounts);
      expect(message[0]).to.equal('2 GPs');
    });

    it('should return \'GP\' for only one unknown gp', () => {
      const gpCounts = {
        unknown: 1
      };
      const message = gpHelper.getGpCountMessages(gpCounts);
      expect(message[0]).to.equal('1 GP');
    });
  });

  describe.only('getBookOnlineLink', () => {
    const odsCode = 'A12345';
    const gpWebsite = 'http://gp.website.com';

    describe('edge cases', () => {
      it('should return the GPs website when there is no supplier', () => {
        const gpData = {
          odsCode,
          contact: { website: gpWebsite }
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        expect(bookOnlineLink).to.be.equal(gpWebsite);
      });

      it('should return undefined when there is no supplier and no GP website', () => {
        const gpData = {
          odsCode,
          contact: {}
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookOnlineLink).to.be.undefined;
      });
    });

    describe('for known systems', () => {
      it('should return the suppliers system address for EMIS', () => {
        const gpData = {
          odsCode,
          supplier: 'EMIS',
          contact: {}
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        expect(bookOnlineLink).to.be.equal('https://patient.emisaccess.co.uk/Account/Login');
      });

      it('should return the suppliers system address for INPS', () => {
        const gpData = {
          odsCode,
          supplier: 'INPS',
          contact: {}
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        expect(bookOnlineLink).to.be.equal('https://www.myvisiononline.co.uk/vpp/');
      });

      it('should return the suppliers system address for Informatica', () => {
        const gpData = {
          odsCode,
          supplier: 'Informatica',
          contact: {}
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        expect(bookOnlineLink).to.be.equal('https://www.myvisiononline.co.uk/vpp/');
      });

      it('should return the suppliers system address for Microtest', () => {
        const gpData = {
          odsCode,
          supplier: 'Microtest',
          contact: {}
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        expect(bookOnlineLink).to.be.equal('https://www.thewaiting-room.net/');
      });

      it('should return the GPs website address for NK', () => {
        const gpData = {
          odsCode,
          supplier: 'NK',
          contact: { website: gpWebsite }
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        expect(bookOnlineLink).to.be.equal(gpWebsite);
      });

      it('should return undefined when no GP website is available for NK', () => {
        const gpData = {
          odsCode,
          supplier: 'NK',
          contact: {}
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookOnlineLink).to.be.undefined;
      });

      it('should return the suppliers system address for TPP', () => {
        const gpData = {
          odsCode,
          supplier: 'TPP',
          contact: {}
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        expect(bookOnlineLink).to.be.equal(`https://systmonline.tpp-uk.com/Login?PracticeId=${odsCode}`);
      });
    });

    describe('for unknown systems', () => {
      it('should return undefined when no GP website is available', () => {
        const gpData = {
          odsCode,
          supplier: 'EMIS (I)',
          contact: {}
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        // eslint-disable-next-line no-unused-expressions
        expect(bookOnlineLink).to.be.undefined;
      });

      it('should return the GPs website address for EMIS (I) link', () => {
        const gpData = {
          odsCode,
          supplier: 'EMIS (I)',
          contact: { website: gpWebsite }
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        expect(bookOnlineLink).to.be.equal(gpWebsite);
      });

      it('should return the GPs website address for INPS (I) link', () => {
        const gpData = {
          odsCode,
          supplier: 'INPS (I)',
          contact: { website: gpWebsite }
        };

        const bookOnlineLink = gpHelper.getBookOnlineLink(gpData);

        expect(bookOnlineLink).to.be.equal(gpWebsite);
      });
    });
  });
});

