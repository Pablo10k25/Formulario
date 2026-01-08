import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { jsPDF } from 'jspdf';

const mailgun = new Mailgun(formData);

// Función para generar el PDF en el servidor
function generarPDF(datos) {
  const doc = new jsPDF();
  
  // Configurar fuente y colores
  doc.setFontSize(20);
  doc.setTextColor(164, 30, 52); // Rojo Seemann
  doc.text('SEEMANN GROUP', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('Registro de Información', 105, 30, { align: 'center' });
  
  // Línea separadora
  doc.setDrawColor(164, 30, 52);
  doc.line(20, 35, 190, 35);
  
  let y = 50;
  
  // Información del usuario
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN REGISTRADA', 20, y);
  y += 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RUT:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.rut, 70, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Nombre Completo:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.nombre} ${datos.apellido}`, 70, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Correo Electrónico:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.correo, 70, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Teléfono:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.telefono, 70, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Empresa:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.empresa, 70, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Dirección:', 20, y);
  doc.setFont('helvetica', 'normal');
  const direccionLines = doc.splitTextToSize(datos.direccion, 120);
  doc.text(direccionLines, 70, y);
  y += direccionLines.length * 7;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Comuna:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.comuna, 70, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Ciudad:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.ciudad, 70, y);
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('Seemann Group - Líder en soluciones logísticas internacionales', 105, 285, { align: 'center' });
  doc.text('contacto@seemanngroup.com | +56 2 2604 8386', 105, 290, { align: 'center' });
  
  // Retornar el buffer del PDF
  return Buffer.from(doc.output('arraybuffer'));
}

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

    // Generar PDF en el servidor
    const pdfBuffer = generarPDF({
      rut,
      nombre,
      apellido,
      telefono,
      correo,
      empresa,
      direccion,
      comuna,
      ciudad
    });
    
    // Crear attachment
    const attachments = [{
      filename: `Registro_${nombre}_${apellido}.pdf`,
      data: pdfBuffer
    }];

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
