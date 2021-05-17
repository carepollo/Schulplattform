import mysql from 'promise-mysql';
import database from './configDB';

const link_db = mysql.createPool(database.access);
link_db.getConnection().then(connection => {
    link_db.releaseConnection(connection);
    console.log('Database On')
});

export default link_db;