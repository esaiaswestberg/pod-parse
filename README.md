# Pod-Parse

```typescript
import { parseStr } from 'pod-parse'

const response = await fetch('[...]')
const rssFeed = await response.text()

const podcastFeed = parseStr(rssFeed)

console.log(`Podcast title: ${podcastFeed.details.title}`)
console.log(`Podcast description: ${podcastFeed.details.description}`)
console.log(`Podcast image: ${podcastFeed.details.image.url}`)
console.log(`Podcast episodes: ${podcastFeed.episodes.length}`)

const firstEpisode = podcastFeed.episodes[0]
console.log(`First episode title: ${firstEpisode.title}`)
console.log(`First episode description: ${firstEpisode.description}`)
console.log(`First episode audio: ${firstEpisode.audio.url}`)
console.log(`First episode image: ${firstEpisode.image.url}`)
console.log(`First episode duration: ${firstEpisode.duration}`)
console.log(`First episode published: ${firstEpisode.published}`)
console.log(`First episode guid: ${firstEpisode.guid}`)
```