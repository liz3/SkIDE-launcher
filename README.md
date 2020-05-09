# SkIDE updater
From 10th May 2020 the old Updater stopped working due to a change in domains.

This is a simple cmd Script updating a existing installation of SkIDE.

[Download here](https://github.com/liz3/SkIDE-launcher/releases/latest)

## Usage
On Windows and MacOS the script will try to update the default location for a installation.

On Linux you need to specify the path to the `bin` folder of the installation. when using a custom install location this can be used on the other platforms too:
- Windows `skide_win_x64 /path/to/bin`
- mac & Gnu/Linux `./binary /path/to/bin`
## building

To build the standalone binaries run `npm run build`(doesnt work on windows)
