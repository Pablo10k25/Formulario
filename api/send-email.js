const { Resend } = require('resend');
const { google } = require('googleapis');

// DEBUG: Ver qué variables tenemos
console.log('🔍 Variables de entorno:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ NO configurada');
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? '✅ Configurada' : '❌ NO configurada');
console.log('GOOGLE_CREDENTIALS:', process.env.GOOGLE_CREDENTIALS ? '✅ Configurada' : '❌ NO configurada');

// Inicializar Resend con tu API key
const resend = new Resend(process.env.RESEND_API_KEY);

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
    console.log('API Key configurada:', process.env.RESEND_API_KEY ? 'Sí' : 'No');
    
    const { 
      rut, 
      nombre, 
      apellido, 
      telefono, 
      correo, 
      empresa, 
      direccion, 
      comuna, 
      ciudad
    } = req.body;

    // Validar datos requeridos
    if (!correo || !nombre || !apellido) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // 1. GUARDAR EN GOOGLE SHEETS
    if (SPREADSHEET_ID) {
      console.log('📊 Intentando guardar en Google Sheets...');
      console.log('Sheet ID:', SPREADSHEET_ID);
      const timestamp = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
      
      try {
        const result = await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Respuestas!A:J',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              timestamp,
              rut,
              nombre,
              apellido,
              telefono,
              correo,
              empresa,
              direccion,
              comuna,
              ciudad
            ]],
          },
        });
        console.log('✅ Guardado en Google Sheets exitosamente');
      } catch (sheetError) {
        console.error('❌ ERROR COMPLETO de Google Sheets:');
        console.error('Mensaje:', sheetError.message);
        console.error('Status:', sheetError.status);
        console.error('Code:', sheetError.code);
        // NO lanzar error, continuar con el proceso
      }
    } else {
      console.log('⚠️ GOOGLE_SHEET_ID no configurado');
    }

    // 2. PREPARAR EMAIL DE CONFIRMACIÓN AL CLIENTE
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #A41E34 0%, #B71C3A 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">SEEMANN GROUP</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Formulario de Registro</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <p>Estimado/a <strong>${nombre} ${apellido}</strong>,</p>
          
          <p>Gracias por registrar su información en Seemann Group.</p>
          
          <p>Hemos recibido exitosamente sus datos y nuestro equipo los revisará en breve.</p>
          
          <h3 style="color: #A41E34; margin-top: 25px;">Información registrada:</h3>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #A41E34;">
            <p><strong>RUT:</strong> ${rut}</p>
            <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Empresa:</strong> ${empresa}</p>
            <p><strong>Dirección:</strong> ${direccion}</p>
            <p><strong>Comuna:</strong> ${comuna}</p>
            <p><strong>Ciudad:</strong> ${ciudad}</p>
          </div>
          
          <p style="margin-top: 30px;">Nos pondremos en contacto con usted a la brevedad.</p>
          
          <p>Saludos cordiales,<br>
          <strong>Equipo Seemann Group</strong></p>
        </div>
        
        <div style="background: #1a1a1a; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 5px 0;"><strong>Seemann Group</strong></p>
          <p style="margin: 5px 0;">Líder en soluciones logísticas internacionales</p>
          <p style="margin: 5px 0;">
            <a href="mailto:contacto@seemanngroup.com" style="color: #B71C3A; text-decoration: none;">contacto@seemanngroup.com</a> | 
            <a href="tel:+56226048386" style="color: #B71C3A; text-decoration: none;">+56 2 2604 8386</a>
          </p>
        </div>
      </div>
    `;

    // 3. ENVIAR EMAIL DE CONFIRMACIÓN AL CLIENTE
    const { data, error } = await resend.emails.send({
      from: 'Seemann Group <onboarding@resend.dev>',
      to: [correo],
      subject: 'Confirmación de Registro - Seemann Group',
      html: emailHTML,
    });

    if (error) {
      console.error('Error al enviar email al cliente:', error);
      return res.status(400).json({ 
        error: 'Error al enviar el email',
        details: error.message 
      });
    }

    console.log('✅ Email enviado al cliente:', data);

    // 4. ENVIAR NOTIFICACIÓN AL EQUIPO
    const teamEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #A41E34 0%, #B71C3A 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🔔 NUEVA SOLICITUD</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Formulario de Registro - Seemann Group</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <p><strong>Se ha recibido una nueva solicitud de registro.</strong></p>
          
          <h3 style="color: #A41E34; margin-top: 25px;">Datos del cliente:</h3>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #A41E34;">
            <p><strong>RUT:</strong> ${rut}</p>
            <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Email:</strong> ${correo}</p>
            <p><strong>Empresa:</strong> ${empresa}</p>
            <p><strong>Dirección:</strong> ${direccion}</p>
            <p><strong>Comuna:</strong> ${comuna}</p>
            <p><strong>Ciudad:</strong> ${ciudad}</p>
          </div>
          
          <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
            ⚡ <strong>Acción requerida:</strong> Contactar al cliente a la brevedad.
          </p>
        </div>
        
        <div style="background: #1a1a1a; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 5px 0;">Formulario Web - Seemann Group</p>
          <p style="margin: 5px 0;">Este email se generó automáticamente</p>
        </div>
      </div>
    `;

    try {
      console.log('📧 Enviando notificación al equipo: pablotrax03@gmail.com');
      const teamResult = await resend.emails.send({
        from: 'Seemann Group <onboarding@resend.dev>',
        to: ['pablotrax03@gmail.com'],
        subject: `🔔 Nueva solicitud de ${nombre} ${apellido} - ${empresa}`,
        html: teamEmailHTML,
      });
      console.log('✅ Respuesta completa de Resend (equipo):', JSON.stringify(teamResult, null, 2));
      
      if (teamResult.error) {
        console.error('❌ Resend retornó ERROR:', teamResult.error);
      } else {
        console.log('✅ Email al equipo enviado. ID:', teamResult.data?.id || teamResult.id);
      }
    } catch (teamEmailError) {
      console.error('❌ EXCEPCIÓN al enviar notificación al equipo:');
      console.error('Mensaje:', teamEmailError.message);
      console.error('Detalles completos:', JSON.stringify(teamEmailError, null, 2));
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Email enviado exitosamente',
      messageId: data.id
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    return res.status(500).json({ 
      error: 'Error al enviar el email',
      details: error.message 
    });
  }
};
