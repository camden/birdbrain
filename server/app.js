"use strict";
exports.__esModule = true;
var express_1 = require("express");
var path_1 = require("path");
var app = express_1["default"]();
app.use('/static', express_1["default"].static(path_1["default"].resolve(__dirname, '../client/build/static/')));
app.use('/favicon.ico', express_1["default"].static(path_1["default"].resolve(__dirname, '../client/build/favicon.ico')));
app.use('/favicon-32x32.png', express_1["default"].static(path_1["default"].resolve(__dirname, '../client/build/favicon-32x32.png')));
app.use('/favicon-64x64.png', express_1["default"].static(path_1["default"].resolve(__dirname, '../client/build/favicon-64x64.png')));
app.use('/site.webmanifest', express_1["default"].static(path_1["default"].resolve(__dirname, '../client/build/site.webmanifest')));
app.use('/apple-touch-icon.png', express_1["default"].static(path_1["default"].resolve(__dirname, '../client/build/apple-touch-icon.png')));
app.use('/safari-pinned-tab.svg', express_1["default"].static(path_1["default"].resolve(__dirname, '../client/build/safari-pinned-tab.svg')));
app.get('*', function (req, res) {
    res.sendFile(path_1["default"].resolve(__dirname, '../client/build/index.html'));
});
app.listen(process.env.PORT || 3000, function () {
    console.log("Example app listening on port " + (process.env.PORT || 3000) + "!");
});
