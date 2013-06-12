var restler = require('restler');
var DEBUG = 0;
var INFO = 1;

function debug(message) {
    if (DEBUG == 1) {
        console.log(message);
    }
    return;
}

function info(message) {
    if (INFO == 1) {
        console.log(message);
    }
    return;
}

function _multiRequest(d, callback, items) {
    items = items || [];
    var request = getRequest(d);
    restler.get(request).on('success', function(response) {
        if (response.data && response.data.items) {
            debug(JSON.stringify(response.data.items));
            if (response.data.items[response.data.items.length-1].timestampMs < d.oldest) {
                for (var i = 0; i < response.data.items.length; i++) {
                    items.push(resposne.data.items[i]);
                }
                return callback(items);
            } else {
                items = items.concat(response.data.items);
                d.newest = response.data.items[response.data.items.length - 1].timestampMs - 1;
                return _multiRequest(d, callback, items);
            }
        } else {
            callback(items);
        }
    });
}

function multiRequest(d, callback) { 
    return _multiRequest(d,callback);
}

function getRequest(d) {
    d.newest = d.newest || (new Date()).getTime();
    d.oldest = d.oldest || 0;
    d.granularity = d.granularity || "best";
    d.fields = d.fields || "items";
    d.maxresults = d.maxresults || "1000";

    if (!d.baseUrl) {  return null; }
    var request = d.baseUrl;
    request += "?fields=" + d.fields;
    request += "&granularity=" + d.granularity;
    request += "&max-results=" + d.maxresults;
    request += "&min-time=" + d.oldest;
    request += "&max-time=" + d.newest;
    request += "&access_token=" + d.accesstoken;

    debug('getRequest request ' + request);
    return request;
}

/*
multiRequest({
    "accesstoken": "ya29.AHES6ZRR9D_k_i4BEBUro-_fGtZrUy9wk-WOj9b6Emv3gaIaQDnYf80V",
    "baseUrl": "https://www.googleapis.com/latitude/v1/location",
    "granularity": "best",
    "fields": "items(latitude%2Clongitude%2CtimestampMs)",
    "maxresults": 1000,
    "oldest": "1370896150000"
}, function(response) {
    info(JSON.stringify(response));
});
*/
