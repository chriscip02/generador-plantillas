// elementos del dom
const excelDataTextarea = document.getElementById("excel-data");
const extractDataButton = document.getElementById("extract-data");
const form = document.getElementById("data-form");
const generateTemplateButton = document.getElementById("generate-template");
const clearDataButton = document.getElementById("clear-data");
const emailSubjectTextarea = document.getElementById("email-subject");
const emailBodyTextarea = document.getElementById("email-body");
const emailAddressTextarea = document.getElementById("email-address");
const copyAddressButton = document.getElementById("copy-address");
const copySubjectButton = document.getElementById("copy-subject");
const copyBodyButton = document.getElementById("copy-body");

// Extraer datos de la fila pegada
extractDataButton.addEventListener("click", () => {
    const rawData = excelDataTextarea.value.trim();
    if (!rawData) {
        alert("Por favor, pega datos desde Excel.");
        return;
    }

    const columns = rawData.split("\t");

    form["apellido"].value = columns[1] || "";
    form["nombre"].value = columns[2] || "";
    form["alias"].value = columns[3] || "";
    form["tipo-documento"].value = columns[5] || "DNI";
    form["nro-documento"].value = columns[6] || "";
    form["nro-causa"].value = columns[18] || "";
    // Combinar judicatura-actuante y nro-judicatura
    const judicaturaActuante = columns[19] || "";
    const nroJudicatura = columns[20] || "";
    form["judicatura"].value = `${judicaturaActuante} ${nroJudicatura}`.trim();
});

// Generar plantilla
generateTemplateButton.addEventListener("click", async () => {
    const apellido = form["apellido"].value.trim();
    const nombre = form["nombre"].value.trim();
    const alias = form["alias"].value.trim();
    const tipoDocumento = form["tipo-documento"].value.trim();
    const nroDocumento = form["nro-documento"].value.trim();
    const nroCausa = form["nro-causa"].value.trim();
    const judicatura = form["judicatura"].value.trim();

    // Buscar el correo correspondiente en el archivo JSON
    let emailAddress = "";
    try {
        const response = await fetch("judicaturas.json");
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON.");

        const judicaturas = await response.json();
        emailAddress = judicaturas[judicatura] || "Correo no encontrado para la judicatura especificada.";
    } catch (error) {
        console.error("Error al buscar el correo:", error);
        emailAddress = "Error al buscar el correo.";
    }

    emailAddressTextarea.value = emailAddress;

    emailSubjectTextarea.value = `Solicitud de derivación al SPF - Causa Nro. ${nroCausa}`;
    emailBodyTextarea.value = `Buenos días, por medio de la presente solicito el OFICIO/MAIL DE DERIVACIÓN AL S.P.F. del Detenido ${apellido} ${nombre}${alias ? ", alias " + alias : ""}, ${tipoDocumento} ${nroDocumento}, CAUSA NRO. ${nroCausa}.

Por favor se solicita que el OFICIO esté:

- DIRIGIDO AL DIRECTOR DEL S.P.F.
- Determine DELITO COMPLETO (sin puntos suspensivos)
- NRO DE CAUSA

De lo contrario; el S.P.F. no aceptará el Oficio al momento de llevar a cabo la manda judicial.

Sin otro particular, saludos cordiales.`;
});

// Limpiar datos
clearDataButton.addEventListener("click", () => {
    form.reset();
    excelDataTextarea.value = "";
    emailSubjectTextarea.value = "";
    emailBodyTextarea.value = "";
    emailAddressTextarea.value = "";
});

// Copiar correo
copyAddressButton.addEventListener("click", () => {
    emailAddressTextarea.select();
    document.execCommand("copy");

});

// Copiar asunto
copySubjectButton.addEventListener("click", () => {
    emailSubjectTextarea.select();
    document.execCommand("copy");

});

// Copiar cuerpo del correo
copyBodyButton.addEventListener("click", () => {
    emailBodyTextarea.select();
    document.execCommand("copy");

});





