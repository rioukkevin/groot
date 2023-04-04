// component register
import VLazyImage from "v-lazy-image"
// Homemade
import KTile from './core/Tile'
import KDetail from './core/Detail'
import KCarousel from './core/Carousel'
import KCursor from './core/Cursor'

import KLogo from './common/Logo'
import KVCard from './common/VCard'

import KFooter from './data/Footer'
import KWho from './data/Who'
import KProject from './data/Project'
import KProjectList from './data/Projects'
import KMusic from './data/Music'
import KPalette from './data/Palette'
import KXp from './data/Xp'


export default async function (Vue) {
  // HomeMade
  Vue.component('k-img', VLazyImage)
  Vue.component('k-tile', KTile)
  Vue.component('k-cursor', KCursor)
  Vue.component('k-detail', KDetail)
  Vue.component('k-carousel', KCarousel)
  Vue.component('k-logo', KLogo)
  Vue.component('k-vcard', KVCard)

  Vue.component('k-xp', KXp)
  Vue.component('k-footer', KFooter)
  Vue.component('k-who', KWho)
  Vue.component('k-project', KProject)
  Vue.component('k-project-list', KProjectList)
  Vue.component('k-music', KMusic)
  Vue.component('k-palette', KPalette)
}