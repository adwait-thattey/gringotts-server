# gringotts-server


**Gringotts** is an innovative project that provides a vault based solution to securely store secrets like passwords, keys (GPG/SSH), securely transfer data among people etc.

This is the main server application. Written in node.

The features of the application will be:

### Credential Manager:

* Store all your passwords / credentials or just any data securely.
* Data is stored in vault, while mappings are stored in node server

### Dynamic Cedentials

* Configure the application with your AWS / GCP / Azure primary credentials. 
* Generate new username-password or access-keys for your account on the fly.
* Configure TTL and privileges for the newly generated credentials

### SSH Keys

* Configure your remote server / machine with the CA of application to accept keys signed by gringotts
* Generate new ssh keys for your remote machine anytime anywhere with just a couple of clicks
* All generated keys come with short ttl. So no need to worry about losing your keys or leaving them on any other machine.
* [This picture sums up the workflow](Planning/Images/ssh.png)

### Secure transfer of data

* Share any data with anyone over insecure channel by encrypting using GPG keys with just a few clicks
* Keys are stored in the application
* Provides encryption as a service (Extension of the core functionality provided by vault)
* [This picture sums up the workflow](Planning/Images/gpg.png)


This is the main server of the project. There are different projects for the Web-UI and the command line / native application

We are in the process of wrapping up in docker containers so that all components can be deployed easily.

This is the [proposed architecture](Planning/Images/architecture.png) of the project.

Each layer is designed to be independent of each other. So you just use use the server and plug in your own UI over it.

The proposed docs for the APIs will be released soon

