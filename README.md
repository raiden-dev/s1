# s1 – Static server for SPA development

The light and simple node-way static server with mod_rewrite.
Best suitable for single-page apps development but can be used to host anything static.

*Please, avoid using it in production.*


## Using

Install via npm (preferred globally).

```
npm -g install s1
```

Go to your project's public assets directory and run `s1` executable.

```sh
cd app/public && s1
```

Now open [localhost:8080](http://localhost:8080/) and enjoy your work.


## CLI options

```
$ s1 --help
Usage: s1 [options]

Options:
  -h, --host, --ip      Host or IP to bind                  [default: "0.0.0.0"]
  -p, --port            Port                                     [default: 8080]
  -d, --dir, --root     Root directory                           [default: "./"]
  -i, --index           Index file                       [default: "index.html"]
  -c, --config, --conf  Config module                      [default: "./config"]
  --help                Show help                                      [boolean]
```


## Config

The config is the basic Node.js module exporting object.
It is located at s1's root directory, e.g., if installed globally in OS X `/usr/local/lib/node_modules/s1/config.js`.

You can have as many configs as you want, store it where you want, and pass needed one to the s1 using `-c` or `--config` cli switch.

For example:

```
s1 --config ~/myapps/config.app1.js
```

### Config options

All config options except `rewrite` could be redefined from CLI.

Name    | Type     | Default      | Description
--------|----------|--------------|------------
host    | `String` | 0.0.0.0      | Host or interface's IP address s1 will be bound to. By default binds to ALL interfaces.
port    | `Number` | 8080         | Binding port.
dir     | `String` | ./           | Root directory from which files will be hosted. Default to current directory.
index   | `String` | index.html   | Index file name. Your app's entry.
rewrite | `Array`  | base rewrite | Array with rules for mod_rewrite engine. s1 uses [connect-modrewrite](https://github.com/tinganho/connect-modrewrite) which rules are similiar to classic mod_rewrite in Nginx or Apache. You can use s1's options in rules using `{{property}}` syntax.

## Contributing

The main purpose of the server is to stay tiny and easy to use in everyday development tasks. So if you got any use case you think is widely popular but poorly supported by s1 – feel free to tell me about it, or try to implement it yourself and send the PR.
