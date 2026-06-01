import type { Resources, FactionId } from '../types/game';

export interface RoamingEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'positive' | 'negative' | 'neutral' | 'discovery';
  /** Probabilidad base (0-1). Se multiplica por el bonus de baja densidad */
  probability: number;
  effect?: Partial<Resources>;
  defenseBoost?: number;
  /** Solo aparece con cierto karma mínimo */
  karmaMin?: number;
  /** Solo aparece con cierto karma máximo */
  karmaMax?: number;
  /** Semana mínima para que aparezca */
  minWeek?: number;
  // ─── Interacciones sociales ───
  /** Cambios de reputación por facción */
  factionChanges?: Partial<Record<FactionId, number>>;
  /** Reputación mínima de facción para que aparezca */
  factionRepMin?: Partial<Record<FactionId, number>>;
  /** Desbloquea un rumor */
  unlockRumorId?: string;
  /** Recluta un compañero */
  companionJoinId?: string;
  /** Cambio de karma */
  karmaChange?: number;
  /** Entrada para el diario del superviviente */
  journalEntry?: string;
}

/**
 * Eventos deambulantes — ocurren mientras exploras el mapa,
 * sin necesidad de visitar una ubicación concreta.
 * 
 * En zonas con pocas ubicaciones de recursos, la probabilidad
 * de que salte un evento aumenta (hasta +100% en zonas vacías).
 */
