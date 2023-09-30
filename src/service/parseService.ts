import xml2js from 'xml2js'
import { z } from 'zod'
import Audio from '../types/Audio'
import Image from '../types/Image'
import PodcastDetails from '../types/PodcastDetails'
import PodcastEpisode from '../types/PodcastEpisode'
import PodcastFeed from '../types/PodcastFeed'

export default class ParseService {
  private static parser = new xml2js.Parser()

  public static async parseStr(rssFeedXml: string): Promise<PodcastFeed> {
    return new Promise(async (resolve) => {
      const feedObject = await this.parser.parseStringPromise(rssFeedXml)

      resolve({
        details: this.parsePodcastDetails(feedObject),
        episodes: this.parsePodcastEpisodes(feedObject)
      })
    })
  }

  private static parsePodcastDetails(feedObject: object): PodcastDetails {
    return {
      title: this.parsePodcastTitle(feedObject),
      description: this.parsePodcastDescription(feedObject),
      images: this.parsePodcastImage(feedObject)
    }
  }

  private static parsePodcastEpisodes(feedObject: any): PodcastEpisode[] {
    const episodeItems = feedObject.rss.channel[0].item
    if (!episodeItems) return []
    if (!Array.isArray(episodeItems)) return [this.parsePodcastEpisode(episodeItems)]

    const episodes = episodeItems.map((item) => this.parsePodcastEpisode(item))
    episodes.sort((a, b) => a.published.getTime() - b.published.getTime())

    return episodes
  }

  private static parsePodcastEpisode(episodeObject: object): PodcastEpisode {
    return {
      title: this.parseEpisodeTitle(episodeObject),
      description: this.parseEpisodeDescription(episodeObject),
      images: this.parseEpisodeImage(episodeObject),
      audio: this.parseEpisodeAudio(episodeObject),
      published: this.parseEpisodePublicationDate(episodeObject),
      guid: this.parseEpisodeGuid(episodeObject),
      duration: this.parseEpisodeDuration(episodeObject)
    }
  }

  private static parsePodcastTitle(feedObject: any): string {
    const title = feedObject.rss.channel[0].title[0]
    if (typeof title === 'string') return title
    return '[NO_TITLE_FOUND]'
  }

  private static parsePodcastDescription(feedObject: any): string {
    const description = feedObject.rss.channel[0].description[0]
    if (typeof description === 'string') return description
    return '[NO_DESCRIPTION_FOUND]'
  }

  private static parsePodcastImage(feedObject: any): Image[] {
    const image = feedObject.rss.channel[0].image
    if (typeof image === 'object' && image.url) return [{ url: image.url }]

    if (Array.isArray(image)) {
      const images = image.filter((i) => i.url)
      return images.map((i) => ({ url: i.url }))
    }

    return [{ url: 'https://placehold.co/400' }]
  }

  private static parseEpisodeTitle(episodeObject: any): string {
    const title = episodeObject.title[0]
    if (typeof title === 'string') return title
    return '[NO_TITLE_FOUND]'
  }

  private static parseEpisodeDescription(episodeObject: any): string {
    const description = episodeObject.description[0]
    if (typeof description === 'string') return description
    return '[NO_DESCRIPTION_FOUND]'
  }

  private static parseEpisodeImage(episodeObject: any): Image[] {
    const image = episodeObject.image

    if (typeof image === 'string') return [{ url: image }]
    if (typeof image === 'object' && image.url) return [{ url: image.url }]

    if (Array.isArray(image)) {
      const images = image.filter((i) => i.url)
      return images.map((i) => ({ url: i.url }))
    }

    return []
  }

  private static parseEpisodeAudio(episodeObject: any): Audio[] {
    return episodeObject.enclosure.map(({ $: audio }) => {
      if (typeof audio === 'string') return { url: audio }
      if (typeof audio.url === 'string') return { url: audio.url }
    })
  }

  private static parseEpisodePublicationDate(episodeObject: any): Date {
    const date = episodeObject.pubDate[0]
    if (typeof date === 'string') return new Date(date)

    return new Date(1970, 1, 1, 0, 0, 0, 0)
  }

  private static parseEpisodeDuration(episodeObject: any): number {
    const itunesDuration = parseFloat(episodeObject['itunes:duration'][0])
    if (z.number().safeParse(itunesDuration).success) return itunesDuration

    return 0
  }

  private static parseEpisodeGuid(episodeObject: any): string {
    const guid = episodeObject.guid[0]['_']
    if (typeof guid === 'string') return guid

    return '[NO_GUID_FOUND]'
  }
}
