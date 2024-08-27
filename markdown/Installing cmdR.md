# cmdR Installation Guide

Thank you for using the cmdR plugin.

There are 3 ways to install cmdR:<br>
::: tabs

### Roblox Plugin
The 1st way you can download cmdR is through the roblox plugin store! Download the roblox plugin here: [cmdR Roblox Plugin](https://example.com). After downloading the plugin please visit the getting started page to see how to use cmdR.

### Plugin Script
The 2nd way to download cmdR is through our website using the script.<br> Download the script here: [cmdR Script Download](https://example.com). After downloading the script please go into roblox studio, open a game, and then click the plugins tab. After clicking the plugins tab please click the item with the name: "Plugins Folder" (It may be under tools). After opening the plugins folder, copy the file from downloads and insert it into the Plugins Folder.<br> Want to move it using the CLI? Here is the command you can use on Windows:<br> **Windows Powershell**<br> `Move-Item -Path "C:\Users\{userhere}\Downloads\cmdR.lua" -Destination "C:\Users\{userhere}\AppData\Local\Roblox\Plugins\cmdR.lua"`


### Using the CLI
The 3rd and final way to download the file is using your computer's CLI. Below are commands for different CLI programs:<br>
**Replace the {userhere} value with the desktop name**
**curl**<br>
`curl -L -o "C:\Users\{userhere}\AppData\Local\Roblox\Plugins\cmdR.lua" "https://raw.githubusercontent.com/FoundationINCCorporateTeam/cmdR/main/cmdR.lua"`<br>
**wget**<br>
`wget -O "C:\Users\{userhere}\AppData\Local\Roblox\Plugins\cmdR.lua" "https://raw.githubusercontent.com/FoundationINCCorporateTeam/cmdR/main/cmdR.lua"`<br>
**Windows PowerShell**<br>
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/FoundationINCCorporateTeam/cmdR/main/cmdR.lua" -OutFile"C:\Users\sarai\AppData\Local\Roblox\Plugins\cmdR.lua"
**MacOS Commands:**<br>
**curl**<br>
`curl -L -o "~/Downloads/cmdR.lua" "https://raw.githubusercontent.com/FoundationINCCorporateTeam/cmdR/main/cmdR.lua"`<br>
**wget**<br>
`wget -O "~/Downloads/cmdR.lua" "https://raw.githubusercontent.com/FoundationINCCorporateTeam/cmdR/main/cmdR.lua"`
:::

After you finish installing cmdR go to the [button:Getting Started](?article=Getting Started) article to learn how to use cmdR and go further.
