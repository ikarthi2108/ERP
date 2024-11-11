//database/database.js

import SQLite from 'react-native-sqlite-storage';

// Open or create a database
const database = SQLite.openDatabase(
  { name: 'ERPDB', location: 'default' },
  () => console.log('Database opened successfully'),
  (error) => console.error('Failed to open database:', error)
);

// Function to initialize tables and populate user data
export const initializeDatabase = () => {
  database.transaction((tx) => {
    // Create the users table with additional fields address, phno, and email
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emp_id TEXT UNIQUE,
        name TEXT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        address TEXT DEFAULT '',
        phno TEXT DEFAULT '',
        email TEXT DEFAULT ''
      );`,
      [],
      () => console.log('Users table created successfully with address, phno, and email fields'),
      (error) => console.error('Failed to create users table:', error)
    );

    // Insert default users with the address, phno, and email fields
    const defaultUsers = [
      { emp_id: 'EMP001', name: 'Admin User', username: 'admin', password: 'admin123', role: 'admin', address: '', phno: '', email: '' },
      { emp_id: 'EMP002', name: 'User One', username: 'user1', password: 'password1', role: 'user', address: '', phno: '', email: '' },
      { emp_id: 'EMP003', name: 'User Two', username: 'user2', password: 'password2', role: 'user', address: '', phno: '', email: '' },
      { emp_id: 'EMP004', name: 'User Three', username: 'user3', password: 'password3', role: 'user', address: '', phno: '', email: '' },
    ];
    

    // Insert users into the users table
    defaultUsers.forEach(({ emp_id, name, username, password, role, address, phno, email }) => {
      tx.executeSql(
        'INSERT OR IGNORE INTO users (emp_id, name, username, password, role, address, phno, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [emp_id, name, username, password, role, address, phno, email],
        () => console.log(`User ${username} inserted successfully`),
        (error) => console.error(`Failed to insert user ${username}:`, error)
      );
    });
  },
  (error) => console.error('Transaction error:', error),
  () => console.log('Database initialization successful'));
};

// Function to get user data by emp_id
export const getUserData = (empId, callback) => {
  console.log('Fetching user data for emp_id:', empId); // Log emp_id

  database.transaction((tx) => {
    tx.executeSql(
      'SELECT name, emp_id, phno AS phone, email, address FROM users WHERE emp_id = ?',
      [empId],
      (_, { rows }) => {
        if (rows.length > 0) {
          const userData = rows.item(0);
          console.log('User data retrieved:', userData); // Log the data fetched from DB
          callback(null, userData); // Pass user data to the callback
        } else {
          console.log('No user found for emp_id:', empId); // Log if no user is found
          callback('User not found', null);
        }
      },
      (error) => {
        console.error('Failed to retrieve user data:', error);
        callback(error, null);
      }
    );
  });
};

// Function to update the profile in the database (without AsyncStorage)
export const updateProfile = (name, phone, email, address, empId, callback) => {
  // Log the received data before the update
  console.log('Updating profile with the following data:');
  console.log('Name:', name);
  console.log('Phone:', phone);
  console.log('Email:', email);
  console.log('Address:', address);
  console.log('Employee ID:', empId);

  database.transaction((tx) => {
    tx.executeSql(
      'UPDATE users SET name = ?, phno = ?, email = ?, address = ? WHERE emp_id = ?',
      [name, phone, email, address, empId],
      () => {
        // Success callback
        console.log('Profile updated successfullyy');
        callback(null); // Success
      },
      (error) => {
        // Error callback
        console.error('Failed to update profile:', error);
        callback(error); // Failure
      }
    );
  });
};
// Function to add a new user to the database
export const addUserToDatabase = (username, password, callback) => {
  // Generate a random employee ID (e.g., EMP005)
  const empId = `EMP${Math.floor(1000 + Math.random() * 9000)}`;

  database.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO users (emp_id, name, username, password, role, address, phno, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
      [empId, username, username, password, 'user', '', '', ''], // Default role is 'user' and other fields are empty
      () => {
        console.log('User added successfully');
        callback(null); // Success
      },
      (error) => {
        console.error('Failed to add user:', error);
        callback(error); // Error
      }
    );
  });
};
// Export the database instance
export const getDatabase = () => database;
