import Audio from './Audio'
import Image from './Image'

type PodcastEpisode = {
  title: string
  description: string
  published: Date
  audio: Audio[]
  duration: number
  guid: string
  images: Image[]
}

export default PodcastEpisode
