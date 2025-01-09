// Elementos del DOM
const excelDataTextarea = document.getElementById("excel-data");
const extractDataButton = document.getElementById("extract-data");
const form = document.getElementById("data-form");
const generateTemplateButton = document.getElementById("generate-template");
const clearDataButton = document.getElementById("clear-data");
const emailSubjectTextarea = document.getElementById("email-subject");
const emailBodyTextarea = document.getElementById("email-body");
const emailAddressTextarea = document.getElementById("email-address");
const copySubjectButton = document.getElementById("copy-subject");
const copyBodyButton = document.getElementById("copy-body");

// Extraer datos de la fila pegada
extractDataButton.addEventListener("click", () => {
    const rawData = excelDataTextarea.value.trim();
    if (!rawData) {
        alert("Por favor, pega datos desde Excel.");
        return;
    }

    // Separar datos de la fila pegada por tabulación
    const columns = rawData.split("\t");

    // Asignar valores a los campos del formulario
    form["apellido"].value = columns[1] || "";
    form["nombre"].value = columns[2] || "";
    form["alias"].value = columns[3] || "";
    form["tipo-documento"].value = columns[5] || "DNI";
    form["nro-documento"].value = columns[6] || "";
    form["nro-causa"].value = columns[18] || "";
    form["judicatura-actuante"].value = columns[19] || "";
    form["nro-judicatura"].value = columns[20] || "";

    fetchJudicaturaEmail();
});

// Función para buscar el correo de la judicatura desde un archivo JSON
async function fetchJudicaturaEmail() {
    const judicaturaActuante = form["judicatura-actuante"].value.trim();
    const nroJudicatura = form["nro-judicatura"].value.trim();

    if (!judicaturaActuante || !nroJudicatura) {
        emailAddressTextarea.value = "Datos de judicatura incompletos";
        return;
    }

    try {
        const response = await fetch("judicaturas.json"); // Asegúrate de que el archivo JSON esté en la misma carpeta del proyecto
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo de judicaturas.");
        }

        const judicaturas = await response.json();
        console.log(judicaturas);

        const correo = judicaturas[judicaturaActuante]?.[nroJudicatura] || "Correo no encontrado";
        emailAddressTextarea.value = correo;
    } catch (error) {
        console.error("Error al buscar el correo de la judicatura:", error);
        emailAddressTextarea.value = "Error al buscar el correo";
    }
}




// Generar plantilla
generateTemplateButton.addEventListener("click", () => {
    const apellido = form["apellido"].value.trim();
    const nombre = form["nombre"].value.trim();
    const alias = form["alias"].value.trim();
    const tipoDocumento = form["tipo-documento"].value.trim();
    const nroDocumento = form["nro-documento"].value.trim();
    const nroCausa = form["nro-causa"].value.trim();
    const judicaturaActuante = form["judicatura-actuante"].value.trim();
    const nroJudicatura = form["nro-judicatura"].value.trim();

    // Validación mínima
    if (!apellido || !nombre || !nroCausa || !judicaturaActuante) {
        alert("Por favor, completa los datos mínimos requeridos para generar la plantilla.");
        return;
    }

    // Generar dirección de correo en base al nombre de la judicatura (simulado)
    emailAddressTextarea.value = `correo@${judicaturaActuante.toLowerCase().replace(/\s+/g, "")}.com`;

    // Generar asunto del correo
    emailSubjectTextarea.value = `Solicitud de derivación al SPF - Causa Nro. ${nroCausa}`;

    // Generar cuerpo del correo
    emailBodyTextarea.value = `Buenos días, por medio de la presente solicito el OFICIO/MAIL DE DERIVACIÓN AL S.P.F. del Detenido ${apellido} ${nombre}${alias ? ", alias " + alias : ""}, ${tipoDocumento} ${nroDocumento}, CAUSA NRO. ${nroCausa}.

Por favor se solicita que el OFICIO esté:

- DIRIGIDO AL DIRECTOR DEL S.P.F.
- Determine DELITO COMPLETO (sin puntos suspensivos)
- NRO DE CAUSA

De lo contrario; el S.P.F. no aceptará el Oficio al momento de llevar a cabo la manda judicial.

Sin otro particular, saludos cordiales.`;
});

// Limpiar datos del formulario
clearDataButton.addEventListener("click", () => {
    form.reset();
    emailSubjectTextarea.value = "";
    emailBodyTextarea.value = "";
    emailAddressTextarea.value = "";
    excelDataTextarea.value = "";
});

// Copiar asunto al portapapeles
copySubjectButton.addEventListener("click", () => {
    navigator.clipboard.writeText(emailSubjectTextarea.value).then(() => {
        
    }).catch(() => {
        alert("No se pudo copiar el asunto al portapapeles.");
    });
});

// Copiar cuerpo del correo al portapapeles
copyBodyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(emailBodyTextarea.value).then(() => {
        
    }).catch(() => {
        alert("No se pudo copiar el cuerpo al portapapeles.");
    });
});

