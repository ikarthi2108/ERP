import SQLite from 'react-native-sqlite-storage';

const database = SQLite.openDatabase(
  { name: 'ERPDB', location: 'default' },
  () => console.log('Database opened successfully'),
  (error) => console.error('Failed to open database:', error)
);

export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (tx, results) => {
          if (results.rows.length > 0) {
            const user = results.rows.item(0);
            resolve(user);
          } else {
            reject(new Error('Invalid username or password'));
          }
        },
        (error) => reject(error)
      );
    });
  });
};
