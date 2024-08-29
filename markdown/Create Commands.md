# Custom Package Commands (Information and Setup)

## Introduction
With your cmdR packages, you can add custom commands to integrate with other packages. This system is highly flexible and allows you to automate tasks, install scripts, or perform Lua-based or Web-based operations within your game.

This documentation will guide you through:
- The syntax for creating commands
- Setting them up
- Leveraging various functionalities

## Restrictions
We reserve the right to moderate and remove any packages or commands we deem inappropriate. Do not create malicious packages, commands, or content. Please read the important message below for details about malicious packages.

### IMPORTANT MESSAGE
**ATTENTION!** Creating malicious packages is a serious crime. Federal law considers it a felony to create harmful programs. Convictions for damaging digital property or using malicious programs for unlawful activities can result in up to 10 years in prison. If the program is found to have committed fraudulent activities, penalties could exceed 20 years in prison.

## Setting Up Commands

There are two ways to create custom commands. Please follow the steps below:

### 1. Using the Package GUI

1. **Create the Script**  
   In the GUI, you will see a button labeled **"Create Custom Commands."** Click this button to begin creating your commands.  
   **Important:** In your Roblox game, **do not change the command file's name**. The file name should be: `@cmdR/cmdconfig`. Renaming this file will cause custom commands to fail.

2. **Understanding the Command Syntax**  
   After clicking the button, you will be directed to a script editor. In this editor, you can add as many commands as needed. Write your commands as a `ModuleScript`. Here’s an example of the command syntax:
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
   Once you understand the syntax, you can start creating commands. A basic understanding of Roblox Luau coding is required, and for some commands, knowledge of web coding and other programming languages may be beneficial.

   - **Basic Command Example:**
     ```lua
     local commands = {}
     
     -- Choose a command with the % sign
     commands["%cmdR exampleCommand"] = function()
         print("Example Command!")
         -- Add other logic below
     end
     
     return commands
     ```
   - **Variable Command Example:**  
     This type of command allows a user to input a variable that affects the command's behavior. (At the moment only single variable commands are allowed.)<br>
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
1. This feature is coming soon.
2. **Please be careful about what you are installing.** A package trust score system will be coming out soon.
