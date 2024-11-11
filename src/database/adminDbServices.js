import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';

const db = SQLite.openDatabase({ name: 'ERPDB', location: 'default' });

// Fetch data from the database
export const fetchData = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM form_data`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let pendingData = {};
          let approvedData = {};
          let rejectedData = {};

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

          resolve({ pendingData, approvedData, rejectedData });
        },
        error => {
          reject(error);
        },
      );
    });
  });
};

// Update the status of the item in the database, storing the current date and time
export const updateItemStatus = (id, isAccepted, isRejected, reason = '') => {
  const actionDate = moment().format('YYYY-MM-DD'); // Format as YYYY-MM-DD
  const actionTime = moment().format('HH:mm:ss');   // Format as HH:mm:ss
  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE form_data SET isAccepted = ?, isRejected = ?, isPending = 0, actionDate = ?, actionTime = ?, reason = ? WHERE id = ?`,
        [isAccepted, isRejected, actionDate, actionTime, reason, id],
        async () => {
          console.log(`Status updated for item with id ${id}: isAccepted=${isAccepted}, isRejected=${isRejected}, actionDate=${actionDate}, actionTime=${actionTime}`);
          try {
            const updatedData = await fetchData();
            console.log("Updated Data:", updatedData);
            resolve(updatedData);
          } catch (fetchError) {
            console.error("Error fetching updated data:", fetchError);
            reject(fetchError);
          }
        },
        error => {
          console.error(`Error updating status for item with id ${id}:`, error);
          reject(error);
        },
      );
    });
  });
};
