#!/bin/bash

TARGET_FOLDER="/volume1/docker/Emby/config/metadata/people"

# 复制演员图片到指定文件夹
copyActorImage() {
    # 文件名
    fileName=$(echo $(basename $1) | cut -d . -f1)
    lowerName=${fileName,}
    # 首字母
    firstAlphabet=${lowerName:0:1}
    # 文件夹名
    folderName=${fileName//_/\ }
    # 现在在/usr/local目录下有一个abcd文件夹 然后在/bin目录下面有一个abcd-tmdb-123456 文件夹，用abcd去匹配文件夹首个-前面的相似度如果一致就把abcd里面的东西cp到abcd-tmdb-123456文件夹里面去，如果没有的话就mkdir，用shell写一下

    # 目标路径
    targetFolder=${TARGET_FOLDER}/${firstAlphabet}/${folderName}
    filePath=${targetFolder}/folder.jpg

  
    if [ ! -d "${filePath}" ]; then
        echo ${1}" -----> "${filePath}
        mkdir -p "${targetFolder}" && cp ${1} "${filePath}"
    else
        echo ${filePath}" is existed."
#        rm -rf ${1}
    fi
}

# 遍历.actor文件夹
oldIFS=$IFS
IFS=$'\n'

find / -name '.actors' | while read -r item_folder; do
    for item_file in $(ls "${item_folder}"); do
        copyActorImage ${item_folder}/${item_file}
    done
#    rm -rf ${item_folder}
done

IFS=$oldIFS

echo "Move Finished"
