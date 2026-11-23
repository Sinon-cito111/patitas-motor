const catalogo = {
  nombre: "Patitas",
  servicios: [],
  subcategorias: [
    {
      nombre: "Consultas",
      servicios: [
        { nombre: "Consulta general", precio: 60000 },
        { nombre: "Consulta a domicilio", precio: 90000 }
      ],
      subcategorias: [
        {
          nombre: "Especializada",
          servicios: [
            { nombre: "Dermatología", precio: 110000 },
            { nombre: "Cardiología", precio: 130000 },
            { nombre: "Oftalmología", precio: null }
          ],
          subcategorias: []
        }
      ]
    },
    {
      nombre: "Cirugías",
      servicios: [],
      subcategorias: [
        {
          nombre: "Esterilización",
          servicios: [
            { nombre: "Gata", precio: 280000 },
            { nombre: "Perra", precio: 350000 }
          ],
          subcategorias: []
        },
        {
          nombre: "Limpieza dental",
          servicios: [
            { nombre: "Con anestesia", precio: 150000 }
          ],
          subcategorias: []
        }
      ]
    },
    {
      nombre: "Vacunas",
      servicios: [
        { nombre: "Rabia", precio: 45000 },
        { nombre: "Triple felina", precio: 85000 }
      ],
      subcategorias: []
    }
  ]
};

module.exports = catalogo;