const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {PGlite} = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const root = path.resolve(__dirname,'..');
const read = f => fs.readFileSync(path.join(root,f),'utf8');
(async()=>{
 const results=[];
 const db=new PGlite(); await db.waitReady;
 results.push({version:(await db.query('select version()')).rows[0].version});
 await db.exec(read('demo-database.sql')); await db.exec(read('demo-database.sql'));
 results.push({test:'aggregate setup rerun',pass:true});
 const ctx={window:{}};vm.runInNewContext(read('sql-reproducibility.js'),ctx);
 assert.equal(ctx.window.DBMS_SQL_REPRO.setup.trim(),read('demo-database.sql').replaceAll('\r\n','\n').trim());
 const files=fs.readdirSync(path.join(root,'databases')).filter(f=>f.endsWith('.sql'));
 for(const f of files){
  await db.exec('DROP SCHEMA IF EXISTS subset_test CASCADE; CREATE SCHEMA subset_test; SET search_path TO subset_test;');
  await db.exec(read('databases/'+f));await db.exec(read('databases/'+f));
  const schema=f.replace('.sql','').replaceAll('-','_');
  const tables=(await db.query("SELECT tablename FROM pg_tables WHERE schemaname='subset_test' ORDER BY tablename")).rows;
  for(const {tablename:t} of tables){
   const actual=await db.query(`SELECT * FROM subset_test.${t}`);
   const expected=await db.query(`SELECT * FROM ${schema}.${t}`);
   assert.deepEqual(actual.rows,expected.rows,`${f} ${t} differs from aggregate`);
  }
  results.push({file:'databases/'+f,tables:tables.length,rerun:true,aggregateParity:true});
 }
 await db.exec('SET search_path TO public;');
 await db.exec(read('labs/semester/setup.sql'));await db.exec(read('labs/semester/performance-setup.sql'));
 const count=async q=>Object.values((await db.query(q)).rows[0])[0];
 assert.equal(await count('select count(*)::int from course32.students'),5);
 assert.equal(await count('select count(*)::int from course32.events'),4);
 assert.equal(await count('select count(*)::int from course32.bookings'),6);
 assert.equal(await count('select count(*)::int from course32.perf_purchases'),100000);
 assert.equal(Number(await count('select sum(balance) from course32.accounts')),200);
 results.push({test:'semester fixture and 100000-row performance dataset',pass:true});
 await db.exec('BEGIN;');let rejected=false;try{await db.exec("INSERT INTO course32.bookings(student_id,event_id,paid) VALUES (999,101,false)");}catch{rejected=true;}finally{await db.exec('ROLLBACK');}assert(rejected);
 results.push({test:'invalid foreign key rejected and rolled back',pass:true});
 await db.close();fs.writeFileSync(path.join(__dirname,'sql-validation.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1);});
