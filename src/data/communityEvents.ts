import type { CommunityEvent } from '../types/game';

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'community_feast',
    title: 'Banquete Comunitario',
    description: 'La Red de Supervivientes organiza un banquete. Todos comparten lo que tienen.',
    icon: '🍲',
    minWeek: 2,
    karmaMin: 2,
    factionRepMin: { survivors: 2 },
    choices: [
      {
        label: 'Contribuir generosamente',
        description: 'Aportas 5 de comida y 3 de agua. La comunidad te lo agradece con recursos variados.',
        effect: { food: -5, water: -3 },
        karmaChange: 3,
        factionChanges: { survivors: 3 },
      },
      {
        label: 'Compartir lo justo',
        description: 'Aportas 3 de comida. Todos comparten contigo.',
        effect: { food: -3 },
        karmaChange: 2,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Comer sin aportar',
        description: 'Aceptas comida pero no pones nada. Algunos te miran mal.',
        effect: { food: 2 },
        karmaChange: -1,
        factionChanges: { survivors: -1 },
      },
    ],
  },
  {
    id: 'trade_fair',
    title: 'Feria de Trueque',
    description: 'El Gremio de Mercaderes monta una feria improvisada. Todos intercambian.',
    icon: '🏪',
    minWeek: 3,
    karmaMin: 0,
    factionRepMin: { merchants: 2 },
    choices: [
      {
        label: 'Invertir fuerte',
        description: 'Gastas 4 materiales para conseguir suministros valiosos.',
        effect: { materials: -4, food: 2, medicine: 2, fuel: 1 },
        karmaChange: 1,
        factionChanges: { merchants: 2 },
      },
      {
        label: 'Intercambio moderado',
        description: 'Cambias 2 materiales por 3 de comida.',
        effect: { materials: -2, food: 3 },
        karmaChange: 0,
        factionChanges: { merchants: 1 },
      },
      {
        label: 'Observar sin participar',
        description: 'Miras los puestos pero no compras nada.',
        effect: {},
        karmaChange: 0,
        factionChanges: {},
      },
    ],
  },
  {
    id: 'military_patrol',
    title: 'Patrulla Militar',
    description: 'El Remanente Militar patrulla la zona. Buscan voluntarios para una misión de reconocimiento.',
    icon: '🪖',
    minWeek: 3,
    karmaMin: -2,
    factionRepMin: { military: 2 },
    choices: [
      {
        label: 'Voluntario',
        description: 'Te unes a la patrulla. Encuentran suministros que comparten contigo.',
        effect: { food: -1, fuel: 2, materials: 2, medicine: 1 },
        karmaChange: 1,
        factionChanges: { military: 3 },
      },
      {
        label: 'Dar información',
        description: 'Compartes lo que sabes de la zona sin arriesgarte.',
        effect: {},
        karmaChange: 0,
        factionChanges: { military: 1 },
      },
      {
        label: 'Esquivarlos',
        description: 'No quieres problemas con los militares.',
        effect: {},
        karmaChange: 0,
        factionChanges: { military: -1 },
      },
    ],
  },
  {
    id: 'outlaw_raid',
    title: 'Redada de Forajidos',
    description: 'Los Forajidos del Yermo planean un golpe a un almacén. Te invitan a participar.',
    icon: '💀',
    minWeek: 3,
    karmaMax: 0,
    factionRepMin: { outlaws: 2 },
    choices: [
      {
        label: 'Unirte al golpe',
        description: 'Participas en el saqueo. Consigues un buen botín, pero tu karma sufre.',
        effect: { food: 3, materials: 3, fuel: 1 },
        karmaChange: -3,
        factionChanges: { outlaws: 3, survivors: -1 },
      },
      {
        label: 'Hacer de vigía',
        description: 'Vigilas mientras ellos actúan. Menos botín, menos culpa.',
        effect: { materials: 2 },
        karmaChange: -1,
        factionChanges: { outlaws: 1 },
      },
      {
        label: 'Alertar a las víctimas',
        description: 'Avisas a los dueños del almacén. Los forajidos fracasan pero tú ganas respeto.',
        effect: {},
        karmaChange: 3,
        factionChanges: { outlaws: -2, survivors: 2 },
      },
    ],
  },
  {
    id: 'community_defense',
    title: 'Defensa de la Comunidad',
    description: 'Un grupo de saqueadores amenaza el campamento de supervivientes. Necesitan ayuda para defenderlo.',
    icon: '🛡️',
    minWeek: 4,
    karmaMin: 3,
    factionRepMin: { survivors: 3 },
    choices: [
      {
        label: 'Liderar la defensa',
        description: 'Organizas la defensa. Los saqueadores huyen. La comunidad te venera.',
        effect: { materials: -2 },
        karmaChange: 4,
        factionChanges: { survivors: 4, outlaws: -2 },
        companionJoinId: 'teacher_guard',
      },
      {
        label: 'Reforzar barricadas',
        description: 'Ayudas con materiales para las defensas.',
        effect: { materials: -3 },
        karmaChange: 2,
        factionChanges: { survivors: 2 },
      },
      {
        label: 'No involucrarte',
        description: 'Es demasiado peligroso. Rezas para que sobrevivan.',
        effect: {},
        karmaChange: -2,
        factionChanges: { survivors: -2 },
      },
    ],
  },
  {
    id: 'election',
    title: 'Elecciones del Campamento',
    description: 'Los supervivientes van a elegir un líder para el campamento central. Te piden que te postules.',
    icon: '🗳️',
    minWeek: 5,
    karmaMin: 5,
    choices: [
      {
        label: 'Postularte como líder',
        description: 'Aceptas liderar. Obtienes acceso a recursos de la comunidad semanalmente.',
        effect: {},
        karmaChange: 2,
        factionChanges: { survivors: 3, merchants: 1, military: 1 },
      },
      {
        label: 'Apoyar a otro candidato',
        description: 'Respaldas a la voluntaria María. Ella te recompensa.',
        effect: { food: 5, water: 3 },
        karmaChange: 1,
        factionChanges: { survivors: 1 },
      },
      {
        label: 'Abstenerse',
        description: 'La política no es lo tuyo en estos tiempos.',
        effect: {},
        karmaChange: 0,
        factionChanges: {},
      },
    ],
  },
];

export function getCommunityEvent(id: string): CommunityEvent | undefined {
  return COMMUNITY_EVENTS.find((e) => e.id === id);
}

export function getAvailableCommunityEvent(
  currentWeek: number,
  karma: number,
  factionReputation: Record<string, number>,
  alreadyPlayed: string[]
): CommunityEvent | null {
  const eligible = COMMUNITY_EVENTS.filter((ev) => {
    if (ev.minWeek > currentWeek) return false;
    if (alreadyPlayed.includes(ev.id)) return false;
    if (ev.karmaMin !== undefined && karma < ev.karmaMin) return false;
    if (ev.karmaMax !== undefined && karma > ev.karmaMax) return false;
    if (ev.factionRepMin) {
      for (const [factionId, min] of Object.entries(ev.factionRepMin)) {
        if ((factionReputation[factionId] ?? 0) < min) return false;
      }
    }
    return true;
  });

  if (eligible.length === 0) return null;

  // Solo ocurre con cierta probabilidad
  if (Math.random() > 0.5) return null;

  return eligible[Math.floor(Math.random() * eligible.length)];
}
