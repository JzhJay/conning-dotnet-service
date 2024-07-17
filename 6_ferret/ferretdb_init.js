print('Start #################################################################');

db = db.getSiblingDB('admin');
db.dropUser('rancher-user');
db = db.getSiblingDB('omdb_rancher');
db.dropDatabase;

db = db.getSiblingDB('admin');
db.createUser(
  {
    user: 'rancher-user',
    pwd: 'ConningRS**',
    roles: [{ role: 'readWrite', db: 'omdb_rancher' },
            { role: 'readWrite', db: 'auth_conning' },
            { role: 'readWrite', db: 'auth_prod-rancher-conning' }],
  },
);

db = db.getSiblingDB('auth_conning');
db = db.getSiblingDB('auth_prod-rancher-conning');

print('END #################################################################');