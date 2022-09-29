import { GetStaticProps, InferGetStaticPropsType } from "next"
import Image from "next/future/image"
import Link from "next/link"
import { Hero } from "../components/Hero"
// import Layout from "../components/layout"
import { Seo } from "../components/SEO"
import { BaseLayout } from "../layouts/BaseLayout"
import { ssgDefault } from "../utils/ssgDefault"
import { trpc } from "../utils/trpc"
import { NextPageWithLayout } from "./_app"

export const getStaticProps: GetStaticProps = async () => {
  const ssg = await ssgDefault()

  await ssg.fetchQuery("blog.getAll", {})
  await ssg.fetchQuery("page.homepage")
  await ssg.fetchQuery("mixed.all")

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 60 * 10,
  }
}

const Home: NextPageWithLayout = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  // const { data, status } = useSession()
  const { data: page, error, isFetching } = trpc.useQuery(["page.homepage"])
  // const {
  //   data: blogPosts,
  //   error: blogError,
  //   isFetching: blogFetching,
  // } = trpc.useQuery(["blog.getAll", {}])

  const { data: all } = trpc.useQuery(["mixed.all"])
  console.log(all)

  // const { seo, hero,  } = page

  return (
    <>
      <Seo seo={page?.seo} />
      <Hero hero={page?.hero} />

      <div className="uk-section">
        <article
          className="prose prose-slate mx-auto text-2xl font-semibold"
          dangerouslySetInnerHTML={{ __html: page?.body ?? "" }}
        />
        <div className="grid grid-cols-12 gap-1 md:grid-cols-12">
          <div className="col-span-3" />
          {all?.map((post, idx) => (
            <div
              key={post.id}
              className={`${
                idx === 0
                  ? "col-span-9 h-[48rem]"
                  : (idx + 1) % 4 === 0
                  ? (idx + 1) % 8 === 0
                    ? "col-span-4 row-span-2 h-[48rem]"
                    : "col-span-8 h-96"
                  : "col-span-4 row-start-auto h-96"
              } card-shadow group relative flex flex-col justify-end overflow-clip text-white`}
            >
              {post.image.url ? (
                <Image
                  src={post.image?.url}
                  width={post.image?.width}
                  height={post.image?.height}
                  alt={post.image.alt!}
                  className="absolute h-full bg-white object-cover"
                />
              ) : (
                <div className="absolute flex h-full w-full items-center justify-center bg-orange-500 object-cover text-8xl font-bold capitalize">
                  {post.title.at(1)}
                </div>
              )}
              <Link
                href={post.type === "article" ? post.url : `/blog/${post.url}`}
                className="link-overlay flex h-full flex-col justify-between"
              >
                <div className="relative flex w-full justify-end text-white">
                  <h3 className="p-4 text-4xl font-bold uppercase">
                    {post.category?.replace(/\b(\w)\w+\s?-?/g, "$1")}
                  </h3>
                </div>
                <div className="relative flex flex-col p-2 backdrop-blur-sm">
                  <h2 className="relative">
                    <span className="cia box-border inline bg-black box-decoration-clone py-1 px-4 text-xl font-bold text-white">
                      {post.title}
                    </span>
                  </h2>
                  <span className="relative max-h-[50%] overflow-hidden text-ellipsis px-4 py-2 text-white">
                    <span className="sr-only">{post.excerpt}</span>
                    {post.excerpt?.slice(0, 100)}
                  </span>
                  <span>
                    {post.type === "article" ? (
                      <div>
                        {post.team?.map((author) => (
                          <span key={author}>{author}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="relative h-12">
                        {post.team?.map((author, idx) =>
                          author.img.url ? (
                            <Image
                              key={author?.lastName}
                              className={`absolute top-0 rounded-full shadow-md shadow-white z-[${idx}] ml-${
                                idx * 2
                              }]`}
                              src={author.img.url}
                              width={50}
                              height={50}
                              alt={author.lastName}
                              style={{
                                zIndex: idx,
                                marginLeft: `${idx * 2}rem`,
                              }}
                            />
                          ) : (
                            <span
                              key={author.lastName}
                              className="dark:orange-500 absolute  top-0 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-black text-white shadow shadow-white"
                              style={{
                                zIndex: idx,
                                marginLeft: `${idx * 2}rem`,
                              }}
                            >
                              {author.lastName.slice(0, 1)}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home

Home.getLayout = (page) => <BaseLayout>{page}</BaseLayout>
