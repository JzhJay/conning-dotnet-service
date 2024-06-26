// Must come first
window.conning = {globals: {authProvider: 'auth0', authDomain: 'test-conning.auth0.com', authClientId: 'HdAO4Xatl0Mf73gmuAbEH4lYvq8WXX4L', features: {billing: false, classic: false}, product: "Risk Solutions"}}

require('stores/index.ts');
require('components/index.ts');
require('./index');

