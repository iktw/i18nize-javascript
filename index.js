var http = require('http'),
    fs = require('fs');

function getJSON(url) {
    return new Promise(function(resolve, reject) {
        http.get(url, function(response) {
            var body = '';

            response.on('data', function(chunk) {
                body += chunk;
            });

            response.on('end', function() {
                var json = JSON.parse(body);
                if (response.statusCode === 200) {
                    resolve(json);
                } else {
                    console.error('Failed to get JSON from', url);
                    reject(json);
                }
            });

        }).on('error', function(error) {
            console.error(error);
            reject(error);
        });
    });
}

function buildUrl(uris) {
    var _uris = uris || [];
    _uris.unshift(this.projectId);
    return "http://www.i18nize.com/api/v1/content/projects/" + _uris.join('/') + '/'.replace(/\/\/+/g, '/');
}

function getLanguages() {
    return getJSON(this.buildUrl(['languages']));
}

function getAndStoreLocaleData(languageCode) {
    var self = this,
      url = this.buildUrl(["locale/", this.live ? languageCode : "development/" + languageCode + "/"]);

    getJSON(url).then(function(jsonData) {
        var fileName = languageCode + ".json",
            fullPath = [self.destinationDir, fileName].join('/').replace(/\/\/+/g, '/'),
            data = JSON.stringify(jsonData, 0, 2);

        fs.writeFile(fullPath, data, function(error) {
            if (error)
                return console.error(error);
            console.log("Downloaded " + languageCode + " to " + fullPath + " (live: " + self.live + ")");
        });
    });
}

function getAllLocales() {
    var self = this;
    this.getLanguages().then(function(jsonData) {
        for (var i = 0; i < jsonData.length; i++) {
            var language = jsonData[i],
                languageCode = language.language_code;
            self.getAndStoreLocaleData(languageCode);
        }
    });
}

function Client(projectId, destinationDir, live) {
    this.projectId = projectId;
    this.destinationDir = destinationDir || './';
    this.live = live || false;

    if (!fs.existsSync(this.destinationDir)) {
        fs.mkdirSync(this.destinationDir);
    }

    this.buildUrl = buildUrl;
    this.getLanguages = getLanguages;
    this.getAndStoreLocaleData = getAndStoreLocaleData;
    this.getAllLocales = getAllLocales;
}

module.exports = Client;
