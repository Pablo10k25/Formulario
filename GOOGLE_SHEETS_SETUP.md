# 📊 Configuración de Google Sheets - Guía Paso a Paso

Esta guía te ayudará a configurar Google Sheets para guardar automáticamente todas las respuestas del formulario.

---

## 📋 PASO 1: Crear el Google Sheet

1. Ve a: https://docs.google.com/spreadsheets/
2. Click en **"+ Crear"** (o "Blank spreadsheet")
3. Nombra la hoja: **"Formulario Seemann Group"**
4. En la pestaña inferior, renombra "Hoja 1" a: **"Respuestas"**
5. En la primera fila, agrega estos encabezados:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Fecha | RUT | Nombre | Apellido | Teléfono | Email | Empresa | Dirección | Comuna | Ciudad |

6. **Copia el ID de la hoja:**
   - Mira la URL: `https://docs.google.com/spreadsheets/d/ABC123XYZ456/edit`
   - El ID es: `ABC123XYZ456` (la parte entre `/d/` y `/edit`)
   - **Guárdalo**, lo necesitaremos después

---

## 🔑 PASO 2: Crear Service Account (Credenciales)

### 2.1 Ir a Google Cloud Console
1. Ve a: https://console.cloud.google.com/
2. Si es tu primera vez, acepta los términos de servicio

### 2.2 Crear un nuevo proyecto
1. Click en el selector de proyectos (arriba, al lado de "Google Cloud")
2. Click en **"NEW PROJECT"**
3. Nombre del proyecto: **"Formulario Seemann"**
4. Click en **"CREATE"**
5. Espera 30 segundos y selecciona el nuevo proyecto

### 2.3 Habilitar Google Sheets API
1. En el menú lateral (☰), ve a: **APIs & Services** → **Library**
2. Busca: **"Google Sheets API"**
3. Click en **"Google Sheets API"**
4. Click en **"ENABLE"**

### 2.4 Crear Service Account
1. En el menú lateral, ve a: **APIs & Services** → **Credentials**
2. Click en **"+ CREATE CREDENTIALS"** (arriba)
3. Selecciona: **"Service Account"**
4. Llena los datos:
   - **Service account name:** `formulario-seemann`
   - **Service account ID:** (se genera automático)
   - **Description:** `Service account para guardar respuestas del formulario`
5. Click en **"CREATE AND CONTINUE"**
6. En "Grant this service account access to project":
   - Click en **"CONTINUE"** (no necesitas agregar roles)
7. En "Grant users access":
   - Click en **"DONE"**

### 2.5 Crear la clave JSON
1. En la lista de Service Accounts, click en el que acabas de crear
2. Ve a la pestaña **"KEYS"**
3. Click en **"ADD KEY"** → **"Create new key"**
4. Selecciona: **JSON**
5. Click en **"CREATE"**
6. **Se descargará un archivo JSON** (ejemplo: `formulario-seemann-abc123.json`)
7. **¡GUÁRDALO EN UN LUGAR SEGURO!**

---

## 👥 PASO 3: Compartir el Google Sheet con el Service Account

1. Abre el archivo JSON que descargaste
2. Busca el campo `"client_email"`, se verá algo así:
   ```
   "client_email": "formulario-seemann@formulario-seemann.iam.gserviceaccount.com"
   ```
3. **Copia ese email completo**
4. Ve a tu Google Sheet: **"Formulario Seemann Group"**
5. Click en **"Compartir"** (arriba a la derecha)
6. Pega el email del service account
7. Dale permisos de **"Editor"**
8. **IMPORTANTE:** Desmarca "Notificar a las personas"
9. Click en **"Compartir"** o **"Enviar"**

---

## ⚙️ PASO 4: Configurar en Vercel

### 4.1 Preparar las credenciales
1. Abre el archivo JSON descargado con un editor de texto
2. **Copia TODO el contenido del archivo** (desde `{` hasta `}`)
3. Minifícalo en una sola línea (o déjalo como está, Vercel lo acepta)

