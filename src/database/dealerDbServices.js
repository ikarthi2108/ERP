// src/database/dealerDbServices.js

import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';

const db = SQLite.openDatabase({ name: 'ERPDB', location: 'default' });

// Fetch data from the database by emp_id
export const fetchDataByEmpId = (emp_id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM form_data WHERE emp_id = ?`,
        [emp_id],
        (tx, results) => {
          const rows = results.rows;
          let pendingData = {};
          let approvedData = {};
          let rejectedData = {};
          let totalItems = rows.length;

          console.log(`Total items in the database for emp_id ${emp_id}: ${totalItems}`);

          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            const date = item.createdDate;
            const formattedDate = moment(date).isSame(moment(), 'day') ? 'Today' : moment(date).format('YYYY-MM-DD');

            if (item.isPending === 1 && item.isAccepted === 0 && item.isRejected === 0) {
              if (!pendingData[formattedDate]) pendingData[formattedDate] = [];
              pendingData[formattedDate].push(item);
            } else if (item.isAccepted === 1 && item.isRejected === 0) {
              if (!approvedData[formattedDate]) approvedData[formattedDate] = [];
              approvedData[formattedDate].push(item);
            } else if (item.isRejected === 1) {
              if (!rejectedData[formattedDate]) rejectedData[formattedDate] = [];
              rejectedData[formattedDate].push(item);
            }
          }

          const pendingCount = Object.values(pendingData).reduce((acc, arr) => acc + arr.length, 0);
          const approvedCount = Object.values(approvedData).reduce((acc, arr) => acc + arr.length, 0);
          const rejectedCount = Object.values(rejectedData).reduce((acc, arr) => acc + arr.length, 0);

          console.log(`Pending count: ${pendingCount}, Approved count: ${approvedCount}, Rejected count: ${rejectedCount}`);

          resolve({ pendingData, approvedData, rejectedData });
        },
        error => {
          reject(error);
        },
      );
    });
  });
};
