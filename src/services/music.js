export default {
  data : {
    billy: {
      title: "Billy Talent - Red Flag",
      link: "https://open.spotify.com/track/2RZWdE8kYPlCAcRUYDeuLC?si=IsjrJGDNQRStovVBo12vTQ"
    },
    bowie: {
      title: "David Bowie - Space oddity",
      link: "https://open.spotify.com/track/72Z17vmmeQKAg8bptWvpVG?si=5S65LSkMRES-VXvHYHw_lg"
    },
    paparoach: {
      title: "Papa Roach - Last resort",
      link: "https://open.spotify.com/track/5W8YXBz9MTIDyrpYaCg2Ky?si=9R_LEhYaTIypgkNnHw3FrA"
    },
    sum41: {
      title: "Sum 41 - In too deep",
      link: "https://open.spotify.com/track/1HNE2PX70ztbEl6MLxrpNL?si=jKgDrHD4TiCobUrAPP3VHw"
    },
    thepolice: {
      title: "The Police - Roxanne",
      link: "https://open.spotify.com/track/3EYOJ48Et32uATr9ZmLnAo?si=Jc-MGNVoR6a5kSgzh5bBNA"
    },
    thewhitestripes: {
      title: "The White Stripes - Fell in love with a girl",
      link: "https://open.spotify.com/track/1yjr0GeoqGPejLg5P9g8Qe?si=JjJp_Vh1SOW9SIbAYughGg"
    },
  },
  get(id){
    if(this.data[id]){
      let t = this.data[id]
      t.id = id
      return t
    }else{
      return null
    }
  },
  list(){
    return Object.keys(this.data)
  },
  previous(id){
    let index = this.list().indexOf(id)
    if(index == 0) index = this.list().length - 1
    else index -= 1
    let newId = this.list()[index]
    return this.get(newId)
  },
  next(id){
    let index = this.list().indexOf(id)
    if(index == this.list().length - 1) index = 0
    else index += 1
    let newId = this.list()[index]
    return this.get(newId)
  }
}