export const ROAMING_EVENTS: RoamingEvent[] = [
  // ══════════════════════════════════════════════════
  // ENCUENTROS POSITIVOS — pequeños hallazgos
  // ══════════════════════════════════════════════════

  {
    id: 'roam_ration_pack',
    title: 'Ración Militar',
    description: 'Encuentras una ración de combate semi enterrada en el barro. Aún está sellada y en buen estado.',
    icon: '🎒',
    type: 'positive',
    probability: 0.18,
    effect: { food: 3, water: 1 },
  },
  {
    id: 'roam_backpack',
    title: 'Mochila Abandonada',
    description: 'Una mochila olvidada junto a un árbol. Contiene una cantimplora llena y algunas latas.',
    icon: '🎒',
    type: 'positive',
    probability: 0.15,
    effect: { food: 2, water: 3 },
  },
  {
    id: 'roam_medkit',
    title: 'Botiquín de Campaña',
    description: 'Un botiquín de primeros auxilios tirado en la cuneta. Está completo: vendas, antiséptico y analgésicos.',
    icon: '🩹',
    type: 'positive',
    probability: 0.12,
    effect: { medicine: 3 },
  },
  {
    id: 'roam_toolbox',
    title: 'Caja de Herramientas',
    description: 'Una caja de herramientas volcada en el arcén. Martillo, destornilladores y clavos.',
    icon: '🧰',
    type: 'positive',
    probability: 0.12,
    effect: { materials: 3 },
  },
  {
    id: 'roam_fuel_canister',
    title: 'Bidón de Combustible',
    description: 'Un bidón de gasolina olvidado junto a una carretera secundaria. Aún tiene líquido.',
    icon: '🛢️',
    type: 'positive',
    probability: 0.10,
    effect: { fuel: 3 },
  },
  {
    id: 'roam_fruit_tree',
    title: 'Árbol Frutal',
    description: 'Un manzano silvestre cargado de fruta. No es mucho, pero es comida fresca.',
    icon: '🍎',
    type: 'positive',
    probability: 0.16,
    effect: { food: 4 },
  },
  {
    id: 'roam_rain_barrel',
    title: 'Barril de Lluvia',
    description: 'Un barril abandonado lleno de agua de lluvia. Está sorprendentemente limpia.',
    icon: '🪣',
    type: 'positive',
    probability: 0.14,
    effect: { water: 5 },
  },
  {
    id: 'roam_solar_charger',
    title: 'Cargador Solar',
    description: 'Un pequeño panel solar portátil tirado en la hierba. Podría servir para recargar baterías.',
    icon: '☀️',
    type: 'positive',
    probability: 0.06,
    minWeek: 2,
    effect: { fuel: 2 },
    defenseBoost: 1,
  },

  // ══════════════════════════════════════════════════
  // ENCUENTROS NEGATIVOS — peligros del yermo
  // ══════════════════════════════════════════════════

  {
    id: 'roam_stray_dogs',
    title: 'Jauría Callejera',
    description: 'Una jauría de perros callejeros te ladra agresivamente. Tienes que alejarte rápido.',
    icon: '🐕',
    type: 'negative',
    probability: 0.10,
    effect: { food: -1 },
  },
  {
    id: 'roam_mud_slide',
    title: 'Desprendimiento de Barro',
    description: 'El terreno cede bajo tus pies. Resbalas y pierdes parte de tu equipo.',
    icon: '💧',
    type: 'negative',
    probability: 0.08,
    effect: { materials: -2 },
  },
  {
    id: 'roam_smoke_inhalation',
    title: 'Humo Tóxico',
    description: 'Una columna de humo negro te envuelve. Tos y ardor en los pulmones. Necesitarás medicinas.',
    icon: '💨',
    type: 'negative',
    probability: 0.06,
    minWeek: 2,
    effect: { medicine: -2 },
  },
  {
    id: 'roam_broken_bridge',
    title: 'Puente Cortado',
    description: 'El puente que ibas a cruzar está derrumbado. Tienes que rodear, perdiendo tiempo y energía.',
    icon: '🌉',
    type: 'negative',
    probability: 0.07,
    effect: { food: -2, water: -1 },
  },
  {
    id: 'roam_barbed_wire',
    title: 'Alambre de Espino',
    description: 'Te enganchas con una alambrada oculta entre la maleza. Desgarras tu ropa y pierdes materiales.',
    icon: '🪤',
    type: 'negative',
    probability: 0.08,
    effect: { materials: -1, medicine: -1 },
  },

  // ══════════════════════════════════════════════════
  // ENCUENTROS NEUTRALES — atmósfera y narrativa
  // ══════════════════════════════════════════════════

  {
    id: 'roam_graffiti',
    title: 'Pintada en la Pared',
    description: '"AÚN QUEDAN BUENAS PERSONAS" — reza una pintada en la pared de un edificio. Sonríes a pesar de todo.',
    icon: '🎨',
    type: 'neutral',
    probability: 0.14,
  },
  {
    id: 'roam_childs_drawing',
    title: 'Dibujo Infantil',
    description: 'Un dibujo de una familia feliz pegado a una farola. Debajo, escrito con torpeza: "Volveremos a estar juntos".',
    icon: '🖍️',
    type: 'neutral',
    probability: 0.12,
  },
  {
    id: 'roam_abandoned_car',
    title: 'Coche Abandonado',
    description: 'Un coche con las puertas abiertas y el motor frío. En el asiento trasero, un álbum de fotos familiar.',
    icon: '🚗',
    type: 'neutral',
    probability: 0.16,
  },
  {
    id: 'roam_birds_flock',
    title: 'Bandada de Aves',
    description: 'Una bandada de pájaros cruza el cielo en formación. La naturaleza sigue su curso.',
    icon: '🐦',
    type: 'neutral',
    probability: 0.14,
  },
  {
    id: 'roam_wind_chimes',
    title: 'Campanas de Viento',
    description: 'El viento agita unas campanillas colgadas en un porche. El sonido es extrañamente pacífico.',
    icon: '🎐',
    type: 'neutral',
    probability: 0.10,
  },
  {
    id: 'roam_radio_static',
    title: 'Estática de Radio',
    description: 'Tu radio capta una señal débil. Solo se oye estática... y luego, una voz: "...aguantad, viene ayuda..."',
    icon: '📻',
    type: 'neutral',
    probability: 0.08,
    minWeek: 2,
  },
  {
    id: 'roam_sunset_view',
    title: 'Atardecer en el Yermo',
    description: 'El sol se pone entre los escombros. Por un momento, el mundo parece hermoso.',
    icon: '🌅',
    type: 'neutral',
    probability: 0.12,
  },
  {
    id: 'roam_old_photograph',
    title: 'Fotografía Antigua',
    description: 'Una foto en blanco y negro de una pareja sonriente. Al dorso: "Para siempre. 1987".',
    icon: '📷',
    type: 'neutral',
    probability: 0.10,
  },

  // ══════════════════════════════════════════════════
  // ENCUENTROS DESCUBRIMIENTO — hallazgos especiales
  // ══════════════════════════════════════════════════

  {
    id: 'roam_natural_spring',
    title: 'Manantial Natural',
    description: '¡Un pequeño manantial brota entre las rocas! Agua fresca y cristalina en medio de la nada.',
    icon: '⛲',
    type: 'discovery',
    probability: 0.05,
    effect: { water: 4 },
    defenseBoost: 1,
  },
  {
    id: 'roam_berry_bushes',
    title: 'Zarzal de Moras',
    description: 'Descubres un zarzal cargado de moras silvestres. Te llenas los bolsillos.',
    icon: '🫐',
    type: 'discovery',
    probability: 0.07,
    effect: { food: 3 },
  },
  {
    id: 'roam_abandoned_tent',
    title: 'Tienda Abandonada',
    description: 'Una tienda de campaña olvidada. Dentro hay un saco de dormir, linterna y provisiones.',
    icon: '🏕️',
    type: 'discovery',
    probability: 0.04,
    minWeek: 2,
    effect: { food: 2, water: 1, materials: 2 },
    defenseBoost: 1,
  },
  {
    id: 'roam_cave_entrance',
    title: 'Entrada de Cueva',
    description: 'Una cueva oculta entre la maleza. Dentro hace fresco y está seca. Podría ser un buen refugio temporal.',
    icon: '🕳️',
    type: 'discovery',
    probability: 0.04,
    minWeek: 2,
    effect: { materials: 2 },
    defenseBoost: 2,
  },
  {
    id: 'roam_hidden_stash',
    title: 'Alijo Oculto',
    description: 'Un bidón enterrado con suministros. Alguien los escondió para volver... pero nunca regresó.',
    icon: '🪣',
    type: 'discovery',
    probability: 0.03,
    minWeek: 3,
    effect: { food: 4, water: 3, medicine: 2 },
  },
  {
    id: 'roam_weathered_sign',
    title: 'Señal Meteorizada',
    description: 'Una señal de tráfico oxidada: "Refugio a 5 km". Las indicaciones apenas se leen, pero es una pista.',
    icon: '🪧',
    type: 'discovery',
    probability: 0.06,
    effect: { materials: 1 },
    defenseBoost: 1,
  },

  // ══════════════════════════════════════════════════
  // ENCUENTROS CON NPC AMBULANTES — karma-dependent
  // ══════════════════════════════════════════════════

  {
    id: 'roam_wandering_elder',
    title: 'Anciano Errante',
    description: 'Un anciano camina despacio por la carretera. "Joven, ¿has visto a mi hija? Se llama Marta..."',
    icon: '👴',
    type: 'positive',
    probability: 0.10,
    effect: { food: 1 },
  },
  {
    id: 'roam_good_samaritan',
    title: 'Buen Samaritano',
    description: 'Un desconocido te ofrece ayuda sin pedir nada a cambio. "Todos necesitamos una mano de vez en cuando."',
    icon: '🤲',
    type: 'positive',
    probability: 0.06,
    karmaMin: 3,
    effect: { medicine: 2, food: 2 },
  },
  {
    id: 'roam_fleeing_family',
    title: 'Familia Huyendo',
    description: 'Una familia corre en dirección contraria. "¡No vayáis por ahí, el puente se ha derrumbado!" Te ahorran el rodeo.',
    icon: '👨‍👩‍👧‍👦',
    type: 'positive',
    probability: 0.08,
    effect: { food: 1, water: 1 },
  },
  {
    id: 'roam_scavenger_warning',
    title: 'Chatarrero Amistoso',
    description: 'Un chatarrero te silba desde lejos. "¡Eh! Revisé esa zona ayer, no queda nada. Prueba más al norte."',
    icon: '🧑‍🏭',
    type: 'positive',
    probability: 0.08,
    effect: { materials: 2 },
  },
  {
    id: 'roam_sketchy_dealer',
    title: 'Traficante Sospechoso',
    description: 'Un tipo con gabardina te ofrece "mercancía especial". No preguntas de dónde la sacó.',
    icon: '🕵️',
    type: 'neutral',
    probability: 0.07,
    karmaMax: 3,
    effect: { medicine: 2, fuel: 2 },
  },

  // ══════════════════════════════════════════════════
  // ENCUENTROS SOCIALES — facciones, rumores, compañeros
  // ══════════════════════════════════════════════════

  // ─── FACCIONES: Supervivientes ───
  {
    id: 'roam_survivor_scout',
    title: 'Explorador de la Red',
    description: 'Un explorador de la Red de Supervivientes te reconoce. "¿Eres el que ayudó en el centro comunitario? Toma, la red comparte."',
    icon: '🤝',
    type: 'positive',
    probability: 0.08,
    factionRepMin: { survivors: 1 },
    effect: { food: 2, water: 2 },
    factionChanges: { survivors: 1 },
    karmaChange: 1,
    journalEntry: 'Un explorador de la Red de Supervivientes compartió recursos conmigo.',
  },
  {
    id: 'roam_survivor_soup_kitchen',
    title: 'Olla Comunitaria Ambulante',
    description: 'Un grupo de supervivientes ha montado una cocina improvisada entre los escombros. "¡Acércate! Siempre hay un plato para quien lo necesita."',
    icon: '🍲',
    type: 'positive',
    probability: 0.10,
    factionRepMin: { survivors: 3 },
    effect: { food: 3 },
    factionChanges: { survivors: 2 },
    karmaChange: 2,
    journalEntry: 'Compartí una olla comunitaria con supervivientes en la calle.',
  },
  {
    id: 'roam_survivor_feud',
    title: 'Disputa entre Vecinos',
    description: 'Dos supervivientes discuten a gritos por unas latas de comida. "¡Las vi yo primero!" — "¡Mentira, ya estaban en mi mochila!"',
    icon: '😤',
    type: 'neutral',
    probability: 0.09,
    factionRepMin: { survivors: 1 },
    factionChanges: { survivors: -1 },
    karmaChange: 0,
    journalEntry: 'Presencié una disputa entre supervivientes por recursos.',
  },

  // ─── FACCIONES: Mercaderes ───
  {
    id: 'roam_merchant_courier',
    title: 'Mensajero del Gremio',
    description: 'Un mensajero del Gremio de Mercaderes te intercepta. "Rodrigo manda esto. Dice que es un adelanto por tu lealtad."',
    icon: '⚖️',
    type: 'positive',
    probability: 0.07,
    factionRepMin: { merchants: 3 },
    effect: { materials: 3, fuel: 1 },
    factionChanges: { merchants: 1 },
    karmaChange: 0,
    journalEntry: 'Recibí un paquete del Gremio de Mercaderes.',
  },
  {
    id: 'roam_trade_post',
    title: 'Puesto de Trueque Ambulante',
    description: 'Un mercader ha montado un tenderete en una esquina. "¡Ofertas del día! ¡Cambio chatarra por comida!"',
    icon: '🏪',
    type: 'positive',
    probability: 0.09,
    factionRepMin: { merchants: 1 },
    effect: { materials: -2, food: 4 },
    factionChanges: { merchants: 1 },
    karmaChange: 0,
    journalEntry: 'Encontré un puesto de trueque ambulante del Gremio.',
  },
  {
    id: 'roam_merchant_rival',
    title: 'Competencia Desleal',
    description: 'Un mercader independiente te advierte: "Esos del Gremio te están usando. Yo te ofrezco mejor trato, sin intermediarios."',
    icon: '🤨',
    type: 'neutral',
    probability: 0.06,
    factionRepMin: { merchants: 2 },
    effect: { materials: 2, food: 2 },
    factionChanges: { merchants: -1 },
    karmaChange: -1,
    journalEntry: 'Un mercader independiente intentó sobornarme para abandonar al Gremio.',
  },

  // ─── FACCIONES: Militares ───
  {
    id: 'roam_military_patrol',
    title: 'Patrulla Militar',
    description: 'Dos soldados hacen un alto en su patrulla. "¿Has visto actividad sospechosa?" Tras charlar, te dan un chute de combustible.',
    icon: '🎖️',
    type: 'positive',
    probability: 0.07,
    factionRepMin: { military: 3 },
    effect: { fuel: 2 },
    factionChanges: { military: 1 },
    karmaChange: 0,
    journalEntry: 'Coincidí con una patrulla del Remanente Militar.',
  },
  {
    id: 'roam_checkpoint',
    title: 'Punto de Control',
    description: 'Los militares han montado un checkpoint. "Zona controlada. Puedes pasar si nos ayudas con esto." Te piden materiales.',
    icon: '🛂',
    type: 'neutral',
    probability: 0.08,
    factionRepMin: { military: 1 },
    effect: { materials: -2 },
    factionChanges: { military: 2 },
    karmaChange: 0,
    journalEntry: 'Pasé por un punto de control militar.',
  },
  {
    id: 'roam_military_deserter',
    title: 'Desertor Herido',
    description: 'Un soldado desertor está malherido en una cuneta. "No... no se lo digas a mis superiores. Ayúdame y te pagaré."',
    icon: '🪖',
    type: 'positive',
    probability: 0.06,
    karmaMin: 2,
    effect: { medicine: -1, fuel: 3 },
    factionChanges: { military: -1 },
    karmaChange: 1,
    journalEntry: 'Ayudé a un desertor del Remanente Militar.',
  },

  // ─── FACCIONES: Forajidos ───
  {
    id: 'roam_outlaw_mark',
    title: 'Marcado por los Forajidos',
    description: 'Un graffitti de una calavera en tu ruta. Significa "zona de forajidos". Mejor date prisa.',
    icon: '💀',
    type: 'negative',
    probability: 0.07,
    factionRepMin: { outlaws: 1 },
    effect: {},
    factionChanges: { outlaws: -1 },
    karmaChange: 0,
    journalEntry: 'Vi una marca de los Forajidos del Yermo.',
  },
  {
    id: 'roam_outlaw_tip',
    title: 'Chivatazo del Flaco',
    description: 'El Flaco te silba desde una esquina. "Psst... los militares escondieron un alijo al norte leado. Date prisa antes de que lo encuentren."',
    icon: '🗡️',
    type: 'discovery',
    probability: 0.05,
    factionRepMin: { outlaws: 4 },
    minWeek: 2,
    effect: { materials: 3, fuel: 2 },
    factionChanges: { outlaws: 1 },
    karmaChange: -1,
    journalEntry: 'El Flaco me dio un chivatazo sobre un alijo militar.',
  },
  {
    id: 'roam_outlaw_shakedown',
    title: 'Peaje Forajido',
    description: 'Dos forajidos te bloquean el paso. "Esto es territorio nuestro. Paga el peaje o busca otro camino."',
    icon: '🔫',
    type: 'negative',
    probability: 0.08,
    factionRepMin: { outlaws: 2 },
    karmaMin: -2,
    effect: { food: -2 },
    factionChanges: { outlaws: 1 },
    karmaChange: -1,
    journalEntry: 'Pagué peaje a los Forajidos del Yermo.',
  },

  // ─── RUMORES — pistas mientras exploras ───
  {
    id: 'roam_overheard_rumor',
    title: 'Conversación Escuchada',
    description: 'Dos supervivientes hablan junto a una ventana rota. "...y dicen que el depósito de agua municipal sigue funcionando. Podríamos ir..."',
    icon: '👂',
    type: 'discovery',
    probability: 0.08,
    minWeek: 2,
    unlockRumorId: 'rumor_abandoned_truck',
    journalEntry: 'Escuché una conversación sobre suministros.',
  },
  {
    id: 'roam_note_on_wall',
    title: 'Nota Clavada en la Pared',
    description: 'Una nota clavada con un cuchillo: "Caravana de trueque llega el jueves. Traed lo que tengáis. — R."',
    icon: '📝',
    type: 'discovery',
    probability: 0.07,
    factionRepMin: { merchants: 1 },
    unlockRumorId: 'rumor_trade_caravan',
    journalEntry: 'Encontré una nota sobre una caravana de trueque.',
  },
  {
    id: 'roam_radio_fragment',
    title: 'Fragmento de Transmisión',
    description: 'Tu radio capta: "...repito, se está formando una milicia civil. Los que quieran unirse, acudan al... krrrr..."',
    icon: '📡',
    type: 'discovery',
    probability: 0.06,
    minWeek: 2,
    karmaMin: 1,
    unlockRumorId: 'rumor_militia_forming',
    journalEntry: 'Capté una transmisión sobre una milicia civil.',
  },
  {
    id: 'roam_stranger_whisper',
    title: 'Susurro en la Niebla',
    description: 'Una figura apenas visible te susurra al pasar: "Cuidado con lo que viene del este... el suelo tiembla..." Y desaparece.',
    icon: '🌫️',
    type: 'discovery',
    probability: 0.05,
    minWeek: 2,
    karmaMin: 3,
    unlockRumorId: 'rumor_earthquake_hint',
    journalEntry: 'Un desconocido me advirtió sobre temblores.',
  },

  // ─── COMPAÑEROS — encuentros de reclutamiento ───
  {
    id: 'roam_stray_dog_friendly',
    title: 'Perro Amistoso',
    description: 'Un perro callejero se te acerca moviendo la cola. Parece hambriento pero confiado. Si compartes tu comida, igual te sigue.',
    icon: '🐕',
    type: 'discovery',
    probability: 0.05,
    effect: { food: -1 },
    companionJoinId: 'dog_buddy',
    karmaChange: 2,
    journalEntry: 'Un perro callejero se unió a mí.',
  },
  {
    id: 'roam_merc_offer',
    title: 'Mercenario a la Deriva',
    description: 'Un mercenario sin bando deambula entre las ruinas. "Por un plato de comida y agua, te cubro las espaldas un par de semanas."',
    icon: '🛡️',
    type: 'discovery',
    probability: 0.04,
    minWeek: 2,
    effect: { food: -1, water: -1 },
    companionJoinId: 'soldier_escort',
    karmaChange: 0,
    journalEntry: 'Un mercenario se ofreció a escoltarme.',
  },
  {
    id: 'roam_wandering_priest',
    title: 'Sacerdote Peregrino',
    description: 'El padre Antonio camina entre las ruinas ofreciendo consuelo. "Hijo, veo que cargas un gran peso. Déjame ayudarte."',
    icon: '⛪',
    type: 'discovery',
    probability: 0.04,
    minWeek: 2,
    karmaMin: 4,
    companionJoinId: 'priest_spiritual',
    karmaChange: 2,
    journalEntry: 'El padre Antonio se unió a mi causa.',
  },

  // ─── KARMA — eventos que ponen a prueba tu moral ───
  {
    id: 'roam_moral_dilemma_food',
    title: 'Alijo sin Dueño',
    description: 'Encuentras un alijo de comida claramente marcado como propiedad de un grupo. No hay nadie cerca...',
    icon: '🤔',
    type: 'neutral',
    probability: 0.09,
    effect: { food: 2 },
    karmaChange: -1,
    journalEntry: 'Tomé comida de un alijo ajeno.',
  },
  {
    id: 'roam_return_supplies',
    title: 'Devolución Honesta',
    description: 'Encuentras una mochila con medicinas y una nota: "Para el puesto de socorro de la clínica." Está sellada.',
    icon: '😇',
    type: 'positive',
    probability: 0.06,
    karmaMin: 4,
    effect: {},
    factionChanges: { survivors: 2 },
    karmaChange: 3,
    journalEntry: 'Devolví suministros médicos a la clínica.',
  },
  {
    id: 'roam_crying_child',
    title: 'Llanto entre Escombros',
    description: 'Escuchas el llanto de un niño entre los escombros. Al acercarte, ves que está solo y asustado. Buscas a sus padres.',
    icon: '😢',
    type: 'positive',
    probability: 0.07,
    karmaMin: 1,
    effect: {},
    factionChanges: { survivors: 2 },
    karmaChange: 3,
    journalEntry: 'Ayudé a un niño perdido a encontrar a sus padres.',
  },
  {
    id: 'roam_buried_survivor',
    title: 'Superviviente Enterrado',
    description: 'Una mano sobresale de los escombros. "¡Ayuda! ¡Estoy aquí abajo!" Cavas frenéticamente para liberarlo.',
    icon: '🆘',
    type: 'positive',
    probability: 0.05,
    karmaMin: 2,
    effect: { materials: -1 },
    factionChanges: { survivors: 3 },
    karmaChange: 4,
    journalEntry: 'Rescaté a un superviviente sepultado entre escombros.',
  },
];

