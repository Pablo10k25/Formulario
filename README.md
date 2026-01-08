# Formulario Seemann Group

Cuestionario de servicios logísticos para Seemann Group - Líder en soluciones logísticas internacionales con más de 35 años de experiencia.

## 🚀 Características

- ✅ Formulario completo con información de contacto
- 📧 Envío automático de email de confirmación usando **Mailgun**
- 📄 Generación de PDF con la información registrada
- 🎨 Diseño responsive con los colores corporativos de Seemann Group
- ⚡ Construido con Vite + React + TypeScript
- 🔒 API Key segura mediante Vercel Serverless Functions

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## ⚙️ Configuración

La integración con **Mailgun** ya está lista. Solo necesitas:

1. **Autorizar emails de prueba** (modo sandbox):
   - Ve a tu dashboard de Mailgun
   - Agrega "Authorized Recipients" para emails de prueba

2. **Para producción**, verifica tu dominio propio en Mailgun

Lee la guía completa en [README_CONFIGURACION.md](./README_CONFIGURACION.md) para:
- Configurar un dominio propio
- Personalizar el formulario
- Modificar el template del email

## 🌐 Deploy

Este proyecto está listo para desplegarse en Vercel:

```bash
# Opción 1: CLI
npm install -g vercel
vercel

# Opción 2: Conectar con GitHub desde vercel.com
```

## 📋 Estructura del Proyecto

```
Formulario/
├── src/
│   ├── components/
│   │   ├── FormularioSeemann.tsx    # Componente principal
│   │   └── FormularioSeemann.css    # Estilos
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── vercel.json
└── README_CONFIGURACION.md          # Guía de configuración detallada
```

## 🎨 Tecnologías

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Mailgun** - Servicio de envío de emails
- **Vercel Functions** - Backend serverless
- **jsPDF** - Generación de PDFs
- **CSS3** - Estilos con variables y gradientes

## 📞 Contacto Seemann Group

- 🌐 Web: https://pagina-seemann-group.vercel.app/
- 📧 Email: contacto@seemanngroup.com
- 📱 Teléfono: +56 2 2604 8386

---

Desarrollado para **Seemann Group** 🚢✈️🚚