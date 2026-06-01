import type { NPCEncounter, LocationType } from '../types/game';

export const NPC_ENCOUNTERS: NPCEncounter[] = [
  // ══════════════════════════════════════════════════
  // ENCUENTROS GENÉRICOS (sin NPC persistente)
  // ══════════════════════════════════════════════════

  {
    id: 'elder_asking_water',
    title: 'Un Anciano Sediento',
    description: 'Un anciano se acerca con dificultad. "Por favor, tengo días sin beber agua. ¿Podrías compartir un poco?"',
    icon: '👴',
    factionId: 'survivors',
    locationTypes: ['supermarket', 'pharmacy', 'bakery', 'restaurant', 'convenience_store'],
    journalEntry: 'Ayudé a un anciano sediento.',
    choices: [
      {
        label: 'Compartir agua',
        description: 'Le das 2 de agua. Te lo agradece con una sonrisa.',
        effect: { water: -2 },
        karmaChange: 2,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Darle algo de comida',
        description: 'Le ofreces comida en lugar de agua. "Dios te bendiga, joven."',
        effect: { food: -2 },
        karmaChange: 1,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Ignorarlo',
        description: 'No puedes arriesgar tus recursos. Sigues caminando.',
        effect: {},
        karmaChange: -1,
      },
    ],
  },
  {
    id: 'looters_confrontation',
    title: 'Saqueadores en la Zona',
    description: 'Un grupo de saqueadores te rodea. "Suelta tus cosas y te dejaremos ir."',
    icon: '🔫',
    factionId: 'outlaws',
    npcId: 'bandit_raúl',
    locationTypes: ['hardware', 'construction_site', 'gas_station', 'clothing_store'],
    journalEntry: 'Me enfrenté a saqueadores.',
    choices: [
      {
        label: 'Negociar',
        description: 'Les ofreces materiales a cambio de pasar. Aceptan de mala gana.',
        effect: { materials: -3 },
        karmaChange: 0,
        factionChanges: { outlaws: 1 },
        relationshipChange: 5,
      },
      {
        label: 'Plantar cara',
        description: 'Te plantas firme. Tras un tenso momento, se retiran.',
        effect: {},
        karmaChange: 1,
        relationshipChange: 3,
      },
      {
        label: 'Huir',
        description: 'Sales corriendo. Tropiezas y pierdes algo de combustible.',
        effect: { fuel: -2 },
        karmaChange: -1,
      },
    ],
  },
  {
    id: 'lost_child',
    title: 'Niña Perdida',
    description: 'Una niña pequeña está sola entre los escombros, llorando. "¡Mamá! ¿Dónde estás, mamá?"',
    icon: '👧',
    factionId: 'survivors',
    locationTypes: ['park', 'supermarket', 'bakery', 'restaurant', 'convenience_store'],
    journalEntry: 'Encontré una niña perdida entre los escombros.',
    choices: [
      {
        label: 'Ayudarla a buscar',
        description: 'Pasas tiempo buscando a su madre. La reencuentras y te dan medicina como agradecimiento.',
        effect: { medicine: 2 },
        karmaChange: 3,
        factionChanges: { survivors: 2 },
      },
      {
        label: 'Darle comida y seguir',
        description: 'Le das algo de comer y sigues tu camino. Al menos no pasará hambre.',
        effect: { food: -1 },
        karmaChange: 1,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Ignorarla',
        description: 'No puedes cargar con más responsabilidades. Te duele, pero sigues.',
        effect: {},
        karmaChange: -2,
      },
    ],
  },
  {
    id: 'injured_hiker',
    title: 'Excursionista Herido',
    description: 'Un excursionista yace en el suelo con una pierna herida. "Por favor, ¿tienes vendas? Me rompí la pierna."',
    icon: '🚶',
    locationTypes: ['park', 'mechanical_workshop', 'restaurant'],
    journalEntry: 'Auxilié a un excursionista herido.',
    choices: [
      {
        label: 'Curarlo con medicina',
        description: 'Usas tu botiquín para vendarle la pierna. Te da un mapa con ubicaciones secretas.',
        effect: { medicine: -2 },
        karmaChange: 2,
        unlockRumorId: 'rumor_hidden_pharmacy',
      },
      {
        label: 'Hacerle una venda improvisada',
        description: 'Usas materiales para hacer una venda. No es perfecta, pero le ayuda.',
        effect: { materials: -1 },
        karmaChange: 1,
      },
      {
        label: 'No involucrarte',
        description: 'Pides disculpas y sigues. No llevas suficientes recursos para ayudar.',
        effect: {},
        karmaChange: -1,
      },
    ],
  },
  {
    id: 'trader_offer',
    title: 'Comerciante Ambulante',
    description: 'Un comerciante con un carro lleno de suministros te hace una oferta: "Tengo comida y medicina. ¿Te interesa intercambiar?"',
    icon: '🧳',
    factionId: 'merchants',
    npcId: 'merchant_rodrigo',
    locationTypes: ['supermarket', 'convenience_store', 'gas_station', 'restaurant', 'bakery'],
    journalEntry: 'Comercié con Rodrigo, el mercader.',
    choices: [
      {
        label: 'Cambiar materiales por comida',
        description: 'Intercambias 3 materiales por 5 de comida. Negocio justo.',
        effect: { materials: -3, food: 5 },
        karmaChange: 0,
        factionChanges: { merchants: 1 },
        relationshipChange: 10,
      },
      {
        label: 'Cambiar combustible por medicina',
        description: 'Cambias 2 combustible por 3 de medicina. Ambos contentos.',
        effect: { fuel: -2, medicine: 3 },
        karmaChange: 0,
        factionChanges: { merchants: 1 },
        relationshipChange: 10,
      },
      {
        label: 'Rechazar la oferta',
        description: 'Declinas cortésmente. "Otra vez será."',
        effect: {},
        karmaChange: 0,
        relationshipChange: 2,
      },
    ],
  },
  {
    id: 'family_in_need',
    title: 'Familia Atrapada',
    description: 'Una familia está atrapada bajo una viga en un edificio derrumbado. "¡Ayuda! ¡No podemos salir!"',
    icon: '👨‍👩‍👧‍👦',
    factionId: 'survivors',
    locationTypes: ['construction_site', 'hardware', 'clothing_store'],
    journalEntry: 'Rescaté a una familia atrapada en un edificio derrumbado.',
    choices: [
      {
        label: 'Rescatarlos',
        description: 'Usas materiales para apalancar la viga. Te lo agradecen con combustible.',
        effect: { materials: -3, fuel: 3 },
        karmaChange: 3,
        factionChanges: { survivors: 2 },
      },
      {
        label: 'Buscar ayuda',
        description: 'Vas a buscar a alguien que pueda ayudar. Cuando vuelves, ya salieron solos.',
        effect: {},
        karmaChange: 1,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Seguir de largo',
        description: 'El edificio es inestable. No puedes arriesgarte.',
        effect: {},
        karmaChange: -2,
      },
    ],
  },
  {
    id: 'radio_signal',
    title: 'Señal de Radio',
    description: 'Encuentras una radio antigua que aún funciona. "...si alguien escucha... necesitamos ayuda en el hospital..."',
    icon: '📻',
    factionId: 'survivors',
    locationTypes: ['hospital', 'pharmacy', 'bunker'],
    journalEntry: 'Respondí a una señal de radio pidiendo ayuda.',
    choices: [
      {
        label: 'Responder e ir',
        description: 'Te diriges al hospital. Te reciben con los brazos abiertos y comparten suministros.',
        effect: { medicine: 3, food: 2 },
        karmaChange: 2,
        factionChanges: { survivors: 2 },
      },
      {
        label: 'Anotar la ubicación',
        description: 'Guardas la frecuencia por si acaso. Nunca se sabe.',
        effect: {},
        karmaChange: 0,
      },
      {
        label: 'Ignorar la señal',
        description: 'No puedes permitirte distracciones.',
        effect: {},
        karmaChange: -1,
      },
    ],
  },
  {
    id: 'dog_encounter',
    title: 'Perro Callejero',
    description: 'Un perro flaco y asustado te mira desde lejos. Mueve la cola tímidamente.',
    icon: '🐕',
    locationTypes: ['park', 'urban_garden', 'supermarket', 'restaurant', 'convenience_store'],
    journalEntry: 'Me encontré con un perro callejero.',
    choices: [
      {
        label: 'Darle comida',
        description: 'Le das algo de comer. El perro te sigue y te alerta de un peligro más tarde.',
        effect: { food: -2 },
        karmaChange: 2,
        companionJoinId: 'dog_buddy',
      },
      {
        label: 'Acariciarlo y seguir',
        description: 'Lo acaricias un momento. Parece que le alegra el día.',
        effect: {},
        karmaChange: 1,
      },
      {
        label: 'Espantarlo',
        description: 'No puedes tener un perro siguiéndote. Lo espantas.',
        effect: {},
        karmaChange: -1,
      },
    ],
  },
  {
    id: 'medic_volunteer',
    title: 'Puesto de Socorro',
    description: 'Un médico voluntario ha montado un puesto de socorro improvisado. "¿Tienes suministros médicos? Nos vendrían bien."',
    icon: '🏥',
    factionId: 'survivors',
    locationTypes: ['pharmacy', 'hospital', 'shelter', 'restaurant'],
    choices: [
      {
        label: 'Donar medicina',
        description: 'Les das 3 de medicina. El médico te da un botiquín de primeros auxilios mejorado.',
        effect: { medicine: -3 },
        karmaChange: 2,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Pedir cura para ti',
        description: 'Le pides que te revise. Te cura una herida leve que tenías.',
        effect: { medicine: 2 },
        karmaChange: 0,
      },
      {
        label: 'Seguir de largo',
        description: 'El puesto está muy concurrido. No quieres hacer cola.',
        effect: {},
        karmaChange: 0,
      },
    ],
  },
  {
    id: 'survivor_camp',
    title: 'Campamento de Supervivientes',
    description: 'Un grupo de supervivientes te invita a su campamento. "Podemos compartir recursos si tú también pones de tu parte."',
    icon: '🏕️',
    factionId: 'survivors',
    journalEntry: 'Visité un campamento de supervivientes.',
    choices: [
      {
        label: 'Unirte al grupo',
        description: 'Compartes lo que tienes y ellos hacen lo mismo. Todos ganan.',
        effect: { food: -2, water: -2, materials: 3, fuel: 2 },
        karmaChange: 1,
        factionChanges: { survivors: 2 },
      },
      {
        label: 'Comerciar e irte',
        description: 'Intercambias recursos rápidamente y sigues solo.',
        effect: { food: -1, materials: 2 },
        karmaChange: 0,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Rechazar y marcharte',
        description: 'No confías en extraños. Continúas solo.',
        effect: {},
        karmaChange: -1,
      },
    ],
  },
  {
    id: 'mysterious_stranger',
    title: 'Desconocido Misterioso',
    description: 'Una figura encapuchada te aborda. "Tengo información sobre lo que viene. Pero todo tiene un precio..."',
    icon: '🗿',
    locationTypes: ['gas_station', 'mechanical_workshop', 'military_base', 'restaurant', 'convenience_store'],
    journalEntry: 'Un desconocido misterioso me ofreció información.',
    choices: [
      {
        label: 'Pagar por la información',
        description: 'Le das combustible. "El próximo desastre será peor de lo que crees. Prepárate." Te da un 10% más de defensa.',
        effect: { fuel: -3 },
        karmaChange: 0,
        unlockRumorId: 'rumor_hidden_bunker',
      },
      {
        label: 'Intentar intimidarlo',
        description: 'Te plantas firme. "No tengo nada que darte." Se encoge de hombros y se va.',
        effect: {},
        karmaChange: 0,
      },
      {
        label: 'Ignorarlo',
        description: 'Le esquivas y sigues tu camino.',
        effect: {},
        karmaChange: 0,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // NPCs PERSISTENTES — ENCUENTROS INICIALES
  // ══════════════════════════════════════════════════

  {
    id: 'guardian_teacher',
    title: 'Profesor Armado',
    description: 'Un profesor con una escopeta vigila la entrada del colegio. "Mis alumnos están dentro. No dejaremos que nadie entre a saquear."',
    icon: '👨‍🏫',
    factionId: 'survivors',
    npcId: 'teacher_marcos',
    locationTypes: ['educational'],
    journalEntry: 'Conocí a Marcos, el profesor que protege el colegio.',
    choices: [
      {
        label: 'Ofrecer ayuda',
        description: 'Le dices que solo buscas suministros. Te guía a la despensa del comedor y te da comida.',
        effect: { food: 3 },
        karmaChange: 2,
        factionChanges: { survivors: 1 },
        relationshipChange: 15,
        nextEncounterBranch: 'teacher_friend',
      },
      {
        label: 'Negociar un intercambio',
        description: 'Ofreces materiales para las reparaciones del colegio a cambio de medicina del botiquín escolar.',
        effect: { materials: -2, medicine: 3 },
        karmaChange: 1,
        factionChanges: { survivors: 1 },
        relationshipChange: 10,
      },
      {
        label: 'Irte respetuosamente',
        description: 'Levantas las manos y te retiras. No vas a enfrentarte a un hombre armado.',
        effect: {},
        karmaChange: 0,
        relationshipChange: 3,
      },
    ],
  },
  {
    id: 'nurse_clinic',
    title: 'Enfermera Solitaria',
    description: 'Una enfermera ha montado un pequeño consultorio en la clínica. "Atiendo a quien lo necesita, pero me faltan suministros."',
    icon: '👩‍⚕️',
    factionId: 'survivors',
    npcId: 'nurse_elena',
    locationTypes: ['clinic'],
    journalEntry: 'Conocí a Elena, la enfermera de la clínica.',
    choices: [
      {
        label: 'Donar medicina',
        description: 'Le das 2 de medicina para ayudarla con sus pacientes. Te bendice y te da un vendaje especial.',
        effect: { medicine: -2 },
        karmaChange: 2,
        factionChanges: { survivors: 2 },
        relationshipChange: 15,
        nextEncounterBranch: 'nurse_friend',
      },
      {
        label: 'Pedir una revisión',
        description: 'Te revisa y te cura unas heridas menores. "Cuídate, ahí fuera es peligroso."',
        effect: { medicine: 2 },
        karmaChange: 0,
        relationshipChange: 8,
      },
      {
        label: 'Seguir de largo',
        description: 'La clínica parece tranquila. No quieres molestarla.',
        effect: {},
        karmaChange: 0,
        relationshipChange: 2,
      },
    ],
  },
  {
    id: 'librarian_guardian',
    title: 'Bibliotecaria Resuelta',
    description: 'La bibliotecaria ha convertido la biblioteca en un refugio. "Los libros son conocimiento, y el conocimiento es poder."',
    icon: '👩‍🏫',
    factionId: 'survivors',
    npcId: 'librarian_carmen',
    locationTypes: ['library'],
    journalEntry: 'Conocí a Carmen, la bibliotecaria.',
    choices: [
      {
        label: 'Pedir consejo',
        description: 'Te recomienda libros de botánica medicinal. Aprendes a identificar plantas curativas.',
        effect: { medicine: 2 },
        karmaChange: 1,
        relationshipChange: 15,
        nextEncounterBranch: 'librarian_friend',
      },
      {
        label: 'Ayudar a organizar',
        description: 'Pasas una hora organizando estanterías. Te da un mapa antiguo de la ciudad.',
        effect: { materials: 2 },
        karmaChange: 2,
        relationshipChange: 10,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Tomar libros sin permiso',
        description: 'Coges algunos libros para usar como material. Ella te mira con decepción.',
        effect: { materials: 2 },
        karmaChange: -1,
        relationshipChange: -10,
      },
    ],
  },
  {
    id: 'bartender_storyteller',
    title: 'Camarero Psicólogo',
    description: 'El camarero del bar sigue sirviendo lo que queda. "La gente necesita un lugar donde olvidar, aunque sea por unas horas."',
    icon: '🍸',
    factionId: 'merchants',
    npcId: 'bartender_lucia',
    locationTypes: ['bar'],
    journalEntry: 'Conocí a Lucía, la camarera del bar.',
    choices: [
      {
        label: 'Compartir historias',
        description: 'Te sientas en la barra y charlas. "Tu ronda corre por mi cuenta." Te da agua y comida.',
        effect: { water: 2, food: 2 },
        karmaChange: 1,
        relationshipChange: 15,
        nextEncounterBranch: 'bartender_friend',
      },
      {
        label: 'Intercambiar información',
        description: 'Le cuentas lo que sabes de la zona. Él te cuenta qué lugares han sido saqueados ya.',
        effect: {},
        karmaChange: 0,
        relationshipChange: 8,
        factionChanges: { merchants: 1 },
      },
      {
        label: 'Tomar lo que hay y salir',
        description: 'Aprovechas que está distraído y coges botellas de la barra. No es tu mejor momento.',
        effect: { water: 3 },
        karmaChange: -2,
        relationshipChange: -15,
      },
    ],
  },
  {
    id: 'tech_expert',
    title: 'Ingeniera de Electrónica',
    description: 'Una ingeniera ha montado un taller en la tienda de electrónica. "Con estas piezas podríamos hacer maravillas."',
    icon: '👩‍🔧',
    factionId: 'military',
    npcId: 'engineer_rosa',
    locationTypes: ['electronics_store'],
    journalEntry: 'Conocí a Rosa, la ingeniera de electrónica.',
    choices: [
      {
        label: 'Ayudar a clasificar componentes',
        description: 'Pasas el día organizando resistencias, placas y cables. Te regala una batería portátil.',
        effect: { fuel: 2 },
        karmaChange: 2,
        relationshipChange: 15,
        factionChanges: { military: 1 },
        nextEncounterBranch: 'tech_friend',
      },
      {
        label: 'Cambiar comida por baterías',
        description: 'Intercambias comida por baterías y paneles solares portátiles.',
        effect: { food: -2, fuel: 3 },
        karmaChange: 0,
        relationshipChange: 8,
        factionChanges: { military: 1 },
      },
      {
        label: 'Coger lo que necesitas',
        description: 'Aprovechas que está distraída y coges algunos componentes. Te sientes culpable.',
        effect: { materials: 3 },
        karmaChange: -2,
        relationshipChange: -15,
      },
    ],
  },
  {
    id: 'monument_guard',
    title: 'Guardia del Monumento',
    description: 'Un guardia de seguridad sigue patrullando el monumento nacional. "Es mi deber protegerlo, caiga quien caiga."',
    icon: '💂',
    factionId: 'military',
    npcId: 'guard_miguel',
    locationTypes: ['landmark'],
    journalEntry: 'Conocí a Miguel, el guardia del monumento.',
    choices: [
      {
        label: 'Ofrecerte como vigilante',
        description: 'Te ofreces a ayudarle con las guardias. "Necesitamos más gente como tú." Te da raciones de su mochila.',
        effect: { food: 2, water: 2 },
        karmaChange: 2,
        relationshipChange: 15,
        factionChanges: { military: 2 },
        nextEncounterBranch: 'guard_friend',
      },
      {
        label: 'Pedir visitar el monumento',
        description: 'Te deja entrar. Encuentras una taquilla con objetos perdidos.',
        effect: { materials: 2 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Sortearlo y explorar',
        description: 'Te cuelas cuando no mira. Encuentras algo pero te sientes mal por burlar su confianza.',
        effect: { materials: 3 },
        karmaChange: -2,
        relationshipChange: -15,
      },
    ],
  },
  {
    id: 'community_volunteer',
    title: 'Voluntaria Incansable',
    description: 'Una mujer organiza una olla común en el centro comunitario. "Si cada uno aporta un poco, todos comemos."',
    icon: '👩‍🍳',
    factionId: 'survivors',
    npcId: 'volunteer_maria',
    locationTypes: ['community_centre'],
    journalEntry: 'Conocí a María, la voluntaria de la olla común.',
    choices: [
      {
        label: 'Contribuir con comida',
        description: 'Aportas 2 de comida a la olla común. Todos comparten y te dan medicina a cambio.',
        effect: { food: -2, medicine: 2 },
        karmaChange: 2,
        factionChanges: { survivors: 2 },
        relationshipChange: 15,
        nextEncounterBranch: 'volunteer_friend',
      },
      {
        label: 'Comer y agradecer',
        description: 'Te sirven un plato de sopa. "Vuelve cuando quieras, siempre hay un lugar para ti."',
        effect: { food: 2 },
        karmaChange: 1,
        relationshipChange: 8,
      },
      {
        label: 'Irte sin ayudar',
        description: 'Aceptas un poco de comida pero te vas sin ofrecer nada a cambio.',
        effect: { food: 1 },
        karmaChange: -1,
        relationshipChange: -5,
      },
    ],
  },
  {
    id: 'priest_shelter',
    title: 'Sacerdote Refugio',
    description: 'Un sacerdote ha abierto las puertas del templo a los desamparados. "Aquí todos son bienvenidos."',
    icon: '⛪',
    factionId: 'survivors',
    npcId: 'priest_antonio',
    locationTypes: ['place_of_worship'],
    journalEntry: 'Conocí al sacerdote Antonio en el templo.',
    choices: [
      {
        label: 'Donar recursos',
        description: 'Le das 2 de comida y 2 de agua para los refugiados. "Que Dios te bendiga, hijo." Te da un rosario y algo de medicina.',
        effect: { food: -2, water: -2, medicine: 3 },
        karmaChange: 3,
        factionChanges: { survivors: 2 },
        relationshipChange: 15,
        nextEncounterBranch: 'priest_friend',
      },
      {
        label: 'Pedir refugio por la noche',
        description: 'Te deja dormir en un banco. Al despertar, encuentras comida esperándote.',
        effect: { food: 2 },
        karmaChange: 0,
        relationshipChange: 8,
      },
      {
        label: 'Rechazar la oferta',
        description: 'Agradeces pero prefieres seguir solo. Él asiente con comprensión.',
        effect: {},
        karmaChange: 0,
        relationshipChange: 2,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // ENCUENTROS NO PERSISTENTES (ubicaciones nuevas)
  // ══════════════════════════════════════════════════

  {
    id: 'hotel_receptionist',
    title: 'Recepcionista Leal',
    description: 'La recepcionista del hotel se niega a irse. "Este hotel es mi hogar. Los huéspedes huyeron y dejaron sus pertenencias."',
    icon: '🧑‍💼',
    locationTypes: ['hotel'],
    journalEntry: 'La recepcionista del hotel me dejó explorar las habitaciones.',
    choices: [
      {
        label: 'Pedir explorar las habitaciones',
        description: 'Te deja revisar las habitaciones vacías. Encuentras snacks y agua de los minibares.',
        effect: { food: 3, water: 3 },
        karmaChange: 0,
      },
      {
        label: 'Ofrecerle compañía',
        description: 'Te quedas a charlar un rato. Te cuenta historias del hotel y te regala un neceser con útiles.',
        effect: { materials: 2 },
        karmaChange: 1,
      },
      {
        label: 'Registrar sin permiso',
        description: 'La ignoras y revistas las habitaciones por tu cuenta. Encuentras algo pero te sientes mal.',
        effect: { food: 2, water: 2 },
        karmaChange: -2,
      },
    ],
  },
  {
    id: 'bank_manager',
    title: 'Gerente del Banco',
    description: 'El gerente del banco está sellando las cajas de seguridad. "El dinero ya no vale, pero hay objetos de valor que podrían servir."',
    icon: '🧔',
    factionId: 'merchants',
    locationTypes: ['bank'],
    journalEntry: 'El gerente del banco me dio acceso a las cajas de seguridad.',
    choices: [
      {
        label: 'Ayudar a sellar las cajas',
        description: 'Le ayudas y, agradecido, te abre una caja abandonada. Contiene herramientas y lingotes.',
        effect: { materials: 4 },
        karmaChange: 1,
        factionChanges: { merchants: 1 },
      },
      {
        label: 'Proponer un trato',
        description: 'Le ofreces comida a cambio de objetos de las cajas no reclamadas. Acepta.',
        effect: { food: -2, materials: 3 },
        karmaChange: 0,
        factionChanges: { merchants: 2 },
      },
      {
        label: 'Aprovechar el caos',
        description: 'Mientras él está distraído, revisas algunas cajas por tu cuenta. Te sientes culpable.',
        effect: { materials: 3 },
        karmaChange: -2,
      },
    ],
  },
  {
    id: 'curator_museum',
    title: 'Conservador del Museo',
    description: 'Un hombre mayor protege las piezas del museo con pasión. "Estos artefactos son nuestra historia. No pueden perderse."',
    icon: '👨‍🎨',
    factionId: 'survivors',
    locationTypes: ['museum'],
    journalEntry: 'Ayudé al conservador del museo a proteger los artefactos.',
    choices: [
      {
        label: 'Ayudar a embalar piezas',
        description: 'Le ayudas a guardar las piezas más valiosas. Te regala una réplica de metal que puedes usar como material.',
        effect: { materials: 3 },
        karmaChange: 2,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Pedir algo a cambio de protección',
        description: 'Ofreces vigilar el museo por la noche a cambio de provisiones. Tiene algo de comida en la oficina.',
        effect: { food: 3 },
        karmaChange: 1,
      },
      {
        label: 'Decirle que huya',
        description: 'Le adviertes que no es seguro quedarse. "Tienes razón... pero es difícil dejar esto atrás."',
        effect: {},
        karmaChange: 0,
      },
    ],
  },
  {
    id: 'street_musician',
    title: 'Músico Callejero',
    description: 'Un músico toca el piano en el vestíbulo del teatro abandonado. "La música ahuyenta los malos pensamientos, ¿sabes?"',
    icon: '🎹',
    locationTypes: ['entertainment'],
    journalEntry: 'Escuché a un músico tocar el piano en el teatro abandonado.',
    choices: [
      {
        label: 'Escuchar y compartir',
        description: 'Te sientas a escuchar. Te alegra el ánimo y te da una moneda de oro que encontró.',
        effect: { materials: 2 },
        karmaChange: 1,
      },
      {
        label: 'Darle comida',
        description: 'Compartes algo de comida con él. Agradecido, te enseña un pasadizo con provisiones.',
        effect: { food: -2, water: 3 },
        karmaChange: 2,
      },
      {
        label: 'Pedirle que se calle',
        description: 'El ruido podría atraer problemas. "Tienes razón, lo siento." Deja de tocar.',
        effect: {},
        karmaChange: -1,
      },
    ],
  },
  {
    id: 'sports_coach',
    title: 'Entrenador del Polideportivo',
    description: 'Un entrenador deportivo organiza a un grupo de jóvenes en el polideportivo. "El deporte nos mantiene cuerdos en estos tiempos."',
    icon: '🏋️‍♂️',
    locationTypes: ['sports_centre'],
    journalEntry: 'Entrené con el equipo del polideportivo.',
    choices: [
      {
        label: 'Unirte al entrenamiento',
        description: 'Participas en la rutina. Ganas forma física y el entrenador comparte su cantimplora.',
        effect: { water: 3 },
        karmaChange: 1,
      },
      {
        label: 'Donar material deportivo',
        description: 'Le das cuerdas y materiales que pueden usar. "¡Eres un sol! Toma, tenemos bidones de agua."',
        effect: { materials: -2, water: 4 },
        karmaChange: 2,
      },
      {
        label: 'Observar y marcharte',
        description: 'Los ves desde lejos. Prefieres mantener tu distancia.',
        effect: {},
        karmaChange: 0,
      },
    ],
  },
  {
    id: 'postman_delivering',
    title: 'Cartero Obstinado',
    description: 'Un cartero sigue repartiendo correo. "La gente necesita esperanza, aunque sea una carta." Su bolsa está llena de paquetes.',
    icon: '📬',
    locationTypes: ['post_office'],
    journalEntry: 'Ayudé al cartero a repartir correo.',
    choices: [
      {
        label: 'Ayudar a repartir',
        description: 'Le ayudas a llevar algunos paquetes. Una familia agradecida te da comida.',
        effect: { food: 3 },
        karmaChange: 2,
      },
      {
        label: 'Pedir un paquete',
        description: '"Algunos paquetes ya nunca llegarán a su destino." Te da uno con suministros médicos.',
        effect: { medicine: 3 },
        karmaChange: 0,
      },
      {
        label: 'Revisar los paquetes',
        description: 'Rebuscas en su bolsa mientras él no mira. Encuentras algo útil pero te sientes mal.',
        effect: { food: 2, materials: 2 },
        karmaChange: -2,
      },
    ],
  },
  {
    id: 'water_guardian',
    title: 'Guardian del Agua',
    description: 'Un hombre protege el depósito de agua municipal. "El agua es vida. No dejo que nadie la contamine."',
    icon: '💧',
    factionId: 'survivors',
    locationTypes: ['water_facility'],
    journalEntry: 'Ayudé al guardián del depósito de agua.',
    choices: [
      {
        label: 'Ofrecer ayuda a cambio de agua',
        description: 'Le ayudas a limpiar los filtros. Te recompensa con varios bidones de agua limpia.',
        effect: { water: 5 },
        karmaChange: 2,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Pedir agua amablemente',
        description: 'Le explicas tu situación. "Todos tienen derecho al agua." Te da un par de litros.',
        effect: { water: 3 },
        karmaChange: 1,
      },
      {
        label: 'Intentar robar agua',
        description: 'Esperas a que se duerma y llenas tus botellas. Te persigue pero logras escapar.',
        effect: { water: 4 },
        karmaChange: -2,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // ENCUENTROS ESPECIALES — FILTRADOS POR KARMA
  // ══════════════════════════════════════════════════

  {
    id: 'allied_survivors',
    title: 'Red de Supervivientes',
    description: 'Un grupo de supervivientes te reconoce por tus buenas acciones. "¡Tú eres el que ha estado ayudando a todos! Ven, tenemos algo para ti."',
    icon: '🤝',
    factionId: 'survivors',
    karmaMin: 5,
    journalEntry: 'La Red de Supervivientes me reconoció por mis buenas acciones.',
    choices: [
      {
        label: 'Aceptar su ofrenda',
        description: 'Te dan provisiones como agradecimiento por ayudar a otros. "La comunidad se cuida entre sí."',
        effect: { food: 5, water: 3, medicine: 2 },
        karmaChange: 1,
        factionChanges: { survivors: 2 },
      },
      {
        label: 'Unirte a su red',
        description: 'Te ofrecen compartir información y recursos regularmente. "Siempre hay sitio para los que ayudan."',
        effect: { materials: 4, fuel: 2 },
        karmaChange: 1,
        factionChanges: { survivors: 3 },
      },
      {
        label: 'Declinar amablemente',
        description: 'Agradeces pero prefieres seguir solo. "Entendemos. Buena suerte ahí fuera."',
        effect: {},
        karmaChange: 0,
      },
    ],
  },
  {
    id: 'karma_guardian',
    title: 'El Benefactor',
    description: 'Un misterioso benefactor te ha estado observando. "He visto cómo ayudas a los demás desinteresadamente. Mereces algo especial."',
    icon: '🌟',
    karmaMin: 7,
    journalEntry: 'Un misterioso benefactor me recompensó por mi buen karma.',
    choices: [
      {
        label: 'Recibir su regalo',
        description: 'Te entrega un lote de suministros de alta calidad. "Úsalo bien."',
        effect: { food: 6, water: 4, medicine: 4, materials: 3 },
        karmaChange: 1,
      },
      {
        label: 'Pedir consejo',
        description: '"La clave no es solo sobrevivir, sino vivir con propósito." Te da información sobre refugios seguros.',
        effect: { medicine: 2, materials: 2 },
        karmaChange: 0,
      },
      {
        label: 'Preguntar quién es',
        description: 'Sonríe. "Solo alguien que se preocupa por los que se preocupan." Y desaparece.',
        effect: { food: 3 },
        karmaChange: 0,
      },
    ],
  },
  {
    id: 'bandit_trap',
    title: 'Emboscada de Bandidos',
    description: 'Un grupo de bandidos te reconoce. "Oye, este es el que siempre se mete en lo que no le importa. Vamos a darle una lección."',
    icon: '🗡️',
    factionId: 'outlaws',
    karmaMax: -3,
    locationTypes: ['hardware', 'construction_site', 'gas_station', 'clothing_store'],
    journalEntry: 'Sufrí una emboscada de bandidos.',
    choices: [
      {
        label: 'Intentar negociar',
        description: 'Ofreces recursos a cambio de que te dejen ir. "Vale, pero que no se repita."',
        effect: { materials: -4, food: -2 },
        karmaChange: 0,
        factionChanges: { outlaws: 1 },
      },
      {
        label: 'Enfrentarlos',
        description: 'Te plantas firme. Sorprendidos por tu valor, dudan y te dejan pasar.',
        effect: {},
        karmaChange: 1,
      },
      {
        label: 'Huida desesperada',
        description: 'Sales corriendo. Logras escapar pero pierdes algo en el proceso.',
        effect: { food: -2, water: -2 },
        karmaChange: -1,
      },
    ],
  },
  {
    id: 'shunned_outcast',
    title: 'Repudiado por la Comunidad',
    description: 'Un pequeño campamento te cierra las puertas. "A ti no. Hemos oído lo que has hecho. Vete."',
    icon: '🚫',
    factionId: 'survivors',
    karmaMax: -5,
    journalEntry: 'Fui rechazado por un campamento de supervivientes.',
    choices: [
      {
        label: 'Rogarles que te acepten',
        description: 'Insistes y te dejan quedarte en la periferia. Recoges las migajas que dejan.',
        effect: { food: 2 },
        karmaChange: 0,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Tomar lo que necesitas',
        description: 'Aprovechas la noche para saquear sus reservas. Te sientes peor aún.',
        effect: { food: 4, water: 3 },
        karmaChange: -2,
        factionChanges: { survivors: -2 },
      },
      {
        label: 'Irte con dignidad',
        description: 'Das media vuelta. "Quizá se merecen lo que opinan de ti."',
        effect: {},
        karmaChange: 1,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // ENCUENTROS RAMIFICADOS — VERSIONES "AMIGO"
  // ══════════════════════════════════════════════════

  {
    id: 'teacher_friend',
    title: 'Marcos, el Profesor (Amigo)',
    description: 'Marcos te recibe con una sonrisa. "¡Has vuelto! Los niños preguntan por ti."',
    icon: '👨‍🏫',
    factionId: 'survivors',
    npcId: 'teacher_marcos',
    isBranch: true,
    parentEncounterId: 'guardian_teacher',
    relationshipMin: 50,
    locationTypes: ['educational'],
    journalEntry: 'Visité a Marcos, mi amigo el profesor.',
    choices: [
      {
        label: 'Dar clase a los niños',
        description: 'Les enseñas habilidades de supervivencia. Marcos te da provisiones de la despensa.',
        effect: { food: 4, water: 2 },
        karmaChange: 2,
        factionChanges: { survivors: 2 },
        relationshipChange: 10,
        nextEncounterBranch: 'teacher_ally',
      },
      {
        label: 'Ayudar con reparaciones',
        description: 'Arreglas ventanas y puertas del colegio. Él te recompensa con materiales.',
        effect: { materials: -2 },
        karmaChange: 1,
        relationshipChange: 8,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Solo saludar',
        description: 'Pasas a saludar y sigues tu camino.',
        effect: { water: 1 },
        karmaChange: 0,
        relationshipChange: 3,
      },
    ],
  },
  {
    id: 'teacher_ally',
    title: 'Marcos, tu Aliado',
    description: 'Marcos te abraza como a un hermano. "Eres de la familia. ¿Necesitas algo? Lo que sea."',
    icon: '👨‍🏫',
    factionId: 'survivors',
    npcId: 'teacher_marcos',
    isBranch: true,
    parentEncounterId: 'teacher_friend',
    relationshipMin: 65,
    locationTypes: ['educational'],
    journalEntry: 'Marcos, mi aliado, compartió generosamente conmigo.',
    choices: [
      {
        label: 'Pedir suministros',
        description: 'Te da acceso completo a la despensa escolar y al botiquín.',
        effect: { food: 6, water: 3, medicine: 3 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Reclutarlo como Vigilante',
        description: '"Protegeré tu refugio con mi vida." Marcos se une como compañero.',
        effect: {},
        karmaChange: 2,
        relationshipChange: 5,
        companionJoinId: 'teacher_guard',
      },
      {
        label: 'Planificar juntos',
        description: 'Compartís estrategias de supervivencia. Ambos os beneficiáis.',
        effect: { materials: 3, fuel: 2 },
        karmaChange: 1,
        relationshipChange: 8,
      },
    ],
  },
  {
    id: 'nurse_friend',
    title: 'Elena, la Enfermera (Amiga)',
    description: 'Elena ilumina su rostro al verte. "¡Qué alegría! Justo estaba pensando en ti."',
    icon: '👩‍⚕️',
    factionId: 'survivors',
    npcId: 'nurse_elena',
    isBranch: true,
    parentEncounterId: 'nurse_clinic',
    relationshipMin: 50,
    locationTypes: ['clinic'],
    journalEntry: 'Visité a Elena, mi amiga enfermera.',
    choices: [
      {
        label: 'Ayudar con pacientes',
        description: 'La ayudas a atender heridos. Te recompensa con medicinas.',
        effect: { medicine: 3, food: 1 },
        karmaChange: 2,
        factionChanges: { survivors: 2 },
        relationshipChange: 10,
        nextEncounterBranch: 'nurse_ally',
      },
      {
        label: 'Recibir chequeo',
        description: 'Te hace una revisión completa. Te sientes renovado.',
        effect: { medicine: 2 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Compartir suministros',
        description: 'Intercambiáis información y recursos.',
        effect: { medicine: -1, food: 2 },
        karmaChange: 0,
        relationshipChange: 3,
      },
    ],
  },
  {
    id: 'nurse_ally',
    title: 'Elena, tu Aliada',
    description: 'Elena te recibe con los brazos abiertos. "Siempre tendrás un lugar aquí. Eres de los nuestros."',
    icon: '👩‍⚕️',
    factionId: 'survivors',
    npcId: 'nurse_elena',
    isBranch: true,
    parentEncounterId: 'nurse_friend',
    relationshipMin: 65,
    locationTypes: ['clinic'],
    journalEntry: 'Elena, mi aliada, me dio acceso a su farmacia.',
    choices: [
      {
        label: 'Acceder a la farmacia',
        description: 'Te da acceso a la reserva médica de la clínica.',
        effect: { medicine: 5, food: 2 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Reclutarla como Ayudante Médica',
        description: '"Me vendrá bien cambiar de aires." Elena se une a tu causa.',
        effect: {},
        karmaChange: 2,
        relationshipChange: 5,
        companionJoinId: 'nurse_helper',
      },
      {
        label: 'Curso intensivo de primeros auxilios',
        description: 'Te enseña técnicas médicas. Aprendes a optimizar medicinas.',
        effect: { medicine: 3, materials: 1 },
        karmaChange: 1,
        relationshipChange: 8,
      },
    ],
  },
  {
    id: 'bartender_friend',
    title: 'Lucía, la Camarera (Amiga)',
    description: 'Lucía te saluda desde la barra. "¡Mi cliente favorito! Pasa, tengo algo especial."',
    icon: '🍸',
    factionId: 'merchants',
    npcId: 'bartender_lucia',
    isBranch: true,
    parentEncounterId: 'bartender_storyteller',
    relationshipMin: 50,
    locationTypes: ['bar'],
    journalEntry: 'Visité a Lucía, mi amiga camarera.',
    choices: [
      {
        label: 'Probar lo especial',
        description: 'Te sirve una bebida que te da energía. Además te da provisiones.',
        effect: { water: 3, food: 3 },
        karmaChange: 1,
        relationshipChange: 10,
        factionChanges: { merchants: 1 },
        nextEncounterBranch: 'bartender_ally',
      },
      {
        label: 'Escuchar los chismes',
        description: 'Te cuenta qué lugares han sido saqueados y cuáles no.',
        effect: { materials: 1 },
        karmaChange: 0,
        relationshipChange: 5,
        unlockRumorId: 'rumor_trade_caravan',
      },
      {
        label: 'Solo un trago rápido',
        description: 'Un poco de agua y sigues.',
        effect: { water: 2 },
        karmaChange: 0,
        relationshipChange: 3,
      },
    ],
  },
  {
    id: 'bartender_ally',
    title: 'Lucía, tu Aliada',
    description: 'Lucía te hace un gesto cómplice. "Guardo las mejores botellas para ti. Y algo más..."',
    icon: '🍸',
    factionId: 'merchants',
    npcId: 'bartender_lucia',
    isBranch: true,
    parentEncounterId: 'bartender_friend',
    relationshipMin: 65,
    locationTypes: ['bar'],
    journalEntry: 'Lucía, mi aliada, compartió sus reservas secretas.',
    choices: [
      {
        label: 'Acceder a la bodega secreta',
        description: 'Te enseña un sótano con provisiones que escondió.',
        effect: { food: 5, water: 4 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Red de contactos',
        description: 'Te presenta a otros comerciantes. Ganas reputación con los mercaderes.',
        effect: { materials: 3, fuel: 2 },
        karmaChange: 1,
        factionChanges: { merchants: 3 },
        relationshipChange: 5,
      },
      {
        label: 'Pedirle que difunda rumores',
        description: 'Ella hace correr la voz de que eres de fiar. Mejora tu reputación.',
        effect: {},
        karmaChange: 0,
        factionChanges: { survivors: 1, merchants: 1, military: 1 },
        relationshipChange: 3,
      },
    ],
  },
  {
    id: 'tech_friend',
    title: 'Rosa, la Ingeniera (Amiga)',
    description: 'Rosa te muestra su último invento con orgullo. "Mira esto, ¡funciona con energía solar!"',
    icon: '👩‍🔧',
    factionId: 'military',
    npcId: 'engineer_rosa',
    isBranch: true,
    parentEncounterId: 'tech_expert',
    relationshipMin: 50,
    locationTypes: ['electronics_store'],
    journalEntry: 'Visité a Rosa, mi amiga ingeniera.',
    choices: [
      {
        label: 'Ayudar con el proyecto',
        description: 'Trabajáis juntos en un generador portátil. Te da materiales.',
        effect: { materials: 3, fuel: 1 },
        karmaChange: 1,
        relationshipChange: 10,
        factionChanges: { military: 2 },
        nextEncounterBranch: 'tech_ally',
      },
      {
        label: 'Intercambiar componentes',
        description: 'Cambias comida por baterías y cables.',
        effect: { food: -2, fuel: 3, materials: 1 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Pedir consejo técnico',
        description: 'Te explica cómo optimizar tu equipo.',
        effect: { materials: 2 },
        karmaChange: 0,
        relationshipChange: 3,
      },
    ],
  },
  {
    id: 'tech_ally',
    title: 'Rosa, tu Aliada',
    description: 'Rosa te abraza. "Eres el único que me toma en serio. Tengo algo grande para ti."',
    icon: '👩‍🔧',
    factionId: 'military',
    npcId: 'engineer_rosa',
    isBranch: true,
    parentEncounterId: 'tech_friend',
    relationshipMin: 65,
    locationTypes: ['electronics_store'],
    journalEntry: 'Rosa me dio acceso a su taller.',
    choices: [
      {
        label: 'Usar su taller',
        description: 'Te deja usar todas sus herramientas y materiales.',
        effect: { materials: 4, fuel: 3 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Reclutarla como socia',
        description: '"Siempre quise trabajar en equipo." Rosa se une.',
        effect: {},
        karmaChange: 1,
        relationshipChange: 3,
        companionJoinId: 'soldier_escort',
      },
      {
        label: 'Plan de energía',
        description: 'Diseñáis un plan para electrificar el refugio.',
        effect: { fuel: 4, materials: 2 },
        karmaChange: 1,
        relationshipChange: 5,
      },
    ],
  },
  {
    id: 'guard_friend',
    title: 'Miguel, el Guardia (Amigo)',
    description: 'Miguel te saluda marcialmente. "¡Compañero! La guardia es más llevadera contigo."',
    icon: '💂',
    factionId: 'military',
    npcId: 'guard_miguel',
    isBranch: true,
    parentEncounterId: 'monument_guard',
    relationshipMin: 50,
    locationTypes: ['landmark'],
    journalEntry: 'Visité a Miguel, mi amigo guardia.',
    choices: [
      {
        label: 'Hacer guardia juntos',
        description: 'Compartís turno de vigilancia. Él te da provisiones.',
        effect: { food: 3, water: 2 },
        karmaChange: 1,
        relationshipChange: 10,
        factionChanges: { military: 2 },
        nextEncounterBranch: 'guard_ally',
      },
      {
        label: 'Inspeccionar el perímetro',
        description: 'Revisáis la zona. Encuentras suministros caídos.',
        effect: { materials: 2, fuel: 1 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Compartir información militar',
        description: 'Te cuenta movimientos de tropas y zonas seguras.',
        effect: {},
        karmaChange: 0,
        relationshipChange: 5,
        unlockRumorId: 'rumor_military_cache',
      },
    ],
  },
  {
    id: 'guard_ally',
    title: 'Miguel, tu Aliado',
    description: 'Miguel te da una palmada en la espalda. "Eres de los nuestros. Toma, esto es para ti."',
    icon: '💂',
    factionId: 'military',
    npcId: 'guard_miguel',
    isBranch: true,
    parentEncounterId: 'guard_friend',
    relationshipMin: 65,
    locationTypes: ['landmark'],
    journalEntry: 'Miguel me confió suministros militares.',
    choices: [
      {
        label: 'Acceder al arsenal',
        description: 'Te da acceso al pequeño arsenal del monumento.',
        effect: { materials: 5, fuel: 3 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Reclutar al Teniente',
        description: '"El teniente Vega buscará voluntarios. Te recomendaré."',
        effect: {},
        karmaChange: 1,
        relationshipChange: 3,
        companionJoinId: 'soldier_escort',
      },
      {
        label: 'Plan de defensa conjunto',
        description: 'Coordináis defensas para el próximo desastre.',
        effect: { materials: 3 },
        karmaChange: 1,
        relationshipChange: 5,
      },
    ],
  },
  {
    id: 'volunteer_friend',
    title: 'María, la Voluntaria (Amiga)',
    description: 'María remueve la olla y te sonríe. "¡Has vuelto! La sopa está casi lista."',
    icon: '👩‍🍳',
    factionId: 'survivors',
    npcId: 'volunteer_maria',
    isBranch: true,
    parentEncounterId: 'community_volunteer',
    relationshipMin: 50,
    locationTypes: ['community_centre'],
    journalEntry: 'Compartí la olla común con María.',
    choices: [
      {
        label: 'Ayudar a cocinar',
        description: 'Preparáis comida para todos. La comunidad te lo agradece.',
        effect: { food: 4, water: 2 },
        karmaChange: 2,
        factionChanges: { survivors: 2 },
        relationshipChange: 10,
        nextEncounterBranch: 'volunteer_ally',
      },
      {
        label: 'Donar ingredientes',
        description: 'Aportas comida a la olla. Todos se benefician.',
        effect: { food: -3, medicine: 2 },
        karmaChange: 1,
        relationshipChange: 8,
      },
      {
        label: 'Comer y charlar',
        description: 'Compartes una comida y te cuenta novedades.',
        effect: { food: 3 },
        karmaChange: 0,
        relationshipChange: 5,
        unlockRumorId: 'rumor_garden_harvest',
      },
    ],
  },
  {
    id: 'volunteer_ally',
    title: 'María, tu Aliada',
    description: 'María te da un delantal. "Eres parte de esta cocina. Toma, esto sobró del reparto."',
    icon: '👩‍🍳',
    factionId: 'survivors',
    npcId: 'volunteer_maria',
    isBranch: true,
    parentEncounterId: 'volunteer_friend',
    relationshipMin: 65,
    locationTypes: ['community_centre'],
    journalEntry: 'María me guardó las mejores raciones.',
    choices: [
      {
        label: 'Raciones extra',
        description: 'Te guarda las mejores raciones del día.',
        effect: { food: 6, water: 3 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Organizar la despensa',
        description: 'Reorganizáis el centro comunitario. Encuentras suministros ocultos.',
        effect: { food: 3, medicine: 2, materials: 2 },
        karmaChange: 1,
        relationshipChange: 5,
      },
      {
        label: 'Pedirle que una a la gente',
        description: 'María convence a otros de ayudarte.',
        effect: {},
        karmaChange: 2,
        factionChanges: { survivors: 3, merchants: 1 },
        relationshipChange: 3,
      },
    ],
  },
  {
    id: 'priest_friend',
    title: 'Antonio, el Sacerdote (Amigo)',
    description: 'El sacerdote Antonio te bendice. "Hijo, qué alegría verte. Los refugiados preguntan por ti."',
    icon: '⛪',
    factionId: 'survivors',
    npcId: 'priest_antonio',
    isBranch: true,
    parentEncounterId: 'priest_shelter',
    relationshipMin: 50,
    locationTypes: ['place_of_worship'],
    journalEntry: 'Visité al sacerdote Antonio.',
    choices: [
      {
        label: 'Ayudar en el templo',
        description: 'Ayudas a organizar a los refugiados. La comunidad te recompensa.',
        effect: { food: 3, water: 3, medicine: 1 },
        karmaChange: 2,
        factionChanges: { survivors: 2 },
        relationshipChange: 10,
        nextEncounterBranch: 'priest_ally',
      },
      {
        label: 'Confesarte',
        description: 'Hablas con él. Te sientes en paz y te da provisiones.',
        effect: { food: 2, water: 2 },
        karmaChange: 1,
        relationshipChange: 5,
      },
      {
        label: 'Donar para los pobres',
        description: 'Das recursos para los necesitados.',
        effect: { food: -2, water: -1 },
        karmaChange: 2,
        relationshipChange: 8,
        factionChanges: { survivors: 2 },
      },
    ],
  },
  {
    id: 'priest_ally',
    title: 'Antonio, tu Aliado',
    description: 'Antonio te recibe con los brazos abiertos. "Eres un ángel para esta comunidad."',
    icon: '⛪',
    factionId: 'survivors',
    npcId: 'priest_antonio',
    isBranch: true,
    parentEncounterId: 'priest_friend',
    relationshipMin: 65,
    locationTypes: ['place_of_worship'],
    journalEntry: 'Antonio compartió las donaciones del templo conmigo.',
    choices: [
      {
        label: 'Recibir donaciones',
        description: 'Te da acceso a las donaciones que recibe la parroquia.',
        effect: { food: 5, water: 3, medicine: 2 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Reclutarlo como Guía',
        description: '"Iré contigo. Mi fe ayudará a mantener la moral."',
        effect: {},
        karmaChange: 2,
        relationshipChange: 5,
        companionJoinId: 'priest_spiritual',
      },
      {
        label: 'Bendición especial',
        description: 'Bendice tu refugio. Sientes una protección especial.',
        effect: { medicine: 2 },
        karmaChange: 3,
        relationshipChange: 3,
      },
    ],
  },
  {
    id: 'librarian_friend',
    title: 'Carmen, la Bibliotecaria (Amiga)',
    description: 'Carmen te enseña un libro antiguo. "Encontré esto sobre técnicas de construcción. ¡Te va a encantar!"',
    icon: '👩‍🏫',
    factionId: 'survivors',
    npcId: 'librarian_carmen',
    isBranch: true,
    parentEncounterId: 'librarian_guardian',
    relationshipMin: 50,
    locationTypes: ['library'],
    journalEntry: 'Visité a Carmen en la biblioteca.',
    choices: [
      {
        label: 'Estudiar juntos',
        description: 'Investigáis técnicas de supervivencia. Ambos aprendéis.',
        effect: { materials: 3, medicine: 1 },
        karmaChange: 1,
        relationshipChange: 10,
        factionChanges: { survivors: 1 },
        nextEncounterBranch: 'librarian_ally',
      },
      {
        label: 'Ayudar a catalogar',
        description: 'Organizas la sección de ciencias. Encuentras mapas útiles.',
        effect: { materials: 2 },
        karmaChange: 0,
        relationshipChange: 8,
        unlockRumorId: 'rumor_hidden_bunker',
      },
      {
        label: 'Leer un rato',
        description: 'Te relajas leyendo. Recuperas energía.',
        effect: { food: 2 },
        karmaChange: 0,
        relationshipChange: 5,
      },
    ],
  },
  {
    id: 'librarian_ally',
    title: 'Carmen, tu Aliada',
    description: 'Carmen ha preparado algo para ti. "Te he guardado los mejores manuales de la biblioteca."',
    icon: '👩‍🏫',
    factionId: 'survivors',
    npcId: 'librarian_carmen',
    isBranch: true,
    parentEncounterId: 'librarian_friend',
    relationshipMin: 65,
    locationTypes: ['library'],
    journalEntry: 'Carmen compartió sus conocimientos conmigo.',
    choices: [
      {
        label: 'Llevarte los manuales',
        description: 'Te da manuales de construcción que valen su peso en oro.',
        effect: { materials: 5 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Reclutarla como Erudita',
        description: '"Siempre quise salir de estas cuatro paredes." Carmen se une.',
        effect: {},
        karmaChange: 1,
        relationshipChange: 5,
        companionJoinId: 'librarian_scholar',
      },
      {
        label: 'Mapa de la zona',
        description: 'Te dibuja un mapa detallado con ubicaciones de suministros.',
        effect: { materials: 2, food: 2, water: 1 },
        karmaChange: 0,
        relationshipChange: 3,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // ENCUENTROS CON BANDIDO (Forajidos)
  // ══════════════════════════════════════════════════

  {
    id: 'bandit_friend',
    title: 'Raúl, el Bandido (Conocido)',
    description: 'Raúl te reconoce y baja el arma. "Tú no eres como los otros. ¿Qué buscas?"',
    icon: '🗡️',
    factionId: 'outlaws',
    npcId: 'bandit_raúl',
    isBranch: true,
    parentEncounterId: 'looters_confrontation',
    relationshipMin: 50,
    locationTypes: ['hardware', 'construction_site', 'gas_station'],
    journalEntry: 'Me reuní con Raúl, el líder de los saqueadores.',
    choices: [
      {
        label: 'Negociar un trato',
        description: 'Acordáis una tregua. Él te da información del mercado negro.',
        effect: { materials: 3, fuel: 1 },
        karmaChange: -1,
        relationshipChange: 10,
        factionChanges: { outlaws: 2 },
        nextEncounterBranch: 'bandit_ally',
      },
      {
        label: 'Pedirle que no ataque a civiles',
        description: 'Le pides que deje en paz a los supervivientes. Sorprendentemente, accede.',
        effect: {},
        karmaChange: 2,
        relationshipChange: 5,
        factionChanges: { survivors: 1, outlaws: 1 },
      },
      {
        label: 'Advertirle de los militares',
        description: 'Le cuentas que el ejército patrulla la zona. Te lo agradece.',
        effect: { fuel: 2 },
        karmaChange: 0,
        relationshipChange: 8,
      },
    ],
  },
  {
    id: 'bandit_ally',
    title: 'Raúl, tu Aliado',
    description: 'Raúl te tiende la mano. "Eres de los nuestros. Los chicos te respetan."',
    icon: '🗡️',
    factionId: 'outlaws',
    npcId: 'bandit_raúl',
    isBranch: true,
    parentEncounterId: 'bandit_friend',
    relationshipMin: 65,
    locationTypes: ['hardware', 'construction_site', 'gas_station'],
    journalEntry: 'Raúl compartió el botín conmigo.',
    choices: [
      {
        label: 'Recibir parte del botín',
        description: 'Te da una parte del último saqueo.',
        effect: { food: 4, materials: 3, fuel: 2 },
        karmaChange: -2,
        relationshipChange: 5,
      },
      {
        label: 'Reclutar explorador',
        description: '"El Flaco conoce cada rincón del yermo. Te lo presto."',
        effect: {},
        karmaChange: -1,
        relationshipChange: 3,
        companionJoinId: 'bandit_scout',
      },
      {
        label: 'Pacto de no agresión',
        description: 'Acordáis que su banda respetará a los supervivientes que tú digas.',
        effect: {},
        karmaChange: 1,
        relationshipChange: 5,
        factionChanges: { survivors: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // TRADER FRIEND & ALLY (Mercaderes)
  // ══════════════════════════════════════════════════

  {
    id: 'trader_friend',
    title: 'Rodrigo, el Comerciante (Amigo)',
    description: 'Rodrigo te enseña mercancía nueva con entusiasmo. "¡Mira lo que conseguí! Para ti, precio especial."',
    icon: '🧳',
    factionId: 'merchants',
    npcId: 'merchant_rodrigo',
    isBranch: true,
    parentEncounterId: 'trader_offer',
    relationshipMin: 50,
    locationTypes: ['supermarket', 'convenience_store', 'gas_station'],
    journalEntry: 'Visité a Rodrigo, mi amigo comerciante.',
    choices: [
      {
        label: 'Comprar lote premium',
        description: 'Te ofrece su mejor mercancía a precio reducido.',
        effect: { materials: -3, food: 6, medicine: 3 },
        karmaChange: 0,
        relationshipChange: 10,
        factionChanges: { merchants: 2 },
        nextEncounterBranch: 'trader_ally',
      },
      {
        label: 'Intercambio estándar',
        description: 'Un trueque justo como siempre.',
        effect: { materials: -2, food: 3, water: 2 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Pedir información',
        description: 'Te cuenta qué rutas comerciales son seguras.',
        effect: {},
        karmaChange: 0,
        relationshipChange: 3,
        unlockRumorId: 'rumor_trade_caravan',
      },
    ],
  },
  {
    id: 'trader_ally',
    title: 'Rodrigo, tu Aliado Comercial',
    description: 'Rodrigo te guiña un ojo. "Tengo acceso a cosas que ni los militares tienen."',
    icon: '🧳',
    factionId: 'merchants',
    npcId: 'merchant_rodrigo',
    isBranch: true,
    parentEncounterId: 'trader_friend',
    relationshipMin: 65,
    locationTypes: ['supermarket', 'convenience_store', 'gas_station'],
    journalEntry: 'Rodrigo me dio acceso a su inventario secreto.',
    choices: [
      {
        label: 'Inventario secreto',
        description: 'Te muestra su alijo oculto con los mejores productos.',
        effect: { food: 4, medicine: 4, fuel: 3, materials: 2 },
        karmaChange: 0,
        relationshipChange: 5,
      },
      {
        label: 'Reclutarlo como Socio',
        description: '"Siempre quise un socio de confianza." Rodrigo se une.',
        effect: {},
        karmaChange: 1,
        relationshipChange: 5,
        companionJoinId: 'merchant_partner',
      },
      {
        label: 'Invertir en su negocio',
        description: 'Le das recursos para expandir sus rutas comerciales.',
        effect: { materials: -3, fuel: -2 },
        karmaChange: 0,
        relationshipChange: 8,
        factionChanges: { merchants: 3 },
      },
    ],
  },
];

export function getRandomNPCEncounter(
  locationType: string,
  karma: number,
  factionReputation?: Record<string, number>,
  npcRelationships?: { npcId: string; points: number }[],
  metNPCs?: string[]
): NPCEncounter | null {
  const eligible = NPC_ENCOUNTERS.filter((enc) => {
    // Filtrar por tipo de ubicación
    const matchesLocation =
      !enc.locationTypes ||
      enc.locationTypes.length === 0 ||
      enc.locationTypes.includes(locationType as LocationType);
    if (!matchesLocation) return false;

    // Filtrar por requisitos de karma
    if (enc.karmaMin !== undefined && karma < enc.karmaMin) return false;
    if (enc.karmaMax !== undefined && karma > enc.karmaMax) return false;

    // Filtrar por reputación de facción
    if (enc.factionMin && factionReputation) {
      for (const [factionId, min] of Object.entries(enc.factionMin)) {
        if ((factionReputation[factionId] ?? 0) < min) return false;
      }
    }

    // Filtrar por ramificaciones: solo mostrar encuentros "friend" si tienes suficiente relación
    if (enc.isBranch) {
      // No mostrar ramificaciones a menos que se cumpla la relación
      if (enc.relationshipMin !== undefined && npcRelationships) {
        const rel = npcRelationships.find((r) => r.npcId === enc.npcId);
        if (!rel || rel.points < enc.relationshipMin) return false;
      }
    } else if (enc.npcId) {
      // Para encuentros base: si ya hay una relación alta, priorizar la versión "friend"
      if (npcRelationships && metNPCs) {
        const rel = npcRelationships.find((r) => r.npcId === enc.npcId);
        if (rel && rel.points >= 50 && !enc.isBranch) {
          // Si ya es amigo, no mostrar el encuentro base
          // Se mostrará la versión "friend" en su lugar
          return false;
        }
      }
    }

    // Si el encuentro tiene npcId y ya lo conocimos, verificar si es repetible
    if (enc.npcId && metNPCs && !enc.repeatable && !enc.isBranch) {
      // Encuentros base de NPCs persistentes: solo mostrar si no los hemos conocido
      if (metNPCs.includes(enc.npcId)) return false;
    }

    return true;
  });

  if (eligible.length === 0) return null;

  const karmaModifier = karma / 50;
  const probability = 0.25 + karmaModifier;

  const roll = Math.random();
  if (roll > probability) return null;

  return eligible[Math.floor(Math.random() * eligible.length)];
}

export function findBranchEncounter(
  npcId: string,
  relationshipPoints: number
): NPCEncounter | null {
  // Buscar encuentros ramificados para este NPC que coincidan con el nivel de relación
  const branches = NPC_ENCOUNTERS.filter(
    (enc) =>
      enc.isBranch &&
      enc.npcId === npcId &&
      enc.relationshipMin !== undefined &&
      relationshipPoints >= enc.relationshipMin
  );

  if (branches.length === 0) return null;

  // Devolver el de mayor nivel de relación
  branches.sort((a, b) => (b.relationshipMin ?? 0) - (a.relationshipMin ?? 0));
  return branches[0];
}

export function getNPCRelatedEncounters(npcId: string): NPCEncounter[] {
  return NPC_ENCOUNTERS.filter(
    (enc) => enc.npcId === npcId || enc.parentEncounterId === npcId
  );
}
