import Page from "@components/page"
import Entry from "@components/entry"

// Data
import data from "@data/music.json"

const Music = () => {
  return (
    <Page title="Music" description="Collection of exemplary electronic music.">
      <article>
        {data.data.map((entry) => {
          return (
            <Entry
              key={entry.title}
              title={entry.title}
              image={entry.image}
              href={entry.url}
              description={entry.description}
            />
          )
        })}
      </article>
    </Page>
  )
}

export default Music
