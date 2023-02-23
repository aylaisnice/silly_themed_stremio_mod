python3 -m http.server 2006 & K=$! && echo $K &&
flatpak run com.stremio.Stremio --webui-url=http://127.0.0.1:2006
kill $K
