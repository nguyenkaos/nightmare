const Nightmare = require('nightmare')
const { send } = require('micro')
const ms = require('ms')
const pMemoize = require('p-memoize')

const fetchPageTitle = async (url) => {
  const nightmare = new Nightmare()

  console.log('Navigating...')
  await nightmare.goto(url)
  console.log('Page loaded!')

  const title = await nightmare.title()

  await nightmare.end()

  return title
}

// memoize so we don't open 1 browser per request
const getTitle = pMemoize(fetchPageTitle, { maxAge: ms('1h') })

module.exports = async (req, res) => {
  if (req.url !== '/') {
    send(res, 404, '404 Not found')
    return
  }

  try {
    const url = 'https://zeit.co/'
    const title = await getTitle(url)
    send(res, 200, { title, url })
  } catch (error) {
    console.error('Error getting title', error)
    send(res, 500, 'Error getting title, see logs for more info')
  }
}
