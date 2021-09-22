//refiere a los inputs del formulario, usados en el template

export const formInputs = {
    user: [
        {
            type: "text",
            label: "Nombre de Usuario",
            pointer: "username"
        },
        {
            type: "text",
            label: "Contraseña",
            pointer: "password"
        },
        {
            type: "select",
            label: "Tipo de Usuario",
            options: [
                {label:"Coordinador",value:"Coordinador"},
                {label:"Docente",value:"Docente"},
                {label:"Estudiante",value:"Estudiante"}
            ],
            pointer: "type"
        }
    ],
    person: [
        {
            type: "text",
            label: "Número de identificación",
            pointer: "id_person"
        },
        {
            type: "select",
            label: "Tipo de identificación",
            options: [
                {label: "C.C.",value: "C.C."},
                {label: "C.E.",value: "C.E."},
                {label: "T.I",value: "T.I"},
                {label: "R.C.",value: "R.C."},
                {label: "PEP",value: "PEP"},
                {label: "NET",value: "NET"}
            ],
            pointer: "id_type"
        },
        {
            type: "text",
            label: "Nombres",
            pointer: "names"
        },
        {
            type: "text",
            label: "Apellidos",
            pointer: "lastnames"
        },
        {
            type: "select",
            label: "Departamento de Expedición",
            options: [],
            pointer: "zone_expedition"
        },
        {
            type: "select",
            label: "Ciudad Expedición",
            options: [],
            pointer: "city_expedition"
        },
        {
            type: "select",
            label: "RH",
            options: [
                {label: "A+", value: "A+"},
                {label: "A-", value: "A-"},
                {label: "B+", value: "B+"},
                {label: "B-", value: "B-"},
                {label: "O+", value: "O+"},
                {label: "O-", value: "O-"},
                {label: "AB+", value: "AB+"},
                {label: "AB-", value: "AB-"}
            ],
            pointer: "rh"
        },
        {
            type: "text",
            label: "Salud",
            pointer: "health"
        },
        {
            type: "select",
            label: "Escalafón",
            options: [
                {label: "1A", value: "1A"},
                {label: "1B", value: "1B"},
                {label: "1C", value: "1C"},
                {label: "1D", value: "1D"},
                {label: "2A", value: "2A"},
                {label: "2B", value: "2B"},
                {label: "2C", value: "2C"},
                {label: "3A", value: "3A"},
                {label: "3B", value: "3B"},
                {label: "3C", value: "3C"},
                {label: "3D", value: "3D"},
                {label: "SN", value: "SN"}
            ],
            pointer: "level"
        },
        {
            type: "select",
            label: "Nivel de estudio",
            options: [
                {label: "Normalista superior", value: "Normalista superior"},
                {label: "Tecnólogo superior", value: "Tecnólogo superior"},
                {label: "Tecnólogo en educación", value: "Tecnólogo en educación"},
                {label: "Licenciado", value: "Licenciado"},
                {label: "Profesional no licenciado", value: "Profesional no licenciado"},
                {label: "Especialización", value: "Especialización"},
                {label: "Maestría", value: "Maestría"},
                {label: "Doctorado", value: "Doctorado"}
            ],
            pointer: "study"
        },
        {
            type: "select",
            label: "Departamento de residencia",
            options: [],
            pointer: "zone_lives"
        },
        {
            type: "select",
            label: "Ciudad de residencia",
            options: [],
            pointer: "city_lives"
        },
        {
            type: "text",
            label: "Dirección",
            pointer: "address",
        },
        {
            type: "text",
            label: "Teléfono",
            pointer: "phone"
        },
        {
            type: "text",
            label: "Correo electrónico",
            pointer: "email"
        },
        {
            type: "select",
            label: "Sede",
            options: [
                {label: "Cortijo", value: "Cortijo"},
                {label: "Corzo", value: "Corzo"},
                {label: "María Teresa Ortíz", value: "María Teresa Ortíz"},
                {label: "María Teresa Ortíz Nueva", value: "María Teresa Ortíz Nueva"},
                {label: "Principal", value: "María Teresa Ortíz"},
                {label: "San José", value: "San José"},
                {label: "Serrezuela", value: "Serrezuela"}
            ],
            pointer: "site"
        },
        {
            type: "select",
            label: "Jornada",
            options: [
                {label: "Mañana", value: "Mañana"},
                {label: "Tarde", value: "Tarde"}
            ],
            pointer: "scheme"
        },{
            type: "select",
            label: "Tipo de persona",
            options: [
                {label: "Estudiante", value: "Estudiante"},
                {label: "Docente", value: "Docente"},
                {label: "Coordinador", value: "Coordinador"}
            ],
            pointer: "type"
        }
    ]
}