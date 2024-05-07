## Mac Setup (.NET)
* Install [.NET Core](https://www.microsoft.com/net/download/core)
* I needed to add a symlink to get `dotnet` to work on the terminal:  [link](https://github.com/dotnet/cli/issues/2544#issuecomment-220248063)
* Install [Visual Studio for Mac](https://www.visualstudio.com/vs/visual-studio-mac/)
* Clone the [kui-web branch of Webvise](https://git.advise-conning.com/projects/AD/repos/advise/browse?at=refs%2Fheads%2Ffeature%2FFeature-WebKui).  
* Start the .NET server by running the solution:  /kui/kui.sln

## Legacy ADVISE on Windows
* Install Parallels
* Clone the [Legacy ADVISE repo](https://git.advise-conning.com/projects/MASON/repos/advise/browse?at=refs%2Fheads%2Ffeature%2FFeature-WebKui)
* Switch to branch WebKui
* Start ADVISE - it should attempt to connect to your .NET server
    * It is expected that the .NET server is on 10.211.55.2
    * It is expected that the K process is on 10.211.55.3

## Setup nginx
* The nginx configuration has changed.  Please reinstall it via /build/scripts/setup-nginx.sh

## Start Webvise
* `yarn`
* `yarn run start:all`
* Navigate to (http://advise.local/ADVISE/kui)  
* Active K sessions should be listed.  