### 4.2 Agregar variables de entorno en Vercel
1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a: **Settings** → **Environment Variables**
4. Agrega las siguientes 2 variables:

#### Variable 1: GOOGLE_SHEET_ID
- **Name:** `GOOGLE_SHEET_ID`
- **Value:** El ID que copiaste en el PASO 1 (ej: `ABC123XYZ456`)
- **Environment:** All Environments (Production, Preview, Development)
- **Sensitive:** ✅ Activado

#### Variable 2: GOOGLE_CREDENTIALS
- **Name:** `GOOGLE_CREDENTIALS`
- **Value:** TODO el contenido del archivo JSON (pega todo)
- **Environment:** All Environments
- **Sensitive:** ✅ Activado

5. Click en **"Save"** para cada una

---

## 🚀 PASO 5: Redeploy

### Opción A: Desde Vercel
1. Ve a **Deployments**
2. Click en el último deployment
3. Click en los 3 puntos (**...**) → **"Redeploy"**
4. Confirma

### Opción B: Desde terminal
```bash
git add .
git commit -m "Configurar Google Sheets"
git push origin resend
```

Espera 1-2 minutos para que Vercel haga el deploy automático.

---

## ✅ PASO 6: Probar

1. Ve a: https://formulario-git-resend-pablo-pineiros-projects.vercel.app/
2. Llena el formulario con datos de prueba
3. Click en **"Enviar Información"**
4. Verifica:
   - ✅ Recibes email de confirmación en tu correo
   - ✅ Recibes notificación en: pineiro@sphereglobal.io
   - ✅ La respuesta aparece en el Google Sheet

---

## 🔍 Solución de problemas

### No se guarda en Google Sheet
- Verifica que el Service Account esté compartido con el Sheet (PASO 3)
- Verifica que `GOOGLE_SHEET_ID` sea correcto en Vercel
- Verifica que la pestaña se llame exactamente: **"Respuestas"**

### Error de credenciales
- Verifica que `GOOGLE_CREDENTIALS` contenga el JSON completo en Vercel
- Asegúrate de que sea un JSON válido (sin caracteres extra)

### No llega notificación al equipo
- Verifica que la API key de Resend esté configurada
- Revisa los logs en Vercel: Deployments → [tu deploy] → Function Logs

---

## 📊 Vista del Google Sheet

Después de recibir respuestas, tu Google Sheet se verá así:

| Fecha | RUT | Nombre | Apellido | Teléfono | Email | Empresa | Dirección | Comuna | Ciudad |
|-------|-----|--------|----------|----------|-------|---------|-----------|--------|--------|
| 09/01/2026 16:30 | 12.345.678-9 | Juan | Pérez | +56912345678 | juan@email.com | Empresa ABC | Calle 123 | Santiago | Santiago |
| 09/01/2026 17:45 | 98.765.432-1 | María | González | +56987654321 | maria@email.com | Empresa XYZ | Av. Principal | Viña del Mar | Viña del Mar |

---

## 🎯 Resumen de lo que hace el sistema:

1. **Cliente llena el formulario** → Click en "Enviar"
2. **Sistema guarda** los datos en Google Sheet automáticamente
3. **Cliente recibe** email de confirmación con sus datos
4. **Equipo recibe** email de notificación con los datos del cliente
5. **Equipo puede revisar** todas las solicitudes en Google Sheet (como Excel)

---

## 📱 Acceso desde móvil

Puedes revisar las respuestas desde tu celular:
1. Descarga la app **Google Sheets** (Android/iOS)
2. Inicia sesión con: pineiro@sphereglobal.io
3. Abre el sheet: "Formulario Seemann Group"
4. ✅ Puedes ver todas las respuestas en tiempo real

---

¿Dudas? Revisa los logs en Vercel o consulta la documentación:
- Google Sheets API: https://developers.google.com/sheets/api
- Resend Docs: https://resend.com/docs
