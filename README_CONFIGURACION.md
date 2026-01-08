# Guía de Configuración - Formulario Seemann Group

## 📋 Descripción del Proyecto

Este es un formulario web para **Seemann Group**, diseñado para capturar información de clientes potenciales. Al enviar el formulario, el usuario recibe automáticamente un correo electrónico con:
- Confirmación de envío
- PDF adjunto con todas sus respuestas

El proyecto utiliza **Mailgun** para el envío de correos mediante una función serverless de Vercel.

## ✅ Configuración Completa (Ya lista)

La integración con Mailgun ya está configurada y lista para usar:

- **API Key**: Configurada en `/api/send-email.js`
- **Dominio**: sandbox8c39856aa66e44aeb317a40bb447c6f1.mailgun.org
- **Función serverless**: `/api/send-email.js` maneja el envío de emails
- **Template de email**: HTML incluido con colores corporativos

### ⚠️ Importante - Dominio Sandbox de Mailgun

Actualmente el proyecto usa el dominio sandbox de Mailgun. Esto significa que:
- Solo puedes enviar emails a direcciones autorizadas
- Para autorizar un email, ve a tu dashboard de Mailgun y agrega "Authorized Recipients"
- **Para producción**: Debes verificar tu dominio propio en Mailgun

### ⚠️ Importante - Dominio Sandbox de Mailgun

Actualmente el proyecto usa el dominio sandbox de Mailgun. Esto significa que:
- Solo puedes enviar emails a direcciones autorizadas
- Para autorizar un email, ve a tu dashboard de Mailgun y agrega "Authorized Recipients"
- **Para producción**: Debes verificar tu dominio propio en Mailgun

### Autorizar destinatarios en Mailgun Sandbox:

1. Ve a [Mailgun Dashboard](https://app.mailgun.com/)
2. Selecciona tu dominio sandbox
3. Ve a "Authorized Recipients"
4. Agrega los emails que quieres que puedan recibir correos de prueba
5. Confirma el email de verificación que les llegará

## 🔧 Arquitectura del Sistema

```
Frontend (React)
    ↓ Envía datos del formulario
Vercel Serverless Function (/api/send-email.js)
    ↓ Usa la API Key de Mailgun
Mailgun API
    ↓ Envía el email
Usuario (correo con PDF adjunto)
```

Esta arquitectura mantiene tu API Key de Mailgun segura (no se expone en el frontend).

## 🚀 Cómo Usar un Dominio Propio (Producción)

Para enviar emails desde tu dominio (ej: @seemanngroup.com):

1. **En Mailgun Dashboard:**
   - Ve a "Sending" → "Domains"
   - Click "Add New Domain"
   - Ingresa tu dominio: `seemanngroup.com`

2. **Configurar DNS:**
   - Mailgun te dará registros DNS (TXT, MX, CNAME)
   - Agrégalos en tu proveedor de DNS
   - Espera la verificación (puede tomar hasta 48 horas)

3. **Actualizar el código:**
   - Edita `/api/send-email.js`
   - Cambia el dominio sandbox por tu dominio verificado
   - Cambia el "from" email por algo como `noreply@seemanngroup.com`

## 📝 Personalización

### Modificar el email "from":

Edita [/api/send-email.js](api/send-email.js) línea 82:
```javascript
from: 'Seemann Group <noreply@tudominio.com>',
```

## 📱 Deploy en Vercel

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Subir el código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Formulario Seemann Group inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

2. **Deploy en Vercel:**
   - Ve a [https://vercel.com/](https://vercel.com/)
   - Haz clic en **"Import Project"**
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite
   - Haz clic en **"Deploy"**
   - ¡Listo! Tu sitio estará disponible en unos minutos

### Opción 2: Deploy directo desde CLI

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Hacer login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Para producción:**
   ```bash
   vercel --prod
   ```

## 🧪 Pruebas Locales

Antes de hacer deploy, prueba localmente:

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:5173
```

### Modificar campos del formulario:

Edita [src/components/FormularioSeemann.tsx](src/components/FormularioSeemann.tsx):
- Líneas 10-19: Interface con los campos del formulario
- Líneas 200-350: Estructura del formulario HTML

### Cambiar estilos/colores:

Edita [src/components/FormularioSeemann.css](src/components/FormularioSeemann.css):
- Líneas 1-12: Variables CSS con los colores principales

### Modificar el PDF generado:

Edita la función `generarPDF()` en [FormularioSeemann.tsx](src/components/FormularioSeemann.tsx) (líneas 35-95)

### Modificar el template del email:

Edita [/api/send-email.js](api/send-email.js) líneas 35-75

## 📝 Notas Importantes

1. **Mailgun Sandbox:** Recuerda que en modo sandbox solo puedes enviar a emails autorizados.

2. **API Key Segura:** La API key está en el backend (función serverless), no se expone al cliente.

3. **Límites de Mailgun:** 
   - Plan gratuito: 5,000 emails/mes durante 3 meses
   - Luego: Plan de pago o migrar a otro servicio

4. **PDF en el email:** El PDF se genera en el frontend y se envía como base64 al backend.

5. **Validación:** El formulario valida que todos los campos estén completos antes de enviar.

## 🆘 Soporte

Si tienes problemas:
- Verifica que las credenciales de EmailJS estén correctas
- Revisa la consola del navegador para ver errores
- Asegúrate de tener conexión a internet
- Verifica que el servicio de EmailJS esté activo

## 📧 Contacto

Para más información sobre Seemann Group:
- Email: contacto@seemanngroup.com
- Teléfono: +56 2 2604 8386
- Web: https://pagina-seemann-group.vercel.app/
