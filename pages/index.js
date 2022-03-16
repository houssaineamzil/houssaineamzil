import Page from "@components/page"
import Link from "@components/link"

const About = () => {
  return (
    <Page description="Hi, I'm Høussaine. Frontend developer and designer, mechanical keyboard enthusiast, practicing minimalist, and trance lover in search of flow.">
      <article>
        <h1>Høussaine Amzil</h1>

        <p>
          A <b>self-taught</b> <b>Front End Developer</b> currently lives in{" "}
          <b>Kenetra, Morocco</b>. Pursuing a <b>Bac+2 degree</b> in{" "}
          <b>Graphic Design</b> at <b>OFPPT</b> (The Office for Vocational
          Training and Work Promotion).
          <br />
          Likes to make and explore <b>codes</b> and{" "}
          <Link underline href="/design">
            <b>designs</b>
          </Link>{" "}
          that are <b>minimalist</b>, <b>clean</b>, and have good{" "}
          <b>functionality</b>.
          Mostly spend his free time adding new things to his web stack and
          chasing his dream of becoming a <b>
            {" "}
            full-stack software engineer
          </b>{" "}
          and
          <b>entrepreneur</b>. Otherwise, he finds himself reading some{" "}
          <Link underline href="/reading">
            <b>books</b>
          </Link>{" "}
          about coding and business,{" "}
          <Link underline href="/blog">
            <b>writing</b>
          </Link>{" "}
          about code and design,watching anime, or just texting family and
          friends.
          <br />
        </p>
      </article>
    </Page>
  )
}

export default About
