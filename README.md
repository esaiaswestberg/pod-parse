# Pod-Parse

```typescript
// CommonJS
const { parseStr } = require('pod-parse')

// ESM (Node.js) & TypeScript
import { parseStr } from 'pod-parse'

const response = await fetch('[...]')
const rssFeed = await response.text()

const podcastFeed = parseStr(rssFeed)
```

### Output Object

```json
{
  "details": {
    "title": "My Podcast Title",
    "description": "This is a placeholder description for my podcast.",
    "images": [
      {
        "url": "http://www.example.com/podcast-cover.jpg"
      }
    ]
  },
  "episodes": [
    {
      "title": "Episode 1: Introduction",
      "description": "This is a placeholder summary for Episode 1.",
      "images": [],
      "audio": [
        {
          "url": "http://www.example.com/episode1.mp3"
        }
      ],
      "published": "2023-01-01T00:00:00.000Z",
      "guid": "http://www.example.com/episode1",
      "duration": {
        "totalSeconds": 930
      }
    }
  ]
}
```

### Input String

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title>My Podcast Title</title>
    <link>http://www.example.com/podcast</link>
    <description>This is a placeholder description for my podcast.</description>
    <language>en-us</language>
    <itunes:author>John Doe</itunes:author>
    <itunes:subtitle>Placeholder subtitle for the podcast</itunes:subtitle>
    <itunes:summary>This is a placeholder summary for the podcast.</itunes:summary>
    <itunes:owner>
      <itunes:name>John Doe</itunes:name>
      <itunes:email>john@example.com</itunes:email>
    </itunes:owner>
    <itunes:image href="http://www.example.com/podcast-cover.jpg" />
    <itunes:category text="Technology">
      <itunes:category text="Gadgets" />
    </itunes:category>
    <itunes:explicit>no</itunes:explicit>

    <item>
      <title>Episode 1: Introduction</title>
      <itunes:author>John Doe</itunes:author>
      <itunes:subtitle>Placeholder subtitle for Episode 1</itunes:subtitle>
      <itunes:summary>This is a placeholder summary for Episode 1.</itunes:summary>
      <enclosure url="http://www.example.com/episode1.mp3" length="12345678" type="audio/mpeg" />
      <guid>http://www.example.com/episode1</guid>
      <pubDate>Thu, 01 Jan 2023 00:00:00 GMT</pubDate>
      <itunes:duration>15:30</itunes:duration>
    </item>
  </channel>
</rss>
```
