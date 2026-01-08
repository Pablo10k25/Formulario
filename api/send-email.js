import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      rut, 
      nombre, 
      apellido, 
      telefono, 
      correo, 
      empresa, 
      direccion, 
      comuna, 
      ciudad,
      pdfBase64 
    } = req.body;

    // Validar datos requeridos
    if (!correo || !nombre || !apellido) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Configurar Mailgun
    const mg = mailgun.client({
      username: 'api',
      key: 'da75815501e47e1dbea988c2bfd65728-f6d80573-badd1e26'
    });

    // Preparar el HTML del email
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
          
          <p><strong>Nota:</strong> Adjuntamos un PDF con el detalle completo de su información para su registro.</p>
          
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

    // Convertir el PDF base64 a buffer para attachment
    const attachments = [];
    if (pdfBase64) {
      // Remover el prefijo "data:application/pdf;base64," si existe
      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      
      attachments.push({
        filename: `Registro_${nombre}_${apellido}.pdf`,
        data: pdfBuffer
      });
    }

    // Preparar datos del mensaje
    const messageData = {
      from: 'Seemann Group <postmaster@sandbox8c39856aa66e44aeb317a40bb447c6f1.mailgun.org>',
      to: correo,
      subject: 'Confirmación de Registro - Seemann Group',
      html: emailHTML,
      text: `Confirmación de Registro\n\nGracias por registrar su información en Seemann Group.\n\nRUT: ${rut}\nNombre: ${nombre} ${apellido}\nTeléfono: ${telefono}\nEmpresa: ${empresa}\nDirección: ${direccion}\nComuna: ${comuna}\nCiudad: ${ciudad}\n\nNos pondremos en contacto con usted a la brevedad.\n\nSeemann Group`,
      attachment: attachments
    };

    // Enviar el email
    const result = await mg.messages.create(
      'sandbox8c39856aa66e44aeb317a40bb447c6f1.mailgun.org',
      messageData
    );

    console.log('Email enviado:', result);

    return res.status(200).json({ 
      success: true, 
      message: 'Email enviado exitosamente',
      messageId: result.id
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    return res.status(500).json({ 
      error: 'Error al enviar el email',
      details: error.message 
    });
  }
}
