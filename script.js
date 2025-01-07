// Elementos del DOM
const excelDataTextarea = document.getElementById("excel-data");
const extractDataButton = document.getElementById("extract-data");
const form = document.getElementById("data-form");
const generateTemplateButton = document.getElementById("generate-template");
const emailSubjectTextarea = document.getElementById("email-subject");
const emailBodyTextarea = document.getElementById("email-body");
const copySubjectButton = document.getElementById("copy-subject");
const copyBodyButton = document.getElementById("copy-body");

// Función para extraer datos de la fila pegada
extractDataButton.addEventListener("click", () => {
    const rawData = excelDataTextarea.value.trim();
    if (!rawData) {
        alert("Por favor, pega datos desde Excel.");
        return;
    }

    const columns = rawData.split("\t");

    // Asignar valores extraídos al formulario
    form["apellido"].value = columns[1] || "";
    form["nombre"].value = columns[2] || "";
    form["alias"].value = columns[3] || "";
    form["tipo-documento"].value = columns[5] || "DNI";
    form["nro-documento"].value = columns[6] || "";
    form["nro-causa"].value = columns[18] || "";
    form["judicatura-actuante"].value = columns[19] || "";
    form["nro-judicatura"].value = columns[20] || "";

   
});

// Función para generar la plantilla
generateTemplateButton.addEventListener("click", () => {
    const apellido = form["apellido"].value.trim();
    const nombre = form["nombre"].value.trim();
    const alias = form["alias"].value.trim();
    const tipoDocumento = form["tipo-documento"].value.trim();
    const nroDocumento = form["nro-documento"].value.trim();
    const nroCausa = form["nro-causa"].value.trim();
    const judicaturaActuante = form["judicatura-actuante"].value.trim();
    const nroJudicatura = form["nro-judicatura"].value.trim();

    // Generar asunto
    const subject = `Solicitud de derivación al SPF - Causa Nro. ${nroCausa}`;

    // Generar cuerpo
    const body = `Buenos días, por medio de la presente solicito el OFICIO/MAIL DE DERIVACIÓN AL S.P.F. del Detenido ${apellido} ${nombre}${alias ? ", alias " + alias : ""}, ${tipoDocumento} ${nroDocumento}, CAUSA NRO. ${nroCausa}.

Por favor se solicita que el OFICIO esté:

- DIRIGIDO AL DIRECTOR DEL S.P.F.
- Determine DELITO COMPLETO (sin puntos suspensivos)
- NRO DE CAUSA

De lo contrario; el S.P.F. no aceptará el Oficio al momento de llevar a cabo la manda judicial.

Sin otro particular, saludos cordiales.

División Enlace con el Poder Judicial y Servicios Penitenciarios
Oficina de Judiciales
Beazley Nro. 3860 - CABA`;

    // Asignar valores a los textareas
    emailSubjectTextarea.value = subject;
    emailBodyTextarea.value = body;

    
});

// Función para copiar texto al portapapeles
function copyToClipboard(textarea, message) {
    textarea.select();
    document.execCommand("copy");
    
}

copySubjectButton.addEventListener("click", () => {
    copyToClipboard(emailSubjectTextarea, "Asunto copiado al portapapeles.");
});

copyBodyButton.addEventListener("click", () => {
    copyToClipboard(emailBodyTextarea, "Cuerpo del correo copiado al portapapeles.");
});