// ══════════════════════════════════════════════════
// FUNCIONES DE GENERACIÓN
// ══════════════════════════════════════════════════

export interface RoamingContext {
  karma: number;
  week: number;
  /** Número de ubicaciones cercanas al jugador (radio ~500m).
   *  Valores bajos = zona despoblada = más probabilidad de evento. */
  nearbyLocationCount: number;
  /** Reputación actual con cada facción */
  factionReputation?: Partial<Record<FactionId, number>>;
}

/**
 * Genera un evento deambulante basado en la densidad de ubicaciones.
 * 
 * Cuantas menos ubicaciones haya cerca del jugador, mayor probabilidad
 * de que salte un evento (hasta 2.5x en zonas completamente vacías).
 */
export function generateRoamingEvent(ctx: RoamingContext): RoamingEvent | null {
  // Bonus de densidad: cuantas menos ubicaciones, más bonus
  // 0 ubicaciones → 2.5x | 1-2 → 2.0x | 3-4 → 1.5x | 5+ → 1.0x (normal)
  const densityBonus =
    ctx.nearbyLocationCount === 0 ? 2.5
    : ctx.nearbyLocationCount <= 2 ? 2.0
    : ctx.nearbyLocationCount <= 4 ? 1.5
    : 1.0;

  // Filtrar eventos elegibles según karma, semana, reputación de facción, etc.
  const eligible = ROAMING_EVENTS.filter((ev) => {
    if (ev.karmaMin !== undefined && ctx.karma < ev.karmaMin) return false;
    if (ev.karmaMax !== undefined && ctx.karma > ev.karmaMax) return false;
    if (ev.minWeek !== undefined && ctx.week < ev.minWeek) return false;
    // Filtrar por reputación de facción
    if (ev.factionRepMin && ctx.factionReputation) {
      for (const [factionId, min] of Object.entries(ev.factionRepMin)) {
        if ((ctx.factionReputation[factionId as FactionId] ?? 0) < min) return false;
      }
    }
    return true;
  });

  if (eligible.length === 0) return null;

  // Probabilidad base de que ocurra ALGÚN evento (no por evento individual)
  // En zona densa (5+ ubicaciones): ~15% cada 2 min
  // En zona vacía (0 ubicaciones): ~37% cada 2 min
  const baseChance = 0.15 * densityBonus;

  const roll = Math.random();
  if (roll > baseChance) return null;

  // Elegir un evento aleatorio de los elegibles
  // Dar más peso a los eventos con mayor probabilidad
  const totalWeight = eligible.reduce((sum, ev) => sum + ev.probability, 0);
  let cumulative = 0;
  const pick = Math.random() * totalWeight;

  for (const ev of eligible) {
    cumulative += ev.probability;
    if (pick <= cumulative) return ev;
  }

  // Fallback: devolver el último
  return eligible[eligible.length - 1];
}
