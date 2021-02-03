import {useApollo} from '@/api/apolloConfig'
import '@/styles/index.css'
import '@/styles/demo.css'
import {ApolloProvider} from '@apollo/client'
import {DefaultSeo} from 'next-seo'
import Error from 'next/error'
import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import AlgoliaProvider from '@/components/common/AlgoliaProvider'
import MenuProvider from '@/components/common/MenuProvider'
import {useRouter} from 'next/router'

/**
 * Render the App component.
 *
 * @author WebDevStudios
 * @param {object}  props           The component attributes as props.
 * @param {object}  props.Component Page component to display.
 * @param {boolean} props.pageProps Page component props.
 * @return {Element} The App component.
 */
export default function App({Component, pageProps}) {
  /**
   * Wrap the app in the ApolloProvider component.
   *
   * @see https://www.apollographql.com/docs/react/api/react/hooks/#the-apolloprovider-component
   */
  const apolloClient = useApollo(pageProps)

  const router = useRouter()

  // Redirect from WP blog archive to FE posts archive.
  useEffect(() => {
    if (!pageProps?.post?.isPostsPage) {
      return
    }

    router.push('/blog')
  }, [pageProps, router])

  // Check for errors.
  const error = pageProps?.error
  let errorMessage = pageProps?.errorMessage ?? 'An unknown error occurred.'
  // Trim trailing period - added via Error component.
  errorMessage = errorMessage.replace(/\.$/g, '')

  // Initialize Algolia state for context provider.
  const [algolia] = useState({
    indexName: pageProps?.algolia?.indexName
  })

  // Extract specific props from page props.
  const {
    defaultSeo: {social, ...defaultSeoData} = {},
    menus,
    preview,
    ...passThruProps
  } = pageProps

  const componentProps = {
    ...passThruProps,
    post: {
      ...passThruProps?.post,
      seo: {
        ...passThruProps?.post?.seo,
        siteTitle: defaultSeoData?.openGraph?.siteName,
        siteDescription: defaultSeoData?.description,
        social
      }
    }
  }

  // Initialize state for Menu context provider.
  const [navMenus] = useState({
    menus
  })

  return (
    <ApolloProvider client={apolloClient}>
      <AlgoliaProvider value={algolia}>
        <MenuProvider value={navMenus}>
          {error ? (
            <Error statusCode={500} title={errorMessage} />
          ) : (
            <>
              {!!defaultSeoData && <DefaultSeo {...defaultSeoData} />}
              {!!preview && (
                // TODO -- abstract this to a component.
                <p>
                  This page is a preview.{' '}
                  <a href="/api/exit-preview">Click here</a> to exit preview
                  mode.
                </p>
              )}
              <Component {...componentProps} />
            </>
          )}
        </MenuProvider>
      </AlgoliaProvider>
    </ApolloProvider>
  )
}

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired
}
