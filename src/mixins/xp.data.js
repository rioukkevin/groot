import xps from '@/services/experiences'

export default {
  mounted () {
    this.xps = xps.data;
  },
}