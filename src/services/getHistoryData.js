const { Firestore } = require('@google-cloud/firestore');

async function getHistoryData() {
    const db = new Firestore();
    const predictCollection = db.collection('predictions');
    const snapshot = await predictCollection.get();
    
    if (snapshot.empty) {
        return []; 
    }

    const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() 
    }));
    return historyData;
}

module.exports = getHistoryData;