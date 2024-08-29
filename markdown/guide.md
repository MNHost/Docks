# User Guide

Welcome to the User Guide! This article will tell you what to do first!

## Getting Started

To get started with cmdR follow the necessary steps:

### 1. Install the Necessary Tools

For detailed installation steps, refer to the [cmdR Installation Guide](?article=Installing cmdR).

### 2. Configure Your Environment

Set up your environment by configuring the necessary settings:

- **LoadString**: For some packages to work, you may need to enable LoadString. If you install a package that requires LoadString, don't worry. We will make sure to tell you.
#### Important Notes
- **Game Security**: Please make sure before you install a package, you are sure you can trust the package you are installing. Please make sure you are not installing the wrong package as some packages may be malicious. If you have installed a malicious package don't worry, it is super easy to get rid of it! Just click delete on the malicious package folder.
- **Package Advertizements**: (Ads do have to follow a strict display and moderation policy) Please be aware some packages may have code that could create ad GUI's. To get rid of the ad GUI's you will just need to do 1 of the following:
  1. You can find the the piece of code creating the ads and delete it. **Please be mindful**: By deleting certain snippets of code you could cause the package not to work. Please make sure you know what you are doing.
  2. (Coming Soon) You can go into the package's "cmdRConfig" file and set can display ads to false. But remember some packages may have code that does not run without ads.
  3. In the future we may create a cmdR pro version where you could have no ads.
- **Game Storage**: Please understand that some packages can be very big. This could slow down your game and effect your users experience. Here are some tips to free up some storage:
  1. **Delete old package versions**
  2. **Find "mini packages"**
  3. Expand on this

For detailed configuration instructions, see the [Getting Started With cmdR](?article=Getting Started).

### 3. Run the Initial Setup Script

Run the setup script to initialize your environment:

```bash
./setup.sh
