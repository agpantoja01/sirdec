import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {

    PEGA_AQUI_TU_CONFIG

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

let plantillaOriginal = [];

function capturarPlantillaOriginal() {

    plantillaOriginal = [];

    document
        .querySelectorAll(".editable")
        .forEach(div => {

            plantillaOriginal.push(
                div.innerHTML
            );

        });

}

window.guardarCaso = async function () {

    const datos = [];

    document
        .querySelectorAll(".editable")
        .forEach(div => {

            datos.push(div.innerHTML);

        });

    await setDoc(
        doc(db, "casos", "caso_actual"),
        {
            contenido: datos,
            fecha: Date.now()
        }
    );

    alert("Caso guardado");
};

async function cargarCaso() {

    const documento =
        await getDoc(
            doc(db, "casos", "caso_actual")
        );

    if (!documento.exists()) return;

    const datos =
        documento.data().contenido;

    document
        .querySelectorAll(".editable")
        .forEach((div, i) => {

            div.innerHTML =
                datos[i] || "";

        });

}

window.restablecerCaso = async function () {

    const confirmar =
        confirm(
            "¿Crear un nuevo caso?"
        );

    if (!confirmar) return;

    document
        .querySelectorAll(".editable")
        .forEach((div, i) => {

            div.innerHTML =
                plantillaOriginal[i];

        });

    await setDoc(
        doc(db, "casos", "caso_actual"),
        {
            contenido: plantillaOriginal,
            fecha: Date.now()
        }
    );

};

window.onload = async () => {

    capturarPlantillaOriginal();

    await cargarCaso();

};
