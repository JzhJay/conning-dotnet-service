# Move this file to /etc/profile.d to make it work on startup
# This script assumes that your conning git key is stored as: ~/.ssh/git_conning
eval `ssh-agent -s`
ssh-add ~/.ssh/git_conning
