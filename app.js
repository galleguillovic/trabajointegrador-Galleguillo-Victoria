const form = document.getElementById('form-receta');
const preview = document.getElementById('preview');
const inputImagen = document.getElementById('imagen');
const listaRecetas = document.getElementById('lista-recetas');

let imagenTemporal = 'img/descarga.jpg';

// Vista previa de una imagen predeterminada
inputImagen.addEventListener('change', () => {
  const archivo = inputImagen.files[0];
  if (archivo) {
    const lector = new FileReader();
    lector.onload = e => {
      imagenTemporal = e.target.result;
      preview.src = imagenTemporal;
    };
    lector.readAsDataURL(archivo);
  } else {
    imagenTemporal = 'img/descarga.jpg';
    preview.src = imagenTemporal;
  }
});

// Mostrar recetas ya cargadas anteriormente o de ejemplo
const cargarRecetasIniciales = () => {
  const recetasGuardadas = JSON.parse(localStorage.getItem('recetas'));
  if (!recetasGuardadas || recetasGuardadas.length === 0) {
    const recetasIniciales = [
      {
        id: Date.now(),
        titulo: 'Pizza casera',
        ingredientes: '500gr de harina común\n300ml de agua\n7gr de levadura seca\n10gr de sal\n20gr de aceite de oliva\n2 cucharadas de azucar\nQueso y salsa agusto',
        link: 'https://www.youtube.com/watch?v=crdtrzZj3fo',
        imagen: 'img/pizza.jpg'
      },
      {
        id: Date.now() + 1,
        titulo: 'Chipa',
        ingredientes: '500gr almidón de mandioca\n3 huevos\n120gr de manteca\n250gr de queso pategrás\n150gr de queso parmesano\n100ml de leche\n1 cucharada de polvo para hornear',
        link: 'https://www.youtube.com/watch?v=FNGDishTqA4',
        imagen: 'img/chipa.jpg'
      },
      {
        id: Date.now() + 2,
        titulo: 'Rolls de canela',
        ingredientes: '600gr de harina común\n245ml de leche\n250gr de azúcar\n25gr levadura fresca\n2 huevos\n150gr de manteca\nCanela a gusto',
        link: 'https://www.youtube.com/watch?v=13EoB5m1IEU&t=10s',
        imagen: 'img/rollcanela.jpg'
      }
    ];
    localStorage.setItem('recetas', JSON.stringify(recetasIniciales));
  }
};

// Envío del formulario y carga de los datos
form.addEventListener('submit', e => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value;
  const ingredientes = document.getElementById('ingredientes').value;
  const link = document.getElementById('link').value;

  const receta = {
    id: Date.now(),
    titulo,
    ingredientes,
    link,
    imagen: imagenTemporal || 'img/descarga.jpg'
  };

  const recetas = JSON.parse(localStorage.getItem('recetas')) || [];
  recetas.push(receta);
  localStorage.setItem('recetas', JSON.stringify(recetas));

  form.reset();
  preview.src = 'img/descarga.jpg';
  imagenTemporal = 'img/descarga.jpg';
  mostrarRecetas();
});

// Eliminar receta
const eliminarReceta = id => {
  let recetas = JSON.parse(localStorage.getItem('recetas')) || [];
  recetas = recetas.filter(r => r.id !== id);
  localStorage.setItem('recetas', JSON.stringify(recetas));
  mostrarRecetas();
};

// Mostrar/ocultar ingredientes
const toggleIngredientes = boton => {
  const contenedor = boton.nextElementSibling;
  contenedor.classList.toggle('oculto');

  boton.textContent = contenedor.classList.contains('oculto')
    ? 'Ver ingredientes👀'
    : 'Ocultar ingredientes🫣';
};

// Mostrar recetas
const mostrarRecetas = () => {
  const recetas = JSON.parse(localStorage.getItem('recetas')) || [];
  listaRecetas.innerHTML = '';

  recetas.reverse().map(receta => {
    const div = document.createElement('div');
    div.classList.add('receta');
    div.innerHTML = `
      <h3>${receta.titulo}</h3>
      <img src="${receta.imagen}" alt="Imagen de receta">

      <button class="toggle-btn" onclick="toggleIngredientes(this)">Ver ingredientes👀</button>
      <div class="ingredientes oculto">
        <p><strong>Ingredientes:</strong><br>${receta.ingredientes.replace(/\n/g, '<br>')}</p>
      </div>

      ${receta.link ? `<a href="${receta.link}" class="link-receta" target="_blank">Ver receta completa</a>` : ''}
      
      <button class="eliminar-btn" onclick="eliminarReceta(${receta.id})">Eliminar</button>
    `;
    listaRecetas.appendChild(div);
  });
};

// Al cargar la página
window.addEventListener('load', () => {
  cargarRecetasIniciales();
  mostrarRecetas();
});