# Custom Package Commands (Information and Setup)

## Introduction
With your cmdR packages you can add custom commands. Using custom commands can be useful for integrating with other packages. This system is highly flexible and can be used to automate tasks, install scripts, or perform any Lua-based or Web-based operations within your game.

This documentation will guide you through the syntax for creating commands, setting them up, and leveraging various functionalities.

## Restrictions
We can and do moderate any and all packages as we please. We reserve the right to remove any packages a user creates for any reason. Do not create any malicious packages, commands, or content. Please read below for information about malicious packages, commands, or content.
### IMPORTANT MESSAGE
ATTENTION! CREATING MALICIOUS PACKAGES IS IN FACT A CRIME. IT IS A FEDERAL FELONY TO CREATE HARMFUL PROGRAMS. IF YOU ARE FOUND GUILTY OF CREATING A HARMFUL PROGRAM BY A COURT OF LAW, THE PENALTY FOR DAMAGING DIGITAL PROPERTY (INCLUDING DATA) OR USING MALICIOUS PROGRAMS FOR UNLAWFUL ACTIVITES IS UP TO 10 YEARS IN STATE OR FEDERAL PRISON. IF THE MALICIOUS PROGRAM IS FOUND TO HAVE COMMITTED FRAUDULENT ACTIVITES THE PENALTY COULD BE 20 YEARS OR MORE IN STATE OR FEDERAL PRISON.

## Setting Up Commands

There are 2 ways to create custom commands. Please take a look at the following:

### Using the package GUI

1. **Create the script** In the GUI you will see a button that says: "Create Custom Commands." When you are ready to create your commands, please click the button.
(IMPORTANT) In you roblox game DO NOT CHANGE THE COMMAND FILE'S NAME. File name: @cmdR/cmdconfig | This file's name is important and doing so will result in custom commands failing to work.
2. **Understanding the command syntax** After clicking the button it will take you to a script editor.  In the script editor you can add as many commands as you like. Please remember to write your commands as a ModuleScript. Below is an example of the command syntax.
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
3. **Creating commands** After understanding the syntax you can now create commands. The requirements for creating commands are a basic understanding of Roblox Luau coding and for some commands it may require a basic understanding of web coding and programming languages. We are going to go over 2 ways to create a command. 1: A basic command:
   ```lua
   local commands = {}
   -- Choose whatever command you want below it is required to have the % sign:
   commands["%cmdR exampleCommand"] = function ()
   print("Example Command!")
   -- Add other logic below
   end
return commands```

Now the second kind of command a variable command. This is a command where a user will input a variable that will effect the command:
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

### Example Command Script

Here’s an example of a basic command setup:

```javascript
//Hello!
return {
    greet = function()
        print("Hello, world!")
    end,
    
    addNumbers = function()
        local sum = 5 + 10
        print("The sum is: " .. sum)
    end,
    
    teleportPlayer = function()
        local player = game.Players.LocalPlayer
        if player and player.Character then
            player.Character:SetPrimaryPartCFrame(CFrame.new(0, 50, 0))
        end
    end
}
```
