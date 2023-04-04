import projects from '@/services/project'

export default {
  data() {
    return {
      projectFilter: ''
    }
  },
  computed: {
    projectData() {
      let d = []
      projects.list().map(el => d.push({id: el, ...projects.get(el)}))
      d = d.filter(el => this.filterProjet(el))
      return d
    }
  },
  methods: {
    filterProjet(p){
      let success = false
      p.title.toLowerCase().includes(this.projectFilter.toLowerCase()) ? success = true : 0
      p.description.toLowerCase().includes(this.projectFilter.toLowerCase()) ? success = true : 0
      p.job.toLowerCase().includes(this.projectFilter.toLowerCase()) ? success = true : 0
      p.technologies.forEach(t => t.toLowerCase().includes(this.projectFilter.toLowerCase()) ? success = true : 0)
      return success
    }
  },
}