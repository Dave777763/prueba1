@echo off
setlocal

echo ==========================================
echo    Iniciando App de Eventos (EventosApp)
echo ==========================================
echo.

REM 1. Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR CRITICO] Node.js NO ESTA INSTALADO.
    echo Por favor instala Node.js primero: https://nodejs.org
    pause
    exit /b 1
)

REM 2. Ir a la carpeta frontend
cd frontend
if %errorlevel% neq 0 (
    echo [ERROR] No se encuentra la carpeta 'frontend'.
    echo Asegurate de estar en la carpeta raiz del proyecto.
    pause
    exit /b 1
)

REM 3. Verificar e instalar dependencias si faltan
if not exist "node_modules" (
    echo [INFO] Primera ejecucion detectada. 
    echo Instalando dependencias necesarias...
    call npm install
)

echo.
echo [INFO] Iniciando servidor de desarrollo...
echo La aplicacion abrira automaticamente en tu navegador.
echo Presiona Ctrl+C para detener el servidor.
echo.

REM Esperar 5 segundos y abrir el navegador (mientras carga el server)
start /min cmd /c "timeout /t 5 >nul & start http://localhost:3000"

call npm run dev
pause
