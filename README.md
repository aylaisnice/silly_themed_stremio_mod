Hiii

I really wanted to theme Stremio but I had no idea how, after some time trying out some ideas, I finally got how:

I downloaded https://app.strem.io/shell-v4.4/ with [httrack](https://www.httrack.com/)

The stream wasn't working, so after some time I found [this](https://github.com/Stremio/stremio-demo-ui), and decided to install all of the dependencies there to this folder

AND IT WORKED

well an error message appears when you start playing something but it doesn't seem to affect anything

so I made this really simple thing here

added this separeted theme.css so you can modify it without having to open this giant thing that blob.css is

and made this run.sh file (for the flatpak linux version) to autostart the ui server and stremio and set it to use it

the only major problem on it is that you gotta actually close stremio to fully close it. if you just end the script the python server just keeps running. i have no bash knowledge so whatever who cares

i also included the theme i am making. it's not finished, so it has some problems (specially on stremio's internal browser, on firefox it was fine), but i think it looks nice

All credits to the creators of [Stremio](https://github.com/Stremio), this is obviously not affiliated with them

I have no idea of what license put in something that's not mine
