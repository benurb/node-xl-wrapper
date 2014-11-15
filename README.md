# node-xl-wrapper

[![Build Status](https://travis-ci.org/benurb/node-xl-wrapper.svg?branch=master)](https://travis-ci.org/benurb/node-xl-wrapper)
[![Dependency Status](https://david-dm.org/benurb/node-xl-wrapper.svg)](https://david-dm.org/benurb/node-xl-wrapper)
[![devDependency Status](https://david-dm.org/benurb/node-xl-wrapper/dev-status.svg)](https://david-dm.org/benurb/node-xl-wrapper#info=devDependencies)
[![codecov.io](https://codecov.io/github/benurb/node-xl-wrapper/coverage.svg?branch=master)](https://codecov.io/github/benurb/node-xl-wrapper?branch=master)

Node.js wrapper around local or remote Xen xl management utility

__This is a work in progress and should not be used yet !!!__

__You have been warned__

## Requirements
### Client-Side
_The side that is running the Node-Application using this lib_

- [Node.js](http://www.nodejs.org) -- tested with 0.10.33, if you tested older versions, let me know

### Server-Side
_The sie that is running Xen and xl_

- SSH server -- OpenSSH for example
- Xen with xl as toolstack -- tested with Xen 4.4
- A user with access to the xl command -- I would __strongly__ recommend you to read the [security recommendations](#security)!

## API documentation
### <a name="api-constructor">Constructor</a>
`new XL(options)`

Options must at least contain the property `executorName` which can currently be set to `local` to execute the commands
on the local machine (via `child_process.spawn()`) or `ssh` to execute the commands on a remote machine via a SSH
connection (done by [ssh2](https://github.com/mscdex/ssh2)).

Supported properties:

- `executorName` (String) - __Required:__ Name of the executor to use for executing xl commands (`local` or `ssh`)
- `executorOptions` (Object) - See below for a detailed explanation
- `filter` (String | RegExp) _default: .*_ - This can optionally be used to restrict a session to specific DomU names.
All commands only work if the accessed DomU's name matches the string (strictly) or the RegExp (`test()`). Other commands
like `list` filter all DomUs from the output, that don't match this filter.

The `executorOptions` are split in two parts. For all currently supported executors you can use these options:

- `sudo` (Boolean) _default: false_ - Prefix all commands with `sudo` (see [security recommendations](#security))
- `debug` (Boolean) _default: false_ - Show debug output
- `verbose` (Boolean) _default: false_ - Show a more verbose debug output

Specific options for the executor `ssh` are:

- `host` (String) - Hostname or IP of the SSH server
- `port` (Number) _default: 22_ - Port of the SSH server
- `username` (String) - Username for login
- `password` (String) - Password for login
- `privateKey` (String | Buffer) - Content of the private key file for public key authentication (OpenSSH format).
- .. and many more. In general you can use all `ssh2` [connect options](https://github.com/mscdex/ssh2#connection-methods). There is one
custom addition though:
- `persistent` (Boolean) _default: false_ - Use a persistent SSH connection. It is strongly recommended to enable this
if you send more than one command over this SSH connection, because otherwise the connection has to be established for
each command execution individually. This leads to a massive overhead.

Specific options for the executor `local` are:

- none :smile:

### Commands
To execute a command you have to instantiate XL and call the command you like.
Example:

```javascript
var XL = require('node-xl-wrapper');
var con = new XL({
    'executorName': 'local'
});
con.shutdown({
    'name': 'myDomU'
}, function(err, data) {
    // Do what you want with the returned data
    // Data is generally the stdout string of the xl command or a object (e.g. for list)
});
```

You can omit the first parameter (`options` object) if the command has no options or you don't want to pass any.

The commands are named after their corresponding xl commands. Currently these are supported:

- [domid](doc/commands.md#domid)
- [domname](doc/commands.md#domname)
- [list](doc/commands.md#list)
- [shutdown](doc/commands.md#shutdown)

## <a name="security">Security recommendations</a>
First of all: **Never ever use the root user to run this lib in production!**

As you can see it supports using the `sudo` command when configured via the [constructor options](#api-constructor).
To use this you have to create a new user, let's call him `xlrunner`. Then edit the `/etc/sudoers` file using the command
`visudo` and append this line (of course change the username if you created another user):

```
xlrunner      ALL=NOPASSWD:   /usr/sbin/xl
```

Your new user should now have the permission to execute the xl command with prefixed sudo and arbitrary arguments.
You may restrict these arguments for your use case. There are
[plenty how-tos](http://www.atrixnet.com/allow-an-unprivileged-user-to-run-a-certain-command-with-sudo/) out there to
achieve this.

My second recommendation is to use public key authentication instead of password-based one. Just read a
[how-to](http://stackoverflow.com/a/9095) about it. It's worth it.
