const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');

const dist = path.resolve(`${__dirname}/dist/psb-bi`);

const app = new Koa();
app.use(serve(dist));

const ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || '0.0.0.0';

const port =
  process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.OPENSHIFT_INTERNAL_PORT ||
  process.env.PORT ||
  8080;

app.listen(port, ipaddress, () => {
  console.log(`${new Date()} Server is listening on port 8080`);
});

console.log(`Static Listen Port: ${port}`);
