import { useState } from 'react';
import type { FormEvent } from 'react';
import { jsPDF } from 'jspdf';
import './FormularioSeemann.css';

interface FormData {
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  empresa: string;
  direccion: string;
  comuna: string;
  ciudad: string;
}

const FormularioSeemann = () => {
  const [formData, setFormData] = useState<FormData>({
    rut: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    empresa: '',
    direccion: '',
    comuna: '',
    ciudad: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generarPDF = (): string => {
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
    doc.text(formData.rut, 70, y);
    y += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Nombre Completo:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.nombre} ${formData.apellido}`, 70, y);
    y += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Correo Electrónico:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.correo, 70, y);
    y += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Teléfono:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.telefono, 70, y);
    y += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Empresa:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.empresa, 70, y);
    y += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Dirección:', 20, y);
    doc.setFont('helvetica', 'normal');
    const direccionLines = doc.splitTextToSize(formData.direccion, 120);
    doc.text(direccionLines, 70, y);
    y += direccionLines.length * 7;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Comuna:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.comuna, 70, y);
    y += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Ciudad:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.ciudad, 70, y);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Seemann Group - Líder en soluciones logísticas internacionales', 105, 285, { align: 'center' });
    doc.text('contacto@seemanngroup.com | +56 2 2604 8386', 105, 290, { align: 'center' });
    
    // Convertir a base64
    return doc.output('dataurlstring');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Ya no generamos el PDF aquí, se genera en el backend
      
      // Enviar datos al backend (Vercel Function)
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rut: formData.rut,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          correo: formData.correo,
          empresa: formData.empresa,
          direccion: formData.direccion,
          comuna: formData.comuna,
          ciudad: formData.ciudad,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el formulario');
      }

      setSubmitStatus('success');
      
      // Limpiar formulario
      setFormData({
        rut: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        empresa: '',
        direccion: '',
        comuna: '',
        ciudad: '',
      });

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitStatus('error');
      
      // Ocultar mensaje de error después de 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h1>SEEMANN GROUP</h1>
        <p className="subtitle">Formulario de Registro</p>
        <p className="description">
          Líder en soluciones logísticas internacionales con más de 35 años de experiencia. 
          Conectamos tu negocio con el mundo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="formulario-form">
        {/* Información Básica */}
        <section className="form-section">
          <h2>Información de Contacto</h2>
          
          <div className="form-group">
            <label htmlFor="rut">RUT *</label>
            <input
              type="text"
              id="rut"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              required
              placeholder="12.345.678-9 (con puntos y guión)"
            />
            <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px', display: 'block' }}>
              Ejemplo: 12.345.678-9 (incluir puntos y guión)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ingrese su nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido *</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              placeholder="Ingrese su apellido"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="empresa">Nombre de la Empresa *</label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              required
              placeholder="Nombre de su empresa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección Comercial *</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              placeholder="Calle, número, oficina"
            />
          </div>

          <div className="form-group">
            <label htmlFor="comuna">Comuna *</label>
            <input
              type="text"
              id="comuna"
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
              required
              placeholder="Comuna"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">Ciudad *</label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
              placeholder="Ciudad"
            />
          </div>
        </section>

        {/* Mensajes de estado */}
        {submitStatus === 'success' && (
          <div className="alert alert-success">
            ✓ ¡Información enviada exitosamente! Recibirá un correo de confirmación con sus datos en formato PDF.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="alert alert-error">
            ✗ Hubo un error al enviar el formulario. 
            {formData.correo && !formData.correo.includes('sphereglobal.io') && (
              <span>
                <br /><br />
                <strong>Nota:</strong> El email debe estar autorizado en Mailgun. 
                Si es un email de prueba, por favor usa un email autorizado o contacta directamente a: contacto@seemanngroup.com
              </span>
            )}
          </div>
        )}

        {/* Botón de envío */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Información'}
          </button>
        </div>
      </form>

      {/* Footer */}
      <footer className="formulario-footer">
        <p>
          <strong>Seemann Group</strong> - Líder en soluciones logísticas internacionales
        </p>
        <p>
          <a href="mailto:contacto@seemanngroup.com">contacto@seemanngroup.com</a> | 
          <a href="tel:+56226048386"> +56 2 2604 8386</a>
        </p>
      </footer>
    </div>
  );
};

export default FormularioSeemann;
