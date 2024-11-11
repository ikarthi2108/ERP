import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

// Open the database
const db = SQLite.openDatabase({ name: 'ERPDB', location: 'default' });

// Function to create the tables
export const createTable = () => {
  db.transaction(tx => {
    // Create the form_data table with additional user fields and new fields
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS form_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requestId TEXT,
        enterpriseName TEXT,
        ownerName TEXT,
        address TEXT,
        city TEXT,
        pincode TEXT,
        mobileNo TEXT,
        email TEXT,
        gstNo TEXT,
        dtpNo TEXT,
        regNo TEXT,
        category TEXT,
        subCategory TEXT,
        dealer TEXT,
        additionalItems TEXT,
        img1 TEXT,
        img2 TEXT,
        img3 TEXT,
        isPending INTEGER,
        isAccepted INTEGER,
        isRejected INTEGER,
        reason TEXT,
        emp_id TEXT,
        name TEXT,
        role TEXT,
        createdTime TEXT,
        createdDate TEXT,
        actionTime TEXT DEFAULT '',
        actionDate TEXT DEFAULT ''
      )`,
      [],
      () => console.log('form_data table created successfully with new fields'),
      error => console.log('Error creating form_data table', error),
    );
  });
};

// Insert form data into form_data table
export const insertData = formData => {
  // Use moment to set createdTime and createdDate
  const createdTime = moment().format('HH:mm:ss'); // Current time in HH:mm:ss format
  const createdDate = moment().format('YYYY-MM-DD'); // Current date in YYYY-MM-DD format

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO form_data (requestId, enterpriseName, ownerName, address, city, pincode, mobileNo, email, gstNo, dtpNo, regNo, category, subCategory, dealer, additionalItems, img1, img2, img3, isPending, isAccepted, isRejected, reason, emp_id, name, role, createdTime, createdDate, actionTime, actionDate) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          formData.requestId,
          formData.enterpriseName,
          formData.ownerName,
          formData.address,
          formData.city,
          formData.pincode,
          formData.mobileNo,
          formData.email,
          formData.gstNo,
          formData.dtpNo,
          formData.regNo,
          formData.category,
          formData.subCategory,
          formData.dealer,
          formData.additionalItems,
          formData.img1,
          formData.img2,
          formData.img3,
          formData.isPending,
          formData.isAccepted,
          formData.isRejected,
          formData.reason,
          formData.emp_id,
          formData.name,
          formData.role,
          createdTime,
          createdDate,
          formData.actionTime || '', // default to empty string if not provided
          formData.actionDate || ''  // default to empty string if not provided
        ],
        (tx, results) => {
          console.log('Form data inserted successfully:', formData);
          resolve(results);
          logAllFormData(); // Log all form data after inserting
        },
        error => {
          console.log('Error inserting form data', error);
          reject(error);
        }
      );
    });
  });
};

// Insert user data into form_data table
export const insertUserData = async () => {
  try {
    // Retrieve user data from AsyncStorage
    const userDataJson = await AsyncStorage.getItem('user_data');
    const userData = userDataJson ? JSON.parse(userDataJson) : null;

    if (userData) {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO form_data (emp_id, name, role, createdTime, createdDate, actionTime, actionDate) VALUES (?, ?, ?, ?, ?, '', '')`,
          [
            userData.emp_id,
            userData.name,
            userData.role,
            moment().format('HH:mm:ss'), // createdTime
            moment().format('YYYY-MM-DD'), // createdDate
          ],
          (tx, results) => {
            console.log('User data inserted successfully into form_data:', userData);
            logAllFormData(); // Log all form data after inserting
          },
          error => console.log('Error inserting user data into form_data', error),
        );
      });
    } else {
      console.log('No user data found in AsyncStorage');
    }
  } catch (error) {
    console.log('Error retrieving user data from AsyncStorage:', error);
  }
};

// Function to log all data in the form_data table
const logAllFormData = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM form_data',
      [],
      (tx, results) => {
        const rows = results.rows;
        let formDataArray = [];
        for (let i = 0; i < rows.length; i++) {
          formDataArray.push(rows.item(i));
        }
        console.log('All form_data records:', formDataArray);
      },
      error => console.log('Error fetching form_data records', error),
    );
  });
};
