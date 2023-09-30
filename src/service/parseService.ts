import xml2js from 'xml2js'
import Audio from '../types/Audio'
import Duration from '../types/Duration'
import Image from '../types/Image'
import PodcastDetails from '../types/PodcastDetails'
import PodcastEpisode from '../types/PodcastEpisode'
import PodcastFeed from '../types/PodcastFeed'

export default class ParseService {
  private static parser = new xml2js.Parser()

  /**
   * Parses a podcast feed from an XML string.
   *
   * @param rssFeedXml Podcast RSS feed as an XML string.
   * @returns PodcastFeed object.
   * @throws Error if the XML string is invalid.
   */
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
    const title = this.getPathValue(feedObject, ['rss', 'channel', 0, 'title', 0])
    const itunesTitle = this.getPathValue(feedObject, ['rss', 'channel', 0, 'itunes:title', 0])

    const result = this.getFirstDefinedValueWithType<string>(['string'], title, itunesTitle)
    return result || '[NO_TITLE_FOUND]'
  }

  private static parsePodcastDescription(feedObject: any): string {
    const description = this.getPathValue(feedObject, ['rss', 'channel', 0, 'description', 0])
    const itunesSummary = this.getPathValue(feedObject, ['rss', 'channel', 0, 'itunes:summary', 0])

    const result = this.getFirstDefinedValueWithType<string>(['string'], description, itunesSummary)
    return result || '[NO_DESCRIPTION_FOUND]'
  }

  private static parsePodcastImage(feedObject: any): Image[] {
    const imageUrl = this.getPathValue(feedObject, ['rss', 'channel', 0, 'image', 0, 'url', 0])
    const itunesImage = this.getPathValue(feedObject, ['rss', 'channel', 0, 'itunes:image', 0, '$', 'href'])

    const image = this.getFirstDefinedValueWithType<string>(['string'], imageUrl, itunesImage)
    return [{ url: image ?? 'https://placehold.co/400' }]
  }

  private static parseEpisodeTitle(episodeObject: any): string {
    const title = this.getPathValue(episodeObject, ['title', 0])
    const itunesTitle = this.getPathValue(episodeObject, ['itunes:title', 0])

    const result = this.getFirstDefinedValueWithType<string>(['string'], title, itunesTitle)
    return result || '[NO_TITLE_FOUND]'
  }

  private static parseEpisodeDescription(episodeObject: any): string {
    const description = this.getPathValue(episodeObject, ['description', 0])
    const itunesSummary = this.getPathValue(episodeObject, ['itunes:summary', 0])

    const result = this.getFirstDefinedValueWithType<string>(['string'], description, itunesSummary)
    return result || '[NO_DESCRIPTION_FOUND]'
  }

  private static parseEpisodeImage(episodeObject: any): Image[] {
    const imageUrl = this.getPathValue(episodeObject, ['image', 0, 'url', 0])
    const itunesImage = this.getPathValue(episodeObject, ['itunes:image', 0, '$', 'href'])

    const image = this.getFirstDefinedValueWithType<string>(['string'], imageUrl, itunesImage)
    if (image) return [{ url: image }]

    return []
  }

  private static parseEpisodeAudio(episodeObject: any): Audio[] {
    const audioUrl = this.getPathValue(episodeObject, ['enclosure', 0, '$', 'url'])

    const audio = this.getFirstDefinedValueWithType<string>(['string'], audioUrl)
    if (audio) return [{ url: audio }]
    return []
  }

  private static parseEpisodePublicationDate(episodeObject: any): Date {
    const date = this.getPathValue(episodeObject, ['pubDate', 0])

    const result = this.getFirstDefinedValueWithType<string>(['string'], date)
    if (result) return new Date(result)

    return new Date(1970, 1, 1, 0, 0, 0, 0)
  }

  private static parseEpisodeDuration(episodeObject: any): Duration {
    const duration = this.getPathValue(episodeObject, ['duration', 0])
    const itunesDuration = this.getPathValue(episodeObject, ['itunes:duration', 0])

    const result = this.getFirstDefinedValueWithType<string>(['string', 'number'], duration, itunesDuration)
    if (typeof result === 'number') return result

    // HH:MM:SS or MM:SS
    if (typeof result === 'string') {
      const parts = result.split(':').reverse()
      const [seconds, minutes, hours] = parts.map((part) => parseFloat(part))

      return {
        totalSeconds: seconds + (minutes ?? 0) * 60 + (hours ?? 0) * 60 * 60
      }
    }

    return {
      totalSeconds: 0
    }
  }

  private static parseEpisodeGuid(episodeObject: any): string {
    const guid1 = this.getPathValue(episodeObject, ['guid', 0, '_'])
    const guid2 = this.getPathValue(episodeObject, ['guid', 0])

    const result = this.getFirstDefinedValueWithType<string>(['string'], guid1, guid2)
    return result || '[NO_GUID_FOUND]'
  }

  private static getPathValue(object: any, path: (string | number)[]): any {
    let value = object
    for (const key of path) {
      if (!value) return undefined
      value = value[key]
    }

    return value
  }

  private static getFirstDefinedValueWithType<T>(types: string[], ...values: any[]): T | undefined {
    return values.find((value) => {
      if (!value) return false
      if (typeof value === 'object') return false

      const type = typeof value
      return types.includes(type)
    })
  }
}
