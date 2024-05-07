export function determineRethinkDbName(gitBranch?: string) {
    let dbName = gitBranch;

    if (!gitBranch) {
        dbName = gitBranch = GIT_BRANCH;
        console.log("Git branch " + gitBranch);
    }

    if (gitBranch.indexOf("Detatched:") === 0)
    {
        console.log("Detected detached head, setting dbName to develop")
        dbName = 'develop';
    }

    // const platform = os.platform();
    //
    // console.log(`Plaform = ${platform}`);

  //  if (platform === 'darwin') { // Mac OS = dev box
		dbName = 'develop';
  //  }

    if (BUILD_USER === 'noahshipley' || BUILD_USER === 'sachs') {
        dbName = 'develop';
    }

    dbName = dbName.replace('remotes/origin/', '');

    dbName = dbName.replace('feature/', '');

    return `WebVISE_${dbName.replace(/\W/g, '')}`; // Only supports A-Za-z0-9_
}
