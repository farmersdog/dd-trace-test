const tracer = require('dd-trace').init();
const Sequelize = require('sequelize');
const cls = require('cls-hooked');

namespace = cls.createNamespace('namespace');
Sequelize.cls = namespace;
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'postgres',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 1,
    idle: 5000
  },
});

let Foo = sequelize.define('foo', {
  unique: {type: Sequelize.STRING, unique: true},
});

async function runTransactions() {
  await Foo.sync({force: true});
  await sequelize.transaction(async function () {
    console.log('\n\ncreating bar');
    await Foo.create({ unique: 'bar' });
    console.log('\n\ncreating baz');
    await Foo.create({ unique: 'baz' });
    console.log('\n\nclosing transaction');
    return;
  });
  await sequelize.transaction(async function () {
    console.log('\n\nget bar')
    let bar = await Foo.findOne({ where: {unique: 'bar'} });
    console.log('bar id: ' + bar.id);
    console.log('\n\nGets stuck on failed attempt to create bar a second time.');
    await Foo.create({ unique: 'bar' });
    /* Code below this point is never reached */
    console.log('\n\nget baz');
    let baz = await Foo.findOne({ where: {unique: 'baz'} });
    console.log('baz id: ' + baz.id);
    console.log('closing transaction');
    return;
  });
}

runTransactions();
