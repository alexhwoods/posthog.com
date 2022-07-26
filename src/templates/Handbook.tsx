import React from 'react'
import { SEO } from 'components/seo'
import { graphql } from 'gatsby'
import DocsLayout from 'components/Docs/Layout'
import { formatToc } from 'lib/utils'
import { handbook } from '../sidebars/sidebars.json'

export default function Handbook({ data: { post } }) {
    const {
        body,
        frontmatter,
        contributors,
        headings,
        fields: { slug },
    } = post
    const { title, hideAnchor, description, hideLastUpdated } = frontmatter
    const { parent, excerpt } = post
    const lastUpdated = parent?.fields?.gitLogLatestDate
    const filePath = `/${parent?.relativePath}`

    const tableOfContents = formatToc(headings)

    return (
        <DocsLayout
            title={title}
            filePath={filePath}
            lastUpdated={lastUpdated}
            menu={handbook}
            slug={slug}
            breadcrumbBase={{ name: 'Handbook', url: '/handbook' }}
            hideAnchor={hideAnchor}
            tableOfContents={tableOfContents}
            body={body}
            hideLastUpdated={hideLastUpdated}
            contributors={contributors}
        >
            <SEO
                title={`${title} - PostHog Handbook`}
                description={description || excerpt}
                article
                image={`/og-images/${slug.replace(/\//g, '')}.jpeg`}
            />
        </DocsLayout>
    )
}

export const query = graphql`
    query HandbookQuery($id: String!) {
        post: mdx(id: { eq: $id }) {
            id
            body
            excerpt(pruneLength: 150)
            fields {
                slug
            }
            headings {
                depth
                value
            }
            contributors {
                url
                username
                avatar {
                    childImageSharp {
                        gatsbyImageData(width: 37, placeholder: BLURRED)
                    }
                }
            }
            frontmatter {
                title
                hideAnchor
                description
                hideLastUpdated
                featuredImage {
                    publicURL
                }
            }
            parent {
                ... on File {
                    relativePath
                    fields {
                        gitLogLatestDate(formatString: "MMM D, YYYY")
                    }
                }
            }
        }
    }
`
