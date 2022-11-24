import usersService from '../../users/services/users.service'
import mongooseService from '../../common/services/mongoose.service'
import debug from 'debug'
import ora from 'ora'
import '@colors/colors'

const log: debug.IDebugger = debug('app:in-memory-bulk-data')

const User = usersService
const users = require('./users.json')

async () => {
  log('Bulk data creation/update script')

  switch (mongooseService.getMongoose().connection.readyState) {
    case 0:
      console.log('MongoDB server disconnected!')
      break
    case 1:
      console.log('MongoDB server connected!')
      break
    case 2:
      console.log('MongoDB server connecting!')
      break
    case 3:
      console.log('MongoDB server disconnecting!')
      break
    case 99:
      console.log('MongoDB server unitialized!')
      break
  }

  console.log('\n  Bulk data creation/update script for impact-factor-wos\n'.cyan.bold)

  const spinner = ora('Initializing bulk data creation/update').start()
  try {
    for (const user of users) {
      spinner.info(`Creating user ${user.email}`)
      const found = await User.getUserByEmail(user.email)
      if (found != null) {
        spinner.info(`User ${user.email} already exist. Updating...`)
        await User.patchById(found._id, user)
        spinner.succeed(`Updated user ${user.email}`)
        continue
      }
      const created = await User.create(user)
      if (!created) {
        throw new Error(`Failed to create user ${user.email}`)
      }
      spinner.succeed(`Created user ${user.email}`)
    }
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
