module.exports = {
  host: '0.0.0.0',
  port: 8080,
  dir: '.',
  index: 'index.html',
  rewrite: [
    '^(?:(?!.js|.css|.html|.png|.svg|.jpg|.gif|.woff|.ttf|.eot).)+$ /{{index}}'
  ],
  verbose: false
};
