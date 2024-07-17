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
    roles: [],
  },
);

db = db.getSiblingDB('auth_conning');
db = db.getSiblingDB('auth_prod-rancher-conning');

print('END #################################################################');