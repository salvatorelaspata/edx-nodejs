#!/usr/bin/env node
import got from 'got'
import minimist from 'minimist'
import commist from 'commist'
import enquirer from 'enquirer'
import chalk from 'chalk'
import ansiEsc from 'ansi-escapes'

const API = 'http://localhost:3000'

const categories = ['confectionery', 'electronics']

const usage = (msg = 'Back office for My App') => {
  console.log(`${msg}`)
  console.log('add:')
  console.log('  order: 5-cli add order <id> --amount=<int> --api=<string>')
  console.log('         5-cli add order <id> -n=<int> --api=<string>\n')
  console.log('list:')
  console.log('  cats:  5-cli list cats')
  console.log('  ids:   5-cli list ids --cat=<string> --api=<string>')
  console.log('  ids:   5-cli list ids -c=<string> --api=<string>')
  console.log('\n-=interactive mode=-\n')
  console.log('run: 5-cli')
  console.log('run: 5-cli --api {API_URL}')
  console.log('\n-=help=-\n')
  console.log('run: 5-cli --help')
  console.log('run: 5-cli -h\n')
}

const noMatches = commist()
  .register('add order', addOrder)
  .register('list cats', listCats)
  .register('list ids', listIds)
  .parse(process.argv.slice(2))

if (noMatches) {
  const args = minimist(process.argv.slice(2), {
    boolean: ['help'],
    alias: { help: 'h' },
    string: ['api'],
    default: { api: API },
  })
  const { api, help } = args
  if (help) {
    usage()
    process.exit()
  }
  try {
    await tui(api)
  } catch (err) {
    const cancelled = err === ''
    if (cancelled === false) {
      console.log(err.message)
      process.exit(1)
    }
  }
}

async function tui(api) {
  const { category } = await enquirer.prompt({
    type: 'autocomplete',
    name: 'category',
    message: 'Category',
    choices: categories,
  })
  let products = await got(`${api}/${category}`).json()
  let quit = false
  while (true) {
    for (const { name, rrp, info } of products) {
      console.log(chalk.bold(`${name}`), `${rrp}`, `${info}`)
    }
    const form = new enquirer.Form({
      message: 'Add',
      hint: `Press Ctrl+Q to change category`,
      validate(values) {
        const { name, rrp, info } = values
        if (!name || !rrp || !info) return 'All fields are required'
        if (Number.isFinite(Number(rrp)) === false)
          return 'RRP should be a number'
        return true
      },
      choices: [
        { name: 'name', message: 'Name' },
        { name: 'rrp', message: 'RRP' },
        { name: 'info', message: 'Info' },
      ],
    })
    form.on('keypress', (_, { ctrl, name }) => {
      if (ctrl && name === 'q') {
        form.cancel()
        quit = true
      }
    })
    let add = null
    try {
      add = await form.run()
    } catch (err) {
      if (quit) {
        console.log(ansiEsc.clearTerminal)
        return tui(api)
      }
      throw err
    }
    products = await got.post(`${api}/${category}`, { json: add }).json()
    console.log(ansiEsc.clearTerminal)

    console.log(
      chalk.green('✔'),
      chalk.bold('Category'),
      chalk.dim('·'),
      chalk.cyan(`${category}`)
    )
  }
}

async function addOrder(argv) {
  const args = minimist(argv, {
    alias: { amount: 'n' },
    string: ['api'],
    default: { api: API },
  })
  if (args._.length < 1) {
    usage()
    process.exit(1)
  }

  const [id] = args._
  const { amount, api } = args

  if (Number.isInteger(amount) === false) {
    usage('Error: --amount flag is required and must be an integer')
    process.exit(1)
  }

  try {
    await got.post(`${api}/orders/${id}`, {
      json: { amount },
    })
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

function listCats() {
  console.log('Categories:')
  for (const cat of categories) console.log(cat)
  console.log()
}

async function listIds(argv) {
  const args = minimist(argv, {
    alias: { cat: 'c' },
    string: ['cat', 'api'],
    default: { api: API },
  })

  const { cat, api } = args
  if (!cat) {
    usage('Error: --cat flag is required')
    process.exit(1)
  }

  try {
    console.log(`Category: ${cat}`)
    console.log(' IDs:\n')
    const products = await got(`${api}/${cat}`).json()
    for (const { id } of products) {
      console.log(id)
    }
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}
