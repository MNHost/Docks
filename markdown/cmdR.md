# Command System Documentation for `@cmdR/cmdconfig`

## Introduction
The command system implemented in the `@cmdR/cmdconfig` script allows you to create custom commands that can be executed from a command-line interface (CLI) within Roblox Studio. This system is highly flexible and can be used to automate tasks, install scripts, or perform any Lua-based operations within your game.

This documentation will guide you through the syntax for creating commands, setting them up, and leveraging various functionalities.

## Setting Up Commands

To create custom commands, follow these steps:

1. **Create a ModuleScript:**
   - Name the script `@cmdR/cmdconfig`.
   - Place the script in the appropriate folder within your game, such as `ServerScriptService`, `ReplicatedStorage`, `StarterGui`, etc.

2. **Define Your Commands:**
   - Inside the `@cmdR/cmdconfig` ModuleScript, return a table where the keys are the command names and the values are the functions that should be executed when the command is called.

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
