import Audio from './Audio'
import Duration from './Duration'
import Image from './Image'

type PodcastEpisode = {
  title: string
  description: string
  published: Date
  audio: Audio[]
  duration: Duration
  guid: string
  images: Image[]
}

export default PodcastEpisode
