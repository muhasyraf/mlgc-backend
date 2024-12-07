const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const getHistoryData = require('../services/getHistoryData');
const crypto = require('crypto');

async function postPredictHandler (request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    if (image.length > 1000000) {
        const response = h.response({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000'
        });
        response.code(413);
        return response;
    }
   
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": label,
        "suggestion": suggestion,
        "createdAt": createdAt,
    }
   

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    });
    await storeData(id, data);
    response.code(201);
    return response;
}

async function getHistoryHandler(request, h) {
    try {
        const historyData = await getHistoryData();
        const data = historyData.map(item => ({
            id: item.id,
            history: {
                result: item.result || null,
                createdAt: item.createdAt || null,
                suggestion: item.suggestion || null,
                id: item.id,    
            }
        }));

        return h.response({
            status: 'success',
            data
        }).code(200);
    } catch (error) {
        console.error('Error getting history:', error);
        return h.response({
            status: 'fail',
            message: 'Failed to fetch history data.'
        }).code(500);
    }
}

module.exports = {
    postPredictHandler,
    getHistoryHandler,
};