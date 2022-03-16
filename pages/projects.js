import Page from "@components/page"
import Entry from "@components/entry"

import data from "@data/projects.json"

const Projects = () => {
  return (
    <Page title="Projects" description="Collection of past and present work.">
      <article>
        {data.data.map((entry) => {
          return (
            <Entry
              key={entry.title}
              title={entry.title}
              description={entry.description}
              image={entry.image}
              href={entry.url}
              position={entry.position}
            />
          )
        })}
      </article>
    </Page>
  )
}

export default Projects
