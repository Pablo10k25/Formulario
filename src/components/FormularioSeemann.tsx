import { useState } from 'react';
import type { FormEvent } from 'react';
import './FormularioSeemann.css';

interface FormData {
  nombre: string;
  telefono: string;
  correo: string;
}

const FormularioSeemann = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    telefono: '',
    correo: '',
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



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
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
        <section className="form-section">
          <h2>Información de Contacto</h2>
          
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ingrese su nombre completo"
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
              placeholder="+(XX) XXXX XXXX"
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico (Opcional)</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
            />
          </div>
        </section>

        {/* Mensajes de estado */}
        {submitStatus === 'success' && (
          <div className="alert alert-success">
            ✓ ¡Información enviada exitosamente!
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="alert alert-error">
            ✗ Hubo un error al enviar el formulario. Por favor, intente nuevamente o contacte directamente a: contacto@seemanngroup.com
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
