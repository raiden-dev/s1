var path = require('path'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    modRewrite = require('connect-modrewrite'),
    yargs = require('yargs'),
    chalk = require('chalk'),
    pkg = require('./package.json'),
    defaultConfig = require('./config');

var argv = yargs
  .usage('Usage: $0 [options]')
  .options({
    'h': {
      alias: ['host', 'ip'],
      type: 'string',
      describe: 'Host or IP to bind'
    },

    'p': {
      alias: 'port',
      type: 'number',
      describe: 'Port number'
    },

    'd': {
      alias: ['dir', 'root'],
      type: 'string',
      describe: 'Root directory'
    },

    'i': {
      alias: 'index',
      type: 'string',
      describe: 'Index file'
    },

    'c': {
      alias: ['config', 'conf'],
      type: 'string',
      describe: 'Config module'
    },

    'v': {
      alias: 'verbose',
      type: 'boolean',
      describe: 'Verbose logging'
    }
  })
  .help('help')
  .version(function () {
    return pkg.version;
  })
  .argv;

var config = null,
    configPath = '';

if (argv.config) {
  configPath = path.join(process.cwd(), argv.config);
  config = require(configPath);
}

config = Object.assign({}, defaultConfig, argv, config);

var rewriteRules = config.rewrite;

rewriteRules.forEach(function (rule, i) {
  var re = /{{([^{}]+)}}/g;
  var match = null;
  var prop = '';

  while (
    (match = re.exec(rule)) &&
    (prop = match[1]) &&
    config.hasOwnProperty(prop)
  ) {
    rewriteRules[i] = rule.replace(new RegExp('{{' + prop + '}}', 'g'), config[prop]);
  }
});

var app = connect();

app.use(function (req, res, next) {
  if (config.verbose) {
    console.log('\nURL:', req.url);
    console.log('Headers:', req.headers);
  }
  next();
});

app.use(modRewrite(rewriteRules));
app.use(serveStatic(config.dir));

app.listen(config.port, config.host, function (err) {
  console.log('s1', (!err ?  chalk.green('started') : chalk.red('failed')), '\n');

  if (!err) {
    if (configPath) {
      console.log('Using config: ' + path.basename(configPath));
    }
    console.log('Server address: ' + config.host + ':' + config.port);
    console.log('Root directory: ' + config.dir);
    console.log('Index file: ' + config.index);
    if (config.verbose) {
      console.log('Verbose logging');
    }
  }
  else {
    console.error(err.stack);
  }
});
