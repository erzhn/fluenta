@echo off
echo === ЗАПУСК: lessons-prompt.txt ===
claude --dangerously-skip-permissions < lessons-prompt.txt
echo === ГОТОВО. Запускаю features-prompt.txt ===
claude --dangerously-skip-permissions < features-prompt.txt
echo === ГОТОВО. Запускаю финальную полировку ===
claude --dangerously-skip-permissions < final-polish-prompt.txt
echo === ВСЁ ГОТОВО ===
pause
