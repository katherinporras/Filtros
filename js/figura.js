const imagen = document.querySelector('#imagen');
const btn_restablecer = document.querySelector('#restablecer');
const btn_mediana = document.querySelector('#mediana');
const btn_media = document.querySelector('#media');
const btn_laplaciano = document.querySelector('#laplaciano');
const btn_sobel=document.querySelector('#sobel');
const imagenPreview = document.querySelector('#imagenPreview');
const select_canvas = document.querySelector('#select_canvas');
      
/*const canvas = document.getElementById("canvas");*/
const ctx = select_canvas.getContext("2d");



/*img.src = "eren.jpg";*/
imagen.addEventListener('change', ()=>{
            
  const selectImagen = imagen.files;

  if (!selectImagen || !selectImagen.length) {
      imagenPreview.src = "";
      return;
    }

      const primerArchivo = selectImagen[0];
      const objectURL = URL.createObjectURL(primerArchivo);
      imagenPreview.src = objectURL;              

      imagenPreview.onload = function(){
          ctx.clearRect(0, 0, ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
          ctx.drawImage(imagenPreview, x, y, width, height);
          let imgData = ctx.getImageData(x,y,width,height);
          datosOriginales = imgData.data;
          
      }
   
});

btn_laplaciano.addEventListener('click', ()=>{

  /*img.onload = function() {*/
    select_canvas.width = imagenPreview.width;
    select_canvas.height = imagenPreview.height;
    ctx.drawImage(imagenPreview, 0, 0, select_canvas.width, select_canvas.height);
    // Obtener los datos de la imagen
    const imageData = ctx.getImageData(0, 0, select_canvas.width, select_canvas.height);
    const data = imageData.data;
    const w = select_canvas.width;
    const h = select_canvas.height;
    // Aplicar el filtro Laplaciano
    const newData = new Uint8ClampedArray(w * h * 4);

    
    const laplacian = [ //-> el principal el q esta puesto 
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0]
    ];
    /*
    const laplacian = [
      [1, 1, 1],
      [1, -8, 1],
      [1, 1, 1]
    ];*/

    /*const laplacian = [   // Con es te codigo es mas borroso no se nota mucho las lineas 
      [-1, 2, -1],
      [2, -4, 2],
      [-1, 2, -1]
    ];*/

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let sum = 0;
        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            const idx = ((y + j) * w + x + i) * 4;
            const c = data[idx];
            const r = data[idx + 1];
            const g = data[idx + 2];
            const b = data[idx + 3];
            const factor = laplacian[j + 1][i + 1];
            sum += factor * c;
          }
        }
        const idx = (y * w + x) * 4;
        newData[idx] = sum;
        newData[idx + 1] = sum;
        newData[idx + 2] = sum;
        newData[idx + 3] = 255;
      }
    }
    // Dibujar la imagen filtrada en el canvas
    const newImageData = new ImageData(newData, w, h);
    ctx.putImageData(newImageData, 0, 0);
  
});

btn_sobel.addEventListener('click', ()=>{
  
    select_canvas.width = imagenPreview.width;
    select_canvas.height = imagenPreview.height;
    ctx.drawImage(imagenPreview, 0, 0, select_canvas.width, select_canvas.height);
    // Obtener los datos de la imagen
    const imageData = ctx.getImageData(0, 0, select_canvas.width, select_canvas.height);
    const data = imageData.data;
    const w = select_canvas.width;
    const h = select_canvas.height;
    // Aplicar el filtro de Sobel
    const newData = new Uint8ClampedArray(w * h * 4);
    //SOBEL EDGE 
    const sobelX = [ // filtro de sobel 3*3 derivada de x (KERNEL) 
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];
    const sobelY = [ // filtro de sobel 3*3 derivada de y
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ];
/*
    const sobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];
    const sobelY = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1]
    ];*/
   /* const sobelX = [ // Con esto es mas ruidoso (Scharr)
      [3, 0, -3],
      [10, 0, -10],
      [3, 0, -3]
    ];
    const sobelY = [
      [3, 10, 3],
      [0, 0, 0],
      [-3, -10, -3]
    ]*/

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let sx = 0, sy = 0;
        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            const idx = ((y + j) * w + x + i) * 4;
            const c = data[idx];
            const r = data[idx + 1];
            const g = data[idx + 2];
            const b = data[idx + 3];
            const factor = sobelX[j + 1][i + 1];
            sx += factor * c;
            sy += factor * c;
            const factor2 = sobelY[j + 1][i + 1];
            sx += factor2 * c;
            sy += factor2 * c;
          }
        }
        const idx = (y * w + x) * 4;
        const v = Math.sqrt(sx * sx + sy * sy);
        newData[idx] = v;
        newData[idx + 1] = v;
        newData[idx + 2] = v;
        newData[idx + 3] = 255;
      }
    }
    // Dibujar la imagen filtrada en el canvas
    const newImageData = new ImageData(newData, w, h);
    ctx.putImageData(newImageData, 0, 0);
  
});

btn_media.addEventListener('click', ()=>{
  select_canvas.width = imagenPreview.width;
  select_canvas.height = imagenPreview.height;
  ctx.drawImage(imagenPreview, 0, 0, select_canvas.width, select_canvas.height);
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;
const w = canvas.width;
const h = canvas.height;
  const newData = new Uint8ClampedArray(w * h * 4);
  const kernelSize = 3; // Tamaño del kernel
  const halfKernelSize = Math.floor(kernelSize / 2);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0;
      let count = 0;
      for (let j = -halfKernelSize; j <= halfKernelSize; j++) {
        for (let i = -halfKernelSize; i <= halfKernelSize; i++) {
          const pixelY = y + j;
          const pixelX = x + i;
          if (pixelY >= 0 && pixelY < h && pixelX >= 0 && pixelX < w) {
            const idx = (pixelY * w + pixelX) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }
      }
      const idx = (y * w + x) * 4;
      newData[idx] = Math.round(r / count);
      newData[idx + 1] = Math.round(g / count);
      newData[idx + 2] = Math.round(b / count);
      newData[idx + 3] = 255;
    }
  }

  // Dibujar la imagen filtrada en el canvas
const newImageData = new ImageData(newData, w, h);
ctx.putImageData(newImageData, 0, 0);

});

btn_mediana.addEventListener('click', ()=>{
  
    select_canvas.width = imagenPreview.width;
    select_canvas.height = imagenPreview.height;
    ctx.drawImage(imagenPreview, 0, 0, select_canvas.width, select_canvas.height);
    // Obtener los datos de la imagen
    const imageData = ctx.getImageData(0, 0, select_canvas.width, select_canvas.height);
    const data = imageData.data;
    const w = select_canvas.width;
    const h = select_canvas.height;
    // Aplicar el filtro de mediana
    const newData = new Uint8ClampedArray(w * h * 4);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const neighbors = [];
        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            const idx = ((y + j) * w + x + i) * 4;
            neighbors.push(data[idx], data[idx + 1], data[idx + 2]);
          }
        }
        neighbors.sort(function(a, b) { return a - b; });
        const idx = (y * w + x) * 4;
        newData[idx] = neighbors[4];
        newData[idx + 1] = neighbors[5];
        newData[idx + 2] = neighbors[6];
        newData[idx + 3] = 255;
      }
    }
    // Dibujar la imagen filtrada en el canvas
    const newImageData = new ImageData(newData, w, h);
    ctx.putImageData(newImageData, 0, 0);
   
});

