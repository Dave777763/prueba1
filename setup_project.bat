REM @echo off
setlocal

echo ==========================================
echo    Configuracion de App de Eventos
echo ==========================================

REM 1. Verificar Node.js
echo.
echo [1/3] Verificando Node.js...
node -v 
echo ErrorLevel check: %errorlevel%
if %errorlevel% neq 0 (
    echo.
    echo [ERROR CRITICO] Node.js NO ESTA INSTALADO.
    echo.
    echo Esta aplicacion requiere Node.js para funcionar.
    echo Se abrira la pagina de descarga automaticamente...
    echo.
    timeout /t 3
    start https://nodejs.org/es/download/
    echo.
    echo INSTRUCCIONES:
    echo 1. Instala Node.js ^(Version LTS recomendada^)
    echo 2. Reinicia tu computadora ^(o cierra todas las ventanas de comandos^)
    echo 3. Vuelve a ejecutar este archivo.
    echo.
    echo Presiona cualquier tecla para salir...
    pause >nul
    exit /b 1
)

echo Node.js detectado correctamente!

REM 2. Crear proyecto Next.js si no existe
echo.
echo [2/3] Inicializando proyecto Next.js en /frontend...
if exist "frontend" (
    echo La carpeta 'frontend' ya existe. Saltando creacion de proyecto.
) else (
    echo Creando nueva app Next.js... 
    echo Esto puede tardar unos minutos, por favor espera...
    echo.
    call npx -y create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-git
    if %errorlevel% neq 0 (
        echo [ERROR] Hubo un problema al crear la app. Revisa los mensajes anteriores.
        pause
        exit /b 1
    )
    echo Proyecto base creado exitosamente.
)

REM 3. Instalar dependencias adicionales
echo.
echo [3/3] Instalando librerias adicionales...
cd frontend
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo entrar a la carpeta frontend.
    pause
    exit /b 1
)

echo Instalando Firebase y otras utilidades...
call npm install firebase lucide-react clsx tailwind-merge

echo.
echo ==========================================
echo    Configuracion Completada Exitosamente!
echo ==========================================
echo.
echo Para iniciar el servidor de desarrollo:
echo 1. Abre una terminal en esta carpeta
echo 2. Escribe: cd frontend
echo 3. Escribe: npm run dev
echo.
pause
