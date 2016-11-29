# i18nize
This is a simple *javascript* Client that integrates with the localization service www.i18nize.com

```npm install i18nize --save-dev```


### Config parameters
| Name        | Type | Required | Default | What? |
| ------------- |-------------|-------------|-------------|-------------|
| projectId | String | Yes | undefined | This should be the id of your project. |
| destinationDir | String | No | ./ | The path where you want your locale to get saved. |
| live | Boolean | No | false | Set to *true* if you want to download your live locales otherwise your dev locales will get downloaded. |


### Example usage
```javascript
var Client = require('i18nize');

var client = new Client('86416ce4-fd52-4daf-9764-46f35b07af23', './locales', false);
client.getAllLocales();

OUTPUT:
>> Downloaded en to ./locales/en.json (live: False)
>> Downloaded sv to ./locales/sv.json (live: False)
```
