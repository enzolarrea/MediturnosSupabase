import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
    "https://vgakromiuoclwmniopmz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYWtyb21pdW9jbHdtbmlvcG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDQyNzQsImV4cCI6MjA3OTIyMDI3NH0.0E0lh51WtD1AQ5p8d1Ke3PTusWshf_KWe3lPrIhMx8g"
);

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Obtener datos del formulario
    const nombre = document.getElementById("regNombre").value.trim();
    const apellido = document.getElementById("regApellido").value.trim();
    const dni = document.getElementById("regDNI").value.trim();
    const fechaNac = document.getElementById("regFecha").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirmPassword").value;

    // 2. Validación de contraseña
    if (password !== confirm) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // 3. Convertir fecha dd/mm/yyyy → yyyy-mm-dd
    const [dia, mes, año] = fechaNac.split("/");
    const fechaISO = `${año}-${mes}-${dia}`;

    // 4. Crear usuario en Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        alert("Error al crear la cuenta: " + error.message);
        return;
    }

    const user = data.user;

    // 5. Crear perfil en tabla profiles
    const { error: profileError } = await supabase
        .from("profiles")
        .insert({
            id: user.id,
            nombre: nombre + " " + apellido,
            dni,
            birth_date: fechaISO,
            rol: "paciente"
        });

    if (profileError) {
        alert("Error al guardar perfil: " + profileError.message);
        return;
    }

    alert("Cuenta creada con éxito. Revisa tu correo para verificar la cuenta.");
    closeRegisterModal();
});
