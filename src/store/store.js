import { create } from 'zustand'

// Seed incidents for demo/offline mode
const SEED_INCIDENTS = [
  { id: 'seed1', type: 'flood', severity: 'critical', location: 'Pathanamthitta, Kerala', lat: 9.2648, lng: 76.7870, description: 'Rising floodwaters, 40+ families stranded', status: 'active', aiPriority: 95, respondersAssigned: 3, timestamp: new Date(Date.now() - 180000).toISOString() },
  { id: 'seed2', type: 'medical', severity: 'high', location: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480, description: 'Mass casualty event, 12 injured', status: 'active', aiPriority: 88, respondersAssigned: 2, timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: 'seed3', type: 'fire', severity: 'high', location: 'Nagpur, Maharashtra', lat: 21.1458, lng: 79.0882, description: 'Industrial fire, evacuation in progress', status: 'active', aiPriority: 82, respondersAssigned: 5, timestamp: new Date(Date.now() - 420000).toISOString() },
  { id: 'seed4', type: 'earthquake', severity: 'critical', location: 'Silchar, Assam', lat: 24.8333, lng: 92.7789, description: 'M4.2 tremors, building collapses reported', status: 'active', aiPriority: 91, respondersAssigned: 1, timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: 'seed5', type: 'flood', severity: 'medium', location: 'Bhopal, Madhya Pradesh', lat: 23.2599, lng: 77.4126, description: 'Low-lying areas waterlogged, minor injuries', status: 'resolved', aiPriority: 55, respondersAssigned: 4, timestamp: new Date(Date.now() - 900000).toISOString() },
  { id: 'seed6', type: 'medical', severity: 'medium', location: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567, description: 'Food poisoning outbreak, 8 affected', status: 'active', aiPriority: 67, respondersAssigned: 2, timestamp: new Date(Date.now() - 1200000).toISOString() },
]

const SEED_VOLUNTEERS = [
  { id: 'vol1', name: 'Arjun Sharma', location: 'Mumbai, MH', skills: ['Medical', 'Search & Rescue'], status: 'available', responseTime: '8 min', rating: 4.9 },
  { id: 'vol2', name: 'Priya Nair', location: 'Kochi, KL', skills: ['Flood Relief', 'First Aid'], status: 'deployed', responseTime: '12 min', rating: 4.8 },
  { id: 'vol3', name: 'Rahul Verma', location: 'Delhi, DL', skills: ['Logistics', 'Communication'], status: 'available', responseTime: '15 min', rating: 4.7 },
  { id: 'vol4', name: 'Sneha Reddy', location: 'Hyderabad, TS', skills: ['Medical', 'Counseling'], status: 'available', responseTime: '6 min', rating: 5.0 },
]

export const useStore = create((set, get) => ({
  incidents: SEED_INCIDENTS,
  volunteers: SEED_VOLUNTEERS,
  selectedIncident: null,
  mapStyle: 'dark',
  networkStatus: 'online',
  stats: { activeIncidents: 47, volunteersOnline: 312, livesHelped: 14200, avgResponseTime: 47 },

  addIncident: (incident) => set(state => ({
    incidents: [incident, ...state.incidents],
    stats: { ...state.stats, activeIncidents: state.stats.activeIncidents + 1 }
  })),

  setSelectedIncident: (incident) => set({ selectedIncident: incident }),

  updateIncidentStatus: (id, status) => set(state => ({
    incidents: state.incidents.map(i => i.id === id ? { ...i, status } : i)
  })),

  setNetworkStatus: (status) => set({ networkStatus: status }),

  incrementLivesHelped: () => set(state => ({
    stats: { ...state.stats, livesHelped: state.stats.livesHelped + 1 }
  })),
}))
