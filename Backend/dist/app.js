"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const app = Express();
app.use(Express.json());
const port = 3000;
app.get('/', function (req, res) {
    res.send('hello from express');
});
app.listen(port, () => {
    console.log(`listening on port${port}`);
});
//# sourceMappingURL=app.js.map