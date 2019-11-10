const fs = require('fs');
const db = require('better-sqlite3');

const initPath = './init.sql';
const insertsPath = './test_insert.sql';

/* HashDB manages a simple sqlite db for the hashes
*
*  Constructor takes a path to a file and a boolean flag for whether to insert some test values.
*
*  Some notes:
*  If the db file doesn't exist, a new one is created.
*  Test values are only inserted if the db was freshly created, nuke your db if you modify the test insert file
*/
module.exports = class HashDB {
  constructor (path, insertTests = false) {
    const existed = fs.readFileSync(path, 'utf8');
    this.db = new db(path);
    this.runFile(initPath);
    this.getQ = this.db.prepare('SELECT * FROM img_hash WHERE hash = ?');
    this.addQ = this.db.prepare('INSERT INTO img_hash VALUES("?")');
    if(!existed && insertTests) this.runFile(insertsPath);
  }

  runFile(path) {
    try {
      const file = fs.readFileSync(path, 'utf8');
      this.db.exec(file);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  hasHash(hash) {
    return Boolean(this.getQ.get(hash));
  }

  addHash(hash) {
    this.addQ.run(hash);
  }

  close() {
    this.db.close();
  }
}
