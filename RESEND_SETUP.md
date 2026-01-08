# 🚀 Configuración de Resend - Rama `resend`

Esta rama usa **Resend** en lugar de Mailgun para el envío de emails.

## ✅ Ventajas de Resend sobre Mailgun

- ✅ **100 emails/día GRATIS** (sin expiración)
- ✅ **SIN SANDBOX**: Puedes enviar a cualquier email sin necesidad de autorizarlo
- ✅ **Sin restricciones** de destinatarios
- ✅ **API moderna y simple** (más fácil de usar)
- ✅ **Logs detallados** en el dashboard
- ✅ **No va a spam** (mejor deliverability)

---

## 📋 Pasos para configurar Resend

### 1. Crear cuenta en Resend
- Ve a: https://resend.com
- Registrate gratis (con GitHub o email)

### 2. Obtener tu API Key
- Una vez dentro, ve a **API Keys**
- Crea una nueva API Key
- Copia la key (empieza con `re_...`)

### 3. Agregar la API Key a Vercel

#### Opción A: Por Dashboard de Vercel
1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Settings → Environment Variables
3. Agrega:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Tu API key de Resend (ej: `re_123abc...`)
   - **Environment**: Production, Preview, Development

#### Opción B: Por CLI de Vercel
```bash
vercel env add RESEND_API_KEY
# Pega tu API key cuando te lo pida
```

### 4. Hacer deploy de la rama `resend`

```bash
# Asegúrate de estar en la rama resend
git branch

# Haz push a GitHub
git push origin resend

# En Vercel, crea un nuevo deployment desde la rama 'resend'
```

---

## 🔄 Cambiar entre Mailgun y Resend

### Ver en qué rama estás:
```bash
git branch
```

### Cambiar a Mailgun (main):
```bash
git checkout main
```

### Cambiar a Resend:
```bash
git checkout resend
```

---

## 📧 Email de prueba

Con Resend puedes enviar a **cualquier email** sin restricciones:
- ✅ pablo.10k25@gmail.com
- ✅ pineiro@sphereglobal.io
- ✅ cualquier@email.com

**Nota**: El email `from` por defecto es `onboarding@resend.dev`. Si quieres usar tu propio dominio (ej: `contacto@seemanngroup.com`), debes verificar tu dominio en Resend.

---

## 🌐 Verificar tu dominio (OPCIONAL)

Para usar `contacto@seemanngroup.com` como remitente:

1. Ve a **Domains** en Resend
2. Agrega tu dominio: `seemanngroup.com`
3. Configura los registros DNS que te indica Resend
4. Una vez verificado, cambia en `api/send-email.js`:
   ```javascript
   from: 'Seemann Group <contacto@seemanngroup.com>'
   ```

---

## 🔍 Logs y debugging

- Dashboard de Resend: https://resend.com/emails
- Ahí puedes ver todos los emails enviados, estado, errores, etc.

---

## ⚡ Comparación rápida

| Característica | Mailgun (main) | Resend (esta rama) |
|----------------|----------------|-------------------|
| Emails gratis/día | 100 (3 meses) | 100 (siempre) |
| Sandbox | ❌ Sí (requiere autorización) | ✅ No |
| Destinatarios | ⚠️ Solo autorizados | ✅ Cualquiera |
| Configuración | Más compleja | Más simple |
| Deliverability | Medio | Alto |

---

## 🆘 Solución de problemas

### Error: "Missing API key"
- Verifica que agregaste `RESEND_API_KEY` en Vercel
- Redeploy el proyecto después de agregar la variable

### Error: "Invalid API key"
- Verifica que la API key sea correcta
- Asegúrate que no tenga espacios al inicio o final

### Emails no llegan
- Revisa el dashboard de Resend para ver el estado
- Verifica la carpeta de spam
- Si usas dominio personalizado, verifica que esté correctamente configurado

---

## 📝 Notas importantes

- La rama `main` sigue usando **Mailgun** y está funcionando correctamente
- Esta rama `resend` es **experimental**
- Vercel por defecto hace deploy de `main`, no de `resend`
- Para probar esta rama en producción, debes crear un deployment manual desde Vercel

---

¿Preguntas? Revisa la documentación oficial: https://resend.com/docs
