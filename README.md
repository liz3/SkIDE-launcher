# SkIDE updater
This repository has two parts, the node js script for standalone updates and secondly the standalone updater which gets bundled in the launcher, this is written in kotlin

This is a simple cmd Script updating a existing installation of SkIDE.

# TODO
* rebuild mac dmg
* linux installer?

## Node updater
[Download here](https://github.com/liz3/SkIDE-launcher/releases/latest)
### Usage
On Windows and MacOS the script will try to update the default location for a installation.

On Linux you need to specify the path to the `bin` folder of the installation. when using a custom install location this can be used on the other platforms too:
- Windows `skide_win_x64 /path/to/bin`
- mac & Gnu/Linux `./binary /path/to/bin`
### building

To build the standalone binaries run `npm run build`(doesnt work on windows)

## Standalone Updater
[Download here](https://ide.liz3.net)
The Standalone Updater has the setup files for the installers & the kotlin gradle Project.  
Building this requires a Couple tools: Isso-setup, launch4j and a portable jre8, but this is mostly included as sake of completeness and should not be of own compile use for a day to day user.

# License
As SKIDE, this is free software licensed under the GPL-2.