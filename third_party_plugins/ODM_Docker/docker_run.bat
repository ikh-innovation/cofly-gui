set arg1=%1
docker run -i --rm -v %arg1%:/datasets opendronemap/odm --project-path /datasets project --fast-orthophoto  --time