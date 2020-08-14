const moment = require('moment');

function messageFormat(user, msg){
    return {
        user, msg, time: moment().format('h:mm a')
    }
}

module.exports = messageFormat;