var connect = require('connect'),
    serveStatic = require('serve-static'),
    modRewrite = require('connect-modrewrite'),
    yargs = require('yargs'),
    chalk = require('chalk'),
    pkg = require('./package.json'),
    config = require('./config');

var argv = yargs
  .usage('Usage: $0 [options]')
  .options({
    'h': {
      alias: ['host', 'ip'],
      describe: 'Host or IP to bind'
    },

    'p': {
      alias: 'port',
      describe: 'Port'
    },

    'd': {
      alias: ['dir', 'root'],
      describe: 'Root directory'
    },

    'i': {
      alias: 'index',
      describe: 'Index file'
    },

    'c': {
      alias: ['config', 'conf'],
      describe: 'Config module'
    }
  })
  .help('help')
  .version(function () {
    return pkg.version;
  })
  .default({
    'host': config.host,
    'port': config.port,
    'root': config.dir,
    'index': config.index,
    'config': './config'
  })
  .argv;

if (argv.config) {
  config = require(argv.config);
}

var rewriteRules = config.rewrite;

rewriteRules.forEach(function (rule, i) {
  var re = /{{([^{}]+)}}/g;
  var match = null;
  var prop = '';

  while (
    (match = re.exec(rule)) &&
    (prop = match[1]) &&
    argv.hasOwnProperty(prop)
  ) {
    rewriteRules[i] = rule.replace(new RegExp('{{' + prop + '}}', 'g'), argv[prop]);
  }
});

var app = connect();

app.use(modRewrite(rewriteRules));
app.use(serveStatic(argv.root));

app.listen(argv.port, argv.host, function (err) {
  console.log('s1', (!err ?  chalk.green('started') : chalk.red('failed')));

  if (!err) {
    console.log('Address: ' + argv.host + ':' + argv.port);
    console.log('Root: ' + argv.root);
    console.log('Index: ' + argv.index);
  }
  else {
    console.error(err.stack);
  }
});
