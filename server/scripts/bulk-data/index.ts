import usersService from '../../users/services/users.service';
import debug from 'debug';
import ora from 'ora'
import '@colors/colors';

const log: debug.IDebugger = debug("app:in-memory-bulk-data");

const User = usersService;
const users = require('./users.json')

async () => {

    log("Bulk data creation/update script");

    console.log('\n  Bulk data creation/update script for impact-factor-wos\n'.cyan.bold);

    const spinner = ora('Initializing bulk data creation/update').start();
    try {
        for (const user of users) {
            spinner.info(`Creating user ${user.email}`);
            const found = await User.getUserByEmail(user.email);
            if (found) {
                spinner.info(`User ${user.email} already exist. Updating...`);
                await User.patchById(found._id, user);
                spinner.succeed(`Updated user ${user.email}`);
                continue;
            }
            const created = await User.create(user);
            if (!created) {
                throw new Error(`Failed to create user ${user.email}`)
            }
            spinner.succeed(`Created user ${user.email}`);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }


}

