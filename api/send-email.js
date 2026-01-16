const brevo = require('@getbrevo/brevo');
const { google } = require('googleapis');

// DEBUG: Ver qué variables tenemos
console.log('🔍 Variables de entorno:');
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✅ Configurada' : '❌ NO configurada');
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? '✅ Configurada' : '❌ NO configurada');
console.log('GOOGLE_CREDENTIALS:', process.env.GOOGLE_CREDENTIALS ? '✅ Configurada' : '❌ NO configurada');

// Configurar Brevo
let apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Configurar Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: process.env.GOOGLE_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CREDENTIALS) : null,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

module.exports = async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log para debug
    console.log('API Key configurada:', process.env.BREVO_API_KEY ? 'Sí' : 'No');
    
    const { 
      nombre, 
      telefono, 
      correo
    } = req.body;

    // Validar datos requeridos
    if (!nombre || !telefono) {
      return res.status(400).json({ error: 'Faltan datos requeridos: nombre y teléfono son obligatorios' });
    }

    // 1. GUARDAR EN GOOGLE SHEETS
    if (SPREADSHEET_ID) {
      console.log('📊 Intentando guardar en Google Sheets...');
      console.log('Sheet ID:', SPREADSHEET_ID);
      const timestamp = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
      
      try {
        const result = await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Respuestas!A:D',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              timestamp,
              nombre,
              telefono,
              correo || 'No proporcionado'
            ]],
          },
        });
        console.log('✅ Guardado en Google Sheets exitosamente');
      } catch (sheetError) {
        console.error('❌ ERROR de Google Sheets:', sheetError.message);
        // NO lanzar error, continuar con el proceso
      }
    } else {
      console.log('⚠️ GOOGLE_SHEET_ID no configurado');
    }

    // Preparar el HTML del email (diseño transaccional simple)
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="border-bottom: 3px solid #A41E34; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #A41E34;">SEEMANN GROUP</h2>
          <p style="margin: 5px 0 0 0; color: #666;">Confirmación de Registro</p>
        </div>
        
        <p>Estimado/a <strong>${nombre}</strong>,</p>
        
        <p>Gracias por contactarnos. Hemos recibido su información:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Nombre:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Teléfono:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td></tr>
          ${correo ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${correo}</td></tr>` : ''}
        </table>
        
        <p>Nuestro equipo se pondrá en contacto con usted a la brevedad.</p>
        
        <p>Saludos cordiales,<br><strong>Equipo Seemann Group</strong></p>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p>Seemann Group - Soluciones logísticas internacionales<br>
          Email: <a href="mailto:contacto@seemanngroup.com">contacto@seemanngroup.com</a> | Tel: +56 2 2604 8386</p>
        </div>
      </div>
    `;

    // 2. ENVIAR EMAIL DE CONFIRMACIÓN AL CLIENTE CON BREVO (solo si proporcionó email)
    if (correo) {
      let sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.sender = { name: 'Seemann Group', email: 'pablotrax03@gmail.com' };
      sendSmtpEmail.to = [{ email: correo, name: nombre }];
      sendSmtpEmail.replyTo = { email: 'pablotrax03@gmail.com', name: 'Seemann Group' };
      sendSmtpEmail.subject = 'Confirmación de Contacto - Seemann Group';
      sendSmtpEmail.htmlContent = emailHTML;
      sendSmtpEmail.headers = {
        'X-Priority': '1',
        'X-Category': 'transactional'
      };

      try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email de confirmación enviado al cliente. MessageId:', data.body?.messageId);
      } catch (error) {
        console.error('❌ Error al enviar email al cliente:', error);
        // No retornar error si el email falla, continuar con notificación al equipo
      }
    } else {
      console.log('ℹ️ Cliente no proporcionó email, saltando envío de confirmación');
    }

    // 3. ENVIAR NOTIFICACIÓN AL EQUIPO (TEXTO SIMPLE)
    const teamEmailText = `NUEVO CONTACTO - Formulario Seemann Group

Nombre: ${nombre}
Teléfono: ${telefono}
Email: ${correo || 'No proporcionado'}

---
Este es un mensaje automático del sistema de registro.`;

    let teamEmail = new brevo.SendSmtpEmail();
    teamEmail.sender = { name: 'Seemann Group', email: 'pablotrax03@gmail.com' };
    teamEmail.to = [
      { email: 'pablotrax03@gmail.com', name: 'Pablo Piñeiro' }
    ];
    teamEmail.subject = `Nuevo contacto: ${nombre}`;
    teamEmail.textContent = teamEmailText;

    try {
      const teamData = await apiInstance.sendTransacEmail(teamEmail);
      console.log('✅ Notificación enviada al equipo. MessageId:', teamData.body?.messageId);
    } catch (error) {
      console.error('⚠️ Error al enviar notificación al equipo (no crítico):', error);
      // No retornar error, ya que el email principal fue enviado
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Registro completado exitosamente'
    });

  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};
