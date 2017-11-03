const baseCode = 'cd public/uiFiles/UIManagement';
module.exports = {
    clone: 'cd public/uiFiles/ && git clone git@git.chinawayltd.com:frontend/UIManagement.git',
    pull: `${baseCode} && git pull origin master`,
} 