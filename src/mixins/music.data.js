import music from '@/services/music'

export default {
  methods: {
    async data_update(){
      this.dat = await music.get(this.current);
    },
    async data_next(){
      return await music.next(this.current)
    },
    async data_previous(){
      return await music.previous(this.current)
    }
  }
}