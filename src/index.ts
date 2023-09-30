import ParseService from './service/parseService'
import type Audio from './types/Audio.d'
import type Duration from './types/Duration.d'
import type Image from './types/Image.d'
import type PodcastDetails from './types/PodcastDetails.d'
import type PodcastEpisode from './types/PodcastEpisode.d'
import type PodcastFeed from './types/PodcastFeed.d'

export const parseStr = (str: string) => ParseService.parseStr(str)

export type { Audio, Duration, Image, PodcastDetails, PodcastEpisode, PodcastFeed }
