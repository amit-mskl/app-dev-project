@echo off
REM Create modern project structure directly in current directory
REM Run this in your main project folder (app-dev-project)

echo 🚀 Creating modern file structure in current directory...

echo 📁 Creating directory structure...

REM Create directories
mkdir css
mkdir js
mkdir assets\images\projects
mkdir assets\images\icons
mkdir assets\fonts
mkdir assets\favicon

echo 📄 Creating empty CSS files...

REM Create empty CSS files
type nul > css\variables.css
type nul > css\base.css
type nul > css\components.css
type nul > css\sections.css
type nul > css\responsive.css

echo ⚡ Creating empty JavaScript files...

REM Create empty JavaScript files
type nul > js\theme.js
type nul > js\navigation.js
type nul > js\animations.js

echo 📝 Creating other empty files...

REM Create empty documentation files
type nul > README.md
type nul > .gitignore

echo ✅ Modern project structure created successfully!
echo.
echo 📁 Files created:
echo   css\variables.css
echo   css\base.css  
echo   css\components.css
echo   css\sections.css
echo   css\responsive.css
echo   js\theme.js
echo   js\navigation.js
echo   js\animations.js
echo   README.md
echo   .gitignore
echo.
echo 🎉 Ready to start coding!

pause