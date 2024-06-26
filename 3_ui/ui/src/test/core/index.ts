//export const mocha = require('lib/mocha/mocha.js') as Mocha;
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

export const enzyme = Enzyme;
export const chaiEnzyme = require('chai-enzyme') as any;
export const expect: any = chai.expect;
export const isPhantomJS = (window as any).top.callPhantom != null;
export const chaiJquery: any = require('chai-jquery');

chai.use(require('chai-as-promised') as any);   
chai.use(chaiEnzyme())
chai.use(chaiJquery)


export * from './utils';
export * from './testScheduler';
export * from './constants';
export * from './queryHelper';
