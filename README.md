# node-xl-wrapper

![Travis Build Status](https://travis-ci.org/benurb/node-xl-wrapper.svg?branch=master)
![Dependency Status](https://david-dm.org/benurb/node-xl-wrapper/status.svg)
![Dev Dependency Status](https://david-dm.org/benurb/node-xl-wrapper/dev-status.svg)

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
connection (done by [ssh2](https://github.com/mscdex/ssh2)

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
