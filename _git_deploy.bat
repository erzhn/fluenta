@echo off
cd /d "D:\Projects with @\fluenta"
del /f /q ".git\index.lock" 2>nul
git config user.email "esouzbekova@gmail.com"
git config user.name "Fluenta"
git add -A
git commit -m "fix: remove {} error on login page load"
git push
echo.
echo Done! Press any key to close.
pause
