# ⚠️ IMPORTANTE - Configuración de Mailgun

## Antes de probar el formulario

El proyecto usa **Mailgun en modo Sandbox**. Para que los emails funcionen:

### 1. Autoriza el email del destinatario

1. Ve a [Mailgun Dashboard](https://app.mailgun.com/)
2. Inicia sesión con tu cuenta
3. Selecciona tu dominio sandbox
4. Ve a "Sending" → "Authorized Recipients"
5. Haz clic en "Add Authorized Recipient"
6. Ingresa el email que quieres autorizar (ej: `pineiro@sphereglobal.io`)
7. Mailgun enviará un email de verificación
8. Abre el email y haz clic en el link de confirmación

### 2. Prueba el formulario

Una vez autorizado el email, puedes:
- Llenar el formulario en http://localhost:5173/
- Usar el email autorizado
- Recibirás el email de confirmación con el PDF adjunto

## Para Producción

Para enviar emails a cualquier dirección sin restricciones:

1. **Verifica tu dominio propio:**
   - En Mailgun: "Sending" → "Domains" → "Add New Domain"
   - Ingresa tu dominio (ej: `seemanngroup.com`)
   - Configura los registros DNS que te proporcione Mailgun
   - Espera la verificación (hasta 48 horas)

2. **Actualiza el código:**
   - Edita `/api/send-email.js`
   - Cambia el dominio sandbox por tu dominio verificado (línea 116)
   - Cambia el email "from" (línea 82)

## Alternativa Rápida

Si necesitas enviar emails de prueba a múltiples personas ahora mismo:

1. Pide a cada persona que vaya a su email
2. Busquen el correo de "Mailgun Sandbox Authorization Request"
3. Hagan clic en "I Agree"

O simplemente autoriza varios emails desde el dashboard siguiendo el paso 1.

---

**Emails actualmente autorizados:**
- pineiro@sphereglobal.io ✓

Para agregar más, sigue el paso 1.
