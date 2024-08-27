# Custom Package Commands (Information and Setup)

## Introduction
With cmdR packages, you can add custom commands to enhance integration with other packages. Custom commands are versatile and can automate tasks, install scripts, or execute Lua-based or web-based operations within your game.

This documentation will guide you through the process of creating commands, setting them up, and leveraging various functionalities.

## Restrictions
We moderate all packages and reserve the right to remove any package for any reason. Creating malicious packages, commands, or content is strictly prohibited. Please read the following important message about malicious packages:

### IMPORTANT MESSAGE
**ATTENTION! CREATING MALICIOUS PACKAGES IS A CRIME.** It is a federal felony to create harmful programs. If convicted by a court of law, penalties for damaging digital property (including data) or using malicious programs for unlawful activities can be up to 10 years in state or federal prison. If fraudulent activities are involved, the penalty could exceed 20 years.

## Setting Up Commands

There are two ways to create custom commands:

### Using the Package GUI

1. **Create the Script**
   - In the GUI, click the button labeled **"Create Custom Commands"** to begin.
   - **Important:** Do not rename the command file in your Roblox game. The file name should be `@cmdR/cmdconfig`. Renaming this file will cause custom commands to fail.

2. **Understanding the Command Syntax**
   - After clicking the button, you will be directed to a script editor. You can add as many commands as you like here. Commands should be written as a `ModuleScript`. Below is an example of the command syntax:
     ```lua
     local commands = {}
     
     commands["%cmdR myCustomCommand"] = function()
         print("Executing custom command: myCustomCommand")
         -- Add any custom logic here
     end
     
     commands["%cmdR anotherCommand"] = function()
         print("Running another custom command")
         -- Add different logic here
     end
     
     return commands
     ```

3. **Creating Commands**
   - After understanding the syntax, you can create commands. Basic command creation requires a fundamental understanding of Roblox Luau coding. Some commands may also require knowledge of web coding and other programming languages.

   - **Basic Command:**
     ```lua
     local commands = {}
     
     -- Choose whatever command you want below; it is required to have the % sign:
     commands["%cmdR exampleCommand"] = function()
         print("Example Command!")
         -- Add other logic below
     end
     
     return commands
     ```

   - **Variable Command:**
     This type of command allows users to input variables that affect the command:
     ```lua
     local commands = {}

     -- Example command: Print the input
     commands["%cmdR printInput"] = function(input)
         if input and input ~= "" then
             print("Received input:", input)
         else
             print("No input provided.")
         end
     end
     
     return commands
     ```

## Using the GUI
1. **Coming Soon**
   - Stay tuned for updates. We will introduce a package trust score system soon.

### Caution
Please be cautious about the packages you install. A trust score system for packages will be available in the near future.
