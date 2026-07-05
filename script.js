import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {

    getFirestore,

    doc,

    setDoc,

    getDoc,

    collection,

    getDocs,

    deleteDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
function aplicarColorCaso(numeroCaso){

    let hash = 0;

    for(let i = 0; i < numeroCaso.length; i++){

        hash =
            numeroCaso.charCodeAt(i)
            + ((hash << 5) - hash);

    }

    const color =
        `hsl(${Math.abs(hash) % 360}, 70%, 50%)`;

    document.documentElement.style.setProperty(
        "--color-caso",
        color
    );

}

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

window.nuevoCaso = function () {

    const numeroCaso =
        prompt("Número del caso");

    if (!numeroCaso) return;

    casoActual = numeroCaso;
    document.getElementById("casoActivo").textContent =
    "Caso: " + numeroCaso;

document.title =
    "SIRDEC - " + numeroCaso;

    document
        .querySelectorAll(".editable")
        .forEach((div, i) => {

            div.innerHTML =
                plantillaOriginal[i];

        });

};


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

};

window.abrirCaso = async function () {

    const id =
        document.getElementById(
            "listaCasos"
        ).value;

    if (!id) return;

    const documento =
        await getDoc(
            doc(
                db,
                "casos",
                id
            )
        );

    if (!documento.exists())
        return;

    casoActual = id;

    const datos =
        documento.data().contenido;

    document
        .querySelectorAll(".editable")
        .forEach((div, i) => {

            div.innerHTML =
                datos[i] || "";

        });

    document.getElementById("casoActivo").textContent =
    "Caso: " + id;
document.title =
    "SIRDEC - " + id;
};

window.eliminarCaso = async function () {

    const id =
        document.getElementById(
            "listaCasos"
        ).value;

    if (!id) return;

    const confirmar =
        confirm(
            "¿Eliminar caso?"
        );

    if (!confirmar)
        return;

    await deleteDoc(
        doc(
            db,
            "casos",
            id
        )
    );

    await cargarListaCasos();

};

window.onload = async () => {

    capturarPlantillaOriginal();

    await cargarListaCasos();

};

window.exportarPDF = function () {

    const contenido =
        document.body;

    html2pdf()
        .set({
            margin: 10,
            filename:
                (casoActual || "caso")
                + ".pdf",
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        })
        .from(contenido)
        .save();

};


window.exportarWord = function () {

    let contenido = `
        <html>
        <head>
            <meta charset="utf-8">
        </head>
        <body>
    `;

    document
        .querySelectorAll(".editable")
        .forEach(div => {

            contenido +=
                `<p>${div.innerHTML}</p>`;

        });

    contenido += `
        </body>
        </html>
    `;

    const blob =
        new Blob(
            [contenido],
            {
                type:
                "application/msword"
            }
        );

    saveAs(
        blob,
        (casoActual || "caso")
        + ".doc"
    );

};
