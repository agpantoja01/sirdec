import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    deleteDoc
}

const firebaseConfig = {
  apiKey: "AIzaSyAI-a4ORQan_jb2q0xKLs1wcr7cM5W10lM",
  authDomain: "sirdec-assistant.firebaseapp.com",
  projectId: "sirdec-assistant",
  storageBucket: "sirdec-assistant.firebasestorage.app",
  messagingSenderId: "634020647135",
  appId: "1:634020647135:web:b331c05b5f60824492596a"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

let plantillaOriginal = [];
let casoActual = null;

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

    if (!casoActual) {

        alert(
            "Primero cree un nuevo caso"
        );

        return;
    }

    const datos = [];

    document
        .querySelectorAll(".editable")
        .forEach(div => {

            datos.push(div.innerHTML);

        });

    await setDoc(
        doc(
            db,
            "casos",
            casoActual
        ),
        {
            nombre: casoActual,
            contenido: datos,
            fecha: Date.now()
        }
    );

    await cargarListaCasos();

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

    window.nuevoCaso = function () {

        async function cargarListaCasos() {

    const lista =
        document.getElementById(
            "listaCasos"
        );

    lista.innerHTML = "";

    const snapshot =
        await getDocs(
            collection(
                db,
                "casos"
            )
        );

    snapshot.forEach(docu => {

        const opcion =
            document.createElement(
                "option"
            );

        opcion.value =
            docu.id;

        opcion.textContent =
            docu.id;

        lista.appendChild(
            opcion
        );

    });

}

    const numeroCaso =
        prompt(
            "Número del caso"
        );

    if (!numeroCaso) return;

    casoActual = numeroCaso;

    document
        .querySelectorAll(".editable")
        .forEach((div, i) => {

            div.innerHTML =
                plantillaOriginal[i];

        });

};

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
