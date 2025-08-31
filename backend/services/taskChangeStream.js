const Task = require('../models/Task');

const initializeTaskChangeStream = (io) => {
  const changeStream = Task.watch();

  console.log('MongoDB Change Stream for Tasks is now active.');


  changeStream.on('change', (change) => {
    console.log('Change detected in tasks collection:', change);

    let eventData = {
      type: change.operationType, 
      documentId: change.documentKey._id
    };

    switch (change.operationType) {
      case 'insert':
        eventData.data = change.fullDocument;
        break;
      case 'update':
        eventData.data = change.updateDescription.updatedFields;
        break;
      case 'delete':

        break;
    }
    

    io.emit('taskChange', eventData);
  });

  changeStream.on('error', (error) => {
    console.error('Error in Task Change Stream:', error);
  });
};

module.exports = initializeTaskChangeStream;
