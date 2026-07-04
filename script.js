
function guardarCaso() {

    const editables = document.querySelectorAll(".editable");

    const datos = [];

    editables.forEach(div => {
        datos.push(div.innerHTML);
    });

    localStorage.setItem("sirdecCaso", JSON.stringify(datos));

    alert("Caso guardado");
}

function cargarCaso() {

    const datos = JSON.parse(localStorage.getItem("sirdecCaso"));

    if (!datos) return;

    document.querySelectorAll(".editable").forEach((div, i) => {
        div.innerHTML = datos[i] || "";
    });
}

window.onload = cargarCaso;

function exportarWord(){
 const contenido='<!DOCTYPE html>'+document.documentElement.outerHTML;
 const blob=new Blob([contenido],{type:'application/msword'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download='Informe_Necropsia.doc';
 a.click();
}

function exportarPDF(){
 window.print();
}

setInterval(guardar,30000);
cargar();
